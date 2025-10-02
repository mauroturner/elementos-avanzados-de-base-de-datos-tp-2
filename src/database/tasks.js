import { fetchAll } from "../db/helper";
import { getDb } from "./database";

export const getTasksByDate = async (date) => {
    const db = await getDb();

    // Convertimos a YYYY-MM-DD
    const dayString = date.toISOString().split("T")[0];

    const rows = await fetchAll(
        `SELECT t.*, c.name as category_name
     FROM tasks t
     LEFT JOIN categories c ON t.category_id = c.id
     WHERE DATE(t.due_at) = ?
     ORDER BY t.due_at ASC`,
        [dayString]
    );

    return rows;
};
