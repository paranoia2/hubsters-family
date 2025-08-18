import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { removeBirthday } from '../utils/db.js';

export const data = new SlashCommandBuilder()
  .setName('bday-remove')
  .setDescription('🗑️ Видалити день народження')
  .addUserOption(o => o.setName('user').setDescription('Користувач').setRequired(true));

export async function execute(interaction: CommandInteraction) {
  const user = interaction.options.getUser('user', true);
  removeBirthday(user.id, interaction.guildId!);
  await interaction.reply({ content: `✅ Видалено для ${user.tag}` });
}
