import * as FileSystem from "expo-file-system/legacy";
import { Platform } from "react-native";

const STORAGE_KEY = "zoom-wide-default-delivery-address";
const STORAGE_FILE = `${FileSystem.documentDirectory ?? ""}${STORAGE_KEY}.json`;

type PersistedDefaultDeliveryAddressMap = Record<string, string>;

async function readStorageMap() {
  if (Platform.OS === "web") {
    const rawValue = globalThis.localStorage?.getItem(STORAGE_KEY);
    return rawValue
      ? (JSON.parse(rawValue) as PersistedDefaultDeliveryAddressMap)
      : {};
  }

  const info = await FileSystem.getInfoAsync(STORAGE_FILE);
  if (!info.exists) {
    return {};
  }

  const rawValue = await FileSystem.readAsStringAsync(STORAGE_FILE);
  return rawValue
    ? (JSON.parse(rawValue) as PersistedDefaultDeliveryAddressMap)
    : {};
}

async function writeStorageMap(value: PersistedDefaultDeliveryAddressMap) {
  if (Platform.OS === "web") {
    globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(value));
    return;
  }

  await FileSystem.writeAsStringAsync(STORAGE_FILE, JSON.stringify(value));
}

export async function readDefaultDeliveryAddressId(customerId: string) {
  const value = await readStorageMap();
  return value[customerId] ?? null;
}

export async function persistDefaultDeliveryAddressId(
  customerId: string,
  addressId: string,
) {
  const value = await readStorageMap();
  value[customerId] = addressId;
  await writeStorageMap(value);
}

export async function clearDefaultDeliveryAddressId(customerId: string) {
  const value = await readStorageMap();
  delete value[customerId];
  await writeStorageMap(value);
}
