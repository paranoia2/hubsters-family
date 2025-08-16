
import { DisTube } from 'distube';
import { YtDlpPlugin } from '@distube/yt-dlp';
import { SpotifyPlugin } from '@distube/spotify';
import { SoundCloudPlugin } from '@distube/soundcloud';

export function initMusic(client) {
  if (client.distube) return client.distube;

  const distube = new DisTube(client, {
    leaveOnStop: true,
    leaveOnEmpty: true,
    emitAddSongWhenCreatingQueue: true,
    emitAddListWhenCreatingQueue: false,
    nsfw: true,
    youtubeCookie: process.env.YT_COOKIE || undefined,
  });

  distube
    .use(new YtDlpPlugin({ update: false }))
    .use(new SpotifyPlugin({ emitEventsAfterFetching: true }))
    .use(new SoundCloudPlugin());

  distube.on('addSong', (queue, song) => {
    queue.textChannel?.send(`➕ Додано: **${song.name}** (${song.formattedDuration})`)
      .catch(() => {});
  });

  distube.on('playSong', (queue, song) => {
    queue.textChannel?.send(`🎵 Грає: **${song.name}** (${song.formattedDuration})`)
      .catch(() => {});
  });

  distube.on('error', (channel, error) => {
    console.error('DisTube error:', error);
    channel?.send('⚠️ Сталася помилка музичного модуля.').catch(() => {});
  });

  client.distube = distube;
  return distube;
}
