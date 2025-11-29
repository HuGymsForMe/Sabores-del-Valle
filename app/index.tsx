import { useAuth } from "@/context/userContext";
import { Entypo } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";

import ButtonApp from "@/components/ButtonApp";
import InputApp from "@/components/InputApp";

export default function HomeScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const exito = login(usuario, password);
    if (exito) router.push("/menu");
    else Alert.alert("Error de autenticación", "Usuario o contraseña incorrectos");
  };

  return (
    <ImageBackground
        source={require("@/assets/images/wallpaper-campo.jpg")}
        resizeMode="cover"
        style={styles.background}
      >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >

        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          <View style={styles.blockWhite}>

            <View style={styles.blockUser}>
              <View style={styles.userIconWrapper}>
                <Entypo name="user" size={40} color="#13c2ac" />
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

        </ScrollView>
      </KeyboardAvoidingView>
      </ ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    alignItems: "center",
    justifyContent: "space-evenly",
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },

  blockWhite: {
    backgroundColor: "#ffffff",
    padding: 24,
    width: "85%",
    maxWidth: 380,
    borderRadius: 12,
    gap: 10,
    shadowColor: "#888",
    elevation: 3,
  },

  blockUser: {
    alignItems: "center",
    marginBottom: 50,
  },

  userIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E8FFFA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  titleLogin: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222",
    letterSpacing: 0.5,
  },
});
