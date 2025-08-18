import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
export const data = new SlashCommandBuilder().setName('rps').setDescription('Камінь/Ножиці/Папір').addStringOption(o=>o.setName('choice').setRequired(true).addChoices({name:'Камінь', value:'rock'},{name:'Ножиці', value:'scissors'},{name:'Папір', value:'paper'}));
export async function execute(interaction: CommandInteraction) {
  const user = interaction.options.getString('choice', true);
  const choices = ['rock','paper','scissors'];
  const bot = choices[Math.floor(Math.random()*3)];
  let res = '';
  if (user === bot) res = 'Нічия';
  else if ((user==='rock' && bot==='scissors') || (user==='scissors' && bot==='paper') || (user==='paper' && bot==='rock')) res = 'Ти виграв! 🎉';
  else res = 'Бот виграв 😢';
  await interaction.reply(`Ти: ${user}\nБот: ${bot}\nРезультат: ${res}`);
}
