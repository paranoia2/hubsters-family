import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Перевірка відповіді бота'),
  async execute(interaction) {
    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
    await interaction.editReply(`🏓 Pong! Затримка: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
  }
};
