import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
export default { data:new SlashCommandBuilder().setName('untimeout').setDescription('Зняти таймаут')
.addUserOption(o=>o.setName('user').setDescription('Кому').setRequired(true))
.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
async execute(interaction){ const m=await interaction.guild.members.fetch(interaction.options.getUser('user',true).id).catch(()=>null); if(!m) return interaction.reply({content:'⚠️ Не знайдено',ephemeral:true}); await m.timeout(null); await interaction.reply(`✅ Знято таймаут з ${m.user.tag}`);} };
