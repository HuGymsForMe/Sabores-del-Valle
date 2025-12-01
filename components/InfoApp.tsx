import { COLORSAPP } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface InfoAppProps {
    bodyText: string;
}

export default function InfoApp({bodyText}: InfoAppProps) {
    return (
        <View style={styles.infoAlert}>
        <Ionicons name="information-circle" size={22} color="#117040" />
        <View style={{ flex: 1 }}>
          <Text style={styles.infoAlertTitle}>Información</Text>
          <Text style={styles.infoAlertText}>{bodyText}</Text>
        </View>
      </View>
    )
}

export const styles = StyleSheet.create({
    infoBlock: { width: "90%", alignItems: "center", gap: 10, paddingTop: 20 },
   infoAlert: { width: "90%", padding: 15, borderRadius: 8, backgroundColor: "#A1E9C5", flexDirection: "row", gap: 10, alignItems: "flex-start"},
    infoAlertTitle: { fontWeight: "bold", fontSize: 14, marginBottom: 3, color: COLORSAPP.darkGreen },
    infoAlertText: { fontSize: 13, color: COLORSAPP.darkGreen },
})