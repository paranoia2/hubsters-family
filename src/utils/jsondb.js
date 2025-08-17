import fs from "fs"

const DB_FILE = "./db.json"

// Читання БД
function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify({ users: [] }, null, 2))
    }
    const data = fs.readFileSync(DB_FILE, "utf8")
    return JSON.parse(data)
  } catch (err) {
    console.error("Помилка при читанні db.json:", err)
    return { users: [] }
  }
}

// Запис БД
function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2))
  } catch (err) {
    console.error("Помилка при записі db.json:", err)
  }
}

export default {
  getData: () => readDB(),
  setData: (newData) => writeDB(newData),
  addUser: (user) => {
    const db = readDB()
    db.users.push(user)
    writeDB(db)
  },
  removeUser: (id) => {
    const db = readDB()
    db.users = db.users.filter(u => u.id !== id)
    writeDB(db)
  },
  clearUsers: () => {
    writeDB({ users: [] })
  }
}
