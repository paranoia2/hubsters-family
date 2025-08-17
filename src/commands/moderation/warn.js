import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js'
import { db } from '../../utils/jsondb.js'
export default {
  data: new SlashCommandBuilder().setName('warn')
    .setDescription('Попередження')
    .addSubcommand(s=>s.setName('add').setDescription('Додати')
      .addUserOption(o=>o.setName('user').setDescription('Кому').setRequired(true))
      .addStringOption(o=>o.setName('reason').setDescription('Причина').setRequired(true)))
    .addSubcommand(s=>s.setName('list').setDescription('Список')
      .addUserOption(o=>o.setName('user').setDescription('Користувач').setRequired(true)))
    .addSubcommand(s=>s.setName('clear').setDescription('Очистити')
      .addUserOption(o=>o.setName('user').setDescription('Користувач').setRequired(true)))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const sub = interaction.options.getSubcommand()
    const user = interaction.options.getUser('user')
    if (sub === 'add') {
      const reason = interaction.options.getString('reason')
      const arr = db.pushWarn(user.id, reason)
      await interaction.reply(`⚠️ ${user.tag} отримав попередження: ${reason}. Всього: ${arr.length}`)
    } else if (sub === 'list') {
      const list = (db.get('warns')?.[user.id] || []).map((w,i)=>`#${i+1} • ${w.reason} • ${w.date}`).join('\n') || 'Немає'
      await interaction.reply(`⚠️ Попередження для ${user.tag}:\n${list}`)
    } else if (sub === 'clear') {
      db.clearWarns(user.id)
      await interaction.reply(`🗑 Очищено попередження для ${user.tag}`)
    }
  }
}
