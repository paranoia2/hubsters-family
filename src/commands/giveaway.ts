import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
export const data = new SlashCommandBuilder().setName('giveaway').setDescription('🎁 Розіграші').addStringOption(o=>o.setName('note').setDescription('Примітка'));
export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.reply({ content: '🎁 Розіграш запущено (базово)', ephemeral: true });
}
