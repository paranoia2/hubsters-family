import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { getAllBirthdays } from '../utils/db.js';
export const data = new SlashCommandBuilder().setName('bday-list').setDescription('List bdays');
export async function execute(interaction: ChatInputCommandInteraction) {
  const rows = getAllBirthdays(interaction.guildId!);
  if (!rows.length) return interaction.reply({ content:'No bdays', ephemeral:true });
  const embed = new EmbedBuilder().setTitle('Birthdays');
  for (const r of rows) { const m = await interaction.guild!.members.fetch(r.user_id).catch(()=>null); embed.addFields({ name: m?m.user.username:r.user_id, value: r.birthday }); }
  await interaction.reply({ embeds:[embed], ephemeral:true });
}
