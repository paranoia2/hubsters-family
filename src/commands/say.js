import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
export default { data:new SlashCommandBuilder().setName('say').setDescription('Сказати від імені бота')
.addStringOption(o=>o.setName('text').setDescription('Текст').setRequired(true))
.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
async execute(interaction){ const text=interaction.options.getString('text',true); await interaction.reply({content:'✅', ephemeral:true}); await interaction.channel.send(text); } };
