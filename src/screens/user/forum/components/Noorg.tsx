import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  B,
  DEPARTMENTS,
  ORGANIZATIONS,
  Organization,
} from "../constants/constant";

// ─── Landing step ─────────────────────────────────────────────────────────────
const LandingStep = ({ onNext }: { onNext: () => void }) => {
  const floatY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatY, {
          toValue: -10,
          duration: 2400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatY, {
          toValue: 0,
          duration: 2400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
      }}
    >
      <Animated.View
        style={[s.heroWrap, { transform: [{ translateY: floatY }] }]}
      >
        <Text style={{ fontSize: 52 }}>🏢</Text>
      </Animated.View>
      <Text style={s.heroTitle}>Join your{"\n"}organization.</Text>
      <Text style={s.heroSub}>
        Connect to access the anonymous wellbeing forum, team insights, and
        community support — while staying completely private.
      </Text>
      <View style={s.featureGrid}>
        {[
          { icon: "💬", title: "Anonymous Posts", sub: "Share freely, safely" },
          { icon: "📊", title: "Team Dashboard", sub: "Org-wide insights" },
          { icon: "🗳️", title: "Signal Voting", sub: "Amplify real voices" },
          { icon: "🔒", title: "Zero Identity", sub: "Always anonymous" },
        ].map((f, i) => (
          <View key={i} style={s.featureCard}>
            <Text style={{ fontSize: 22, marginBottom: 6 }}>{f.icon}</Text>
            <Text style={s.featureTitle}>{f.title}</Text>
            <Text style={s.featureSub}>{f.sub}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity onPress={onNext} activeOpacity={0.88} style={s.cta}>
        <Text style={s.ctaText}>Find My Organization</Text>
        <Text style={{ fontSize: 18, color: "#fff" }}>→</Text>
      </TouchableOpacity>
    </View>
  );
};

// ─── Search step ──────────────────────────────────────────────────────────────
const SearchStep = ({
  onBack,
  onSelect,
}: {
  onBack: () => void;
  onSelect: (org: Organization) => void;
}) => {
  const [query, setQuery] = useState("");
  const filtered = ORGANIZATIONS.filter((o) =>
    o.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={s.stepHead}>
        <Pressable onPress={onBack} hitSlop={10}>
          <Text style={s.back}>← Back</Text>
        </Pressable>
        <Text style={s.stepTitle}>Find Organization</Text>
        <View style={{ width: 50 }} />
      </View>
      <View style={s.searchWrap}>
        <Text style={{ fontSize: 18 }}>🔍</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search by name…"
          placeholderTextColor={B.muted2}
          style={s.searchInput}
          autoFocus
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery("")} hitSlop={8}>
            <Text style={{ color: B.muted }}>✕</Text>
          </Pressable>
        )}
      </View>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, gap: 10 }}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={{ alignItems: "center", paddingTop: 60, gap: 12 }}>
            <Text style={{ fontSize: 40 }}>🔍</Text>
            <Text style={{ fontSize: 15, fontWeight: "700", color: B.text }}>
              No results for "{query}"
            </Text>
            <Text style={{ fontSize: 13, color: B.muted, textAlign: "center" }}>
              Try a different name or check with your HR team.
            </Text>
          </View>
        ) : (
          filtered.map((org) => (
            <Pressable
              key={org.id}
              onPress={() => onSelect(org)}
              style={s.orgRow}
            >
              <View style={s.orgIcon}>
                <Text style={{ fontSize: 24 }}>{org.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.orgName}>{org.name}</Text>
                <Text style={s.orgMeta}>
                  {org.industry} · {org.members} members
                </Text>
              </View>
              <Text style={{ color: B.muted, fontSize: 20 }}>›</Text>
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
};

// ─── Confirm step ─────────────────────────────────────────────────────────────
const ConfirmStep = ({
  selected,
  onBack,
}: {
  selected: Organization;
  onBack: () => void;
}) => {
  const [dept, setDept] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <View style={s.stepHead}>
        <Pressable onPress={onBack} hitSlop={10}>
          <Text style={s.back}>← Back</Text>
        </Pressable>
        <Text style={s.stepTitle}>Join Organization</Text>
        <View style={{ width: 50 }} />
      </View>
      <ScrollView
        contentContainerStyle={{ padding: 20, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Selected org */}
        <View style={[s.card, { borderColor: B.primary + "30" }]}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
            <View style={s.confirmIcon}>
              <Text style={{ fontSize: 28 }}>{selected.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "800",
                  color: B.text,
                  marginBottom: 3,
                }}
              >
                {selected.name}
              </Text>
              <Text style={{ fontSize: 12, color: B.muted }}>
                {selected.industry} · {selected.members} members
              </Text>
            </View>
            <View style={s.verifiedBadge}>
              <Text style={s.verifiedText}>✓ Verified</Text>
            </View>
          </View>
        </View>

        {/* Department picker */}
        <View style={s.card}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "700",
              color: B.text,
              marginBottom: 4,
            }}
          >
            Your Department
          </Text>
          <Text style={{ fontSize: 12, color: B.muted, marginBottom: 14 }}>
            Optional — helps with anonymous team analytics
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {DEPARTMENTS.map((d) => (
              <Pressable
                key={d}
                onPress={() => setDept(d === dept ? "" : d)}
                style={[
                  s.deptPill,
                  dept === d && {
                    borderColor: B.primary,
                    backgroundColor: B.primary + "18",
                  },
                ]}
              >
                <Text
                  style={[
                    { fontSize: 12, color: B.muted },
                    dept === d && { color: B.primary, fontWeight: "700" },
                  ]}
                >
                  {d}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Privacy note */}
        <View style={s.privacyCard}>
          <Text style={{ fontSize: 20, marginBottom: 10 }}>🔒</Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "800",
              color: B.text,
              marginBottom: 6,
            }}
          >
            Your identity stays hidden
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: B.muted,
              textAlign: "center",
              lineHeight: 20,
            }}
          >
            You'll appear only as a generated Anon ID. Your name and details are
            never visible to other members.
          </Text>
        </View>

        {!sent ? (
          <TouchableOpacity
            onPress={() => setSent(true)}
            activeOpacity={0.88}
            style={s.sendBtn}
          >
            <Text style={{ fontSize: 16, fontWeight: "800", color: "#fff" }}>
              Send Join Request
            </Text>
            <Text style={{ fontSize: 16, color: "#fff" }}>→</Text>
          </TouchableOpacity>
        ) : (
          <View style={s.sentCard}>
            <Text style={{ fontSize: 36, marginBottom: 14 }}>📨</Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "800",
                color: B.text,
                marginBottom: 8,
              }}
            >
              Request Sent!
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: B.muted,
                textAlign: "center",
                lineHeight: 20,
              }}
            >
              Your request is with {selected.name}. You'll be notified once
              approved — usually within 24 hours.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

// ─── NoOrgScreen ──────────────────────────────────────────────────────────────
type Step = "landing" | "search" | "confirm";

export const NoOrgScreen = () => {
  const [step, setStep] = useState<Step>("landing");
  const [selected, setSelected] = useState<Organization | null>(null);
  const cardAnim = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    cardAnim.setValue(0);
    Animated.spring(cardAnim, {
      toValue: 1,
      tension: 48,
      friction: 12,
      useNativeDriver: true,
    }).start();
  }, [step]);

  const slideIn = {
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

  const handleSelect = (org: Organization) => {
    setSelected(org);
    setStep("confirm");
  };

  return (
    <Animated.View
      style={[{ flex: 1 }, step === "landing" ? { opacity: fade } : slideIn]}
    >
      {step === "landing" && <LandingStep onNext={() => setStep("search")} />}
      {step === "search" && (
        <SearchStep onBack={() => setStep("landing")} onSelect={handleSelect} />
      )}
      {step === "confirm" && selected && (
        <ConfirmStep selected={selected} onBack={() => setStep("search")} />
      )}
    </Animated.View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  heroWrap: {
    width: 96,
    height: 96,
    borderRadius: 32,
    backgroundColor: B.primary + "18",
    borderWidth: 1,
    borderColor: B.primary + "28",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: "900",
    color: B.text,
    textAlign: "center",
    letterSpacing: -0.8,
    lineHeight: 38,
    marginBottom: 14,
  },
  heroSub: {
    fontSize: 14,
    color: B.muted,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
    paddingHorizontal: 4,
  },
  featureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    width: "100%",
    marginBottom: 28,
  },
  featureCard: {
    width: "47%",
    padding: 16,
    borderRadius: 18,
    backgroundColor: B.card,
    borderWidth: 1,
    borderColor: B.border,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: B.text,
    marginBottom: 3,
  },
  featureSub: { fontSize: 11, color: B.muted },
  cta: {
    width: "100%",
    height: 56,
    borderRadius: 16,
    backgroundColor: B.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    shadowColor: B.primary,
    shadowRadius: 18,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
  },
  ctaText: { fontSize: 16, fontWeight: "800", color: "#fff" },
  stepHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: B.border,
  },
  stepTitle: { fontSize: 16, fontWeight: "700", color: B.text },
  back: { fontSize: 13, color: B.primary, fontWeight: "600" },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 20,
    marginVertical: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: B.border,
  },
  searchInput: { flex: 1, fontSize: 15, color: B.text },
  orgRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 16,
    backgroundColor: B.card,
    borderWidth: 1,
    borderColor: B.border,
  },
  orgIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  orgName: { fontSize: 14, fontWeight: "700", color: B.text, marginBottom: 3 },
  orgMeta: { fontSize: 12, color: B.muted },
  card: {
    backgroundColor: B.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: B.border,
    padding: 18,
  },
  confirmIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  verifiedBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: B.accent + "14",
    borderWidth: 1,
    borderColor: B.accent + "28",
  },
  verifiedText: { fontSize: 11, fontWeight: "700", color: B.accent },
  deptPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: B.border,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  privacyCard: {
    padding: 20,
    borderRadius: 18,
    backgroundColor: B.secondary + "14",
    borderWidth: 1,
    borderColor: B.secondary + "28",
    alignItems: "center",
  },
  sendBtn: {
    height: 56,
    borderRadius: 16,
    backgroundColor: B.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    shadowColor: B.primary,
    shadowRadius: 16,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
  },
  sentCard: {
    padding: 28,
    borderRadius: 20,
    backgroundColor: B.primary + "10",
    borderWidth: 1,
    borderColor: B.primary + "22",
    alignItems: "center",
  },
});
