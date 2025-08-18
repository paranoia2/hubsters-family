import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { getDistube } from '../utils/distube.js';

export const data = new SlashCommandBuilder().setName('skip').setDescription('⏭️ Пропустити трек');

export async function execute(interaction: CommandInteraction) {
  const distube = getDistube();
  const queue = distube.getQueue(interaction.guildId);
  if (!queue) return interaction.reply({ content: '❌ Нічого не грає', ephemeral: true });
  queue.skip();
  await interaction.reply('⏭️ Пропущено');
}
