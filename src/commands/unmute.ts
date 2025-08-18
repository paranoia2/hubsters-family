import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
export const data = new SlashCommandBuilder()
  .setName('unmute')
  .setDescription('🔊 Зняти мут')
  .addUserOption(o=>o.setName('user').setDescription('Користувач').setRequired(true));
export async function execute(interaction: CommandInteraction) {
  const user = interaction.options.getUser('user', true);
  const member = await interaction.guild?.members.fetch(user.id);
  if (!member?.voice) return interaction.reply({ content:'❌ Користувач не в голосовому каналі', ephemeral:true });
  await member.voice.setMute(false);
  await interaction.reply(`🔊 Знято мут для ${user.tag}`);
}
