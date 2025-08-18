import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
export const data = new SlashCommandBuilder().setName('roll').setDescription('Кидок кубика').addIntegerOption(o=>o.setName('max').setDescription('Максимум').setRequired(true));
export async function execute(interaction: CommandInteraction) {
  const max = interaction.options.getInteger('max', true);
  const num = Math.floor(Math.random()*max)+1;
  await interaction.reply(`🎲 Випало: ${num}`);
}
