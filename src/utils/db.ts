import Database from 'better-sqlite3';
import path from 'path';
const db = new Database(path.join(process.cwd(), 'database.sqlite'));

// guild settings
db.prepare(`CREATE TABLE IF NOT EXISTS guild_settings (guild_id TEXT PRIMARY KEY, birthday_channel_id TEXT)`).run();
// birthdays
db.prepare(`CREATE TABLE IF NOT EXISTS birthdays (user_id TEXT, guild_id TEXT, birthday TEXT, PRIMARY KEY(user_id,guild_id))`).run();
// reaction roles: message_id, guild_id, emoji, role_id
db.prepare(`CREATE TABLE IF NOT EXISTS reaction_roles (message_id TEXT, guild_id TEXT, emoji TEXT, role_id TEXT, PRIMARY KEY(message_id, emoji))`).run();
// news feeds: id INTEGER PRIMARY KEY, guild_id, channel_id, feed_url, last_pub
db.prepare(`CREATE TABLE IF NOT EXISTS news_feeds (id INTEGER PRIMARY KEY AUTOINCREMENT, guild_id TEXT, channel_id TEXT, feed_url TEXT, last_pub TEXT)`).run();

export function setBirthday(userId: string, guildId: string, date: string) {
  db.prepare('INSERT OR REPLACE INTO birthdays (user_id, guild_id, birthday) VALUES (?, ?, ?)').run(userId, guildId, date);
}
export function getAllBirthdays(guildId: string) {
  return db.prepare('SELECT * FROM birthdays WHERE guild_id = ?').all(guildId);
}
export function removeBirthday(userId: string, guildId: string) {
  db.prepare('DELETE FROM birthdays WHERE user_id = ? AND guild_id = ?').run(userId, guildId);
}
export function setGuildBirthdayChannel(guildId: string, channelId: string) {
  db.prepare('INSERT OR REPLACE INTO guild_settings (guild_id, birthday_channel_id) VALUES (?, ?)').run(guildId, channelId);
}
export function getGuildBirthdayChannel(guildId: string) {
  return db.prepare('SELECT birthday_channel_id FROM guild_settings WHERE guild_id = ?').get(guildId);
}

// reaction roles
export function addReactionRole(messageId: string, guildId: string, emoji: string, roleId: string) {
  db.prepare('INSERT OR REPLACE INTO reaction_roles (message_id, guild_id, emoji, role_id) VALUES (?, ?, ?, ?)').run(messageId, guildId, emoji, roleId);
}
export function removeReactionRole(messageId: string, emoji: string) {
  db.prepare('DELETE FROM reaction_roles WHERE message_id = ? AND emoji = ?').run(messageId, emoji);
}
export function getReactionRolesForMessage(messageId: string) {
  return db.prepare('SELECT * FROM reaction_roles WHERE message_id = ?').all(messageId);
}

// news feeds
export function addNewsFeed(guildId: string, channelId: string, feedUrl: string) {
  db.prepare('INSERT INTO news_feeds (guild_id, channel_id, feed_url) VALUES (?, ?, ?)').run(guildId, channelId, feedUrl);
}
export function removeNewsFeed(id: number) {
  db.prepare('DELETE FROM news_feeds WHERE id = ?').run(id);
}
export function listNewsFeeds(guildId: string) {
  return db.prepare('SELECT * FROM news_feeds WHERE guild_id = ?').all(guildId);
}
export function updateLastPub(id: number, lastPub: string) {
  db.prepare('UPDATE news_feeds SET last_pub = ? WHERE id = ?').run(lastPub, id);
}

export default db;
