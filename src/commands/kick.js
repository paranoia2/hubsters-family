import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
export default { data:new SlashCommandBuilder().setName('kick').setDescription('Кік користувача')
.addUserOption(o=>o.setName('user').setDescription('Кого').setRequired(true))
.addStringOption(o=>o.setName('reason').setDescription('Причина'))
.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
async execute(interaction){ const user=interaction.options.getUser('user',true); const m=await interaction.guild.members.fetch(user.id).catch(()=>null); if(!m) return interaction.reply({content:'⚠️ Не знайдено', ephemeral:true}); await m.kick(interaction.options.getString('reason')||'No reason'); await interaction.reply(`👢 Вигнано ${user.tag}`);} };
