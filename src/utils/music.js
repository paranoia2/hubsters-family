import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, entersState } from '@discordjs/voice'
import play from 'play-dl'

const queues = new Map() // guildId -> { connection, player, queue: [], now }

async function connectToChannel(voiceChannel) {
  const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: voiceChannel.guild.id,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator
  })
  try {
    await entersState(connection, VoiceConnectionStatus.Ready, 30_000)
    return connection
  } catch (e) {
    connection.destroy()
    throw e
  }
}

async function playNext(guildId) {
  const ctx = queues.get(guildId)
  if (!ctx) return
  const next = ctx.queue.shift()
  if (!next) {
    ctx.player.stop()
    return
  }
  const stream = await play.stream(next.url)
  const resource = createAudioResource(stream.stream, { inputType: stream.type })
  ctx.player.play(resource)
  ctx.now = next
}

export async function enqueue(interaction, query) {
  const voice = interaction.member.voice.channel
  if (!voice) throw new Error('Зайди у голосовий канал.')
  let ctx = queues.get(interaction.guildId)
  if (!ctx) {
    const connection = await connectToChannel(voice)
    const player = createAudioPlayer()
    connection.subscribe(player)
    player.on(AudioPlayerStatus.Idle, () => playNext(interaction.guildId))
    ctx = { connection, player, queue: [], now: null }
    queues.set(interaction.guildId, ctx)
  }
  // Resolve link or search
  let info
    try {
    info = await play.search(query, { limit: 1 })
    if (!info.length) throw new Error('Нічого не знайдено.')
    const vid = info[0]
    ctx.queue.push({ title: vid.title, url: vid.url })
  } catch (e) {
    // fallback: push raw query as url
    ctx.queue.push({ title: query, url: query })
  }
  if (ctx.player.state.status === AudioPlayerStatus.Idle) {
    await playNext(interaction.guildId)
  }
  return ctx
}

export function skip(guildId) {
  const ctx = queues.get(guildId)
  if (!ctx) return false
  return ctx.player.stop()
}

export function stop(guildId) {
  const ctx = queues.get(guildId)
  if (!ctx) return false
  ctx.queue = []
  ctx.player.stop()
  ctx.connection.destroy()
  queues.delete(guildId)
  return true
}

export function getQueue(guildId) {
  const ctx = queues.get(guildId)
  if (!ctx) return { now: null, queue: [] }
  return { now: ctx.now, queue: ctx.queue }
}
