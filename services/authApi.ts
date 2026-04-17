import { apiRequest } from "@/services/apiClient";
import type {
  AuthSession,
  LoginPayload,
  RegisterPayload,
} from "@/types/auth";
import type {
  AccountProfile,
  ChangePasswordPayload,
  UpdateAccountPayload,
} from "@/types/account";

export function login(payload: LoginPayload) {
  return apiRequest<AuthSession>("/auth/login", {
    body: payload,
    method: "POST",
  });
}

export function register(payload: RegisterPayload) {
  return apiRequest<unknown>("/auth/register", {
    body: payload,
    method: "POST",
  });
}

export function refreshSession(refreshToken: string) {
  return apiRequest<AuthSession>("/auth/refresh", {
    body: {
      refresh_token: refreshToken,
    },
    method: "POST",
  });
}

export function logout(accessToken: string | null, refreshToken: string | null) {
  return apiRequest<unknown>("/auth/logout", {
    accessToken,
    body: {
      refresh_token: refreshToken,
    },
    method: "POST",
  });
}

export function logoutAllSessions(
  accessToken: string | null,
  refreshToken: string | null,
) {
  return apiRequest<unknown>("/auth/logout", {
    accessToken,
    body: {
      refresh_token: refreshToken,
      scope: "global",
    },
    method: "POST",
  });
}

export function getCurrentAccount(accessToken: string) {
  return apiRequest<AuthSession>("/account", {
    accessToken,
    method: "GET",
  });
}

export function getAccountProfile(accessToken: string) {
  return apiRequest<AccountProfile>("/account", {
    accessToken,
    method: "GET",
  });
}

export function updateAccount(
  accessToken: string,
  payload: UpdateAccountPayload,
) {
  return apiRequest<AccountProfile>("/account", {
    accessToken,
    body: payload,
    method: "PATCH",
  });
}

export function changePassword(
  accessToken: string,
  payload: ChangePasswordPayload,
) {
  return apiRequest<unknown>("/account/change-password", {
    accessToken,
    body: payload,
    method: "POST",
  });
}
