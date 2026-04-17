import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { type ComponentProps } from "react";

export type MaterialIconName = ComponentProps<typeof MaterialIcons>["name"];

export type ProfileMetric = {
  label: string;
  value: string;
  variant: "primary" | "surface";
};

export type ProfileOption = {
  icon: MaterialIconName;
  label: string;
  badge?: string;
  destructive?: boolean;
};

export type ProfileOptionGroup = {
  title: string;
  options: ProfileOption[];
};
