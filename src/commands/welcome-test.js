import { SlashCommandBuilder, ChannelType, EmbedBuilder } from 'discord.js';
export default { data: new SlashCommandBuilder().setName('welcome-test').setDescription('Надіслати тестове привітання')
.addChannelOption(o=>o.setName('channel').setDescription('Канал').addChannelTypes(ChannelType.GuildText)),
async execute(interaction){ const ch = interaction.options.getChannel('channel') || interaction.guild.channels.cache.get(process.env.WELCOME_CHANNEL_ID) || interaction.channel; const emb = new EmbedBuilder().setTitle('👋 Ласкаво просимо до Hubsters Family!').setTimestamp(); await ch.send({embeds:[emb]}); await interaction.reply({content:'✅', ephemeral:true}); } };
