import React, { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
import { B } from "@/theme/brand";

export default function Header({ anim }: any) {
  const dot = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dot, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(dot, {
          toValue: 0.4,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const hr = new Date().getHours();
  const greet =
    hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening";

  return (
    <Animated.View
      style={{ opacity: anim, flexDirection: "row", alignItems: "center" }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ color: B.muted }}>{greet} 👋</Text>
        <Text style={{ color: B.text, fontSize: 22, fontWeight: "800" }}>
          Anon · #LL-4829
        </Text>
      </View>

      <View
        style={{
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 20,
          backgroundColor: "#F59E0B22",
        }}
      >
        <Text style={{ color: "#F59E0B", fontWeight: "700" }}>🔥 7</Text>
      </View>
    </Animated.View>
  );
}
