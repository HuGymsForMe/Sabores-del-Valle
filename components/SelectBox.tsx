import { AntDesign } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

type OptionItem = {
  value: string | number;
  label: string;
};

interface SelectBoxProps {
  data: OptionItem[];
  onChange: (item: OptionItem) => void;
  placeholder: string;
  defaultValue?: string | number;
}

export default function SelectBox({ data, onChange, placeholder, defaultValue }: SelectBoxProps) {
  const [expanded, setExpanded] = useState(false);
  const [valueLabel, setValueLabel] = useState("");

  useEffect(() => {
    const selected = data.find((item) => item.value === defaultValue);
    setValueLabel(selected ? selected.label : "");
  }, [defaultValue, data]);

  const toggleExpanded = useCallback(() => setExpanded((prev) => !prev), []);
  const onSelect = useCallback((item: OptionItem) => {
    onChange(item);
    setValueLabel(item.label);
    setExpanded(false);
  }, [onChange]);

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={toggleExpanded}>
        <Text style={styles.text}>{valueLabel || placeholder}</Text>
        <AntDesign
          name={(expanded ? "caret-up" : "caret-down") as keyof typeof AntDesign.glyphMap}
          size={14}
        />
      </TouchableOpacity>

      {expanded && (
        <TouchableWithoutFeedback onPress={() => setExpanded(false)}>
          <View style={styles.dropdownOverlay}>
            <View style={styles.options}>
              <FlatList
                keyExtractor={(item) => item.value.toString()}
                data={data}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[
                      styles.optionItem,
                      item.value === defaultValue && styles.optionSelected,
                    ]}
                    onPress={() => onSelect(item)}
                  >
                    <Text>{item.label}</Text>
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: "relative", width: "100%", marginTop: 20 },
  button: {
    paddingVertical: 24, justifyContent: "space-between", backgroundColor: "rgba(0,0,0,0.05)",
    flexDirection: "row", alignItems: "center", paddingHorizontal: 15, borderRadius: 8,
  },
  text: { fontSize: 16, opacity: 0.8 },
  dropdownOverlay: { position: "absolute", top: "100%", left: 0, right: 0, zIndex: 1000 },
  options: {
    backgroundColor: "white", width: "100%", padding: 6, borderRadius: 6,
    elevation: 5, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 4,
  },
  optionItem: { justifyContent: "center", padding: 20 },
  optionSelected: { backgroundColor: "rgba(123,160,91,0.1)", borderRadius: 6 },
  separator: { height: 6 },
});
