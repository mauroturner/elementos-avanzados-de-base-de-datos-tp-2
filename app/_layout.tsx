import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { setupDatabase } from '@/src/database/dbinit';
import { syncPendingOperations } from '@/src/database/syncPendingOperations';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    const initApp = async () => {
      try {
        // 1️⃣ Inicializar la DB
        await setupDatabase();

        // 2️⃣ Ejecutar sincronización inicial
        await syncPendingOperations();

        // 3️⃣ Configurar sincronización periódica cada 30 segundos
        const interval = setInterval(() => {
          syncPendingOperations().catch((err) =>
            console.error("Error sincronizando operaciones pendientes:", err)
          );
        }, 30000);

        // Limpiar interval al desmontar
        return () => clearInterval(interval);
      } catch (error) {
        console.error("Error inicializando app:", error);
      }
    };

    initApp();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
