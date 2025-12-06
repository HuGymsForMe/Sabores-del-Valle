import { PedidoDetallesPedidoUI, getPedidosDetallesPedido, updateIncidenciaPedido } from "@/app/database/";

import BannerDetallePedido from "@/components/BannerDetallePedido";
import ButtonApp from "@/components/ButtonApp";
import PedidoDetalleInfo from "@/components/PedidoDetalleInfo";
import PedidoLineaItem from "@/components/PedidoLineaItem";
import SelectBox from "@/components/SelectBox";

import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

// * PANTALLA DE DETALLES DE PEDIDO * //
export default function PedidoDetalleScreen() {

  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [lineas, setLineas] = useState<PedidoDetallesPedidoUI[]>([]);
  const [selectedLinea, setSelectedLinea] = useState<PedidoDetallesPedidoUI | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [incidencia, setIncidencia] = useState<number>(3);

  const opciones = [
    { label: "Retrasado", value: 1 },
    { label: "Ausente", value: 2 },
    { label: "Rotura de material", value: 3 },
    { label: "Dirección errónea", value: 4 },
  ];

  const openLineaModal = (linea: PedidoDetallesPedidoUI) => {
    setSelectedLinea(linea);
    setIncidencia(linea.incidenciaLinea ?? 3);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setIncidencia(3);
  };

  const reload = async () => {
    const data = await getPedidosDetallesPedido(Number(id));
    setLineas(data);
  };

  const completarLinea = async () => {
    if (!selectedLinea) return;
    await updateIncidenciaPedido(Number(id), selectedLinea.id, 3, null);
    closeModal();
    await reload();
  };

  const asignarIncidencia = async () => {

    console.log(incidencia);
    if (!selectedLinea) return;

    if (incidencia === null || incidencia === 0) {
      Alert.alert(
        "Incidencia requerida",                    
        "Debes marcar un tipo de incidencia.",      
        [{ text: "OK" }]
      );
      return; 
    }

    await updateIncidenciaPedido(Number(id), selectedLinea.id, 4, incidencia);

    closeModal();
    await reload();
  };


  const marcarPendiente = async () => {
    if (!selectedLinea) return;
    await updateIncidenciaPedido(Number(id), selectedLinea.id, 1, null);
    closeModal();
    await reload();
  };

  useEffect(() => {
    reload();
  }, [id]);


  return (
    <View style={styles.container}>

      <BannerDetallePedido
        cliente={lineas[0]?.cliente ?? "Cliente desconocido"}
        direccion={lineas[0]?.calle ?? "Calle no disponible"}
      />

      <PedidoDetalleInfo
        tipoEntrega={lineas[0]?.cliente ?? "Cliente desconocido"}
        codigo={lineas[0]?.entradaDocumento ?? "—"}
      />

      <View style={styles.listContainer}>

        <View style={styles.tableHeader}>
          <View style={styles.colDescripcion}>
            <Text style={styles.headerText}>Descripción</Text>
          </View>
          <View style={styles.colUnidades}>
            <Text style={styles.headerText}>Unidades</Text>
          </View>
          <View style={styles.colImporte}>
            <Text style={styles.headerText}>Importe</Text>
          </View>
        </View>

        <ScrollView>
          {lineas.length > 0 ? (
            lineas.map((item) => (
              <PedidoLineaItem
                key={item.id}
                descripcion={item.descripcion}
                unidades={`${item.unidades} uds.`}
                importe={item.importe}
                estadoLinea={item.estadoLinea}
                incidenciaLinea={item.incidenciaLinea}
                onPress={() => openLineaModal(item)}
                disabled={lineas[0]?.estadoPedido === 3}
              />
            ))
          ) : (
            <Text style={styles.withoutLinesText}>
              No hay líneas para este pedido
            </Text>
          )}
        </ScrollView>

        { lineas[0]?.estadoPedido !== 3 && (<View style={styles.buttonContainer}>
          <ButtonApp
            title="Atrás"
            onPress={() => router.back()}
            extraStyle={{ marginVertical: 16, paddingVertical: 20, flex: 1 }}
          />
          <ButtonApp
            title="Efectuar pago"
            onPress={() => {
              const hayPendientes = lineas.some(l => l.estadoLinea === 1);

              if (hayPendientes) {
                Alert.alert(
                  "Líneas pendientes",                    
                  "Tienes líneas pendientes. Debes actualizar los estados antes de efectuar el pago.",      
                  [{ text: "OK" }]
                );
                return; 
              }

              router.push(`/importe-cobrado/${id}`);
            }}
            extraStyle={{ marginVertical: 16, paddingVertical: 20, flex: 1 }}
          />
        </View>)}

        {/* {lineas[0]?.estadoPedido === 3 &&
          lineas[0]?.dniReceptor &&
          lineas[0]?.nombreReceptor &&
          lineas[0]?.observacionesEntrega && (
            <View style={{ marginTop: 15 }}>
              <Text style={styles.modalCharacteristics}>
                DNI receptor: {lineas[0]?.dniReceptor}
              </Text>
              <Text style={styles.modalCharacteristics}>
                Nombre receptor: {lineas[0]?.nombreReceptor}
              </Text>
              <Text style={styles.modalCharacteristics}>
                Observaciones: {lineas[0]?.observacionesEntrega}
              </Text>
            </View>
          )} */}

      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>

            <View style={styles.modalHeader}>
  <Text style={styles.modalTitle}>Detalle de línea</Text>

  <Pressable style={styles.closeIcon} onPress={closeModal}>
    <Text style={styles.closeIconText}>✕</Text>
  </Pressable>
</View>


            <Text style={styles.modalCharacteristics}>
              Descripción: {selectedLinea?.descripcion}
            </Text>
            <Text style={styles.modalCharacteristics}>
              Unidades: {selectedLinea?.unidades}
            </Text>
            <Text style={styles.modalCharacteristics}>
              Importe: {selectedLinea?.importe} €
            </Text>

            <SelectBox
              data={opciones}
              placeholder="Tipo de incidencia..."
              defaultValue={incidencia}
              onChange={(item) => setIncidencia(Number(item.value))}
            />

            <View style={styles.modalFooter}>

              <Pressable
                style={[styles.footerButton, { backgroundColor: "#7BA05B" }]}
                onPress={completarLinea}
              >
                <Text style={styles.footerButtonText}>Completado</Text>
              </Pressable>

              <Pressable
                style={[styles.footerButton, { backgroundColor: "#E76F51" }]}
                onPress={asignarIncidencia}
              >
                <Text style={styles.footerButtonText}>Añadir incidencia</Text>
              </Pressable>

              <Pressable
                style={[styles.footerButton, { backgroundColor: "#888" }]}
                onPress={marcarPendiente}
              >
                <Text style={styles.footerButtonText}>Pendiente</Text>
              </Pressable>

            </View>

          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  listContainer: { flex: 1, paddingHorizontal: 24 },
  tableHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8, paddingHorizontal: 12},
  colDescripcion: { flex: 4 },
  colUnidades: { flex: 1, alignItems: "center" },
  colImporte: { flex: 1, alignItems: "flex-end" },
  headerText: { fontWeight: "bold", color: "#7BA05B", fontSize: 12 },
  withoutLinesText: { textAlign: "center", marginTop: 20, color: "#777" },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center"},
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  closeIcon: { padding: 6 },
  closeIconText: { fontSize: 24, fontWeight: "bold", color: "#F76548" },
  modalContent: { backgroundColor: "#fff", borderRadius: 10, width: "90%", minHeight: "70%", padding: 20 },
  modalTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10, color: "#7BA05B" },
  modalCharacteristics: { marginVertical: 5, fontSize: 12 },
  modalFooter: { flexDirection: "row", justifyContent: "space-between", gap: 10, marginTop: "auto" },
  footerButton: { flex: 1, paddingVertical: 14, borderRadius: 6 },
  footerButtonText: { color: "#fff", textAlign: "center", fontWeight: "bold", fontSize: 11 },
});
