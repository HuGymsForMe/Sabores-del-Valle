import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface PedidoDetalleInfoProps {
  tipoEntrega: string;
  codigo: string;
}

export default function PedidoDetalleInfo({ tipoEntrega, codigo }: PedidoDetalleInfoProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.entrega}>{tipoEntrega}</Text>
      <Text style={styles.codigo}>Código: {codigo}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  entrega: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  codigo: { fontSize: 14, color: "#444" },
});
