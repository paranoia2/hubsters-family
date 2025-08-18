import type { Client, Interaction } from 'discord.js';
import { pause, resume, skip, stop } from '../utils/player.js';
export const name = 'interactionCreate'; export const once = false;
export async function execute(client: Client, interaction: Interaction) {
  if (interaction.isChatInputCommand && interaction.isChatInputCommand()) {
    const cmd = client.commands.get(interaction.commandName);
    if (!cmd) return;
    try { await cmd.execute(interaction); } catch(e){ console.error(e); await interaction.reply({ content:'❌ Error', ephemeral:true }); }
    return;
  }
  if (interaction.isButton && interaction.isButton()) {
    await interaction.deferReply({ ephemeral: true });
    if (interaction.customId === 'pause_btn') { pause(interaction.guildId!); await interaction.editReply('⏸ Пауза'); }
    else if (interaction.customId === 'resume_btn') { resume(interaction.guildId!); await interaction.editReply('▶️ Продовжено'); }
    else if (interaction.customId === 'skip_btn') { skip(interaction.guildId!); await interaction.editReply('⏭ Скіп'); }
    else if (interaction.customId === 'stop_btn') { stop(interaction.guildId!); await interaction.editReply('⏹ Стоп'); }
  }
}
