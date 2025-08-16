import { Events, ActivityType } from 'discord.js';
export default {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`✅ Запущено як ${client.user.tag}`);
    client.user.setActivity('/play | Hubsters Family', { type: ActivityType.Listening });
  }
};
