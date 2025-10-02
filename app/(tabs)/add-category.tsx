import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { runQuery } from "../../src/database/helper";

export default function AddCategoryScreen() {
  const router = useRouter();
  const [name, setName] = useState("");

  const saveCategory = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "El nombre es obligatorio");
      return;
    }

    try {
      await runQuery(
        "INSERT INTO categories (name) VALUES (?)",
        [name]
      );
      Alert.alert("✅ Categoría agregada");
      setName("");
      router.push("/categories"); // Volvemos a la lista
    } catch (error) {
      console.error("Error agregando categoría:", error);
      Alert.alert("Error", "No se pudo agregar la categoría");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre de la categoría</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Ej: Trabajo"
      />
      <Button title="Guardar Categoría" onPress={saveCategory} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f2f2f2" },
  label: { fontSize: 14, fontWeight: "600", marginTop: 12 },
  input: { backgroundColor: "#fff", padding: 8, borderRadius: 6, marginTop: 4, marginBottom: 12 },
});
