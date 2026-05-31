import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
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
import { AssessmentState, B, STEP_LABEL, TOTAL_STEPS } from "./data/constants";
import { s } from "./style";
import {
  EnergyCard,
  EmotionsCard,
  IntroCard,
  MoodCard,
  SituationCard,
  StressCard,
} from "./components/card";
import { AiInsightCard, SubmitCard } from "./components/result";
import { QuestionsCard } from "./components/auestionCard";

// ─── Progress header ──────────────────────────────────────────────────────────

const ProgressHeader = ({ step, streak }: { step: number; streak: number }) => {
  const prog = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(prog, {
      toValue: Math.min(step / TOTAL_STEPS, 1),
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [step]);

  const w = prog.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={s.progWrap}>
      <View style={s.progTop}>
        <View>
          <Text style={s.progTitle}>Daily Check-In</Text>
          <Text style={s.progSub}>{STEP_LABEL[step] ?? ""}</Text>
        </View>
        <View style={s.streakPill}>
          <Text>🔥</Text>
          <Text style={s.streakNum}>{streak}</Text>
        </View>
      </View>
      <View style={s.progTrack}>
        <Animated.View style={[s.progFill, { width: w }]} />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 5,
        }}
      >
        <Text style={s.progPct}>
          {Math.round(Math.min(step / TOTAL_STEPS, 1) * 100)}%
        </Text>
        <Text style={s.progPct}>
          Step {Math.min(step, TOTAL_STEPS)} of {TOTAL_STEPS}
        </Text>
      </View>
    </View>
  );
};

// ─── Main screen ──────────────────────────────────────────────────────────────

interface AssessmentScreenProps {
  streak?: number;
  onComplete?: (state: AssessmentState) => void;
}

export default function AssessmentScreen({
  streak = 8,
  onComplete,
}: AssessmentScreenProps) {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<AssessmentState>({
    mood: null,
    emotions: [],
    energy: 5,
    stress: 0,
    situations: [],
    answers: {},
  });
  const [submitted, setSubmitted] = useState(false);

  const scrollRef = useRef<ScrollView>(null);
  const cardAnim = useRef(new Animated.Value(0)).current;

  // Animate card in on step change
  useEffect(() => {
    cardAnim.setValue(0);
    Animated.spring(cardAnim, {
      toValue: 1,
      tension: 46,
      friction: 13,
      useNativeDriver: true,
    }).start();
    setTimeout(() => scrollRef.current?.scrollTo({ y: 0, animated: true }), 80);
  }, [step]);

  const advance = () => {
    if (step < 8) setStep((s) => s + 1);
  };
  const back = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const canAdvance =
    step === 0
      ? false
      : step === 1
        ? state.mood !== null
        : step === 4
          ? state.stress > 0
          : true;

  const update = (patch: Partial<AssessmentState>) =>
    setState((prev) => ({ ...prev, ...patch }));

  const handleSubmit = () => {
    setSubmitted(true);
    onComplete?.(state);
  };

  const cardStyle = {
    opacity: cardAnim,
    transform: [
      {
        translateY: cardAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [32, 0],
        }),
      },
    ],
  };

  return (
    <View style={ls.root}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <SafeAreaView style={{ flex: 1 }}>
        <ProgressHeader step={Math.max(0, step - 1)} streak={streak} />

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={ls.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Active card */}
          <Animated.View style={cardStyle}>
            {step === 0 && <IntroCard onStart={advance} />}
            {step === 1 && (
              <MoodCard
                selected={state.mood}
                onSelect={(i) => update({ mood: i })}
              />
            )}
            {step === 2 && (
              <EmotionsCard
                selected={state.emotions}
                onToggle={(e) =>
                  update({
                    emotions: state.emotions.includes(e)
                      ? state.emotions.filter((x) => x !== e)
                      : [...state.emotions, e],
                  })
                }
              />
            )}
            {step === 3 && (
              <EnergyCard
                value={state.energy}
                onChange={(v) => update({ energy: v })}
              />
            )}
            {step === 4 && (
              <StressCard
                value={state.stress}
                onChange={(v) => update({ stress: v })}
              />
            )}
            {step === 5 && (
              <SituationCard
                selected={state.situations}
                onToggle={(sit) =>
                  update({
                    situations: state.situations.includes(sit)
                      ? state.situations.filter((x) => x !== sit)
                      : [...state.situations, sit],
                  })
                }
              />
            )}
            {step === 6 && (
              <QuestionsCard
                moodIdx={state.mood}
                situations={state.situations}
                answers={state.answers}
                onAnswer={(id, val) =>
                  update({ answers: { ...state.answers, [id]: val } })
                }
              />
            )}
            {step === 7 && (
              <AiInsightCard
                moodIdx={state.mood}
                stress={state.stress}
                energy={state.energy}
                emotions={state.emotions}
              />
            )}
            {step === 8 && (
              <SubmitCard onSubmit={handleSubmit} submitted={submitted} />
            )}
          </Animated.View>

          {/* Navigation buttons */}
          {step > 0 && step < 8 && (
            <Animated.View style={[s.navWrap, cardStyle]}>
              <TouchableOpacity
                onPress={advance}
                activeOpacity={0.88}
                disabled={!canAdvance}
                style={[s.nextBtn, !canAdvance && s.nextDisabled]}
              >
                <Text style={s.nextText}>
                  {step === 7 ? "View Summary" : "Continue"}
                </Text>
                <Text style={{ fontSize: 16, color: "#fff", opacity: 0.8 }}>
                  →
                </Text>
              </TouchableOpacity>
              <Pressable onPress={back} style={s.backBtn}>
                <Text style={s.backText}>← Back</Text>
              </Pressable>
            </Animated.View>
          )}

          {step === 8 && !submitted && (
            <Animated.View style={[{ marginTop: 12 }, cardStyle]}>
              <Pressable onPress={back} style={s.backBtn}>
                <Text style={s.backText}>← Back</Text>
              </Pressable>
            </Animated.View>
          )}

          <View style={{ height: 110 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const ls = StyleSheet.create({
  root: { flex: 1, backgroundColor: B.bg },
  scroll: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40 },
});
