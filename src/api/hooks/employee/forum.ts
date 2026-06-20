import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../clients";
import { FORUM } from "../../endpoints/employee/forum";
import { useOfflineAwareQuery } from "../../offline/hooks/useOfflineAwareness";

// ─── Types ─────────────────────────────────────────────────────────────────
interface ForumPost {
  id: string;
  anonId: string;
  content: string;
  tags: string[];
  upvotes: number;
  downvotes: number;
  userVote: "up" | "down" | null;
  createdAt: string;
}

interface CreatePostPayload {
  content: string;
  tags: string[];
}

interface GetPostsResponse {
  success: boolean;
  data: ForumPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface VoteResponse {
  success: boolean;
  data: {
    id: string;
    upvotes: number;
    downvotes: number;
    userVote: "up" | "down" | null;
  };
}

// ─── Query keys ────────────────────────────────────────────────────────────
export const FORUM_KEYS = {
  posts: (page: number, tag?: string) =>
    ["forum-posts", page, tag] as const,
  tags: ["forum-tags"] as const,
};

// ─── Get forum posts ────────────────────────────────────────────────────────
export const useForumPosts = (page = 1, limit = 20, tag?: string) => {
  return useOfflineAwareQuery<GetPostsResponse>({
    queryKey: FORUM_KEYS.posts(page, tag),
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (tag) params.append("tag", tag);
      const { data } = await api.get<GetPostsResponse>(
        `${FORUM.GET_POSTS}?${params.toString()}`
      );
      return data;
    },
    cacheKey: `forum:posts:${page}:${tag ?? "all"}`,
  });
};

// ─── Get forum tags ─────────────────────────────────────────────────────────
export const useForumTags = () => {
  return useOfflineAwareQuery<string[]>({
    queryKey: FORUM_KEYS.tags,
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: string[] }>(
        FORUM.GET_TAGS
      );
      return data.data;
    },
    cacheKey: "forum:tags",
  });
};

// ─── Create post ────────────────────────────────────────────────────────────
export const useCreateForumPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreatePostPayload) => {
      const { data } = await api.post(FORUM.CREATE_POST, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum-posts"] });
    },
  });
};

// ─── Vote post ──────────────────────────────────────────────────────────────
export const useVoteForumPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, type }: { id: string; type: "up" | "down" }) => {
      const { data } = await api.patch<VoteResponse>(FORUM.VOTE(id), { type });
      return data;
    },
    onSuccess: (response, { id }) => {
      queryClient.setQueriesData<GetPostsResponse>(
        { queryKey: ["forum-posts"] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((post) =>
              post.id === id
                ? {
                    ...post,
                    upvotes: response.data.upvotes,
                    downvotes: response.data.downvotes,
                    userVote: response.data.userVote,
                  }
                : post
            ),
          };
        }
      );
    },
  });
};

// ─── Delete post ────────────────────────────────────────────────────────────
export const useDeleteForumPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(FORUM.DELETE_POST(id));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum-posts"] });
    },
  });
};