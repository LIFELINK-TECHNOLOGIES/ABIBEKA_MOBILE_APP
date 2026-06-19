import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AssessmentState, B, STEP_LABEL, TOTAL_STEPS } from "./data/constants";
import {
  EnergyCard,
  EmotionsCard,
  MoodCard,
  SituationCard,
  StressCard,
} from "./components/card";
import { SubmitCard } from "./components/result";
import { QuestionsCard } from "./components/auestionCard";
import { useSubmitCheckIn, useTodayMoodEntry } from "../../../../api/hooks/shared/moodEntry";
import { AiInsightCard } from "./components/questions";

// ─── Midnight helper ──────────────────────────────────────────────────────────
// Check-ins reset at midnight local time. This is the single source of truth
// for "when does the next window open" — no backend field needed.
const getMidnightTonight = (): string => {
  const d = new Date();
  d.setHours(24, 0, 0, 0); // rolls to 00:00:00.000 of tomorrow
  return d.toISOString();
};

// ─── Responsive helpers ───────────────────────────────────────────────────────
const BASE_W = 390;
const useScale = () => {
  const { width, height } = useWindowDimensions();
  const isSmall = height < 700;
  const scale = (v: number) => Math.round((v * width) / BASE_W);
  return { width, height, isSmall, scale };
};

// ─── Progress header ──────────────────────────────────────────────────────────
const ProgressHeader = ({ step, streak }: { step: number; streak: number }) => {
  const { isSmall, scale } = useScale();
  const prog = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(prog, {
      toValue: Math.min(step / TOTAL_STEPS, 1),
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [step]);

  return (
    <View
      style={[
        s.progWrap,
        { paddingHorizontal: scale(20), paddingVertical: isSmall ? 8 : 12 },
      ]}
    >
      <View style={s.progTop}>
        <View>
          <Text style={[s.progTitle, { fontSize: isSmall ? 12 : 13 }]}>
            Daily Check-In
          </Text>
          <Text style={s.progSub}>{STEP_LABEL[step] ?? ""}</Text>
        </View>
        <View style={s.streakPill}>
          <Text style={{ fontSize: isSmall ? 12 : 13 }}>🔥</Text>
          <Text style={[s.streakNum, { fontSize: isSmall ? 11 : 12 }]}>{streak}</Text>
        </View>
      </View>

      <View style={[s.dotRow, { marginBottom: isSmall ? 3 : 5 }]}>
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <View
            key={i}
            style={[s.dot, i < step && s.dotDone, i === step && s.dotActive]}
          />
        ))}
      </View>

      <View style={s.progMeta}>
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

// ─── Step shell ───────────────────────────────────────────────────────────────
const StepShell = ({
  eyebrow,
  question,
  highlight,
  sub,
  children,
}: {
  eyebrow?: string;
  question?: string;
  highlight?: string;
  sub?: string;
  children: React.ReactNode;
}) => {
  const { isSmall, scale } = useScale();
  return (
    <View style={{ paddingTop: isSmall ? scale(12) : scale(20) }}>
      {eyebrow ? (
        <Text style={[s.eyebrow, { fontSize: isSmall ? 9 : 10 }]}>{eyebrow}</Text>
      ) : null}
      {question ? (
        <Text
          style={[
            s.bigQ,
            { fontSize: isSmall ? scale(19) : scale(24), marginBottom: isSmall ? 4 : 6 },
          ]}
        >
          {question}{" "}
          {highlight ? <Text style={s.bigQAccent}>{highlight}</Text> : null}
        </Text>
      ) : null}
      {sub ? (
        <Text
          style={[
            s.bigSub,
            { fontSize: isSmall ? 11 : 13, marginBottom: isSmall ? 14 : 22 },
          ]}
        >
          {sub}
        </Text>
      ) : null}
      {children}
    </View>
  );
};

// ─── Intro step ───────────────────────────────────────────────────────────────
const IntroStep = ({ onStart }: { onStart: () => void }) => {
  const { isSmall, scale } = useScale();
  return (
    <View
      style={[
        s.introWrap,
        { gap: isSmall ? 12 : 18, paddingTop: isSmall ? scale(20) : scale(40) },
      ]}
    >
      <View
        style={[
          s.introIcon,
          {
            width: isSmall ? 56 : 72,
            height: isSmall ? 56 : 72,
            borderRadius: isSmall ? 18 : 24,
          },
        ]}
      >
        <Text style={{ fontSize: isSmall ? 26 : 34 }}>✨</Text>
      </View>

      <Text style={[s.introTitle, { fontSize: isSmall ? scale(24) : scale(30) }]}>
        {"How are you\ntoday?"}
      </Text>

      <Text style={[s.introSub, { fontSize: isSmall ? 13 : 14 }]}>
        A quick 2-min check-in to track your wellbeing.{"\n"}Anonymous & private.
      </Text>

      <View style={s.introPills}>
        {["😌 Anonymous", "⚡ 2 minutes", "🔒 Private"].map((p) => (
          <View key={p} style={s.introPill}>
            <Text style={[s.introPillText, { fontSize: isSmall ? 11 : 12 }]}>{p}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        onPress={onStart}
        activeOpacity={0.88}
        style={[
          s.startBtn,
          {
            height: isSmall ? 46 : 52,
            borderRadius: isSmall ? 14 : 16,
            marginTop: isSmall ? 8 : 16,
          },
        ]}
      >
        <Text style={[s.startBtnText, { fontSize: isSmall ? 14 : 15 }]}>
          Let's begin →
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// ─── Inline nav ───────────────────────────────────────────────────────────────
const InlineNav = ({
  step,
  canAdvance,
  onNext,
  onBack,
}: {
  step: number;
  canAdvance: boolean;
  onNext: () => void;
  onBack: () => void;
}) => {
  const { isSmall, scale } = useScale();
  const btnH   = isSmall ? 44 : 50;
  const radius = isSmall ? 13 : 15;
  const label  = step === 7 ? "View Summary" : step === 8 ? "Done" : "Continue";

  return (
    <View style={[s.navWrap, { marginTop: isSmall ? 20 : 28 }]}>
      <View style={s.navRow}>
        <Pressable
          onPress={onBack}
          style={[s.backPill, { width: btnH, height: btnH, borderRadius: radius }]}
        >
          <Text style={[s.backPillText, { fontSize: isSmall ? 16 : 18 }]}>←</Text>
        </Pressable>

        <TouchableOpacity
          onPress={onNext}
          activeOpacity={0.88}
          disabled={!canAdvance}
          style={[
            s.nextBtn,
            { height: btnH, borderRadius: radius },
            !canAdvance && s.nextDisabled,
          ]}
        >
          <Text style={[s.nextText, { fontSize: isSmall ? 13 : 15 }]}>{label}</Text>
          <Text style={{ fontSize: isSmall ? 14 : 16, color: "#fff", opacity: 0.8 }}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ─── Already-checked-in screen ────────────────────────────────────────────────
// Shown immediately when the user opens the screen and the backend confirms
// they already checked in today (e.g. after logout + re-login).
const AlreadyCheckedIn = ({ streak }: { streak: number }) => (
  <View style={s.root}>
    <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <ProgressHeader step={TOTAL_STEPS} streak={streak} />
      <ScrollView
        contentContainerStyle={[s.scroll, { paddingHorizontal: 22 }]}
        showsVerticalScrollIndicator={false}
      >
        <StepShell
          eyebrow="All done"
          question="You're"
          highlight="all set."
          sub="Your check-in has been recorded anonymously."
        >
          {/* submitted=true, nextCheckIn computed from local midnight */}
          <SubmitCard
            onSubmit={() => {}}
            submitted
            nextCheckIn={getMidnightTonight()}
          />
        </StepShell>
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  </View>
);

// ─── Main screen ──────────────────────────────────────────────────────────────
interface AssessmentScreenProps {
  streak?: number;
  onComplete?: (state: AssessmentState) => void;
}

export default function AssessmentScreen({
  streak = 8,
  onComplete,
}: AssessmentScreenProps) {
  const { scale } = useScale();

  // ── Check if the user already submitted today (persists across sessions) ──
  const { data: todayData, isLoading: checkingToday } = useTodayMoodEntry();
  const alreadyDoneToday = todayData?.checkedInToday === true;

  const [step, setStep]       = useState(0);
  const [state, setState]     = useState<AssessmentState>({
    mood: null,
    emotions: [],
    energy: 5,
    stress: 0,
    situations: [],
    answers: {},
  });
  // submitted tracks whether the user just finished within this session
  const [submitted, setSubmitted] = useState(false);

  const scrollRef = useRef<ScrollView>(null);
  const cardAnim  = useRef(new Animated.Value(0)).current;

  const { mutate: submitCheckIn, isPending: isSubmitting } = useSubmitCheckIn();

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

  // ── Loading state while we check today's entry ────────────────────────────
  if (checkingToday) {
    return (
      <View style={[s.root, { alignItems: "center", justifyContent: "center" }]}>
        <ActivityIndicator color={B.primary} size="large" />
      </View>
    );
  }

  // ── Already checked in today — show countdown immediately ─────────────────
  if (alreadyDoneToday) {
    return <AlreadyCheckedIn streak={streak} />;
  }

  // ── Normal flow ───────────────────────────────────────────────────────────
  const advance = () => { if (step < 8) setStep((v) => v + 1); };
  const back    = () => { if (step > 0) setStep((v) => v - 1); };

  const canAdvance =
    step === 0 ? true
    : step === 1 ? state.mood !== null
    : step === 4 ? state.stress > 0
    : true;

  const update = (patch: Partial<AssessmentState>) =>
    setState((prev) => ({ ...prev, ...patch }));

  const handleSubmit = () => {
    if (state.mood === null) {
      Alert.alert("Almost done", "Please select your mood before submitting.");
      return;
    }

    submitCheckIn(
      {
        mood: state.mood,
        emotions: state.emotions,
        energy: state.energy,
        stress: state.stress,
        situations: state.situations,
        answers: state.answers,
      },
      {
        onSuccess: () => {
          // Mark as submitted; SubmitCard derives the countdown from
          // getMidnightTonight() — no backend field needed.
          setSubmitted(true);
          onComplete?.(state);
        },
        onError: (err: any) => {
          Alert.alert(
            "Error",
            err?.response?.data?.message ||
              "Failed to save your check-in. Please try again.",
          );
        },
      },
    );
  };

  const cardStyle = {
    opacity: cardAnim,
    transform: [
      {
        translateY: cardAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [28, 0],
        }),
      },
    ],
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <StepShell>
            <IntroStep onStart={advance} />
          </StepShell>
        );
      case 1:
        return (
          <StepShell
            eyebrow="Mood check"
            question="How are you"
            highlight="feeling right now?"
            sub="Pick the one that feels closest."
          >
            <MoodCard selected={state.mood} onSelect={(i) => update({ mood: i })} />
          </StepShell>
        );
      case 2:
        return (
          <StepShell
            eyebrow="Emotions"
            question="What emotions are"
            highlight="present?"
            sub="Select all that apply."
          >
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
          </StepShell>
        );
      case 3:
        return (
          <StepShell
            eyebrow="Energy"
            question="How's your"
            highlight="energy today?"
            sub="Think about your physical and mental energy."
          >
            <EnergyCard value={state.energy} onChange={(v) => update({ energy: v })} />
          </StepShell>
        );
      case 4:
        return (
          <StepShell
            eyebrow="Stress check"
            question="What's your"
            highlight="stress level?"
            sub="Be honest — this is just for you."
          >
            <StressCard value={state.stress} onChange={(v) => update({ stress: v })} />
          </StepShell>
        );
      case 5:
        return (
          <StepShell
            eyebrow="Situations"
            question="What's been"
            highlight="on your mind?"
            sub="Pick anything that's been affecting you."
          >
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
          </StepShell>
        );
      case 6:
        return (
          <StepShell
            eyebrow="Reflection"
            question="A few quick"
            highlight="questions."
            sub="Based on what you've shared so far."
          >
            <QuestionsCard
              moodIdx={state.mood}
              situations={state.situations}
              answers={state.answers}
              onAnswer={(id, val) =>
                update({ answers: { ...state.answers, [id]: val } })
              }
            />
          </StepShell>
        );
      case 7:
        return (
          <StepShell
            eyebrow="AI insight"
            question="Here's what"
            highlight="we noticed."
            sub="Based on your responses today."
          >
            <AiInsightCard
              moodIdx={state.mood}
              stress={state.stress}
              energy={state.energy}
              emotions={state.emotions}
            />
          </StepShell>
        );
      case 8:
        return (
          <StepShell
            eyebrow="All done"
            question="You're"
            highlight="all set."
            sub="Your check-in has been recorded anonymously."
          >
            <SubmitCard
              onSubmit={handleSubmit}
              submitted={submitted}
              isSubmitting={isSubmitting}
              // Only pass nextCheckIn once submitted so the countdown
              // starts exactly when the user completes the flow.
              nextCheckIn={submitted ? getMidnightTonight() : null}
            />
          </StepShell>
        );
      default:
        return null;
    }
  };

  return (
    <View style={s.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ProgressHeader step={Math.max(0, step - 1)} streak={streak} />

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={[s.scroll, { paddingHorizontal: scale(22) }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={cardStyle}>{renderStep()}</Animated.View>

          {step > 0 && step <= 8 && (
            <Animated.View style={cardStyle}>
              <InlineNav
                step={step}
                canAdvance={canAdvance}
                onNext={advance}
                onBack={back}
              />
            </Animated.View>
          )}

          <View style={{ height: 32 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: B.bg },
  scroll: { paddingTop: 8, paddingBottom: 24 },

  progWrap: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  progTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  progTitle: { fontWeight: "800", color: B.text, letterSpacing: -0.2 },
  progSub:   { fontSize: 11, color: B.muted, marginTop: 2 },
  streakPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: B.amber + "12",
    borderWidth: 1,
    borderColor: B.amber + "25",
  },
  streakNum: { fontWeight: "800", color: B.amber },
  dotRow:    { flexDirection: "row", gap: 4 },
  dot:       { flex: 1, height: 3, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.07)" },
  dotDone:   { backgroundColor: B.primary },
  dotActive: { backgroundColor: B.primary + "55" },
  progMeta:  { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
  progPct:   { fontSize: 9, color: B.muted2 },

  eyebrow: {
    fontWeight: "700",
    color: B.primary,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  bigQ:       { fontWeight: "900", color: B.text, letterSpacing: -0.6, lineHeight: 1.15 * 24 },
  bigQAccent: { color: B.primary },
  bigSub:     { color: B.muted, lineHeight: 20 },

  introWrap: { alignItems: "center" },
  introIcon: {
    backgroundColor: B.primary + "18",
    borderWidth: 1,
    borderColor: B.primary + "30",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  introTitle: {
    fontWeight: "900",
    color: B.text,
    letterSpacing: -1,
    textAlign: "center",
    lineHeight: 36,
  },
  introSub: { color: B.muted, textAlign: "center", lineHeight: 22 },
  introPills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  introPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: B.primary + "12",
    borderWidth: 1,
    borderColor: B.primary + "25",
  },
  introPillText: { fontWeight: "700", color: B.primary },
  startBtn: {
    width: "100%",
    backgroundColor: B.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: B.primary,
    shadowRadius: 14,
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 4 },
  },
  startBtnText: { fontWeight: "800", color: "#fff" },

  navWrap: { width: "100%" },
  navRow:  { flexDirection: "row", gap: 10, alignItems: "center" },
  backPill: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  backPillText: { color: B.muted },
  nextBtn: {
    flex: 1,
    backgroundColor: B.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: B.primary,
    shadowRadius: 12,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
  },
  nextDisabled: { opacity: 0.3 },
  nextText: { fontWeight: "800", color: "#fff" },
});