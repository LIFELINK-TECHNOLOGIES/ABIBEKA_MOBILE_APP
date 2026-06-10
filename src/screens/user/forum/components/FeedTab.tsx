import React, { useRef, useState } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { B, MOOD_TAGS, Post } from "../constants/constant";

// ─── Post card ────────────────────────────────────────────────────────────────
export const PostCard = ({
  post,
  onVote,
}: {
  post: Post;
  onVote: (id: string, dir: "up" | "down") => void;
}) => {
  const upScale = useRef(new Animated.Value(1)).current;
  const downScale = useRef(new Animated.Value(1)).current;

  const vote = (dir: "up" | "down") => {
    const a = dir === "up" ? upScale : downScale;
    Animated.sequence([
      Animated.spring(a, {
        toValue: 1.4,
        tension: 300,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(a, {
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
    <View style={s.postWrap}>
      <View style={s.postTop}>
        <View style={s.avatar}>
          <Text style={{ fontSize: 18 }}>{post.avatar}</Text>
        </View>
        <View style={{ flex: 1, gap: 3 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View
              style={[
                s.moodTag,
                {
                  borderColor: post.tagColor + "45",
                  backgroundColor: post.tagColor + "12",
                },
              ]}
            >
              <View style={[s.moodDot, { backgroundColor: post.tagColor }]} />
              <Text style={[s.moodTagText, { color: post.tagColor }]}>
                {post.moodTag}
              </Text>
            </View>
            {post.trending && (
              <View style={s.trendBadge}>
                <Text style={s.trendText}>🔥</Text>
              </View>
            )}
          </View>
          <Text style={s.postMeta}>
            {post.date} · {post.time}
          </Text>
        </View>
      </View>

      <Text style={s.postContent}>{post.content}</Text>

      <View style={s.postActions}>
        <Animated.View style={{ transform: [{ scale: upScale }] }}>
          <Pressable
            onPress={() => vote("up")}
            style={[
              s.voteBtn,
              upActive && {
                backgroundColor: B.accent + "14",
                borderColor: B.accent + "40",
              },
            ]}
          >
            <Text style={s.voteEmoji}>👍</Text>
            <Text
              style={[
                s.voteCount,
                upActive && { color: B.accent, fontWeight: "800" },
              ]}
            >
              {post.upvotes}
            </Text>
          </Pressable>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: downScale }] }}>
          <Pressable
            onPress={() => vote("down")}
            style={[
              s.voteBtn,
              downActive && {
                backgroundColor: B.red + "14",
                borderColor: B.red + "40",
              },
            ]}
          >
            <Text style={s.voteEmoji}>👎</Text>
            <Text
              style={[
                s.voteCount,
                downActive && { color: B.red, fontWeight: "800" },
              ]}
            >
              {post.downvotes}
            </Text>
          </Pressable>
        </Animated.View>

        <View style={{ flex: 1 }} />
        <Text
          style={[
            s.signalText,
            { color: score > 30 ? B.accent : score > 10 ? B.muted : B.muted2 },
          ]}
        >
          {score > 0 ? "+" : ""}
          {score}
        </Text>
      </View>

      <View style={s.postBorder} />
    </View>
  );
};

// ─── New post bottom sheet ────────────────────────────────────────────────────
export const NewPostSheet = ({
  visible,
  orgName,
  onClose,
  onPost,
}: {
  visible: boolean;
  orgName: string;
  onClose: () => void;
  onPost: (content: string, tag: string) => void;
}) => {
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");
  const [mounted, setMounted] = useState(visible);
  const slide = useRef(new Animated.Value(600)).current;

  React.useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.spring(slide, {
        toValue: 0,
        tension: 58,
        friction: 14,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(slide, {
        toValue: 600,
        tension: 58,
        friction: 14,
        useNativeDriver: true,
      }).start(() => {
        setMounted(false);
        setContent("");
        setTag("");
      });
    }
  }, [visible]);

  if (!mounted) return null;

  const submit = () => {
    if (!content.trim() || !tag) return;
    onPost(content.trim(), tag);
    setContent("");
    setTag("");
    onClose();
  };

  return (
    <Animated.View style={[s.sheet, { transform: [{ translateY: slide }] }]}>
      <View style={s.handle} />
      <View style={s.sheetHeader}>
        <View style={s.sheetAvatar}>
          <Text style={{ fontSize: 18 }}>🦊</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.sheetTitle}>Share Anonymously</Text>
          <Text style={s.sheetSub}>Only visible to {orgName} members</Text>
        </View>
        <Pressable onPress={onClose} hitSlop={10}>
          <Text style={{ fontSize: 20, color: B.muted }}>✕</Text>
        </Pressable>
      </View>

      <View style={s.textWrap}>
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="What's on your mind? You're anonymous here."
          placeholderTextColor={B.muted2}
          multiline
          numberOfLines={5}
          style={s.textInput}
          maxLength={280}
        />
        <Text
          style={[
            s.charCount,
            { color: content.length > 240 ? B.red : B.muted2 },
          ]}
        >
          {280 - content.length}
        </Text>
      </View>

      <Text style={s.tagLabel}>How are you feeling?</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 20 }}
      >
        <View style={{ flexDirection: "row", gap: 8, paddingHorizontal: 2 }}>
          {MOOD_TAGS.map((t, i) => (
            <Pressable
              key={i}
              onPress={() => setTag(t.label === tag ? "" : t.label)}
              style={[
                s.tagChip,
                tag === t.label && {
                  borderColor: t.color,
                  backgroundColor: t.color + "18",
                },
              ]}
            >
              <Text
                style={[
                  s.tagChipText,
                  tag === t.label && { color: t.color, fontWeight: "700" },
                ]}
              >
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View style={s.privacyRow}>
        <Text style={{ fontSize: 13 }}>🔒</Text>
        <Text style={s.privacyText}>
          Your Anon ID is shown, never your name or identity.
        </Text>
      </View>

      {(!content.trim() || !tag) && (
        <Text style={s.postHint}>
          {!content.trim() && !tag
            ? "Write something and pick a mood to post"
            : !content.trim()
              ? "Write something to post"
              : "Pick a mood tag to post"}
        </Text>
      )}

      <TouchableOpacity
        onPress={submit}
        activeOpacity={0.88}
        style={[s.postBtn, (!content.trim() || !tag) && s.postBtnDisabled]}
        disabled={!content.trim() || !tag}
      >
        <Text style={s.postBtnText}>Post to Forum</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Feed tab ─────────────────────────────────────────────────────────────────
type FilterType = "all" | "trending" | "recent";

export const FeedTab = ({
  posts,
  onVote,
  onNewPost,
}: {
  posts: Post[];
  onVote: (id: string, dir: "up" | "down") => void;
  onNewPost: () => void;
}) => {
  const [filter, setFilter] = useState<FilterType>("all");

  const sorted =
    filter === "trending"
      ? [...posts].sort(
          (a, b) => b.upvotes - b.downvotes - (a.upvotes - a.downvotes),
        )
      : posts;

  return (
    <View style={{ flex: 1 }}>
      <View style={s.filterBar}>
        {(["all", "trending", "recent"] as FilterType[]).map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setFilter(tab)}
            style={[
              s.filterBtn,
              filter === tab && {
                borderBottomWidth: 2,
                borderBottomColor: B.primary,
              },
            ]}
          >
            <Text
              style={[
                s.filterText,
                filter === tab && { color: B.text, fontWeight: "700" },
              ]}
            >
              {tab === "all"
                ? "All"
                : tab === "trending"
                  ? "🔥 Trending"
                  : "Recent"}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {sorted.map((post) => (
          <PostCard key={post.id} post={post} onVote={onVote} />
        ))}
        <View style={{ height: 120 }} />
      </ScrollView>

      <Pressable onPress={onNewPost} style={s.fab}>
        <Text style={{ fontSize: 22, color: "#fff" }}>✏️</Text>
      </Pressable>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  postWrap: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 4,
    backgroundColor: B.bg,
  },
  postTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 12,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: B.cardRaised,
    borderWidth: 1,
    borderColor: B.border,
    alignItems: "center",
    justifyContent: "center",
  },
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
  moodTagText: { fontSize: 11, fontWeight: "700" },
  trendBadge: {
    width: 22,
    height: 22,
    borderRadius: 7,
    backgroundColor: B.amber + "15",
    alignItems: "center",
    justifyContent: "center",
  },
  trendText: { fontSize: 11 },
  postMeta: { fontSize: 11, color: B.muted2, marginTop: 2 },
  postContent: {
    fontSize: 15,
    color: B.text,
    lineHeight: 24,
    marginLeft: 48,
    marginBottom: 14,
    letterSpacing: -0.1,
  },
  postActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginLeft: 48,
    marginBottom: 14,
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
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  voteEmoji: { fontSize: 14 },
  voteCount: { fontSize: 13, color: B.muted, fontWeight: "600" },
  signalText: { fontSize: 12, fontWeight: "700" },
  postBorder: { height: 1, backgroundColor: B.border, marginHorizontal: -18 },
  filterBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: B.border,
  },
  filterBtn: { flex: 1, paddingVertical: 12, alignItems: "center" },
  filterText: { fontSize: 13, color: B.muted },
  fab: {
    position: "absolute",
    bottom: 28,
    right: 20,
    width: 54,
    height: 54,
    borderRadius: 17,
    backgroundColor: B.primary,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 99,
    shadowColor: B.primary,
    shadowRadius: 16,
    shadowOpacity: 0.45,
    shadowOffset: { width: 0, height: 4 },
  },

  // FIXED: Removed marginBottom: 120, added zIndex: 9999 to jump over the bottom tab navigation bar
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#080D1A",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: B.border,
    padding: 20,
    paddingBottom: 40,
    zIndex: 99999, // High level to sit above the backdrop layout
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.12)",
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
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: B.primary + "20",
    borderWidth: 1,
    borderColor: B.primary + "28",
    alignItems: "center",
    justifyContent: "center",
  },
  sheetTitle: { fontSize: 15, fontWeight: "800", color: B.text },
  sheetSub: { fontSize: 11, color: B.muted, marginTop: 2 },
  textWrap: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: B.border,
    padding: 14,
    marginBottom: 18,
  },
  textInput: {
    fontSize: 15,
    color: B.text,
    minHeight: 80,
    textAlignVertical: "top",
    lineHeight: 23,
  },
  charCount: {
    fontSize: 11,
    fontWeight: "700",
    textAlign: "right",
    marginTop: 6,
  },
  tagLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: B.muted2,
    letterSpacing: 0.8,
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
  privacyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: B.border,
    marginBottom: 16,
  },
  privacyText: { fontSize: 12, color: B.muted, flex: 1 },
  postHint: {
    fontSize: 12,
    color: B.amber,
    textAlign: "center",
    marginBottom: 10,
  },
  postBtn: {
    height: 52,
    borderRadius: 15,
    backgroundColor: B.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: B.primary,
    shadowRadius: 14,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 3 },
  },
  postBtnDisabled: {
    height: 52,
    borderRadius: 15,
    backgroundColor: B.primary,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.35,
  },
  postBtnText: { fontSize: 16, fontWeight: "800", color: "#fff" },
});
