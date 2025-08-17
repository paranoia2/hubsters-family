# Hubsters Family Bot v4

Multifunctional Discord bot: music (YouTube/SoundCloud/Spotify links via play-dl), moderation, giveaways, welcomes, economy, fun, info.
Storage is plain JSON files — no flaky DB packages.

## Setup
1) Copy `.env.example` to `.env` and fill your tokens/IDs.
2) `npm install`
3) Register slash-commands: `npm run deploy`
4) Start bot: `npm start`

## Railway (free hosting)
- Add repo/files; set **NIXPACKS** or **Node.js** builder.
- **Environment variables**: from `.env` (DISCORD_TOKEN, CLIENT_ID, DEV_GUILD_ID, WELCOME_CHANNEL_ID, MODLOG_CHANNEL_ID).
- **Start Command**: `npm start`
- Create a **shell** and run once: `npm run deploy` to register commands.