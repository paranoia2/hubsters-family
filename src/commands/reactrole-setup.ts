import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
import { addReactionRole } from '../utils/db.js';
export const data = new SlashCommandBuilder().setName('reactrole-setup').setDescription('Setup react role').addChannelOption(o=>o.setName('channel').setDescription('Канал').setRequired(true)).addStringOption(o=>o.setName('emoji').setDescription('Емодзі').setRequired(true)).addRoleOption(o=>o.setName('role').setDescription('Роль').setRequired(true)).addStringOption(o=>o.setName('message').setDescription('Текст').setRequired(true));
export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)) return interaction.reply({ content:'Немає прав', ephemeral:true });
  const channel = interaction.options.getChannel('channel', true);
  const emoji = interaction.options.getString('emoji', true);
  const role = interaction.options.getRole('role', true);
  const text = interaction.options.getString('message', true);
  const m = await (channel as any).send(text);
  await m.react(emoji);
  addReactionRole(m.id, interaction.guildId!, emoji, role.id);
  await interaction.reply({ content:'✅ Створено', ephemeral:true });
}
