import { SlashCommandBuilder } from 'discord.js'
import { enqueue, getQueue } from '../../utils/music.js'

export default {
  data: new SlashCommandBuilder().setName('play').setDescription('Програти трек/плейлист').addStringOption(o=>o.setName('query').setDescription('Назва або посилання').setRequired(true)),
  async execute(interaction) {
    const q = interaction.options.getString('query')
    await interaction.deferReply()
    try {
      const ctx = await enqueue(interaction, q)
      const { now, queue } = getQueue(interaction.guildId)
      await interaction.editReply(`▶️ Додано до черги. Зараз грає: **${now?.title || queue[0]?.title || 'скоро'}**`)
    } catch (e) {
      await interaction.editReply('❌ ' + e.message)
    }
  }
}
