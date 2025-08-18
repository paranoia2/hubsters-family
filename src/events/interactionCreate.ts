import type { Client, Interaction } from 'discord.js';
import { getDistube } from '../utils/distube.js';

export const name = 'interactionCreate';
export const once = false;

export async function execute(client: Client, interaction: Interaction) {
  if (interaction.isChatInputCommand && interaction.isChatInputCommand()) {
    const cmd = client.commands.get(interaction.commandName);
    if (!cmd) return;
    try { await cmd.execute(interaction); } catch(e){ console.error(e); await interaction.reply({ content: '❌ Error', ephemeral: true }); }
    return;
  }

  if (interaction.isButton && interaction.isButton()) {
    const distube = getDistube();
    const queue = distube.getQueue(interaction.guildId!);
    if (!queue) return interaction.reply({ content: '❌ Нічого не грає', ephemeral: true });

    await interaction.deferReply({ ephemeral: true });

    if (interaction.customId === 'pause_btn') {
      queue.pause();
      await interaction.editReply('⏸ Пауза');
    } else if (interaction.customId === 'resume_btn') {
      queue.resume();
      await interaction.editReply('▶️ Продовжено');
    } else if (interaction.customId === 'skip_btn') {
      queue.skip();
      await interaction.editReply('⏭ Скіп');
    } else if (interaction.customId === 'stop_btn') {
      queue.stop();
      await interaction.editReply('⏹ Стоп');
    }
  }
}
