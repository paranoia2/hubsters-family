import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
export const data = new SlashCommandBuilder()
  .setName('kick')
  .setDescription('👢 Кік користувача')
  .addUserOption(o=>o.setName('user').setDescription('Користувач').setRequired(true))
  .addStringOption(o=>o.setName('reason').setDescription('Причина'));
export async function execute(interaction: CommandInteraction) {
  const user = interaction.options.getUser('user', true);
  const member = await interaction.guild?.members.fetch(user.id);
  const reason = interaction.options.getString('reason') || 'Немає';
  if (!member?.kickable) return interaction.reply({ content:'❌ Не можу кікнути', ephemeral:true });
  await member.kick(reason);
  await interaction.reply(`✅ Кікнуто ${user.tag} | Причина: ${reason}`);
}
