import { SlashCommandBuilder } from 'discord.js'
import { stop } from '../../utils/music.js'
export default {
  data: new SlashCommandBuilder().setName('stop').setDescription('Зупинити музику'),
  async execute(interaction) {
    const ok = stop(interaction.guildId)
    await interaction.reply(ok ? '⏹ Зупинено та вийшов з каналу.' : 'Немає активного плеєра.')
  }
}
