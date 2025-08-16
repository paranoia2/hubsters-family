import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
export default { data:new SlashCommandBuilder().setName('slowmode').setDescription('Слоумод у каналі')
.addIntegerOption(o=>o.setName('seconds').setDescription('0..21600').setMinValue(0).setMaxValue(21600).setRequired(true))
.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
async execute(interaction){ const secs=interaction.options.getInteger('seconds',true); await interaction.channel.setRateLimitPerUser(secs).catch(()=>{}); await interaction.reply(`🐢 Slowmode: ${secs}s`);} };
