import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { getQueue } from '../utils/player.js';
export const data = new SlashCommandBuilder().setName('queue').setDescription('📜 Показати чергу');
export async function execute(interaction: CommandInteraction) {
  const q = getQueue(interaction.guildId!);
  if (!q || !q.length) return interaction.reply({ content: '❌ Немає черги', ephemeral: true });
  const embed = new EmbedBuilder().setTitle('Черга').setDescription(q.map((s:any,i:number)=>`${i+1}. ${s.title||s.url} (${s.duration||'N/A'})`).slice(0,10).join('\n'));
  await interaction.reply({ embeds: [embed] });
}
