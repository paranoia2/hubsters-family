import { getAllBirthdays, getGuildBirthdayChannel } from '../utils/db.js';
import type { Client } from 'discord.js';

export const name = 'ready';
export const once = true;

export async function execute(client: Client) {
  console.log(`Logged in as ${client.user?.tag}`);

  // check every minute; send at 10:00 and 10:00 previous day reminder
  setInterval(async () => {
    try {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();

      // run checks at minute 0 every hour to be safe; we'll check specific times
      if (minute !== 0) return;
      for (const guild of client.guilds.cache.values()) {
        const rows = getAllBirthdays(guild.id);
        if (!rows || !rows.length) continue;
        for (const r of rows) {
          const [d, m, y] = r.birthday.split('-');
          const day = d;
          const month = m;
          const today = ('0'+now.getDate()).slice(-2);
          const thisMonth = ('0'+(now.getMonth()+1)).slice(-2);

          const channelRow = getGuildBirthdayChannel(guild.id);
          const channelId = channelRow ? channelRow.birthday_channel_id : null;
          const channel = channelId ? guild.channels.cache.get(channelId as any) : guild.systemChannel || guild.channels.cache.find(c=>c.isTextBased());
          if (!channel) continue;

          // main reminder at 10:00
          if (hour === 10 && minute === 0 && day === today && month === thisMonth) {
            channel.send(`🎉 Сьогодні день народження у <@${r.user_id}>! Вітайте! 🥳`);
          }

          // next-day reminder at 10:00 (yesterday check)
          const tomorrow = new Date(now);
          tomorrow.setDate(tomorrow.getDate() + 1);
          const tday = ('0'+tomorrow.getDate()).slice(-2);
          const tmonth = ('0'+(tomorrow.getMonth()+1)).slice(-2);
          if (hour === 10 && minute === 0 && day === tday && month === tmonth) {
            channel.send(`📅 Завтра святкує <@${r.user_id}> — не забудьте привітати! 🎈`);
          }
        }
      }
    } catch(e){ console.error(e); }
  }, 60*1000);
}
