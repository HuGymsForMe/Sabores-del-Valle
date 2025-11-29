import { CierreDeCajaUI, getImporteTotalDiario, getImporteTotalDiarioPorEstadoCaja } from "@/app/database";
import BannerCargaTrabajo from "@/components/BannerCargadeTrabajo";
import InfoApp from "@/components/InfoApp";
import LogoSaboresDelValle from "@/components/logos/LogoSaboresDelValle";
import { useLoading } from "@/context/loaderContext";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

// * PANTALLA DE CIERRE DE CAJA * //
export default function CierreCajaScreen() {

  const { setLoading, setLoadingText } = useLoading();

    const [prices, setPrices] = useState<CierreDeCajaUI>({
        importeTotalDiario: 0,
        importeTotalEfectivo: 0,
        importeTotalBizum: 0,
        importeTotalTarjeta: 0,
    });
    const [resumen, setResumen] = useState({
      entregados: 0,
      conIncidencias: 0
    });

    useEffect(() => {
  (async () => {
    try {
      setLoadingText("Calculando cierre de caja...");
      setLoading(true);

      await new Promise(resolve => setTimeout(resolve, 2000));
      const data = await getImporteTotalDiario();
      const resumenCaja = await getImporteTotalDiarioPorEstadoCaja();
      
      setPrices(data);
      setResumen(resumenCaja);
    } catch (err) {
      console.error("❌ Error al obtener cierre de caja:", err);
    } finally {
      setLoading(false);
    }
  })();
}, []);


    return (<ScrollView style={{flex: 1}} contentContainerStyle={styles.container}>
            <BannerCargaTrabajo esVisibleReparto={false} entregados={resumen.entregados} conIncidencias={resumen.conIncidencias} />

      <LogoSaboresDelValle />

      <Text style={styles.textTitle}>Resumen de cierre de caja</Text>

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
    container: { flexGrow: 1, alignItems: "center", gap: 20, paddingBottom: 40 },
    textTitle: { fontSize: 22, marginTop: 10, color: "#000" },
    containerTotal: { flexDirection: "row", justifyContent: "space-between", width: "90%", marginTop: 10 },
    textTotal: { fontWeight: "bold", fontSize: 18 },
    textPaymentMethod: { fontWeight: "bold", width: "90%", marginTop: 20 },
    containerMetodosDesglose: { flexDirection: "column", justifyContent: "space-between", width: "90%", marginVertical: 20, gap: 15, borderTopWidth: 1, borderTopColor: "#ccc", paddingTop: 20  },
    containerMetodosDesgloseIndividual: { flexDirection: "row", justifyContent: "space-between", marginVertical: 5},
    containerMetodosDesgloseIndividualText: { fontSize: 15 }
})