import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import { B } from "../constants/constant";
import type { FlaggedPost } from "../../../../../api/hooks/employee/forum";

// ─── Empty state ────────────────────────────────────────────────────────────
const FlaggedEmptyState = () => {
  const { t } = useTranslation();
  const pulse = useRef(new Animated.Value(0.92)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.92,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={es.wrap}>
      <View style={es.glowOuter} />
      <Animated.View style={[es.iconWrap, { transform: [{ scale: pulse }] }]}>
        <Text style={es.iconEmoji}>🛡️</Text>
      </Animated.View>
      <Text style={es.title}>{t("forum.reviewEmptyTitle")}</Text>
      <Text style={es.body}>{t("forum.reviewEmptyBody")}</Text>
    </View>
  );
};

// ─── Flagged post card ──────────────────────────────────────────────────────
const FlaggedPostCard = ({
  post,
  onApprove,
  onReject,
  isBusy,
}: {
  post: FlaggedPost;
  onApprove: (id: string, note: string) => void;
  onReject: (id: string, note: string) => void;
  isBusy: boolean;
}) => {
  const { t } = useTranslation();
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState("");

  const confirmReject = () => {
    Alert.alert(t("forum.rejectConfirmTitle"), t("forum.rejectConfirmBody"), [
      { text: t("forum.cancel"), style: "cancel" },
      {
        text: t("forum.reject"),
        style: "destructive",
        onPress: () => onReject(post.id, note.trim()),
      },
    ]);
  };

  return (
    <View style={s.card}>
      <View style={s.cardTop}>
        <View style={s.flagBadge}>
          <Text style={s.flagBadgeText}>
            🚩 {t("forum.flagCount", { count: post.flagCount })}
          </Text>
        </View>
        <Text style={s.cardTime}>
          {new Date(post.createdAt).toLocaleDateString()}
        </Text>
      </View>

      <Text style={s.cardContent}>{post.content}</Text>

      {post.tags.length > 0 && (
        <View style={s.tagRow}>
          {post.tags.map((tag) => (
            <View key={tag} style={s.tagChip}>
              <Text style={s.tagChipText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}

      {post.flagReasons.length > 0 && (
        <View style={s.reasonsWrap}>
          <Text style={s.reasonsLabel}>
            {t("forum.reportedReasonLabel", { count: post.flagReasons.length })}
          </Text>
          {post.flagReasons.map((reason, i) => (
            <Text key={i} style={s.reasonText}>
              • {reason}
            </Text>
          ))}
        </View>
      )}

      {noteOpen && (
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder={t("forum.notePlaceholder")}
          placeholderTextColor={B.muted2}
          style={s.noteInput}
          maxLength={300}
          multiline
        />
      )}

      <View style={s.actionsRow}>
        <TouchableOpacity
          onPress={() => setNoteOpen((v) => !v)}
          activeOpacity={0.8}
          style={s.noteToggle}
        >
          <Text style={s.noteToggleText}>
            {noteOpen ? t("forum.hideNote") : t("forum.addNote")}
          </Text>
        </TouchableOpacity>

        <View style={{ flex: 1 }} />

        <TouchableOpacity
          onPress={confirmReject}
          activeOpacity={0.85}
          disabled={isBusy}
          style={[s.actionBtn, s.rejectBtn, isBusy && { opacity: 0.5 }]}
        >
          {isBusy ? (
            <ActivityIndicator size="small" color={B.red} />
          ) : (
            <Text style={s.rejectBtnText}>{t("forum.reject")}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onApprove(post.id, note.trim())}
          activeOpacity={0.85}
          disabled={isBusy}
          style={[s.actionBtn, s.approveBtn, isBusy && { opacity: 0.5 }]}
        >
          {isBusy ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={s.approveBtnText}>{t("forum.approve")}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ─── Flagged tab ────────────────────────────────────────────────────────────
export const FlaggedTab = ({
  posts,
  isLoading,
  refreshing,
  onRefresh,
  onApprove,
  onReject,
  busyPostId,
  hasMore,
  isLoadingMore,
  onLoadMore,
}: {
  posts: FlaggedPost[];
  isLoading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  onApprove: (id: string, note: string) => void;
  onReject: (id: string, note: string) => void;
  busyPostId: string | null;
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
}) => {
  const { t } = useTranslation();

  if (isLoading && posts.length === 0) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={B.accent} />
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 14, paddingTop: 14 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={B.accent}
          colors={[B.accent]}
          progressBackgroundColor={B.surfaceRaised}
        />
      }
    >
      {posts.length === 0 ? (
        <FlaggedEmptyState />
      ) : (
        posts.map((post) => (
          <FlaggedPostCard
            key={post.id}
            post={post}
            onApprove={onApprove}
            onReject={onReject}
            isBusy={busyPostId === post.id}
          />
        ))
      )}

      {hasMore && (
        <TouchableOpacity
          onPress={onLoadMore}
          activeOpacity={0.8}
          disabled={isLoadingMore}
          style={s.loadMoreBtn}
        >
          {isLoadingMore ? (
            <ActivityIndicator size="small" color={B.accent} />
          ) : (
            <Text style={s.loadMoreText}>{t("forum.loadMoreFlagged")}</Text>
          )}
        </TouchableOpacity>
      )}

      <View style={{ height: 110 }} />
    </ScrollView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────
const es = StyleSheet.create({
  wrap: { alignItems: "center", paddingTop: 60, paddingHorizontal: 30 },
  glowOuter: {
    position: "absolute",
    top: 10,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(93,202,165,0.06)",
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "rgba(93,202,165,0.1)",
    borderWidth: 1,
    borderColor: "rgba(93,202,165,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  iconEmoji: { fontSize: 26 },
  title: { fontSize: 15, fontWeight: "900", color: B.text, marginBottom: 6 },
  body: { fontSize: 12, color: B.muted, textAlign: "center", lineHeight: 18 },
});

const s = StyleSheet.create({
  card: {
    backgroundColor: B.surface,
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.18)",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  cardTop: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  flagBadge: {
    backgroundColor: "rgba(239,68,68,0.12)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.3)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  flagBadgeText: { fontSize: 11, fontWeight: "800", color: B.red },
  cardTime: { flex: 1, textAlign: "right", fontSize: 10, color: B.muted2 },
  cardContent: {
    fontSize: 14,
    color: B.text,
    lineHeight: 21,
    marginBottom: 10,
  },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 10 },
  tagChip: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: B.border,
  },
  tagChipText: { fontSize: 10, color: B.muted, fontWeight: "600" },
  reasonsWrap: {
    backgroundColor: "rgba(255,255,255,0.02)",
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  reasonsLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: B.muted2,
    letterSpacing: 0.6,
    marginBottom: 5,
  },
  reasonText: { fontSize: 12, color: B.muted, lineHeight: 18 },
  noteInput: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: B.border,
    borderRadius: 10,
    padding: 10,
    fontSize: 12,
    color: B.text,
    minHeight: 44,
    marginBottom: 10,
    textAlignVertical: "top",
  },
  actionsRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  noteToggle: { paddingVertical: 6 },
  noteToggleText: { fontSize: 11, fontWeight: "700", color: B.accent },
  actionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 78,
  },
  rejectBtn: {
    backgroundColor: "rgba(239,68,68,0.1)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.3)",
  },
  rejectBtnText: { fontSize: 12, fontWeight: "800", color: B.red },
  approveBtn: { backgroundColor: B.accent },
  approveBtnText: { fontSize: 12, fontWeight: "800", color: "#04060F" },
  loadMoreBtn: {
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: B.border,
    backgroundColor: "rgba(255,255,255,0.02)",
    marginTop: 4,
    marginBottom: 10,
  },
  loadMoreText: { fontSize: 12, fontWeight: "700", color: B.accent },
});
