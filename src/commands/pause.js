import { SlashCommandBuilder } from 'discord.js'; import { music } from '../music/queue.js';
export default { data:new SlashCommandBuilder().setName('pause').setDescription('Пауза'),
async execute(interaction){ music.pause(interaction.guild.id); await interaction.reply('⏸️ Пауза'); } };
