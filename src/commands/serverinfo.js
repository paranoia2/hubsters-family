import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
export default { data: new SlashCommandBuilder().setName('serverinfo').setDescription('Інформація про сервер'),
async execute(interaction){ const g=interaction.guild; const emb=new EmbedBuilder().setTitle(`ℹ️ ${g.name}`).addFields(
{ name:'ID', value:g.id, inline:true },
{ name:'Учасників', value:String(g.memberCount), inline:true },
{ name:'Створено', value:`<t:${Math.floor(g.createdTimestamp/1000)}:R>`, inline:true }
).setThumbnail(g.iconURL()).setTimestamp(); await interaction.reply({ embeds:[emb]}); } };
