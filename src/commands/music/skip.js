import { SlashCommandBuilder } from 'discord.js'
import { skip } from '../../utils/music.js'
export default {
  data: new SlashCommandBuilder().setName('skip').setDescription('Наступний трек'),
  async execute(interaction) {
    const ok = skip(interaction.guildId)
    await interaction.reply(ok ? '⏭ Пропущено.' : 'Немає що пропускати.')
  }
}
