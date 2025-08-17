import { 
  joinVoiceChannel, 
  createAudioPlayer, 
  createAudioResource, 
  AudioPlayerStatus, 
  VoiceConnectionStatus, 
  entersState 
} from '@discordjs/voice'
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

  try {
    // Якщо токен протух — оновимо
    if (play.is_expired()) {
      await play.refreshToken()
    }

    const stream = await play.stream(next.url)
    const resource = createAudioResource(stream.stream, { inputType: stream.type })
    ctx.player.play(resource)
    ctx.now = next
  } catch (err) {
    ctx.now = null
    console.error('Помилка при відтворенні:', err, 'URL:', next.url)
    // пробуємо наступний трек замість того, щоб все ламалось
    await playNext(guildId)
  }
}

function isUrl(str) {
  try {
    new URL(str)
    return true
  } catch {
    return false
  }
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

  try {
    let track
    if (isUrl(query)) {
      // Якщо посилання
      const info = await play.video_info(query)
      const details = info.video_details
      track = { title: details.title, url: details.video_url } // <-- FIX тут
    } else {
      // Якщо пошуковий запит
      const results = await play.search(query, { limit: 1 })
      if (!results.length) throw new Error('Нічого не знайдено.')
      const vid = results[0]
      track = { title: vid.title, url: vid.url }
    }

    ctx.queue.push(track)

    if (ctx.player.state.status === AudioPlayerStatus.Idle) {
      await playNext(interaction.guildId)
    }

    return ctx
  } catch (e) {
    console.error('enqueue error:', e)
    throw new Error('❌ Інвалідне посилання або пошуковий запит.')
  }
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
