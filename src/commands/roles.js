import { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
export default {
  data: new SlashCommandBuilder().setName('roles').setDescription('Self-roles: пост з кнопками')
    .addRoleOption(o=>o.setName('role1').setDescription('Роль 1').setRequired(true))
    .addRoleOption(o=>o.setName('role2').setDescription('Роль 2').setRequired(false))
    .addRoleOption(o=>o.setName('role3').setDescription('Роль 3').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  async execute(interaction){
    const roles = ['role1','role2','role3'].map(n=>interaction.options.getRole(n)).filter(Boolean);
    const rows = new ActionRowBuilder().addComponents(roles.map(r=> new ButtonBuilder().setCustomId('selfrole:'+r.id).setLabel(r.name).setStyle(ButtonStyle.Secondary)));
    await interaction.reply({ content: '✅ Створено пост з кнопками.', ephemeral: true });
    await interaction.channel.send({ content: 'Натисни, щоб отримати/зняти роль:', components: [rows] });
  }
};
