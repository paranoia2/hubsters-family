import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
export const data = new SlashCommandBuilder().setName('ping').setDescription('🏓 Pong');
export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.reply({ content: '🏓 Pong!', ephemeral: true });
}
