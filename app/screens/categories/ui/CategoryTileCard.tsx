import { useRouter } from "expo-router";
import { ImageBackground, Pressable, Text, View } from "react-native";

import { categoriesStyles } from "../styles";
import { type CategoryTile } from "../types";

type CategoryTileCardProps = {
  category: CategoryTile;
};

const heightBySize: Record<NonNullable<CategoryTile["size"]>, string> = {
  standard: "h-56",
  wide: "h-48",
  tall: "h-80",
};

export function CategoryTileCard({ category }: CategoryTileCardProps) {
  const router = useRouter();
  const tileHeight = heightBySize[category.size ?? "standard"];

  return (
    <Pressable
      className="flex-1 active:scale-[0.98] active:opacity-90"
      onPress={() => router.push("/products")}
    >
      <View
        className={[
          "overflow-hidden rounded-xl bg-neutral-100",
          tileHeight,
          category.size === "wide" ? "min-w-full" : "min-w-[150px]",
        ].join(" ")}
        style={categoriesStyles.tileShadow}
      >
        <ImageBackground
          className="h-full w-full justify-end"
          imageStyle={categoriesStyles.categoryImage}
          resizeMode="cover"
          source={{ uri: category.image }}
        >
          <View className="absolute inset-0 bg-primary-900 opacity-45" />
          <View className="absolute inset-x-0 bottom-0 h-28 bg-primary-900 opacity-35" />

          <View className={category.size === "wide" ? "p-6" : "p-4"}>
            <Text
              className={[
                "font-black tracking-tight text-white",
                category.size === "wide" ? "text-3xl" : "text-xl",
              ].join(" ")}
            >
              {category.title}
            </Text>
            {category.subtitle ? (
              <Text className="mt-1 text-xs font-bold uppercase tracking-widest text-white/80">
                {category.subtitle}
              </Text>
            ) : null}
          </View>
        </ImageBackground>
      </View>
    </Pressable>
  );
}
