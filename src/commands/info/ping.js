import { SlashCommandBuilder } from 'discord.js'
export default {
  data: new SlashCommandBuilder().setName('ping').setDescription('Перевірка бота'),
  async execute(interaction) {
    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true })
    const latency = sent.createdTimestamp - interaction.createdTimestamp
    await interaction.editReply(`🏓 Pong! Latency: ${latency}ms`)
  }
}
