import React from "react";
import { Image, StyleSheet, View } from "react-native";

export default function LogoSaboresDelValle() {
  return (
    <View style={styles.viewLogo}>
        <Image source={require("@/assets/images/sdv_logo.png")} style={styles.logo} />
        <Image source={require("@/assets/images/sdv_title.png")} style={styles.title} />
    </View>
  );
}

const styles = StyleSheet.create({
  viewLogo: {
    alignItems: "center",
    gap: 10,
  },
  logo: {
    width: 140,
    height: 140,
    resizeMode: "contain",
    borderRadius: 100
  },
  title: {
    width: 160,
    height: 80,
  }
});