import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { getDistube } from '../utils/distube.js';

export const data = new SlashCommandBuilder().setName('stop').setDescription('⏹ Зупинити музику');

export async function execute(interaction: CommandInteraction) {
  const distube = getDistube();
  const queue = distube.getQueue(interaction.guildId);
  if (!queue) return interaction.reply({ content: '❌ Нічого не грає', ephemeral: true });
  queue.stop();
  await interaction.reply('⏹ Зупинено');
}
