import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { B } from "../data/constants";
import { Shell, s } from "../style";

// ─── Countdown hook ───────────────────────────────────────────────────────────
function useCountdown(targetISO: string | null) {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    if (!targetISO) return;

    const tick = () => {
      const diff = new Date(targetISO).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ h: 0, m: 0, s: 0 });
        return;
      }
      const totalSecs = Math.floor(diff / 1000);
      setTimeLeft({
        h: Math.floor(totalSecs / 3600),
        m: Math.floor((totalSecs % 3600) / 60),
        s: totalSecs % 60,
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetISO]);

  return timeLeft;
}

// ─── Countdown unit ───────────────────────────────────────────────────────────
const TimeUnit = ({ value, label }: { value: number; label: string }) => {
  const pad = String(value).padStart(2, "0");
  return (
    <View style={cs.unitWrap}>
      <View style={cs.unitBox}>
        <Text style={cs.unitNum}>{pad}</Text>
      </View>
      <Text style={cs.unitLabel}>{label}</Text>
    </View>
  );
};

// ─── Submit card ──────────────────────────────────────────────────────────────
interface SubmitCardProps {
  onSubmit: () => void;
  submitted: boolean;
  isSubmitting?: boolean;
  nextCheckIn?: string | null; // ISO string — midnight tonight, computed by AssessmentScreen
}

export const SubmitCard = ({
  onSubmit,
  submitted,
  isSubmitting = false,
  nextCheckIn = null,
}: SubmitCardProps) => {
  const btnScale  = useRef(new Animated.Value(1)).current;
  const fadeIn    = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // countdown only ticks once submitted and nextCheckIn is available
  const timeLeft = useCountdown(submitted ? nextCheckIn : null);

  useEffect(() => {
    if (!submitted) return;

    Animated.parallel([
      Animated.spring(checkScale, {
        toValue: 1,
        tension: 55,
        friction: 9,
        useNativeDriver: true,
      }),
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.04,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [submitted]);

  const tap = () => {
    if (isSubmitting) return;
    Animated.sequence([
      Animated.spring(btnScale, { toValue: 0.96, tension: 300, friction: 10, useNativeDriver: true }),
      Animated.spring(btnScale, { toValue: 1,    tension: 300, friction: 10, useNativeDriver: true }),
    ]).start(onSubmit);
  };

  // ── Pre-submit view ──
  if (!submitted) {
    return (
      <Shell accent={B.accent}>
        <Animated.View style={{ transform: [{ scale: btnScale }] }}>
          <TouchableOpacity
            onPress={tap}
            activeOpacity={0.88}
            disabled={isSubmitting}
            style={[cs.submitBtn, isSubmitting && { opacity: 0.6 }]}
          >
            <Text style={cs.submitBtnText}>
              {isSubmitting ? "Saving…" : "Complete Check-In"}
            </Text>
            {!isSubmitting && (
              <Text style={{ fontSize: 18, color: "#fff" }}>✓</Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </Shell>
    );
  }

  // ── Post-submit view with live countdown ──
  return (
    <Shell accent={B.primary}>
      <Animated.View
        style={[
          cs.doneWrap,
          { opacity: fadeIn, transform: [{ scale: checkScale }] },
        ]}
      >
        <View style={cs.checkCircle}>
          <Text style={{ fontSize: 36 }}>✅</Text>
        </View>
        <Text style={cs.doneTitle}>You're all done!</Text>
        <Text style={cs.doneSub}>
          Your check-in has been recorded.{"\n"}Come back tomorrow to keep going.
        </Text>
      </Animated.View>

      <View style={cs.divider} />

      <Text style={cs.countdownLabel}>Next check-in opens in</Text>
      <Animated.View
        style={[cs.countdownRow, { transform: [{ scale: pulseAnim }] }]}
      >
        <TimeUnit value={timeLeft.h} label="HRS" />
        <Text style={cs.colon}>:</Text>
        <TimeUnit value={timeLeft.m} label="MIN" />
        <Text style={cs.colon}>:</Text>
        <TimeUnit value={timeLeft.s} label="SEC" />
      </Animated.View>

      <View style={cs.midnightBadge}>
        <Text style={cs.midnightText}>🕛 Resets at midnight</Text>
      </View>
    </Shell>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const cs = StyleSheet.create({
  submitBtn: {
    height: 52,
    borderRadius: 16,
    backgroundColor: B.accent,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: B.accent,
    shadowRadius: 14,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#fff",
  },

  doneWrap: {
    alignItems: "center",
    paddingVertical: 8,
    gap: 10,
  },
  checkCircle: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: B.accent + "15",
    borderWidth: 1,
    borderColor: B.accent + "30",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  doneTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: B.text,
    letterSpacing: -0.5,
  },
  doneSub: {
    fontSize: 13,
    color: B.muted,
    textAlign: "center",
    lineHeight: 20,
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginVertical: 24,
  },

  countdownLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: B.muted,
    textTransform: "uppercase",
    letterSpacing: 1,
    textAlign: "center",
    marginBottom: 16,
  },
  countdownRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  unitWrap: { alignItems: "center", gap: 6 },
  unitBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: B.primary + "18",
    borderWidth: 1,
    borderColor: B.primary + "35",
    alignItems: "center",
    justifyContent: "center",
  },
  unitNum: {
    fontSize: 26,
    fontWeight: "900",
    color: B.text,
    fontVariant: ["tabular-nums"],
    letterSpacing: -0.5,
  },
  unitLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: B.muted,
    letterSpacing: 1.2,
  },
  colon: {
    fontSize: 22,
    fontWeight: "900",
    color: B.primary,
    marginBottom: 14,
  },

  midnightBadge: {
    alignSelf: "center",
    marginTop: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: B.primary + "12",
    borderWidth: 1,
    borderColor: B.primary + "25",
  },
  midnightText: {
    fontSize: 12,
    fontWeight: "600",
    color: B.primary,
  },
});