import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, View } from "react-native";

export function RatingStars() {
  return (
    <View className="my-6 flex-row flex-wrap items-center gap-4">
      <View className="flex-row items-center">
        {[0, 1, 2, 3].map((index) => (
          <MaterialIcons key={index} name="star" size={22} color="#D87412" />
        ))}
        <MaterialIcons name="star-half" size={22} color="#D87412" />
      </View>
      <Text className="text-sm font-black uppercase tracking-tight text-neutral-500">
        (128 Verified Reviews)
      </Text>
    </View>
  );
}
