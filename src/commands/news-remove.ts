import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { removeNewsFeed } from '../utils/db.js';
export const data = new SlashCommandBuilder().setName('news-remove').setDescription('Remove feed').addIntegerOption(o=>o.setName('id').setDescription('feed id').setRequired(true));
export async function execute(interaction: ChatInputCommandInteraction) {
  const id = interaction.options.getInteger('id', true);
  removeNewsFeed(id);
  await interaction.reply({ content:'✅ Removed', ephemeral:true });
}
