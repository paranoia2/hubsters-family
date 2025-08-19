import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
export const data = new SlashCommandBuilder().setName('coinflip').setDescription('Орел чи решка');
export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.reply({ content: Math.random()<0.5? 'Орел':'Решка' });
}
