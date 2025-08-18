import { getAllBirthdays, getGuildBirthdayChannel } from '../utils/db.js';
import type { Client } from 'discord.js';
export const name = 'ready'; export const once = true;
export async function execute(client: Client) {
  console.log(`Logged in as ${client.user?.tag}`);
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
            if (d===today && m===thisMonth) {
              const chRow = getGuildBirthdayChannel(guild.id);
              const chId = chRow ? chRow.birthday_channel_id : null;
              const channel = chId ? guild.channels.cache.get(chId) : guild.systemChannel || guild.channels.cache.find(c=>c.isTextBased());
              if (channel) channel.send(`🎉 Сьогодні день народження у <@${r.user_id}>! Вітайте! 🥳`);
            }
            const tomorrow = new Date(now); tomorrow.setDate(tomorrow.getDate()+1);
            const tday = ('0'+tomorrow.getDate()).slice(-2);
            const tmonth = ('0'+(tomorrow.getMonth()+1)).slice(-2);
            if (d===tday && m===tmonth) {
              const chRow = getGuildBirthdayChannel(guild.id);
              const chId = chRow ? chRow.birthday_channel_id : null;
              const channel = chId ? guild.channels.cache.get(chId) : guild.systemChannel || guild.channels.cache.find(c=>c.isTextBased());
              if (channel) channel.send(`📅 Завтра святкує <@${r.user_id}> — не забудьте привітати! 🎈`);
            }
          }
        }
      }
    } catch(e){ console.error(e); }
  }, 60*1000);
}
