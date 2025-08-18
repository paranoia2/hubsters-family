import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction } from 'discord.js';
import { getDistube } from '../utils/distube.js';

export const data = new SlashCommandBuilder()
  .setName('play')
  .setDescription('🎵 Відтворити музику')
  .addStringOption(o => o.setName('query').setDescription('Назва або URL').setRequired(true));

export async function execute(interaction: CommandInteraction) {
  const query = interaction.options.getString('query', true);
  const member = interaction.member as any;
  const vc = member?.voice?.channel;
  if (!vc) return interaction.reply({ content: '❌ Ти маєш бути у голосовому каналі!', ephemeral: true });

  const distube = getDistube();
  await interaction.deferReply();

  distube.play(vc, query, { textChannel: interaction.channel, member: interaction.member });

  const onPlay = async (queue:any, song:any) => {
    try {
      const embed = new EmbedBuilder()
        .setTitle('🎶 Зараз грає')
        .setDescription(`[${song.name}](${song.url})`)
        .addFields(
          { name: '⌛ Тривалість', value: song.formattedDuration || 'N/A', inline: true },
          { name: '👤 Автор', value: song.uploader?.name || 'Unknown', inline: true }
        )
        .setThumbnail(song.thumbnail);

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId('pause_btn').setLabel('⏸ Пауза').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('resume_btn').setLabel('▶️ Продовжити').setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId('skip_btn').setLabel('⏭ Скіп').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('stop_btn').setLabel('⏹ Стоп').setStyle(ButtonStyle.Danger)
      );

      await interaction.editReply({ content: null, embeds: [embed], components: [row] });
    } catch (e) {
      console.error(e);
    } finally {
      distube.off('playSong', onPlay);
    }
  };

  distube.on('playSong', onPlay);
}
