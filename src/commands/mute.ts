import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
export const data = new SlashCommandBuilder()
  .setName('mute')
  .setDescription('🔇 Замутити користувача')
  .addUserOption(o=>o.setName('user').setDescription('Користувач').setRequired(true))
  .addIntegerOption(o=>o.setName('minutes').setDescription('Час у хвилинах').setRequired(true));
export async function execute(interaction: CommandInteraction) {
  const user = interaction.options.getUser('user', true);
  const member = await interaction.guild?.members.fetch(user.id);
  const mins = interaction.options.getInteger('minutes', true);
  if (!member?.voice) return interaction.reply({ content:'❌ Користувач не в голосовому каналі', ephemeral:true });
  await member.voice.setMute(true);
  await interaction.reply(`🔇 Замутено ${user.tag} на ${mins} хвилин`);
  setTimeout(()=>{ member.voice.setMute(false); }, mins*60000);
}
