import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Rect } from "react-native-svg";
import { B, GRID, GRID_LEGEND, MOODS, gridColor } from "../data/constants";
import { Shell, s } from "../style";

const CELL = 13;
const CGAP = 3;
const DAY_LABELS = ["", "M", "", "W", "", "F", ""];

// ─── Animated insight bar ─────────────────────────────────────────────────────

const InsightBar = ({
  label,
  value,
  color,
  delay,
}: {
  label: string;
  value: number;
  color: string;
  delay: number;
}) => {
  const fill = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fill, {
      toValue: value / 100,
      duration: 900,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, []);

  const w = fill.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={{ marginBottom: 16 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <Text style={s.insightBarLabel}>{label}</Text>
        <Text style={[s.insightBarVal, { color }]}>{value}%</Text>
      </View>
      <View style={s.insightBarTrack}>
        <Animated.View
          style={[s.insightBarFill, { width: w, backgroundColor: color }]}
        />
        <Animated.View
          style={[s.insightBarGlow, { width: w, backgroundColor: color }]}
        />
      </View>
    </View>
  );
};

// ─── AI Insight card ──────────────────────────────────────────────────────────

interface AiInsightCardProps {
  moodIdx: number | null;
  stress: number;
  energy: number;
  emotions: string[];
}

export const AiInsightCard = ({
  moodIdx,
  stress,
  energy,
  emotions,
}: AiInsightCardProps) => {
  const glow = useRef(new Animated.Value(0.5)).current;
  const slideY = useRef(new Animated.Value(20)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(slideY, {
        toValue: 0,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0.5,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const mood = moodIdx !== null ? MOODS[moodIdx] : null;
  const stressScore = stress * 10;
  const energyScore = energy * 10;
  const emotionLoad = Math.min(emotions.length * 16, 100);
  const focusScore = Math.max(100 - stressScore * 0.6, 20);

  const insight = (() => {
    if (stress >= 7)
      return "You're carrying significant stress today. Be gentle with yourself — even small steps count.";
    if (energy <= 3)
      return "Your energy is low today. Rest is productive. Don't push yourself too hard this evening.";
    if (emotions.includes("Anxious") && emotions.includes("Overwhelmed"))
      return "Feeling anxious and overwhelmed together is heavy. Try breaking your next task into one small action.";
    if (moodIdx !== null && moodIdx <= 1)
      return "You seem to be in a good place today. Protect that energy and build on it.";
    return "Thank you for checking in. Awareness of your emotional state is already a form of self-care.";
  })();

  const state =
    stress >= 7
      ? { text: "Needs Attention", color: B.red }
      : stress >= 4
        ? { text: "Moderate · Keep an eye on this", color: B.amber }
        : { text: "Stable · Keep going 🌱", color: B.accent };

  return (
    <Animated.View
      style={{ opacity: fade, transform: [{ translateY: slideY }] }}
    >
      <Shell accent={B.primary}>
        {/* Header */}
        <View style={s.insightHeader}>
          <Animated.View style={[s.insightAvatar, { opacity: glow }]}>
            <Text style={{ fontSize: 26 }}>🤖</Text>
          </Animated.View>
          <View style={{ flex: 1 }}>
            <Text style={s.insightName}>Abibeka's Insight</Text>
            {mood && (
              <Text style={s.insightMood}>
                {mood.emoji} You selected "{mood.label}"
              </Text>
            )}
          </View>
          <Animated.View style={[s.insightLive, { opacity: glow }]} />
        </View>

        {/* Quote */}
        <View style={s.insightQuote}>
          <Text style={s.insightQuoteText}>"{insight}"</Text>
        </View>

        {/* Animated bars */}
        <View style={{ marginTop: 20 }}>
          <InsightBar
            label="Stress Level"
            value={stressScore}
            color={stress >= 7 ? B.red : stress >= 4 ? B.amber : B.accent}
            delay={100}
          />
          <InsightBar
            label="Energy"
            value={energyScore}
            color={energy >= 7 ? B.accent : energy >= 4 ? B.amber : B.red}
            delay={250}
          />
          <InsightBar
            label="Emotional Load"
            value={emotionLoad}
            color={B.violet}
            delay={400}
          />
          <InsightBar
            label="Focus Capacity"
            value={focusScore}
            color={B.sky}
            delay={550}
          />
        </View>

        {/* State pill */}
        <View
          style={[
            s.statePill,
            {
              borderColor: state.color + "40",
              backgroundColor: state.color + "12",
            },
          ]}
        >
          <View style={[s.stateDot, { backgroundColor: state.color }]} />
          <Text style={[s.stateText, { color: state.color }]}>
            {state.text}
          </Text>
        </View>
      </Shell>
    </Animated.View>
  );
};

// ─── Submit + contribution grid card ─────────────────────────────────────────

interface SubmitCardProps {
  onSubmit: () => void;
  submitted: boolean;
  isSubmitting?: boolean;
}






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

// ─── Countdown display ────────────────────────────────────────────────────────
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
  nextCheckIn?: string | null; // ISO string from API
}

export const SubmitCard = ({
  onSubmit,
  submitted,
  isSubmitting = false,
  nextCheckIn = null,
}: SubmitCardProps) => {
  const btnScale = useRef(new Animated.Value(1)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const timeLeft = useCountdown(submitted ? nextCheckIn : null);

  useEffect(() => {
    if (submitted) {
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

      // Pulse the countdown ring
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
        ])
      ).start();
    }
  }, [submitted]);

  const tap = () => {
    if (isSubmitting) return;
    Animated.sequence([
      Animated.spring(btnScale, { toValue: 0.96, tension: 300, friction: 10, useNativeDriver: true }),
      Animated.spring(btnScale, { toValue: 1, tension: 300, friction: 10, useNativeDriver: true }),
    ]).start(onSubmit);
  };

  // ── Pre-submit ──
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
              {isSubmitting ? "Saving..." : "Complete Check-In"}
            </Text>
            {!isSubmitting && <Text style={{ fontSize: 18, color: "#fff" }}>✓</Text>}
          </TouchableOpacity>
        </Animated.View>
      </Shell>
    );
  }

  // ── Post-submit ──
  return (
    <Shell accent={B.primary}>
      <Animated.View
        style={[cs.doneWrap, { opacity: fadeIn, transform: [{ scale: checkScale }] }]}
      >
        {/* Check icon */}
        <View style={cs.checkCircle}>
          <Text style={{ fontSize: 36 }}>✅</Text>
        </View>
        <Text style={cs.doneTitle}>You're all done!</Text>
        <Text style={cs.doneSub}>
          Your check-in has been recorded.{"\n"}Come back tomorrow to keep going.
        </Text>
      </Animated.View>

      {/* Divider */}
      <View style={cs.divider} />

      {/* Countdown */}
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
  // Pre-submit
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

  // Post-submit
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

  // Divider
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginVertical: 24,
  },

  // Countdown
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
  unitWrap: {
    alignItems: "center",
    gap: 6,
  },
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

  // Midnight badge
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