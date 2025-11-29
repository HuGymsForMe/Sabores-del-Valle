import { createTables, getDB } from "@/app/database";
import GlobalLoader from "@/components/LoaderApp";
import { LoadingProvider } from "@/context/loaderContext";
import { UserProvider } from "@/context/userContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({ ...Ionicons.font });

  useEffect(() => {
    (async () => {
      try {
        await getDB();
        await createTables();
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <UserProvider>
        <LoadingProvider>
          <Stack>
            <Stack.Screen name="index" options={{ title: "Sabores del Valle", headerShown: false}} />
            <Stack.Screen name="menu" options={{ title: "Inicio", headerBackVisible: false }} />
            <Stack.Screen name="carga-trabajo" options={{ title: "Carga de Trabajo" }} />
            <Stack.Screen name="cierre-caja" options={{ title: "Cierre de Caja" }} />
            <Stack.Screen name="pedido-detalle/[id]" options={{ title: "Detalles" }} />
            <Stack.Screen name="importe-cobrado/[id]" options={{ title: "Importe" }} />
          </Stack>
          <GlobalLoader />
        </LoadingProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
