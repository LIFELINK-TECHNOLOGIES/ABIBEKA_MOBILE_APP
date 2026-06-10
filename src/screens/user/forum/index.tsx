import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { B, INITIAL_POSTS, MOOD_TAGS, ORG, Post } from "./constants/constant";
import { FeedTab, NewPostSheet } from "./components/FeedTab";

// ─── Forum header ─────────────────────────────────────────────────────────────
const ForumHeader = ({ activeToday }: { activeToday: number }) => (
  <View style={s.header}>
    {/* Top row: icon + active pill */}
    <View style={s.headerTopRow}>
      <View style={s.orgIconWrap}>
        <Text style={{ fontSize: 22 }}>{ORG.icon}</Text>
      </View>
      <View style={s.activePill}>
        <View style={s.activeDot} />
        <Text style={s.activeText}>{activeToday} active</Text>
      </View>
    </View>

    {/* Company name + description */}
    <Text style={s.title}>{ORG.name}</Text>
    <Text style={s.description}>{ORG.description}</Text>

    {/* Divider */}
    <View style={s.headerDivider} />

    {/* Address row */}
    <View style={s.addressRow}>
      <Text style={s.addressIcon}>📍</Text>
      <Text style={s.addressText}>{ORG.address}</Text>
    </View>
  </View>
);

// ─── ForumScreen ──────────────────────────────────────────────────────────────
export const ForumScreen = () => {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [showNewPost, setShowNewPost] = useState(false);

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
    <View style={{ flex: 1, backgroundColor: B.bg, paddingTop: 23 }}>
      <ForumHeader activeToday={ORG.activeToday} />

      <FeedTab
        posts={posts}
        onVote={handleVote}
        onNewPost={() => setShowNewPost(true)}
      />

      {showNewPost && (
        <Pressable
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: "rgba(0,0,0,0.55)" },
          ]}
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
  header: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: B.border,
    backgroundColor: B.cardRaised ?? B.bg,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  orgIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: B.primary + "18",
    borderWidth: 1,
    borderColor: B.primary + "30",
    alignItems: "center",
    justifyContent: "center",
  },
  activePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: B.accent + "10",
    borderWidth: 1,
    borderColor: B.accent + "25",
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: B.accent,
  },
  activeText: { fontSize: 11, fontWeight: "700", color: B.accent },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: B.text,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: B.muted,
    lineHeight: 18,
  },
  headerDivider: {
    height: 1,
    backgroundColor: B.border,
    marginVertical: 12,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  addressIcon: { fontSize: 12 },
  addressText: {
    fontSize: 12,
    color: B.muted2 ?? B.muted,
    letterSpacing: 0.1,
  },
});