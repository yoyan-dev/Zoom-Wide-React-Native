import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, View } from "react-native";

const crumbs = ["Materials", "Structural Steel", "Reinforcing Bar"];

export function DetailBreadcrumbs() {
  return (
    <View className="mb-8 flex-row flex-wrap items-center gap-2">
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;

        return (
          <View className="flex-row items-center gap-2" key={crumb}>
            <Text
              className={[
                "text-sm font-semibold",
                isLast ? "text-neutral-900" : "text-neutral-500",
              ].join(" ")}
            >
              {crumb}
            </Text>
            {!isLast ? (
              <MaterialIcons name="chevron-right" size={14} color="#8E97A3" />
            ) : null}
          </View>
        );
      })}
    </View>
  );
}
