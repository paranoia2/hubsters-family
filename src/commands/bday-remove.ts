import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { removeBirthday } from '../utils/db.js';
export const data = new SlashCommandBuilder().setName('bday-remove').setDescription('Remove bday').addUserOption(o=>o.setName('user').setDescription('User').setRequired(true));
export async function execute(interaction: ChatInputCommandInteraction) {
  const user = interaction.options.getUser('user', true);
  removeBirthday(user.id, interaction.guildId!);
  await interaction.reply({ content:'✅ Removed', ephemeral:true });
}
