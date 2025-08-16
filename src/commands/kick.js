import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Вигнати користувача')
    .addUserOption(o => o.setName('user').setDescription('Кого кікнути').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Причина').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('user', true);
    const reason = interaction.options.getString('reason') || 'No reason';
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: '⚠️ Не знайшов такого учасника на сервері.', ephemeral: true });
    await member.kick(reason);
    await interaction.reply(`👢 Вигнано ${user.tag}. Причина: ${reason}`);
  }
};
