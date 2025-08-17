import { SlashCommandBuilder } from 'discord.js'
export default {
  data: new SlashCommandBuilder().setName('userinfo').setDescription('Інфо про користувача').addUserOption(o=>o.setName('target').setDescription('Користувач')),
  async execute(interaction) {
    const u = interaction.options.getUser('target') || interaction.user
    await interaction.reply(`👤 ${u.tag} | 🆔 ${u.id}`)
  }
}
