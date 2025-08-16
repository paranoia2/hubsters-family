import { Events, EmbedBuilder } from 'discord.js';
export default {
  name: Events.GuildMemberAdd,
  async execute(member) {
    const chId = process.env.WELCOME_CHANNEL_ID;
    if (!chId) return;
    const ch = member.guild.channels.cache.get(chId);
    if (!ch) return;
    const emb = new EmbedBuilder()
      .setTitle('👋 Ласкаво просимо!')
      .setDescription(`Вітаємо, ${member}!`)
      .setTimestamp();
    ch.send({ embeds: [emb] }).catch(()=>{});
  }
};
