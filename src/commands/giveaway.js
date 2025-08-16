import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

const giveaways = new Map(); // messageId -> { endsAt, winners, entrants:Set }

export default {
  data: new SlashCommandBuilder()
    .setName('giveaway')
    .setDescription('Розіграш')
    .addSubcommand(sc=>sc.setName('start').setDescription('Старт розіграшу')
      .addStringOption(o=>o.setName('duration').setDescription('напр. 10m, 1h').setRequired(true))
      .addIntegerOption(o=>o.setName('winners').setDescription('Кількість переможців').setMinValue(1).setRequired(true))
      .addStringOption(o=>o.setName('prize').setDescription('Приз').setRequired(true)))
    .addSubcommand(sc=>sc.setName('reroll').setDescription('Рерол')
      .addStringOption(o=>o.setName('message_id').setDescription('ID повідомлення розіграшу').setRequired(true))
      .addIntegerOption(o=>o.setName('winners').setDescription('Скільки').setMinValue(1).setRequired(true)))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    if (interaction.options.getSubcommand() === 'start') {
      const dstr = interaction.options.getString('duration', true);
      const m = dstr.match(/^(\d+)(s|m|h|d)$/i);
      if(!m) return interaction.reply({ content: 'Невірна тривалість', ephemeral: true });
      const n = parseInt(m[1]); const unit = m[2].toLowerCase();
      const ms = unit==='s'?n*1000:unit==='m'?n*60000:unit==='h'?n*3600000:n*86400000;
      const winners = interaction.options.getInteger('winners', true);
      const prize = interaction.options.getString('prize', true);

      const emb = new EmbedBuilder().setTitle('🎉 Розіграш!').setDescription(`Приз: **${prize}**\nНатисни 🎉 щоб взяти участь!`).setTimestamp(Date.now()+ms);
      const msg = await interaction.channel.send({ embeds: [emb] });
      await msg.react('🎉');
      giveaways.set(msg.id, { endsAt: Date.now()+ms, winners, entrants: new Set() });
      setTimeout(async ()=> finalize(interaction, msg.id, prize), ms).unref();
      await interaction.reply({ content: `✅ Розіграш запущено. ID: ${msg.id}`, ephemeral: true });
    } else {
      const msgId = interaction.options.getString('message_id', true);
      const channel = interaction.channel;
      const fetched = await channel.messages.fetch(msgId).catch(()=>null);
      if(!fetched) return interaction.reply({ content: 'Не знайдено повідомлення', ephemeral: true });
      const meta = giveaways.get(msgId); if(!meta) return interaction.reply({ content: 'Дані розіграшу відсутні (можливо бот перезапускався).', ephemeral: true });
      await finalize(interaction, msgId, fetched.embeds?.[0]?.data?.description || 'приз');
      await interaction.reply('🔁 Рерол виконано');
    }
  }
};

async function finalize(interaction, msgId, prize){
  const meta = giveaways.get(msgId);
  if(!meta) return;
  // зчитуємо реакцію
  const channel = interaction.channel;
  const message = await channel.messages.fetch(msgId).catch(()=>null);
  if(!message) return;
  const reaction = message.reactions.resolve('🎉');
  const users = reaction ? await reaction.users.fetch() : null;
  const entrants = users ? users.filter(u=>!u.bot).map(u=>u.id) : [];
  if(entrants.length === 0){
    await message.reply('Немає учасників 😿');
  }else{
    const winners = [];
    const pool = [...entrants];
    for(let i=0;i<meta.winners && pool.length>0;i++){
      const idx = Math.floor(Math.random()*pool.length);
      winners.push(pool.splice(idx,1)[0]);
    }
    await message.reply(`🎊 Вітаємо переможців: ${winners.map(id=>`<@${id}>`).join(', ')} — приз: **${prize}**`);
  }
  giveaways.delete(msgId);
}
