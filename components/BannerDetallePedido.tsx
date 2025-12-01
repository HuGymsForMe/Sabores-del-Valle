import IconoMaps from "@/components/logos/IconoMaps";
import { COLORSAPP } from "@/constants/colors";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

interface BannerDetallePedidoProps {
    cliente: string;
    direccion: string;
}

export default function BannerDetallePedido({ cliente, direccion }: BannerDetallePedidoProps) {

    const handleOpenMaps = () => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(direccion)}`;

        Linking.openURL(url)
            .catch(err => console.error("Error al abrir Google Maps:", err));
    };

    return (
        <View style={styles.blockIcons}>
            <View style={styles.blockText}>
                <Text style={styles.textTitle}>En reparto</Text>
                <Text>{cliente}</Text>
                <Text>{direccion}</Text>
            </View>

            <View style={styles.blockIcon}>
                <Pressable style={styles.buttonMaps} onPress={handleOpenMaps}>
                    <IconoMaps />
                    <Text>Trayecto 🛜</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    blockIcons: { flexDirection: "row", justifyContent: "space-evenly", paddingHorizontal: 20, alignItems: "center", width: "100%", backgroundColor: COLORSAPP.cyan, paddingVertical: 20, borderBottomRightRadius: 10,  borderBottomLeftRadius: 10 },
    textTitle:{ fontWeight: "bold" },
    blockText:{ alignItems: "flex-start", flex: 1, flexWrap: "wrap" },
    blockIcon:{ alignItems: "center", justifyContent: "center" },
    buttonMaps: { alignItems: "center" }
});
