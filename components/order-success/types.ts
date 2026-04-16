import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { type ComponentProps } from "react";

export type MaterialIconName = ComponentProps<typeof MaterialIcons>["name"];

export type OrderDetail = {
  label: string;
  value: string;
};

export type SuccessBenefit = {
  icon: MaterialIconName;
  title: string;
  description: string;
};

export type SuccessFooterLink = {
  label: string;
};
