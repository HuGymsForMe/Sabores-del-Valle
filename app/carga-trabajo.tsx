import { getPedidosCargaTrabajo, getResumenPedidosPorEstado, PedidoCargaTrabajoUI } from "@/app/database";
import BannerCargaTrabajo from "@/components/BannerCargadeTrabajo";
import InputApp from "@/components/InputApp";
import DeliveryEmpty from "@/components/logos/DeliveryEmpty";
import PedidoExterno from "@/components/PedidoExterno";
import { useLoading } from "@/context/loaderContext";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";


// * PANTALLA DE CARGA DE TRABAJO * //
export default function CargaTrabajoScreen() {
  const { setLoading, setLoadingText } = useLoading();
  const [pedidos, setPedidos] = useState<PedidoCargaTrabajoUI[]>([]);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [resumen, setResumen] = useState({
    enReparto: 0,
    entregados: 0,
    conIncidencias: 0
  });

  const formatDateISO = (d: Date) => d.toISOString().split("T")[0];

  // * Recogiendo los pedidos de la fecha indicada por el usuario * //
  const fetchPedidos = async (fechaISO: string) => {
    try {
      setLoadingText("Cargando pedidos...");
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const data = await getPedidosCargaTrabajo(fechaISO);
      setPedidos(data);
    } catch (err) {
      console.error("❌ Error al obtener pedidos:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchResumen = async (fechaISO: string) => {
    try {
      const r:any = await getResumenPedidosPorEstado(fechaISO);
      setResumen({
        enReparto: r.enReparto ?? 0,
        entregados: r.entregados ?? 0,
        conIncidencias: r.conIncidencias ?? 0
      });
    } catch (err) {
      console.error("❌ Error al obtener resumen:", err);
    }
  };

  useEffect(() => {
    const fechaISO = formatDateISO(date);
    fetchPedidos(fechaISO);
    fetchResumen(fechaISO);
  }, [date]);

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === "set" && selectedDate) {
      setDate(selectedDate);
    }
    setShowPicker(false);
  };

  const formattedDate = date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const toggleDatePicker = () => setShowPicker(!showPicker);

  return (
    <View style={styles.container}>

      <BannerCargaTrabajo enReparto={resumen.enReparto} entregados={resumen.entregados} conIncidencias={resumen.conIncidencias}  />

      <View style={{ width: "95%", marginTop: 20 }}>
        <Text style={{ fontSize: 18 }}>Fecha de pedidos:</Text>
      </View>

      <Pressable onPress={toggleDatePicker} style={{ width: "95%" }}>
        <InputApp
          placeholder="Fecha de carga de trabajo..."
          value={formattedDate}
          editable={false}
          extraStyle={{ marginTop: 8, width: "100%" }}
          onChangeText={() => console.log("Cambiando")}
        />
      </Pressable>

      {showPicker && (
        <DateTimePicker
          mode="date"
          display="calendar"
          value={date}
          onChange={onChange}
          positiveButton={{label: 'OK'}}
          negativeButton={{label: 'SALIR', textColor: 'red'}}
        />
      )}

      {pedidos.length === 0 ? (
        <View style={styles.sinPedidosContainer}>
          <Text style={styles.text}>Sin pedidos en esta fecha</Text>
          <DeliveryEmpty />
        </View>
      ) : (
        <ScrollView
          style={{ width: "95%" }}
          contentContainerStyle={styles.scrollContainer}
        >
          {pedidos.map((pedido, index) => (
            <PedidoExterno key={`${pedido.id}-${index}`} {...pedido} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
  text: {
    fontSize: 18,
    marginTop: 20,
    color: "#69daa2ff",
  },
  sinPedidosContainer: {
    alignItems: "center",
    marginTop: 30,
  },
  scrollContainer: {
    paddingHorizontal: 0,
    paddingVertical: 10,
  },
});
