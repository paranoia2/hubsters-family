import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { setBirthday } from '../utils/db.js';
export const data = new SlashCommandBuilder().setName('bday-add').setDescription('Add bday').addUserOption(o=>o.setName('user').setDescription('User').setRequired(true)).addStringOption(o=>o.setName('date').setDescription('DD-MM-YYYY').setRequired(true));
export async function execute(interaction: ChatInputCommandInteraction) {
  const user = interaction.options.getUser('user', true);
  const date = interaction.options.getString('date', true);
  setBirthday(user.id, interaction.guildId!, date);
  await interaction.reply({ content: '✅ Saved', ephemeral:true });
}
