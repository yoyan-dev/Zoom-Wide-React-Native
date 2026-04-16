import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image, View } from "react-native";

import { type ProductThumbnail as ProductThumbnailType } from "../types";

type ProductThumbnailProps = {
  thumbnail: ProductThumbnailType;
};

export function ProductThumbnail({ thumbnail }: ProductThumbnailProps) {
  return (
    <View
      className={[
        "aspect-square flex-1 items-center justify-center rounded-lg bg-white p-2",
        thumbnail.active ? "border-2 border-primary-900" : "border-2 border-neutral-200",
      ].join(" ")}
    >
      {thumbnail.image ? (
        <Image
          className={[
            "h-full w-full rounded-md",
            thumbnail.active ? "" : "opacity-60",
          ].join(" ")}
          resizeMode="cover"
          source={{ uri: thumbnail.image }}
        />
      ) : null}
      {thumbnail.icon ? (
        <MaterialIcons name={thumbnail.icon} size={26} color="#737781" />
      ) : null}
    </View>
  );
}
