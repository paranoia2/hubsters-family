import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, NoSubscriberBehavior } from '@discordjs/voice';
import play from 'play-dl';
import type { Client } from 'discord.js';

type QueueItem = { url: string, title?: string, duration?: string, requestedBy?: string };

const queues: Map<string, { connection:any, player:any, songs: QueueItem[] }> = new Map();

export function setupPlayer(client: Client) {
  console.log('Player ready (YouTube-only)');
}

export function joinAndCreate(guildId: string, voiceChannel: any) {
  const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId,
    adapterCreator: (voiceChannel.guild.voiceAdapterCreator as any)
  });
  const player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Pause } });
  connection.subscribe(player);
  queues.set(guildId, { connection, player, songs: [] });
  return { connection, player };
}

export async function playSong(guildId: string) {
  const q = queues.get(guildId);
  if (!q || !q.songs.length) return null;
  const song = q.songs[0];
  try {
    const source = await play.stream(song.url, { quality: 2 });
    const resource = createAudioResource(source.stream, { inputType: source.type });
    q.player.play(resource);
    q.player.on(AudioPlayerStatus.Idle, () => {
      q.songs.shift();
      if (q.songs.length) playSong(guildId);
      else {
        setTimeout(()=>{ q.connection.destroy(); queues.delete(guildId); }, 5000);
      }
    });
    return song;
  } catch (e) {
    console.error('playSong error', e);
    throw e;
  }
}

export function enqueue(guildId: string, item: QueueItem) {
  const q = queues.get(guildId);
  if (!q) return;
  q.songs.push(item);
}

export function getQueue(guildId: string) {
  const q = queues.get(guildId);
  return q ? q.songs : [];
}

export function pause(guildId: string) {
  const q = queues.get(guildId);
  if (!q) return false;
  q.player.pause();
  return true;
}
export function resume(guildId: string) {
  const q = queues.get(guildId);
  if (!q) return false;
  q.player.unpause();
  return true;
}
export function skip(guildId: string) {
  const q = queues.get(guildId);
  if (!q) return false;
  q.player.stop();
  return true;
}
export function stop(guildId: string) {
  const q = queues.get(guildId);
  if (!q) return false;
  q.songs = [];
  q.player.stop();
  q.connection.destroy();
  queues.delete(guildId);
  return true;
}
