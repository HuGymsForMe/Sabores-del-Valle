import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface PedidoLineaItemProps {
  descripcion: string;
  unidades: string;
  importe: number;
  estadoLinea: number;
  incidenciaLinea?: number;
  onPress?: () => void;
}

const incidenciaText: Record<number, string> = {
  1: "Retrasado",
  2: "Ausente",
  3: "Rotura de material",
  4: "Dirección errónea",
};

export default function PedidoLineaItem({
  descripcion,
  unidades,
  importe,
  estadoLinea,
  incidenciaLinea,
  onPress,
}: PedidoLineaItemProps) {

  let backgroundColor = "#F8F8F4";
  let estadoLabel = "Pendiente";
  let estadoColor = "#555";

  if (estadoLinea === 3) {
    backgroundColor = "#E6F4E6";
    estadoLabel = "Completado";
    estadoColor = "#4A7C2C";
  }

  if (estadoLinea === 4) {
    backgroundColor = "#FFE1E1";
    estadoLabel = incidenciaText[incidenciaLinea ?? 0] || "Incidencia";
    estadoColor = "#B00020";
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: pressed ? "#ddd" : backgroundColor },
      ]}
      onPress={onPress}
    >
      <View style={styles.colLeft}>
        <Text style={styles.descripcion}>{descripcion}</Text>
        <Text style={[styles.estado, { color: estadoColor }]}>
          {estadoLabel}
        </Text>
      </View>

      <Text style={styles.unidades}>{unidades}</Text>
      <Text style={styles.importe}>{importe.toFixed(2)} €</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginBottom: 10,
  },
  colLeft: {
    flex: 4,
  },
  descripcion: {
    fontSize: 14,
  },
  estado: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
  unidades: {
    flex: 1,
    fontSize: 14,
    textAlign: "center",
  },
  importe: {
    flex: 1,
    fontSize: 14,
    textAlign: "right",
    fontWeight: "bold",
  },
});
