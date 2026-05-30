import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgGrad,
  Path,
  Polyline,
  Stop,
  Text as SvgText,
} from "react-native-svg";

const { width: W } = Dimensions.get("window");
const CARD_W = W - 40;

// ─── Brand ────────────────────────────────────────────────────────────────────

const B = {
  primary: "#0F766E",
  secondary: "#1E3A8A",
  accent: "#22C55E",
  bg: "#04060F",
  card: "#080D1C",
  cardBorder: "rgba(255,255,255,0.06)",
  cardGlow: "rgba(15,118,110,0.08)",
  text: "#F0F4FF",
  muted: "rgba(240,244,255,0.4)",
  muted2: "rgba(240,244,255,0.18)",
  amber: "#F59E0B",
  red: "#EF4444",
  violet: "#8B5CF6",
};

const MOOD_OPTIONS = [
  { emoji: "😊", label: "Great", color: B.accent },
  { emoji: "😌", label: "Calm", color: B.primary },
  { emoji: "😐", label: "Okay", color: "#94A3B8" },
  { emoji: "😔", label: "Low", color: B.violet },
  { emoji: "😤", label: "Stressed", color: B.amber },
];

// 7-day mood data (0=great → 4=stressed)
const MOOD_TREND = [2, 0, 1, 3, 4, 2, 1];
const STRESS_VALS = [42, 58, 50, 74, 68, 55, 44];
const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];
const EMOTIONS = [
  { label: "Calm", pct: 36, color: B.primary },
  { label: "Happy", pct: 28, color: B.accent },
  { label: "Stressed", pct: 22, color: B.amber },
  { label: "Anxious", pct: 14, color: B.red },
];

// ─── Primitives ───────────────────────────────────────────────────────────────

const Card = ({
  children,
  style,
  glow,
}: {
  children: React.ReactNode;
  style?: any;
  glow?: string;
}) => (
  <View
    style={[
      s.card,
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

const Label = ({ text }: { text: string }) => (
  <Text style={s.label}>{text}</Text>
);

// ─── 1. Header ────────────────────────────────────────────────────────────────

const Header = ({ anim }: { anim: Animated.Value }) => {
  const dot = useRef(new Animated.Value(0.4)).current;
  const y = anim.interpolate({ inputRange: [0, 1], outputRange: [-16, 0] });

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
      style={[s.header, { opacity: anim, transform: [{ translateY: y }] }]}
    >
      <View style={{ flex: 1 }}>
        <Text style={s.headerGreet}>{greet} 👋</Text>
        <Text style={s.headerId}>Anon · #LL-4829</Text>
      </View>

      {/* Streak */}
      <View style={s.streakPill}>
        <Text style={s.streakFire}>🔥</Text>
        <Text style={s.streakNum}>7</Text>
      </View>

      {/* Org badge */}
      <View style={s.pendingPill}>
        <Animated.View style={[s.pendingDot, { opacity: dot }]} />
        <Text style={s.pendingText}>Pending</Text>
      </View>
    </Animated.View>
  );
};

// ─── 2. Abibeka AI card ───────────────────────────────────────────────────────

const AiCard = ({
  anim,
  onPress,
}: {
  anim: Animated.Value;
  onPress?: () => void;
}) => {
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
      <TouchableOpacity onPress={onPress} activeOpacity={0.88}>
        <Animated.View style={[s.aiCard, { backgroundColor: glowBg }]}>
          {/* Border gradient */}
          <View style={s.aiBorderTop} />

          <View style={s.aiBody}>
            {/* Avatar */}
            <View style={s.aiAvatar}>
              <Text style={{ fontSize: 24 }}>🤖</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={s.aiName}>Abibeka AI</Text>
              <Text style={s.aiSub}>"I'm here whenever you need to talk."</Text>
            </View>

            <View style={s.aiBtn}>
              <Text style={s.aiBtnText}>Chat</Text>
            </View>
          </View>

          {/* Bottom row */}
          <View style={s.aiFooter}>
            <View style={s.aiStatus}>
              <View style={s.aiDot} />
              <Text style={s.aiStatusText}>Always available · Private</Text>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── 3. Mood check-in card ────────────────────────────────────────────────────

const MoodCard = ({ anim }: { anim: Animated.Value }) => {
  const [picked, setPicked] = useState<number | null>(null);
  const scales = MOOD_OPTIONS.map(() => useRef(new Animated.Value(1)).current);
  const y = anim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] });

  const pick = (i: number) => {
    setPicked(i);
    Animated.sequence([
      Animated.spring(scales[i], {
        toValue: 1.3,
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
    <Animated.View style={{ opacity: anim, transform: [{ translateY: y }] }}>
      <Card glow={picked !== null ? MOOD_OPTIONS[picked].color : undefined}>
        <View style={s.cardHead}>
          <View>
            <Text style={s.cardTitle}>Today's Check-in</Text>
            <Text style={s.cardSub}>How are you feeling right now?</Text>
          </View>
          {picked !== null && (
            <View
              style={[
                s.loggedBadge,
                {
                  backgroundColor: MOOD_OPTIONS[picked].color + "20",
                  borderColor: MOOD_OPTIONS[picked].color + "50",
                },
              ]}
            >
              <Text
                style={[s.loggedText, { color: MOOD_OPTIONS[picked].color }]}
              >
                Logged
              </Text>
            </View>
          )}
        </View>

        <View style={s.moodRow}>
          {MOOD_OPTIONS.map((m, i) => (
            <Animated.View
              key={i}
              style={{ transform: [{ scale: scales[i] }] }}
            >
              <Pressable
                onPress={() => pick(i)}
                style={[
                  s.moodPill,
                  picked === i && {
                    borderColor: m.color,
                    backgroundColor: m.color + "18",
                  },
                ]}
              >
                <Text style={s.moodEmoji}>{m.emoji}</Text>
                <Text style={[s.moodLabel, picked === i && { color: m.color }]}>
                  {m.label}
                </Text>
              </Pressable>
            </Animated.View>
          ))}
        </View>
      </Card>
    </Animated.View>
  );
};

// ─── 4. Mood trend line chart ─────────────────────────────────────────────────

const MOOD_COLORS_TREND = [B.accent, B.primary, "#94A3B8", B.violet, B.amber];
const CH = 110;
const PAD = 16;

const MoodTrendCard = ({ anim }: { anim: Animated.Value }) => {
  const progress = useRef(new Animated.Value(0)).current;
  const y = anim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] });

  useEffect(() => {
    const listener = anim.addListener(({ value }) => {
      if (value > 0.6) {
        Animated.timing(progress, {
          toValue: 1,
          duration: 900,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }).start();
      }
    });
    return () => anim.removeListener(listener);
  }, []);

  const chartW = CARD_W - 36 - PAD * 2;
  const stepX = chartW / (MOOD_TREND.length - 1);
  const MAX_MOOD = 4;

  const points = MOOD_TREND.map((v, i) => ({
    x: PAD + i * stepX,
    y: PAD + (v / MAX_MOOD) * (CH - PAD * 2),
    color: MOOD_COLORS_TREND[v],
    mood: MOOD_OPTIONS[v],
  }));

  const polyPts = points.map((p) => `${p.x},${p.y}`).join(" ");

  // Smooth path
  const smoothPath = (() => {
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx = (prev.x + curr.x) / 2;
      d += ` C ${cpx} ${prev.y} ${cpx} ${curr.y} ${curr.x} ${curr.y}`;
    }
    return d;
  })();

  const areaPath =
    smoothPath +
    ` L ${points[points.length - 1].x} ${CH} L ${points[0].x} ${CH} Z`;

  return (
    <Animated.View style={{ opacity: anim, transform: [{ translateY: y }] }}>
      <Card>
        <View style={s.cardHead}>
          <View>
            <Text style={s.cardTitle}>Mood Trend</Text>
            <Text style={s.cardSub}>Last 7 days</Text>
          </View>
          <View style={s.trendAvgPill}>
            <Text style={s.trendAvgText}>😌 Mostly calm</Text>
          </View>
        </View>

        <View style={{ marginTop: 4 }}>
          <Svg width={CARD_W - 36} height={CH}>
            <Defs>
              <SvgGrad id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor={B.primary} stopOpacity="0.25" />
                <Stop offset="100%" stopColor={B.primary} stopOpacity="0" />
              </SvgGrad>
            </Defs>

            {/* Area fill */}
            <Path d={areaPath} fill="url(#areaGrad)" />

            {/* Line */}
            <Path
              d={smoothPath}
              fill="none"
              stroke={B.primary}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Points */}
            {points.map((p, i) => (
              <React.Fragment key={i}>
                <Circle cx={p.x} cy={p.y} r={5} fill={B.card} />
                <Circle cx={p.x} cy={p.y} r={3.5} fill={p.color} />
              </React.Fragment>
            ))}
          </Svg>

          {/* X labels */}
          <View style={[s.chartXRow, { paddingHorizontal: PAD }]}>
            {DAY_LABELS.map((d, i) => (
              <Text key={i} style={s.chartX}>
                {d}
              </Text>
            ))}
          </View>

          {/* Mood legend row */}
          <View style={s.trendLegend}>
            {points.map((p, i) => (
              <Text key={i} style={{ fontSize: 14 }}>
                {p.mood.emoji}
              </Text>
            ))}
          </View>
        </View>
      </Card>
    </Animated.View>
  );
};

// ─── 5. Stress gauge card ─────────────────────────────────────────────────────

const StressCard = ({ anim }: { anim: Animated.Value }) => {
  const y = anim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] });
  const barAnims = STRESS_VALS.map(() => useRef(new Animated.Value(0)).current);
  const gaugeAnim = useRef(new Animated.Value(0)).current;

  const current = STRESS_VALS[STRESS_VALS.length - 1];
  const stressColor =
    current >= 70 ? B.red : current >= 50 ? B.amber : B.accent;

  useEffect(() => {
    const listener = anim.addListener(({ value }) => {
      if (value > 0.6) {
        Animated.timing(gaugeAnim, {
          toValue: current / 100,
          duration: 1000,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }).start();
        barAnims.forEach((a, i) =>
          Animated.spring(a, {
            toValue: 1,
            delay: i * 50,
            tension: 60,
            friction: 9,
            useNativeDriver: true,
          }).start(),
        );
      }
    });
    return () => anim.removeListener(listener);
  }, []);

  const gaugeW = gaugeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const MAX_H = 56;

  return (
    <Animated.View style={{ opacity: anim, transform: [{ translateY: y }] }}>
      <Card>
        <View style={s.cardHead}>
          <View>
            <Text style={s.cardTitle}>Stress Level</Text>
            <Text style={s.cardSub}>Today vs last 7 days</Text>
          </View>
          <View
            style={[
              s.stressBadge,
              {
                borderColor: stressColor + "50",
                backgroundColor: stressColor + "15",
              },
            ]}
          >
            <Text style={[s.stressBadgeNum, { color: stressColor }]}>
              {current}%
            </Text>
          </View>
        </View>

        {/* Gauge bar */}
        <View style={s.gaugeTrack}>
          {/* Gradient segments */}
          <View
            style={[
              s.gaugeSegment,
              { backgroundColor: B.accent + "60", left: "0%", width: "40%" },
            ]}
          />
          <View
            style={[
              s.gaugeSegment,
              { backgroundColor: B.amber + "60", left: "40%", width: "30%" },
            ]}
          />
          <View
            style={[
              s.gaugeSegment,
              { backgroundColor: B.red + "60", left: "70%", width: "30%" },
            ]}
          />
          {/* Fill overlay */}
          <Animated.View
            style={[
              s.gaugeFill,
              { width: gaugeW, backgroundColor: stressColor },
            ]}
          />
          {/* Thumb */}
          <Animated.View
            style={[s.gaugeThumb, { left: gaugeW, borderColor: stressColor }]}
          />
        </View>
        <View style={s.gaugeLabels}>
          <Text style={s.gaugeLabelText}>Low</Text>
          <Text style={s.gaugeLabelText}>Moderate</Text>
          <Text style={s.gaugeLabelText}>High</Text>
        </View>

        {/* Mini bar history */}
        <View style={s.miniBarRow}>
          {STRESS_VALS.map((v, i) => {
            const h = (v / 100) * MAX_H;
            const c = v >= 70 ? B.red : v >= 50 ? B.amber : B.accent;
            const scaleY = barAnims[i];
            return (
              <View key={i} style={[s.miniBarCol, { height: MAX_H }]}>
                <View style={{ flex: 1, justifyContent: "flex-end" }}>
                  <Animated.View
                    style={[
                      s.miniBar,
                      {
                        height: h,
                        backgroundColor:
                          i === STRESS_VALS.length - 1 ? c : c + "55",
                        transform: [{ scaleY }],
                      },
                    ]}
                  />
                </View>
                <Text style={s.miniBarLabel}>{DAY_LABELS[i]}</Text>
              </View>
            );
          })}
        </View>
      </Card>
    </Animated.View>
  );
};

// ─── 6. Emotion donut ────────────────────────────────────────────────────────

const EmotionCard = ({ anim }: { anim: Animated.Value }) => {
  const y = anim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] });
  const SIZE = 130;
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const R = 46;
  const SW = 18;

  let cum = 0;
  const arcs = EMOTIONS.map((e) => {
    const pct = e.pct / 100;
    const start = cum * 2 * Math.PI - Math.PI / 2;
    const end = (cum + pct) * 2 * Math.PI - Math.PI / 2;
    cum += pct;
    const x1 = cx + R * Math.cos(start);
    const y1 = cy + R * Math.sin(start);
    const x2 = cx + R * Math.cos(end);
    const y2 = cy + R * Math.sin(end);
    const lg = pct > 0.5 ? 1 : 0;
    return { ...e, d: `M ${x1} ${y1} A ${R} ${R} 0 ${lg} 1 ${x2} ${y2}` };
  });

  const dominant = EMOTIONS[0];

  return (
    <Animated.View style={{ opacity: anim, transform: [{ translateY: y }] }}>
      <Card>
        <Text style={s.cardTitle}>Emotion Breakdown</Text>
        <Text style={[s.cardSub, { marginBottom: 18 }]}>
          This month · {EMOTIONS.length} tracked
        </Text>

        <View style={s.donutRow}>
          {/* Donut */}
          <View>
            <Svg width={SIZE} height={SIZE}>
              {/* Track */}
              <Circle
                cx={cx}
                cy={cy}
                r={R}
                fill="none"
                stroke={B.cardBorder}
                strokeWidth={SW + 2}
              />
              {/* Gap between arcs */}
              {arcs.map((arc, i) => (
                <Path
                  key={i}
                  d={arc.d}
                  fill="none"
                  stroke={arc.color}
                  strokeWidth={SW}
                  strokeLinecap="butt"
                />
              ))}
              {/* Center */}
              <Circle cx={cx} cy={cy} r={R - SW / 2 - 4} fill={B.card} />
              <SvgText
                x={cx}
                y={cy - 8}
                textAnchor="middle"
                fill={B.text}
                fontSize={22}
                fontWeight="800"
              >
                {dominant.pct}%
              </SvgText>
              <SvgText
                x={cx}
                y={cy + 10}
                textAnchor="middle"
                fill="rgba(240,244,255,0.45)"
                fontSize={10}
              >
                {dominant.label}
              </SvgText>
            </Svg>
          </View>

          {/* Legend */}
          <View style={s.donutLegend}>
            {EMOTIONS.map((e, i) => (
              <View key={i} style={s.donutLegendRow}>
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4,
                    }}
                  >
                    <View style={[s.legendDot, { backgroundColor: e.color }]} />
                    <Text style={s.legendLabel}>{e.label}</Text>
                    <Text style={[s.legendPct, { color: e.color }]}>
                      {e.pct}%
                    </Text>
                  </View>
                  <View style={s.legendTrack}>
                    <View
                      style={[
                        s.legendFill,
                        { width: `${e.pct}%`, backgroundColor: e.color },
                      ]}
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </Card>
    </Animated.View>
  );
};

// ─── 7. Org card ─────────────────────────────────────────────────────────────

const OrgCard = ({ anim }: { anim: Animated.Value }) => {
  const y = anim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] });
  return (
    <Animated.View style={{ opacity: anim, transform: [{ translateY: y }] }}>
      <Card>
        <View style={s.orgRow}>
          <View style={s.orgIconWrap}>
            <Text style={{ fontSize: 20 }}>🏢</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.cardTitle}>Organization Access</Text>
            <Text style={s.cardSub}>TechCorp Ltd · Request pending</Text>
          </View>
          <View style={s.orgPendingBadge}>
            <Text style={s.orgPendingText}>PENDING</Text>
          </View>
        </View>
        <View style={s.orgTrack}>
          <View style={s.orgFill} />
        </View>
        <Text style={s.orgHint}>Awaiting admin review · Sent 2 days ago</Text>
      </Card>
    </Animated.View>
  );
};

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function HomeScreen({ onOpenAI }: { onOpenAI?: () => void }) {
  const a = Array.from(
    { length: 8 },
    () => useRef(new Animated.Value(0)).current,
  );
  const [headerA, aiA, moodA, trendA, stressA, emotionA, orgA] = a;

  useEffect(() => {
    Animated.stagger(
      80,
      a.map((v) =>
        Animated.spring(v, {
          toValue: 1,
          tension: 48,
          friction: 12,
          useNativeDriver: true,
        }),
      ),
    ).start();
  }, []);

  return (
    <View style={s.root}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {/* Ambient top glow */}
      <View style={s.topGlow} pointerEvents="none" />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={s.scroll}
          showsVerticalScrollIndicator={false}
        >
          <Header anim={headerA} />
          <Gap />
          <AiCard anim={aiA} onPress={onOpenAI} />
          <Gap />
          <MoodCard anim={moodA} />
          <Gap />
          <MoodTrendCard anim={trendA} />
          <Gap />
          <StressCard anim={stressA} />
          <Gap />
          <EmotionCard anim={emotionA} />
          <Gap />
          <OrgCard anim={orgA} />
          <View style={{ height: 110 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const Gap = () => <View style={{ height: 14 }} />;

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: B.bg },
  scroll: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20 },
  topGlow: {
    position: "absolute",
    top: -80,
    left: W * 0.1,
    width: W * 0.8,
    height: 200,
    borderRadius: 100,
    backgroundColor: B.primary,
    opacity: 0.07,
  },

  // Card
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
  cardHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: B.text,
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  cardSub: { fontSize: 12, color: B.muted },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: B.muted2,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 8,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 6,
  },
  headerGreet: { fontSize: 13, color: B.muted, marginBottom: 3 },
  headerId: {
    fontSize: 22,
    fontWeight: "800",
    color: B.text,
    letterSpacing: -0.6,
  },
  streakPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#F59E0B18",
    borderWidth: 1,
    borderColor: "#F59E0B30",
  },
  streakFire: { fontSize: 14 },
  streakNum: { fontSize: 14, fontWeight: "800", color: B.amber },
  pendingPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#F59E0B12",
    borderWidth: 1,
    borderColor: "#F59E0B30",
  },
  pendingDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: B.amber,
  },
  pendingText: { fontSize: 11, fontWeight: "700", color: B.amber },

  // AI card
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

  // Mood check-in
  moodRow: { flexDirection: "row", justifyContent: "space-between", gap: 6 },
  moodPill: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: B.cardBorder,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  moodEmoji: { fontSize: 22, marginBottom: 5 },
  moodLabel: { fontSize: 9, color: B.muted, fontWeight: "600" },
  loggedBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  loggedText: { fontSize: 11, fontWeight: "700" },

  // Mood trend
  chartXRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  chartX: { fontSize: 10, color: B.muted2, textAlign: "center", flex: 1 },
  trendLegend: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginTop: 6,
  },
  trendAvgPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: B.primary + "35",
    backgroundColor: B.primary + "12",
  },
  trendAvgText: { fontSize: 11, color: B.primary, fontWeight: "600" },

  // Stress
  stressBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  stressBadgeNum: { fontSize: 16, fontWeight: "800" },
  gaugeTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginBottom: 6,
    overflow: "visible",
    position: "relative",
    flexDirection: "row",
  },
  gaugeSegment: {
    position: "absolute",
    top: 0,
    height: "100%",
    borderRadius: 5,
  },
  gaugeFill: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    borderRadius: 5,
    opacity: 0.85,
  },
  gaugeThumb: {
    position: "absolute",
    top: -3,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: B.card,
    borderWidth: 2,
    marginLeft: -8,
  },
  gaugeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  gaugeLabelText: { fontSize: 10, color: B.muted2 },
  miniBarRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  miniBarCol: { flex: 1, alignItems: "center", justifyContent: "flex-end" },
  miniBar: { width: 22, borderRadius: 5 },
  miniBarLabel: { fontSize: 9, color: B.muted2, marginTop: 5 },

  // Emotion donut
  donutRow: { flexDirection: "row", alignItems: "center", gap: 18 },
  donutLegend: { flex: 1, gap: 12 },
  donutLegendRow: {},
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { fontSize: 12, color: B.muted, flex: 1 },
  legendPct: { fontSize: 12, fontWeight: "700" },
  legendTrack: {
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.07)",
    overflow: "hidden",
  },
  legendFill: { height: 3, borderRadius: 2 },

  // Org
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
