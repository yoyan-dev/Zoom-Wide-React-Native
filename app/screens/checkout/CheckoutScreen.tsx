import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import * as addressesApi from "@/services/addressesApi";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { readDefaultDeliveryAddressId } from "@/store/deliveryAddressStorage";
import type { Address } from "@/types/address";
import { formatPhilippinePeso } from "@/utils/formatCurrency";

import { CheckoutFooter } from "./sections/CheckoutFooter";
import { CheckoutForm } from "./sections/CheckoutForm";
import { CheckoutHeader } from "./sections/CheckoutHeader";
import { CheckoutSummary } from "./sections/CheckoutSummary";
import { type CheckoutField, type CheckoutItem, type CheckoutTotalLine } from "./types";

function formatAddressLines(address: Address) {
  return [
    address.address_line?.trim() || "Default Delivery Address",
    address.street,
    [address.city, address.province, address.postal_code].filter(Boolean).join(", "),
    address.country ?? "Philippines",
  ].filter(Boolean);
}

function findDefaultAddress(
  addresses: Address[],
  defaultAddressId?: string | null,
) {
  if (defaultAddressId) {
    const matchedAddress = addresses.find(
      (address) => address.id === defaultAddressId,
    );
    if (matchedAddress) {
      return matchedAddress;
    }
  }

  return addresses[0] ?? null;
}

export function CheckoutScreen() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const customer = useAuthStore((state) => state.customer);
  const user = useAuthStore((state) => state.user);
  const checkout = useCartStore((state) => state.checkout);
  const error = useCartStore((state) => state.error);
  const isCheckingOut = useCartStore((state) => state.isCheckingOut);
  const isLoading = useCartStore((state) => state.isLoading);
  const items = useCartStore((state) => state.items);
  const loadCart = useCartStore((state) => state.loadCart);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [defaultAddressId, setDefaultAddressId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  useFocusEffect(
    useCallback(() => {
      void loadCart();
      void (async () => {
        if (!accessToken || !customer?.id) {
          return;
        }

        try {
          const storedDefaultAddressId = await readDefaultDeliveryAddressId(
            customer.id,
          );
          const nextAddresses = await addressesApi.fetchCustomerAddresses(
            accessToken,
            customer.id,
          );
          setDefaultAddressId(storedDefaultAddressId);
          setAddresses(nextAddresses);
        } catch {
          setDefaultAddressId(null);
        }
      })();
    }, [accessToken, customer?.id, loadCart]),
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + (item.price ?? item.unit_price ?? 0) * item.quantity,
        0,
      ),
    [items],
  );

  const accountFields: CheckoutField[] = [
    {
      editable: false,
      label: "Full Name",
      placeholder: "Full name",
      value:
        user?.full_name ??
        user?.contact_name ??
        customer?.contact_name ??
        "",
    },
    {
      editable: false,
      keyboardType: "email-address",
      label: "Email Address",
      placeholder: "Email address",
      value: user?.email ?? customer?.email ?? "",
    },
    {
      editable: false,
      label: "Phone Number",
      placeholder: "Phone number",
      value: user?.phone ?? customer?.phone ?? "",
    },
  ];

  const noteField: CheckoutField = {
    label: "Delivery / Order Notes",
    multiline: true,
    onChangeText: setNotes,
    placeholder: "Add delivery instructions, preferred contact timing, or purchase order notes.",
    value: notes,
  };

  const summaryItems: CheckoutItem[] = items.map((item) => ({
    id: item.id ?? item.product_id,
    image: item.image_url,
    name: item.name ?? item.sku ?? item.product_id,
    price: formatPhilippinePeso(
      (item.price ?? item.unit_price ?? null)
        ? (item.price ?? item.unit_price ?? 0) * item.quantity
        : null,
    ),
    quantity: item.quantity,
    spec: [item.sku ? `SKU: ${item.sku}` : null, item.unit ? `Unit: ${item.unit}` : null]
      .filter(Boolean)
      .join(" • "),
  }));

  const summaryLines: CheckoutTotalLine[] = [
    { label: "Subtotal", value: formatPhilippinePeso(subtotal) },
    { label: "Freight & Handling", value: "Calculated after order review" },
  ];
  const defaultAddress = findDefaultAddress(addresses, defaultAddressId);
  const deliveryAddressLines = defaultAddress
    ? formatAddressLines(defaultAddress)
    : [];

  const handleSubmit = async () => {
    if (items.length === 0) {
      return;
    }

    try {
      await checkout(notes.trim() || undefined);
      router.replace("/order-success");
    } catch {
      // Error state is rendered in the summary panel.
    }
  };

  return (
    <View className="flex-1 bg-neutral-50">
      <CheckoutHeader />

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 py-10"
        showsVerticalScrollIndicator={false}
      >
        <View className="mx-auto w-full max-w-6xl gap-12">
          {items.length === 0 && !isLoading ? (
            <View className="rounded-xl border border-neutral-200 bg-white p-8">
              <Text className="text-2xl font-black uppercase tracking-tight text-primary-900">
                Your cart is empty
              </Text>
              <Text className="mt-3 text-sm font-medium leading-6 text-neutral-600">
                Add items to your cart before submitting an order for review.
              </Text>
              <Pressable
                className="mt-6 self-start rounded-lg bg-primary-900 px-5 py-4 active:bg-primary-800"
                onPress={() => router.push("/categories")}
              >
                <Text className="text-xs font-black uppercase tracking-widest text-white">
                  Browse Catalog
                </Text>
              </Pressable>
            </View>
          ) : (
            <>
              <CheckoutForm
                accountFields={accountFields}
                deliveryAddressLines={deliveryAddressLines}
                onChangeAddress={() => router.push("/delivery-addresses")}
                noteField={noteField}
              />
              <CheckoutSummary
                error={error}
                isSubmitting={isCheckingOut}
                items={summaryItems}
                lines={summaryLines}
                onSubmit={handleSubmit}
                total={formatPhilippinePeso(subtotal)}
              />
            </>
          )}
        </View>

        <CheckoutFooter />
      </ScrollView>
    </View>
  );
}
