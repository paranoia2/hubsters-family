import { SlashCommandBuilder, ChatInputCommandInteraction, ChannelType } from 'discord.js';
import { addNewsFeed } from '../utils/db.js';
export const data = new SlashCommandBuilder().setName('news-add').setDescription('Add RSS feed').addStringOption(o=>o.setName('url').setDescription('Feed URL').setRequired(true)).addChannelOption(o=>o.setName('channel').setDescription('Channel').addChannelTypes(ChannelType.GuildText).setRequired(true));
export async function execute(interaction: ChatInputCommandInteraction) {
  const url = interaction.options.getString('url', true);
  const channel = interaction.options.getChannel('channel', true);
  addNewsFeed(interaction.guildId!, (channel as any).id, url);
  await interaction.reply({ content:'✅ Added', ephemeral:true });
}
