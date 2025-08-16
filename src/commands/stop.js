import { SlashCommandBuilder } from 'discord.js'; import { music } from '../music/queue.js';
export default { data:new SlashCommandBuilder().setName('stop').setDescription('Зупинити музику'),
async execute(interaction){ music.stop(interaction.guild.id); await interaction.reply('⏹️ Зупинено'); } };
