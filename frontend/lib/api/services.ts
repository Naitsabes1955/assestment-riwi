import type {
  AssistantResponse,
  AuthSession,
  Channel,
  LoginInput,
  Message,
  RegisterInput,
  SearchResult,
} from "@/types";

import type { ApiHttpClient } from "./client";

export function authApi(client: ApiHttpClient) {
  return {
    login: (input: LoginInput) =>
      client.request<AuthSession>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(input),
      }, false),
    register: (input: RegisterInput) =>
      client.request<AuthSession>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(input),
      }, false),
    logout: (refreshToken: string) =>
      client.request<void>("/api/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      }, false),
  };
}

export function channelsApi(client: ApiHttpClient) {
  return {
    list: () => client.request<readonly Channel[]>("/api/channels"),
  };
}

export function messagesApi(client: ApiHttpClient) {
  return {
    list: (channelId: string) =>
      client.request<readonly Message[]>(`/api/channels/${channelId}/messages?limit=50`),
    send: (channelId: string, content: string) =>
      client.request<Message>(`/api/channels/${channelId}/messages`, {
        method: "POST",
        body: JSON.stringify({ content }),
      }),
    delete: (channelId: string, messageId: string) =>
      client.request<void>(`/api/channels/${channelId}/messages/${messageId}`, {
        method: "DELETE",
      }),
  };
}

export function searchApi(client: ApiHttpClient) {
  return {
    search: (query: string) => {
      const params = new URLSearchParams({ q: query, limit: "20" });
      return client.request<readonly SearchResult[]>(`/api/messages/search?${params}`);
    },
  };
}

export function assistantApi(client: ApiHttpClient) {
  return {
    ask: (channelId: string, message: string) =>
      client.request<AssistantResponse>("/api/copilot", {
        method: "POST",
        body: JSON.stringify({ channelId, message }),
      }),
  };
}
