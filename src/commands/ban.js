import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
export default { data: new SlashCommandBuilder().setName('ban').setDescription('Бан користувача')
.addUserOption(o=>o.setName('user').setDescription('Кого').setRequired(true))
.addStringOption(o=>o.setName('reason').setDescription('Причина'))
.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
async execute(interaction){ const user=interaction.options.getUser('user',true); const member=await interaction.guild.members.fetch(user.id).catch(()=>null); if(!member) return interaction.reply({content:'⚠️ Немає на сервері', ephemeral:true}); await member.ban({reason:interaction.options.getString('reason')||'No reason'}); await interaction.reply(`🔨 Заблоковано ${user.tag}`);} };
