import { createTables, getDB } from "@/app/database";
import { UserProvider } from "@/context/userContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
  });

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
      <ImageBackground
        source={require("@/assets/images/wallpaper-campo.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Stack
            screenOptions={{
              contentStyle: { backgroundColor: "transparent" },
            }}
          >
            <Stack.Screen name="index" options={{ title: "Login" }} />
            <Stack.Screen name="menu" options={{ title: "Inicio", headerBackVisible: false }} />
            <Stack.Screen name="carga-trabajo" options={{ title: "Carga de Trabajo" }} />
            <Stack.Screen name="cierre-caja" options={{ title: "Cierre de Caja" }} />
            <Stack.Screen name="pedido-detalle/[id]" options={{ title: "Detalles" }} />
            <Stack.Screen name="importe-cobrado/[id]" options={{ title: "Importe" }} />
          </Stack>
        </View>
      </ImageBackground>
    </UserProvider>
  </ThemeProvider>
);


}

const styles = StyleSheet.create({
  background: { flex: 1 }, 
  overlay: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
});
