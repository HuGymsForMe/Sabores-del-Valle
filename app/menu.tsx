import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import ButtonApp from "@/components/ButtonApp";
import LogoSaboresDelValle from "@/components/logos/LogoSaboresDelValle";

import { useLoading } from "@/context/loaderContext";
import { useAuth } from "@/context/userContext";
import { subiendoPedidos } from "./database";

// * PANTALLA DEL MENÚ PRINCIPAL * //
export default function MenuScreen() {

  const router = useRouter();
  const { setLoading, setLoadingText } = useLoading();
  const { logout } = useAuth();

  // * Enlace a la carga de trabajo * //
  const handleCargaTrabajo = () => {
    console.log("Redirigiendo a la carga de trabajo");
    router.push("/carga-trabajo");
  }

  // * Enlace al cierre de caja * //
  const handleCierreCaja = () => {
    console.log("Redirigiendo al cierre de caja");
    router.push("/cierre-caja");
  };

  // TODO -> Recoger los pedidos de la API y enviar los ya completos
  const handleSincro = async () => {
    setLoadingText("Recogiendo datos del ERP...");
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await subiendoPedidos();
    setLoading(false);
  };

  // * Cerrar sesión * //
  const handleLogout = () => {
    logout();
    router.replace("/");
  };


  return (
    <View style={styles.container}>
      <View style={styles.containerSuperior}>
        <LogoSaboresDelValle />
      </View>
      <View style={styles.containerButtons}>
        <ButtonApp
          title="Lanzar sincro 🛜"
          onPress={handleSincro}
          extraStyle={{ width: '100%', margin: 8, paddingVertical: 20 }}
        />
        <ButtonApp
          title="Carga de trabajo"
          onPress={handleCargaTrabajo}
          extraStyle={{ width: '100%', margin: 8, paddingVertical: 20 }}
        />
        <ButtonApp
          title="Cierre de caja"
          onPress={handleCierreCaja}
          extraStyle={{ width: '100%', margin: 8, paddingVertical: 20 }}
        />
        <ButtonApp
          title="Cerrar sesión"
          onPress={handleLogout}
          extraStyle={{ width: '100%', margin: 8, paddingVertical: 20 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerSuperior: { alignItems: "center", gap: 20, marginTop: 40 },
  container: { flex: 1, justifyContent: "space-evenly", alignItems: "center", paddingVertical: 20 },
  containerButtons: { width: "90%", gap: 25, alignItems: "center" },
  texto: { fontSize: 20, marginBottom: 20 },
});
