import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
const jokes = ['Жарт 1','Жарт 2','Жарт 3'];
export const data = new SlashCommandBuilder().setName('joke').setDescription('Анекдот');
export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.reply({ content: jokes[Math.floor(Math.random()*jokes.length)] });
}
