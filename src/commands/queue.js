import { SlashCommandBuilder } from 'discord.js'; import { music } from '../music/queue.js';
export default { data:new SlashCommandBuilder().setName('queue').setDescription('Показати чергу'),
async execute(interaction){ const q=music.getQueue(interaction.guild.id); const list=q.list.map((s,i)=>`${i+1}. ${s.title}`).join('\n')||'Порожньо'; await interaction.reply(`🎶 Зараз: **${q.current?q.current.title:'нічого'}**\n\nЧерга:\n${list}`); } };
