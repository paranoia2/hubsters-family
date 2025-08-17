import { SlashCommandBuilder } from 'discord.js'
export default {
  data: new SlashCommandBuilder().setName('coinflip').setDescription('Підкинути монетку'),
  async execute(interaction) {
    const res = Math.random()<0.5 ? 'Орел' : 'Решка'
    await interaction.reply(`🪙 ${res}`)
  }
}
