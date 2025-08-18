import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
export const data = new SlashCommandBuilder()
  .setName('ban')
  .setDescription('⛔ Забанити користувача')
  .addUserOption(o=>o.setName('user').setDescription('Користувач').setRequired(true))
  .addStringOption(o=>o.setName('reason').setDescription('Причина'));
export async function execute(interaction: CommandInteraction) {
  const user = interaction.options.getUser('user', true);
  const member = await interaction.guild?.members.fetch(user.id);
  const reason = interaction.options.getString('reason') || 'Немає';
  if (!member?.bannable) return interaction.reply({ content:'❌ Не можу забанити', ephemeral:true });
  await member.ban({ reason });
  await interaction.reply(`✅ Забанено ${user.tag} | Причина: ${reason}`);
}
