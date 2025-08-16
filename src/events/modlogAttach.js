import { Events, EmbedBuilder } from 'discord.js';
import { getDb } from '../utils/jsondb.js';

export default {
  name: Events.ClientReady,
  once: true,
  async execute(client){
    const db = getDb('config'); await db.read(); const cfg = db.JSON() || {};
    function getChannel(gid){ const id = cfg[gid]?.modlog; if(!id) return null; return client.channels.cache.get(id); }

    client.on(Events.GuildBanAdd, async (ban) => {
      const ch = getChannel(ban.guild.id); if(!ch) return;
      const emb = new EmbedBuilder().setTitle('🔨 Бан').setDescription(`${ban.user.tag} (${ban.user.id})`).setTimestamp();
      ch.send({ embeds: [emb] });
    });

    client.on(Events.GuildBanRemove, async (ban) => {
      const ch = getChannel(ban.guild.id); if(!ch) return;
      const emb = new EmbedBuilder().setTitle('♻️ Розбан').setDescription(`${ban.user.tag} (${ban.user.id})`).setTimestamp();
      ch.send({ embeds: [emb] });
    });

    client.on(Events.MessageBulkDelete, async (msgs) => {
      const ch = getChannel(msgs.first()?.guildId); if(!ch) return;
      const emb = new EmbedBuilder().setTitle('🧹 Bulk delete').setDescription(`${msgs.size} повідомлень`).setTimestamp();
      ch.send({ embeds: [emb] });
    });

    client.on(Events.GuildMemberUpdate, async (oldM, newM) => {
      const ch = getChannel(newM.guild.id); if(!ch) return;
      if (oldM.communicationDisabledUntilTimestamp !== newM.communicationDisabledUntilTimestamp) {
        const t = newM.communicationDisabledUntilTimestamp ? '⏳ Таймаут' : '✅ Знято таймаут';
        const emb = new EmbedBuilder().setTitle(t).setDescription(`${newM.user.tag}`).setTimestamp();
        ch.send({ embeds: [emb] });
      }
    });
  }
};
