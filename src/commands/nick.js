import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
export default { data:new SlashCommandBuilder().setName('nick').setDescription('Змінити нік користувача')
.addUserOption(o=>o.setName('user').setDescription('Кому').setRequired(true))
.addStringOption(o=>o.setName('nickname').setDescription('Новий нік').setRequired(true))
.setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),
async execute(interaction){ const m=await interaction.guild.members.fetch(interaction.options.getUser('user',true).id); const nick=interaction.options.getString('nickname',true); await m.setNickname(nick).catch(()=>{}); await interaction.reply(`✏️ Нік <@${m.id}> змінено на **${nick}**`);} };
