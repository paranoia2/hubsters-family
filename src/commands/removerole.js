import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
export default { data:new SlashCommandBuilder().setName('removerole').setDescription('Забрати роль')
.addUserOption(o=>o.setName('user').setDescription('У кого').setRequired(true))
.addRoleOption(o=>o.setName('role').setDescription('Яку').setRequired(true))
.setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
async execute(interaction){ const m=await interaction.guild.members.fetch(interaction.options.getUser('user',true).id); const role=interaction.options.getRole('role',true); await m.roles.remove(role); await interaction.reply(`🗑️ Забрано роль **${role.name}** у <@${m.id}>`);} };
