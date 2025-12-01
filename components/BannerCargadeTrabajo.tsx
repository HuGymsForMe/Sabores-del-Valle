import IconoInfo from "@/components/logos/IconoInfo";
import IconoPack from "@/components/logos/IconoPack";
import IconoTruck from "@/components/logos/IconoTruck";
import { COLORSAPP } from "@/constants/colors";
import { StyleSheet, Text, View } from "react-native";

interface BannerCargaTrabajoProps {
    enReparto?: number;
    entregados: number;
    conIncidencias: number;
    esVisibleReparto?: boolean;
}

export default function BannerCargaTrabajo({enReparto=0, entregados=0, conIncidencias=0, esVisibleReparto=true} :BannerCargaTrabajoProps) {

    return (
        <View style={styles.blockIcons}>
            {esVisibleReparto && (
                <View style={styles.blockIcon}>
                    <IconoTruck />
                    <Text>En reparto: {enReparto}</Text>
                </View>
            )}
            <View style={styles.blockIcon}>
                <IconoPack />
                <Text>Entregados: {entregados}</Text>
            </View>
            <View style={styles.blockIcon}>
                <IconoInfo />
                <Text>Incidencias: {conIncidencias}</Text>
            </View>
        </View>
    
    )
}

const styles = StyleSheet.create({
    blockIcons: { flexDirection: "row", justifyContent: "space-around", alignItems: "center", width: "100%", backgroundColor: COLORSAPP.cyan, paddingVertical: 20, borderBottomRightRadius: 10, borderBottomLeftRadius: 10 },
    blockIcon:{ alignItems: "center", justifyContent: "center" }
})