import { fetchAll, runQuery } from "./helper";

export const seedDb = async () => {
    try {
        // 1️⃣ Insertar categorías
        const categories = [
            "Categoría 1",
            "Categoría 2",
            "Categoría 3",
            "Categoría 4",
        ];

        for (const name of categories) {
            await runQuery(
                "INSERT OR IGNORE INTO categories (name) VALUES ($name);",
                { $name: name }
            );
            console.log("✅ Intento de inserción categoría:", name);
        }

        // 2️⃣ Obtener IDs reales de categorías
        const existingCategories = await fetchAll("SELECT * FROM categories;");
        console.log("Categorias existenes:", existingCategories);
        const categoryMap = {};
        existingCategories.forEach((cat) => {
            categoryMap[cat.name] = cat.id;
        });

        // 3️⃣ Insertar tareas de ejemplo usando IDs reales
        const tasks = [
            {
                title: "Tarea 1",
                description: "Descripción de la tarea 1",
                is_done: 0,
                due_at: "2025-09-15 18:00:00",
                category_id: categoryMap["Categoría 2"],
            },
            {
                title: "Tarea 2",
                description: "Descripción de la tarea 2",
                is_done: 0,
                due_at: "2025-09-10 20:00:00",
                category_id: categoryMap["Categoría 3"],
            },
            {
                title: "Tarea 3",
                description: "Descripción de la tarea 3",
                is_done: 0,
                due_at: "2025-09-10 20:00:00",
                category_id: categoryMap["Categoría 4"],
            },
            {
                title: "Tarea 4",
                description: "Descripción de la tarea 4",
                is_done: 0,
                due_at: "2025-09-10 20:00:00",
                category_id: categoryMap["Categoría 4"],
            },
            {
                title: "Tarea 5",
                description: "Descripción de la tarea 5",
                is_done: 0,
                due_at: "2025-09-10 20:00:00",
                category_id: categoryMap["Categoría 4"],
            },
            {
                title: "Tarea 6",
                description: "Descripción de la tarea 6",
                is_done: 0,
                due_at: "2025-09-10 20:00:00",
                category_id: categoryMap["Categoría 4"],
            },
            {
                title: "Tarea 7",
                description: "Descripción de la tarea 7",
                is_done: 0,
                due_at: "2025-09-09 20:00:00",
                category_id: categoryMap["Categoría 4"],
            },
            {
                title: "Tarea 8",
                description: "Descripción de la tarea 8",
                is_done: 0,
                due_at: "2025-09-09 20:00:00",
                category_id: categoryMap["Categoría 4"],
            },
        ];

        for (const t of tasks) {
            try {
                await runQuery(
                    `INSERT INTO tasks
          (title, description, is_done, due_at, category_id, created_at, updated_at)
          VALUES
          ($title, $description, $is_done, $due_at, $category_id, datetime('now'), datetime('now'));`,
                    {
                        $title: t.title,
                        $description: t.description,
                        $is_done: t.is_done,
                        $due_at: t.due_at,
                        $category_id: t.category_id,
                    }
                );
                console.log("✅ Tarea insertada:", t.title);
            } catch (e) {
                if (e.message.includes("UNIQUE constraint failed")) {
                    console.log("ℹ️ Tarea ya existe, se ignora:", t.title);
                } else {
                    throw e;
                }
            }
        }

        console.log("Seeder ejecutado correctamente");
    } catch (error) {
        console.error("Error al ejecutar el seeder:", error);
        throw error;
    }
};
