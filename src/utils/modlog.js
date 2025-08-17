import { db } from './jsondb.js'

export function setupModLog(client) {
  const channelId = process.env.MODLOG_CHANNEL_ID || db.get('modlogChannelId')
  if (channelId) {
    client.modlogChannelId = channelId
  }
}

export function setModLogChannel(id) {
  db.set('modlogChannelId', id)
}
