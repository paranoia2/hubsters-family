import { SlashCommandBuilder } from 'discord.js';
import { music } from '../music/queue.js';
export default { data:new SlashCommandBuilder().setName('play').setDescription('Відтворити трек')
.addStringOption(o=>o.setName('query').setDescription('URL або назва').setRequired(true)),
async execute(interaction){ const query=interaction.options.getString('query',true); const vc=interaction.member.voice.channel; if(!vc) return interaction.reply({content:'🎧 Зайди в голосовий канал', ephemeral:true}); await interaction.deferReply(); try{ const res=await music.enqueue({guild:interaction.guild, channel:vc, query, requestedBy:interaction.user}); await interaction.editReply(res.started?`▶️ Починаю: **${res.title}**`:`➕ Додано: **${res.title}**`);}catch(e){ console.error(e); await interaction.editReply('⚠️ Не вдалося'); } } };
