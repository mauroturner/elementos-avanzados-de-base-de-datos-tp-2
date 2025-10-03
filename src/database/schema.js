import { getDb } from "./db";

export const initDb = async () => {
    try {
        const db = await getDb();
        await db.execAsync(`
        -- Categorías
        CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          uuid TEXT UNIQUE NOT NULL,
          name TEXT UNIQUE NOT NULL,
          synced INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- Tareas
        CREATE TABLE IF NOT EXISTS tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          uuid TEXT UNIQUE,
          title TEXT NOT NULL,
          description TEXT,
          is_done INTEGER DEFAULT 0,
          due_at DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          category_id INTEGER,
          synced INTEGER DEFAULT 0,
          FOREIGN KEY (category_id) REFERENCES categories(id)
        );

        -- Operaciones pendientes
        CREATE TABLE IF NOT EXISTS pending_operations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          op_type TEXT NOT NULL,        -- 'INSERT' | 'UPDATE' | 'DELETE'
          table_name TEXT NOT NULL,     -- 'tasks' o 'categories'
          record_uuid TEXT,             -- uuid de la entidad (si aplica)
          payload TEXT NOT NULL,        -- JSON string con los datos (por ejemplo, toda la tarea)
          attempts INTEGER DEFAULT 0,
          last_error TEXT,
          created_at TEXT DEFAULT (datetime('now')),
          updated_at TEXT DEFAULT (datetime('now')),
          synced INTEGER DEFAULT 0
        );
    `);
    } catch (error) {
        throw error;
    }
};
