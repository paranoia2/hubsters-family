import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
export default { data:new SlashCommandBuilder().setName('unban').setDescription('Розбан за ID')
.addStringOption(o=>o.setName('user_id').setDescription('ID користувача').setRequired(true))
.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
async execute(interaction){ const id=interaction.options.getString('user_id',true); await interaction.guild.bans.remove(id).then(()=>interaction.reply(`✅ Розбанено <@${id}>`)).catch(()=>interaction.reply({content:'⚠️ Не вдалось', ephemeral:true})); } };
