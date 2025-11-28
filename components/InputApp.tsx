import { AntDesign } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

interface InputAppProps {
  value?: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  extraStyle?: object;
  multiline?: boolean;
  editable?: boolean;
}

export default function InputApp({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  extraStyle,
  multiline = false,
  editable = true,
}: InputAppProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = secureTextEntry === true;

  return (
    <View style={[styles.inputContainer, extraStyle]}>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        secureTextEntry={isPassword && !showPassword}
        style={[
          styles.inputText,
          multiline && styles.multiline,
          !editable && { backgroundColor: "#f5f5f5" },
        ]}
        multiline={multiline}
      />

      {isPassword && (
        <Pressable
          onPress={() => setShowPassword(!showPassword)}
          style={styles.iconContainer}
        >
          <AntDesign name={showPassword ? "eye" : "eye-invisible"}
            size={24}
            color="#666"
            style={{ marginBottom: 8 }} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    position: "relative",
    width: "100%",
    justifyContent: "center",
  },
  inputText: {
    height: 44,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 4,
    marginBottom: 10,
    paddingRight: 35,
    fontSize: 18
  },
  iconContainer: {
    position: "absolute",
    right: 10,
    height: "100%",
    justifyContent: "center",
  },
  multiline: {
    height: 120,
    paddingTop: 10,
    paddingRight: 40,
  },
});
