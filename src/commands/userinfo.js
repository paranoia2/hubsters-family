import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
export default { data: new SlashCommandBuilder().setName('userinfo').setDescription('Інформація про користувача')
.addUserOption(o=>o.setName('user').setDescription('Користувач')),
async execute(interaction){ const u=interaction.options.getUser('user')||interaction.user; const m=await interaction.guild.members.fetch(u.id).catch(()=>null); const emb=new EmbedBuilder().setTitle(`👤 ${u.tag}`)
.addFields({name:'ID', value:u.id, inline:true},{name:'Створено', value:`<t:${Math.floor(u.createdTimestamp/1000)}:R>`, inline:true},{name:'Приєднався', value:m?`<t:${Math.floor(m.joinedTimestamp/1000)}:R>`:'—', inline:true}).setThumbnail(u.displayAvatarURL()).setTimestamp(); await interaction.reply({embeds:[emb]}); } };
