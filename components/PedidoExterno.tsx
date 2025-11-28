import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface PedidoExternoProps {
  id?: number;
  cliente?: string;
  calle?: string;
  descripcion?: string;
  importe?: string;
  tipoEntrega?: string;
  estado?: string;
}

export default function PedidoExterno({
  id = 1,
  cliente = "Cliente Perico de los Palotes",
  calle = "Calle de la Piruleta, 25",
  descripcion = "Descripción del pedido",
  importe = "125.35€",
  tipoEntrega = "Entrega en domicilio",
  estado = "PENDIENTE",
}: PedidoExternoProps) {
  const router = useRouter();

  const estadoUpper = estado.toUpperCase();

  const isCompletado = estadoUpper === "COMPLETADO";
  const isIncidencia = estadoUpper === "CON INCIDENCIA";
  const isPendiente = estadoUpper === "PENDIENTE";
  const isParcial = estadoUpper === "ENTREGADO PARCIALMENTE";

  const handlePress = () => {
    router.push(`/pedido-detalle/${id}`);
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,

        isCompletado && styles.cardCompletado,
        isIncidencia && styles.cardIncidencia,
        isPendiente && styles.cardPendiente,
        isParcial && styles.cardParcial,

        pressed && !isCompletado && { backgroundColor: "#f0f0f0" },
      ]}
      onPress={handlePress}
    >
      <View style={styles.row}>
        <Text style={[styles.boldText, styles.flex]}>
          {id} - {cliente}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.text}>{calle}</Text>
      </View>

      <View style={[styles.row, styles.spaceBetween]}>
        <Text style={styles.text}>{descripcion}</Text>
        <Text style={styles.boldText}>Importe: {importe}</Text>
      </View>

      <View style={[styles.row, styles.spaceBetween]}>
        <Text style={styles.text}>{tipoEntrega}</Text>
        <Text
          style={[
            styles.text,
            isCompletado ? styles.textCobrado : styles.textNoCobrado,
          ]}
        >
          {!isPendiente ? "Cobrado" : "No cobrado"}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={[styles.estado]}>
          Estado: {estado}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    alignSelf: "stretch",
  },

  cardPendiente: { borderColor: "#FFA500", backgroundColor: "#FFF4E0" },
  cardParcial: { borderColor: "#4A90E2", backgroundColor: "#E6F0FF" },
  cardCompletado: { borderColor: "#5CB85C", backgroundColor: "#D6F5D6" },
  cardIncidencia: { borderColor: "#D9534F", backgroundColor: "#FADBD8" },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  spaceBetween: {
    justifyContent: "space-between",
  },
  text: {
    fontSize: 14,
    color: "#333",
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#000",
  },
  flex: {
    flex: 1,
  },
  estado: {
    marginTop: 4,
    fontSize: 13,
    fontStyle: "italic",
  },
  textCobrado: {
    color: "#007B55",
    fontWeight: "bold",
  },
  textNoCobrado: {
    color: "#B55E00",
  },
});
