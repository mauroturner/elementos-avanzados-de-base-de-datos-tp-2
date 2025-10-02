import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { fetchAll, runQuery } from "../../src/database/helper";

interface Category {
  id: number;
  name: string;
}

export default function AddTaskScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ taskId?: string }>();
  const taskId = params.taskId ? Number(params.taskId) : null;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [dueAt, setDueAt] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  // Cargar categorías
  const loadCategories = async () => {
    try {
      const cats: Category[] = await fetchAll("SELECT * FROM categories ORDER BY name ASC");
      setCategories(cats);
      if (!taskId && cats.length > 0) {
        setCategoryId(cats[0].id); // Default categoría solo si es nueva tarea
      }
    } catch (error) {
      console.error("Error cargando categorías:", error);
    }
  };

  // Cargar datos de la tarea si taskId existe
  const loadTask = async (id: number) => {
    try {
      const rows = await fetchAll("SELECT * FROM tasks WHERE id = ?", [id]);
      if (rows.length > 0) {
        const task = rows[0];
        setTitle(task.title);
        setDescription(task.description);
        setCategoryId(task.category_id ?? null);
        setDueAt(task.due_at ?? "");
      }
    } catch (error) {
      console.error("Error cargando tarea:", error);
    }
  };

  // Cargar categorías al montar
  useEffect(() => {
    loadCategories();
  }, []);

  // Cargar tarea solo si estamos en modo edición
  useEffect(() => {
    if (taskId) {
      loadTask(taskId);
    } else {
      // Si es nueva tarea, limpiar campos
      setTitle("");
      setDescription("");
      setDueAt("");
      setCategoryId(categories[0]?.id ?? null);
    }
  }, [taskId, categories]);

  const saveTask = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "El título es obligatorio");
      return;
    }

    try {
      if (taskId) {
        // Editar tarea existente
        await runQuery(
          `UPDATE tasks 
           SET title = ?, description = ?, category_id = ?, due_at = ?, updated_at = datetime('now')
           WHERE id = ?`,
          [title, description, categoryId, dueAt || null, taskId]
        );
        Alert.alert("✅ Tarea actualizada");
        router.push("/tasks");
      } else {
        // Crear nueva tarea
        await runQuery(
          `INSERT INTO tasks (title, description, category_id, due_at, created_at, updated_at)
           VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))`,
          [title, description, categoryId, dueAt || null]
        );
        Alert.alert("✅ Tarea agregada");

        // Limpiar campos para nueva tarea
        setTitle("");
        setDescription("");
        setDueAt("");
        setCategoryId(categories[0]?.id ?? null);
      }
    } catch (error) {
      console.error("Error guardando tarea:", error);
      Alert.alert("Error", "No se pudo guardar la tarea");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Título</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Text style={styles.label}>Descripción</Text>
      <TextInput style={styles.input} value={description} onChangeText={setDescription} />

      <Text style={styles.label}>Categoría</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={categoryId}
          onValueChange={(v) => setCategoryId(v)}
          style={styles.picker}
        >
          {categories.map((cat) => (
            <Picker.Item label={cat.name} value={cat.id} key={cat.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Fecha de vencimiento (YYYY-MM-DD HH:MM)</Text>
      <TextInput
        style={styles.input}
        value={dueAt}
        onChangeText={setDueAt}
        placeholder="2025-10-02 18:00"
      />

      <Button title={taskId ? "Actualizar Tarea" : "Guardar Tarea"} onPress={saveTask} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f2f2f2" },
  label: { fontSize: 14, fontWeight: "600", marginTop: 12 },
  input: { backgroundColor: "#fff", padding: 8, borderRadius: 6, marginTop: 4 },
  pickerContainer: { backgroundColor: "#fff", borderRadius: 6, marginTop: 4 },
  picker: { height: 50, width: "100%" },
});
