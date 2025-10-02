import { getDb } from "./db";

/**
 * Ejecuta una consulta de escritura (INSERT, UPDATE, DELETE)
 * @param {string} query
 * @param {Array|Object} params
 */
export const runQuery = async (query, params = []) => {
    try {
        const db = await getDb();
        console.log("Ejecutando query:", query);
        console.log("Con parámetros:", params);

        // Si es un objeto, convertir a array para db.runAsync
        let args = Array.isArray(params) ? params : Object.values(params);

        const result = await db.runAsync(query, ...args);
        return result; // contiene lastInsertRowId y changes
    } catch (error) {
        console.error("Error en runQuery:", error);
        throw error;
    }
};

/**
 * Devuelve todos los registros de un SELECT
 * @param {string} query
 * @param {Array|Object} params
 */
export const fetchAll = async (query, params = []) => {
    try {
        const db = await getDb();
        let args = Array.isArray(params) ? params : Object.values(params);
        const rows = await db.getAllAsync(query, ...args);
        return rows;
    } catch (error) {
        console.error("Error en fetchAll:", error);
        throw error;
    }
};
