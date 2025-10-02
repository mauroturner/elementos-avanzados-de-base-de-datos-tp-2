import { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { fetchAll, runQuery } from "../../src/database/helper";

export default function TasksScreen() {
    const [tasks, setTasks] = useState([]);

    // Cargar tareas desde DB
    const loadTasks = async () => {
        try {
            const result = await fetchAll(`
        SELECT t.*, c.name as category_name
        FROM tasks t
        LEFT JOIN categories c ON t.category_id = c.id
        ORDER BY t.due_at ASC
      `);
            setTasks(result);
        } catch (error) {
            console.error("Error cargando tareas:", error);
        }
    };

    useEffect(() => {
        loadTasks();
    }, []);

    // Marcar tarea completada
    const toggleDone = async (task) => {
        try {
            await runQuery(
                "UPDATE tasks SET is_done = ?, updated_at = datetime('now') WHERE id = ?",
                [task.is_done ? 0 : 1, task.id]
            );
            loadTasks();
        } catch (error) {
            console.error("Error actualizando tarea:", error);
        }
    };

    // Eliminar tarea
    const deleteTask = (task) => {
        Alert.alert(
            "Eliminar tarea",
            `¿Seguro quieres eliminar "${task.title}"?`,
            [
                { text: "Cancelar" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await runQuery("DELETE FROM tasks WHERE id = ?", [
                                task.id,
                            ]);
                            loadTasks();
                        } catch (error) {
                            console.error("Error eliminando tarea:", error);
                        }
                    },
                },
            ]
        );
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.taskItem, item.is_done && styles.taskDone]}
            onPress={() => toggleDone(item)}
            onLongPress={() => deleteTask(item)}
        >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.category}>
                {item.category_name || "Sin categoría"}
            </Text>
            <Text style={styles.due}>
                Vence:{" "}
                {item.due_at ? new Date(item.due_at).toLocaleString() : "-"}
            </Text>
            <Text style={styles.status}>
                {item.is_done ? "✅ Completada" : "❌ Pendiente"}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {tasks.length === 0 ? (
                <Text style={styles.empty}>No hay tareas</Text>
            ) : (
                <FlatList
                    data={tasks}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 100 }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#f2f2f2" },
    taskItem: {
        padding: 12,
        backgroundColor: "#fff",
        borderRadius: 8,
        marginBottom: 12,
    },
    taskDone: { backgroundColor: "#d4edda" },
    title: { fontSize: 16, fontWeight: "bold" },
    category: { fontSize: 14, color: "#555" },
    due: { fontSize: 12, color: "#888" },
    status: { fontSize: 12, fontWeight: "600", marginTop: 4 },
    empty: { textAlign: "center", marginTop: 50, fontSize: 16, color: "#666" },
});
