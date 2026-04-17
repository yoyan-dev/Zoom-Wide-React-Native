import { create } from "zustand";

import * as authApi from "@/services/authApi";
import { ApiClientError } from "@/services/apiClient";
import {
  clearPersistedAuthState,
  persistAuthState,
  readPersistedAuthState,
} from "@/store/authStorage";
import type {
  AuthSession,
  AuthenticatedUser,
  LoginPayload,
  RegisterPayload,
} from "@/types/auth";
import type { Customer } from "@/types/customer";

type AuthStatus = "idle" | "restoring" | "authenticated" | "unauthenticated";

type AuthState = {
  accessToken: string | null;
  customer: Customer | null;
  error: string | null;
  hasRestoredSession: boolean;
  isLoading: boolean;
  refreshToken: string | null;
  rememberSession: boolean;
  session: AuthSession | null;
  status: AuthStatus;
  user: AuthenticatedUser | null;
  clearError: () => void;
  clearSession: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  restoreSession: () => Promise<void>;
  setRememberSession: (rememberSession: boolean) => void;
  signIn: (payload: LoginPayload, rememberSession?: boolean) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (payload: RegisterPayload, rememberSession?: boolean) => Promise<void>;
};

function getAccessToken(session: AuthSession | null) {
  return (
    session?.access_token ??
    session?.token ??
    session?.session?.access_token ??
    null
  );
}

function getRefreshToken(session: AuthSession | null) {
  return session?.refresh_token ?? session?.session?.refresh_token ?? null;
}

function normalizeSession(session: AuthSession, rememberSession: boolean) {
  return {
    accessToken: getAccessToken(session),
    customer: session.customer ?? null,
    error: null,
    isLoading: false,
    refreshToken: getRefreshToken(session),
    rememberSession,
    session,
    status: "authenticated" as const,
    user: session.user,
  };
}

function toErrorMessage(error: unknown) {
  if (error instanceof ApiClientError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

let restorePromise: Promise<void> | null = null;

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  customer: null,
  error: null,
  hasRestoredSession: false,
  isLoading: false,
  refreshToken: null,
  rememberSession: true,
  session: null,
  status: "idle",
  user: null,

  clearError: () => set({ error: null }),

  clearSession: async () => {
    await clearPersistedAuthState();
    set({
      accessToken: null,
      customer: null,
      error: null,
      isLoading: false,
      refreshToken: null,
      session: null,
      status: "unauthenticated",
      user: null,
    });
  },

  fetchCurrentUser: async () => {
    const accessToken = get().accessToken;
    if (!accessToken) {
      await get().clearSession();
      return;
    }

    set({ error: null, isLoading: true });

    try {
      const session = await authApi.getCurrentAccount(accessToken);
      const nextSession = {
        ...get().session,
        ...session,
        access_token: accessToken,
        refresh_token: get().refreshToken,
      } as AuthSession;

      if (get().rememberSession) {
        await persistAuthState({
          rememberSession: true,
          session: nextSession,
        });
      }

      set(normalizeSession(nextSession, get().rememberSession));
    } catch (error) {
      set({ error: toErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  restoreSession: async () => {
    if (restorePromise) {
      return restorePromise;
    }

    restorePromise = (async () => {
      set({ status: "restoring" });

      try {
        const persisted = await readPersistedAuthState();
        const refreshToken = getRefreshToken(persisted?.session ?? null);

        if (!persisted || !refreshToken) {
          await get().clearSession();
          set({ hasRestoredSession: true });
          return;
        }

        const session = await authApi.refreshSession(refreshToken);
        await persistAuthState({
          rememberSession: persisted.rememberSession,
          session,
        });

        set({
          ...normalizeSession(session, persisted.rememberSession),
          hasRestoredSession: true,
        });
      } catch {
        await get().clearSession();
        set({ hasRestoredSession: true });
      } finally {
        restorePromise = null;
      }
    })();

    return restorePromise;
  },

  setRememberSession: (rememberSession: boolean) => set({ rememberSession }),

  signIn: async (payload: LoginPayload, rememberSession = get().rememberSession) => {
    set({ error: null, isLoading: true, rememberSession });

    try {
      const session = await authApi.login(payload);

      if (rememberSession) {
        await persistAuthState({ rememberSession, session });
      } else {
        await clearPersistedAuthState();
      }

      set({
        ...normalizeSession(session, rememberSession),
        hasRestoredSession: true,
      });
    } catch (error) {
      set({ error: toErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  signOut: async () => {
    const { accessToken, refreshToken } = get();
    set({ isLoading: true });

    try {
      if (accessToken && refreshToken) {
        await authApi.logout(accessToken, refreshToken);
      }
    } finally {
      await get().clearSession();
      set({ hasRestoredSession: true });
    }
  },

  signUp: async (
    payload: RegisterPayload,
    rememberSession = get().rememberSession,
  ) => {
    set({ error: null, isLoading: true, rememberSession });

    try {
      await authApi.register(payload);
      // API docs specify customer registration does not create a session.
      await get().signIn(
        {
          email: payload.email,
          password: payload.password,
        },
        rememberSession,
      );
    } catch (error) {
      set({ error: toErrorMessage(error), isLoading: false });
      throw error;
    }
  },
}));
