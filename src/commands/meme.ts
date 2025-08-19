import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import fetch from 'node-fetch';
export const data = new SlashCommandBuilder().setName('meme').setDescription('Мем');
export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();
  try {
    const res = await fetch('https://meme-api.com/gimme');
    const j = await res.json();
    if (!j || !j.url) return interaction.editReply({ content: 'Немає мему' });
    await interaction.editReply({ content: j.title + '\n' + j.postLink, embeds: [{ image: { url: j.url } }] as any });
  } catch(e){ console.error(e); await interaction.editReply({ content: 'Помилка' }); }
}
