
import { SlashCommandBuilder } from 'discord.js';
import { parseDuration } from '../utils/duration.js';

export default {
  data: new SlashCommandBuilder()
    .setName('remind')
    .setDescription('Створити нагадування')
    .addStringOption(o => o.setName('after').setDescription('Після якого часу: напр. 10m, 2h, 1h30m').setRequired(true))
    .addStringOption(o => o.setName('text').setDescription('Текст нагадування').setRequired(true)),
  async execute(interaction) {
    const after = interaction.options.getString('after', true);
    const text = interaction.options.getString('text', true);
    const ms = parseDuration(after);
    if (!ms) return interaction.reply({ content: '⏰ Невірний формат часу. Приклад: 1h30m, 10m, 45s', ephemeral: true });
    await interaction.reply(`✅ Нагадування встановлено. Я нагадаю через **${after}**.`);
    setTimeout(() => {
      interaction.followUp({ content: `⏰ <@${interaction.user.id}> нагадую: **${text}**` }).catch(() => {});
    }, ms);
  }
};
