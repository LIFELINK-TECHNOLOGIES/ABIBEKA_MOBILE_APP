import React from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import Card from "../../screens/main/user/home/component/card";
import { B } from "../../constant/them";

export default function OrgCard({ anim }: { anim: Animated.Value }) {
  const y = anim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] });
  return (
    <Animated.View style={{ opacity: anim, transform: [{ translateY: y }] }}>
      <Card>
        <View style={styles.orgRow}>
          <View style={styles.orgIconWrap}>
            <Text style={{ fontSize: 20 }}>🏢</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Organization Access</Text>
            <Text style={styles.cardSub}>TechCorp Ltd · Request pending</Text>
          </View>
          <View style={styles.orgPendingBadge}>
            <Text style={styles.orgPendingText}>PENDING</Text>
          </View>
        </View>
        <View style={styles.orgTrack}>
          <View style={styles.orgFill} />
        </View>
        <Text style={styles.orgHint}>
          Awaiting admin review · Sent 2 days ago
        </Text>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: B.text,
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  cardSub: { fontSize: 12, color: B.muted },
  orgRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  orgIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: B.secondary + "30",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: B.secondary + "40",
  },
  orgPendingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F59E0B40",
    backgroundColor: "#F59E0B12",
  },
  orgPendingText: {
    fontSize: 9,
    fontWeight: "800",
    color: B.amber,
    letterSpacing: 0.6,
  },
  orgTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.07)",
    marginBottom: 8,
    overflow: "hidden",
  },
  orgFill: {
    width: "50%",
    height: 4,
    borderRadius: 2,
    backgroundColor: B.primary,
  },
  orgHint: { fontSize: 11, color: B.muted2 },
});
