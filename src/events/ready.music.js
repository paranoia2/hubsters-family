
import { Events } from 'discord.js';
import { initMusic } from '../music/distube.js';
import { loadSchedules } from '../utils/scheduler.js';

export default {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log(`✅ Logged in as ${client.user.tag}`);
    // init music
    initMusic(client);
    // init scheduler (auto messages)
    await loadSchedules(client);
  }
};
