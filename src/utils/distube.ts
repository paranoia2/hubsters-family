import { DisTube } from 'distube';
import { SpotifyPlugin } from '@distube/spotify';
import { SoundCloudPlugin } from '@distube/soundcloud';
import type { Client } from 'discord.js';

let distube: DisTube;
export function setupDistube(client: Client) {
  distube = new DisTube(client as any, {
    leaveOnFinish: true,
    leaveOnStop: true,
    emitNewSongOnly: true,
    plugins: [new SpotifyPlugin(), new SoundCloudPlugin()]
  });

  distube.on('playSong', (queue, song) => {
    console.log('Playing:', song.name);
  });

  distube.on('finish', queue => {
    if (queue.textChannel) queue.textChannel.send('✅ Черга закінчилась!');
  });

  return distube;
}

export function getDistube() { return distube; }
