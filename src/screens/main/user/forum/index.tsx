import React, { useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// ─── Tokens ───────────────────────────────────────────────────────────────────
const B = {
  bg: '#04060F',
  surface: '#0F1628',
  surfaceRaised: '#141E35',
  border: 'rgba(255,255,255,0.06)',
  text: '#F0F4FF',
  muted: 'rgba(255,255,255,0.28)',
  muted2: 'rgba(255,255,255,0.18)',
  primary: '#0F766E',
  accent: '#5DCAA5',
  amber: '#F59E0B',
  red: '#EF4444',
  green: '#22C55E',
  purple: '#8B5CF6',
  purpleLight: '#A78BFA',
  blue: '#3B82F6',
};

// ─── Org config ───────────────────────────────────────────────────────────────
const ORG = {
  name: 'Acme Corp',
  icon: '🏢',
  description: 'A space to speak freely and find solutions together.',
  address: '14 Innovation Drive, Lagos, NG',
  activeToday: 31,
};

// ─── Types ────────────────────────────────────────────────────────────────────
const MOOD_TAGS = [
  { label: '😮 Surprised',  color: '#FBBF24' },
  { label: '😤 Frustrated', color: '#F87171' },
  { label: '😔 Low',        color: '#818CF8' },
  { label: '😌 Calm',       color: B.accent },
  { label: '😊 Happy',      color: B.green },
  { label: '😰 Anxious',    color: '#FB923C' },
  { label: '🔥 Burnout',    color: '#EF4444' },
  { label: '💪 Motivated',  color: '#34D399' },
];

type Post = {
  id: string;
  avatar: string;
  content: string;
  moodTag: string;
  tagColor: string;
  upvotes: number;
  downvotes: number;
  date: string;
  time: string;
  userVote: 'up' | 'down' | null;
  trending: boolean;
};

type SolutionTag = 'burnout' | 'workload' | 'culture' | 'process' | 'wellbeing' | 'communication';
type SolutionStatus = 'open' | 'in-progress' | 'adopted';

type Solution = {
  id: string;
  title: string;
  body: string;
  authorLabel: string;
  authorIcon: string;
  tags: SolutionTag[];
  status: SolutionStatus;
  upvotes: number;
  downvotes: number;
  userVote: 'up' | 'down' | null;
  postedAt: string;
  weekLabel: string;
  pinned?: boolean;
};

// ─── Config maps ──────────────────────────────────────────────────────────────
const SOL_TAG: Record<SolutionTag, { label: string; color: string; bg: string }> = {
  burnout:       { label: '🔥 Burnout',       color: '#F87171', bg: 'rgba(239,68,68,0.1)' },
  workload:      { label: '⚖️ Workload',       color: '#FBBF24', bg: 'rgba(251,191,36,0.1)' },
  culture:       { label: '🌱 Culture',        color: B.purpleLight, bg: 'rgba(139,92,246,0.1)' },
  process:       { label: '⚙️ Process',        color: '#A78BFA', bg: 'rgba(139,92,246,0.1)' },
  wellbeing:     { label: '💚 Wellbeing',      color: B.green,   bg: 'rgba(34,197,94,0.1)' },
  communication: { label: '💬 Communication',  color: '#60A5FA', bg: 'rgba(59,130,246,0.1)' },
};

const SOL_STATUS: Record<SolutionStatus, { label: string; color: string; bg: string; border: string }> = {
  open:          { label: '● Open',         color: B.purpleLight, bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.28)' },
  'in-progress': { label: '◑ In Progress',  color: '#FBBF24', bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.25)' },
  adopted:       { label: '✓ Adopted',      color: B.green,  bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.25)' },
};

// ─── Mock data ────────────────────────────────────────────────────────────────
const INITIAL_POSTS: Post[] = [
  { id: '1', avatar: '🦊', content: "Three back-to-back sprints with no retrospective. We're shipping fast but I feel like we're accumulating invisible debt — technical and emotional.", moodTag: '🔥 Burnout', tagColor: '#EF4444', upvotes: 18, downvotes: 2, date: 'Today', time: '9:14 am', userVote: null, trending: true },
  { id: '2', avatar: '🐺', content: "Honestly the no-meeting Wednesday idea changed my week completely. I finally had time to think. More of this please.", moodTag: '😊 Happy', tagColor: '#34D399', upvotes: 31, downvotes: 0, date: 'Today', time: '8:02 am', userVote: 'up', trending: true },
  { id: '3', avatar: '🦋', content: "The new async standup format saves me 45 minutes a day. Small change, big difference. Thank you to whoever pushed for it.", moodTag: '💪 Motivated', tagColor: '#34D399', upvotes: 12, downvotes: 1, date: 'Yesterday', time: '5:30 pm', userVote: null, trending: false },
  { id: '4', avatar: '🦉', content: "It's week 8 of the same issue being flagged in retros with no visible action. At some point silence from leadership feels like dismissal.", moodTag: '😤 Frustrated', tagColor: '#F87171', upvotes: 27, downvotes: 3, date: 'Yesterday', time: '2:11 pm', userVote: null, trending: true },
  { id: '5', avatar: '🐬', content: "Genuinely anxious about the reorg rumours. I know nothing's confirmed but uncertainty is draining. A short update from anyone would help.", moodTag: '😰 Anxious', tagColor: '#FB923C', upvotes: 22, downvotes: 1, date: 'Mon', time: '11:44 am', userVote: null, trending: false },
];

const INITIAL_SOLUTIONS: Solution[] = [
  {
    id: 's1',
    title: 'No-meeting Wednesdays — now official',
    body: 'After reviewing pulse data and employee feedback, we are officially introducing Wednesday as a protected deep-work day. No recurring meetings can be scheduled on Wednesdays starting next month. One-off critical syncs need approval from a manager.',
    authorLabel: 'Leadership', authorIcon: '👔',
    tags: ['burnout', 'workload'],
    status: 'adopted',
    upvotes: 48, downvotes: 3, userVote: null,
    postedAt: '3d ago', weekLabel: 'This week', pinned: true,
  },
  {
    id: 's2',
    title: 'Async standups replacing daily 9am call',
    body: 'Effective immediately, the Engineering daily standup moves to async format via a shared channel. Post your update before 10am. Live syncs happen Tuesdays only. This directly addresses the feedback about cognitive overhead from early-morning calls.',
    authorLabel: 'Engineering Leadership', authorIcon: '💻',
    tags: ['process', 'wellbeing'],
    status: 'adopted',
    upvotes: 39, downvotes: 1, userVote: 'up',
    postedAt: '5d ago', weekLabel: 'This week',
  },
  {
    id: 's3',
    title: 'Reorg update — what we can share now',
    body: 'We hear the anxiety about structural changes. Here is what is confirmed: no team eliminations. We are adding two new roles in Engineering and expanding the Design team. Final structure will be announced in the all-hands on the 20th. We are committed to no surprises.',
    authorLabel: 'CEO Office', authorIcon: '🏢',
    tags: ['culture', 'communication'],
    status: 'open',
    upvotes: 34, downvotes: 5, userVote: null,
    postedAt: '1d ago', weekLabel: 'This week',
  },
  {
    id: 's4',
    title: 'Flexible start window: 7am–10am, no penalty',
    body: 'Starting next quarter, all employees may begin their day anytime between 7am and 10am. Core hours (10am–4pm) remain unchanged. This addresses caregiver scheduling and commute stress. HR will send updated policy documentation this week.',
    authorLabel: 'HR Team', authorIcon: '🤝',
    tags: ['wellbeing', 'workload'],
    status: 'in-progress',
    upvotes: 29, downvotes: 2, userVote: null,
    postedAt: '2d ago', weekLabel: 'This week',
  },
  {
    id: 's5',
    title: 'Monthly anonymous pulse summary — now public',
    body: 'From next month, anonymised pulse summaries will be shared with all org members at the end of each month. You will see team-level trends, not individual data. This is a direct response to feedback asking for more transparency.',
    authorLabel: 'Leadership', authorIcon: '👔',
    tags: ['culture', 'communication'],
    status: 'open',
    upvotes: 21, downvotes: 0, userVote: null,
    postedAt: '6d ago', weekLabel: 'Last week',
  },
];

// ─── Shared: Forum header (slim single row) ───────────────────────────────────
const ForumHeader = ({ activeToday }: { activeToday: number }) => (
  <View style={s.header}>
    <View style={s.orgIconWrap}>
      <Text style={{ fontSize: 18 }}>{ORG.icon}</Text>
    </View>
    <View style={{ flex: 1 }}>
      <Text style={s.title}>{ORG.name}</Text>
      <Text style={s.addressText}>📍 {ORG.address}</Text>
    </View>
    <View style={s.activePill}>
      <View style={s.activeDot} />
      <Text style={s.activeText}>{activeToday} active</Text>
    </View>
  </View>
);

// ─── Feed: Post card ──────────────────────────────────────────────────────────
const PostCard = ({ post, onVote }: { post: Post; onVote: (id: string, dir: 'up' | 'down') => void }) => {
  const upScale = useRef(new Animated.Value(1)).current;
  const downScale = useRef(new Animated.Value(1)).current;

  const vote = (dir: 'up' | 'down') => {
    const a = dir === 'up' ? upScale : downScale;
    Animated.sequence([
      Animated.spring(a, { toValue: 1.35, tension: 300, friction: 7, useNativeDriver: true }),
      Animated.spring(a, { toValue: 1, tension: 300, friction: 7, useNativeDriver: true }),
    ]).start(() => onVote(post.id, dir));
  };

  const upActive = post.userVote === 'up';
  const downActive = post.userVote === 'down';
  const score = post.upvotes - post.downvotes;

  return (
    <View style={s.postWrap}>
      <View style={s.postTop}>
        <View style={s.postAvatar}>
          <Text style={{ fontSize: 18 }}>{post.avatar}</Text>
        </View>
        <View style={{ flex: 1, gap: 3 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={[s.moodTag, { borderColor: post.tagColor + '45', backgroundColor: post.tagColor + '12' }]}>
              <View style={[s.moodDot, { backgroundColor: post.tagColor }]} />
              <Text style={[s.moodTagText, { color: post.tagColor }]}>{post.moodTag}</Text>
            </View>
            {post.trending && (
              <View style={s.trendBadge}>
                <Text style={{ fontSize: 11 }}>🔥</Text>
              </View>
            )}
          </View>
          <Text style={s.postMeta}>{post.date} · {post.time}</Text>
        </View>
      </View>

      <Text style={s.postContent}>{post.content}</Text>

      <View style={s.postActions}>
        <Animated.View style={{ transform: [{ scale: upScale }] }}>
          <Pressable
            onPress={() => vote('up')}
            style={[s.voteBtn, upActive && { backgroundColor: B.accent + '14', borderColor: B.accent + '40' }]}
          >
            <Text style={s.voteEmoji}>👍</Text>
            <Text style={[s.voteCount, upActive && { color: B.accent, fontWeight: '800' }]}>{post.upvotes}</Text>
          </Pressable>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: downScale }] }}>
          <Pressable
            onPress={() => vote('down')}
            style={[s.voteBtn, downActive && { backgroundColor: B.red + '14', borderColor: B.red + '40' }]}
          >
            <Text style={s.voteEmoji}>👎</Text>
            <Text style={[s.voteCount, downActive && { color: B.red, fontWeight: '800' }]}>{post.downvotes}</Text>
          </Pressable>
        </Animated.View>

        <View style={{ flex: 1 }} />
        <Text style={[s.scoreText, { color: score > 20 ? B.accent : score > 5 ? B.muted : B.muted2 }]}>
          {score > 0 ? '+' : ''}{score}
        </Text>
      </View>

      <View style={s.postDivider} />
    </View>
  );
};

// ─── Feed: New post bottom sheet ──────────────────────────────────────────────
const NewPostSheet = ({
  visible, onClose, onPost,
}: {
  visible: boolean;
  onClose: () => void;
  onPost: (content: string, tag: string) => void;
}) => {
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('');
  const slide = useRef(new Animated.Value(700)).current;
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.spring(slide, { toValue: 0, tension: 55, friction: 13, useNativeDriver: true }).start();
    } else {
      Animated.spring(slide, { toValue: 700, tension: 55, friction: 13, useNativeDriver: true })
        .start(() => { setMounted(false); setContent(''); setTag(''); });
    }
  }, [visible]);

  if (!mounted) return null;

  const submit = () => {
    if (!content.trim() || !tag) return;
    onPost(content.trim(), tag);
    onClose();
  };

  return (
    <Animated.View style={[s.sheet, { transform: [{ translateY: slide }] }]}>
      <View style={s.sheetHandle} />

      <View style={s.sheetHeaderRow}>
        <View style={s.sheetAvatarWrap}>
          <Text style={{ fontSize: 18 }}>🦊</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.sheetTitle}>Share anonymously</Text>
          <Text style={s.sheetSub}>🔒 Only visible to {ORG.name} members · your identity is hidden</Text>
        </View>
        <Pressable onPress={onClose} hitSlop={12}>
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
          textAlignVertical="top"
        />
        <Text style={[s.charCount, { color: content.length > 240 ? B.red : B.muted2 }]}>
          {280 - content.length}
        </Text>
      </View>

      <Text style={s.tagLabel}>How are you feeling?</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 18 }}>
        <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 2 }}>
          {MOOD_TAGS.map((t, i) => (
            <Pressable
              key={i}
              onPress={() => setTag(t.label === tag ? '' : t.label)}
              style={[s.tagChip, tag === t.label && { borderColor: t.color, backgroundColor: t.color + '18' }]}
            >
              <Text style={[s.tagChipText, tag === t.label && { color: t.color, fontWeight: '700' }]}>
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {(!content.trim() || !tag) && (
        <Text style={s.postHint}>
          {!content.trim() && !tag ? 'Write something and pick a mood to post'
            : !content.trim() ? 'Write something to post'
            : 'Pick a mood tag to post'}
        </Text>
      )}

      <TouchableOpacity
        onPress={submit}
        activeOpacity={0.88}
        style={[s.postBtn, (!content.trim() || !tag) && { opacity: 0.35 }]}
      >
        <Text style={s.postBtnText}>Post to Forum</Text>
      </TouchableOpacity>
      <View style={{ height: 20 }} />
    </Animated.View>
  );
};

// ─── Feed tab ─────────────────────────────────────────────────────────────────
type FeedFilter = 'all' | 'trending' | 'recent';

const FeedTab = ({
  posts, onVote, onNewPost,
}: {
  posts: Post[];
  onVote: (id: string, dir: 'up' | 'down') => void;
  onNewPost: () => void;
  filter: FeedFilter;
}) => {
  const sorted = [...posts];

  return (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {sorted.map(post => (
          <PostCard key={post.id} post={post} onVote={onVote} />
        ))}
        <View style={{ height: 110 }} />
      </ScrollView>
      <Pressable onPress={onNewPost} style={[s.fab, { backgroundColor: B.primary, shadowColor: B.primary }]}>
        <Text style={{ fontSize: 20, color: '#fff' }}>✏️</Text>
      </Pressable>
    </View>
  );
};

// ─── Solutions: Vote bar ──────────────────────────────────────────────────────
const SolutionVoteBar = ({
  solution, onVote,
}: {
  solution: Solution;
  onVote: (id: string, dir: 'up' | 'down') => void;
}) => {
  const upScale = useRef(new Animated.Value(1)).current;
  const downScale = useRef(new Animated.Value(1)).current;

  const vote = (dir: 'up' | 'down') => {
    const a = dir === 'up' ? upScale : downScale;
    Animated.sequence([
      Animated.spring(a, { toValue: 1.4, tension: 300, friction: 7, useNativeDriver: true }),
      Animated.spring(a, { toValue: 1, tension: 300, friction: 7, useNativeDriver: true }),
    ]).start(() => onVote(solution.id, dir));
  };

  const total = solution.upvotes + solution.downvotes;
  const upPct = total > 0 ? (solution.upvotes / total) * 100 : 50;
  const upActive = solution.userVote === 'up';
  const downActive = solution.userVote === 'down';

  return (
    <View style={s.solVoteWrap}>
      {/* Split approval bar — purple left, red right */}
      <View style={s.splitBarTrack}>
        <View style={[s.splitBarUp, { width: `${upPct}%` as any }]} />
        <View style={[s.splitBarDown, { width: `${100 - upPct}%` as any }]} />
      </View>
      <View style={s.solVoteRow}>
        <Animated.View style={{ transform: [{ scale: upScale }] }}>
          <Pressable onPress={() => vote('up')} style={[s.solVoteBtn, upActive && s.solVoteBtnUpActive]}>
            <Text style={{ fontSize: 14 }}>👍</Text>
            <Text style={[s.solVoteNum, upActive && { color: B.purpleLight }]}>{solution.upvotes}</Text>
          </Pressable>
        </Animated.View>
        <Animated.View style={{ transform: [{ scale: downScale }] }}>
          <Pressable onPress={() => vote('down')} style={[s.solVoteBtn, downActive && s.solVoteBtnDownActive]}>
            <Text style={{ fontSize: 14 }}>👎</Text>
            <Text style={[s.solVoteNum, downActive && { color: B.red }]}>{solution.downvotes}</Text>
          </Pressable>
        </Animated.View>
        <View style={{ flex: 1 }} />
        <View style={s.approvalPill}>
          <Text style={s.approvalPct}>{Math.round(upPct)}%</Text>
          <Text style={s.approvalLabel}> approval</Text>
        </View>
      </View>
    </View>
  );
};

// ─── Solutions: Card ──────────────────────────────────────────────────────────
const SolutionCard = ({
  solution, onVote,
}: {
  solution: Solution;
  onVote: (id: string, dir: 'up' | 'down') => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const status = SOL_STATUS[solution.status];
  const accentColor = solution.tags[0] ? SOL_TAG[solution.tags[0]].color : B.purpleLight;

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      style={[s.solCard, { borderLeftColor: accentColor + '80' }, solution.pinned && s.solCardPinned]}
      onPress={() => setExpanded(e => !e)}
    >
      {solution.pinned && (
        <View style={s.pinnedBar}>
          <Text style={s.pinnedText}>📌 Pinned · official org response</Text>
        </View>
      )}

      {/* Author + status row */}
      <View style={s.solCardTop}>
        <View style={[s.solAuthorIcon, { backgroundColor: accentColor + '18', borderColor: accentColor + '35' }]}>
          <Text style={{ fontSize: 14 }}>{solution.authorIcon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.solAuthorLabel}>{solution.authorLabel}</Text>
        </View>
        <Text style={s.solTime}>{solution.postedAt}</Text>
        <View style={[s.solStatusBadge, { backgroundColor: status.bg, borderColor: status.border }]}>
          <Text style={[s.solStatusText, { color: status.color }]}>{status.label}</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={s.solTitle}>{solution.title}</Text>

      {/* Body — collapsible */}
      <Text style={s.solBody} numberOfLines={expanded ? undefined : 2}>{solution.body}</Text>
      <Text style={[s.expandToggle, { color: accentColor }]}>
        {expanded ? '↑ show less' : '↓ read more'}
      </Text>

      {/* Tags row */}
      <View style={s.solTags}>
        {solution.tags.map(tag => {
          const cfg = SOL_TAG[tag];
          return (
            <View key={tag} style={[s.solTagChip, { backgroundColor: cfg.bg, borderColor: cfg.color + '30' }]}>
              <Text style={[s.solTagText, { color: cfg.color }]}>{cfg.label}</Text>
            </View>
          );
        })}
      </View>

      {/* Vote bar */}
      <SolutionVoteBar solution={solution} onVote={onVote} />
    </TouchableOpacity>
  );
};

// ─── Solutions: Leaderboard / Podium ──────────────────────────────────────────
const PODIUM_COLORS = [
  { medal: '🥇', color: '#FBBF24', glow: 'rgba(251,191,36,0.35)', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.4)', label: 'GOLD' },
  { medal: '🥈', color: '#CBD5E1', glow: 'rgba(203,213,225,0.2)', bg: 'rgba(203,213,225,0.07)', border: 'rgba(203,213,225,0.25)', label: 'SILVER' },
  { medal: '🥉', color: '#FB923C', glow: 'rgba(251,146,60,0.2)', bg: 'rgba(251,146,60,0.08)', border: 'rgba(251,146,60,0.28)', label: 'BRONZE' },
];

const Leaderboard = ({ solutions }: { solutions: Solution[] }) => {
  const top3 = solutions
    .filter(s => s.weekLabel === 'This week')
    .sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))
    .slice(0, 3);

  if (top3.length === 0) return null;

  // Reorder visually: 2nd, 1st, 3rd for podium effect
  const order = top3.length === 3 ? [1, 0, 2] : top3.map((_, i) => i);

  return (
    <View style={s.lbWrap}>
      {/* Glow backdrop */}
      <View style={s.lbGlowTop} />

      {/* Header */}
      <View style={s.lbHeader}>
        <View style={s.lbHeaderIconWrap}>
          <Text style={s.lbHeaderEmoji}>🏆</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.lbHeaderTitle}>This Week's Champions</Text>
          <Text style={s.lbHeaderSub}>Ranked by employee approval · resets Monday</Text>
        </View>
      </View>

      {/* Podium cards */}
      <View style={s.podiumRow}>
        {order.map((idx) => {
          const sol = top3[idx];
          if (!sol) return <View key={idx} style={{ flex: 1 }} />;
          const pd = PODIUM_COLORS[idx];
          const total = sol.upvotes + sol.downvotes;
          const pct = total > 0 ? Math.round((sol.upvotes / total) * 100) : 0;
          const isFirst = idx === 0;
          return (
            <View
              key={sol.id}
              style={[
                s.podiumCard,
                { borderColor: pd.border, backgroundColor: pd.bg },
                isFirst && s.podiumCardFirst,
                isFirst && { shadowColor: pd.color, shadowOpacity: 0.5, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 10 },
              ]}
            >
              {/* Medal + rank label */}
              <View style={s.podiumTop}>
                <Text style={[s.podiumMedal, isFirst && { fontSize: 28 }]}>{pd.medal}</Text>
                <Text style={[s.podiumRankLabel, { color: pd.color }]}>{pd.label}</Text>
              </View>

              {/* Big score */}
              <Text style={[s.podiumPct, { color: pd.color }, isFirst && { fontSize: 30 }]}>
                {pct}<Text style={s.podiumPctSuffix}>%</Text>
              </Text>
              <Text style={s.podiumApproval}>approval</Text>

              {/* Approval bar */}
              <View style={s.podiumBarTrack}>
                <View style={[s.podiumBarFill, { width: `${pct}%` as any, backgroundColor: pd.color }]} />
              </View>

              {/* Title */}
              <Text style={s.podiumTitle} numberOfLines={3}>{sol.title}</Text>
              <Text style={[s.podiumAuthor, { color: pd.color }]}>{sol.authorLabel}</Text>

              {/* Vote tally */}
              <View style={s.podiumVotes}>
                <Text style={s.podiumVoteNum}>👍 {sol.upvotes}</Text>
                <Text style={s.podiumVoteNum}>👎 {sol.downvotes}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

// ─── Solutions: New solution sheet (org only) ─────────────────────────────────
const NewSolutionSheet = ({
  visible, onClose, onPost,
}: {
  visible: boolean;
  onClose: () => void;
  onPost: (title: string, body: string, tags: SolutionTag[]) => void;
}) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedTags, setSelectedTags] = useState<SolutionTag[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<SolutionStatus>('open');
  const slide = useRef(new Animated.Value(700)).current;
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.spring(slide, { toValue: 0, tension: 55, friction: 13, useNativeDriver: true }).start();
    } else {
      Animated.spring(slide, { toValue: 700, tension: 55, friction: 13, useNativeDriver: true })
        .start(() => { setMounted(false); setTitle(''); setBody(''); setSelectedTags([]); });
    }
  }, [visible]);

  if (!mounted) return null;

  const canSubmit = title.trim().length > 5 && body.trim().length > 20;

  const submit = () => {
    if (!canSubmit) return;
    onPost(title.trim(), body.trim(), selectedTags);
    onClose();
  };

  return (
    <Animated.View style={[s.sheet, { transform: [{ translateY: slide }] }]}>
      <View style={s.sheetHandle} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={s.sheetHeaderRow}>
            <View style={[s.sheetAvatarWrap, { backgroundColor: B.purple + '20', borderColor: B.purple + '30' }]}>
              <Text style={{ fontSize: 18 }}>📋</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.sheetTitle}>Post a solution</Text>
              <Text style={s.sheetSub}>Visible to all org members · signed as {ORG.name}</Text>
            </View>
            <Pressable onPress={onClose} hitSlop={12}>
              <Text style={{ fontSize: 20, color: B.muted }}>✕</Text>
            </Pressable>
          </View>

          <Text style={s.tagLabel}>TITLE</Text>
          <View style={s.textWrap}>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="What issue does this address?"
              placeholderTextColor={B.muted2}
              style={[s.textInput, { minHeight: 0 }]}
              maxLength={100}
            />
          </View>

          <Text style={[s.tagLabel, { marginTop: 12 }]}>SOLUTION DETAILS</Text>
          <View style={s.textWrap}>
            <TextInput
              value={body}
              onChangeText={setBody}
              placeholder="Describe the problem and exactly what you are doing about it..."
              placeholderTextColor={B.muted2}
              multiline
              numberOfLines={6}
              style={s.textInput}
              maxLength={600}
              textAlignVertical="top"
            />
            <Text style={[s.charCount, { color: body.length > 560 ? B.red : B.muted2 }]}>
              {600 - body.length}
            </Text>
          </View>

          <Text style={[s.tagLabel, { marginTop: 12 }]}>TAG THE ISSUE</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 14 }}>
            {(Object.keys(SOL_TAG) as SolutionTag[]).map(tag => {
              const cfg = SOL_TAG[tag];
              const active = selectedTags.includes(tag);
              return (
                <Pressable
                  key={tag}
                  onPress={() => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
                  style={[s.tagChip, active && { borderColor: cfg.color, backgroundColor: cfg.bg }]}
                >
                  <Text style={[s.tagChipText, active && { color: cfg.color, fontWeight: '700' }]}>
                    {cfg.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={[s.tagLabel, { marginTop: 4 }]}>STATUS</Text>
          <View style={{ flexDirection: 'row', gap: 7, marginBottom: 20 }}>
            {(Object.keys(SOL_STATUS) as SolutionStatus[]).map(st => {
              const cfg = SOL_STATUS[st];
              const active = selectedStatus === st;
              return (
                <Pressable
                  key={st}
                  onPress={() => setSelectedStatus(st)}
                  style={[s.tagChip, active && { borderColor: cfg.border, backgroundColor: cfg.bg }]}
                >
                  <Text style={[s.tagChipText, active && { color: cfg.color, fontWeight: '700' }]}>
                    {cfg.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <TouchableOpacity
            onPress={submit}
            activeOpacity={0.88}
            style={[s.postBtn, { backgroundColor: B.purple, shadowColor: B.purple }, !canSubmit && { opacity: 0.35 }]}
          >
            <Text style={s.postBtnText}>Post solution</Text>
          </TouchableOpacity>
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

// ─── Solutions tab ────────────────────────────────────────────────────────────
const SolutionsTab = ({
  solutions, onVote, isOrganization, onNewSolution,
}: {
  solutions: Solution[];
  onVote: (id: string, dir: 'up' | 'down') => void;
  isOrganization: boolean;
  onNewSolution: () => void;
}) => {
  const thisWeek = solutions.filter(s => s.weekLabel === 'This week');
  const lastWeek = solutions.filter(s => s.weekLabel === 'Last week');

  return (
    <View style={{ flex: 1 }}>
      {/* Solutions hero banner — establishes distinct identity */}
      <View style={s.solHero}>
        <View style={s.solHeroGlow} />
        <View style={s.solHeroIconWrap}>
          <Text style={{ fontSize: 22 }}>✦</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.solHeroTitle}>Official Solutions</Text>
          <Text style={s.solHeroSub}>
            {isOrganization
              ? 'Respond to feedback with real action — only your org can post here'
              : `Direct responses from ${ORG.name} leadership to issues raised this week`}
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {!isOrganization && (
          <View style={s.readOnlyBanner}>
            <Text style={{ fontSize: 14 }}>👁️</Text>
            <Text style={s.readOnlyText}>
              Solutions are posted by {ORG.name} leadership. You can vote to show support.
            </Text>
          </View>
        )}

        <Leaderboard solutions={solutions} />

        {/* This week */}
        {thisWeek.length > 0 && (
          <>
            <View style={s.weekLabel}>
              <View style={[s.weekDot, { backgroundColor: B.purpleLight }]} />
              <Text style={[s.weekLabelText, { color: B.purpleLight }]}>This week · {thisWeek.length} solutions</Text>
            </View>
            {thisWeek
              .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
              .map(sol => (
                <SolutionCard key={sol.id} solution={sol} onVote={onVote} />
              ))}
          </>
        )}

        {/* Last week */}
        {lastWeek.length > 0 && (
          <>
            <View style={[s.weekLabel, { marginTop: 6 }]}>
              <View style={[s.weekDot, { backgroundColor: B.muted }]} />
              <Text style={[s.weekLabelText, { color: B.muted }]}>Last week · {lastWeek.length} solutions</Text>
            </View>
            {lastWeek.map(sol => (
              <SolutionCard key={sol.id} solution={sol} onVote={onVote} />
            ))}
          </>
        )}

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Org-only FAB — write a solution */}
      {isOrganization && (
        <Pressable onPress={onNewSolution} style={[s.fab, { backgroundColor: B.purple, shadowColor: B.purple }]}>
          <Text style={{ fontSize: 20, color: '#fff' }}>📋</Text>
        </Pressable>
      )}
    </View>
  );
};

// ─── Main ForumScreen ─────────────────────────────────────────────────────────
export const ForumScreen = () => {
  type ActiveTab = 'all' | 'trending' | 'recent' | 'solutions';
  const [activeTab, setActiveTab] = useState<ActiveTab>('all');
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [solutions, setSolutions] = useState<Solution[]>(INITIAL_SOLUTIONS);
  const [showNewPost, setShowNewPost] = useState(false);
  const [showNewSolution, setShowNewSolution] = useState(false);

  // Toggle this (or wire to real auth/role data) to control who can post solutions
  const isOrganization = true;

  const handleVote = (id: string, dir: 'up' | 'down') => {
    setPosts(prev => prev.map(p => {
      if (p.id !== id) return p;
      return {
        ...p,
        upvotes: dir === 'up' ? p.upvotes + (p.userVote === 'up' ? -1 : 1) : p.upvotes - (p.userVote === 'up' ? 1 : 0),
        downvotes: dir === 'down' ? p.downvotes + (p.userVote === 'down' ? -1 : 1) : p.downvotes - (p.userVote === 'down' ? 1 : 0),
        userVote: p.userVote === dir ? null : dir,
      };
    }));
  };

  const handlePost = (content: string, tag: string) => {
    const tagData = MOOD_TAGS.find(t => t.label === tag) ?? { color: B.primary };
    setPosts(prev => [{
      id: String(Date.now()), avatar: '🦊', content, moodTag: tag,
      tagColor: tagData.color, upvotes: 0, downvotes: 0,
      date: 'Today', time: 'just now', userVote: null, trending: false,
    }, ...prev]);
  };

  const handleSolutionVote = (id: string, dir: 'up' | 'down') => {
    setSolutions(prev => prev.map(sol => {
      if (sol.id !== id) return sol;
      return {
        ...sol,
        upvotes: dir === 'up' ? sol.upvotes + (sol.userVote === 'up' ? -1 : 1) : sol.upvotes - (sol.userVote === 'up' ? 1 : 0),
        downvotes: dir === 'down' ? sol.downvotes + (sol.userVote === 'down' ? -1 : 1) : sol.downvotes - (sol.userVote === 'down' ? 1 : 0),
        userVote: sol.userVote === dir ? null : dir,
      };
    }));
  };

  const handleNewSolution = (title: string, body: string, tags: SolutionTag[]) => {
    setSolutions(prev => [{
      id: `s-${Date.now()}`, title, body,
      authorLabel: ORG.name, authorIcon: ORG.icon,
      tags, status: 'open' as SolutionStatus,
      upvotes: 0, downvotes: 0, userVote: null,
      postedAt: 'just now', weekLabel: 'This week',
    }, ...prev]);
  };

  const isSolutions = activeTab === 'solutions';

  const TABS: { key: ActiveTab; label: string }[] = [
    { key: 'all',       label: 'All' },
    { key: 'trending',  label: '🔥 Top' },
    { key: 'recent',    label: '🕐 New' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: B.bg, paddingTop: 23 }}>
      <ForumHeader activeToday={ORG.activeToday} />

      {/* ── Tab row: forum pills + separated Solutions tab ── */}
      <View style={s.tabBar}>
        <View style={s.tabBarRow}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.tabBarInner}
            style={{ flex: 1 }}
          >
            {TABS.map(tab => {
              const active = activeTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  activeOpacity={0.75}
                  onPress={() => setActiveTab(tab.key)}
                  style={[s.tabPill, active && s.tabPillActive]}
                >
                  <Text style={[s.tabPillText, active && s.tabPillTextActive]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Vertical divider separating categories from the Solutions destination */}
          <View style={s.tabDivider} />

          {/* Solutions — standalone destination, not a feed filter */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('solutions')}
            style={[s.solTabBtn, isSolutions && s.solTabBtnActive]}
          >
            <Text style={s.solTabIcon}>✦</Text>
            <Text style={[s.solTabLabel, isSolutions && s.solTabLabelActive]}>Solutions</Text>
            <View style={[s.solCountBadge, isSolutions && s.solCountBadgeActive]}>
              <Text style={[s.solCountText, isSolutions && { color: '#fff' }]}>
                {solutions.filter(s => s.weekLabel === 'This week').length}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {!isSolutions ? (
        <FeedTab
          posts={posts}
          onVote={handleVote}
          onNewPost={() => setShowNewPost(true)}
          filter={activeTab as FeedFilter}
        />
      ) : (
        <SolutionsTab
          solutions={solutions}
          onVote={handleSolutionVote}
          isOrganization={isOrganization}
          onNewSolution={() => setShowNewSolution(true)}
        />
      )}

      {/* Overlays */}
      {(showNewPost || showNewSolution) && (
        <Pressable
          style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 998 }]}
          onPress={() => { setShowNewPost(false); setShowNewSolution(false); }}
        />
      )}

      <NewPostSheet
        visible={showNewPost}
        onClose={() => setShowNewPost(false)}
        onPost={handlePost}
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
  // Header — slim single row
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
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: B.primary + '18', borderWidth: 1, borderColor: B.primary + '30',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  title: { fontSize: 14, fontWeight: '900', color: B.text, letterSpacing: -0.3 },
  addressText: { fontSize: 10, color: B.muted2, marginTop: 1 },
  activePill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 9, paddingVertical: 5, borderRadius: 20,
    backgroundColor: B.accent + '10', borderWidth: 1, borderColor: B.accent + '22',
  },
  activeDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: B.accent },
  activeText: { fontSize: 10, fontWeight: '700', color: B.accent },

  // Tab bar
  tabBar: {
    borderBottomWidth: 1,
    borderBottomColor: B.border,
    backgroundColor: B.bg,
  },
  tabBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  tabBarInner: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 9,
    gap: 6,
  },
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
  tabPillActive: {
    backgroundColor: 'rgba(15,118,110,0.18)',
    borderColor: 'rgba(15,118,110,0.35)',
  },
  tabPillText: { fontSize: 12, fontWeight: '600', color: B.muted },
  tabPillTextActive: { color: B.accent, fontWeight: '800' },

  // Divider before Solutions destination
  tabDivider: {
    width: 1, height: 22,
    backgroundColor: B.border,
    marginRight: 8,
  },

  // Solutions tab — distinct standalone destination styling
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
  solTabIcon: { fontSize: 13, color: B.purpleLight },
  solTabLabel: { fontSize: 12, fontWeight: '800', color: B.purpleLight },
  solTabLabelActive: { color: '#fff' },
  solCountBadge: {
    backgroundColor: 'rgba(139,92,246,0.25)',
    borderRadius: 7, paddingHorizontal: 5, paddingVertical: 1,
    minWidth: 16, alignItems: 'center',
  },
  solCountBadgeActive: { backgroundColor: '#fff' },
  solCountText: { fontSize: 9, fontWeight: '800', color: B.purpleLight },

  // Post card
  postWrap: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 4, backgroundColor: B.bg },
  postTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 12 },
  postAvatar: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: B.surfaceRaised, borderWidth: 1, borderColor: B.border,
    alignItems: 'center', justifyContent: 'center',
  },
  moodTag: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 9, paddingVertical: 4, borderRadius: 20, borderWidth: 1,
  },
  moodDot: { width: 5, height: 5, borderRadius: 3 },
  moodTagText: { fontSize: 11, fontWeight: '700' },
  trendBadge: {
    width: 22, height: 22, borderRadius: 7,
    backgroundColor: B.amber + '15', alignItems: 'center', justifyContent: 'center',
  },
  postMeta: { fontSize: 11, color: B.muted2, marginTop: 2 },
  postContent: { fontSize: 15, color: B.text, lineHeight: 24, marginLeft: 48, marginBottom: 14, letterSpacing: -0.1 },
  postActions: { flexDirection: 'row', alignItems: 'center', gap: 10, marginLeft: 48, marginBottom: 14 },
  voteBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20,
    borderWidth: 1, borderColor: B.border, backgroundColor: 'rgba(255,255,255,0.02)',
  },
  voteEmoji: { fontSize: 14 },
  voteCount: { fontSize: 13, color: B.muted, fontWeight: '600' },
  scoreText: { fontSize: 12, fontWeight: '700' },
  postDivider: { height: 1, backgroundColor: B.border, marginHorizontal: -18 },

  // FAB
  fab: {
    position: 'absolute', bottom: 28, right: 20,
    width: 54, height: 54, borderRadius: 17,
    alignItems: 'center', justifyContent: 'center',
    zIndex: 99,
    shadowRadius: 16, shadowOpacity: 0.45, shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },

  // Sheet
  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#080D1A',
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    borderWidth: 1, borderColor: B.border,
    padding: 20, zIndex: 9999,
    maxHeight: '88%',
  },
  sheetHandle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignSelf: 'center', marginBottom: 20,
  },
  sheetHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 18 },
  sheetAvatarWrap: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: B.primary + '20', borderWidth: 1, borderColor: B.primary + '28',
    alignItems: 'center', justifyContent: 'center',
  },
  sheetTitle: { fontSize: 15, fontWeight: '800', color: B.text },
  sheetSub: { fontSize: 11, color: B.muted, marginTop: 2 },
  textWrap: {
    backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 14,
    borderWidth: 1, borderColor: B.border, padding: 14, marginBottom: 18,
  },
  textInput: { fontSize: 15, color: B.text, minHeight: 80, lineHeight: 23 },
  charCount: { fontSize: 11, fontWeight: '700', textAlign: 'right', marginTop: 6 },
  tagLabel: {
    fontSize: 10, fontWeight: '700', color: B.muted,
    letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 10,
  },
  tagChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1, borderColor: B.border, backgroundColor: 'rgba(255,255,255,0.03)',
  },
  tagChipText: { fontSize: 12, color: B.muted },
  postHint: { fontSize: 12, color: B.amber, textAlign: 'center', marginBottom: 10 },
  postBtn: {
    height: 52, borderRadius: 15, backgroundColor: B.primary,
    alignItems: 'center', justifyContent: 'center',
    shadowRadius: 14, shadowOpacity: 0.4, shadowOffset: { width: 0, height: 3 },
  },
  postBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },

  // Solutions hero banner — gives the tab its own identity
  solHero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 14,
    marginTop: 14,
    marginBottom: 4,
    padding: 16,
    borderRadius: 18,
    backgroundColor: 'rgba(139,92,246,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.2)',
    overflow: 'hidden',
  },
  solHeroGlow: {
    position: 'absolute',
    top: -40, right: -40,
    width: 120, height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(139,92,246,0.18)',
  },
  solHeroIconWrap: {
    width: 42, height: 42, borderRadius: 13,
    backgroundColor: 'rgba(139,92,246,0.18)',
    borderWidth: 1, borderColor: 'rgba(139,92,246,0.35)',
    alignItems: 'center', justifyContent: 'center',
  },
  solHeroTitle: { fontSize: 15, fontWeight: '900', color: '#fff', letterSpacing: -0.3, marginBottom: 2 },
  solHeroSub: { fontSize: 11, color: 'rgba(255,255,255,0.55)', lineHeight: 16 },

  // Read-only banner
  readOnlyBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginHorizontal: 14, marginTop: 12, marginBottom: 0,
    backgroundColor: 'rgba(139,92,246,0.07)', borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.18)', borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 9,
  },
  readOnlyText: { flex: 1, fontSize: 12, color: B.purpleLight, lineHeight: 17 },

  // Leaderboard / podium
  lbWrap: {
    marginHorizontal: 14, marginTop: 14, marginBottom: 4,
    backgroundColor: B.surface, borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.18)', borderRadius: 20, padding: 16,
    overflow: 'hidden',
  },
  lbGlowTop: {
    position: 'absolute',
    top: -60, left: '50%',
    marginLeft: -90,
    width: 180, height: 120,
    borderRadius: 90,
    backgroundColor: 'rgba(251,191,36,0.06)',
  },
  lbHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  lbHeaderIconWrap: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: 'rgba(251,191,36,0.12)', borderWidth: 1, borderColor: 'rgba(251,191,36,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  lbHeaderEmoji: { fontSize: 17 },
  lbHeaderTitle: { fontSize: 14, fontWeight: '900', color: B.text, marginBottom: 2 },
  lbHeaderSub: { fontSize: 10, color: B.muted },

  podiumRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-end' },
  podiumCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
  },
  podiumCardFirst: {
    paddingTop: 14,
    paddingBottom: 14,
    transform: [{ translateY: -8 }],
  },
  podiumTop: { alignItems: 'center', marginBottom: 6 },
  podiumMedal: { fontSize: 22, marginBottom: 2 },
  podiumRankLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  podiumPct: { fontSize: 24, fontWeight: '900', letterSpacing: -1 },
  podiumPctSuffix: { fontSize: 13, fontWeight: '800' },
  podiumApproval: { fontSize: 9, color: B.muted, marginBottom: 8, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  podiumBarTrack: {
    width: '100%', height: 4, backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 2, overflow: 'hidden', marginBottom: 10,
  },
  podiumBarFill: { height: 4, borderRadius: 2 },
  podiumTitle: { fontSize: 11, fontWeight: '800', color: B.text, textAlign: 'center', lineHeight: 15, marginBottom: 4, minHeight: 45 },
  podiumAuthor: { fontSize: 9, fontWeight: '700', marginBottom: 8 },
  podiumVotes: { flexDirection: 'row', gap: 8 },
  podiumVoteNum: { fontSize: 9, color: B.muted, fontWeight: '700' },

  // Week label
  weekLabel: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 14, marginTop: 18, marginBottom: 8,
  },
  weekDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: B.accent },
  weekLabelText: { fontSize: 11, fontWeight: '700', color: B.accent, letterSpacing: 0.4 },

  // Solution card
  solCard: {
    marginHorizontal: 14, marginBottom: 10,
    backgroundColor: B.surface, borderWidth: 1, borderLeftWidth: 3,
    borderColor: B.border, borderRadius: 18, padding: 14, overflow: 'hidden',
  },
  solCardPinned: { borderColor: 'rgba(251,191,36,0.25)' },
  pinnedBar: {
    backgroundColor: 'rgba(251,191,36,0.07)',
    borderBottomWidth: 1, borderBottomColor: 'rgba(251,191,36,0.15)',
    marginHorizontal: -14, marginTop: -14,
    paddingHorizontal: 14, paddingVertical: 6, marginBottom: 12,
  },
  pinnedText: { fontSize: 10, fontWeight: '700', color: '#FBBF24' },
  solCardTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  solAuthorIcon: {
    width: 28, height: 28, borderRadius: 9,
    backgroundColor: B.primary + '18', borderWidth: 1,
    borderColor: B.primary + '30', alignItems: 'center', justifyContent: 'center',
  },
  solAuthorLabel: { fontSize: 11, fontWeight: '700', color: B.muted },
  solStatusBadge: {
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 8, borderWidth: 1,
  },
  solStatusText: { fontSize: 10, fontWeight: '700' },
  solTitle: { fontSize: 14, fontWeight: '900', color: B.text, letterSpacing: -0.3, marginBottom: 6, lineHeight: 20 },
  solBody: { fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 20, marginBottom: 6 },
  expandToggle: { fontSize: 11, color: B.accent, fontWeight: '700', marginBottom: 10 },
  solTags: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 5, marginBottom: 12 },
  solTagChip: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 20 },
  solTagText: { fontSize: 10, fontWeight: '700' },
  solTime: { fontSize: 10, color: B.muted, marginRight: 6 },

  // Solution vote
  solVoteWrap: { gap: 8 },
  splitBarTrack: {
    flexDirection: 'row',
    height: 5, borderRadius: 3, overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  splitBarUp: { height: 5, backgroundColor: B.purpleLight },
  splitBarDown: { height: 5, backgroundColor: B.red },
  solVoteRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  solVoteBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20,
    borderWidth: 1, borderColor: B.border, backgroundColor: 'rgba(255,255,255,0.02)',
  },
  solVoteBtnUpActive: { backgroundColor: B.purple + '14', borderColor: B.purple + '40' },
  solVoteBtnDownActive: { backgroundColor: B.red + '14', borderColor: B.red + '40' },
  solVoteNum: { fontSize: 13, color: B.muted, fontWeight: '600' },
  approvalPill: {
    flexDirection: 'row', alignItems: 'baseline',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
    backgroundColor: 'rgba(139,92,246,0.1)',
  },
  approvalPct: { fontSize: 13, fontWeight: '900', color: B.purpleLight },
  approvalLabel: { fontSize: 10, color: B.muted, fontWeight: '600' },
});