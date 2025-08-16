// src/utils/jsondb.js
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

// Створюємо адаптер для JSON
const adapter = new JSONFile('db.json')

// Створюємо інстанс Low з початковими даними
const db = new Low(adapter, { users: [] })

// Завантажуємо дані з файлу (або створюємо новий)
await db.read()

// Якщо файл порожній → ініціалізуємо дефолтними даними
db.data ||= { users: [] }
await db.write()

export default db
