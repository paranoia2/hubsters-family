import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
function parseMs(s){ const m=s.match(/^(\d+)(s|m|h|d)$/i); if(!m) return null; const n=parseInt(m[1]); const u=m[2].toLowerCase(); return u==='s'?n*1000:u==='m'?n*60000:u==='h'?n*3600000:n*86400000; }
export default { data:new SlashCommandBuilder().setName('timeout').setDescription('Таймаут учасника')
.addUserOption(o=>o.setName('user').setDescription('Кому').setRequired(true))
.addStringOption(o=>o.setName('duration').setDescription('10m,1h,1d').setRequired(true))
.addStringOption(o=>o.setName('reason').setDescription('Причина'))
.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
async execute(interaction){ const m=await interaction.guild.members.fetch(interaction.options.getUser('user',true).id).catch(()=>null); if(!m) return interaction.reply({content:'⚠️ Не знайдено',ephemeral:true}); const ms=parseMs(interaction.options.getString('duration',true)); if(!ms) return interaction.reply({content:'⚠️ Невірна тривалість',ephemeral:true}); await m.timeout(ms, interaction.options.getString('reason')||'timeout'); await interaction.reply(`⏳ Таймаут для ${m.user.tag}`);} };
