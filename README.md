# Hubsters Family Bot — Phase 1 (Base)

Функції в цій збірці:
- Slash-команди: `/ping`, `/welcome-test`, `/purge`, `/ban`, `/kick`, `/giveaway`, `/gradient`
- Вітання нових учасників (якщо вказано `WELCOME_CHANNEL_ID`)
- Розіграші з реакцією 🎉 і автоматичним вибором переможців
- Базова модерація (ban/kick/purge)
- "Градієнт" ролей: створення набору кольорових ролей, якими можна керувати (це **не** кольорові літери в ніку — Discord такого не підтримує). Колір імені в учасника визначається **найвищою кольоровою роллю**.

## Швидкий старт локально
1) Встанови Node.js 18+
2) Розпакуй проект → у корені створи файл `.env` на основі `.env.example` і заповни:
```
DISCORD_TOKEN=...
CLIENT_ID=...
DEV_GUILD_ID=...   # для швидкої реєстрації команд
WELCOME_CHANNEL_ID=...  # опційно
```
3) Встанови залежності:
```
npm install
```
4) Зареєструй slash-команди у DEV сервері:
```
npm run deploy
```
5) Запусти бота:
```
npm start
```

## Деплой на безкоштовний хостинг (Railway)
1) Створи новий проект → "Deploy from GitHub" або "Empty Project".
2) Завантаж Файли цього проекту у свій GitHub репозиторій (або імпорт з zip).
3) На Railway → New → GitHub Repo → вибери репозиторій.
4) У "Variables" додай:
   - `DISCORD_TOKEN`
   - `CLIENT_ID`
   - `WELCOME_CHANNEL_ID` (опційно)
   - `DEV_GUILD_ID` (для deploy з контейнера — разова дія)
5) Встанови "Start Command": `npm start` (Railway визначить сам).
6) Перед першим стартом виконай `npm run deploy` у Railway "Shell" (або локально), щоб зареєструвати slash-команди.
7) Перезапусти сервіс.

## Як додати бота на сервер
1) У Discord Developer Portal → OAuth2 → URL Generator:
   - Scopes: `bot`, `applications.commands`
   - Bot Permissions (мінімум): Manage Roles, Manage Nicknames, Kick Members, Ban Members, Manage Messages, Read Message History, Send Messages, Embed Links, Add Reactions, Use External Emojis, View Channel, Connect/Speak (для музики у Phase 2).
2) Згенеруй посилання, відкрий його та додай бота на свій сервер.

## Обмеження градієнту
Справжній градієнт **в ніку по літерах** у Discord неможливий. Ми робимо керування **кольоровими ролями** і можемо створити набір ролей-градiєнту. Колір відображення імені користувача у списку учасників = колір **найвищої** ролі. Команди `/gradient create-roles`, `/gradient apply`, `/gradient cleanup` допомагають з цим.

## Команди (огляд)
- `/ping` — перевірка роботи.
- `/welcome-test` — надіслати тестове привітання у вказаний канал (або в поточний).
- `/purge amount:<1..100>` — видалити N повідомлень у поточному каналі.
- `/ban user reason` — бан учасника.
- `/kick user reason` — кік учасника.
- `/giveaway start duration winners prize` — створити розіграш.
- `/giveaway reroll message` — переобрати переможців для існуючого повідомлення з розіграшем.
- `/gradient create-roles start_color end_color steps prefix` — створити набір кольорових ролей.
- `/gradient apply user role_name` — видати роль з набору.
- `/gradient cleanup prefix` — видалити ролі з префіксом.
