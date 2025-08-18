import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { pause } from '../utils/player.js';
export const data = new SlashCommandBuilder().setName('pause').setDescription('⏸ Пауза');
export async function execute(interaction: CommandInteraction) {
  const ok = pause(interaction.guildId!);
  if (!ok) return interaction.reply({ content: '❌ Нічого не грає', ephemeral: true });
  await interaction.reply('⏸ Пауза');
}
