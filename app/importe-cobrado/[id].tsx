import { getPedidosImporteCobrado, PedidoCargaTrabajoUI, updateEstadoPedido } from "@/app/database";
import ButtonApp from "@/components/ButtonApp";
import InputApp from "@/components/InputApp";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";

import ToastApp from "@/components/ToastApp";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";

// * PANTALLA DE IMPORTE COBRADO * // 
export default function ImporteCobradoScreen() {
  const [dni, setDni] = useState<string>("");
  const [nombre, setNombre] = useState<string>("");
  const [observaciones, setObservaciones] = useState<string>("");
  const [importe, setImporte] = useState<string>("0 €");
  const [pedido, setPedido] = useState<PedidoCargaTrabajoUI | null>(null);
  const [toast, setToast] = useState<{
    id: number;
    text: string;
    status: "success" | "error" | "info";
  } | null>(null);

  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const handleTicket = () => {
    setToast({
      id: Date.now(),
      text: "Imprimiendo ticket...",
      status: "info",
    });
  }

  const handleMarcarPedido = () => {
    updateEstadoPedido(Number(id), dni, nombre, observaciones);
    Alert.alert(
      "Pedido cerrado",
      `El pedido ${id} ha sido marcado.`,
      [{ text: "OK", onPress: () => {router.replace("/menu")} }]
    );
  }

  const comprobarMetodoDePago = (metodoPago: string | undefined) => {
    if (!metodoPago) return "💸";
    if (metodoPago === "Bizum") return "📱";
    if (metodoPago === "Tarjeta") return "💳";
    return "💸";
  };


  useEffect(() => {
    (async () => {
      if (!id) return;

      const pedidos = await getPedidosImporteCobrado(Number(id));

      console.log(pedidos);

      const pedidoActual = pedidos.find(
        (p) => Number(p.id) === Number(id)
      );

      if (pedidoActual) {
        setPedido(pedidoActual);
        setImporte(pedidoActual.importe);
      }
    })();
  }, [id]);

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {pedido && (<>
          <View style={styles.header}>
            <Text style={styles.headerCliente}>{pedido.cliente}</Text>
            <Text style={styles.headerCalle}>{pedido.calle}</Text>
          </View>
        

        <View style={styles.section}>
          <Text style={styles.label}>Importe cobrado</Text>
          <InputApp
            placeholder="Importe"
            value={importe}
            onChangeText={setImporte}
            editable={false}
          />
        </View>

        <View style={styles.containerMetodo}>
          <Text style={styles.containerMetodoText}>Método de pago:</Text>
          <Text style={styles.containerMetodoTextType}>{comprobarMetodoDePago(pedido?.metodoDePago)}</Text>
        </View>

        </>)}
        

        <View style={styles.sectionDatos}>
          <Text style={styles.labelSection}>
            Datos del receptor (no obligatorios)
          </Text>
          <InputApp
            placeholder="DNI"
            value={dni}
            onChangeText={(text) => setDni(text)}
          />
          <InputApp
            placeholder="Nombre"
            value={nombre}
            onChangeText={(text) => setNombre(text)}
          />
          <InputApp
            placeholder="Observaciones"
            value={observaciones}
            onChangeText={(text) => setObservaciones(text)}
            multiline={true}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.rowButtons}>
          <ButtonApp
            title="Atrás"
            onPress={() => router.back()}
            extraStyle={[styles.btnAtras, { flex: 1 }]}
          />
          <ButtonApp
            title="Marcar pedido"
            onPress={handleMarcarPedido}
            extraStyle={{ flex: 2 }}
          />
        </View>
      </View>
      <ToastApp
        toast={toast}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { flexGrow: 1, justifyContent: "flex-start", paddingHorizontal: 20, paddingBottom: 20 },
  containerMetodo: { width: "100%", padding: 18, borderRadius: 14,  backgroundColor: "#F2F2F2", marginTop: 5, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  containerMetodoText: { fontSize: 16, fontWeight: "700", color: "#333"},
  containerMetodoTextType: { fontSize: 22 },
  header: { backgroundColor: "#F2F2F2", padding: 16, borderRadius: 8, marginTop: 20 },
  headerCliente: { fontWeight: "bold", fontSize: 16 },
  headerCalle: { fontSize: 13, color: "#666" },
  section: { marginTop: 20, gap: 10 },
  sectionDatos: { marginTop: 20, padding: 16, gap: 12, backgroundColor: "#F2EDE4", borderColor: "#ccc", borderWidth: 1, borderRadius: 8 },
  label: { fontWeight: "bold", fontSize: 14 },
  labelSection: { fontWeight: "bold", fontSize: 13, marginBottom: 4 },
  footer: { paddingHorizontal: 20, paddingVertical: 20, gap: 10 },
  btnTicket: { borderRadius: 20 },
  rowButtons: { flexDirection: "row", gap: 10 },
  btnAtras: { backgroundColor: "#ddd" }
});
