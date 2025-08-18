import { SlashCommandBuilder, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { joinAndCreate, enqueue, playSong } from '../utils/player.js';

export const data = new SlashCommandBuilder()
  .setName('play')
  .setDescription('🎵 Відтворити YouTube-пісню по посиланню або назві')
  .addStringOption(o => o.setName('query').setDescription('URL або пошуковий запит').setRequired(true));

export async function execute(interaction: CommandInteraction) {
  const query = interaction.options.getString('query', true);
  const member = interaction.member as any;
  const vc = member?.voice?.channel;
  if (!vc) return interaction.reply({ content: '❌ Ти маєш бути у голосовому каналі!', ephemeral: true });
  await interaction.deferReply();
  const guildId = interaction.guildId!;
  joinAndCreate(guildId, vc);
  // search with play-dl for YouTube
  const play = await import('play-dl');
  const search = await play.default.search(query, { limit: 1 });
  const url = search && search.length ? search[0].url : query;
  enqueue(guildId, { url, title: search[0]?.title, duration: search[0]?.durationRaw, requestedBy: interaction.user.tag });
  const song = await playSong(guildId);
  const embed = new EmbedBuilder()
    .setTitle('🎶 Зараз грає')
    .setDescription(`[${song.title || song.url}](${song.url})`)
    .addFields({ name: '⌛ Тривалість', value: song.duration || 'N/A', inline: true }, { name: '👤 Замовив', value: song.requestedBy || interaction.user.tag, inline: true })
    .setThumbnail('https://i.imgur.com/7G6zO8u.png');
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('pause_btn').setLabel('⏸ Пауза').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('resume_btn').setLabel('▶️ Продовжити').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId('skip_btn').setLabel('⏭ Скіп').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('stop_btn').setLabel('⏹ Стоп').setStyle(ButtonStyle.Danger)
  );
  await interaction.editReply({ embeds: [embed], components: [row] });
}
