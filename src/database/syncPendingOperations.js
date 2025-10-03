import {
    addCategoryFirestore,
    addTaskFirestore,
    deleteCategoryFirestore,
    deleteTaskFirestore,
    updateCategoryFirestore,
    updateTaskFirestore,
} from "../services/FirestoreService";
import { fetchAll, runQuery } from "./helper";

/**
 * Sincroniza operaciones pendientes con Firestore.
 * Este script se puede llamar al iniciar la app y periódicamente mientras haya conexión.
 */
export const syncPendingOperations = async () => {
    try {
        // 1️⃣ Obtener operaciones pendientes
        const pendingOps = await fetchAll(
            "SELECT * FROM pending_operations ORDER BY created_at ASC;"
        );

        for (const op of pendingOps) {
            try {
                const payload = JSON.parse(op.payload);

                // 2️⃣ Determinar tabla y operación
                if (op.table_name === "tasks") {
                    if (op.op_type === "INSERT") {
                        const uuid = await addTaskFirestore(payload);
                        await markAsSynced(op.id, uuid);
                    } else if (op.op_type === "UPDATE") {
                        await updateTaskFirestore(op.record_uuid, payload);
                        await markAsSynced(op.id);
                    } else if (op.op_type === "DELETE") {
                        await deleteTaskFirestore(op.record_uuid);
                        await markAsSynced(op.id);
                    }
                } else if (op.table_name === "categories") {
                    if (op.op_type === "INSERT") {
                        const uuid = await addCategoryFirestore(payload);
                        await markAsSynced(op.id, uuid);
                    } else if (op.op_type === "UPDATE") {
                        await updateCategoryFirestore(op.record_uuid, payload);
                        await markAsSynced(op.id);
                    } else if (op.op_type === "DELETE") {
                        await deleteCategoryFirestore(op.record_uuid);
                        await markAsSynced(op.id);
                    }
                }
            } catch (innerError) {
                console.error("Error sincronizando operación:", op, innerError);
                // Incrementar intentos y guardar mensaje de error
                await runQuery(
                    "UPDATE pending_operations SET attempts = attempts + 1, last_error = ? WHERE id = ?",
                    [innerError.message, op.id]
                );
            }
        }
    } catch (error) {
        console.error("Error sincronizando operaciones pendientes:", error);
    }
};

/**
 * Marca la operación como sincronizada y actualiza el uuid si es nuevo
 */
const markAsSynced = async (id, newUuid = null) => {
    if (newUuid) {
        await runQuery(
            "UPDATE pending_operations SET synced = 1, record_uuid = ?, updated_at = datetime('now') WHERE id = ?",
            [newUuid, id]
        );
    } else {
        await runQuery(
            "UPDATE pending_operations SET synced = 1, updated_at = datetime('now') WHERE id = ?",
            [id]
        );
    }
};
