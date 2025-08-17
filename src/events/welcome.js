import { db } from '../utils/jsondb.js'

export async function onGuildMemberAdd(member) {
  const id = process.env.WELCOME_CHANNEL_ID || db.get('welcomeChannelId')
  if (!id) return
  const ch = member.guild.channels.cache.get(id)
  if (ch) ch.send(`👋 Ласкаво просимо, ${member}!`)
}
