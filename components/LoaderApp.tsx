import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function LoaderApp() {
  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color="#69daa2" />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    zIndex: 999,
  },
});
