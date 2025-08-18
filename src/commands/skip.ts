import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { skip } from '../utils/player.js';
export const data = new SlashCommandBuilder().setName('skip').setDescription('⏭ Пропустити трек');
export async function execute(interaction: CommandInteraction) {
  const ok = skip(interaction.guildId!);
  if (!ok) return interaction.reply({ content: '❌ Нічого не грає', ephemeral: true });
  await interaction.reply('⏭ Пропущено');
}
