import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { B } from "../../../../../constant/them";

export default function AiCard({ anim }: { anim: Animated.Value }) {
  const navigation = useNavigation<any>();
  const glow = useRef(new Animated.Value(0)).current;
  const y = anim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] });

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, []);

  const glowBg = glow.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(15,118,110,0.10)", "rgba(15,118,110,0.22)"],
  });

  return (
    <Animated.View style={{ opacity: anim, transform: [{ translateY: y }] }}>
      <TouchableOpacity
        onPress={() => navigation.navigate("AI")}
        activeOpacity={0.88}
      >
        <Animated.View style={[styles.aiCard, { backgroundColor: glowBg }]}>
          <View style={styles.aiBorderTop} />
          <View style={styles.aiBody}>
            <View style={styles.aiAvatar}>
              <Text style={{ fontSize: 24 }}>🤖</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.aiName}>Abibeka AI</Text>
              <Text style={styles.aiSub}>
                "I'm here whenever you need to talk."
              </Text>
            </View>
            <View style={styles.aiBtn}>
              <Text style={styles.aiBtnText}>Chat</Text>
            </View>
          </View>
          <View style={styles.aiFooter}>
            <View style={styles.aiStatus}>
              <View style={styles.aiDot} />
              <Text style={styles.aiStatusText}>
                Always available · Private
              </Text>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  aiCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: B.primary + "35",
    overflow: "hidden",
  },
  aiBorderTop: { height: 2, backgroundColor: B.primary, opacity: 0.7 },
  aiBody: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    paddingBottom: 12,
  },
  aiAvatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: B.primary + "25",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: B.primary + "40",
  },
  aiName: {
    fontSize: 16,
    fontWeight: "800",
    color: B.text,
    letterSpacing: -0.3,
    marginBottom: 3,
  },
  aiSub: { fontSize: 12, color: B.muted, fontStyle: "italic" },
  aiBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: B.primary,
  },
  aiBtnText: { fontSize: 13, fontWeight: "800", color: "#fff" },
  aiFooter: {
    borderTopWidth: 1,
    borderTopColor: B.primary + "20",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  aiStatus: { flexDirection: "row", alignItems: "center", gap: 7 },
  aiDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: B.accent,
    shadowColor: B.accent,
    shadowRadius: 4,
    shadowOpacity: 0.9,
    shadowOffset: { width: 0, height: 0 },
  },
  aiStatusText: { fontSize: 11, color: B.muted },
});