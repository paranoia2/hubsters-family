import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { resume } from '../utils/player.js';
export const data = new SlashCommandBuilder().setName('resume').setDescription('▶️ Продовжити');
export async function execute(interaction: CommandInteraction) {
  const ok = resume(interaction.guildId!);
  if (!ok) return interaction.reply({ content: '❌ Нічого не грає', ephemeral: true });
  await interaction.reply('▶️ Продовжено');
}
