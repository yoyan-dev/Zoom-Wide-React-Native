import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { type ComponentProps } from "react";

export type MaterialIconName = ComponentProps<typeof MaterialIcons>["name"];

export type ProductSpec = {
  label: string;
  value: string;
};

export type ProductThumbnail = {
  id: string;
  image?: string;
  icon?: MaterialIconName;
  active?: boolean;
};

export type RelatedProduct = {
  id: string;
  name: string;
  price: string;
  status: string;
  image: string;
};
