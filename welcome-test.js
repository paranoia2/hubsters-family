import { SlashCommandBuilder, EmbedBuilder, ChannelType } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('welcome-test')
    .setDescription('Надіслати тестове привітання')
    .addChannelOption(opt => opt
      .setName('channel')
      .setDescription('Канал для привітання')
      .addChannelTypes(ChannelType.GuildText)
      .setRequired(false)
    ),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel') ||
      interaction.guild.channels.cache.get(process.env.WELCOME_CHANNEL_ID) ||
      interaction.channel;

    const embed = new EmbedBuilder()
      .setTitle('👋 Ласкаво просимо до Hubsters Family!')
      .setDescription(`Привіт, ${interaction.user}! Розмістися зручно та ознайомся з правилами.`)
      .setFooter({ text: 'Hubsters Family | Quant RP' })
      .setTimestamp();

    await channel.send({ embeds: [embed] });
    await interaction.reply({ content: '✅ Відправлено!', ephemeral: true });
  }
};
