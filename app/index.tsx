import { useAuth } from "@/context/userContext";
import { Entypo } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { useState } from "react";
import { ImageBackground, KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from "react-native";

import ButtonApp from "@/components/ButtonApp";
import InputApp from "@/components/InputApp";
import ToastApp from "@/components/ToastApp";
import { COLORSAPP } from "@/constants/colors";

export default function HomeScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState<{
    id: number;
    text: string;
    status: "success" | "error" | "info";
  } | null>(null);

  const handleLogin = () => {
    const exito = login(usuario, password);
    if (exito) router.push("/menu");
    else setToast({ id: Date.now(), text: "Credenciales incorrectas", status: "error" });
  };

  return (
    <ImageBackground
        source={require("@/assets/images/wallpaper-campo.jpg")}
        resizeMode="cover"
        style={styles.background}
      >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior="padding"
        keyboardVerticalOffset={-100}

      >

        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          <View style={styles.blockWhite}>

            <View style={styles.blockUser}>
              <View style={styles.userIconWrapper}>
                <Entypo name="user" size={40} color={COLORSAPP.cyanThird} />
              </View>
              <Text style={styles.titleLogin}>Iniciar Sesión</Text>
            </View>

            <InputApp
              placeholder="Usuario"
              value={usuario}
              onChangeText={setUsuario}
            />

            <InputApp
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
            />

            <ButtonApp
              title="Entrar"
              onPress={handleLogin}
              disabled={false}
            />

          </View>
          <ToastApp toast={toast} />
        </ScrollView>
      </KeyboardAvoidingView>
      </ ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1},
  keyboardAvoidingView: { flex: 1 },
  container: { alignItems: "center", justifyContent: "space-evenly", flexGrow: 1, paddingHorizontal: 20, paddingVertical: 40, backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  blockWhite: { backgroundColor: "#ffffff", padding: 24, width: "85%", maxWidth: 380, borderRadius: 12, gap: 10, shadowColor: "#888", elevation: 3 },
  blockUser: { alignItems: "center", marginBottom: 50 },
  userIconWrapper: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#E8FFFA", justifyContent: "center", alignItems: "center", marginBottom: 10 },
  titleLogin: { fontSize: 24, fontWeight: "700", color: "#222", letterSpacing: 0.5 },
});
