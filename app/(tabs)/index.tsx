import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

const stats = [
  { label: "Bookings", value: "24", color: "bg-sky-100 text-sky-700" },
  { label: "Rooms Ready", value: "18", color: "bg-emerald-100 text-emerald-700" },
  { label: "Requests", value: "7", color: "bg-rose-100 text-rose-700" },
];

const tasks = [
  "Review arrivals before 11:00 AM",
  "Confirm housekeeping room turnover",
  "Send function hall setup notes",
];

export default function HomeScreen() {
  return (
    <ScrollView className="flex-1 bg-zinc-50">
      <View className="px-5 pb-10 pt-6">
        <View className="overflow-hidden rounded-lg bg-white">
          <View className="bg-teal-700 px-5 pb-6 pt-5">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-sm font-semibold uppercase text-teal-100">
                  Today
                </Text>
                <Text className="mt-2 text-3xl font-bold text-white">
                  Welcome back
                </Text>
              </View>
              <Image
                source={require("../../assets/images/icon.png")}
                className="h-16 w-16 rounded-lg"
              />
            </View>
            <Text className="mt-4 text-base leading-6 text-teal-50">
              Keep bookings, housekeeping, and guest requests moving from one
              clean view.
            </Text>
          </View>

          <View className="gap-3 p-4">
            <Pressable className="rounded-lg bg-zinc-950 px-4 py-4 active:bg-zinc-800">
              <View className="flex-row items-center justify-between">
                <Text className="text-base font-semibold text-white">
                  Start daily briefing
                </Text>
                <FontAwesome name="arrow-right" size={16} color="white" />
              </View>
            </Pressable>

            <Pressable className="rounded-lg border border-zinc-200 bg-white px-4 py-4 active:bg-zinc-100">
              <View className="flex-row items-center justify-between">
                <Text className="text-base font-semibold text-zinc-900">
                  View room status
                </Text>
                <FontAwesome name="bed" size={17} color="#18181b" />
              </View>
            </Pressable>
          </View>
        </View>

        <View className="mt-6 flex-row gap-3">
          {stats.map((item) => (
            <View key={item.label} className="flex-1 rounded-lg bg-white p-4">
              <Text className="text-xs font-semibold uppercase text-zinc-500">
                {item.label}
              </Text>
              <Text className="mt-3 text-2xl font-bold text-zinc-950">
                {item.value}
              </Text>
              <Text className={`mt-3 rounded-md px-2 py-1 text-xs ${item.color}`}>
                Live
              </Text>
            </View>
          ))}
        </View>

        <View className="mt-6 rounded-lg bg-white p-5">
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-bold text-zinc-950">Priority List</Text>
            <Text className="text-sm font-semibold text-teal-700">3 tasks</Text>
          </View>

          <View className="mt-4 gap-3">
            {tasks.map((task, index) => (
              <View
                key={task}
                className="flex-row items-center rounded-lg border border-zinc-200 bg-zinc-50 p-3"
              >
                <View className="mr-3 h-8 w-8 items-center justify-center rounded-md bg-amber-100">
                  <Text className="font-bold text-amber-700">{index + 1}</Text>
                </View>
                <Text className="flex-1 text-sm leading-5 text-zinc-800">
                  {task}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View className="mt-6 rounded-lg bg-white p-5">
          <Text className="text-xl font-bold text-zinc-950">Quick Note</Text>
          <Text className="mt-3 text-base leading-6 text-zinc-600">
            Function hall setup is due by 3:00 PM. Confirm chairs, sound check,
            and table layout before guest arrival.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
