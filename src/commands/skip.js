import { SlashCommandBuilder } from 'discord.js'; import { music } from '../music/queue.js';
export default { data:new SlashCommandBuilder().setName('skip').setDescription('Пропустити трек'),
async execute(interaction){ music.skip(interaction.guild.id); await interaction.reply('⏭️ Пропущено'); } };
