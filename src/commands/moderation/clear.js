import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js'
export default {
  data: new SlashCommandBuilder().setName('clear').setDescription('Очистити повідомлення').addIntegerOption(o=>o.setName('amount').setDescription('К-сть 1-100').setRequired(true)).setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    const amount = interaction.options.getInteger('amount')
    if (amount < 1 || amount > 100) return interaction.reply({ content:'Вкажи 1-100.', ephemeral:true })
    const ch = interaction.channel
    const msgs = await ch.bulkDelete(amount, true)
    await interaction.reply(`🧹 Видалено ${msgs.size} повідомлень.`)
  }
}
