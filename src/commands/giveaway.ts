import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
export const data = new SlashCommandBuilder()
  .setName('giveaway')
  .setDescription('🎁 Розіграші')
  .addSubcommand(sc=>sc.setName('start').setDescription('Старт розіграшу').addStringOption(o=>o.setName('prize').setDescription('Приз').setRequired(true)).addIntegerOption(o=>o.setName('duration').setDescription('Тривалість в хвилинах').setRequired(true)))
  .addSubcommand(sc=>sc.setName('end').setDescription('Закінчити розіграш'))
  .addSubcommand(sc=>sc.setName('reroll').setDescription('Перевибір переможця'));
export async function execute(interaction: CommandInteraction) {
  await interaction.reply('⚠ Розіграші поки працюють в базовому режимі (треба додати базу для історії)');
}
