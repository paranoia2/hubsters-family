import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js'
export default {
  data: new SlashCommandBuilder().setName('ban').setDescription('Бан учасника').addUserOption(o=>o.setName('user').setDescription('Кого забанити').setRequired(true)).addStringOption(o=>o.setName('reason').setDescription('Причина')).setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('user')
    const reason = interaction.options.getString('reason') || 'No reason'
    await interaction.guild.members.ban(user.id, { reason })
    await interaction.reply(`🔨 Забанено: ${user.tag} | Причина: ${reason}`)
  }
}
