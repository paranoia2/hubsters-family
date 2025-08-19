import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { listNewsFeeds } from '../utils/db.js';
export const data = new SlashCommandBuilder().setName('news-list').setDescription('List RSS feeds');
export async function execute(interaction: ChatInputCommandInteraction) {
  const rows = listNewsFeeds(interaction.guildId!);
  if (!rows.length) return interaction.reply({ content:'No feeds', ephemeral:true });
  await interaction.reply({ content: rows.map(r=>`ID:${r.id} ${r.feed_url} -> <#${r.channel_id}>`).join('\n'), ephemeral:true });
}
