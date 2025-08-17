import { SlashCommandBuilder } from 'discord.js'
const answers = ['Так','Ні','Можливо','Спробуй пізніше','Сумнівно','Однозначно так','Скоріше ні','Ймовірно']
export default {
  data: new SlashCommandBuilder().setName('8ball').setDescription('Магічна куля').addStringOption(o=>o.setName('question').setDescription('Питання').setRequired(true)),
  async execute(interaction) {
    const question = interaction.options.getString('question')
    const ans = answers[Math.floor(Math.random()*answers.length)]
    await interaction.reply(`🎱 **Питання:** ${question}\n**Відповідь:** ${ans}`)
  }
}
