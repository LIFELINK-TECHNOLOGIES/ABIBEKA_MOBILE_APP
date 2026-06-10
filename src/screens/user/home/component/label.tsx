import React from "react";
import { Text, StyleSheet } from "react-native";
import { B } from "../../../../constant/them";

export default function Label({ text }: { text: string }) {
  return <Text style={styles.label}>{text}</Text>;
}

const styles = StyleSheet.create({
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: B.muted2,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 8,
  },
});
