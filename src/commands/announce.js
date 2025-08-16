import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
export default { data:new SlashCommandBuilder().setName('announce').setDescription('Оголошення (embed)')
.addStringOption(o=>o.setName('title').setDescription('Заголовок').setRequired(true))
.addStringOption(o=>o.setName('message').setDescription('Текст').setRequired(true))
.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
async execute(interaction){ const title=interaction.options.getString('title',true); const message=interaction.options.getString('message',true); const emb=new EmbedBuilder().setTitle(title).setDescription(message).setTimestamp(); await interaction.reply({content:'✅',ephemeral:true}); await interaction.channel.send({embeds:[emb]}); } };
