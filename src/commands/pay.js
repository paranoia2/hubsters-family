import { SlashCommandBuilder } from 'discord.js'
import { db } from '../../utils/jsondb.js'
export default {
  data: new SlashCommandBuilder().setName('pay').setDescription('Передати монети').addUserOption(o=>o.setName('to').setDescription('Кому').setRequired(true)).addIntegerOption(o=>o.setName('amount').setDescription('Скільки').setRequired(true)),
  async execute(interaction) {
    const to = interaction.options.getUser('to')
    const amount = interaction.options.getInteger('amount')
    if (amount <= 0) return interaction.reply({ content:'Сума має бути > 0', ephemeral:true })
    const fromId = interaction.user.id
    const fromBal = db.econGet(fromId)
    if (fromBal < amount) return interaction.reply({ content:'Недостатньо коштів.', ephemeral:true })
    db.econSet(fromId, fromBal - amount)
    db.econAdd(to.id, amount)
    await interaction.reply(`🤝 ${interaction.user.tag} → ${to.tag}: ${amount}₵`)
  }
}
