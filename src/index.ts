import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { Client, Collection, GatewayIntentBits, Interaction } from 'discord.js';
import { setupDistube } from './utils/distube.js';
import Database from './utils/db.js';

type CommandModule = { data: any; execute: (interaction: Interaction) => Promise<any> };

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.commands = new Collection<string, CommandModule>();

// load commands
const commandsPath = path.join(process.cwd(), 'src', 'commands');
for (const file of fs.readdirSync(commandsPath)) {
  if (!file.endsWith('.ts') && !file.endsWith('.js')) continue;
  const mod = await import(path.join(commandsPath, file));
  client.commands.set(mod.data.name, mod);
}

// load events
const eventsPath = path.join(process.cwd(), 'src', 'events');
for (const file of fs.readdirSync(eventsPath)) {
  if (!file.endsWith('.ts') && !file.endsWith('.js')) continue;
  const mod = await import(path.join(eventsPath, file));
  if (mod.once) client.once(mod.name, (...args) => mod.execute(client, ...args));
  else client.on(mod.name, (...args) => mod.execute(client, ...args));
}

setupDistube(client);

client.db = Database;

client.login(process.env.DISCORD_TOKEN);
