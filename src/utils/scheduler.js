
import fs from 'fs/promises';
import path from 'path';
import cron from 'node-cron';

const DATA_PATH = path.resolve(process.cwd(), 'src', 'data');
const FILE = path.join(DATA_PATH, 'automessages.json');

let schedules = [];
let jobs = new Map();

function ensureDirExists() {
  return fs.mkdir(DATA_PATH, { recursive: true }).catch(() => {});
}

export async function loadSchedules(client) {
  await ensureDirExists();
  try {
    const raw = await fs.readFile(FILE, 'utf8');
    schedules = JSON.parse(raw);
  } catch {
    schedules = [];
  }
  // start jobs
  for (const s of schedules) startJob(client, s);
}

function startJob(client, s) {
  stopJob(s.id);
  // time: "HH:MM" -> cron "m h * * *"
  const [hh, mm] = s.time.split(':').map(v => parseInt(v, 10));
  if (Number.isNaN(hh) || Number.isNaN(mm)) return;
  const expr = `${mm} ${hh} * * *`;
  const job = cron.schedule(expr, async () => {
    try {
      const guild = client.guilds.cache.get(s.guildId) || await client.guilds.fetch(s.guildId).catch(() => null);
      if (!guild) return;
      const channel = guild.channels.cache.get(s.channelId) || await guild.channels.fetch(s.channelId).catch(() => null);
      if (!channel || !channel.isTextBased()) return;
      await channel.send(s.text);
    } catch (e) {
      console.error('AutoMessage job error:', e);
    }
  }, { timezone: process.env.TZ || 'UTC' });
  jobs.set(s.id, job);
}

function stopJob(id) {
  const job = jobs.get(id);
  if (job) job.stop();
  jobs.delete(id);
}

function save() {
  return ensureDirExists().then(() => fs.writeFile(FILE, JSON.stringify(schedules, null, 2), 'utf8'));
}

function genId() {
  return Math.random().toString(36).slice(2, 8);
}

export async function addSchedule(client, s) {
  const id = genId();
  const rec = { id, ...s };
  schedules.push(rec);
  await save();
  startJob(client, rec);
  return rec;
}

export async function listSchedules(guildId) {
  return schedules.filter(x => x.guildId === guildId);
}

export async function removeSchedule(id, guildId) {
  const idx = schedules.findIndex(x => x.id === id && x.guildId === guildId);
  if (idx === -1) return false;
  const [rec] = schedules.splice(idx, 1);
  stopJob(rec.id);
  await save();
  return true;
}
