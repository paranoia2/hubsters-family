import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Видалити N останніх повідомлень у цьому каналі (1-100)')
    .addIntegerOption(o => o.setName('amount').setDescription('Скільки видалити').setMinValue(1).setMaxValue(100).setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    const amount = interaction.options.getInteger('amount', true);
    await interaction.deferReply({ ephemeral: true });
    const deleted = await interaction.channel.bulkDelete(amount, true).catch(() => null);
    if (!deleted) return interaction.editReply('⚠️ Не вдалося видалити повідомлення (можливо, вони старші за 14 днів).');
    await interaction.editReply(`🧹 Видалено ${deleted.size} повідомлень.`);
  }
};
