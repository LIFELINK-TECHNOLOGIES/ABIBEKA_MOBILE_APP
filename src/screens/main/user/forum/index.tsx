import React, { useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { B, INITIAL_POSTS, MOOD_TAGS, ORG, Post } from "./constants/constant";
import { DashboardTab } from "./components/DashTab";
import { FeedTab, NewPostSheet } from "./components/FeedTab";

// ─── Forum header ─────────────────────────────────────────────────────────────
const ForumHeader = ({ activeToday }: { activeToday: number }) => (
  <View style={s.header}>
    <View style={{ flex: 1 }}>
      <Text style={s.title}>Forum</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <Text style={{ fontSize: 13 }}>{ORG.icon}</Text>
        <Text style={s.orgLabel}>{ORG.name}</Text>
      </View>
    </View>
    <View style={s.activePill}>
      <View style={s.activeDot} />
      <Text style={s.activeText}>{activeToday} active</Text>
    </View>
  </View>
);

// ─── Animated tab bar ─────────────────────────────────────────────────────────
const TabBar = ({
  activeTab,
  onSwitch,
}: {
  activeTab: "feed" | "dashboard";
  onSwitch: (tab: "feed" | "dashboard") => void;
}) => {
  const tabAnim = useRef(new Animated.Value(0)).current;

  const handleSwitch = (tab: "feed" | "dashboard") => {
    onSwitch(tab);
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
    <View style={s.tabWrap}>
      <View style={s.tabBar}>
        <Animated.View style={[s.indicator, { left: indicatorLeft }]} />
        {(["feed", "dashboard"] as const).map(tab => (
          <Pressable key={tab} onPress={() => handleSwitch(tab)} style={s.tabBtn}>
            <Text style={[s.tabText, activeTab === tab && { color: B.text, fontWeight: "700" }]}>
              {tab === "feed" ? "💬 Feed" : "📊 Dashboard"}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

// ─── ForumScreen ──────────────────────────────────────────────────────────────
export const ForumScreen = () => {
  const [posts,       setPosts]       = useState<Post[]>(INITIAL_POSTS);
  const [activeTab,   setActiveTab]   = useState<"feed" | "dashboard">("feed");
  const [showNewPost, setShowNewPost] = useState(false);

  const handleVote = (id: string, dir: "up" | "down") => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id !== id) return p;
        return {
          ...p,
          upvotes:   dir === "up"   ? p.upvotes   + (p.userVote === "up"   ? -1 : 1) : p.upvotes   - (p.userVote === "up"   ? 1 : 0),
          downvotes: dir === "down" ? p.downvotes + (p.userVote === "down" ? -1 : 1) : p.downvotes - (p.userVote === "down" ? 1 : 0),
          userVote:  p.userVote === dir ? null : dir,
        };
      })
    );
  };

  const handlePost = (content: string, tag: string) => {
    const tagData = MOOD_TAGS.find(t => t.label === tag) ?? { color: B.primary };
    setPosts(prev => [
      {
        id: String(Date.now()),
        avatar: "🦊",
        content,
        moodTag: tag,
        tagColor: tagData.color,
        upvotes: 0,
        downvotes: 0,
        date: "Today",
        time: "just now",
        userVote: null,
        trending: false,
      },
      ...prev,
    ]);
  };

  return (
    <View style={{ flex: 1 , backgroundColor: B.bg, paddingTop: 23}}>
      <ForumHeader activeToday={ORG.activeToday} />
      <TabBar activeTab={activeTab} onSwitch={setActiveTab} />

      {activeTab === "feed" ? (
        <FeedTab posts={posts} onVote={handleVote} onNewPost={() => setShowNewPost(true)} />
      ) : (
        <DashboardTab />
      )}

      {/* Backdrop */}
      {showNewPost && (
        <Pressable
          style={[StyleSheet.absoluteFillObject, { backgroundColor: "rgba(0,0,0,0.55)" }]}
          onPress={() => setShowNewPost(false)}
        />
      )}

      <NewPostSheet
        visible={showNewPost}
        orgName={ORG.name}
        onClose={() => setShowNewPost(false)}
        onPost={handlePost}
      />
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  header:     { flexDirection: "row", alignItems: "center", paddingHorizontal: 18, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: B.border },
  title:      { fontSize: 22, fontWeight: "900", color: B.text, letterSpacing: -0.5, marginBottom: 2 },
  orgLabel:   { fontSize: 12, color: B.muted },
  activePill: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 11, paddingVertical: 6, borderRadius: 20, backgroundColor: B.accent + "10", borderWidth: 1, borderColor: B.accent + "25" },
  activeDot:  { width: 6, height: 6, borderRadius: 3, backgroundColor: B.accent },
  activeText: { fontSize: 11, fontWeight: "700", color: B.accent },
  tabWrap:    { paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: B.border },
  tabBar:     { flexDirection: "row", backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 14, padding: 3, position: "relative" },
  indicator:  { position: "absolute", top: 3, width: "47%", height: "100%", borderRadius: 11, backgroundColor: B.primary + "25", borderWidth: 1, borderColor: B.primary + "35" },
  tabBtn:     { flex: 1, paddingVertical: 9, alignItems: "center" },
  tabText:    { fontSize: 13, color: B.muted, fontWeight: "600" },
});