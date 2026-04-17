import { Image, Text, View } from "react-native";

import {
  productBadges,
  productDetail,
  productSpecs,
  productThumbnails,
} from "../data";
import { DetailBreadcrumbs } from "../ui/DetailBreadcrumbs";
import { ProductBadge } from "../ui/ProductBadge";
import { ProductThumbnail } from "../ui/ProductThumbnail";
import { ProductInfoPanel } from "./ProductInfoPanel";

export function ProductHero() {
  return (
    <View>
      <DetailBreadcrumbs />

      <View className="gap-12">
        <View>
          <View className="relative aspect-square items-center justify-center overflow-hidden rounded-xl bg-neutral-100 p-8">
            <Image
              className="h-full w-full rounded-lg"
              resizeMode="cover"
              source={{ uri: productDetail.heroImage }}
            />
            <View className="absolute left-6 top-6 gap-2">
              {productBadges.map((badge, index) => (
                <ProductBadge
                  key={badge}
                  label={badge}
                  variant={index === 0 ? "accent" : "primary"}
                />
              ))}
            </View>
          </View>

          <View className="mt-6 flex-row gap-4">
            {productThumbnails.map((thumbnail) => (
              <ProductThumbnail key={thumbnail.id} thumbnail={thumbnail} />
            ))}
          </View>
        </View>

        <ProductInfoPanel product={productDetail} specs={productSpecs} />
      </View>
    </View>
  );
}
