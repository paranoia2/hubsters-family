import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
export default { data:new SlashCommandBuilder().setName('addrole').setDescription('Додати роль користувачу')
.addUserOption(o=>o.setName('user').setDescription('Кому').setRequired(true))
.addRoleOption(o=>o.setName('role').setDescription('Яку').setRequired(true))
.setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
async execute(interaction){ const m=await interaction.guild.members.fetch(interaction.options.getUser('user',true).id); const role=interaction.options.getRole('role',true); await m.roles.add(role); await interaction.reply(`✅ Додано роль **${role.name}** для <@${m.id}>`);} };
