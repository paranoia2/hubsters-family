import { SlashCommandBuilder } from 'discord.js'
import { db } from '../../utils/jsondb.js'
export default {
  data: new SlashCommandBuilder().setName('leaderboard').setDescription('Топ за балансом'),
  async execute(interaction) {
    const econ = db.get('economy') || {}
    const arr = Object.entries(econ).sort((a,b)=>b[1]-a[1]).slice(0,10)
    if (!arr.length) return interaction.reply('Поки немає даних.')
    const lines = await Promise.all(arr.map(async ([id,bal],i)=>{
      const u = await interaction.client.users.fetch(id).catch(()=>null)
      return `#${i+1} • ${u?u.tag:id} — ${bal}₵`
    }))
    await interaction.reply(lines.join('\n'))
  }
}
