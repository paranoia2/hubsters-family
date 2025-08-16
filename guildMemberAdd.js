import { Events, EmbedBuilder } from 'discord.js';

export default {
  name: Events.GuildMemberAdd,
  once: false,
  async execute(member) {
    const channelId = process.env.WELCOME_CHANNEL_ID;
    if (!channelId) return;
    const channel = member.guild.channels.cache.get(channelId);
    if (!channel) return;
    const embed = new EmbedBuilder()
      .setTitle('👋 Ласкаво просимо!')
      .setDescription(`Вітаємо, ${member}! Ти приєднався до **Hubsters Family**.`)
      .setTimestamp();
    channel.send({ embeds: [embed] }).catch(() => {});
  }
};
