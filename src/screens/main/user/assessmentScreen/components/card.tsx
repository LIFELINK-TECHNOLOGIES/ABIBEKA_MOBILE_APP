import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle, Path, Text as SvgText } from "react-native-svg";
import { B, CARD_W, EMOTIONS, MOODS, SITUATIONS, W } from "../data/constants";
import { Shell, s } from "../style";

// ─── Intro ────────────────────────────────────────────────────────────────────

export const IntroCard = ({ onStart }: { onStart: () => void }) => {
  const float = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0.6)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: -10,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0.6,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

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
    ]).start(onStart);
  };

  return (
    <Shell accent={B.primary}>
      <View style={{ alignItems: "center", paddingVertical: 12 }}>
        <Animated.View
          style={[
            s.introIcon,
            { transform: [{ translateY: float }], opacity: glow },
          ]}
        >
          <Text style={{ fontSize: 44 }}>🌱</Text>
        </Animated.View>
        <Text style={s.introTitle}>Let's check in{"\n"}with you.</Text>
        <Text style={s.introSub}>
          A 2-minute daily assessment to understand how you're really feeling.
          Private. Anonymous. Just for you.
        </Text>
        <View style={s.introStats}>
          {[
            ["2 min", "Quick"],
            ["100%", "Private"],
            ["Daily", "Streak"],
          ].map(([val, lbl], i) => (
            <View key={i} style={s.introStat}>
              <Text
                style={[
                  s.introStatVal,
                  { color: [B.accent, B.primary, B.amber][i] },
                ]}
              >
                {val}
              </Text>
              <Text style={s.introStatLbl}>{lbl}</Text>
            </View>
          ))}
        </View>
        <Animated.View
          style={{ width: "100%", transform: [{ scale: btnScale }] }}
        >
          <TouchableOpacity
            onPress={tap}
            activeOpacity={0.88}
            style={s.startBtn}
          >
            <Text style={s.startBtnText}>Begin Assessment</Text>
            <Text style={{ fontSize: 18, color: "#fff" }}>→</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Shell>
  );
};

// ─── Mood ─────────────────────────────────────────────────────────────────────

export const MoodCard = ({
  selected,
  onSelect,
}: {
  selected: number | null;
  onSelect: (i: number) => void;
}) => {
  const scales = MOODS.map(() => useRef(new Animated.Value(1)).current);
  const glows = MOODS.map(() => useRef(new Animated.Value(0)).current);

  const pick = (i: number) => {
    onSelect(i);
    MOODS.forEach((_, j) => {
      if (j !== i) {
        Animated.spring(scales[j], {
          toValue: 1,
          tension: 200,
          friction: 10,
          useNativeDriver: true,
        }).start();
        Animated.timing(glows[j], {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    });
    Animated.spring(scales[i], {
      toValue: 1.06,
      tension: 200,
      friction: 8,
      useNativeDriver: true,
    }).start();
    Animated.timing(glows[i], {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Shell accent={selected !== null ? MOODS[selected].color : undefined}>
      <Text style={s.cardQ}>How would you describe{"\n"}your day so far?</Text>
      <Text style={s.cardHint}>Tap the one that fits best</Text>
      <View style={{ gap: 10, marginTop: 4 }}>
        {MOODS.map((m, i) => {
          const active = selected === i;
          return (
            <Animated.View
              key={i}
              style={{ transform: [{ scale: scales[i] }] }}
            >
              <Pressable onPress={() => pick(i)}>
                <Animated.View
                  style={[
                    s.moodRow,
                    active && {
                      borderColor: m.color,
                      backgroundColor: m.color + "15",
                    },
                  ]}
                >
                  <View
                    style={[
                      s.moodRowBar,
                      { backgroundColor: active ? m.color : "transparent" },
                    ]}
                  />
                  <Text style={s.moodRowEmoji}>{m.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[s.moodRowLabel, active && { color: m.color }]}
                    >
                      {m.label}
                    </Text>
                    <Text style={s.moodRowSub}>{m.sub}</Text>
                  </View>
                  <View
                    style={[
                      s.moodCheck,
                      active && {
                        backgroundColor: m.color,
                        borderColor: m.color,
                      },
                    ]}
                  >
                    {active && (
                      <Text style={{ fontSize: 9, color: "#fff" }}>✓</Text>
                    )}
                  </View>
                  {active && (
                    <Animated.View
                      pointerEvents="none"
                      style={[
                        StyleSheet.absoluteFill,
                        { borderRadius: 16, backgroundColor: m.color + "08" },
                      ]}
                    />
                  )}
                </Animated.View>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
    </Shell>
  );
};

// ─── Emotions ─────────────────────────────────────────────────────────────────

const EmotionBubble = ({
  emotion,
  selected,
  onToggle,
}: {
  emotion: (typeof EMOTIONS)[0];
  selected: boolean;
  onToggle: () => void;
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const tap = () => {
    onToggle();
    Animated.sequence([
      Animated.spring(scale, {
        toValue: selected ? 0.92 : 1.18,
        tension: 300,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: selected ? 1 : 1.05,
        tension: 300,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const baseSize = 80 * emotion.size;

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable onPress={tap}>
        <View
          style={[
            s.bubble,
            {
              width: baseSize,
              height: baseSize,
              borderRadius: baseSize / 2,
              borderColor: emotion.color + (selected ? "80" : "25"),
              backgroundColor: selected
                ? emotion.color + "22"
                : "rgba(255,255,255,0.03)",
              shadowColor: selected ? emotion.color : "transparent",
              shadowRadius: selected ? 14 : 0,
              shadowOpacity: 0.5,
              shadowOffset: { width: 0, height: 0 },
            },
          ]}
        >
          <Text
            style={[
              s.bubbleText,
              selected && { color: emotion.color, fontWeight: "800" },
            ]}
          >
            {emotion.label}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

export const EmotionsCard = ({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (e: string) => void;
}) => (
  <Shell accent={B.violet}>
    <Text style={s.cardQ}>Which emotions are{"\n"}strongest right now?</Text>
    <Text style={s.cardHint}>
      Tap all that feel true — bubbles grow when selected
    </Text>
    <View style={s.bubbleWrap}>
      {EMOTIONS.map((e, i) => (
        <EmotionBubble
          key={i}
          emotion={e}
          selected={selected.includes(e.label)}
          onToggle={() => onToggle(e.label)}
        />
      ))}
    </View>
    {selected.length > 0 && (
      <View style={s.bubbleSelected}>
        <Text style={s.bubbleSelectedText}>{selected.join(" · ")}</Text>
      </View>
    )}
  </Shell>
);

// ─── Energy ───────────────────────────────────────────────────────────────────

const ArcGauge = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) => {
  const SIZE = CARD_W - 40;
  const CX = SIZE / 2,
    CY = SIZE * 0.55;
  const R = SIZE * 0.38;
  const START_DEG = 210,
    SWEEP_DEG = 240;
  const toRad = (d: number) => (d * Math.PI) / 180;

  const arcPath = (startDeg: number, endDeg: number, r: number) => {
    const s2 = toRad(startDeg),
      e = toRad(endDeg);
    const x1 = CX + r * Math.cos(s2),
      y1 = CY + r * Math.sin(s2);
    const x2 = CX + r * Math.cos(e),
      y2 = CY + r * Math.sin(e);
    return `M ${x1} ${y1} A ${r} ${r} 0 ${endDeg - startDeg > 180 ? 1 : 0} 1 ${x2} ${y2}`;
  };

  const filledEnd = START_DEG + (value / 10) * SWEEP_DEG;
  const color = value <= 3 ? B.red : value <= 6 ? B.amber : B.accent;
  const tA = toRad(filledEnd);
  const EMOJI =
    value <= 2
      ? "😴"
      : value <= 4
        ? "😔"
        : value <= 6
          ? "😐"
          : value <= 8
            ? "😊"
            : "⚡";

  return (
    <View style={{ alignItems: "center" }}>
      <Svg width={SIZE} height={SIZE * 0.7}>
        <Path
          d={arcPath(START_DEG, START_DEG + SWEEP_DEG, R)}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={14}
          strokeLinecap="round"
        />
        {value > 0 && (
          <>
            <Path
              d={arcPath(START_DEG, filledEnd, R)}
              fill="none"
              stroke={color}
              strokeWidth={14}
              strokeLinecap="round"
            />
            <Path
              d={arcPath(START_DEG, filledEnd, R)}
              fill="none"
              stroke={color}
              strokeWidth={28}
              strokeLinecap="round"
              strokeOpacity={0.12}
            />
            <Circle
              cx={CX + R * Math.cos(tA)}
              cy={CY + R * Math.sin(tA)}
              r={12}
              fill={B.card}
            />
            <Circle
              cx={CX + R * Math.cos(tA)}
              cy={CY + R * Math.sin(tA)}
              r={8}
              fill={color}
            />
          </>
        )}
        <SvgText x={CX} y={CY - 10} textAnchor="middle" fontSize={36}>
          {EMOJI}
        </SvgText>
        <SvgText
          x={CX}
          y={CY + 22}
          textAnchor="middle"
          fill={color}
          fontSize={32}
          fontWeight="900"
        >
          {value}
        </SvgText>
        <SvgText
          x={CX}
          y={CY + 40}
          textAnchor="middle"
          fill="rgba(240,244,255,0.35)"
          fontSize={12}
        >
          out of 10
        </SvgText>
      </Svg>
      <View style={s.arcTapRow}>
        {Array.from({ length: 10 }, (_, i) => {
          const v = i + 1;
          const c = v <= 3 ? B.red : v <= 6 ? B.amber : B.accent;
          const active = v === value;
          return (
            <Pressable
              key={i}
              onPress={() => onChange(v)}
              style={[
                s.arcTap,
                active && { backgroundColor: c, borderColor: c },
              ]}
            >
              <Text
                style={[
                  s.arcTapText,
                  active && { color: "#fff", fontWeight: "800" },
                ]}
              >
                {v}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export const EnergyCard = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) => (
  <Shell accent={value <= 3 ? B.red : value <= 6 ? B.amber : B.accent}>
    <Text style={s.cardQ}>What's your energy{"\n"}level right now?</Text>
    <Text style={s.cardHint}>Tap a number or watch the gauge fill</Text>
    <ArcGauge value={value} onChange={onChange} />
    <View style={s.energyLegend}>
      {["Drained", "Low", "Moderate", "Good", "Energised"].map((l, i) => (
        <Text
          key={i}
          style={[
            s.energyLegendText,
            { color: i <= 1 ? B.red : i === 2 ? B.amber : B.accent },
          ]}
        >
          {l}
        </Text>
      ))}
    </View>
  </Shell>
);

// ─── Stress ───────────────────────────────────────────────────────────────────

const Thermometer = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) => {
  const fillAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(fillAnim, {
      toValue: value / 10,
      tension: 60,
      friction: 10,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const color =
    value === 0
      ? B.muted2
      : value <= 3
        ? B.accent
        : value <= 6
          ? B.amber
          : B.red;
  const fillH = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });
  const LABELS = [
    [10, "Extreme"],
    [8, "Very High"],
    [6, "High"],
    [4, "Moderate"],
    [2, "Low"],
    [0, "None"],
  ] as const;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 20,
        marginTop: 8,
      }}
    >
      <View style={{ alignItems: "center" }}>
        <View style={s.thermoTube}>
          <Animated.View
            style={[s.thermoFill, { height: fillH, backgroundColor: color }]}
          />
          {Array.from({ length: 10 }, (_, i) => (
            <View
              key={i}
              pointerEvents="none"
              style={[
                s.thermoTick,
                { bottom: `${(i + 1) * 10}%` },
                i % 4 === 3 && {
                  width: 12,
                  backgroundColor: "rgba(255,255,255,0.25)",
                },
              ]}
            />
          ))}
        </View>
        <Animated.View
          style={[
            s.thermoBulb,
            {
              backgroundColor: color,
              shadowColor: color,
              shadowRadius: 12,
              shadowOpacity: 0.7,
              shadowOffset: { width: 0, height: 0 },
            },
          ]}
        />
      </View>
      <View style={{ flex: 1, gap: 0 }}>
        {LABELS.map(([v, lbl]) => {
          const inRange = value >= v && v > 0;
          return (
            <Pressable
              key={v}
              onPress={() => onChange(v === 0 ? 0 : v)}
              style={[
                s.thermoBtn,
                inRange && {
                  backgroundColor: color + "12",
                  borderColor: color + "35",
                },
              ]}
            >
              <View
                style={[s.thermoCircle, inRange && { backgroundColor: color }]}
              >
                <Text
                  style={[s.thermoCircleText, inRange && { color: "#fff" }]}
                >
                  {v}
                </Text>
              </View>
              <Text
                style={[s.thermoLabel, inRange && { color, fontWeight: "700" }]}
              >
                {lbl}
              </Text>
              {inRange && (
                <View style={[s.thermoFillDot, { backgroundColor: color }]} />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export const StressCard = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) => {
  const color =
    value === 0
      ? B.muted2
      : value <= 3
        ? B.accent
        : value <= 6
          ? B.amber
          : B.red;
  return (
    <Shell accent={value > 0 ? color : undefined}>
      <Text style={s.cardQ}>How stressed are you{"\n"}feeling today?</Text>
      <Text style={s.cardHint}>Tap a level on the thermometer</Text>
      <Thermometer value={value} onChange={onChange} />
      {value > 0 && (
        <View
          style={[
            s.stressTag,
            { borderColor: color + "40", backgroundColor: color + "12" },
          ]}
        >
          <Text style={[s.stressTagText, { color }]}>
            {value}/10 ·{" "}
            {value <= 3
              ? "Low — you're doing well 🌱"
              : value <= 6
                ? "Moderate — take it easy today"
                : "High — please be kind to yourself ❤️"}
          </Text>
        </View>
      )}
    </Shell>
  );
};

// ─── Situation ────────────────────────────────────────────────────────────────

const SituationTile = ({
  sit,
  active,
  onPress,
}: {
  sit: (typeof SITUATIONS)[0];
  active: boolean;
  onPress: () => void;
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const floatY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(floatY, {
      toValue: active ? -6 : 0,
      tension: 200,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [active]);

  const tap = () => {
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 0.92,
        tension: 300,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        tension: 300,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start(onPress);
  };

  const tileW = (CARD_W - 40 - 24) / 4;

  return (
    <Animated.View style={{ transform: [{ scale }, { translateY: floatY }] }}>
      <Pressable
        onPress={tap}
        style={[
          s.sitTile,
          {
            width: tileW,
            borderColor: active ? sit.color : B.border,
            backgroundColor: active
              ? sit.color + "18"
              : "rgba(255,255,255,0.03)",
          },
        ]}
      >
        {active && (
          <View style={[s.sitCheck, { backgroundColor: sit.color }]}>
            <Text style={{ fontSize: 8, color: "#fff" }}>✓</Text>
          </View>
        )}
        <Text style={s.sitEmoji}>{sit.emoji}</Text>
        <Text style={[s.sitLabel, active && { color: sit.color }]}>
          {sit.label}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

export const SituationCard = ({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (s: string) => void;
}) => (
  <Shell accent={B.sky}>
    <Text style={s.cardQ}>What's affecting you{"\n"}most today?</Text>
    <Text style={s.cardHint}>
      Selected tiles float up — pick all that apply
    </Text>
    <View style={s.sitGrid}>
      {SITUATIONS.map((sit, i) => (
        <SituationTile
          key={i}
          sit={sit}
          active={selected.includes(sit.label)}
          onPress={() => onToggle(sit.label)}
        />
      ))}
    </View>
  </Shell>
);
