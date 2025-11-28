import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Animated, StyleSheet, Text } from "react-native";

interface ToastAppProps {
  value?: string;
  extraStyle?: object;
  status: "success" | "error" | "info";
  visible?: boolean;
  duration?: number;
}

export default function ToastApp({
  value = "Operación completada",
  extraStyle = {},
  status = "info",
  visible = false,
  duration = 3000,
}: ToastAppProps) {
  const [show, setShow] = useState(visible);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (visible) {
      setShow(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setShow(false));
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!show) return null;

  const backgroundColor =
    status === "success"
      ? "#4CAF50"
      : status === "error"
      ? "#F44336"
      : "#2196F3";

  const iconColor =
  status === "success"
    ? "#0E5C15"   
    : status === "error"
    ? "#8B0000"   
    : "#0A3D91";


  return (
    <Animated.View
      style={[
        styles.toast,
        { backgroundColor, opacity: fadeAnim },
        extraStyle,
      ]}
    >
      <Ionicons name="information-circle" size={22} color={iconColor} />
      <Text style={styles.text}>{value}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    top: 20,
    right: 20,
    alignContent: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
  },
});
