import { SlashCommandBuilder } from 'discord.js'
export default {
  data: new SlashCommandBuilder().setName('dice').setDescription('Кинути кістку d6'),
  async execute(interaction) {
    const n = 1+Math.floor(Math.random()*6)
    await interaction.reply(`🎲 Випало: **${n}**`)
  }
}
