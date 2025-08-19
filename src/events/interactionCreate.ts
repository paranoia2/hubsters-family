import type { Client, Interaction } from 'discord.js';

export const name = 'interactionCreate';
export const once = false;
export async function execute(client: Client, interaction: Interaction) {
  if (interaction.isChatInputCommand && interaction.isChatInputCommand()) {
    const cmd = client.commands.get(interaction.commandName);
    if (!cmd) return;
    try { await cmd.execute(interaction); } catch(e){ console.error(e); if (!interaction.replied) await interaction.reply({ content:'❌ Error', ephemeral:true }); }
    return;
  }
  if (interaction.isButton && interaction.isButton()) {
    await interaction.deferReply({ ephemeral: true });
    await interaction.editReply('Кнопка натиснута');
  }
}
