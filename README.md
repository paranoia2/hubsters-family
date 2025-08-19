# Discord Bot (TypeScript) — No Music + Reaction Roles + Memes + Jokes + Auto-News + Moderation + Giveaways + Games + Birthdays

Quick start:
1. Copy `.env.example` to `.env` and fill `DISCORD_TOKEN` and `CLIENT_ID` (and `GUILD_ID` for quick register).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Register slash commands (recommended to test in one guild):
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
- Music has been removed as requested.
- Reaction roles: `/reactrole-setup` creates a message with reactions mapped to role IDs.
- Memes: `/meme` fetches a meme from a public API (meme-api).
- Auto-news: add RSS with `/news-add <feed_url> <channel>` to post updates automatically.
- Database: SQLite via `better-sqlite3` (file `database.sqlite` will be created).
