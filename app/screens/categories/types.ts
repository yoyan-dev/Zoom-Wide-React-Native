import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { type ComponentProps } from "react";

export type MaterialIconName = ComponentProps<typeof MaterialIcons>["name"];

export type CategoryTile = {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  size?: "standard" | "wide" | "tall";
};

export type TradeBenefit = {
  icon: MaterialIconName;
  label: string;
};
