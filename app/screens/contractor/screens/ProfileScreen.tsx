import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { ContractorPage } from "@/app/screens/contractor/components/ContractorPage";
import { useAuthStore } from "@/store/authStore";

export function ContractorProfileScreen() {
  const router = useRouter();
  const customer = useAuthStore((state) => state.customer);
  const signOut = useAuthStore((state) => state.signOut);
  const user = useAuthStore((state) => state.user);

  return (
    <ContractorPage>
      <View className="rounded-[32px] bg-primary-900 px-5 pb-5 pt-6">
        <Text className="text-[11px] font-black uppercase tracking-[3px] text-accent-300">
          Contractor profile
        </Text>
        <Text className="mt-3 text-3xl font-black text-white">
          {customer?.contact_name || user?.full_name || "Contractor"}
        </Text>
        <Text className="mt-3 text-sm font-medium leading-6 text-primary-100">
          {customer?.company_name || "Independent contractor account"}
        </Text>
      </View>

      <View className="mt-8 rounded-[30px] bg-white p-5">
        <Text className="text-xl font-black text-primary-900">Account</Text>
        <View className="mt-4 gap-3">
          {[
            {
              label: "User info",
              value: user?.email ?? "No email available",
            },
            {
              label: "Company name",
              value: customer?.company_name ?? "Not provided",
            },
            {
              label: "Saved addresses",
              value: customer?.shipping_address ?? "No delivery address saved",
            },
          ].map((item) => (
            <View className="rounded-[22px] bg-[#F3F5F7] px-4 py-4" key={item.label}>
              <Text className="text-[10px] font-black uppercase tracking-[2px] text-neutral-400">
                {item.label}
              </Text>
              <Text className="mt-2 text-sm font-black text-primary-900">
                {item.value}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View className="mt-6 gap-3">
        {[
          { label: "Edit Profile", route: "/edit-profile" },
          { label: "Saved Addresses", route: "/delivery-addresses" },
          { label: "Security Settings", route: "/security-settings" },
          { label: "Notifications", route: "/notifications" },
        ].map((item) => (
          <Pressable
            className="rounded-[24px] bg-white px-5 py-5 active:opacity-85"
            key={item.label}
            onPress={() => router.push(item.route as never)}
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-base font-black text-primary-900">
                {item.label}
              </Text>
              <MaterialIcons color="#0A2238" name="chevron-right" size={22} />
            </View>
          </Pressable>
        ))}
      </View>

      <Pressable
        className="mt-6 items-center rounded-[24px] bg-rose-600 px-5 py-5 active:opacity-90"
        onPress={() => void signOut()}
      >
        <Text className="text-xs font-black uppercase tracking-[2px] text-white">
          Logout
        </Text>
      </Pressable>
    </ContractorPage>
  );
}
