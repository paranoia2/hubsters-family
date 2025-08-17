import { SlashCommandBuilder } from 'discord.js'
export default {
  data: new SlashCommandBuilder().setName('joke').setDescription('Випадковий жарт'),
  async execute(interaction) {
    // Без зовнішнього API: локальний набір
    const jokes = [
      'Програмісти не літають, бо баги не дають крилам зібратися.',
      '99 маленьких багів у коді... 99 багів у коді...',
      'Сьогодні не працює? Значить, вчора не розумів, чому працювало.'
    ]
    const j = jokes[Math.floor(Math.random()*jokes.length)]
    await interaction.reply(`😄 ${j}`)
  }
}
