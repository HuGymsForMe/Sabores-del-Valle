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

export default function InputApp({ value, onChangeText, placeholder, secureTextEntry = false, extraStyle, multiline = false, editable = true }: InputAppProps) {

  const [showPassword, setShowPassword] = useState(false);

  const isPassword = secureTextEntry === true;

  return (
    <View style={[styles.inputContainer, extraStyle]}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#8aa6a2"
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        secureTextEntry={isPassword && !showPassword}
        style={[
          styles.inputText,
          multiline && styles.multiline,
          !editable && { backgroundColor: "#f1f1f1" },
        ]}
        multiline={multiline}
      />

      {isPassword && (
        <Pressable
          onPress={() => setShowPassword(!showPassword)}
          style={styles.iconContainer}
        >
          <AntDesign
            name={showPassword ? "eye" : "eye-invisible"}
            size={24}
            color="#13c2ac"
            style={{ marginBottom: 12 }}
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: { position: "relative", width: "100%", justifyContent: "center" },
  inputText: { height: 50, borderWidth: 1.5, paddingHorizontal: 12, backgroundColor: "#fff", borderColor: "#13c2ac", borderRadius: 10, marginBottom: 14, paddingRight: 45, fontSize: 16, shadowColor: "#333", elevation: 3, color: "#097465ff", fontWeight: "bold" },
  iconContainer: { position: "absolute", right: 12, height: "100%", justifyContent: "center" },
  multiline: { height: 120, paddingTop: 12, paddingRight: 45, backgroundColor: "#fbfbfb" },
});
