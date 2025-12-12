import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

interface ToastAppProps {
  toast: {
    id: number;
    text: string;
    status: "success" | "error" | "info";
  } | null;
  duration?: number;
}

export default function ToastApp({ toast, duration = 3000 }: ToastAppProps) {
  const [show, setShow] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-10)).current;

  useEffect(() => {
    if (!toast) return;

    setShow(true);
    fadeAnim.setValue(0);
    translateY.setValue(-10);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -10,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => setShow(false));
    }, duration);

    return () => clearTimeout(timer);
  }, [toast?.id]);

  if (!show || !toast) return null;

  const backgroundColor =
    toast.status === "success"
      ? "#2E7D32"
      : toast.status === "error"
      ? "#C62828"
      : "#1565C0";

  const iconName =
    toast.status === "success"
      ? "checkmark"
      : toast.status === "error"
      ? "close"
      : "information";

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor,
          opacity: fadeAnim,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={styles.iconWrapper}>
        <Ionicons name={iconName} size={20} color="#fff" />
      </View>

      <Text style={styles.text} numberOfLines={3}>
        {toast.text}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    top: 30,
    left: 16,
    right: 16,

    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,

    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },

    elevation: 8,
  },

  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
  },

  text: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
  },
});
