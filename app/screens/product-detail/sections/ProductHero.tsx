import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image, Text, View } from "react-native";

import type { Product } from "@/types/product";

import { DetailBreadcrumbs } from "../ui/DetailBreadcrumbs";
import { ProductBadge } from "../ui/ProductBadge";
import { ProductThumbnail } from "../ui/ProductThumbnail";
import { ProductInfoPanel } from "./ProductInfoPanel";

type ProductHeroProps = {
  product: Product;
};

function getProductBadges(product: Product) {
  const badges = [];

  if (product.is_active !== false) {
    badges.push("Available");
  }

  if (product.category?.name) {
    badges.push(product.category.name);
  }

  return badges.length > 0 ? badges.slice(0, 2) : ["ZOOM WIDE"];
}

function getProductThumbnails(product: Product) {
  return [
    {
      active: true,
      id: "product",
      image: product.image_url ?? undefined,
    },
    {
      id: "category",
      image: product.category?.image_url,
    },
  ].filter((thumbnail) => thumbnail.image);
}

export function ProductHero({ product }: ProductHeroProps) {
  const badges = getProductBadges(product);
  const thumbnails = getProductThumbnails(product);

  return (
    <View>
      <DetailBreadcrumbs product={product} />

      <View className="gap-12">
        <View>
          <View className="relative aspect-square items-center justify-center overflow-hidden rounded-xl bg-neutral-100 p-8">
            {product.image_url ? (
              <Image
                className="h-full w-full rounded-lg"
                resizeMode="cover"
                source={{ uri: product.image_url }}
              />
            ) : (
              <View className="h-full w-full items-center justify-center rounded-lg bg-neutral-200">
                <MaterialIcons name="inventory-2" size={72} color="#8E97A3" />
              </View>
            )}
            <View className="absolute left-6 top-6 gap-2">
              {badges.map((badge, index) => (
                <ProductBadge
                  key={badge}
                  label={badge}
                  variant={index === 0 ? "accent" : "primary"}
                />
              ))}
            </View>
          </View>

          {thumbnails.length > 0 ? (
            <View className="mt-6 flex-row gap-4">
              {thumbnails.map((thumbnail) => (
                <ProductThumbnail key={thumbnail.id} thumbnail={thumbnail} />
              ))}
            </View>
          ) : null}
        </View>

        <ProductInfoPanel product={product} />
      </View>
    </View>
  );
}
