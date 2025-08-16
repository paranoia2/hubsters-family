import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Заблокувати користувача')
    .addUserOption(o => o.setName('user').setDescription('Кого банимо').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Причина').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('user', true);
    const reason = interaction.options.getString('reason') || 'No reason';
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: '⚠️ Не знайшов такого учасника на сервері.', ephemeral: true });
    await member.ban({ reason });
    await interaction.reply(`🔨 Заблоковано ${user.tag}. Причина: ${reason}`);
  }
};
