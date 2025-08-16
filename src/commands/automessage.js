
import { SlashCommandBuilder, ChannelType } from 'discord.js';
import { addSchedule, removeSchedule, listSchedules } from '../utils/scheduler.js';

export default {
  data: new SlashCommandBuilder()
    .setName('automessage')
    .setDescription('Керування автоматичними повідомленнями')
    .addSubcommand(s => s.setName('set')
      .setDescription('Створити щоденне повідомлення')
      .addChannelOption(o => o.setName('channel').setDescription('Канал').addChannelTypes(ChannelType.GuildText).setRequired(true))
      .addStringOption(o => o.setName('time').setDescription('Час у форматі HH:MM (24h)').setRequired(true))
      .addStringOption(o => o.setName('text').setDescription('Текст повідомлення').setRequired(true))
    )
    .addSubcommand(s => s.setName('list').setDescription('Показати усі автоповідомлення'))
    .addSubcommand(s => s.setName('delete')
      .setDescription('Видалити автоповідомлення за ID')
      .addStringOption(o => o.setName('id').setDescription('ID зі списку').setRequired(true))
    ),
  async execute(interaction, client) {
    const sub = interaction.options.getSubcommand();
    if (sub === 'set') {
      const channel = interaction.options.getChannel('channel', true);
      const time = interaction.options.getString('time', true);
      const text = interaction.options.getString('text', true);
      const sched = await addSchedule(client, { channelId: channel.id, time, text, guildId: interaction.guildId, authorId: interaction.user.id });
      return interaction.reply(`✅ Додано автоповідомлення **${sched.id}**: щодня о **${sched.time}** в <#${sched.channelId}>`);
    } else if (sub === 'list') {
      const items = await listSchedules(interaction.guildId);
      if (!items.length) return interaction.reply('🤖 Немає автоповідомлень.');
      return interaction.reply({
        embeds: [{
          title: '📢 Автоматичні повідомлення',
          description: items.map(x => `**${x.id}** • ${x.time} • <#${x.channelId}>\n${x.text}`).join('\n\n')
        }]
      });
    } else if (sub === 'delete') {
      const id = interaction.options.getString('id', true);
      const ok = await removeSchedule(id, interaction.guildId);
      return interaction.reply(ok ? `🗑️ Видалено **${id}**` : '❌ Не знайдено.');
    }
  }
};
