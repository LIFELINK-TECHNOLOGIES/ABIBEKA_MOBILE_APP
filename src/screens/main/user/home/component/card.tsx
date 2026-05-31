import React from "react";
import { View, StyleSheet } from "react-native";
import { B } from "../../../../../constant/them";

export default function Card({
  children,
  style,
  glow,
}: {
  children: React.ReactNode;
  style?: any;
  glow?: string;
}) {
  return (
    <View
      style={[
        styles.card,
        glow && {
          shadowColor: glow,
          shadowRadius: 24,
          shadowOpacity: 0.18,
          shadowOffset: { width: 0, height: 6 },
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: B.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: B.cardBorder,
    padding: 18,
    shadowColor: "#000",
    shadowRadius: 12,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
  },
});
