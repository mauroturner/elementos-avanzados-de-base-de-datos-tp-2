import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    Button,
    FlatList,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { fetchAll, runQuery } from "../../src/database/helper";

// Interfaz de categoría
interface Category {
  id: number;
  name: string;
}

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  // Cargar categorías desde la DB
  const loadCategories = async () => {
    try {
      const result: Category[] = await fetchAll(
        `SELECT * FROM categories ORDER BY name ASC`
      );
      setCategories(result);
    } catch (error) {
      console.error("Error cargando categorías:", error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Eliminar categoría
  const deleteCategory = (cat: Category) => {
    Alert.alert(
      "Eliminar categoría",
      `¿Seguro quieres eliminar "${cat.name}"?`,
      [
        { text: "Cancelar" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await runQuery("DELETE FROM categories WHERE id = ?", [cat.id]);
              loadCategories();
            } catch (error) {
              console.error("Error eliminando categoría:", error);
            }
          },
        },
      ]
    );
  };

  // Editar categoría
  const editCategory = (cat: Category) => {
    router.push({
      pathname: "/add-category",
      params: { categoryId: cat.id },
    });
  };

  // Renderizar cada categoría
  const renderItem = ({ item }: { item: Category }) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.name}</Text>
      <View style={styles.buttons}>
        <View style={styles.buttonWrapper}>
          <Button title="Editar" onPress={() => editCategory(item)} />
        </View>
        <View style={styles.buttonWrapper}>
          <Button title="Eliminar" color="#ff4d4d" onPress={() => deleteCategory(item)} />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {categories.length === 0 ? (
        <Text style={styles.empty}>No hay categorías</Text>
      ) : (
        <FlatList<Category>
          data={categories}
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
  item: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
  },
  name: { fontSize: 16, fontWeight: "bold" },
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
