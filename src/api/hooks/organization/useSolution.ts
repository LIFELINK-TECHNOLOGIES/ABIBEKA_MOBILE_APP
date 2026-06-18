import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../clients";
import { Solution } from "../../endpoints/organization/sloution";

// ─── Types ─────────────────────────────────────────────────────────────────
type SolutionVoteType = "up" | "down";
// ⚠️ must match VALID_STATUSES in the backend model
type SolutionStatusValue = "open" | "in_progress" | "resolved";

interface SolutionItem {
  id: string;
  authorIcon: string;
  authorLabel: string;
  postedAt: string;
  status: SolutionStatusValue;
  title: string;
  body: string;
  tags: string[];
  pinned: boolean;
  upvotes: number;
  downvotes: number;
  userVote: SolutionVoteType | null;
  weekLabel: "This week" | "Last week" | null;
}

interface CreateSolutionPayload {
  title: string;
  body: string;
  tags?: string[];
  status?: SolutionStatusValue;
}

interface SolutionFilters {
  tag?: string;
  status?: SolutionStatusValue;
}

// ─── Query keys ───────────────────────────────────────────────────────────
export const SOLUTION_KEYS = {
  list: ["solutions"],
  tags: ["solutions", "tags"],
};

// ─── List solutions (org-scoped, this week + last week) ───────────────────
export const useSolutions = (filters: SolutionFilters = {}) => {
  const { tag, status } = filters;

  return useQuery({
    queryKey: [...SOLUTION_KEYS.list, tag, status],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (tag) params.append("tag", tag);
      if (status) params.append("status", status);
      const query = params.toString();

      const { data } = await api.get<{ success: boolean; data: SolutionItem[] }>(
        `${Solution.GET_SOLUTIONS}${query ? `?${query}` : ""}`
      );
      return data.data;
    },
  });
};

// ─── Available solution tags ───────────────────────────────────────────────
export const useSolutionTags = () => {
  return useQuery({
    queryKey: SOLUTION_KEYS.tags,
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: string[] }>(
        Solution.GET_SOLUTION_TAGS
      );
      return data.data;
    },
  });
};

// ─── Organization posts a new solution ─────────────────────────────────────
export const useCreateSolution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateSolutionPayload) => {
          const { data } = await api.post(Solution.CREATE_SOLUTION, payload);
          
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SOLUTION_KEYS.list });
    },
  });
};

// ─── Upvote / downvote a solution ──────────────────────────────────────────
export const useVoteSolution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, type }: { id: string; type: SolutionVoteType }) => {
      const { data } = await api.patch(Solution.VOTE_SOLUTION(id), { type });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SOLUTION_KEYS.list });
    },
  });
};

// ─── Organization pins / unpins its own solution ───────────────────────────
export const usePinSolution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch(Solution.PIN_SOLUTION(id));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SOLUTION_KEYS.list });
    },
  });
};

// ─── Organization deletes its own solution ─────────────────────────────────
export const useDeleteSolution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(Solution.DELETE_SOLUTION(id));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SOLUTION_KEYS.list });
    },
  });
};