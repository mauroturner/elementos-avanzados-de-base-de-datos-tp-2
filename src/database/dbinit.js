import { fetchAll } from "./helper";
import { initDb } from "./schema";
import { seedDb } from "./seeders";

export const setupDatabase = async () => {
    try {
        await initDb();
        const categories = await fetchAll("SELECT * FROM categories;");
        if (categories.length === 0) {
            await seedDb();
        }
    } catch (error) {
        console.error("Error inicializando base de datos:", error);
        throw error;
    }
};
