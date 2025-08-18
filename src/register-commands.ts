import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';

const commands: any[] = [];
const commandsPath = path.join(process.cwd(), 'src', 'commands');
for (const file of fs.readdirSync(commandsPath)) {
  if (!file.endsWith('.ts') && !file.endsWith('.js')) continue;
  const mod = await import(path.join(commandsPath, file));
  commands.push(mod.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
const CLIENT_ID = process.env.CLIENT_ID!;
const GUILD_ID = process.env.GUILD_ID; // optional

(async () => {
  try {
    if (!CLIENT_ID) throw new Error('CLIENT_ID is required in .env');
    if (GUILD_ID) {
      console.log('Registering guild commands...');
      await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
      console.log('Guild commands registered.');
    } else {
      console.log('Registering global commands (may take up to 1 hour)...');
      await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
      console.log('Global commands registered.');
    }
  } catch (e) {
    console.error(e);
  }
})();
