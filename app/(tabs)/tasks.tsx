import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { fetchAll, runQuery } from "../../src/database/helper";

// Tipado de Task
interface Task {
  id: number;
  title: string;
  description: string;
  category_id?: number;
  category_name?: string;
  due_at?: string;
  is_done: number; // 0 o 1
  created_at?: string;
  updated_at?: string;
}

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const router = useRouter();

  const loadTasks = async () => {
    try {
      const result: Task[] = await fetchAll(`
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

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  const toggleDone = async (task: Task) => {
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

  const deleteTask = async (task: Task) => {
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
              await runQuery("DELETE FROM tasks WHERE id = ?", [task.id]);
              loadTasks();
            } catch (error) {
              console.error("Error eliminando tarea:", error);
            }
          },
        },
      ]
    );
  };

  const editTask = (task: Task) => {
    router.push({
      pathname: "/add-task",
      params: { taskId: task.id },
    });
  };

  const renderItem = ({ item }: { item: Task }) => (
    <TouchableOpacity
      style={[styles.taskItem, !!item.is_done && styles.taskDone]}
      onPress={() => toggleDone(item)}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.category}>{item.category_name || "Sin categoría"}</Text>
      <Text style={styles.due}>
        Vence: {item.due_at ? new Date(item.due_at).toLocaleString() : "-"}
      </Text>
      <Text style={styles.status}>
        {item.is_done ? "✅ Completada" : "❌ Pendiente"}
      </Text>
      <View style={styles.buttons}>
        <View style={styles.buttonWrapper}>
          <Button title="Editar" onPress={() => editTask(item)} />
        </View>
        <View style={styles.buttonWrapper}>
          <Button title="Eliminar" color="#ff4d4d" onPress={() => deleteTask(item)} />
        </View>
      </View>
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
  buttons: { 
    marginTop: 8, 
    flexDirection: "row", 
    justifyContent: "flex-end" 
  },
  buttonWrapper: {
    marginLeft: 8
  },
  empty: { textAlign: "center", marginTop: 50, fontSize: 16, color: "#666" },
});
