
import { SlashCommandBuilder, ChannelType, PermissionFlagsBits } from 'discord.js';

function inSameVoice(interaction) {
  const memberVc = interaction.member?.voice?.channel;
  const botVc = interaction.guild?.members?.me?.voice?.channel;
  return !botVc || (memberVc && botVc && memberVc.id === botVc.id);
}

export default {
  data: new SlashCommandBuilder()
    .setName('music')
    .setDescription('Музичний плеєр')
    .addSubcommand(s => s.setName('play')
      .setDescription('Відтворити трек/плейлист з YouTube/Spotify/SoundCloud')
      .addStringOption(o => o.setName('query').setDescription('URL або назва треку').setRequired(true)))
    .addSubcommand(s => s.setName('skip').setDescription('Пропустити поточний трек'))
    .addSubcommand(s => s.setName('pause').setDescription('Пауза'))
    .addSubcommand(s => s.setName('resume').setDescription('Продовжити відтворення'))
    .addSubcommand(s => s.setName('stop').setDescription('Зупинити і очистити чергу'))
    .addSubcommand(s => s.setName('queue').setDescription('Показати чергу')),
  async execute(interaction, client) {
    const sub = interaction.options.getSubcommand();
    const distube = client.distube;
    if (!distube) return interaction.reply({ content: '⚠️ Музичний модуль ще не ініціалізовано.', ephemeral: true });

    const vc = interaction.member?.voice?.channel;
    if (sub === 'play') {
      if (!vc) return interaction.reply({ content: '🔊 Зайди у голосовий канал.', ephemeral: true });
      if (!inSameVoice(interaction)) return interaction.reply({ content: '❗ Ми не в одному голосовому каналі.', ephemeral: true });
      const query = interaction.options.getString('query', true);
      await interaction.reply({ content: `🔎 Шукаю: **${query}** ...` });
      try {
        await distube.play(vc, query, { textChannel: interaction.channel, member: interaction.member });
        await interaction.editReply('▶️ Відтворюю!');
      } catch (e) {
        console.error(e);
        await interaction.editReply('❌ Не вдалося відтворити.');
      }
      return;
    }

    if (!inSameVoice(interaction)) return interaction.reply({ content: '❗ Ми не в одному голосовому каналі.', ephemeral: true });
    const queue = distube.getQueue(interaction.guildId);

    switch (sub) {
      case 'skip':
        if (!queue) return interaction.reply({ content: 'Черга порожня.', ephemeral: true });
        await queue.skip().catch(() => {});
        return interaction.reply('⏭️ Пропущено.');
      case 'pause':
        if (!queue) return interaction.reply({ content: 'Нічого не грає.', ephemeral: true });
        queue.pause();
        return interaction.reply('⏸️ Пауза.');
      case 'resume':
        if (!queue) return interaction.reply({ content: 'Нічого не грає.', ephemeral: true });
        queue.resume();
        return interaction.reply('▶️ Продовжую.');
      case 'stop':
        if (!queue) return interaction.reply({ content: 'Черга вже порожня.', ephemeral: true });
        await queue.stop();
        return interaction.reply('⏹️ Зупинено.');
      case 'queue':
        if (!queue || queue.songs.length === 0) return interaction.reply({ content: 'Черга порожня.', ephemeral: true });
        return interaction.reply({
          embeds: [{
            title: '🎶 Черга',
            description: queue.songs.slice(0, 10).map((s, i) => `${i === 0 ? '🎧' : `${i}.`} [${s.name}](${s.url}) • ${s.formattedDuration}`).join('\n'),
          }]
        });
    }
  }
};
