import React, { useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Path, Text as SvgText } from "react-native-svg";

// ---------- Color palette ----------
const B = {
  primary: "#0F766E",
  secondary: "#1E3A8A",
  accent: "#22C55E",
  bg: "#04060F",
  card: "#080D1C",
  border: "rgba(255,255,255,0.07)",
  text: "#F0F4FF",
  muted: "rgba(240,244,255,0.42)",
  muted2: "rgba(240,244,255,0.18)",
  amber: "#F59E0B",
  red: "#EF4444",
  violet: "#8B5CF6",
  rose: "#F43F5E",
  sky: "#0EA5E9",
  teal: "#14B8A6",
};

// ---------- Shell (card wrapper) ----------
const Shell = ({
  children,
  accent,
  noPad,
}: {
  children: React.ReactNode;
  accent?: string;
  noPad?: boolean;
}) => (
  <View
    style={[
      styles.shell,
      noPad && { padding: 0 },
      accent && {
        borderColor: accent + "28",
        shadowColor: accent,
        shadowRadius: 22,
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 6 },
      },
    ]}
  >
    {accent && <View style={[styles.shellBar, { backgroundColor: accent }]} />}
    {children}
  </View>
);

// ---------- Question generation ----------
const getQuestions = (moodIdx: number | null, situations: string[]) => {
  const stressed = (moodIdx ?? 2) >= 5;
  const sad = (moodIdx ?? 2) === 3 || (moodIdx ?? 2) === 4;
  const work = situations.includes("Work");
  const relation = situations.includes("Relationship");

  const qs: Array<{
    type: "tile" | "ring" | "yesno";
    id: string;
    text: string;
    options?: string[];
    colors?: string[];
  }> = [
    {
      type: "ring",
      id: "sleep",
      text: "How has your sleep been recently?",
      options: ["Great", "Good", "Poor", "Very poor"],
    },
    {
      type: "tile",
      id: "focus",
      text: "How difficult was it to concentrate today?",
      options: ["Easy", "A little hard", "Quite hard", "Couldn't focus"],
      colors: [B.accent, B.primary, B.amber, B.red],
    },
  ];

  if (stressed || work) {
    qs.push({
      type: "ring",
      id: "workload",
      text: "Is your workload feeling manageable?",
      options: ["Very much", "Mostly yes", "Struggling", "Overwhelmed"],
    });
  }

  if (sad || relation) {
    qs.push({
      type: "yesno",
      id: "support",
      text: "Have you felt supported by the people around you today?",
    });
  }

  qs.push({
    type: "tile",
    id: "improved",
    text: "Compared to yesterday, how are you feeling?",
    options: ["Much better", "Better", "About same", "Worse"],
    colors: [B.accent, B.teal, B.amber, B.red],
  });

  qs.push({
    type: "yesno",
    id: "break",
    text: "Did you take any meaningful breaks today?",
  });

  return qs;
};

// ---------- Widget A: TileQuestion (2x2 grid) ----------
const TileQuestion = ({
  q,
  answer,
  onAnswer,
}: {
  q: { id: string; text: string; options: string[]; colors: string[] };
  answer: string;
  onAnswer: (a: string) => void;
}) => {
  const scales = q.options.map(() => useRef(new Animated.Value(1)).current);

  const tap = (opt: string, i: number) => {
    onAnswer(opt);
    Animated.sequence([
      Animated.spring(scales[i], {
        toValue: 0.93,
        tension: 300,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scales[i], {
        toValue: 1,
        tension: 300,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.qBlock}>
      <Text style={styles.qText}>{q.text}</Text>
      <View style={styles.tileGrid}>
        {q.options.map((opt, i) => {
          const active = answer === opt;
          const c = q.colors[i];
          return (
            <Animated.View
              key={i}
              style={{ transform: [{ scale: scales[i] }], width: "48%" }}
            >
              <Pressable
                onPress={() => tap(opt, i)}
                style={[
                  styles.tilePick,
                  active && {
                    borderColor: c,
                    backgroundColor: c + "20",
                  },
                ]}
              >
                <View
                  style={[
                    styles.tileDot,
                    { backgroundColor: active ? c : B.muted2 },
                  ]}
                />
                <Text
                  style={[
                    styles.tilePickText,
                    active && { color: c, fontWeight: "700" },
                  ]}
                >
                  {opt}
                </Text>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
};

// ---------- Widget B: RingQuestion (segmented circle) ----------
const RingQuestion = ({
  q,
  answer,
  onAnswer,
}: {
  q: { id: string; text: string; options: string[] };
  answer: string;
  onAnswer: (a: string) => void;
}) => {
  const n = q.options.length;
  const SIZE = 130;
  const CX = SIZE / 2;
  const CY = SIZE / 2;

  return (
    <View style={styles.qBlock}>
      <Text style={styles.qText}>{q.text}</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
        <Svg width={SIZE} height={SIZE}>
          {q.options.map((opt, i) => {
            const startDeg = (i / n) * 360 - 90;
            const endDeg = ((i + 1) / n) * 360 - 90;
            const sr = (startDeg * Math.PI) / 180;
            const er = (endDeg * Math.PI) / 180;
            const R = 50;
            const r = 30;

            const x1o = CX + R * Math.cos(sr);
            const y1o = CY + R * Math.sin(sr);
            const x2o = CX + R * Math.cos(er);
            const y2o = CY + R * Math.sin(er);
            const x1i = CX + r * Math.cos(er);
            const y1i = CY + r * Math.sin(er);
            const x2i = CX + r * Math.cos(sr);
            const y2i = CY + r * Math.sin(sr);

            const large = endDeg - startDeg > 180 ? 1 : 0;
            const d = `M ${x1o} ${y1o} A ${R} ${R} 0 ${large} 1 ${x2o} ${y2o} L ${x1i} ${y1i} A ${r} ${r} 0 ${large} 0 ${x2i} ${y2i} Z`;

            const active = answer === opt;
            const colors = [B.accent, B.primary, B.amber, B.red, B.violet];
            const c = colors[i % colors.length];

            return (
              <Path
                key={i}
                d={d}
                fill={active ? c : "rgba(255,255,255,0.06)"}
                stroke={B.card}
                strokeWidth={2}
                onPress={() => onAnswer(opt)}
              />
            );
          })}
          {answer && (
            <SvgText
              x={CX}
              y={CY + 5}
              textAnchor="middle"
              fill={B.text}
              fontSize={9}
              fontWeight="700"
            >
              {answer}
            </SvgText>
          )}
        </Svg>

        <View style={{ flex: 1, gap: 8 }}>
          {q.options.map((opt, i) => {
            const active = answer === opt;
            const colors = [B.accent, B.primary, B.amber, B.red, B.violet];
            const c = colors[i % colors.length];
            return (
              <Pressable
                key={i}
                onPress={() => onAnswer(opt)}
                style={[
                  styles.ringLabel,
                  active && {
                    borderColor: c + "50",
                    backgroundColor: c + "12",
                  },
                ]}
              >
                <View
                  style={[
                    styles.ringDot,
                    { backgroundColor: active ? c : B.muted2 },
                  ]}
                />
                <Text
                  style={[
                    styles.ringLabelText,
                    active && { color: c, fontWeight: "700" },
                  ]}
                >
                  {opt}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
};

// ---------- Widget C: YesNoQuestion (animated flip) ----------
const YesNoQuestion = ({
  q,
  answer,
  onAnswer,
}: {
  q: { id: string; text: string };
  answer: string;
  onAnswer: (a: string) => void;
}) => {
  const yesScale = useRef(new Animated.Value(1)).current;
  const noScale = useRef(new Animated.Value(1)).current;

  const tap = (val: string, anim: Animated.Value) => {
    onAnswer(val);
    Animated.sequence([
      Animated.spring(anim, {
        toValue: 0.9,
        tension: 300,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(anim, {
        toValue: 1,
        tension: 300,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.qBlock}>
      <Text style={styles.qText}>{q.text}</Text>
      <View style={styles.yesNoRow}>
        {[
          { val: "Yes", emoji: "✅", color: B.accent, anim: yesScale },
          { val: "No", emoji: "❌", color: B.red, anim: noScale },
        ].map(({ val, emoji, color, anim }) => {
          const active = answer === val;
          return (
            <Animated.View
              key={val}
              style={{ flex: 1, transform: [{ scale: anim }] }}
            >
              <Pressable
                onPress={() => tap(val, anim)}
                style={[
                  styles.yesNoBtn,
                  active && {
                    borderColor: color,
                    backgroundColor: color + "20",
                    shadowColor: color,
                    shadowRadius: 12,
                    shadowOpacity: 0.4,
                    shadowOffset: { width: 0, height: 0 },
                  },
                ]}
              >
                <Text style={{ fontSize: 28 }}>{emoji}</Text>
                <Text
                  style={[
                    styles.yesNoText,
                    active && { color, fontWeight: "800" },
                  ]}
                >
                  {val}
                </Text>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
};

// ---------- Main exported component ----------
export const QuestionsCard = ({
  moodIdx,
  situations,
  answers,
  onAnswer,
}: {
  moodIdx: number | null;
  situations: string[];
  answers: Record<string, string>;
  onAnswer: (id: string, val: string) => void;
}) => {
  const questions = getQuestions(moodIdx, situations);

  return (
    <Shell accent={B.secondary}>
      <Text style={styles.cardQ}>A few more questions</Text>
      <Text style={styles.cardHint}>
        Each question has its own interaction — explore them
      </Text>
      <View style={{ gap: 28, marginTop: 8 }}>
        {questions.map((q) => {
          const ans = answers[q.id] ?? "";
          if (q.type === "tile")
            return (
              <TileQuestion
                key={q.id}
                q={q as any}
                answer={ans}
                onAnswer={(a) => onAnswer(q.id, a)}
              />
            );
          if (q.type === "ring")
            return (
              <RingQuestion
                key={q.id}
                q={q as any}
                answer={ans}
                onAnswer={(a) => onAnswer(q.id, a)}
              />
            );
          return (
            <YesNoQuestion
              key={q.id}
              q={q as any}
              answer={ans}
              onAnswer={(a) => onAnswer(q.id, a)}
            />
          );
        })}
      </View>
    </Shell>
  );
};

// ---------- Styles ----------
const styles = StyleSheet.create({
  // Shell
  shell: {
    backgroundColor: B.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: B.border,
    padding: 20,
    overflow: "hidden",
    marginBottom: 2,
  },
  shellBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
  },

  // Header
  cardQ: {
    fontSize: 20,
    fontWeight: "800",
    color: B.text,
    letterSpacing: -0.5,
    lineHeight: 28,
    marginBottom: 6,
    marginLeft: 4,
  },
  cardHint: {
    fontSize: 12,
    color: B.muted,
    marginBottom: 16,
    marginLeft: 4,
  },

  // Question block
  qBlock: {
    borderTopWidth: 1,
    borderTopColor: B.border,
    paddingTop: 20,
  },
  qText: {
    fontSize: 15,
    fontWeight: "700",
    color: B.text,
    lineHeight: 22,
    marginBottom: 14,
  },

  // Tile widget
  tileGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tilePick: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: B.border,
    backgroundColor: "rgba(255,255,255,0.03)",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tileDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  tilePickText: {
    fontSize: 13,
    color: B.muted,
  },

  // Ring widget
  ringLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "transparent",
  },
  ringDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  ringLabelText: {
    fontSize: 12,
    color: B.muted,
  },

  // Yes/No widget
  yesNoRow: {
    flexDirection: "row",
    gap: 14,
  },
  yesNoBtn: {
    flex: 1,
    height: 80,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: B.border,
    backgroundColor: "rgba(255,255,255,0.03)",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  yesNoText: {
    fontSize: 15,
    fontWeight: "700",
    color: B.muted,
  },
});
