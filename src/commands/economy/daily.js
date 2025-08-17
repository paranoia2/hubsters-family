import { SlashCommandBuilder } from 'discord.js'
import { db } from '../../utils/jsondb.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const cooldownFile = path.join(__dirname, '..', '..', '..', 'data', 'daily.json')

function getData() {
  try {
    return JSON.parse(fs.readFileSync(cooldownFile, 'utf8'))
  } catch { return {} }
}
function setData(d) { fs.writeFileSync(cooldownFile, JSON.stringify(d, null, 2)) }

export default {
  data: new SlashCommandBuilder().setName('daily').setDescription('Щоденний бонус'),
  async execute(interaction) {
    const uid = interaction.user.id
    const d = getData()
    const now = Date.now()
    const last = d[uid] || 0
    if (now - last < 24*60*60*1000) {
      const hrs = Math.ceil((24*60*60*1000 - (now-last)) / 3600000)
      return interaction.reply({ content: `⏳ Забери бонус через ~${hrs} год.`, ephemeral: true })
    }
    const reward = 250
    db.econAdd(uid, reward)
    d[uid] = now; setData(d)
    await interaction.reply(`🎁 Твій щоденний бонус: +${reward}₵`)
  }
}
