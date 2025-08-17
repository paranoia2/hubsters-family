import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js'
import { db } from '../../utils/jsondb.js'
export default {
  data: new SlashCommandBuilder().setName('welcome').setDescription('Налаштувати вітальний канал')
    .addSubcommand(s=>s.setName('set').setDescription('Встановити канал').addChannelOption(o=>o.setName('channel').setDescription('Канал').setRequired(true)))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    const ch = interaction.options.getChannel('channel')
    db.set('welcomeChannelId', ch.id)
    await interaction.reply(`👋 Вітальний канал: ${ch}`)
  }
}
