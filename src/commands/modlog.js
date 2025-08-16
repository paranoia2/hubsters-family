import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { getDb } from '../utils/jsondb.js';

export default {
  data: new SlashCommandBuilder()
    .setName('modlog')
    .setDescription('Налаштування журналу модерації')
    .addSubcommand(sc=>sc.setName('set').setDescription('Вказати канал')
      .addChannelOption(o=>o.setName('channel').setDescription('Канал').setRequired(true)))
    .addSubcommand(sc=>sc.setName('test').setDescription('Надіслати тестове повідомлення'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    const db = getDb('config'); await db.read(); const cfg = db.JSON() || {};
    const gid = interaction.guild.id; cfg[gid] = cfg[gid] || {};
    const sub = interaction.options.getSubcommand();
    if (sub === 'set') {
      const ch = interaction.options.getChannel('channel', true);
      cfg[gid].modlog = ch.id; await db.write(cfg);
      await interaction.reply(`📝 ModLog канал: <#${ch.id}>`);
    } else {
      const chId = cfg[gid].modlog; if (!chId) return interaction.reply({content:'Не налаштовано', ephemeral:true});
      await interaction.guild.channels.cache.get(chId)?.send('✅ ModLog працює');
      await interaction.reply({content:'Надіслано тест', ephemeral:true});
    }
  }
};
