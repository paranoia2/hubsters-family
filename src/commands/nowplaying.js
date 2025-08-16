import { SlashCommandBuilder } from 'discord.js'; import { music } from '../music/queue.js';
export default { data:new SlashCommandBuilder().setName('nowplaying').setDescription('Що зараз грає'),
async execute(interaction){ const q=music.getQueue(interaction.guild.id); await interaction.reply(`🎵 Зараз: **${q.current?q.current.title:'нічого'}**`); } };
