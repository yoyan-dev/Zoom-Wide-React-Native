import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useMemo, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import * as addressesApi from "@/services/addressesApi";
import { useAuthStore } from "@/store/authStore";
import {
  clearDefaultDeliveryAddressId,
  persistDefaultDeliveryAddressId,
  readDefaultDeliveryAddressId,
} from "@/store/deliveryAddressStorage";
import type { Address } from "@/types/address";

function formatAddressLabel(address: Address) {
  return address.address_line?.trim() || `${address.street}, ${address.city}`;
}

function formatAddressBlock(address: Address) {
  const cityLine = [address.city, address.province, address.postal_code]
    .filter(Boolean)
    .join(", ");

  return [address.street, cityLine, address.country].filter(Boolean).join("\n");
}

const heroImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuArspntYLP2pQg84KQ3NauPvGBYJN2mpdWTxMsGFc4urkPLoC6G_WKVLo7lUNkUGCivYyjmcy6pNHYAFcNu6RPeUIhp-YIJdwuWK-A1rkevb5tN5VjlLOiHsfwMzGLoYPIUzcKfG20mRhtos8fkJytYT_HrW7-ozEiX9-9JDCiti-R1NT3iXtJgHpofNPI4ksofHm04MKIEwO5hCPyxHgGrNQCl8t7rKd2PlcdvcIlmLOBrJXC7Be6H2QkruuE3N6WuGCFVtregdxs";

export function DeliveryAddressesScreen() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const customer = useAuthStore((state) => state.customer);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [defaultAddressId, setDefaultAddressId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingDefault, setIsSavingDefault] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadAddresses = useCallback(async () => {
    if (!accessToken || !customer?.id) {
      setError("Please sign in with a customer account to manage delivery addresses.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const nextAddresses = await addressesApi.fetchCustomerAddresses(
        accessToken,
        customer.id,
      );
      const storedDefaultAddressId = await readDefaultDeliveryAddressId(customer.id);
      setAddresses(nextAddresses);
      setDefaultAddressId(storedDefaultAddressId);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load delivery addresses.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, customer?.id]);

  useFocusEffect(
    useCallback(() => {
      void loadAddresses();
    }, [loadAddresses]),
  );

  const addressCards = useMemo(
    () =>
      addresses.map((address, index) => ({
        address,
        isDefault:
          (defaultAddressId
            ? address.id === defaultAddressId
            : index === 0),
      })),
    [addresses, defaultAddressId],
  );

  const handleSetDefault = async (address: Address) => {
    if (!accessToken || !customer?.id || isSavingDefault) {
      return;
    }

    setIsSavingDefault(address.id);
    setError(null);

    try {
      await persistDefaultDeliveryAddressId(customer.id, address.id);
      setDefaultAddressId(address.id);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to set the default delivery address.",
      );
    } finally {
      setIsSavingDefault(null);
    }
  };

  const handleDelete = async (address: Address, shouldClearDefault: boolean) => {
    if (!accessToken || !customer?.id) {
      return;
    }

    setIsDeleting(address.id);
    setError(null);

    try {
      await addressesApi.deleteCustomerAddress(
        accessToken,
        customer.id,
        address.id,
      );

      if (shouldClearDefault) {
        await clearDefaultDeliveryAddressId(customer.id);
        setDefaultAddressId(null);
      }

      setAddresses((current) =>
        current.filter((currentAddress) => currentAddress.id !== address.id),
      );
      setAddressToDelete(null);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to remove this delivery address.",
      );
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <View className="flex-1 bg-neutral-50">
      <StatusBar style="dark" />
      <SafeAreaView className="bg-primary-900" edges={["top"]}>
        <View className="flex-row items-center justify-between bg-primary-900 px-6 py-4">
          <View className="flex-row items-center gap-4">
            <Pressable
              className="rounded-full p-2 active:opacity-70"
              onPress={() => router.back()}
            >
              <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
            </Pressable>
            <Text className="text-xl font-black tracking-tight text-white">
              Delivery Addresses
            </Text>
          </View>

          <Pressable
            className="rounded-full p-2 active:opacity-70"
            onPress={() => router.push("/add-delivery-address")}
          >
            <MaterialIcons name="add-location-alt" size={24} color="#FFFFFF" />
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pb-32 pt-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="mx-auto w-full max-w-2xl">
          <View className="mb-10">
            <View className="mb-4 self-start rounded bg-primary-100 px-3 py-1">
              <Text className="text-xs font-black uppercase tracking-[3px] text-primary-900">
                Logistics Core
              </Text>
            </View>
            <Text className="text-4xl font-black tracking-tight text-primary-900">
              Saved Locations
            </Text>
            <Text className="mt-2 text-base font-medium text-neutral-600">
              Manage your industrial delivery sites and project headquarters.
            </Text>
          </View>

          {isLoading ? (
            <View className="rounded-xl bg-white p-8">
              <Text className="text-xs font-black uppercase tracking-widest text-neutral-500">
                Loading addresses
              </Text>
            </View>
          ) : null}

          {error ? (
            <View className="mb-6 rounded-xl border border-red-100 bg-red-50 p-5">
              <Text className="text-sm font-black text-red-700">{error}</Text>
            </View>
          ) : null}

          {!isLoading && addressCards.length === 0 ? (
            <View className="rounded-xl bg-white p-6">
              <Text className="text-xl font-black text-primary-900">
                No delivery locations yet
              </Text>
              <Text className="mt-2 text-sm font-medium leading-6 text-neutral-600">
                Add your project sites and warehouse drop points so your orders
                can move faster.
              </Text>
            </View>
          ) : null}

          <View className="gap-6">
            {addressCards.map(({ address, isDefault }, index) => (
              <View
                className={[
                  "overflow-hidden rounded-lg p-6",
                  isDefault ? "bg-white ring-1 ring-primary-100" : "bg-neutral-100",
                ].join(" ")}
                key={address.id}
              >
                {isDefault ? (
                  <View className="absolute right-4 top-4 rounded bg-accent-700 px-3 py-1">
                    <Text className="text-[10px] font-black uppercase tracking-widest text-white">
                      Default
                    </Text>
                  </View>
                ) : null}

                <View className="gap-4">
                  <View className="flex-row items-start gap-4">
                    <View className="h-12 w-12 items-center justify-center rounded bg-neutral-200">
                      <MaterialIcons
                        color={isDefault ? "#002A58" : "#667080"}
                        name={index % 2 === 0 ? "warehouse" : "architecture"}
                        size={24}
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xl font-black text-primary-900">
                        {formatAddressLabel(address)}
                      </Text>
                      <Text className="mt-1 font-semibold text-neutral-500">
                        Attn: {customer?.contact_name ?? "Primary contact"}
                      </Text>
                    </View>
                  </View>

                  <View className="ml-16 gap-2 border-l-2 border-neutral-200 pl-4">
                    <Text className="text-sm leading-6 text-neutral-800">
                      {formatAddressBlock(address)}
                    </Text>
                    {customer?.phone ? (
                      <View className="flex-row items-center gap-2">
                        <MaterialIcons
                          color="#667080"
                          name="call"
                          size={16}
                        />
                        <Text className="text-sm font-medium text-neutral-500">
                          {customer.phone}
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  <View className="ml-16 flex-row flex-wrap items-center gap-4 pt-2">
                    <Pressable
                      className="flex-row items-center gap-2 active:opacity-70"
                      onPress={() =>
                        router.push({
                          pathname: "/edit-delivery-address",
                          params: { address_id: address.id },
                        })
                      }
                    >
                      <MaterialIcons color="#002A58" name="edit-square" size={18} />
                      <Text className="text-xs font-black uppercase tracking-wider text-primary-900">
                        Edit
                      </Text>
                    </Pressable>

                    <Pressable
                      className="flex-row items-center gap-2 active:opacity-70"
                      disabled={isDeleting === address.id}
                      onPress={() => setAddressToDelete(address)}
                    >
                      <MaterialIcons color="#BA1A1A" name="delete-outline" size={18} />
                      <Text className="text-xs font-black uppercase tracking-wider text-red-700">
                        {isDeleting === address.id ? "Removing..." : "Remove"}
                      </Text>
                    </Pressable>

                    {!isDefault ? (
                      <Pressable
                        className="ml-auto rounded border border-neutral-300 px-3 py-2 active:bg-white"
                        disabled={isSavingDefault === address.id}
                        onPress={() => void handleSetDefault(address)}
                      >
                        <Text className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                          {isSavingDefault === address.id ? "Saving..." : "Set Default"}
                        </Text>
                      </Pressable>
                    ) : null}
                  </View>
                </View>
              </View>
            ))}
          </View>

          <Pressable
            className="mt-12 flex-row items-center justify-center gap-3 rounded-lg bg-primary-900 py-4 active:bg-primary-800"
            onPress={() => router.push("/add-delivery-address")}
          >
            <MaterialIcons name="add-circle" size={20} color="#FFFFFF" />
            <Text className="text-sm font-black uppercase tracking-widest text-white">
              Add New Delivery Location
            </Text>
          </Pressable>

          <View className="mt-12 flex-row items-center gap-6 rounded-lg border-l-4 border-accent-700 bg-neutral-100 p-6">
            <View className="flex-1">
              <Text className="text-sm font-black uppercase text-primary-900">
                Secure Logistics Network
              </Text>
              <Text className="mt-1 text-xs leading-5 text-neutral-600">
                All delivery sites are verified against the central project registry
                for safety compliance and routing efficiency.
              </Text>
            </View>
            <Image
              className="h-16 w-16 rounded"
              resizeMode="cover"
              source={{ uri: heroImage }}
            />
          </View>
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        onRequestClose={() => setAddressToDelete(null)}
        transparent
        visible={Boolean(addressToDelete)}
      >
        <View className="flex-1 items-center justify-center bg-black/40 px-6">
          <View className="w-full max-w-md rounded-2xl bg-white p-6">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-2xl font-black text-primary-900">
                Remove Address
              </Text>
              <Pressable
                className="rounded-full p-2 active:opacity-70"
                onPress={() => setAddressToDelete(null)}
              >
                <MaterialIcons name="close" size={20} color="#002A58" />
              </Pressable>
            </View>

            <Text className="text-sm font-medium leading-6 text-neutral-600">
              This delivery location will be removed from your saved addresses.
            </Text>

            {addressToDelete ? (
              <View className="mt-5 rounded-xl bg-neutral-100 p-4">
                <Text className="text-sm font-black text-primary-900">
                  {formatAddressLabel(addressToDelete)}
                </Text>
                <Text className="mt-2 text-sm leading-6 text-neutral-600">
                  {formatAddressBlock(addressToDelete)}
                </Text>
              </View>
            ) : null}

            <View className="mt-6 flex-row gap-3">
              <Pressable
                className="flex-1 rounded-lg border border-neutral-300 py-4 active:bg-neutral-100"
                onPress={() => setAddressToDelete(null)}
              >
                <Text className="text-center text-xs font-black uppercase tracking-widest text-neutral-600">
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                className="flex-1 rounded-lg bg-red-700 py-4 active:bg-red-800"
                disabled={!addressToDelete || isDeleting === addressToDelete?.id}
                onPress={() =>
                  addressToDelete
                    ? void handleDelete(
                        addressToDelete,
                        defaultAddressId
                          ? addressToDelete.id === defaultAddressId
                          : addresses[0]?.id === addressToDelete.id,
                      )
                    : undefined
                }
              >
                <Text className="text-center text-xs font-black uppercase tracking-widest text-white">
                  {isDeleting === addressToDelete?.id ? "Removing..." : "Remove"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
