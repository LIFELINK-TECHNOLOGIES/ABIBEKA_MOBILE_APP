import React, { useEffect, useRef } from "react";
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
}

export const SubmitCard = ({ onSubmit, submitted }: SubmitCardProps) => {
  const checkScale = useRef(new Animated.Value(0)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (submitted) {
      Animated.spring(checkScale, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }
  }, [submitted]);

  const tap = () => {
    Animated.sequence([
      Animated.spring(btnScale, {
        toValue: 0.96,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.spring(btnScale, {
        toValue: 1,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start(onSubmit);
  };

  const cols = GRID.length;
  const rows = 7;
  const svgW = cols * (CELL + CGAP) - CGAP;
  const svgH = rows * (CELL + CGAP) - CGAP;

  return (
    <Shell accent={B.accent}>
      {/* Submit / saved state */}
      {!submitted ? (
        <Animated.View style={{ transform: [{ scale: btnScale }] }}>
          <TouchableOpacity
            onPress={tap}
            activeOpacity={0.88}
            style={s.submitBtn}
          >
            <Text style={s.submitBtnText}>Complete Check-In</Text>
            <Text style={{ fontSize: 18, color: "#fff" }}>✓</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <Animated.View
          style={[
            s.savedRow,
            { transform: [{ scale: checkScale }], opacity: checkScale },
          ]}
        >
          <View style={s.savedIcon}>
            <Text style={{ fontSize: 26 }}>✅</Text>
          </View>
          <View>
            <Text style={s.savedTitle}>Assessment saved!</Text>
            <Text style={s.savedSub}>
              Great job showing up for yourself today.
            </Text>
          </View>
        </Animated.View>
      )}

      {/* Streak row */}
      <View style={s.streakRow2}>
        <Text style={{ fontSize: 26 }}>🔥</Text>
        <View style={{ flex: 1 }}>
          <Text style={s.streakTitle}>8 Day Streak</Text>
          <Text style={s.streakSub}>You've checked in 8 days in a row</Text>
        </View>
        <View style={s.streakBadge2}>
          <Text style={s.streakBadgeText}>🏆 Consistent</Text>
        </View>
      </View>

      <View style={s.divider} />

      {/* Grid header */}
      <Text style={s.gridTitle}>Check-in History</Text>
      <Text style={s.gridSub}>
        Each cell = one day · Color = emotional state that day
      </Text>

      {/* Legend */}
      <View style={s.legendRow}>
        {GRID_LEGEND.map((g, i) => (
          <View key={i} style={s.legendItem}>
            <View style={[s.legendCell, { backgroundColor: g.color }]} />
            <Text style={s.legendText}>{g.label}</Text>
          </View>
        ))}
      </View>

      {/* Contribution grid */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 12 }}
      >
        <View style={{ flexDirection: "row" }}>
          <View style={{ marginRight: 4 }}>
            {DAY_LABELS.map((d, i) => (
              <View
                key={i}
                style={{ height: CELL + CGAP, justifyContent: "center" }}
              >
                <Text style={s.gridDay}>{d}</Text>
              </View>
            ))}
          </View>
          <Svg width={svgW} height={svgH}>
            {GRID.map((week, wi) =>
              week.map((val, di) => (
                <Rect
                  key={`${wi}-${di}`}
                  x={wi * (CELL + CGAP)}
                  y={di * (CELL + CGAP)}
                  width={CELL}
                  height={CELL}
                  rx={3}
                  fill={gridColor(val)}
                />
              )),
            )}
          </Svg>
        </View>
      </ScrollView>

      {/* Monthly stats */}
      <View style={s.monthCard}>
        <Text style={s.monthTitle}>📊 This Month</Text>
        <View style={s.monthStats}>
          {[
            { val: "27", lbl: "Assessments", color: B.accent },
            { val: "8", lbl: "Day streak", color: B.amber },
            { val: "64%", lbl: "Calm days", color: B.primary },
          ].map((m, i) => (
            <View key={i} style={s.monthStat}>
              <Text style={[s.monthStatVal, { color: m.color }]}>{m.val}</Text>
              <Text style={s.monthStatLbl}>{m.lbl}</Text>
            </View>
          ))}
        </View>
        <Text style={s.monthInsight}>
          Your stress tends to peak on Mondays. Sleep quality has improved 12%
          this month.
        </Text>
      </View>
    </Shell>
  );
};
