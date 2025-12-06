import { CierreDeCajaRowUI, getDiarioPorEstadoCaja, getImporteTotalDiario } from "@/app/database";
import BannerCargaTrabajo from "@/components/BannerCargadeTrabajo";
import InfoApp from "@/components/InfoApp";
import InputApp from "@/components/InputApp";
import { useLoading } from "@/context/loaderContext";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

// * PANTALLA DE CIERRE DE CAJA * //
export default function CierreCajaScreen() {

  const { setLoading, setLoadingText } = useLoading();

    const [prices, setPrices] = useState<CierreDeCajaRowUI>({
        importeTotalDiario: 0,
        importeTotalEfectivo: 0,
        importeTotalBizum: 0,
        importeTotalTarjeta: 0,
    });

    const [resumen, setResumen] = useState({
      entregados: 0,
      conIncidencias: 0
    });

    const [showPicker, setShowPicker] = useState<boolean>(false);
    const [date, setDate] = useState(new Date());

    const formatDateISO = (d: Date) => d.toISOString().split("T")[0];

    const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
      if (event.type === "set" && selectedDate) {
        setDate(selectedDate);
      }
      setShowPicker(false);
    };

    useEffect(() => {
      (async () => {
        try {
          setLoadingText("Calculando cierre de caja...");
          setLoading(true);

          await new Promise(resolve => setTimeout(resolve, 500));

          const fechaISO = formatDateISO(date);

          const data = await getImporteTotalDiario(fechaISO);
          const resumenCaja = await getDiarioPorEstadoCaja(fechaISO);
          
          setPrices(data);
          setResumen(resumenCaja);

        } catch (err) {
          console.error("❌ Error al obtener cierre de caja:", err);
        } finally {
          setLoading(false);
        }
    })();
  }, [date]);


  const formattedDate = date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const toggleDatePicker = () => setShowPicker(!showPicker);



    return (<ScrollView style={{flex: 1}} contentContainerStyle={styles.container}>
            <BannerCargaTrabajo esVisibleReparto={false} entregados={resumen.entregados} conIncidencias={resumen.conIncidencias} />

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

      <Text style={styles.textTitle}>Resumen de cierre de caja</Text>

      <Pressable onPress={toggleDatePicker} style={styles.pressDate}>
        <InputApp
          placeholder="Fecha de carga de trabajo..."
          value={formattedDate}
          editable={false}
          extraStyle={{ marginTop: 8, width: "100%" }}
          onChangeText={() => console.log("Cambiando")}
        />
      </Pressable>

      <View style={styles.containerTotal}>
        <Text style={styles.textTotal}>Total cobrado:</Text>
        <Text style={styles.textTotal}>
          {prices.importeTotalDiario.toFixed(2)}€
        </Text>
      </View>

      <View style={styles.textPaymentMethod}>
        <Text>Desglose por método de pago:</Text>
      </View>

      <View style={styles.containerMetodosDesglose}>
        <View style={styles.containerMetodosDesgloseIndividual}>
          <Text style={styles.containerMetodosDesgloseIndividualText}>Efectivo:</Text>
          <Text style={styles.containerMetodosDesgloseIndividualText}>{prices.importeTotalEfectivo.toFixed(2)}€</Text>
        </View>

        <View style={styles.containerMetodosDesgloseIndividual}>
          <Text style={styles.containerMetodosDesgloseIndividualText}>Tarjeta:</Text>
          <Text style={styles.containerMetodosDesgloseIndividualText}>{prices.importeTotalTarjeta.toFixed(2)}€</Text>
        </View>

        <View style={styles.containerMetodosDesgloseIndividual}>
          <Text style={styles.containerMetodosDesgloseIndividualText}>Bizum:</Text>
          <Text style={styles.containerMetodosDesgloseIndividualText}>{prices.importeTotalBizum.toFixed(2)}€</Text>
        </View>
      </View>

      <InfoApp bodyText={`Aparecen los importes de los pedidos que se han completado en el día de hoy.\nLos pedidos que estén parcialmente entregados (con posibles incidencias) no se incluyen en el cierre de caja.`} />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: "center", paddingBottom: 20, backgroundColor: "#F5F5F5", gap: 25 },
  textTitle: { fontSize: 22, fontWeight: "bold", color: "#222", marginTop: 10, marginBottom: -10 },
  pressDate: { width: "90%", alignSelf: "center" },
  blockDate: { width: "90%", marginBottom: 10 },
  blockTextDateText: { fontSize: 18, fontWeight: "600", color: "#333", marginBottom: 5 },
  containerTotal: { width: "90%", padding: 18, borderRadius: 14, backgroundColor: "#fff", shadowColor: "#444", elevation: 2, marginTop: 5, flexDirection: "row", justifyContent: "space-between" },
  textTotal: { fontSize: 20, fontWeight: "700", color: "#333" },
  textPaymentMethod: { fontSize: 18, fontWeight: "700", color: "#333", width: "90%", marginTop: 15 },
  containerMetodosDesglose: { width: "90%", padding: 18, borderRadius: 14, backgroundColor: "#fff", shadowColor: "#444",elevation: 2, gap: 15 },
  containerMetodosDesgloseIndividual: { flexDirection: "row", justifyContent: "space-between" },
  containerMetodosDesgloseIndividualText: { fontSize: 16, fontWeight: "600", color: "#444" },
});
