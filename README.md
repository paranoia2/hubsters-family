# My Discord Bot (TypeScript) - Music + Birthdays

Quick start:
1. Copy `.env.example` to `.env` and fill `DISCORD_TOKEN` and `CLIENT_ID`.
2. Install deps:
   ```bash
   npm install
   ```
3. Register commands (optional to test in one guild quickly):
   ```bash
   npm run register
   ```
4. Build and run:
   ```bash
   npm run build
   npm start
   ```
Or for development (no build):
```bash
npm run dev
```

Features:
- Music (Distube): /play, /skip, /stop, /pause, /resume, /queue
- Music embed with song info and control buttons.
- Birthdays: /bday-add, /bday-list, /bday-remove + daily and next-day reminders.
- SQLite DB (`database.sqlite` created automatically).
