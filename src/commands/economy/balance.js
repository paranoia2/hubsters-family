import { SlashCommandBuilder } from 'discord.js'
import { db } from '../../utils/jsondb.js'
export default {
  data: new SlashCommandBuilder().setName('balance').setDescription('Баланс').addUserOption(o=>o.setName('user').setDescription('Користувач')),
  async execute(interaction) {
    const u = interaction.options.getUser('user') || interaction.user
    const bal = db.econGet(u.id)
    await interaction.reply(`💰 Баланс ${u.tag}: ${bal}₵`)
  }
}
