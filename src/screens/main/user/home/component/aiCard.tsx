import React from "react";
import { Animated, TouchableOpacity, View } from "react-native";
import Text from "../../../../../components/basics/txt";

const B = {
  primary: "#0F766E",
  text: "#F0F4FF",
};

export default function AiCard({ anim, onPress }: any) {
  const y = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [30, 0],
  });

  return (
    <Animated.View style={{ opacity: anim, transform: [{ translateY: y }] }}>
      <TouchableOpacity onPress={onPress}>
        <View
          style={{
            borderRadius: 20,
            borderWidth: 1,
            borderColor: B.primary + "40",
            padding: 16,
            backgroundColor: "#080D1C",
          }}
        >
          <Text style={{ color: B.text, fontSize: 16, fontWeight: "800" }}>
            🤖 Abibeka AI
          </Text>
          <Text style={{ color: "#aaa", marginTop: 4 }}>
            "I'm here whenever you need to talk."
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
