# Discord Bot (TypeScript) — YouTube-only Music + Moderation + Giveaways + Games + Jokes + Birthdays

Quick start:
1. Copy `.env.example` to `.env` and fill `DISCORD_TOKEN` and `CLIENT_ID` (and `GUILD_ID` for quick register).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Register slash commands (optional for testing in one guild):
   ```bash
   npm run register
   ```
4. Run in dev (no build):
   ```bash
   npm run dev
   ```
or build and run:
   ```bash
   npm run build
   npm start
   ```

Notes:
- Music supports **YouTube only** using `play-dl` + `@discordjs/voice`.
- `ffmpeg-static` included; on some hosts you may need system ffmpeg.
- Database: SQLite via `better-sqlite3` (file `database.sqlite` will be created).
