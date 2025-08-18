import Database from 'better-sqlite3';
import path from 'path';
const db = new Database(path.join(process.cwd(), 'database.sqlite'));

// create tables
db.prepare(`
  CREATE TABLE IF NOT EXISTS guild_settings (
    guild_id TEXT PRIMARY KEY,
    birthday_channel_id TEXT
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS birthdays (
    user_id TEXT,
    guild_id TEXT,
    birthday TEXT,
    PRIMARY KEY(user_id, guild_id)
  )
`).run();

export function setBirthday(userId: string, guildId: string, date: string) {
  db.prepare('INSERT OR REPLACE INTO birthdays (user_id, guild_id, birthday) VALUES (?, ?, ?)').run(userId, guildId, date);
}

export function getBirthday(userId: string, guildId: string) {
  return db.prepare('SELECT birthday FROM birthdays WHERE user_id = ? AND guild_id = ?').get(userId, guildId);
}

export function getAllBirthdays(guildId: string) {
  return db.prepare('SELECT * FROM birthdays WHERE guild_id = ?').all(guildId);
}

export function removeBirthday(userId: string, guildId: string) {
  db.prepare('DELETE FROM birthdays WHERE user_id = ? AND guild_id = ?').run(userId, guildId);
}

export function setGuildBirthdayChannel(guildId: string, channelId: string) {
  db.prepare('INSERT OR REPLACE INTO guild_settings (guild_id, birthday_channel_id) VALUES (?, ?)').run(guildId, channelId);
}

export function getGuildBirthdayChannel(guildId: string) {
  return db.prepare('SELECT birthday_channel_id FROM guild_settings WHERE guild_id = ?').get(guildId);
}

export default db;
