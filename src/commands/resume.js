import { SlashCommandBuilder } from 'discord.js'; import { music } from '../music/queue.js';
export default { data:new SlashCommandBuilder().setName('resume').setDescription('Продовжити'),
async execute(interaction){ music.resume(interaction.guild.id); await interaction.reply('▶️ Продовжено'); } };
