import * as FileSystem from "expo-file-system/legacy";
import { Platform } from "react-native";

import type { AuthSession } from "@/types/auth";

export type PersistedAuthState = {
  rememberSession: boolean;
  session: AuthSession;
};

const STORAGE_KEY = "zoom-wide-auth-session";
const STORAGE_FILE = `${FileSystem.documentDirectory ?? ""}${STORAGE_KEY}.json`;

export async function readPersistedAuthState() {
  if (Platform.OS === "web") {
    const value = globalThis.localStorage?.getItem(STORAGE_KEY);
    return value ? (JSON.parse(value) as PersistedAuthState) : null;
  }

  const info = await FileSystem.getInfoAsync(STORAGE_FILE);
  if (!info.exists) {
    return null;
  }

  const value = await FileSystem.readAsStringAsync(STORAGE_FILE);
  return value ? (JSON.parse(value) as PersistedAuthState) : null;
}

export async function persistAuthState(state: PersistedAuthState) {
  if (Platform.OS === "web") {
    globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(state));
    return;
  }

  await FileSystem.writeAsStringAsync(STORAGE_FILE, JSON.stringify(state));
}

export async function clearPersistedAuthState() {
  if (Platform.OS === "web") {
    globalThis.localStorage?.removeItem(STORAGE_KEY);
    return;
  }

  const info = await FileSystem.getInfoAsync(STORAGE_FILE);
  if (info.exists) {
    await FileSystem.deleteAsync(STORAGE_FILE, { idempotent: true });
  }
}
