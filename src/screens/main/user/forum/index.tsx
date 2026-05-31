import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  FlatList,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgGrad,
  Path,
  Stop,
  Text as SvgText,
} from "react-native-svg";

const { width: W } = Dimensions.get("window");

// ─── Toggle this to test both states ─────────────────────────────────────────
const HAS_ORGANIZATION = true; // ← false = no org screen, true = forum screen

// ─── Brand ────────────────────────────────────────────────────────────────────

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
  sky: "#0EA5E9",
};

// ─── Mock data ────────────────────────────────────────────────────────────────

const ORGANIZATIONS = [
  { id: "1", name: "TechCorp Ltd", members: 142, icon: "💼" },
  { id: "2", name: "HealthPlus Hospital", members: 89, icon: "🏥" },
  { id: "3", name: "EduFirst Schools", members: 203, icon: "🎓" },
  { id: "4", name: "BuildRight Construction", members: 67, icon: "🏗️" },
  { id: "5", name: "FinEdge Capital", members: 55, icon: "💰" },
  { id: "6", name: "GreenLeaf NGO", members: 38, icon: "🌿" },
];

const DEPARTMENTS = [
  "Engineering",
  "Product",
  "Design",
  "Marketing",
  "Finance",
  "HR",
  "Operations",
  "Legal",
  "Sales",
  "Support",
];

const MOOD_TAGS = [
  { label: "stressed", color: B.amber },
  { label: "burnt out", color: B.red },
  { label: "overwhelmed", color: "#F43F5E" },
  { label: "unmotivated", color: B.violet },
  { label: "hopeful", color: B.accent },
  { label: "grateful", color: B.primary },
  { label: "anxious", color: B.sky },
  { label: "calm", color: "#14B8A6" },
];

const POSTS = [
  {
    id: "1",
    content:
      "The amount of back-to-back meetings this week has been completely draining. I haven't had a single block to actually think.",
    moodTag: "burnt out",
    tagColor: B.red,
    upvotes: 47,
    downvotes: 3,
    time: "2h ago",
    userVote: null as "up" | "down" | null,
  },
  {
    id: "2",
    content:
      "Finally feel like I'm making progress on my project after weeks of feeling stuck. Small wins matter more than I realised.",
    moodTag: "hopeful",
    tagColor: B.accent,
    upvotes: 82,
    downvotes: 1,
    time: "4h ago",
    userVote: "up" as "up" | "down" | null,
  },
  {
    id: "3",
    content:
      "Communication gaps between teams are causing so much unnecessary stress. We need better systems, not more meetings.",
    moodTag: "stressed",
    tagColor: B.amber,
    upvotes: 61,
    downvotes: 8,
    time: "6h ago",
    userVote: null as "up" | "down" | null,
  },
  {
    id: "4",
    content:
      "I've been working late every day for the past month. Management keeps piling on more without acknowledging the team's limits.",
    moodTag: "overwhelmed",
    tagColor: "#F43F5E",
    upvotes: 94,
    downvotes: 2,
    time: "8h ago",
    userVote: null as "up" | "down" | null,
  },
  {
    id: "5",
    content:
      "Had a really supportive 1:1 with my lead today. It made a genuine difference. More of this please.",
    moodTag: "grateful",
    tagColor: B.primary,
    upvotes: 53,
    downvotes: 0,
    time: "12h ago",
    userVote: null as "up" | "down" | null,
  },
];

// Dashboard emotion data
const EMOTIONS_DIST = [
  { label: "Stressed", pct: 34, color: B.amber },
  { label: "Burnt out", pct: 22, color: B.red },
  { label: "Hopeful", pct: 24, color: B.accent },
  { label: "Overwhelmed", pct: 20, color: B.violet },
];

// ─── Shared card ──────────────────────────────────────────────────────────────

const Card = ({
  children,
  style,
  accent,
}: {
  children: React.ReactNode;
  style?: any;
  accent?: string;
}) => (
  <View
    style={[
      styles.card,
      accent && {
        borderColor: accent + "30",
        shadowColor: accent,
        shadowRadius: 16,
        shadowOpacity: 0.12,
        shadowOffset: { width: 0, height: 4 },
      },
      style,
    ]}
  >
    {children}
  </View>
);

// ══════════════════════════════════════════════════════════════════════════════
// NO ORGANIZATION STATE
// ══════════════════════════════════════════════════════════════════════════════

const NoOrgScreen = () => {
  const [step, setStep] = useState<"landing" | "search" | "confirm">("landing");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<(typeof ORGANIZATIONS)[0] | null>(
    null,
  );
  const [dept, setDept] = useState("");
  const [sent, setSent] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 2400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();
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

  const filtered = ORGANIZATIONS.filter((o) =>
    o.name.toLowerCase().includes(query.toLowerCase()),
  );

  const cardSlide = {
    opacity: cardAnim,
    transform: [
      {
        translateY: cardAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [24, 0],
        }),
      },
    ],
  };

  // ── Landing ────────────────────────────────────────────────────────────────

  if (step === "landing")
    return (
      <Animated.View style={[styles.noOrgRoot, { opacity: fadeAnim }]}>
        {/* Ambient glow */}
        <View style={styles.ambientGlow} pointerEvents="none" />

        <View style={styles.noOrgInner}>
          {/* Floating icon */}
          <Animated.View
            style={[
              styles.noOrgIcon,
              { transform: [{ translateY: floatAnim }] },
            ]}
          >
            <Text style={{ fontSize: 48 }}>🏢</Text>
          </Animated.View>

          <Text style={styles.noOrgTitle}>
            You're not part of{"\n"}an organization yet.
          </Text>
          <Text style={styles.noOrgSub}>
            Join your organization to access the anonymous forum, view team
            wellbeing insights, and contribute to a healthier workplace.
          </Text>

          {/* Feature pills */}
          <View style={styles.featureList}>
            {[
              { icon: "💬", text: "Anonymous forum posts" },
              { icon: "📊", text: "Team wellness dashboard" },
              { icon: "🗳️", text: "Upvote community voices" },
              { icon: "🔒", text: "Your identity stays hidden" },
            ].map((f, i) => (
              <View key={i} style={styles.featurePill}>
                <Text style={{ fontSize: 16 }}>{f.icon}</Text>
                <Text style={styles.featurePillText}>{f.text}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            onPress={() => setStep("search")}
            activeOpacity={0.88}
            style={styles.joinBtn}
          >
            <Text style={styles.joinBtnText}>Find My Organization</Text>
            <Text style={{ fontSize: 18, color: "#fff" }}>→</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );

  // ── Search ─────────────────────────────────────────────────────────────────

  if (step === "search")
    return (
      <Animated.View style={[styles.noOrgRoot, cardSlide]}>
        <View style={styles.stepHeader}>
          <Pressable onPress={() => setStep("landing")} hitSlop={10}>
            <Text style={styles.backBtn}>← Back</Text>
          </Pressable>
          <Text style={styles.stepTitle}>Find Organization</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Search box */}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search by organization name…"
            placeholderTextColor={B.muted2}
            style={styles.searchInput}
            autoFocus
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")} hitSlop={8}>
              <Text style={{ color: B.muted, fontSize: 14 }}>✕</Text>
            </Pressable>
          )}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <View style={{ gap: 10, padding: 20 }}>
            {filtered.map((org) => (
              <Pressable
                key={org.id}
                onPress={() => {
                  setSelected(org);
                  setStep("confirm");
                }}
                style={styles.orgRow}
              >
                <View style={styles.orgIcon}>
                  <Text style={{ fontSize: 22 }}>{org.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.orgName}>{org.name}</Text>
                  <Text style={styles.orgMembers}>{org.members} members</Text>
                </View>
                <Text style={{ color: B.muted, fontSize: 18 }}>›</Text>
              </Pressable>
            ))}
            {filtered.length === 0 && (
              <View style={styles.emptySearch}>
                <Text style={{ fontSize: 32, marginBottom: 12 }}>🔍</Text>
                <Text style={styles.emptySearchText}>
                  No organizations found for "{query}"
                </Text>
                <Text style={styles.emptySearchSub}>
                  Try a different name or ask your HR team for the exact name.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </Animated.View>
    );

  // ── Confirm + Department ───────────────────────────────────────────────────

  return (
    <Animated.View style={[styles.noOrgRoot, cardSlide]}>
      <View style={styles.stepHeader}>
        <Pressable onPress={() => setStep("search")} hitSlop={10}>
          <Text style={styles.backBtn}>← Back</Text>
        </Pressable>
        <Text style={styles.stepTitle}>Join Organization</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Org card */}
        {selected && (
          <Card accent={B.primary}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 14 }}
            >
              <View style={styles.orgIconLg}>
                <Text style={{ fontSize: 28 }}>{selected.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.confirmOrgName}>{selected.name}</Text>
                <Text style={styles.confirmOrgMeta}>
                  {selected.members} members · Active
                </Text>
              </View>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓ Verified</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Department */}
        <Card>
          <Text style={styles.fieldLabel}>Your Department</Text>
          <Text style={styles.fieldHint}>
            This helps with anonymized team insights (optional)
          </Text>
          <View style={styles.deptGrid}>
            {DEPARTMENTS.map((d) => (
              <Pressable
                key={d}
                onPress={() => setDept(d === dept ? "" : d)}
                style={[
                  styles.deptPill,
                  dept === d && {
                    borderColor: B.primary,
                    backgroundColor: B.primary + "18",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.deptPillText,
                    dept === d && { color: B.primary, fontWeight: "700" },
                  ]}
                >
                  {d}
                </Text>
              </Pressable>
            ))}
          </View>
        </Card>

        {/* Privacy note */}
        <View style={styles.privacyCard}>
          <Text style={{ fontSize: 16, marginBottom: 10 }}>🔒</Text>
          <Text style={styles.privacyTitle}>Your identity stays anonymous</Text>
          <Text style={styles.privacyText}>
            You'll be known only by a generated ID inside the forum. Your name
            and department are never shown to other members.
          </Text>
        </View>

        {/* Send request */}
        {!sent ? (
          <TouchableOpacity
            onPress={() => setSent(true)}
            activeOpacity={0.88}
            style={styles.sendBtn}
          >
            <Text style={styles.sendBtnText}>Send Join Request</Text>
            <Text style={{ fontSize: 16, color: "#fff" }}>→</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.sentConfirm}>
            <Text style={{ fontSize: 28, marginBottom: 10 }}>📨</Text>
            <Text style={styles.sentTitle}>Request Sent!</Text>
            <Text style={styles.sentSub}>
              Your request has been sent to {selected?.name}. You'll be notified
              once an admin approves it.
            </Text>
          </View>
        )}
      </ScrollView>
    </Animated.View>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// HAS ORGANIZATION STATE
// ══════════════════════════════════════════════════════════════════════════════

// ─── Donut chart ──────────────────────────────────────────────────────────────

const EmotionDonut = () => {
  const SIZE = 110;
  const CX = SIZE / 2,
    CY = SIZE / 2,
    R = 38,
    SW = 14;

  let cum = 0;
  const arcs = EMOTIONS_DIST.map((e) => {
    const pct = e.pct / 100;
    const start = cum * 2 * Math.PI - Math.PI / 2;
    const end = (cum + pct) * 2 * Math.PI - Math.PI / 2;
    cum += pct;
    const x1 = CX + R * Math.cos(start),
      y1 = CY + R * Math.sin(start);
    const x2 = CX + R * Math.cos(end),
      y2 = CY + R * Math.sin(end);
    return {
      ...e,
      d: `M ${x1} ${y1} A ${R} ${R} 0 ${pct > 0.5 ? 1 : 0} 1 ${x2} ${y2}`,
    };
  });

  return (
    <Svg width={SIZE} height={SIZE}>
      <Circle
        cx={CX}
        cy={CY}
        r={R}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={SW + 2}
      />
      {arcs.map((a, i) => (
        <Path
          key={i}
          d={a.d}
          fill="none"
          stroke={a.color}
          strokeWidth={SW}
          strokeLinecap="butt"
        />
      ))}
      <Circle cx={CX} cy={CY} r={R - SW / 2 - 4} fill="#080D1C" />
      <SvgText
        x={CX}
        y={CY - 6}
        textAnchor="middle"
        fill="#F0F4FF"
        fontSize={16}
        fontWeight="800"
      >
        34%
      </SvgText>
      <SvgText
        x={CX}
        y={CY + 10}
        textAnchor="middle"
        fill="rgba(240,244,255,0.4)"
        fontSize={8}
      >
        Stressed
      </SvgText>
    </Svg>
  );
};

// ─── Dashboard card ───────────────────────────────────────────────────────────

const DashboardCard = () => {
  const barAnims = EMOTIONS_DIST.map(
    () => useRef(new Animated.Value(0)).current,
  );

  useEffect(() => {
    barAnims.forEach((a, i) =>
      Animated.spring(a, {
        toValue: 1,
        delay: i * 100,
        tension: 60,
        friction: 10,
        useNativeDriver: true,
      }).start(),
    );
  }, []);

  return (
    <Card accent={B.primary}>
      {/* Header */}
      <View style={styles.dashHeader}>
        <View>
          <Text style={styles.dashTitle}>Team Wellbeing</Text>
          <Text style={styles.dashSub}>TechCorp Ltd · 142 members</Text>
        </View>
        <View style={styles.burnoutBadge}>
          <View style={styles.burnoutDot} />
          <Text style={styles.burnoutText}>High Burnout</Text>
        </View>
      </View>

      {/* Metrics row */}
      <View style={styles.metricsRow}>
        {[
          { val: "72%", label: "Burnout Risk", color: B.red },
          { val: "61%", label: "Neg. Sentiment", color: B.amber },
          { val: "39%", label: "Pos. Sentiment", color: B.accent },
        ].map((m, i) => (
          <View key={i} style={styles.metricItem}>
            <Text style={[styles.metricVal, { color: m.color }]}>{m.val}</Text>
            <Text style={styles.metricLabel}>{m.label}</Text>
          </View>
        ))}
      </View>

      {/* Donut + breakdown */}
      <View style={styles.donutRow}>
        <EmotionDonut />
        <View style={styles.donutLegend}>
          {EMOTIONS_DIST.map((e, i) => {
            const scaleX = barAnims[i].interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            });
            return (
              <View key={i} style={{ marginBottom: 8 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <Text style={styles.legendLabel}>{e.label}</Text>
                  <Text style={[styles.legendPct, { color: e.color }]}>
                    {e.pct}%
                  </Text>
                </View>
                <View style={styles.legendTrack}>
                  <Animated.View
                    style={[
                      styles.legendFill,
                      {
                        width: `${e.pct}%`,
                        backgroundColor: e.color,
                        transform: [{ scaleX }],
                      },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Top issues */}
      <View style={styles.issuesRow}>
        <Text style={styles.issuesTitle}>Top Issues</Text>
        <View style={styles.issuesTags}>
          {["Work pressure", "Communication", "Deadlines", "Recognition"].map(
            (t, i) => (
              <View key={i} style={styles.issueTag}>
                <Text style={styles.issueTagText}>{t}</Text>
              </View>
            ),
          )}
        </View>
      </View>
    </Card>
  );
};

// ─── Post card ────────────────────────────────────────────────────────────────

const PostCard = ({
  post,
  onVote,
}: {
  post: (typeof POSTS)[0];
  onVote: (id: string, dir: "up" | "down") => void;
}) => {
  const upScale = useRef(new Animated.Value(1)).current;
  const downScale = useRef(new Animated.Value(1)).current;

  const vote = (dir: "up" | "down") => {
    const anim = dir === "up" ? upScale : downScale;
    Animated.sequence([
      Animated.spring(anim, {
        toValue: 1.3,
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
    ]).start(() => onVote(post.id, dir));
  };

  const upActive = post.userVote === "up";
  const downActive = post.userVote === "down";
  const score = post.upvotes - post.downvotes;

  return (
    <Card style={{ marginBottom: 12 }}>
      {/* Mood tag */}
      <View style={styles.postHeader}>
        <View
          style={[
            styles.moodTag,
            {
              backgroundColor: post.tagColor + "18",
              borderColor: post.tagColor + "40",
            },
          ]}
        >
          <View
            style={[styles.moodTagDot, { backgroundColor: post.tagColor }]}
          />
          <Text style={[styles.moodTagText, { color: post.tagColor }]}>
            {post.moodTag}
          </Text>
        </View>
        <Text style={styles.postMeta}>Anonymous · {post.time}</Text>
      </View>

      {/* Content */}
      <Text style={styles.postContent}>{post.content}</Text>

      {/* Actions */}
      <View style={styles.postActions}>
        {/* Upvote */}
        <Animated.View style={{ transform: [{ scale: upScale }] }}>
          <Pressable
            onPress={() => vote("up")}
            style={[
              styles.voteBtn,
              upActive && {
                backgroundColor: B.accent + "18",
                borderColor: B.accent + "50",
              },
            ]}
          >
            <Text style={styles.voteBtnEmoji}>👍</Text>
            <Text
              style={[
                styles.voteBtnCount,
                upActive && { color: B.accent, fontWeight: "800" },
              ]}
            >
              {post.upvotes}
            </Text>
          </Pressable>
        </Animated.View>

        {/* Downvote */}
        <Animated.View style={{ transform: [{ scale: downScale }] }}>
          <Pressable
            onPress={() => vote("down")}
            style={[
              styles.voteBtn,
              downActive && {
                backgroundColor: B.red + "18",
                borderColor: B.red + "50",
              },
            ]}
          >
            <Text style={styles.voteBtnEmoji}>👎</Text>
            <Text
              style={[
                styles.voteBtnCount,
                downActive && { color: B.red, fontWeight: "800" },
              ]}
            >
              {post.downvotes}
            </Text>
          </Pressable>
        </Animated.View>

        <View style={{ flex: 1 }} />

        {/* Score */}
        <View style={styles.scoreWrap}>
          <Text
            style={[
              styles.scoreText,
              { color: score > 20 ? B.accent : score > 5 ? B.muted : B.red },
            ]}
          >
            {score > 0 ? "+" : ""}
            {score} signal
          </Text>
        </View>
      </View>
    </Card>
  );
};

// ─── New post sheet ───────────────────────────────────────────────────────────

const NewPostSheet = ({
  visible,
  onClose,
  onPost,
}: {
  visible: boolean;
  onClose: () => void;
  onPost: (content: string, tag: string) => void;
}) => {
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");
  const slideAnim = useRef(new Animated.Value(500)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: visible ? 0 : 500,
      tension: 60,
      friction: 14,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const submit = () => {
    if (!content.trim() || !tag) return;
    onPost(content, tag);
    setContent("");
    setTag("");
    onClose();
  };

  return (
    <Animated.View
      style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
    >
      {/* Handle */}
      <View style={styles.sheetHandle} />

      <Text style={styles.sheetTitle}>Share Anonymously</Text>
      <Text style={styles.sheetSub}>
        Your post will be visible to your organization only. You will not be
        identified.
      </Text>

      {/* Text area */}
      <View style={styles.textAreaWrap}>
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="What's on your mind today?"
          placeholderTextColor={B.muted2}
          multiline
          numberOfLines={5}
          style={styles.textArea}
          maxLength={280}
        />
        <Text style={styles.charCount}>{content.length}/280</Text>
      </View>

      {/* Mood tag select */}
      <Text style={styles.tagSelectLabel}>How are you feeling?</Text>
      <View style={styles.tagGrid}>
        {MOOD_TAGS.map((t, i) => (
          <Pressable
            key={i}
            onPress={() => setTag(t.label)}
            style={[
              styles.tagChip,
              tag === t.label && {
                borderColor: t.color,
                backgroundColor: t.color + "18",
              },
            ]}
          >
            <Text
              style={[
                styles.tagChipText,
                tag === t.label && { color: t.color, fontWeight: "700" },
              ]}
            >
              {t.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Actions */}
      <View style={styles.sheetActions}>
        <Pressable onPress={onClose} style={styles.cancelBtn}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </Pressable>
        <TouchableOpacity
          onPress={submit}
          activeOpacity={0.88}
          style={[
            styles.postBtn,
            (!content.trim() || !tag) && { opacity: 0.4 },
          ]}
          disabled={!content.trim() || !tag}
        >
          <Text style={styles.postBtnText}>Post</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

// ─── Forum screen (has org) ───────────────────────────────────────────────────

const ForumScreen = () => {
  const [posts, setPosts] = useState(POSTS);
  const [activeTab, setActiveTab] = useState<"feed" | "dashboard">("feed");
  const [showNewPost, setShowNewPost] = useState(false);
  const tabAnim = useRef(new Animated.Value(0)).current;

  const handleVote = (id: string, dir: "up" | "down") => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const wasUp = p.userVote === "up";
        const wasDown = p.userVote === "down";
        return {
          ...p,
          upvotes:
            dir === "up"
              ? p.upvotes + (wasUp ? -1 : 1)
              : p.upvotes - (wasUp ? 1 : 0),
          downvotes:
            dir === "down"
              ? p.downvotes + (wasDown ? -1 : 1)
              : p.downvotes - (wasDown ? 1 : 0),
          userVote: p.userVote === dir ? null : dir,
        };
      }),
    );
  };

  const handlePost = (content: string, tag: string) => {
    const tagData = MOOD_TAGS.find((t) => t.label === tag) ?? {
      color: B.primary,
    };
    setPosts((prev) => [
      {
        id: String(Date.now()),
        content,
        moodTag: tag,
        tagColor: tagData.color,
        upvotes: 0,
        downvotes: 0,
        time: "just now",
        userVote: null,
      },
      ...prev,
    ]);
  };

  const switchTab = (tab: "feed" | "dashboard") => {
    setActiveTab(tab);
    Animated.spring(tabAnim, {
      toValue: tab === "feed" ? 0 : 1,
      tension: 60,
      friction: 12,
      useNativeDriver: false,
    }).start();
  };

  const tabIndicatorLeft = tabAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["2%", "52%"],
  });

  return (
    <View style={{ flex: 1, backgroundColor: B.bg }}>
      {/* Header */}
      <View style={styles.forumHeader}>
        <View>
          <Text style={styles.forumTitle}>Forum</Text>
          <Text style={styles.forumOrg}>TechCorp Ltd</Text>
        </View>
        <View style={styles.memberBadge}>
          <View style={styles.memberDot} />
          <Text style={styles.memberText}>Member</Text>
        </View>
      </View>

      {/* Tab switcher */}
      <View style={styles.tabWrap}>
        <View style={styles.tabBar}>
          <Animated.View
            style={[styles.tabIndicator, { left: tabIndicatorLeft }]}
          />
          {(["feed", "dashboard"] as const).map((tab) => (
            <Pressable
              key={tab}
              onPress={() => switchTab(tab)}
              style={styles.tabBtn}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && { color: B.text, fontWeight: "700" },
                ]}
              >
                {tab === "feed" ? "📢 Feed" : "📊 Dashboard"}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Content */}
      {activeTab === "feed" ? (
        <ScrollView
          contentContainerStyle={styles.feedScroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Stats strip */}
          <View style={styles.statsStrip}>
            {[
              { val: "47", label: "posts today", color: B.primary },
              { val: "142", label: "members", color: B.accent },
              { val: "89%", label: "anonymous", color: B.violet },
            ].map((st, i) => (
              <View key={i} style={styles.statItem}>
                <Text style={[styles.statVal, { color: st.color }]}>
                  {st.val}
                </Text>
                <Text style={styles.statLabel}>{st.label}</Text>
              </View>
            ))}
          </View>

          {posts.map((p) => (
            <PostCard key={p.id} post={p} onVote={handleVote} />
          ))}

          <View style={{ height: 100 }} />
        </ScrollView>
      ) : (
        <ScrollView
          contentContainerStyle={styles.feedScroll}
          showsVerticalScrollIndicator={false}
        >
          <DashboardCard />

          {/* Top posts by signal */}
          <View style={styles.topPostsHeader}>
            <Text style={styles.topPostsTitle}>Highest Signal Posts</Text>
            <Text style={styles.topPostsSub}>
              Most resonated with by the team
            </Text>
          </View>
          {[...posts]
            .sort((a, b) => b.upvotes - b.downvotes - (a.upvotes - a.downvotes))
            .slice(0, 3)
            .map((p) => (
              <PostCard key={p.id} post={p} onVote={handleVote} />
            ))}

          <View style={{ height: 100 }} />
        </ScrollView>
      )}

      {/* FAB — new post */}
      {activeTab === "feed" && (
        <Pressable onPress={() => setShowNewPost(true)} style={styles.fab}>
          <Text style={styles.fabText}>＋</Text>
        </Pressable>
      )}

      {/* New post overlay */}
      {showNewPost && (
        <Pressable
          style={styles.overlay}
          onPress={() => setShowNewPost(false)}
        />
      )}
      <NewPostSheet
        visible={showNewPost}
        onClose={() => setShowNewPost(false)}
        onPost={handlePost}
      />
    </View>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// ROOT EXPORT
// ══════════════════════════════════════════════════════════════════════════════

export default function ForumRoot() {
  // In real app: derive from user context / API
  const hasOrg = HAS_ORGANIZATION;

  return (
    <View style={{ flex: 1, backgroundColor: B.bg }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <SafeAreaView style={{ flex: 1 }}>
        {hasOrg ? <ForumScreen /> : <NoOrgScreen />}
      </SafeAreaView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: B.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: B.border,
    padding: 18,
    marginBottom: 2,
    shadowColor: "#000",
    shadowRadius: 8,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
  },

  // No org
  noOrgRoot: { flex: 1, paddingHorizontal: 24 },
  ambientGlow: {
    position: "absolute",
    top: -60,
    left: W * 0.1,
    width: W * 0.8,
    height: 200,
    borderRadius: 100,
    backgroundColor: B.primary,
    opacity: 0.06,
  },
  noOrgInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 0,
  },
  noOrgIcon: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: B.primary + "18",
    borderWidth: 1,
    borderColor: B.primary + "30",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  noOrgTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: B.text,
    textAlign: "center",
    letterSpacing: -0.7,
    lineHeight: 34,
    marginBottom: 14,
  },
  noOrgSub: {
    fontSize: 14,
    color: B.muted,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  featureList: { width: "100%", gap: 10, marginBottom: 32 },
  featurePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: B.border,
  },
  featurePillText: { fontSize: 13, color: B.muted },
  joinBtn: {
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
  joinBtnText: { fontSize: 16, fontWeight: "800", color: "#fff" },

  // Search
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: B.border,
  },
  stepTitle: { fontSize: 16, fontWeight: "700", color: B.text },
  backBtn: { fontSize: 13, color: B.primary, fontWeight: "600" },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 20,
    marginVertical: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: B.border,
  },
  searchIcon: { fontSize: 16 },
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
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  orgName: { fontSize: 14, fontWeight: "700", color: B.text, marginBottom: 2 },
  orgMembers: { fontSize: 12, color: B.muted },
  emptySearch: { alignItems: "center", paddingVertical: 40 },
  emptySearchText: {
    fontSize: 15,
    fontWeight: "700",
    color: B.text,
    textAlign: "center",
    marginBottom: 8,
  },
  emptySearchSub: {
    fontSize: 13,
    color: B.muted,
    textAlign: "center",
    lineHeight: 20,
  },

  // Confirm
  orgIconLg: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmOrgName: {
    fontSize: 16,
    fontWeight: "700",
    color: B.text,
    marginBottom: 3,
  },
  confirmOrgMeta: { fontSize: 12, color: B.muted },
  verifiedBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: B.accent + "15",
    borderWidth: 1,
    borderColor: B.accent + "30",
  },
  verifiedText: { fontSize: 11, fontWeight: "700", color: B.accent },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: B.text,
    marginBottom: 4,
  },
  fieldHint: { fontSize: 11, color: B.muted, marginBottom: 14 },
  deptGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  deptPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: B.border,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  deptPillText: { fontSize: 12, color: B.muted },
  privacyCard: {
    padding: 18,
    borderRadius: 16,
    backgroundColor: B.secondary + "18",
    borderWidth: 1,
    borderColor: B.secondary + "30",
    alignItems: "center",
  },
  privacyTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: B.text,
    marginBottom: 6,
  },
  privacyText: {
    fontSize: 12,
    color: B.muted,
    textAlign: "center",
    lineHeight: 20,
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
  sendBtnText: { fontSize: 16, fontWeight: "800", color: "#fff" },
  sentConfirm: {
    padding: 24,
    borderRadius: 20,
    backgroundColor: B.primary + "12",
    borderWidth: 1,
    borderColor: B.primary + "30",
    alignItems: "center",
  },
  sentTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: B.text,
    marginBottom: 8,
  },
  sentSub: {
    fontSize: 13,
    color: B.muted,
    textAlign: "center",
    lineHeight: 20,
  },

  // Forum header
  forumHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: B.border,
  },
  forumTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: B.text,
    letterSpacing: -0.5,
  },
  forumOrg: { fontSize: 12, color: B.muted, marginTop: 2 },
  memberBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: B.accent + "12",
    borderWidth: 1,
    borderColor: B.accent + "30",
  },
  memberDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: B.accent,
  },
  memberText: { fontSize: 11, fontWeight: "700", color: B.accent },

  // Tabs
  tabWrap: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: B.border,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 12,
    padding: 3,
    position: "relative",
  },
  tabIndicator: {
    position: "absolute",
    top: 3,
    width: "46%",
    height: "100%",
    borderRadius: 10,
    backgroundColor: B.primary + "30",
    borderWidth: 1,
    borderColor: B.primary + "40",
  },
  tabBtn: { flex: 1, paddingVertical: 9, alignItems: "center" },
  tabText: { fontSize: 13, color: B.muted, fontWeight: "600" },

  // Feed
  feedScroll: { paddingHorizontal: 16, paddingTop: 14 },
  statsStrip: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 14,
    marginBottom: 14,
    backgroundColor: B.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: B.border,
  },
  statItem: { alignItems: "center" },
  statVal: { fontSize: 20, fontWeight: "900", marginBottom: 2 },
  statLabel: { fontSize: 10, color: B.muted },

  // Post card
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  moodTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  moodTagDot: { width: 5, height: 5, borderRadius: 3 },
  moodTagText: { fontSize: 11, fontWeight: "700" },
  postMeta: { fontSize: 11, color: B.muted2 },
  postContent: {
    fontSize: 14,
    color: B.text,
    lineHeight: 22,
    marginBottom: 16,
  },
  postActions: { flexDirection: "row", alignItems: "center", gap: 10 },
  voteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: B.border,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  voteBtnEmoji: { fontSize: 14 },
  voteBtnCount: { fontSize: 13, color: B.muted, fontWeight: "600" },
  scoreWrap: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  scoreText: { fontSize: 11, fontWeight: "700" },

  // New post sheet
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#0C1226",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: B.border,
    padding: 24,
    paddingBottom: 40,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignSelf: "center",
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: B.text,
    marginBottom: 6,
  },
  sheetSub: { fontSize: 12, color: B.muted, lineHeight: 18, marginBottom: 18 },
  textAreaWrap: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: B.border,
    padding: 14,
    marginBottom: 18,
  },
  textArea: {
    fontSize: 14,
    color: B.text,
    minHeight: 100,
    textAlignVertical: "top",
    lineHeight: 22,
  },
  charCount: {
    fontSize: 10,
    color: B.muted2,
    textAlign: "right",
    marginTop: 6,
  },
  tagSelectLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: B.muted,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  tagGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 24 },
  tagChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: B.border,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  tagChipText: { fontSize: 12, color: B.muted },
  sheetActions: { flexDirection: "row", gap: 12 },
  cancelBtn: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: B.border,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: { fontSize: 14, fontWeight: "600", color: B.muted },
  postBtn: {
    flex: 2,
    height: 50,
    borderRadius: 14,
    backgroundColor: B.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: B.primary,
    shadowRadius: 12,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 3 },
  },
  postBtnText: { fontSize: 15, fontWeight: "800", color: "#fff" },

  // Dashboard
  dashHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  dashTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: B.text,
    marginBottom: 3,
  },
  dashSub: { fontSize: 12, color: B.muted },
  burnoutBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: B.red + "14",
    borderWidth: 1,
    borderColor: B.red + "35",
  },
  burnoutDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: B.red },
  burnoutText: { fontSize: 10, fontWeight: "700", color: B.red },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: B.border,
  },
  metricItem: { alignItems: "center" },
  metricVal: { fontSize: 20, fontWeight: "900", marginBottom: 3 },
  metricLabel: { fontSize: 10, color: B.muted, textAlign: "center" },
  donutRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 18,
  },
  donutLegend: { flex: 1 },
  legendLabel: { fontSize: 12, color: B.muted },
  legendPct: { fontSize: 12, fontWeight: "700" },
  legendTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.07)",
    overflow: "hidden",
  },
  legendFill: { height: 4, borderRadius: 2 },
  issuesRow: { borderTopWidth: 1, borderTopColor: B.border, paddingTop: 14 },
  issuesTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: B.muted,
    marginBottom: 10,
  },
  issuesTags: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  issueTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: B.border,
  },
  issueTagText: { fontSize: 12, color: B.muted },
  topPostsHeader: { marginTop: 20, marginBottom: 14 },
  topPostsTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: B.text,
    marginBottom: 2,
  },
  topPostsSub: { fontSize: 12, color: B.muted },

  // FAB
  fab: {
    position: "absolute",
    bottom: 28,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: B.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: B.primary,
    shadowRadius: 16,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 4 },
  },
  fabText: { fontSize: 28, color: "#fff", lineHeight: 32 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});
