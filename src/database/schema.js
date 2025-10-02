import { getDb } from "./db";

export const initDb = async () => {
    try {
        const db = await getDb();
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL
      );

      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        is_done INTEGER DEFAULT 0,
        due_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        category_id INTEGER,
        FOREIGN KEY (category_id) REFERENCES categories(id)
      );
    `);
    } catch (error) {
        throw error;
    }
};
