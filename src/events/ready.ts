import { getAllBirthdays, getGuildBirthdayChannel, listNewsFeeds, updateLastPub } from '../utils/db.js';
import type { Client, TextChannel } from 'discord.js';
import Parser from 'rss-parser';

const parser = new Parser();

export const name = 'ready';
export const once = true;
export async function execute(client: Client) {
  console.log(`Logged in as ${client.user?.tag}`);

  // birthdays and next-day reminders at 10:00 server time (checks each minute)
  setInterval(async ()=>{
    try {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();
      if (hour===10 && minute===0) {
        for (const guild of client.guilds.cache.values()) {
          const rows = getAllBirthdays(guild.id);
          for (const r of rows) {
            const [d,m,y] = r.birthday.split('-');
            const today = ('0'+now.getDate()).slice(-2);
            const thisMonth = ('0'+(now.getMonth()+1)).slice(-2);
            const chRow = getGuildBirthdayChannel(guild.id);
            const chId = chRow ? chRow.birthday_channel_id : null;
            const channel = chId ? guild.channels.cache.get(chId as any) as TextChannel : guild.systemChannel as TextChannel || guild.channels.cache.find(c=>c.isTextBased()) as TextChannel;
            if (!channel) continue;
            if (d===today && m===thisMonth) {
              channel.send(`🎉 Сьогодні день народження у <@${r.user_id}>! Вітайте! 🥳`);
            }
            // tomorrow
            const tomorrow = new Date(now); tomorrow.setDate(tomorrow.getDate()+1);
            const tday = ('0'+tomorrow.getDate()).slice(-2);
            const tmonth = ('0'+(tomorrow.getMonth()+1)).slice(-2);
            if (d===tday && m===tmonth) {
              channel.send(`📅 Завтра святкує <@${r.user_id}> — не забудьте привітати! 🎈`);
            }
          }
        }
      }
    } catch(e){ console.error(e); }
  }, 60*1000);

  // news polling every 5 minutes
  setInterval(async ()=>{
    try {
      for (const guild of client.guilds.cache.values()) {
        const feeds = listNewsFeeds(guild.id);
        for (const f of feeds) {
          try {
            const feed = await parser.parseURL(f.feed_url);
            if (!feed || !feed.items || !feed.items.length) continue;
            const latest = feed.items[0];
            if (!latest.pubDate) continue;
            if (f.last_pub !== latest.pubDate) {
              // post to channel
              const channel = guild.channels.cache.get(f.channel_id) as TextChannel || guild.systemChannel as TextChannel;
              if (channel && channel.isTextBased()) {
                channel.send(`📰 Новий пост: **${latest.title}**\n${latest.link}`);
              }
              updateLastPub(f.id, latest.pubDate);
            }
          } catch(e) { console.error('feed error', e); }
        }
      }
    } catch(e){ console.error(e); }
  }, 5*60*1000);

}
