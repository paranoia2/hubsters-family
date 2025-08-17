import { SlashCommandBuilder } from 'discord.js'
import { getQueue } from '../../utils/music.js'
export default {
  data: new SlashCommandBuilder().setName('queue').setDescription('Черга відтворення'),
  async execute(interaction) {
    const { now, queue } = getQueue(interaction.guildId)
    const lines = []
    if (now) lines.push(`🎶 **Зараз:** ${now.title}`)
    if (queue.length) lines.push(...queue.map((t,i)=>`${i+1}. ${t.title}`))
    await interaction.reply(lines.length ? lines.join('\n') : 'Черга порожня.')
  }
}
