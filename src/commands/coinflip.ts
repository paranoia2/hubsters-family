import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
export const data = new SlashCommandBuilder().setName('coinflip').setDescription('Орел чи решка');
export async function execute(interaction: CommandInteraction) {
  const r = Math.random()<0.5? 'Орел':'Решка';
  await interaction.reply(`🪙 Результат: ${r}`);
}
