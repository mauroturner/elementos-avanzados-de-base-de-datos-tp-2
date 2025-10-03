import { runQuery } from "./helper";

/**
 * Agrega una operación pendiente a la tabla 'pending_operations'
 * @param {string} opType 'INSERT' | 'UPDATE' | 'DELETE'
 * @param {string} tableName Nombre de la tabla afectada (ej: 'tasks')
 * @param {string} recordUuid UUID de la entidad afectada
 * @param {Object} payload Objeto con los datos de la operación
 */
export const addPendingOperation = async (
    opType,
    tableName,
    recordUuid,
    payload
) => {
    try {
        await runQuery(
            `INSERT INTO pending_operations (op_type, table_name, record_uuid, payload, attempts, created_at, updated_at)
       VALUES (?, ?, ?, ?, 0, datetime('now'), datetime('now'))`,
            [opType, tableName, recordUuid, JSON.stringify(payload)]
        );
    } catch (error) {
        console.error("Error agregando operación pendiente:", error);
        throw error;
    }
};
