import { useLoading } from "@/context/loaderContext";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function LoaderGlobal() {
  const { loading, loadingText } = useLoading();

  if (!loading) return null;

  return (
    <View style={styles.overlay}>
      <ActivityIndicator size={100} color="#13c2ac" />
      {loadingText ? <Text style={styles.text}>{loadingText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    color: "#32e2cbff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
