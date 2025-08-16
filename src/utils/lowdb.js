import { JSONFilePreset } from 'lowdb/node'

// створюємо/читаємо базу (файл зберігатиметься як data.json)
const db = await JSONFilePreset('data.json', {
  warns: {},
  giveaways: {},
  history: []
})

// функція додавання числа (якщо потрібно для рулетки)
export async function addNumber(num) {
  db.data.history.push(num)
  await db.write()
}

// функція отримання останніх чисел
export function getHistory(limit = 10) {
  return db.data.history.slice(-limit)
}

// ⚠️ зберігання варнів
export async function addWarn(userId, reason) {
  if (!db.data.warns[userId]) db.data.warns[userId] = []
  db.data.warns[userId].push({ reason, date: new Date().toISOString() })
  await db.write()
}

export function getWarns(userId) {
  return db.data.warns[userId] || []
}

export async function clearWarns(userId) {
  delete db.data.warns[userId]
  await db.write()
}

// 🎉 зберігання розіграшів
export async function saveGiveaway(id, data) {
  db.data.giveaways[id] = data
  await db.write()
}

export function getGiveaway(id) {
  return db.data.giveaways[id]
}

export async function removeGiveaway(id) {
  delete db.data.giveaways[id]
  await db.write()
}

export default db
