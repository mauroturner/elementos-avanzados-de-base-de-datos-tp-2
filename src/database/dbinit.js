// src/database/setupDatabase.js
import { fetchAll, runQuery } from "./helper";
import { initDb } from "./schema";
import { seedDb } from "./seeders";

/**
 * Migración de la tabla tasks:
 * - Agrega columnas uuid y synced si no existen
 * - Crea índice único sobre uuid
 */
async function migrateTasksTable() {
    try {
        // 1️⃣ Consultar metadatos de la tabla
        const columns = await fetchAll("PRAGMA table_info(tasks);");
        const colNames = columns.map((c) => c.name);

        // 2️⃣ Agregar columnas solo si no existen
        if (!colNames.includes("uuid")) {
            await runQuery("ALTER TABLE tasks ADD COLUMN uuid TEXT;");
            console.log("Columna 'uuid' agregada ✅");
        }

        if (!colNames.includes("synced")) {
            await runQuery(
                "ALTER TABLE tasks ADD COLUMN synced INTEGER DEFAULT 0;"
            );
            console.log("Columna 'synced' agregada ✅");
        }

        // 3️⃣ Crear índice único para uuid
        await runQuery(
            "CREATE UNIQUE INDEX IF NOT EXISTS idx_tasks_uuid ON tasks(uuid);"
        );
        console.log("Índice único 'idx_tasks_uuid' asegurado ✅");
    } catch (error) {
        console.error("Error en migración de tasks:", error);
    }
}

/**
 * Setup completo de la base de datos:
 * - Inicializa la base
 * - Aplica migraciones
 * - Inserta datos seed si no existen categorías
 */
export const setupDatabase = async () => {
    try {
        await initDb(); // Inicializa las tablas básicas
        await migrateTasksTable(); // Aplica migración de tasks

        // Semilla: si no hay categorías, insertar
        const categories = await fetchAll("SELECT * FROM categories;");
        if (categories.length === 0) {
            await seedDb();
            console.log("Base de datos inicializada con categorías seed ✅");
        }
    } catch (error) {
        console.error("Error inicializando base de datos:", error);
        throw error;
    }
};
