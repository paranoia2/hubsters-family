import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { parseDuration } from '../utils/duration.js';

const EMOJI = '🎉';

export default {
  data: new SlashCommandBuilder()
    .setName('giveaway')
    .setDescription('Розіграші')
    .addSubcommand(sc => sc
      .setName('start')
      .setDescription('Старт розіграшу')
      .addStringOption(o => o.setName('duration').setDescription('Тривалість (напр. 1h30m, 45m, 30s)').setRequired(true))
      .addIntegerOption(o => o.setName('winners').setDescription('Кількість переможців').setMinValue(1).setMaxValue(10).setRequired(true))
      .addStringOption(o => o.setName('prize').setDescription('Приз').setRequired(true))
    )
    .addSubcommand(sc => sc
      .setName('reroll')
      .setDescription('Переобрати переможців')
      .addStringOption(o => o.setName('message_id').setDescription('ID повідомлення з розіграшем').setRequired(true))
      .addIntegerOption(o => o.setName('winners').setDescription('Кількість переможців').setMinValue(1).setMaxValue(10).setRequired(true))
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    if (interaction.options.getSubcommand() === 'start') {
      const durationStr = interaction.options.getString('duration', true);
      const winnersCount = interaction.options.getInteger('winners', true);
      const prize = interaction.options.getString('prize', true);
      const ms = parseDuration(durationStr);
      if (!ms) return interaction.reply({ content: '⚠️ Невірна тривалість.', ephemeral: true });
      const end = Date.now() + ms;

      const embed = new EmbedBuilder()
        .setTitle('🎉 Розіграш!')
        .setDescription(`Натисни на реакцію ${EMOJI} щоб взяти участь.
Приз: **${prize}**
Переможців: **${winnersCount}**`)
        .addFields({ name: 'Закінчення', value: `<t:${Math.floor(end/1000)}:R>` })
        .setFooter({ text: `Запущено ${interaction.user.tag}` })
        .setTimestamp();

      await interaction.deferReply({ ephemeral: true });
      const msg = await interaction.channel.send({ embeds: [embed] });
      await msg.react(EMOJI);
      await interaction.editReply(`✅ Створено розіграш: ${msg.url}`);

      setTimeout(async () => {
        try {
          const fetched = await msg.fetch();
          const reaction = fetched.reactions.cache.get(EMOJI);
          if (!reaction) return fetched.reply('Ніхто не взяв участі.');
          const users = await reaction.users.fetch();
          const entrants = users.filter(u => !u.bot);
          if (entrants.size === 0) return fetched.reply('Немає учасників.');
          const shuffled = entrants.random(winnersCount);
          const winners = Array.isArray(shuffled) ? shuffled : [shuffled];
          await fetched.reply(`🏆 Переможці: ${winners.map(w => `<@${w.id}>`).join(', ')} — Приз: **${prize}**`);
        } catch (e) {
          console.error('Giveaway error:', e);
        }
      }, ms);
    } else if (interaction.options.getSubcommand() === 'reroll') {
      const messageId = interaction.options.getString('message_id', true);
      const winnersCount = interaction.options.getInteger('winners', true);
      await interaction.deferReply({ ephemeral: true });
      const msg = await interaction.channel.messages.fetch(messageId).catch(() => null);
      if (!msg) return interaction.editReply('⚠️ Не знайшов повідомлення.');
      const reaction = msg.reactions.cache.get(EMOJI);
      if (!reaction) return interaction.editReply('⚠️ На повідомленні немає реакції учасників.');
      const users = await reaction.users.fetch();
      const entrants = users.filter(u => !u.bot);
      if (entrants.size === 0) return interaction.editReply('Немає учасників.');
      const shuffled = entrants.random(winnersCount);
      const winners = Array.isArray(shuffled) ? shuffled : [shuffled];
      await interaction.editReply(`🏆 Нові переможці: ${winners.map(w => `<@${w.id}>`).join(', ')}`);
    }
  }
};
