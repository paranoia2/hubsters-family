import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
export const data = new SlashCommandBuilder()
  .setName('giveaway')
  .setDescription('🎁 Розіграші')
  .addSubcommand(sc=>sc.setName('start').setDescription('Старт розіграшу').addStringOption(o=>o.setName('prize').setDescription('Приз').setRequired(true)).addIntegerOption(o=>o.setName('minutes').setDescription('Тривалість в хвилинах').setRequired(true)))
  .addSubcommand(sc=>sc.setName('end').setDescription('Закінчити розіграш'))
  .addSubcommand(sc=>sc.setName('reroll').setDescription('Перевибір переможця'));
export async function execute(interaction: CommandInteraction) {
  const sub = interaction.options.getSubcommand();
  if (sub === 'start') {
    const prize = interaction.options.getString('prize', true);
    const mins = interaction.options.getInteger('minutes', true);
    const m = await interaction.reply({ content: `🎁 Розіграш "${prize}" стартував! Тривалість: ${mins} хв. Натисніть 🎉 щоб взяти участь.`, fetchReply: true });
    await (m as any).react('🎉');
    setTimeout(async ()=>{
      const fetched = await (m as any).fetch();
      const users = (await fetched.reactions.resolve('🎉').users.fetch()).filter((u:any)=>!u.bot).map((u:any)=>u.id);
      if (!users.length) return interaction.followUp('Ніхто не взяв участь.');
      const winner = users[Math.floor(Math.random()*users.length)];
      interaction.followUp(`🏆 Переможець: <@${winner}> — ${prize}`);
    }, mins*60*1000);
  } else {
    interaction.reply({ content: '⚠ Ця команда поки що працює в базовому режимі.', ephemeral: true });
  }
}
