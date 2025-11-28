import React from "react";
import { GestureResponderEvent, Pressable, StyleSheet, Text } from "react-native";

interface ButtonProps {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  extraStyle?: object;
}

export default function ButtonApp({ title, onPress, disabled, extraStyle }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        extraStyle,
        pressed && styles.buttonPressed,
        disabled && styles.buttonDisabled,
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#6EE9D3",
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    margin: 6,
  },
  buttonPressed: {
    backgroundColor: "#51e4c9ff",

  },
  buttonDisabled: {
    backgroundColor: "#b0b0b0",
  },
  text: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 16,
  },
});
