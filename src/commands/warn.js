import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { getDb } from '../utils/jsondb.js';

export default {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Система попереджень')
    .addSubcommand(sc=>sc.setName('add').setDescription('Видати попередження')
      .addUserOption(o=>o.setName('user').setDescription('Кому').setRequired(true))
      .addStringOption(o=>o.setName('reason').setDescription('Причина').setRequired(true)))
    .addSubcommand(sc=>sc.setName('list').setDescription('Список попереджень')
      .addUserOption(o=>o.setName('user').setDescription('Користувач').setRequired(true)))
    .addSubcommand(sc=>sc.setName('clear').setDescription('Очистити попередження')
      .addUserOption(o=>o.setName('user').setDescription('Користувач').setRequired(true)))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const db = getDb('warns');
    const gid = interaction.guild.id;
    const sub = interaction.options.getSubcommand();
    const user = interaction.options.getUser('user', true);
    await db.read();
    const all = db.JSON() || {};
    all[gid] = all[gid] || {};
    all[gid][user.id] = all[gid][user.id] || [];
    if (sub === 'add') {
      const reason = interaction.options.getString('reason', true);
      all[gid][user.id].push({ reason, by: interaction.user.id, at: Date.now() });
      await db.write(all);
      await interaction.reply(`⚠️ Попередження для <@${user.id}>: **${reason}** (усього: ${all[gid][user.id].length})`);
    } else if (sub === 'list') {
      const list = all[gid][user.id];
      if (!list.length) return interaction.reply('✅ Попереджень нема');
      const text = list.map((w,i)=>`${i+1}. ${w.reason} — <@${w.by}> (${new Date(w.at).toLocaleString()})`).join('\n');
      await interaction.reply(`📋 Попередження для <@${user.id}>:\n${text}`);
    } else {
      all[gid][user.id] = [];
      await db.write(all);
      await interaction.reply(`🧹 Очищено попередження для <@${user.id}>`);
    }
  }
};
