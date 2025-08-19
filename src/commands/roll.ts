import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
export const data = new SlashCommandBuilder().setName('roll').setDescription('Кидок кубика').addIntegerOption(o=>o.setName('max').setDescription('Максимум').setRequired(true));
export async function execute(interaction: ChatInputCommandInteraction) {
  const max = interaction.options.getInteger('max', true);
  await interaction.reply({ content: `🎲 ${Math.floor(Math.random()*max)+1}` });
}
