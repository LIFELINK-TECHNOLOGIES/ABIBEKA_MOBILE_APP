// ─── Brand ────────────────────────────────────────────────────────────────────
export const B = {
    primary:    "#0F766E",
    secondary:  "#1E3A8A",
    accent:     "#22C55E",
    bg:         "#04060F",
    card:       "#07090F",
    cardRaised: "#0A0E1A",
    border:     "rgba(255,255,255,0.06)",
    borderMid:  "rgba(255,255,255,0.1)",
    text:       "#EEF2FF",
    muted:      "rgba(238,242,255,0.42)",
    muted2:     "rgba(238,242,255,0.2)",
    amber:      "#F59E0B",
    red:        "#EF4444",
    violet:     "#8B5CF6",
    rose:       "#F43F5E",
    sky:        "#0EA5E9",
    teal:       "#14B8A6",
  };
  
  // ─── Types ────────────────────────────────────────────────────────────────────
  export type UserVote = "up" | "down" | null;
  
  export interface Post {
    id:        string;
    avatar:    string;
    content:   string;
    moodTag:   string;
    tagColor:  string;
    upvotes:   number;
    downvotes: number;
    date:      string;
    time:      string;
    userVote:  UserVote;
    trending:  boolean;
  }
  
  export interface Organization {
    id:       string;
    name:     string;
    members:  number;
    icon:     string;
    industry: string;
  }
  
  // ─── Org info ─────────────────────────────────────────────────────────────────
  export const ORG = {
    name:        "TechCorp Ltd",
    industry:    "Software & Technology",
    size:        "201–500 employees",
    location:    "Lagos, Nigeria",
    founded:     "2015",
    icon:        "💼",
    members:     142,
    activeToday: 67,
    totalPosts:  1284,
    joinedDate:  "March 2026",
  };
  
  export const ORGANIZATIONS: Organization[] = [
    { id: "1", name: "TechCorp Ltd",           members: 142, icon: "💼", industry: "Technology"   },
    { id: "2", name: "HealthPlus Hospital",     members: 89,  icon: "🏥", industry: "Healthcare"   },
    { id: "3", name: "EduFirst Schools",        members: 203, icon: "🎓", industry: "Education"    },
    { id: "4", name: "BuildRight Construction", members: 67,  icon: "🏗️", industry: "Construction" },
    { id: "5", name: "FinEdge Capital",         members: 55,  icon: "💰", industry: "Finance"      },
    { id: "6", name: "GreenLeaf NGO",           members: 38,  icon: "🌿", industry: "Non-profit"   },
  ];
  
  export const DEPARTMENTS = [
    "Engineering", "Product", "Design", "Marketing",
    "Finance", "HR", "Operations", "Legal", "Sales", "Support",
  ];
  
  export const MOOD_TAGS = [
    { label: "stressed",    color: B.amber  },
    { label: "burnt out",   color: B.red    },
    { label: "overwhelmed", color: B.rose   },
    { label: "unmotivated", color: B.violet },
    { label: "hopeful",     color: B.accent },
    { label: "grateful",    color: B.primary},
    { label: "anxious",     color: B.sky    },
    { label: "calm",        color: B.teal   },
  ];
  
  export const INITIAL_POSTS: Post[] = [
    {
      id: "1", avatar: "🦊",
      content: "The amount of back-to-back meetings this week has been completely draining. I haven't had a single block to actually think or produce meaningful work.",
      moodTag: "burnt out", tagColor: B.red,
      upvotes: 47, downvotes: 3,
      date: "Today", time: "2:14 PM",
      userVote: null, trending: true,
    },
    {
      id: "2", avatar: "🐺",
      content: "Finally feel like I'm making progress after weeks of feeling stuck. Shipped something I'm proud of today. Small wins matter more than I realised.",
      moodTag: "hopeful", tagColor: B.accent,
      upvotes: 82, downvotes: 1,
      date: "Today", time: "12:30 PM",
      userVote: "up", trending: true,
    },
    {
      id: "3", avatar: "🦁",
      content: "Communication gaps between teams are causing so much unnecessary stress. We need better systems urgently, not more meetings.",
      moodTag: "stressed", tagColor: B.amber,
      upvotes: 61, downvotes: 8,
      date: "Today", time: "10:05 AM",
      userVote: null, trending: false,
    },
    {
      id: "4", avatar: "🐻",
      content: "Been working late every single day for the past month. Management keeps piling on more without acknowledging anyone's limits. This is unsustainable.",
      moodTag: "overwhelmed", tagColor: B.rose,
      upvotes: 94, downvotes: 2,
      date: "Yesterday", time: "9:47 PM",
      userVote: null, trending: true,
    },
    {
      id: "5", avatar: "🦋",
      content: "Had a genuinely supportive 1:1 with my lead today. It made a real difference to feel heard. We need more of this in our culture.",
      moodTag: "grateful", tagColor: B.primary,
      upvotes: 53, downvotes: 0,
      date: "Yesterday", time: "4:22 PM",
      userVote: null, trending: false,
    },
    {
      id: "6", avatar: "🦅",
      content: "The workload distribution here is deeply unequal. Some people are drowning while others coast. This needs to be addressed openly.",
      moodTag: "stressed", tagColor: B.amber,
      upvotes: 71, downvotes: 5,
      date: "Mon, Jun 2", time: "11:15 AM",
      userVote: null, trending: false,
    },
  ];
  
  // ─── Dashboard data ───────────────────────────────────────────────────────────
  export const WEEKLY_MOOD   = [62, 55, 70, 48, 52, 65, 58];
  export const DAY_LABELS    = ["M","T","W","T","F","S","S"];
  export const EMOTIONS_DIST = [
    { label: "Stressed",    pct: 34, color: B.amber  },
    { label: "Burnt out",   pct: 22, color: B.red    },
    { label: "Hopeful",     pct: 24, color: B.accent },
    { label: "Overwhelmed", pct: 20, color: B.violet },
  ];
  export const TOP_ISSUES = [
    { issue: "Work pressure",     pct: 78 },
    { issue: "Communication",     pct: 60 },
    { issue: "Deadlines",         pct: 51 },
    { issue: "Recognition",       pct: 37 },
    { issue: "Work-life balance", pct: 31 },
  ];