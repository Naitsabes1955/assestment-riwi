"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { authApi } from "@/lib/api/services";
import { ApiHttpClient } from "@/lib/api/client";
import { apiBaseUrl } from "@/lib/config";
import { readStoredSession, storeSession } from "@/lib/auth/session-storage";
import type { AuthSession, LoginInput, RegisterInput } from "@/types";

interface AuthContextValue {
  readonly accessToken: string | null;
  readonly currentUser: AuthSession["user"] | null;
  readonly isAuthenticated: boolean;
  readonly login: (input: LoginInput) => Promise<void>;
  readonly logout: () => Promise<void>;
  readonly refresh: () => Promise<void>;
  readonly register: (input: RegisterInput) => Promise<void>;
  readonly session: AuthSession | null;
  readonly setSession: (session: AuthSession | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider(props: {
  readonly children: ReactNode;
  readonly sessionExpiredMessage: string;
}) {
  const [session, setSessionState] = useState<AuthSession | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSessionState(readStoredSession());
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const setSession = useCallback((nextSession: AuthSession | null) => {
    setSessionState(nextSession);
    storeSession(nextSession);
  }, []);

  const client = useMemo(
    () =>
      new ApiHttpClient(apiBaseUrl, readStoredSession, setSession, props.sessionExpiredMessage),
    [props.sessionExpiredMessage, setSession],
  );

  const api = useMemo(() => authApi(client), [client]);

  const login = useCallback(
    async (input: LoginInput) => {
      setSession(await api.login(input));
    },
    [api, setSession],
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      setSession(await api.register(input));
    },
    [api, setSession],
  );

  const logout = useCallback(async () => {
    const refreshToken = readStoredSession()?.refreshToken;
    setSession(null);

    if (refreshToken) {
      await api.logout(refreshToken);
    }
  }, [api, setSession]);

  const refresh = useCallback(async () => {
    await client.refresh();
  }, [client]);

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken: session?.accessToken ?? null,
      currentUser: session?.user ?? null,
      isAuthenticated: Boolean(session),
      login,
      logout,
      refresh,
      register,
      session,
      setSession,
    }),
    [login, logout, refresh, register, session, setSession],
  );

  return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
