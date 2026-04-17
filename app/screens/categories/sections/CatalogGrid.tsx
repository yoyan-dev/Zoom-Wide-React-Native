import { View } from "react-native";

import { catalogCategories } from "../data";
import { CategoryTileCard } from "../ui/CategoryTileCard";

export function CatalogGrid() {
  return (
    <View className="gap-6">
      <View className="flex-row flex-wrap gap-6">
        {catalogCategories.map((category) => (
          <View
            className={[
              "flex-1",
              category.size === "wide" ? "min-w-full" : "min-w-[150px]",
            ].join(" ")}
            key={category.id}
          >
            <CategoryTileCard category={category} />
          </View>
        ))}
      </View>
    </View>
  );
}
