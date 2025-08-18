import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { getAllBirthdays } from '../utils/db.js';

export const data = new SlashCommandBuilder().setName('bday-list').setDescription('📜 Список днів народження');

export async function execute(interaction: CommandInteraction) {
  const rows = getAllBirthdays(interaction.guildId!);
  if (!rows.length) return interaction.reply({ content: '❌ Немає записів', ephemeral: true });

  const embed = new EmbedBuilder().setTitle('🎂 Дні народження');
  for (const r of rows) {
    const member = await interaction.guild!.members.fetch(r.user_id).catch(()=>null);
    embed.addFields({ name: member ? member.user.username : r.user_id, value: r.birthday });
  }
  await interaction.reply({ embeds: [embed] });
}
