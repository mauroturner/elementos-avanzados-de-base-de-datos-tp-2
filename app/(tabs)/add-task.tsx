import { Picker } from "@react-native-picker/picker"; // 👈 Import correcto
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { fetchAll, runQuery } from "../../src/database/helper";

// Definimos la interfaz de la categoría
interface Category {
  id: number;
  name: string;
}

export default function AddTaskScreen() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [dueAt, setDueAt] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  const loadCategories = async () => {
    try {
      const cats: Category[] = await fetchAll("SELECT * FROM categories ORDER BY name ASC");

      setCategories(cats);
      if (cats.length > 0) setCategoryId(cats[0].id);
    } catch (error) {
      console.error("Error cargando categorías:", error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

const saveTask = async () => {
  if (!title.trim()) {
    Alert.alert("Error", "El título es obligatorio");
    return;
  }
  try {
    await runQuery(
      `INSERT INTO tasks (title, description, category_id, due_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [title, description, categoryId, dueAt || null]
    );
    Alert.alert("✅ Tarea agregada");
    setTitle("");
    setDescription("");
    setDueAt("");
    
    router.push("/tasks"); // Simplemente push, NO replace
  } catch (error) {
    console.error("Error agregando tarea:", error);
    Alert.alert("Error", "No se pudo agregar la tarea");
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
        <Picker selectedValue={categoryId} onValueChange={(v) => setCategoryId(v)} style={styles.picker}>
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

      <Button title="Guardar Tarea" onPress={saveTask} />
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
