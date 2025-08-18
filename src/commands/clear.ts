import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
export const data = new SlashCommandBuilder()
  .setName('clear')
  .setDescription('🧹 Видалити повідомлення')
  .addIntegerOption(o=>o.setName('count').setDescription('Кількість').setRequired(true));
export async function execute(interaction: CommandInteraction) {
  const count = interaction.options.getInteger('count', true);
  const channel = interaction.channel;
  if (!channel?.isTextBased()) return interaction.reply({ content:'❌ Не текстовий канал', ephemeral:true });
  const msgs = await channel.bulkDelete(count, true);
  await interaction.reply({ content: `✅ Видалено ${msgs.size} повідомлень`, ephemeral: true });
}
