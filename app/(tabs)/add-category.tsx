import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { runQuery } from "../../src/database/helper";
import { addPendingOperation } from "../../src/database/pendingHelper";

export default function AddCategoryScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [categoryUuid, setCategoryUuid] = useState<string>("");

  useEffect(() => {
    // Generamos UUID al montar pantalla
    setCategoryUuid(uuidv4());
  }, []);

  const saveCategory = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "El nombre es obligatorio");
      return;
    }

    try {
      // Insertamos localmente en SQLite con uuid
      await runQuery(
        `INSERT INTO categories (uuid, name, created_at, updated_at)
         VALUES (?, ?, datetime('now'), datetime('now'))`,
        [categoryUuid, name]
      );

      // Encolamos operación para Firestore
      await addPendingOperation('INSERT', 'categories', categoryUuid, {
        uuid: categoryUuid,
        name
      });

      Alert.alert("✅ Categoría agregada");
      setName("");
      setCategoryUuid(uuidv4()); // Preparar UUID para próxima categoría
      router.push("/categories"); // Volver al listado
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
