import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
const jokes = [
  'Чому програмісти люблять каву? ☕ Бо без неї баги в коді множаться!',
  'Я хотів написати жарт про рекурсію, але...',
  'Якщо ви чуєте “undefined is not a function”, не панікуйте — це просто JavaScript.',
  'Сьогодні я знову відклaв дієту на завтра 😅'
];
export const data = new SlashCommandBuilder().setName('joke').setDescription('Рандомний анекдот');
export async function execute(interaction: CommandInteraction) {
  const j = jokes[Math.floor(Math.random()*jokes.length)];
  await interaction.reply(j);
}
