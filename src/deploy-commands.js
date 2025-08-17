import 'dotenv/config'
import fs from 'fs'
import { REST, Routes } from 'discord.js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const commands = []
const commandsPath = join(__dirname, 'commands')
const folders = fs.readdirSync(commandsPath)
for (const folder of folders) {
  const folderPath = join(commandsPath, folder)
  const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.js'))
  for (const file of files) {
    const cmd = (await import('file://' + join(folderPath, file))).default
    if (cmd?.data) {
      commands.push(cmd.data.toJSON())
    }
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN)

try {
  if (process.env.DEV_GUILD_ID) {
    const data = await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.DEV_GUILD_ID), { body: commands })
    console.log(`✅ Loaded ${data.length} guild commands`)
  } else {
    const data = await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands })
    console.log(`✅ Loaded ${data.length} global commands`)
  }
} catch (e) {
  console.error('Deploy error:', e)
}
