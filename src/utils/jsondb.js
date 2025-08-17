import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataDir = path.join(__dirname, '..', '..', 'data')
const dbFile = path.join(dataDir, 'db.json')

export async function ensureDataFiles() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
  if (!fs.existsSync(dbFile)) {
    const initial = {
      warns: {},
      economy: {},
      giveaways: {},
      modlogChannelId: null,
      welcomeChannelId: null,
      musicQueues: {},
      family: []
    }
    fs.writeFileSync(dbFile, JSON.stringify(initial, null, 2))
  }
}

function readDB() {
  if (!fs.existsSync(dbFile)) {
    fs.writeFileSync(dbFile, JSON.stringify({}, null, 2))
  }
  return JSON.parse(fs.readFileSync(dbFile, 'utf8') || '{}')
}

function writeDB(data) {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2))
}

export const db = {
  get: (key) => {
    const d = readDB()
    return key ? d[key] : d
  },
  set: (key, value) => {
    const d = readDB()
    d[key] = value
    writeDB(d)
    return value
  },
  pushWarn: (userId, reason) => {
    const d = readDB()
    d.warns ||= {}
    d.warns[userId] ||= []
    d.warns[userId].push({ reason, date: new Date().toISOString() })
    writeDB(d)
    return d.warns[userId]
  },
  clearWarns: (userId) => {
    const d = readDB()
    if (d.warns) delete d.warns[userId]
    writeDB(d)
  },
  econAdd: (userId, amount) => {
    const d = readDB()
    d.economy ||= {}
    d.economy[userId] = (d.economy[userId] || 0) + amount
    writeDB(d)
    return d.economy[userId]
  },
  econGet: (userId) => (readDB().economy?.[userId] || 0),
  econSet: (userId, amount) => {
    const d = readDB()
    d.economy ||= {}
    d.economy[userId] = amount
    writeDB(d)
  },
  familyAdd: (userId) => {
    const d = readDB()
    d.family ||= []
    if (!d.family.includes(userId)) d.family.push(userId)
    writeDB(d)
  },
  familyList: () => (readDB().family || []),
}
