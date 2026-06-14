import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../clients";
import { MoodEntry } from "../../endpoints/shared/moodEntry";

// ─── Types ─────────────────────────────────────────────────────────────────
interface SubmitCheckInPayload {
  mood: number;
  emotions: string[];
  energy: number;
  stress: number;
  situations: string[];
  answers: Record<string, string>;
  date?: string;
}

interface MoodEntryDoc {
  _id: string;
  userId: string;
  date: string;
  mood: number;
  emotions: string[];
  energy: number;
  stress: number;
  situations: string[];
  answers: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

interface SubmitCheckInResponse {
  success: boolean;
  message: string;
  data: MoodEntryDoc;
}

interface DashboardData {
  totalCheckIns: number;
  streak: number;
  hasJoinedOrganization: boolean;
  moodTrend: {
    avg: number;
    bestDay: { date: string; mood: number; score: number } | null;
    worstDay: { date: string; mood: number; score: number } | null;
    daily: { date: string; mood: number; score: number }[];
  };
  stress: {
    avg: number;
    peakDay: { date: string; value: number } | null;
    calmestDay: { date: string; value: number } | null;
    daily: { date: string; value: number }[];
  };
  emotionBreakdown: {
    calmLevel: number;
    happyLevel: number;
    stressLevel: number;
    anxietyLevel: number;
    emotionCounts: Record<string, number>;
  };
  grid: { date: string; value: number }[];
  latestEntry: {
    mood: number;
    stress: number;
    energy: number;
    emotions: string[];
    situations: string[];
    answers: Record<string, string>;
  } | null;
  aiInsight: string | null;
}

interface DashboardResponse {
  success: boolean;
  data: DashboardData;
}

interface TodayEntryResponse {
  success: boolean;
  data: MoodEntryDoc | null;
  checkedInToday: boolean;
}

// ─── Query keys ───────────────────────────────────────────────────────────
export const MOOD_DASHBOARD_KEY = ["moodDashboard"];
export const MOOD_TODAY_KEY = ["moodToday"];

// ─── Submit check-in ────────────────────────────────────────────────────────
export const useSubmitCheckIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SubmitCheckInPayload) => {
      const { data } = await api.post<SubmitCheckInResponse>(MoodEntry.POST_DATA, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MOOD_DASHBOARD_KEY });
      queryClient.invalidateQueries({ queryKey: MOOD_TODAY_KEY });
    },
  });
};

// ─── Get dashboard data ─────────────────────────────────────────────────────
export const useMoodDashboard = (range: number = 30) => {
  return useQuery({
    queryKey: [...MOOD_DASHBOARD_KEY, range],
    queryFn: async () => {
      const { data } = await api.get<DashboardResponse>(
        `${MoodEntry.GET_DATA}?range=${range}`
      );
      return data;
    },
  });
};

// ─── Get today's entry (check if user already checked in) ──────────────────
export const useTodayMoodEntry = () => {
  return useQuery({
    queryKey: MOOD_TODAY_KEY,
    queryFn: async () => {
      const { data } = await api.get<TodayEntryResponse>(MoodEntry.TODAY_DATA);
      return data;
    },
  });
};