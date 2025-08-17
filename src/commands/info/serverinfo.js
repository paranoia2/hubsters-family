import { SlashCommandBuilder } from 'discord.js'
export default {
  data: new SlashCommandBuilder().setName('serverinfo').setDescription('Інформація про сервер'),
  async execute(interaction) {
    const g = interaction.guild
    await interaction.reply(`**${g.name}** | 👥 ${g.memberCount} учасників | 🆔 ${g.id}`)
  }
}
