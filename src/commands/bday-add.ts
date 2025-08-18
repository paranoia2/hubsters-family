import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { setBirthday } from '../utils/db.js';

export const data = new SlashCommandBuilder()
  .setName('bday-add')
  .setDescription('🎂 Додати день народження')
  .addUserOption(o => o.setName('user').setDescription('Користувач').setRequired(true))
  .addStringOption(o => o.setName('date').setDescription('DD-MM-YYYY').setRequired(true));

export async function execute(interaction: CommandInteraction) {
  const user = interaction.options.getUser('user', true);
  const date = interaction.options.getString('date', true);
  if (!/^\d{2}-\d{2}-\d{4}$/.test(date)) return interaction.reply({ content: '❌ Формат DD-MM-YYYY', ephemeral: true });
  setBirthday(user.id, interaction.guildId!, date);
  await interaction.reply({ content: `✅ Збережено: ${user.tag} — ${date}` });
}
