import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
export default { data:new SlashCommandBuilder().setName('unlock').setDescription('Розблокувати канал')
.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
async execute(interaction){ const everyone=interaction.guild.roles.everyone; await interaction.channel.permissionOverwrites.edit(everyone,{SendMessages:null}); await interaction.reply('🔓 Канал розблоковано'); } };
