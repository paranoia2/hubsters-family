import { SlashCommandBuilder } from 'discord.js'
import { db } from '../../utils/jsondb.js'
export default {
  data: new SlashCommandBuilder().setName('work').setDescription('Піти на роботу (кд 5хв)'),
  async execute(interaction) {
    const uid = interaction.user.id
    const key = `work_${uid}`
    const now = Date.now()
    const cooldowns = db.get('cooldowns') || {}
    const last = cooldowns[key] || 0
    const cd = 5*60*1000
    if (now - last < cd) {
      const m = Math.ceil((cd - (now-last))/60000)
      return interaction.reply({ content: `⏳ Повернись через ~${m} хв.`, ephemeral:true })
    }
    const earn = Math.floor(50 + Math.random()*150)
    db.econAdd(uid, earn)
    cooldowns[key] = now; db.set('cooldowns', cooldowns)
    await interaction.reply(`🛠 Ти попрацював і заробив +${earn}₵`)
  }
}
