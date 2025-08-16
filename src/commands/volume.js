import { SlashCommandBuilder } from 'discord.js'; import { music } from '../music/queue.js';
export default { data:new SlashCommandBuilder().setName('volume').setDescription('Гучність 0-200%')
.addIntegerOption(o=>o.setName('percent').setDescription('0..200').setMinValue(0).setMaxValue(200).setRequired(true)),
async execute(interaction){ const p=interaction.options.getInteger('percent',true); const vol=Math.max(0,Math.min(2,p/100)); music.setVolume(interaction.guild.id,vol); await interaction.reply(`🔊 Гучність: ${p}%`); } };
