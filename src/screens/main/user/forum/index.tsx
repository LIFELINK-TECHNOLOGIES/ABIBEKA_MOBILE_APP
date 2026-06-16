import React, { use, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  B,
  ORG,
  MOOD_TAGS,
  INITIAL_SOLUTIONS,
} from './constants/constant';
import type { Solution, SolutionTag, SolutionStatus } from './constants/constant';
import { SolutionsTab, NewSolutionSheet } from './components/solution';
import { NoOrgScreen } from './components/Noorg';
import {
  useForumPosts,
  useCreateForumPost,
  useVoteForumPost,
} from "../../../../api/hooks/employee/forum";
import { useAuthStore } from '../../../../store/authStore';

// ─── Forum header ─────────────────────────────────────────────────────────────
const ForumHeader = ({ activeToday }: { activeToday: number }) => {
  const Organization = useAuthStore((state) => state.user?.joinedOrganizationName);
  const Org_address = useAuthStore((state) => state.user?.location);
  const Employee_range = useAuthStore((state) => state.user?.employeeRange);
  const { t } = useTranslation();
  return (
    <View style={s.header}>
      <View style={s.orgIconWrap}>
        <Text style={{ fontSize: 18 }}>{ORG.icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.headerTitle}>{Organization}</Text>
        <Text style={s.addressText}>📍 {Org_address}</Text>
      </View>
      <View style={s.activePill}>
        <View style={s.activeDot} />
        <Text style={s.activeText}>{Employee_range}</Text>
      </View>
    </View>
  );
};

// ─── Post card ────────────────────────────────────────────────────────────────
const PostCard = ({
  post,
  onVote,
}: {
  post: {
    id: string;
    anonId: string;
    content: string;
    tags: string[];
    upvotes: number;
    downvotes: number;
    userVote: 'up' | 'down' | null;
    createdAt: string;
  };
  onVote: (id: string, dir: 'up' | 'down') => void;
}) => {
  const upScale   = useRef(new Animated.Value(1)).current;
  const downScale = useRef(new Animated.Value(1)).current;

  const vote = (dir: 'up' | 'down') => {
    const a = dir === 'up' ? upScale : downScale;
    Animated.sequence([
      Animated.spring(a, { toValue: 1.35, tension: 300, friction: 7, useNativeDriver: true }),
      Animated.spring(a, { toValue: 1,    tension: 300, friction: 7, useNativeDriver: true }),
    ]).start(() => onVote(post.id, dir));
  };

  const upActive   = post.userVote === 'up';
  const downActive = post.userVote === 'down';
  const score      = post.upvotes - post.downvotes;

  const primaryTag = post.tags[0] ?? '';
  const tagData    = MOOD_TAGS.find((t) => t.label === primaryTag);
  const tagColor   = tagData?.color ?? B.muted;

  return (
    <View style={s.postWrap}>
      <View style={s.postTop}>
        <View style={s.postAvatar}>
          <Text style={{ fontSize: 18 }}>🦊</Text>
        </View>
        <View style={{ flex: 1, gap: 3 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {primaryTag ? (
              <View
                style={[
                  s.moodTag,
                  { borderColor: tagColor + '45', backgroundColor: tagColor + '12' },
                ]}
              >
                <View style={[s.moodDot, { backgroundColor: tagColor }]} />
                <Text style={[s.moodTagText, { color: tagColor }]}>{primaryTag}</Text>
              </View>
            ) : null}
          </View>
          <Text style={s.postMeta}>{new Date(post.createdAt).toLocaleDateString()}</Text>
        </View>
      </View>

      <Text style={s.postContent}>{post.content}</Text>

      <View style={s.postActions}>
        <Animated.View style={{ transform: [{ scale: upScale }] }}>
          <Pressable
            onPress={() => vote('up')}
            style={[
              s.voteBtn,
              upActive && { backgroundColor: B.accent + '14', borderColor: B.accent + '40' },
            ]}
          >
            <Text style={s.voteEmoji}>👍</Text>
            <Text style={[s.voteCount, upActive && { color: B.accent, fontWeight: '800' }]}>
              {post.upvotes}
            </Text>
          </Pressable>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: downScale }] }}>
          <Pressable
            onPress={() => vote('down')}
            style={[
              s.voteBtn,
              downActive && { backgroundColor: B.red + '14', borderColor: B.red + '40' },
            ]}
          >
            <Text style={s.voteEmoji}>👎</Text>
            <Text style={[s.voteCount, downActive && { color: B.red, fontWeight: '800' }]}>
              {post.downvotes}
            </Text>
          </Pressable>
        </Animated.View>

        <View style={{ flex: 1 }} />
        <Text
          style={[
            s.scoreText,
            { color: score > 20 ? B.accent : score > 5 ? B.muted : B.muted2 },
          ]}
        >
          {score > 0 ? '+' : ''}{score}
        </Text>
      </View>

      <View style={s.postDivider} />
    </View>
  );
};

// ─── New post sheet ───────────────────────────────────────────────────────────
const NewPostSheet = ({
  visible,
  onClose,
  onPost,
  isPosting, // FIX 1: Accept isPosting prop to show loading state & prevent double-submit
}: {
  visible: boolean;
  onClose: () => void;
  onPost: (content: string, tag: string) => void;
  isPosting: boolean;
}) => {
  const { t } = useTranslation();
  const [content, setContent] = useState('');
  const [tag, setTag]         = useState('');
  const slide                 = useRef(new Animated.Value(700)).current;
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.spring(slide, { toValue: 0, tension: 55, friction: 13, useNativeDriver: true }).start();
    } else {
      Animated.spring(slide, { toValue: 700, tension: 55, friction: 13, useNativeDriver: true }).start(
        () => { setMounted(false); setContent(''); setTag(''); },
      );
    }
  }, [visible]);

  if (!mounted) return null;

  // FIX 2: Tag is now optional — only block submission if content is empty.
  // Previously `!tag` caused silent no-op when user hadn't picked a mood tag.
  const canSubmit = content.trim().length > 0 && !isPosting;

  const submit = () => {
    if (!canSubmit) return;
    onPost(content.trim(), tag); // tag may be empty string — backend accepts tags: []
    // FIX 3: Don't close immediately; parent closes via onSuccess so the user
    // sees a loading state rather than the sheet vanishing before the post lands.
  };

  return (
    <Animated.View style={[s.sheet, { transform: [{ translateY: slide }] }]}>
      <View style={s.sheetHandle} />

      <View style={s.sheetHeaderRow}>
        <View style={s.sheetAvatarWrap}>
          <Text style={{ fontSize: 18 }}>🦊</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.sheetTitle}>{t('forum.shareAnonymously')}</Text>
          <Text style={s.sheetSub}>{t('forum.visibleToOrgOnly', { org: ORG.name })}</Text>
        </View>
        {/* FIX 4: Disable close while posting so users can't dismiss mid-flight */}
        <Pressable onPress={isPosting ? undefined : onClose} hitSlop={12}>
          <Text style={{ fontSize: 20, color: isPosting ? B.muted2 : B.muted }}>✕</Text>
        </Pressable>
      </View>

      <View style={s.textWrap}>
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder={t('forum.postPlaceholder')}
          placeholderTextColor={B.muted2}
          multiline
          numberOfLines={5}
          style={s.textInput}
          maxLength={500} // FIX 5: Align with backend limit (was 280, backend allows 500)
          textAlignVertical="top"
          editable={!isPosting}
        />
        {/* FIX 6: Count down from 500 to match the actual backend constraint */}
        <Text style={[s.charCount, { color: content.length > 450 ? B.red : B.muted2 }]}>
          {500 - content.length}
        </Text>
      </View>

      <Text style={s.fieldLabel}>{t('forum.howAreYouFeeling')}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 18 }}>
        <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 2 }}>
          {MOOD_TAGS.map((tg, i) => (
            <Pressable
              key={i}
              onPress={() => !isPosting && setTag(tg.label === tag ? '' : tg.label)}
              style={[
                s.tagChip,
                tag === tg.label && { borderColor: tg.color, backgroundColor: tg.color + '18' },
              ]}
            >
              <Text
                style={[
                  s.tagChipText,
                  tag === tg.label && { color: tg.color, fontWeight: '700' },
                ]}
              >
                {tg.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* FIX 7: Hint only blocks on missing content, not missing tag (tag is optional) */}
      {!content.trim() && (
        <Text style={s.postHint}>{t('forum.hintContent')}</Text>
      )}

      <TouchableOpacity
        onPress={submit}
        activeOpacity={0.88}
        disabled={!canSubmit}
        style={[s.postBtn, !canSubmit && { opacity: 0.35 }]}
      >
        {/* FIX 8: Show loading text while mutation is in-flight */}
        <Text style={s.postBtnText}>
          {isPosting ? t('forum.posting') : t('forum.postToForum')}
        </Text>
      </TouchableOpacity>
      <View style={{ height: 20 }} />
    </Animated.View>
  );
};

// ─── Feed tab ─────────────────────────────────────────────────────────────────
type FeedFilter = 'all' | 'trending' | 'recent';

const FeedTab = ({
  posts,
  onVote,
  onNewPost,
}: {
  posts: {
    id: string;
    anonId: string;
    content: string;
    tags: string[];
    upvotes: number;
    downvotes: number;
    userVote: 'up' | 'down' | null;
    createdAt: string;
  }[];
  onVote: (id: string, dir: 'up' | 'down') => void;
  onNewPost: () => void;
  filter: FeedFilter;
}) => (
  <View style={{ flex: 1 }}>
    <ScrollView showsVerticalScrollIndicator={false}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onVote={onVote} />
      ))}
      <View style={{ height: 110 }} />
    </ScrollView>
    <Pressable
      onPress={onNewPost}
      style={[s.fab, { backgroundColor: B.primary, shadowColor: B.primary }]}
    >
      <Text style={{ fontSize: 20, color: '#fff' }}>✏️</Text>
    </Pressable>
  </View>
);

// ─── Main ForumScreen ─────────────────────────────────────────────────────────
export const ForumScreen = () => {
  const { t } = useTranslation();

  
  const hasOrganization = useAuthStore((state) => state.user?.organizationId !== null);
  const isOrganization = useAuthStore((state) => state.user?.role === 'ORGANIZATION');
  const role = useAuthStore((state) => state.user?.role);

  type ActiveTab = 'all' | 'trending' | 'recent' | 'solutions';
  const [activeTab, setActiveTab]             = useState<ActiveTab>('all');
  const [solutions, setSolutions]             = useState<Solution[]>(INITIAL_SOLUTIONS);
  const [showNewPost, setShowNewPost]         = useState(false);
  const [showNewSolution, setShowNewSolution] = useState(false);
  const [page]                                = useState(1);

  const tagFilter = undefined;

  const { data: postsData, isLoading: postsLoading } = useForumPosts(page, 20, tagFilter);
  const { mutate: createPost, isPending: isPosting, error}  = useCreateForumPost();
  const { mutate: votePost } = useVoteForumPost();
  
  console.log('ForumScreen render:', { postsData, isPosting, error });

  const posts = postsData?.data ?? [];

  
  if (role === 'EMPLOYEE' && !hasOrganization) {
  return (
    <View style={{ flex: 1, backgroundColor: B.bg, paddingTop: 23 }}>
      <NoOrgScreen/>
    </View>
  );
}
  
  const handleVote = (id: string, dir: 'up' | 'down') => {
    votePost({ id, type: dir });
  };

  // FIX 9: onSuccess closes the sheet — not the submit handler.
  // This way the sheet stays open with the loading state until the server confirms.
const handlePost = (content: string, tag: string) => {
  const payload = { content, tags: tag ? [tag] : [] };
  console.log('POST payload:', JSON.stringify(payload));

  createPost(payload, {
    onSuccess: () => setShowNewPost(false),
    onError: (err: unknown) => {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: unknown; status?: number } };
        console.log('400 response body:', JSON.stringify(axiosErr.response?.data));
        console.log('400 status:', axiosErr.response?.status);
      }
    },
  });
};
  const handleSolutionVote = (id: string, dir: 'up' | 'down') => {
    setSolutions((prev) =>
      prev.map((sol) => {
        if (sol.id !== id) return sol;
        return {
          ...sol,
          upvotes:
            dir === 'up'
              ? sol.upvotes + (sol.userVote === 'up' ? -1 : 1)
              : sol.upvotes - (sol.userVote === 'up' ? 1 : 0),
          downvotes:
            dir === 'down'
              ? sol.downvotes + (sol.userVote === 'down' ? -1 : 1)
              : sol.downvotes - (sol.userVote === 'down' ? 1 : 0),
          userVote: sol.userVote === dir ? null : dir,
        };
      }),
    );
  };

  const handleNewSolution = (title: string, body: string, tags: SolutionTag[]) => {
    setSolutions((prev) => [
      {
        id: `s-${Date.now()}`,
        title,
        body,
        authorLabel: ORG.name,
        authorIcon: ORG.icon,
        tags,
        status: 'open' as SolutionStatus,
        upvotes: 0,
        downvotes: 0,
        userVote: null,
        postedAt: 'just now',
        weekLabel: 'This week',
      },
      ...prev,
    ]);
  };

  const isSolutions = activeTab === 'solutions';

  const TABS: { key: ActiveTab; labelKey: string }[] = [
    { key: 'all',      labelKey: 'forum.tabAll' },
    { key: 'trending', labelKey: 'forum.tabTop' },
    { key: 'recent',   labelKey: 'forum.tabNew' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: B.bg, paddingTop: 23 }}>
      <ForumHeader activeToday={ORG.activeToday} />

      {/* ── Tab bar ── */}
      <View style={s.tabBar}>
        <View style={s.tabBarRow}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.tabBarInner}
            style={{ flex: 1 }}
          >
            {TABS.map((tab) => {
              const active = activeTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  activeOpacity={0.75}
                  onPress={() => setActiveTab(tab.key)}
                  style={[s.tabPill, active && s.tabPillActive]}
                >
                  <Text style={[s.tabPillText, active && s.tabPillTextActive]}>
                    {t(tab.labelKey)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={s.tabDivider} />

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('solutions')}
            style={[s.solTabBtn, isSolutions && s.solTabBtnActive]}
          >
            <Text style={s.solTabIcon}>✦</Text>
            <Text style={[s.solTabLabel, isSolutions && s.solTabLabelActive]}>
              {t('forum.solutionsTab')}
            </Text>
            <View style={[s.solCountBadge, isSolutions && s.solCountBadgeActive]}>
              <Text style={[s.solCountText, isSolutions && { color: '#fff' }]}>
                {solutions.filter((sol) => sol.weekLabel === 'This week').length}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Content ── */}
      {!isSolutions ? (
        postsLoading ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: B.muted }}>Loading...</Text>
          </View>
        ) : (
          <FeedTab
            posts={posts}
            onVote={handleVote}
            onNewPost={() => setShowNewPost(true)}
            filter={activeTab as FeedFilter}
          />
        )
      ) : (
        <SolutionsTab
          solutions={solutions}
          onVote={handleSolutionVote}
          isOrganization={isOrganization}
          onNewSolution={() => setShowNewSolution(true)}
        />
      )}

      {/* ── Overlays ── */}
      {(showNewPost || showNewSolution) && (
        <Pressable
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 998 },
          ]}
          // FIX 11: Don't allow backdrop dismiss while a post is being submitted
          onPress={() => {
            if (!isPosting) {
              setShowNewPost(false);
              setShowNewSolution(false);
            }
          }}
        />
      )}

      {/* FIX 12: Pass isPosting down so the sheet can reflect loading state */}
      <NewPostSheet
        visible={showNewPost}
        onClose={() => setShowNewPost(false)}
        onPost={handlePost}
        isPosting={isPosting}
      />

      <NewSolutionSheet
        visible={showNewSolution}
        onClose={() => setShowNewSolution(false)}
        onPost={handleNewSolution}
      />
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: B.border,
    backgroundColor: B.surfaceRaised,
  },
  orgIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: B.primary + '18',
    borderWidth: 1,
    borderColor: B.primary + '30',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  headerTitle:  { fontSize: 14, fontWeight: '900', color: B.text, letterSpacing: -0.3 },
  addressText:  { fontSize: 10, color: B.muted2, marginTop: 1 },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: B.accent + '10',
    borderWidth: 1,
    borderColor: B.accent + '22',
  },
  activeDot:  { width: 5, height: 5, borderRadius: 3, backgroundColor: B.accent },
  activeText: { fontSize: 10, fontWeight: '700', color: B.accent },

  // Tab bar
  tabBar:      { borderBottomWidth: 1, borderBottomColor: B.border, backgroundColor: B.bg },
  tabBarRow:   { flexDirection: 'row', alignItems: 'center', paddingRight: 10 },
  tabBarInner: { flexDirection: 'row', paddingHorizontal: 14, paddingVertical: 9, gap: 6 },
  tabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: B.surface,
    borderWidth: 1,
    borderColor: B.border,
  },
  tabPillActive:     { backgroundColor: 'rgba(15,118,110,0.18)', borderColor: 'rgba(15,118,110,0.35)' },
  tabPillText:       { fontSize: 12, fontWeight: '600', color: B.muted },
  tabPillTextActive: { color: B.accent, fontWeight: '800' },
  tabDivider:        { width: 1, height: 22, backgroundColor: B.border, marginRight: 8 },

  // Solutions tab button
  solTabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(139,92,246,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.22)',
  },
  solTabBtnActive: {
    backgroundColor: 'rgba(139,92,246,0.22)',
    borderColor: B.purple,
    shadowColor: B.purple,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  solTabIcon:          { fontSize: 13, color: B.purpleLight },
  solTabLabel:         { fontSize: 12, fontWeight: '800', color: B.purpleLight },
  solTabLabelActive:   { color: '#fff' },
  solCountBadge: {
    backgroundColor: 'rgba(139,92,246,0.25)',
    borderRadius: 7,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 16,
    alignItems: 'center',
  },
  solCountBadgeActive: { backgroundColor: '#fff' },
  solCountText:        { fontSize: 9, fontWeight: '800', color: B.purpleLight },

  // Post card
  postWrap:    { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 4, backgroundColor: B.bg },
  postTop:     { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 12 },
  postAvatar: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: B.surfaceRaised,
    borderWidth: 1,
    borderColor: B.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  moodDot:     { width: 5, height: 5, borderRadius: 3 },
  moodTagText: { fontSize: 11, fontWeight: '700' },
  trendBadge: {
    width: 22,
    height: 22,
    borderRadius: 7,
    backgroundColor: B.amber + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  postMeta:    { fontSize: 11, color: B.muted2, marginTop: 2 },
  postContent: {
    fontSize: 15,
    color: B.text,
    lineHeight: 24,
    marginLeft: 48,
    marginBottom: 14,
    letterSpacing: -0.1,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginLeft: 48,
    marginBottom: 14,
  },
  voteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: B.border,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  voteEmoji: { fontSize: 14 },
  voteCount:  { fontSize: 13, color: B.muted, fontWeight: '600' },
  scoreText:  { fontSize: 12, fontWeight: '700' },
  postDivider: { height: 1, backgroundColor: B.border, marginHorizontal: -18 },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 20,
    width: 54,
    height: 54,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
    shadowRadius: 16,
    shadowOpacity: 0.45,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },

  // Sheet
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#080D1A',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: B.border,
    padding: 20,
    zIndex: 9999,
    maxHeight: '88%',
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignSelf: 'center',
    marginBottom: 20,
  },
  sheetHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 18 },
  sheetAvatarWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: B.primary + '20',
    borderWidth: 1,
    borderColor: B.primary + '28',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetTitle: { fontSize: 15, fontWeight: '800', color: B.text },
  sheetSub:   { fontSize: 11, color: B.muted, marginTop: 2 },
  textWrap: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: B.border,
    padding: 14,
    marginBottom: 18,
  },
  textInput:  { fontSize: 15, color: B.text, minHeight: 80, lineHeight: 23 },
  charCount:  { fontSize: 11, fontWeight: '700', textAlign: 'right', marginTop: 6 },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: B.muted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  tagChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: B.border,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  tagChipText: { fontSize: 12, color: B.muted },
  postHint:    { fontSize: 12, color: B.amber, textAlign: 'center', marginBottom: 10 },
  postBtn: {
    height: 52,
    borderRadius: 15,
    backgroundColor: B.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowRadius: 14,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 3 },
  },
  postBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
});