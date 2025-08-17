import 'dotenv/config'
import { Client, GatewayIntentBits, Partials, Collection, ActivityType, Events } from 'discord.js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'
import chalk from 'chalk'
import { ensureDataFiles, db } from './utils/jsondb.js'
import { onGuildMemberAdd } from './events/welcome.js'
import { setupModLog } from './utils/modlog.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Create client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel, Partials.GuildMember, Partials.Message, Partials.User]
})

client.commands = new Collection()

// Load commands dynamically
const commandsPath = join(__dirname, 'commands')
const folders = fs.readdirSync(commandsPath)
for (const folder of folders) {
  const folderPath = join(commandsPath, folder)
  const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.js'))
  for (const file of files) {
    const filePath = join(folderPath, file)
    const cmd = (await import('file://' + filePath)).default
    if (cmd?.data?.name) {
      client.commands.set(cmd.data.name, cmd)
    } else {
      console.warn('Skipping command without data.name:', filePath)
    }
  }
}

// Events
client.once(Events.ClientReady, async (c) => {
  console.log(chalk.green(`✅ Logged in as ${c.user.tag}`))
  c.user.setActivity('Hubsters Family', { type: ActivityType.Playing })
  await ensureDataFiles()
  setupModLog(client)
})

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand() && !interaction.isButton()) return
  if (interaction.isButton()) {
    // button handlers could live here (roles, giveaways) – left minimal
    return
  }
  const command = client.commands.get(interaction.commandName)
  if (!command) return
  try {
    await command.execute(interaction, client)
  } catch (err) {
    console.error(err)
    if (interaction.deferred || interaction.replied) {
      await interaction.followUp({ content: '❌ Сталася помилка при виконанні команди.', ephemeral: true })
    } else {
      await interaction.reply({ content: '❌ Сталася помилка при виконанні команди.', ephemeral: true })
    }
  }
})

// Welcome event
client.on(Events.GuildMemberAdd, (member) => onGuildMemberAdd(member))

// Login
if (!process.env.DISCORD_TOKEN) {
  console.error('Missing DISCORD_TOKEN in env')
  process.exit(1)
}
client.login(process.env.DISCORD_TOKEN)
