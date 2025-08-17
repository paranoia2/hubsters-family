import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, getVoiceConnection } from "@discordjs/voice";
import play from "play-dl";

const queues = new Map();

export function getQueue(guildId) {
    if (!queues.has(guildId)) {
        queues.set(guildId, {
            songs: [],
            player: createAudioPlayer(),
            connection: null
        });
    }
    return queues.get(guildId);
}

export async function enqueue(guildId, song, channel) {
    const queue = getQueue(guildId);
    queue.songs.push(song);

    if (!queue.connection) {
        queue.connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: guildId,
            adapterCreator: channel.guild.voiceAdapterCreator
        });

        queue.player.on(AudioPlayerStatus.Idle, () => {
            queue.songs.shift();
            if (queue.songs.length > 0) {
                playSong(guildId);
            }
        });

        queue.connection.subscribe(queue.player);
    }

    if (queue.player.state.status === AudioPlayerStatus.Idle) {
        playSong(guildId);
    }
}

async function playSong(guildId) {
    const queue = getQueue(guildId);
    if (!queue.songs.length) return;

    const song = queue.songs[0];
    const stream = await play.stream(song.url);
    const resource = createAudioResource(stream.stream, { inputType: stream.type });
    queue.player.play(resource);
}
