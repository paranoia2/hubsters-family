import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { stop } from '../utils/player.js';
export const data = new SlashCommandBuilder().setName('stop').setDescription('⏹ Зупинити музику');
export async function execute(interaction: CommandInteraction) {
  const ok = stop(interaction.guildId!);
  if (!ok) return interaction.reply({ content: '❌ Нічого не грає', ephemeral: true });
  await interaction.reply('⏹ Зупинено');
}
