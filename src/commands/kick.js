import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js'
export default {
  data: new SlashCommandBuilder().setName('kick').setDescription('Кік учасника').addUserOption(o=>o.setName('user').setDescription('Кого кікнути').setRequired(true)).setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(interaction) {
    const member = interaction.options.getMember('user')
    if (!member) return interaction.reply({ content:'Не знайшов учасника.', ephemeral:true })
    await member.kick('Kicked by command')
    await interaction.reply(`👢 Кікнуто: ${member.user.tag}`)
  }
}
