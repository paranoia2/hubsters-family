const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const play = require('play-dl');

let player;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Включає музику з YouTube')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('Посилання на YouTube')
                .setRequired(true)
        ),
    async execute(interaction) {
        const url = interaction.options.getString('url');
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply('❌ Ти повинен бути у голосовому каналі!');
        }

        await interaction.reply(`🔊 Відтворюю: ${url}`);

        try {
            // Підключення до каналу
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });

            // Отримуємо стрім із play-dl
            const stream = await play.stream(url);
            const resource = createAudioResource(stream.stream, { inputType: stream.type });

            if (!player) player = createAudioPlayer();
            player.play(resource);
            connection.subscribe(player);

            // Події для контролю
            player.on(AudioPlayerStatus.Idle, () => {
                connection.destroy();
            });

        } catch (err) {
            console.error(err);
            interaction.followUp('⚠️ Сталася помилка при спробі відтворити трек.');
        }
    },
};
