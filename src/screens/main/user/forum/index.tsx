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
  Polyline,
  Rect,
  Stop,
  Text as SvgText,
} from "react-native-svg";

const { width: W } = Dimensions.get("window");

// ─── Toggle to test both states ───────────────────────────────────────────────
const HAS_ORGANIZATION = true; // false = join org flow

// ─── Brand ────────────────────────────────────────────────────────────────────

const B = {
  primary: "#0F766E",
  secondary: "#1E3A8A",
  accent: "#22C55E",
  bg: "#04060F",
  card: "#080D1C",
  cardAlt: "#0A1020",
  border: "rgba(255,255,255,0.07)",
  borderMid: "rgba(255,255,255,0.12)",
  text: "#F0F4FF",
  muted: "rgba(240,244,255,0.45)",
  muted2: "rgba(240,244,255,0.2)",
  amber: "#F59E0B",
  red: "#EF4444",
  violet: "#8B5CF6",
  rose: "#F43F5E",
  sky: "#0EA5E9",
  teal: "#14B8A6",
};

// ─── Mock data ────────────────────────────────────────────────────────────────

const ORG = {
  name: "TechCorp Ltd",
  industry: "Software & Technology",
  size: "201–500 employees",
  location: "Lagos, Nigeria",
  founded: "2015",
  icon: "💼",
  members: 142,
  activeToday: 67,
  totalPosts: 1284,
  joinedDate: "March 2026",
};

const ORGANIZATIONS = [
  {
    id: "1",
    name: "TechCorp Ltd",
    members: 142,
    icon: "💼",
    industry: "Technology",
  },
  {
    id: "2",
    name: "HealthPlus Hospital",
    members: 89,
    icon: "🏥",
    industry: "Healthcare",
  },
  {
    id: "3",
    name: "EduFirst Schools",
    members: 203,
    icon: "🎓",
    industry: "Education",
  },
  {
    id: "4",
    name: "BuildRight Construction",
    members: 67,
    icon: "🏗️",
    industry: "Construction",
  },
  {
    id: "5",
    name: "FinEdge Capital",
    members: 55,
    icon: "💰",
    industry: "Finance",
  },
  {
    id: "6",
    name: "GreenLeaf NGO",
    members: 38,
    icon: "🌿",
    industry: "Non-profit",
  },
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
  { label: "overwhelmed", color: B.rose },
  { label: "unmotivated", color: B.violet },
  { label: "hopeful", color: B.accent },
  { label: "grateful", color: B.primary },
  { label: "anxious", color: B.sky },
  { label: "calm", color: B.teal },
];

const POSTS = [
  {
    id: "1",
    anonId: "Anon #4829",
    avatar: "🦊",
    content:
      "The amount of back-to-back meetings this week has been completely draining. I haven't had a single block to actually think or produce meaningful work.",
    moodTag: "burnt out",
    tagColor: B.red,
    upvotes: 47,
    downvotes: 3,
    time: "2h ago",
    dept: "Engineering",
    userVote: null as "up" | "down" | null,
    trending: true,
  },
  {
    id: "2",
    anonId: "Anon #7731",
    avatar: "🐺",
    content:
      "Finally feel like I'm making progress after weeks of feeling stuck. Shipped a feature I'm proud of today — small wins matter more than I realised.",
    moodTag: "hopeful",
    tagColor: B.accent,
    upvotes: 82,
    downvotes: 1,
    time: "4h ago",
    dept: "Product",
    userVote: "up" as "up" | "down" | null,
    trending: true,
  },
  {
    id: "3",
    anonId: "Anon #2210",
    avatar: "🦁",
    content:
      "Communication gaps between teams are causing so much unnecessary stress. We need better systems urgently.",
    moodTag: "stressed",
    tagColor: B.amber,
    upvotes: 61,
    downvotes: 8,
    time: "6h ago",
    dept: "Operations",
    userVote: null as "up" | "down" | null,
    trending: false,
  },
  {
    id: "4",
    anonId: "Anon #9034",
    avatar: "🐻",
    content:
      "Been working late every single day for the past month. Management keeps piling on more without acknowledging limits. This is unsustainable.",
    moodTag: "overwhelmed",
    tagColor: B.rose,
    upvotes: 94,
    downvotes: 2,
    time: "8h ago",
    dept: "Design",
    userVote: null as "up" | "down" | null,
    trending: true,
  },
  {
    id: "5",
    anonId: "Anon #5512",
    avatar: "🦋",
    content:
      "Had a genuinely supportive 1:1 with my lead today. It made a real difference to feel heard. More of this culture please.",
    moodTag: "grateful",
    tagColor: B.primary,
    upvotes: 53,
    downvotes: 0,
    time: "12h ago",
    dept: "HR",
    userVote: null as "up" | "down" | null,
    trending: false,
  },
  {
    id: "6",
    anonId: "Anon #3388",
    avatar: "🦅",
    content:
      "The workload distribution in this org is deeply unequal. Some people are drowning while others have nothing to do. Management needs to fix this.",
    moodTag: "stressed",
    tagColor: B.amber,
    upvotes: 71,
    downvotes: 5,
    time: "1d ago",
    dept: "Finance",
    userVote: null as "up" | "down" | null,
    trending: false,
  },
];

// Dashboard analytics
const WEEKLY_MOOD = [62, 55, 70, 48, 52, 65, 58]; // 0-100 wellness score
const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

const STRESS_BY_DEPT = [
  { dept: "Engineering", score: 72, color: B.red },
  { dept: "Product", score: 55, color: B.amber },
  { dept: "Design", score: 48, color: B.accent },
  { dept: "Operations", score: 68, color: B.amber },
  { dept: "HR", score: 35, color: B.accent },
  { dept: "Finance", score: 60, color: B.amber },
];

const EMOTIONS_DIST = [
  { label: "Stressed", pct: 34, color: B.amber },
  { label: "Burnt out", pct: 22, color: B.red },
  { label: "Hopeful", pct: 24, color: B.accent },
  { label: "Overwhelmed", pct: 20, color: B.violet },
];

const TOP_ISSUES = [
  { issue: "Work pressure", count: 38, pct: 78 },
  { issue: "Communication", count: 29, pct: 60 },
  { issue: "Deadlines", count: 25, pct: 51 },
  { issue: "Recognition", count: 18, pct: 37 },
  { issue: "Work-life balance", count: 15, pct: 31 },
];

// Contribution grid for dashboard
const DASH_GRID = (() => {
  const r = (() => {
    let x = 99;
    return () => {
      x = (x * 9301 + 49297) % 233280;
      return x / 233280;
    };
  })();
  return Array.from({ length: 12 }, () =>
    Array.from({ length: 7 }, () => {
      const v = r();
      if (v < 0.15) return 0;
      if (v < 0.35) return 1;
      if (v < 0.6) return 2;
      if (v < 0.8) return 3;
      return 4;
    }),
  );
})();

const heatColor = (v: number) => {
  if (v === 0) return "rgba(255,255,255,0.04)";
  if (v === 1) return B.accent + "55";
  if (v === 2) return B.primary + "88";
  if (v === 3) return B.amber + "99";
  return B.red + "BB";
};

// ─── Shared ───────────────────────────────────────────────────────────────────

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
      cs.card,
      accent && {
        borderColor: accent + "30",
        shadowColor: accent,
        shadowRadius: 18,
        shadowOpacity: 0.13,
        shadowOffset: { width: 0, height: 5 },
      },
      style,
    ]}
  >
    {children}
  </View>
);

const SectionTitle = ({ title, sub }: { title: string; sub?: string }) => (
  <View style={{ marginBottom: 14 }}>
    <Text style={cs.sectionTitle}>{title}</Text>
    {sub && <Text style={cs.sectionSub}>{sub}</Text>}
  </View>
);

// ══════════════════════════════════════════════════════════════════════════════
// NO ORG STATE
// ══════════════════════════════════════════════════════════════════════════════

const NoOrgScreen = () => {
  const [step, setStep] = useState<"landing" | "search" | "confirm">("landing");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<(typeof ORGANIZATIONS)[0] | null>(
    null,
  );
  const [dept, setDept] = useState("");
  const [sent, setSent] = useState(false);

  const floatY = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
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
  const filtered = ORGANIZATIONS.filter((o) =>
    o.name.toLowerCase().includes(query.toLowerCase()),
  );

  if (step === "landing")
    return (
      <Animated.View
        style={[{ flex: 1, paddingHorizontal: 24 }, { opacity: fade }]}
      >
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          {/* Hero */}
          <Animated.View
            style={[ns.heroIcon, { transform: [{ translateY: floatY }] }]}
          >
            <Text style={{ fontSize: 52 }}>🏢</Text>
          </Animated.View>

          <Text style={ns.heroTitle}>Join your{"\n"}organization.</Text>
          <Text style={ns.heroSub}>
            Connect with your workplace to access the anonymous wellbeing forum,
            team insights, and community support — all while staying completely
            anonymous.
          </Text>

          {/* Feature cards */}
          <View style={ns.featureGrid}>
            {[
              {
                icon: "💬",
                title: "Anonymous Posts",
                sub: "Share freely, safely",
              },
              { icon: "📊", title: "Team Dashboard", sub: "Org-wide insights" },
              {
                icon: "🗳️",
                title: "Signal Voting",
                sub: "Amplify real voices",
              },
              { icon: "🔒", title: "Zero Identity", sub: "Always anonymous" },
            ].map((f, i) => (
              <View key={i} style={ns.featureCard}>
                <Text style={{ fontSize: 22, marginBottom: 6 }}>{f.icon}</Text>
                <Text style={ns.featureCardTitle}>{f.title}</Text>
                <Text style={ns.featureCardSub}>{f.sub}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            onPress={() => setStep("search")}
            activeOpacity={0.88}
            style={ns.ctaBtn}
          >
            <Text style={ns.ctaBtnText}>Find My Organization</Text>
            <Text style={{ fontSize: 18, color: "#fff" }}>→</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );

  if (step === "search")
    return (
      <Animated.View style={[{ flex: 1 }, slideIn]}>
        <View style={ns.stepHead}>
          <Pressable onPress={() => setStep("landing")} hitSlop={10}>
            <Text style={ns.back}>← Back</Text>
          </Pressable>
          <Text style={ns.stepTitle}>Find Organization</Text>
          <View style={{ width: 50 }} />
        </View>
        <View style={ns.searchWrap}>
          <Text style={{ fontSize: 18 }}>🔍</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search organizations…"
            placeholderTextColor={B.muted2}
            style={ns.searchInput}
            autoFocus
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")} hitSlop={8}>
              <Text style={{ color: B.muted, fontSize: 16 }}>✕</Text>
            </Pressable>
          )}
        </View>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 20, gap: 10 }}
          showsVerticalScrollIndicator={false}
        >
          {filtered.length === 0 ? (
            <View style={{ alignItems: "center", paddingTop: 60 }}>
              <Text style={{ fontSize: 40, marginBottom: 14 }}>🔍</Text>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "700",
                  color: B.text,
                  marginBottom: 6,
                }}
              >
                No results for "{query}"
              </Text>
              <Text
                style={{ fontSize: 13, color: B.muted, textAlign: "center" }}
              >
                Try a different name or check with your HR team.
              </Text>
            </View>
          ) : (
            filtered.map((org) => (
              <Pressable
                key={org.id}
                onPress={() => {
                  setSelected(org);
                  setStep("confirm");
                }}
                style={ns.orgRow}
              >
                <View style={ns.orgIcon}>
                  <Text style={{ fontSize: 24 }}>{org.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={ns.orgName}>{org.name}</Text>
                  <Text style={ns.orgMeta}>
                    {org.industry} · {org.members} members
                  </Text>
                </View>
                <Text style={{ color: B.muted, fontSize: 20 }}>›</Text>
              </Pressable>
            ))
          )}
        </ScrollView>
      </Animated.View>
    );

  // Confirm
  return (
    <Animated.View style={[{ flex: 1 }, slideIn]}>
      <View style={ns.stepHead}>
        <Pressable onPress={() => setStep("search")} hitSlop={10}>
          <Text style={ns.back}>← Back</Text>
        </Pressable>
        <Text style={ns.stepTitle}>Join Organization</Text>
        <View style={{ width: 50 }} />
      </View>
      <ScrollView
        contentContainerStyle={{ padding: 20, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {selected && (
          <Card accent={B.primary}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 14 }}
            >
              <View style={ns.confirmIcon}>
                <Text style={{ fontSize: 30 }}>{selected.icon}</Text>
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
              <View style={ns.verifiedBadge}>
                <Text style={ns.verifiedText}>✓ Verified</Text>
              </View>
            </View>
          </Card>
        )}

        <Card>
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
            Optional — helps with anonymized team analytics
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {DEPARTMENTS.map((d) => (
              <Pressable
                key={d}
                onPress={() => setDept(d === dept ? "" : d)}
                style={[
                  ns.deptPill,
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
        </Card>

        <View style={ns.privacyCard}>
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
            You'll appear only as a generated Anon ID inside the forum. Your
            name, department, and details are never visible to other members or
            admins.
          </Text>
        </View>

        {!sent ? (
          <TouchableOpacity
            onPress={() => setSent(true)}
            activeOpacity={0.88}
            style={ns.sendBtn}
          >
            <Text style={{ fontSize: 16, fontWeight: "800", color: "#fff" }}>
              Send Join Request
            </Text>
            <Text style={{ fontSize: 16, color: "#fff" }}>→</Text>
          </TouchableOpacity>
        ) : (
          <View style={ns.sentCard}>
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
              Your request has been sent to {selected?.name}. You'll be notified
              once an admin approves it — usually within 24 hours.
            </Text>
          </View>
        )}
      </ScrollView>
    </Animated.View>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// HAS ORG — FORUM FEED
// ══════════════════════════════════════════════════════════════════════════════

// ─── Post card ────────────────────────────────────────────────────────────────

type Post = (typeof POSTS)[0];

const PostCard = ({
  post,
  onVote,
}: {
  post: Post;
  onVote: (id: string, dir: "up" | "down") => void;
}) => {
  const upScale = useRef(new Animated.Value(1)).current;
  const downScale = useRef(new Animated.Value(1)).current;
  const cardScale = useRef(new Animated.Value(0.97)).current;

  useEffect(() => {
    Animated.spring(cardScale, {
      toValue: 1,
      tension: 60,
      friction: 12,
      useNativeDriver: true,
    }).start();
  }, []);

  const vote = (dir: "up" | "down") => {
    const anim = dir === "up" ? upScale : downScale;
    Animated.sequence([
      Animated.spring(anim, {
        toValue: 1.35,
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
    <Animated.View
      style={{ transform: [{ scale: cardScale }], marginBottom: 1 }}
    >
      <View style={fs.postCard}>
        {/* Top row — avatar + meta */}
        <View style={fs.postTop}>
          <View style={fs.avatar}>
            <Text style={{ fontSize: 20 }}>{post.avatar}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Text style={fs.anonId}>{post.anonId}</Text>
              {post.trending && (
                <View style={fs.trendBadge}>
                  <Text style={fs.trendText}>🔥 Trending</Text>
                </View>
              )}
            </View>
            <Text style={fs.postMetaLine}>
              {post.dept} · {post.time}
            </Text>
          </View>
          {/* Mood tag top-right */}
          <View
            style={[
              fs.moodTag,
              {
                borderColor: post.tagColor + "50",
                backgroundColor: post.tagColor + "14",
              },
            ]}
          >
            <View style={[fs.moodDot, { backgroundColor: post.tagColor }]} />
            <Text style={[fs.moodTagText, { color: post.tagColor }]}>
              {post.moodTag}
            </Text>
          </View>
        </View>

        {/* Content */}
        <Text style={fs.postContent}>{post.content}</Text>

        {/* Divider */}
        <View style={fs.postDivider} />

        {/* Actions row */}
        <View style={fs.postActions}>
          {/* Upvote */}
          <Animated.View style={{ transform: [{ scale: upScale }] }}>
            <Pressable
              onPress={() => vote("up")}
              style={[
                fs.voteBtn,
                upActive && {
                  backgroundColor: B.accent + "15",
                  borderColor: B.accent + "40",
                },
              ]}
            >
              <Text style={fs.voteEmoji}>👍</Text>
              <Text
                style={[
                  fs.voteCount,
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
                fs.voteBtn,
                downActive && {
                  backgroundColor: B.red + "15",
                  borderColor: B.red + "40",
                },
              ]}
            >
              <Text style={fs.voteEmoji}>👎</Text>
              <Text
                style={[
                  fs.voteCount,
                  downActive && { color: B.red, fontWeight: "800" },
                ]}
              >
                {post.downvotes}
              </Text>
            </Pressable>
          </Animated.View>

          <View style={{ flex: 1 }} />

          {/* Signal score */}
          <View
            style={[
              fs.signalBadge,
              {
                backgroundColor:
                  score > 30
                    ? B.accent + "12"
                    : score > 10
                      ? B.primary + "12"
                      : "rgba(255,255,255,0.04)",
              },
            ]}
          >
            <Text
              style={[
                fs.signalText,
                {
                  color:
                    score > 30 ? B.accent : score > 10 ? B.primary : B.muted2,
                },
              ]}
            >
              {score > 0 ? "+" : ""}
              {score} signal
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

// ─── New post bottom sheet ────────────────────────────────────────────────────

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
  const slide = useRef(new Animated.Value(600)).current;

  useEffect(() => {
    Animated.spring(slide, {
      toValue: visible ? 0 : 600,
      tension: 58,
      friction: 14,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const canPost = content.trim().length > 0 && tag.length > 0;

  const submit = () => {
    if (!canPost) return;
    onPost(content.trim(), tag);
    setContent("");
    setTag("");
    onClose();
  };

  return (
    <Animated.View style={[ps.sheet, { transform: [{ translateY: slide }] }]}>
      <View style={ps.handle} />

      {/* Header */}
      <View style={ps.sheetHeader}>
        <View style={ps.sheetAvatar}>
          <Text style={{ fontSize: 18 }}>🦊</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={ps.sheetTitle}>Share Anonymously</Text>
          <Text style={ps.sheetSub}>Visible only to TechCorp Ltd members</Text>
        </View>
        <Pressable onPress={onClose} hitSlop={10}>
          <Text style={{ fontSize: 20, color: B.muted }}>✕</Text>
        </Pressable>
      </View>

      {/* Text area */}
      <View style={ps.textWrap}>
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="What's on your mind today? Share freely — you're anonymous."
          placeholderTextColor={B.muted2}
          multiline
          numberOfLines={5}
          style={ps.textInput}
          maxLength={280}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 8,
          }}
        >
          <View
            style={[
              ps.charArc,
              { borderColor: content.length > 240 ? B.red : B.border },
            ]}
          >
            <Text
              style={[
                ps.charCount,
                { color: content.length > 240 ? B.red : B.muted2 },
              ]}
            >
              {280 - content.length}
            </Text>
          </View>
        </View>
      </View>

      {/* Mood tag */}
      <Text style={ps.tagLabel}>How are you feeling?</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 20 }}
      >
        <View style={{ flexDirection: "row", gap: 8, paddingHorizontal: 4 }}>
          {MOOD_TAGS.map((t, i) => (
            <Pressable
              key={i}
              onPress={() => setTag(t.label === tag ? "" : t.label)}
              style={[
                ps.tagChip,
                tag === t.label && {
                  borderColor: t.color,
                  backgroundColor: t.color + "1A",
                },
              ]}
            >
              <Text
                style={[
                  ps.tagChipText,
                  tag === t.label && { color: t.color, fontWeight: "700" },
                ]}
              >
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Privacy reminder */}
      <View style={ps.privacyStrip}>
        <Text style={{ fontSize: 13 }}>🔒</Text>
        <Text style={ps.privacyText}>
          Your Anon ID will be shown, never your name or identity.
        </Text>
      </View>

      {/* Post button */}
      <TouchableOpacity
        onPress={submit}
        activeOpacity={0.88}
        style={[ps.postBtn, !canPost && { opacity: 0.38 }]}
        disabled={!canPost}
      >
        <Text style={ps.postBtnText}>Post to Forum</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Feed tab ─────────────────────────────────────────────────────────────────

const FeedTab = ({
  posts,
  onVote,
  onNewPost,
}: {
  posts: Post[];
  onVote: (id: string, dir: "up" | "down") => void;
  onNewPost: () => void;
}) => {
  const [filter, setFilter] = useState<"all" | "trending" | "recent">("all");

  const filtered =
    filter === "trending"
      ? [...posts].sort(
          (a, b) => b.upvotes - b.downvotes - (a.upvotes - a.downvotes),
        )
      : filter === "recent"
        ? posts
        : posts;

  return (
    <View style={{ flex: 1 }}>
      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={fs.filterRow}
      >
        {(["all", "trending", "recent"] as const).map((f) => (
          <Pressable
            key={f}
            onPress={() => setFilter(f)}
            style={[
              fs.filterChip,
              filter === f && {
                borderColor: B.primary,
                backgroundColor: B.primary + "18",
              },
            ]}
          >
            <Text
              style={[
                fs.filterText,
                filter === f && { color: B.primary, fontWeight: "700" },
              ]}
            >
              {f === "all"
                ? "🌐 All"
                : f === "trending"
                  ? "🔥 Trending"
                  : "🕐 Recent"}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView
        contentContainerStyle={fs.feedContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 16 }}
        >
          <View style={{ flexDirection: "row", gap: 10 }}>
            {[
              { label: "Posts today", val: "47", color: B.primary, icon: "💬" },
              { label: "Active now", val: "67", color: B.accent, icon: "🟢" },
              { label: "Anonymous", val: "100%", color: B.violet, icon: "🔒" },
              { label: "Trending", val: "3", color: B.amber, icon: "🔥" },
            ].map((st, i) => (
              <View key={i} style={fs.statPill}>
                <Text style={{ fontSize: 14 }}>{st.icon}</Text>
                <Text style={[fs.statVal, { color: st.color }]}>{st.val}</Text>
                <Text style={fs.statLabel}>{st.label}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {filtered.map((p) => (
          <PostCard key={p.id} post={p} onVote={onVote} />
        ))}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* FAB */}
      <Pressable onPress={onNewPost} style={fs.fab}>
        <Text style={fs.fabIcon}>✏️</Text>
      </Pressable>
    </View>
  );
};

// ─── Dashboard tab ────────────────────────────────────────────────────────────

// Donut chart
const Donut = ({ data }: { data: typeof EMOTIONS_DIST }) => {
  const SIZE = 120,
    CX = 60,
    CY = 60,
    R = 42,
    SW = 15;
  let cum = 0;
  const arcs = data.map((e) => {
    const pct = e.pct / 100;
    const s = cum * 2 * Math.PI - Math.PI / 2;
    const en = (cum + pct) * 2 * Math.PI - Math.PI / 2;
    cum += pct;
    return {
      ...e,
      d: `M ${CX + R * Math.cos(s)} ${CY + R * Math.sin(s)} A ${R} ${R} 0 ${pct > 0.5 ? 1 : 0} 1 ${CX + R * Math.cos(en)} ${CY + R * Math.sin(en)}`,
    };
  });
  return (
    <Svg width={SIZE} height={SIZE}>
      <Circle
        cx={CX}
        cy={CY}
        r={R}
        fill="none"
        stroke="rgba(255,255,255,0.05)"
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
      <Circle cx={CX} cy={CY} r={R - SW / 2 - 3} fill={B.card} />
      <SvgText
        x={CX}
        y={CY - 5}
        textAnchor="middle"
        fill={B.text}
        fontSize={18}
        fontWeight="800"
      >
        34%
      </SvgText>
      <SvgText
        x={CX}
        y={CY + 11}
        textAnchor="middle"
        fill={B.muted}
        fontSize={9}
      >
        Stressed
      </SvgText>
    </Svg>
  );
};

// Line chart
const WellnessLine = () => {
  const CHART_W = W - 80;
  const CHART_H = 80;
  const PAD = 12;
  const stepX = (CHART_W - PAD * 2) / (WEEKLY_MOOD.length - 1);

  const pts = WEEKLY_MOOD.map((v, i) => ({
    x: PAD + i * stepX,
    y: PAD + ((100 - v) / 100) * (CHART_H - PAD * 2),
    v,
  }));

  const linePath = pts
    .map((p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const prev = pts[i - 1];
      const cpx = (prev.x + p.x) / 2;
      return `C ${cpx} ${prev.y} ${cpx} ${p.y} ${p.x} ${p.y}`;
    })
    .join(" ");

  const areaPath =
    linePath +
    ` L ${pts[pts.length - 1].x} ${CHART_H} L ${pts[0].x} ${CHART_H} Z`;

  return (
    <Svg width={CHART_W} height={CHART_H}>
      <Defs>
        <SvgGrad id="wg" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={B.primary} stopOpacity="0.3" />
          <Stop offset="100%" stopColor={B.primary} stopOpacity="0" />
        </SvgGrad>
      </Defs>
      <Path d={areaPath} fill="url(#wg)" />
      <Path
        d={linePath}
        fill="none"
        stroke={B.primary}
        strokeWidth={2}
        strokeLinecap="round"
      />
      {pts.map((p, i) => (
        <React.Fragment key={i}>
          <Circle cx={p.x} cy={p.y} r={4.5} fill={B.card} />
          <Circle
            cx={p.x}
            cy={p.y}
            r={3}
            fill={p.v >= 60 ? B.accent : p.v >= 50 ? B.amber : B.red}
          />
        </React.Fragment>
      ))}
    </Svg>
  );
};

// Dept stress bars
const DeptBars = () => {
  const barAnims = STRESS_BY_DEPT.map(
    () => useRef(new Animated.Value(0)).current,
  );
  useEffect(() => {
    barAnims.forEach((a, i) =>
      Animated.spring(a, {
        toValue: 1,
        delay: i * 80,
        tension: 60,
        friction: 10,
        useNativeDriver: true,
      }).start(),
    );
  }, []);

  return (
    <View style={{ gap: 10 }}>
      {STRESS_BY_DEPT.map((d, i) => {
        const scaleX = barAnims[i].interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        });
        return (
          <View key={i}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <Text style={{ fontSize: 12, color: B.muted }}>{d.dept}</Text>
              <Text
                style={[
                  { fontSize: 12, fontWeight: "700" },
                  { color: d.color },
                ]}
              >
                {d.score}%
              </Text>
            </View>
            <View style={ds.barTrack}>
              <Animated.View
                style={[
                  ds.barFill,
                  {
                    width: `${d.score}%`,
                    backgroundColor: d.color,
                    transform: [{ scaleX }],
                  },
                ]}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
};

// Top issues
const TopIssues = () => {
  const barAnims = TOP_ISSUES.map(() => useRef(new Animated.Value(0)).current);
  useEffect(() => {
    barAnims.forEach((a, i) =>
      Animated.spring(a, {
        toValue: 1,
        delay: i * 100,
        tension: 55,
        friction: 10,
        useNativeDriver: false,
      }).start(),
    );
  }, []);

  return (
    <View style={{ gap: 12 }}>
      {TOP_ISSUES.map((issue, i) => {
        const w = barAnims[i].interpolate({
          inputRange: [0, 1],
          outputRange: ["0%", `${issue.pct}%`],
        });
        return (
          <View key={i}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 5,
              }}
            >
              <Text style={{ fontSize: 13, color: B.text, fontWeight: "600" }}>
                {issue.issue}
              </Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Text style={{ fontSize: 12, color: B.muted }}>
                  {issue.count} posts
                </Text>
                <Text
                  style={{ fontSize: 12, color: B.primary, fontWeight: "700" }}
                >
                  {issue.pct}%
                </Text>
              </View>
            </View>
            <View style={ds.issueTrack}>
              <Animated.View style={[ds.issueFill, { width: w }]} />
            </View>
          </View>
        );
      })}
    </View>
  );
};

// Heat grid
const HeatGrid = () => {
  const CELL = 11,
    GAP = 3;
  const cols = DASH_GRID.length,
    rows = 7;
  const svgW = cols * (CELL + GAP) - GAP,
    svgH = rows * (CELL + GAP) - GAP;
  const DAY = ["", "M", "", "W", "", "F", ""];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={{ flexDirection: "row" }}>
        <View style={{ marginRight: 4 }}>
          {DAY.map((d, i) => (
            <View
              key={i}
              style={{ height: CELL + GAP, justifyContent: "center" }}
            >
              <Text
                style={{
                  fontSize: 7,
                  color: B.muted2,
                  width: 9,
                  textAlign: "right",
                }}
              >
                {d}
              </Text>
            </View>
          ))}
        </View>
        <Svg width={svgW} height={svgH}>
          {DASH_GRID.map((week, wi) =>
            week.map((val, di) => (
              <Rect
                key={`${wi}-${di}`}
                x={wi * (CELL + GAP)}
                y={di * (CELL + GAP)}
                width={CELL}
                height={CELL}
                rx={2}
                fill={heatColor(val)}
              />
            )),
          )}
        </Svg>
      </View>
    </ScrollView>
  );
};

const DashboardTab = () => (
  <ScrollView
    contentContainerStyle={ds.scroll}
    showsVerticalScrollIndicator={false}
  >
    {/* Company card */}
    <Card accent={B.primary} style={{ marginBottom: 14 }}>
      {/* Banner */}
      <View style={ds.banner}>
        <View style={ds.bannerGrad} />
        <View style={ds.bannerContent}>
          <View style={ds.orgAvatar}>
            <Text style={{ fontSize: 28 }}>{ORG.icon}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={ds.orgName}>{ORG.name}</Text>
            <Text style={ds.orgIndustry}>{ORG.industry}</Text>
          </View>
          <View style={ds.memberBadge}>
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: B.accent,
              }}
            />
            <Text style={ds.memberText}>Active Member</Text>
          </View>
        </View>
      </View>

      {/* Details grid */}
      <View style={ds.orgDetails}>
        {[
          { icon: "👥", label: "Size", val: ORG.size },
          { icon: "📍", label: "Location", val: ORG.location },
          { icon: "📅", label: "Founded", val: ORG.founded },
          { icon: "🗓️", label: "Joined", val: ORG.joinedDate },
        ].map((d, i) => (
          <View key={i} style={ds.orgDetailItem}>
            <Text style={{ fontSize: 14 }}>{d.icon}</Text>
            <View>
              <Text style={ds.orgDetailLabel}>{d.label}</Text>
              <Text style={ds.orgDetailVal}>{d.val}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Stats row */}
      <View style={ds.statsRow}>
        {[
          { val: ORG.members, label: "Members", color: B.primary },
          { val: ORG.activeToday, label: "Active today", color: B.accent },
          { val: ORG.totalPosts, label: "Total posts", color: B.violet },
        ].map((st, i) => (
          <View key={i} style={ds.statItem}>
            <Text style={[ds.statVal, { color: st.color }]}>{st.val}</Text>
            <Text style={ds.statLabel}>{st.label}</Text>
          </View>
        ))}
      </View>
    </Card>

    {/* Burnout alert */}
    <View style={ds.alertCard}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: 22 }}>⚠️</Text>
        <View style={{ flex: 1 }}>
          <Text style={ds.alertTitle}>High Burnout Risk Detected</Text>
          <Text style={ds.alertSub}>
            72% of members report elevated stress this week
          </Text>
        </View>
        <View style={ds.alertBadge}>
          <Text style={ds.alertBadgeText}>HIGH</Text>
        </View>
      </View>
    </View>

    {/* Wellness trend */}
    <Card style={{ marginBottom: 14 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 14,
        }}
      >
        <SectionTitle title="Wellness Trend" sub="7-day team score" />
        <View style={ds.trendBadge}>
          <Text style={ds.trendBadgeText}>↓ 8pts this week</Text>
        </View>
      </View>
      <WellnessLine />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 8,
        }}
      >
        {DAY_LABELS.map((d, i) => (
          <Text
            key={i}
            style={{
              fontSize: 10,
              color: B.muted2,
              textAlign: "center",
              flex: 1,
            }}
          >
            {d}
          </Text>
        ))}
      </View>
    </Card>

    {/* Emotion breakdown */}
    <Card style={{ marginBottom: 14 }}>
      <SectionTitle title="Emotion Breakdown" sub="This month · 142 members" />
      <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
        <Donut data={EMOTIONS_DIST} />
        <View style={{ flex: 1, gap: 10 }}>
          {EMOTIONS_DIST.map((e, i) => (
            <View key={i}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 3,
                }}
              >
                <Text style={{ fontSize: 12, color: B.muted }}>{e.label}</Text>
                <Text
                  style={[
                    { fontSize: 12, fontWeight: "700" },
                    { color: e.color },
                  ]}
                >
                  {e.pct}%
                </Text>
              </View>
              <View style={ds.barTrack}>
                <View
                  style={[
                    ds.barFill,
                    { width: `${e.pct}%`, backgroundColor: e.color },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    </Card>

    {/* Stress by dept */}
    <Card style={{ marginBottom: 14 }}>
      <SectionTitle
        title="Stress by Department"
        sub="Average stress score this week"
      />
      <DeptBars />
    </Card>

    {/* Top issues */}
    <Card style={{ marginBottom: 14 }}>
      <SectionTitle
        title="Top Issues"
        sub="Most reported concerns in the forum"
      />
      <TopIssues />
    </Card>

    {/* Activity heatmap */}
    <Card style={{ marginBottom: 14 }}>
      <SectionTitle
        title="Check-in Activity"
        sub="12-week org engagement · color = stress level"
      />
      <HeatGrid />
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 10,
          marginTop: 12,
        }}
      >
        {[
          { color: "rgba(255,255,255,0.05)", label: "No data" },
          { color: B.accent + "55", label: "Great" },
          { color: B.primary + "88", label: "Good" },
          { color: B.amber + "99", label: "Some stress" },
          { color: B.red + "BB", label: "High stress" },
        ].map((g, i) => (
          <View
            key={i}
            style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
          >
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                backgroundColor: g.color,
              }}
            />
            <Text style={{ fontSize: 10, color: B.muted2 }}>{g.label}</Text>
          </View>
        ))}
      </View>
    </Card>

    <View style={{ height: 100 }} />
  </ScrollView>
);

// ─── Main forum (has org) ─────────────────────────────────────────────────────

const ForumScreen = () => {
  const [posts, setPosts] = useState(POSTS);
  const [activeTab, setActiveTab] = useState<"feed" | "dashboard">("feed");
  const [showNewPost, setShowNewPost] = useState(false);
  const tabAnim = useRef(new Animated.Value(0)).current;

  const handleVote = (id: string, dir: "up" | "down") => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        return {
          ...p,
          upvotes:
            dir === "up"
              ? p.upvotes + (p.userVote === "up" ? -1 : 1)
              : p.upvotes - (p.userVote === "up" ? 1 : 0),
          downvotes:
            dir === "down"
              ? p.downvotes + (p.userVote === "down" ? -1 : 1)
              : p.downvotes - (p.userVote === "down" ? 1 : 0),
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
        anonId: "Anon #4829",
        avatar: "🦊",
        content,
        moodTag: tag,
        tagColor: tagData.color,
        upvotes: 0,
        downvotes: 0,
        time: "just now",
        dept: "Engineering",
        userVote: null,
        trending: false,
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

  const indicatorLeft = tabAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["2%", "51%"],
  });

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={hs.header}>
        <View style={{ flex: 1 }}>
          <Text style={hs.title}>Forum</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Text style={{ fontSize: 14 }}>{ORG.icon}</Text>
            <Text style={hs.orgName}>{ORG.name}</Text>
          </View>
        </View>
        <View style={hs.activePill}>
          <View style={hs.activeDot} />
          <Text style={hs.activeText}>{ORG.activeToday} active</Text>
        </View>
      </View>

      {/* Tab bar */}
      <View style={hs.tabWrap}>
        <View style={hs.tabBar}>
          <Animated.View style={[hs.tabIndicator, { left: indicatorLeft }]} />
          {(["feed", "dashboard"] as const).map((tab) => (
            <Pressable
              key={tab}
              onPress={() => switchTab(tab)}
              style={hs.tabBtn}
            >
              <Text
                style={[
                  hs.tabText,
                  activeTab === tab && { color: B.text, fontWeight: "700" },
                ]}
              >
                {tab === "feed" ? "💬 Feed" : "📊 Dashboard"}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Content */}
      {activeTab === "feed" ? (
        <FeedTab
          posts={posts}
          onVote={handleVote}
          onNewPost={() => setShowNewPost(true)}
        />
      ) : (
        <DashboardTab />
      )}

      {/* Sheet overlay */}
      {showNewPost && (
        <Pressable
          style={StyleSheet.absoluteFillObject}
          onPress={() => setShowNewPost(false)}
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: "rgba(0,0,0,0.55)" },
          ]}
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
// ROOT
// ══════════════════════════════════════════════════════════════════════════════

export default function ForumRoot() {
  return (
    <View style={{ flex: 1, backgroundColor: B.bg }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <SafeAreaView style={{ flex: 1 }}>
        {HAS_ORGANIZATION ? <ForumScreen /> : <NoOrgScreen />}
      </SafeAreaView>
    </View>
  );
}

// ─── Style groups ─────────────────────────────────────────────────────────────

// Shared card style
const cs = StyleSheet.create({
  card: {
    backgroundColor: B.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: B.border,
    padding: 18,
    shadowColor: "#000",
    shadowRadius: 10,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: B.text,
    letterSpacing: -0.2,
  },
  sectionSub: { fontSize: 12, color: B.muted, marginTop: 2 },
});

// No-org styles
const ns = StyleSheet.create({
  heroIcon: {
    width: 96,
    height: 96,
    borderRadius: 32,
    backgroundColor: B.primary + "18",
    borderWidth: 1,
    borderColor: B.primary + "30",
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
    alignItems: "flex-start",
  },
  featureCardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: B.text,
    marginBottom: 3,
  },
  featureCardSub: { fontSize: 11, color: B.muted },
  ctaBtn: {
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
  ctaBtnText: { fontSize: 16, fontWeight: "800", color: "#fff" },
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
  confirmIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
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
    borderColor: B.accent + "30",
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
    backgroundColor: B.secondary + "18",
    borderWidth: 1,
    borderColor: B.secondary + "30",
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
    backgroundColor: B.primary + "12",
    borderWidth: 1,
    borderColor: B.primary + "25",
    alignItems: "center",
  },
});

// Forum feed styles
const fs = StyleSheet.create({
  filterRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: B.border,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: B.border,
    backgroundColor: "rgba(255,255,255,0.03)",
    marginRight: 8,
  },
  filterText: { fontSize: 13, color: B.muted },
  feedContent: { paddingHorizontal: 16, paddingTop: 14 },
  statPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: B.card,
    borderWidth: 1,
    borderColor: B.border,
  },
  statVal: { fontSize: 15, fontWeight: "900" },
  statLabel: { fontSize: 10, color: B.muted },

  // Post card
  postCard: {
    backgroundColor: B.card,
    borderBottomWidth: 1,
    borderBottomColor: B.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  postTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: B.primary + "20",
    borderWidth: 1,
    borderColor: B.primary + "30",
    alignItems: "center",
    justifyContent: "center",
  },
  anonId: { fontSize: 14, fontWeight: "700", color: B.text },
  trendBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: B.amber + "18",
    borderWidth: 1,
    borderColor: B.amber + "35",
  },
  trendText: { fontSize: 9, fontWeight: "700", color: B.amber },
  postMetaLine: { fontSize: 11, color: B.muted, marginTop: 2 },
  moodTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  moodDot: { width: 5, height: 5, borderRadius: 3 },
  moodTagText: { fontSize: 10, fontWeight: "700" },
  postContent: {
    fontSize: 15,
    color: B.text,
    lineHeight: 24,
    marginBottom: 14,
    marginLeft: 50,
  },
  postDivider: { height: 1, backgroundColor: B.border, marginBottom: 12 },
  postActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginLeft: 50,
  },
  voteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: B.border,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  voteEmoji: { fontSize: 15 },
  voteCount: { fontSize: 14, color: B.muted, fontWeight: "600" },
  signalBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  signalText: { fontSize: 11, fontWeight: "700" },

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
    shadowRadius: 18,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 4 },
  },
  fabIcon: { fontSize: 22 },
});

// Post sheet styles
const ps = StyleSheet.create({
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#0B1123",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: B.border,
    padding: 20,
    paddingBottom: 40,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignSelf: "center",
    marginBottom: 20,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
  },
  sheetAvatar: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: B.primary + "20",
    borderWidth: 1,
    borderColor: B.primary + "30",
    alignItems: "center",
    justifyContent: "center",
  },
  sheetTitle: { fontSize: 16, fontWeight: "800", color: B.text },
  sheetSub: { fontSize: 11, color: B.muted, marginTop: 2 },
  textWrap: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: B.border,
    padding: 14,
    marginBottom: 18,
  },
  textInput: {
    fontSize: 15,
    color: B.text,
    minHeight: 90,
    textAlignVertical: "top",
    lineHeight: 24,
  },
  charArc: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  charCount: { fontSize: 11, fontWeight: "700" },
  tagLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: B.muted,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  tagChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: B.border,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  tagChipText: { fontSize: 13, color: B.muted },
  privacyStrip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: B.border,
    marginBottom: 16,
  },
  privacyText: { fontSize: 12, color: B.muted, flex: 1 },
  postBtn: {
    height: 52,
    borderRadius: 16,
    backgroundColor: B.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: B.primary,
    shadowRadius: 14,
    shadowOpacity: 0.45,
    shadowOffset: { width: 0, height: 4 },
  },
  postBtnText: { fontSize: 16, fontWeight: "800", color: "#fff" },
});

// Header styles
const hs = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: B.border,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: B.text,
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  orgName: { fontSize: 13, color: B.muted },
  activePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: B.accent + "12",
    borderWidth: 1,
    borderColor: B.accent + "28",
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: B.accent,
  },
  activeText: { fontSize: 12, fontWeight: "700", color: B.accent },
  tabWrap: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: B.border,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 14,
    padding: 3,
    position: "relative",
  },
  tabIndicator: {
    position: "absolute",
    top: 3,
    width: "47%",
    height: "100%",
    borderRadius: 11,
    backgroundColor: B.primary + "28",
    borderWidth: 1,
    borderColor: B.primary + "40",
  },
  tabBtn: { flex: 1, paddingVertical: 9, alignItems: "center" },
  tabText: { fontSize: 13, color: B.muted, fontWeight: "600" },
});

// Dashboard styles
const ds = StyleSheet.create({
  scroll: { paddingHorizontal: 16, paddingTop: 16 },
  banner: {
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 16,
    height: 80,
    backgroundColor: B.primary + "20",
  },
  bannerGrad: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: B.primary,
    opacity: 0.15,
  },
  bannerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
  },
  orgAvatar: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: B.primary + "30",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: B.primary + "40",
  },
  orgName: { fontSize: 16, fontWeight: "800", color: B.text, marginBottom: 2 },
  orgIndustry: { fontSize: 12, color: B.muted },
  memberBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: B.accent + "15",
    borderWidth: 1,
    borderColor: B.accent + "30",
  },
  memberText: { fontSize: 10, fontWeight: "700", color: B.accent },
  orgDetails: { gap: 12, marginBottom: 16 },
  orgDetailItem: { flexDirection: "row", alignItems: "center", gap: 10 },
  orgDetailLabel: { fontSize: 10, color: B.muted, marginBottom: 1 },
  orgDetailVal: { fontSize: 13, fontWeight: "600", color: B.text },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: B.border,
  },
  statItem: { alignItems: "center" },
  statVal: { fontSize: 22, fontWeight: "900", marginBottom: 2 },
  statLabel: { fontSize: 10, color: B.muted },
  alertCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: B.red + "10",
    borderWidth: 1,
    borderColor: B.red + "30",
    marginBottom: 14,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: B.text,
    marginBottom: 2,
  },
  alertSub: { fontSize: 12, color: B.muted },
  alertBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: B.red + "20",
    borderWidth: 1,
    borderColor: B.red + "40",
  },
  alertBadgeText: { fontSize: 9, fontWeight: "800", color: B.red },
  trendBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: B.red + "12",
    borderWidth: 1,
    borderColor: B.red + "25",
  },
  trendBadgeText: { fontSize: 11, fontWeight: "700", color: B.red },
  barTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.07)",
    overflow: "hidden",
  },
  barFill: { height: 6, borderRadius: 3 },
  issueTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.07)",
    overflow: "hidden",
  },
  issueFill: { height: 5, borderRadius: 3, backgroundColor: B.primary },
});
