import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { getDistube } from '../utils/distube.js';

export const data = new SlashCommandBuilder().setName('queue').setDescription('📜 Показати чергу');

export async function execute(interaction: CommandInteraction) {
  const distube = getDistube();
  const queue = distube.getQueue(interaction.guildId);
  if (!queue) return interaction.reply({ content: '❌ Немає черги', ephemeral: true });

  const embed = new EmbedBuilder()
    .setTitle('Черга')
    .setDescription(queue.songs.map((s:any, i:number) => `${i+1}. ${s.name} (${s.formattedDuration})`).slice(0, 10).join('\n'));

  await interaction.reply({ embeds: [embed] });
}
