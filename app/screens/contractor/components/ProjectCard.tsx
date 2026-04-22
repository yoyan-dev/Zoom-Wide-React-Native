import { StatusPill } from "@/app/screens/contractor/components/StatusPill";
import { PROJECT_STATUS_META } from "@/app/screens/contractor/constants";
import {
  formatDateLabel,
  getProjectStatusLabel,
} from "@/app/screens/contractor/utils";
import type { Project } from "@/types/project";
import { Pressable, Text, View } from "react-native";

export function ProjectCard({
  onPress,
  project,
}: {
  onPress: () => void;
  project: Project;
}) {
  const progress = Math.min(project.progress ?? 0, 100);

  return (
    <Pressable
      onPress={onPress}
      className="w-96 rounded-[16px] bg-white p-5 shadow-md active:opacity-85"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          <Text
            numberOfLines={1}
            className="text-lg font-black text-primary-900"
          >
            {project.name}
          </Text>

          <Text numberOfLines={1} className="mt-1 text-sm text-neutral-500">
            {project.location ?? "Location pending"}
          </Text>
        </View>

        <View className="items-center justify-center">
          <View className="h-14 w-14 rounded-full  items-center justify-center">
            <View
              className="absolute h-14 w-14 rounded-full border-[4px] border-accent-600"
              style={{
                transform: [{ rotate: `${(progress / 100) * 360}deg` }],
                borderTopColor: "#3B82F6",
                borderRightColor: "transparent",
                borderBottomColor: "transparent",
                borderLeftColor: "transparent",
              }}
            />
            <Text className="text-xs font-black text-primary-900">
              {progress}%
            </Text>
          </View>
        </View>
      </View>

      <View className="mt-4 flex-row items-center justify-between">
        <StatusPill
          chipClassName={PROJECT_STATUS_META[project.status].chipClassName}
          label={getProjectStatusLabel(project.status)}
        />

        <Text className="text-xs font-semibold text-neutral-500">
          Due {formatDateLabel(project.end_date)}
        </Text>
      </View>
    </Pressable>
  );
}
