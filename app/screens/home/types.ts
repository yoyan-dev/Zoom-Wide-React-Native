import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { type ComponentProps } from "react";

export type MaterialIconName = ComponentProps<typeof MaterialIcons>["name"];

export type Product = {
  id: string;
  title: string;
  description: string;
  price: string;
  unit?: string;
  image: string;
  featured?: boolean;
};
