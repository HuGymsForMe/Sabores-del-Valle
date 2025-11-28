import LottieView from "lottie-react-native";
import { StyleSheet, View } from "react-native";

export default function DeliveryEmpty() {
  return (
    <View style={styles.container}>
        <LottieView
        source={require("@/assets/images/delivery.json")}
        autoPlay
        loop
        style={{ width: 350, height: 350 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    height: "70%",
  },
});
