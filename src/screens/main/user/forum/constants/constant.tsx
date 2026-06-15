// ─── Tokens ───────────────────────────────────────────────────────────────────
export const B = {
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
export const ORG = {
  name: 'Acme Corp',
  icon: '🏢',
  description: 'A space to speak freely and find solutions together.',
  address: '14 Innovation Drive, Lagos, NG',
  activeToday: 31,
};

// ─── Mood tags ────────────────────────────────────────────────────────────────
export const MOOD_TAGS = [
  { label: '😮 Surprised',  color: '#FBBF24' },
  { label: '😤 Frustrated', color: '#F87171' },
  { label: '😔 Low',        color: '#818CF8' },
  { label: '😌 Calm',       color: B.accent },
  { label: '😊 Happy',      color: B.green },
  { label: '😰 Anxious',    color: '#FB923C' },
  { label: '🔥 Burnout',    color: '#EF4444' },
  { label: '💪 Motivated',  color: '#34D399' },
];

// ─── Types ────────────────────────────────────────────────────────────────────
export type Post = {
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

export type SolutionTag = 'burnout' | 'workload' | 'culture' | 'process' | 'wellbeing' | 'communication';
export type SolutionStatus = 'open' | 'in-progress' | 'adopted';

export type Solution = {
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
export const SOL_TAG: Record<SolutionTag, { label: string; color: string; bg: string }> = {
  burnout:       { label: '🔥 Burnout',      color: '#F87171',     bg: 'rgba(239,68,68,0.1)' },
  workload:      { label: '⚖️ Workload',      color: '#FBBF24',     bg: 'rgba(251,191,36,0.1)' },
  culture:       { label: '🌱 Culture',       color: B.purpleLight, bg: 'rgba(139,92,246,0.1)' },
  process:       { label: '⚙️ Process',       color: '#A78BFA',     bg: 'rgba(139,92,246,0.1)' },
  wellbeing:     { label: '💚 Wellbeing',     color: B.green,       bg: 'rgba(34,197,94,0.1)' },
  communication: { label: '💬 Communication', color: '#60A5FA',     bg: 'rgba(59,130,246,0.1)' },
};

export const SOL_STATUS: Record<SolutionStatus, { label: string; color: string; bg: string; border: string }> = {
  open:          { label: '● Open',        color: B.purpleLight, bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.28)' },
  'in-progress': { label: '◑ In Progress', color: '#FBBF24',     bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.25)' },
  adopted:       { label: '✓ Adopted',     color: B.green,       bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.25)' },
};

export const PODIUM_COLORS = [
  { medal: '🥇', color: '#FBBF24', bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.4)',  labelKey: 'gold' },
  { medal: '🥈', color: '#CBD5E1', bg: 'rgba(203,213,225,0.07)', border: 'rgba(203,213,225,0.25)', labelKey: 'silver' },
  { medal: '🥉', color: '#FB923C', bg: 'rgba(251,146,60,0.08)', border: 'rgba(251,146,60,0.28)', labelKey: 'bronze' },
];

// ─── Mock data ────────────────────────────────────────────────────────────────
export const INITIAL_POSTS: Post[] = [
  { id: '1', avatar: '🦊', content: "Three back-to-back sprints with no retrospective. We're shipping fast but I feel like we're accumulating invisible debt — technical and emotional.", moodTag: '🔥 Burnout', tagColor: '#EF4444', upvotes: 18, downvotes: 2, date: 'Today', time: '9:14 am', userVote: null, trending: true },
  { id: '2', avatar: '🐺', content: "Honestly the no-meeting Wednesday idea changed my week completely. I finally had time to think. More of this please.", moodTag: '😊 Happy', tagColor: '#34D399', upvotes: 31, downvotes: 0, date: 'Today', time: '8:02 am', userVote: 'up', trending: true },
  { id: '3', avatar: '🦋', content: "The new async standup format saves me 45 minutes a day. Small change, big difference. Thank you to whoever pushed for it.", moodTag: '💪 Motivated', tagColor: '#34D399', upvotes: 12, downvotes: 1, date: 'Yesterday', time: '5:30 pm', userVote: null, trending: false },
  { id: '4', avatar: '🦉', content: "It's week 8 of the same issue being flagged in retros with no visible action. At some point silence from leadership feels like dismissal.", moodTag: '😤 Frustrated', tagColor: '#F87171', upvotes: 27, downvotes: 3, date: 'Yesterday', time: '2:11 pm', userVote: null, trending: true },
  { id: '5', avatar: '🐬', content: "Genuinely anxious about the reorg rumours. I know nothing's confirmed but uncertainty is draining. A short update from anyone would help.", moodTag: '😰 Anxious', tagColor: '#FB923C', upvotes: 22, downvotes: 1, date: 'Mon', time: '11:44 am', userVote: null, trending: false },
];

export const INITIAL_SOLUTIONS: Solution[] = [
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