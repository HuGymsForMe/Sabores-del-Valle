import { seedIfEmpty } from "@/app/database";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import ButtonApp from "@/components/ButtonApp";
import LogoSaboresDelValle from "@/components/logos/LogoSaboresDelValle";
import ToastApp from "@/components/ToastApp";

// * PANTALLA DEL MENÚ PRINCIPAL * //
export default function MenuScreen() {

  const router = useRouter();
  const [showToast, setShowToast] = useState<boolean>(false);
  const [textToast, setTextToast] = useState<string>("");

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
  const handleSincro = () => {
    setTextToast("Recogiendo pedidos del ERP...")
    setShowToast(true);
    seedIfEmpty();
    setTimeout(() => setShowToast(false), 3500);

    // setTextToast("Subiendo pedidos completados al ERP...");
    // setShowToast(true);
    // setTimeout(() => setShowToast(false), 3500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerSuperior}>
        <LogoSaboresDelValle />
      </View>
      <View style={styles.containerButtons}>
        <ButtonApp
          title="Carga de trabajo"
          onPress={handleCargaTrabajo}
          extraStyle={{ width: '100%', margin: 8, paddingVertical: 24 }}
        />
        <ButtonApp
          title="Cierre de caja"
          onPress={handleCierreCaja}
          extraStyle={{ width: '100%', margin: 8, paddingVertical: 24 }}
        />
        <ButtonApp
          title="Lanzar sincro 🛜"
          onPress={handleSincro}
          extraStyle={{ width: '100%', margin: 8, paddingVertical: 24 }}
        />
      </View>
      <ToastApp
        visible={showToast}
        value={textToast}
        status="success"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  containerSuperior: { alignItems: "center", gap: 20, marginTop: 40 },
  container: { flex: 1, justifyContent: "space-evenly", alignItems: "center", paddingVertical: 20 },
  containerButtons: { width: "90%", gap: 25, alignItems: "center" },
  texto: { fontSize: 20, marginBottom: 20 },
});
