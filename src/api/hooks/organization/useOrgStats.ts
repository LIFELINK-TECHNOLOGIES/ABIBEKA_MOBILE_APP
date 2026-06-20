import { useQuery } from "@tanstack/react-query";
import api from "../../clients";
import { OrgDashboard } from "../../endpoints/organization/stats";

// ─── Raw backend response shape ───────────────────────────────────────────────
interface RawDept {
  name: string;
  memberCount: number;
  checkedInToday: number;
  avgMood: number;
  avgStress: number;
  avgEnergy: number;
  pulseScore: number;
}

interface RawEmotion {
  emotion: string;
  count: number;
  pct: number;
}

interface RawHeatDay {
  day: string;
  avgStress: number;
  intensity: number;
}

export interface OrgDashboardRaw {
  totalEmployees: number;
  departmentCount: number;
  totalCheckInsToday: number;
  checkInRate: number;
  goodLevel: number;
  moodDistribution: {
    great: number;
    calm: number;
    okay: number;
    low: number;
    stressed: number;
  };
  departments: RawDept[];
  topEmotions: RawEmotion[];
  stressHeatmap: RawHeatDay[];
  alertDept: string | null;
  alertStressChange: number | null;
}

// ─── Query key ────────────────────────────────────────────────────────────────
export const ORG_DASHBOARD_KEY = ["orgDashboard"];

// ─── Hook ─────────────────────────────────────────────────────────────────────
// Returns raw data from the backend — HomeScreen transforms it into
// component-ready props (colors, labels) so the hook stays UI-free.
export const useOrgDashboard = () => {
  return useQuery({
    queryKey: ORG_DASHBOARD_KEY,
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: OrgDashboardRaw }>(
        OrgDashboard.GET
      );
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};