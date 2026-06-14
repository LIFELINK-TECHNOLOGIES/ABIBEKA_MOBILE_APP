import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../clients";
import { AI } from "../../endpoints/shared/ai";

// ─── Types ─────────────────────────────────────────────────────────────────
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

interface SendMessageResponse {
  success: boolean;
  data: {
    reply: string;
    expiresAt: string;
  };
}

interface ChatHistoryResponse {
  success: boolean;
  data: ChatMessage[];
  expiresAt: string | null;
}

interface ClearHistoryResponse {
  success: boolean;
  message: string;
}

// ─── Query key ────────────────────────────────────────────────────────────
export const AI_CHAT_HISTORY_KEY = ["aiChatHistory"];

// ─── Get chat history ─────────────────────────────────────────────────────
export const useAiChatHistory = () => {
  return useQuery({
    queryKey: AI_CHAT_HISTORY_KEY,
    queryFn: async () => {
      const { data } = await api.get<ChatHistoryResponse>(AI.HISTORY);
      return data;
    },
  });
};

// ─── Send message ──────────────────────────────────────────────────────────
export const useSendAiMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (message: string) => {
      const { data } = await api.post<SendMessageResponse>(AI.MESSAGE, { message });
      return data;
    },
    onSuccess: () => {
      // Refetch history so the new user + assistant messages appear
      queryClient.invalidateQueries({ queryKey: AI_CHAT_HISTORY_KEY });
    },
  });
};

// ─── Clear chat history ─────────────────────────────────────────────────────
export const useClearAiChatHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.delete<ClearHistoryResponse>(AI.DELETE_HISTORY);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AI_CHAT_HISTORY_KEY });
    },
  });
};