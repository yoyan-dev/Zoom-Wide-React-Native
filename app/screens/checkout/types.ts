import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { type ComponentProps } from "react";

export type MaterialIconName = ComponentProps<typeof MaterialIcons>["name"];

export type CheckoutField = {
  label: string;
  placeholder: string;
  keyboardType?: "default" | "email-address" | "number-pad";
};

export type PaymentMethod = {
  icon: MaterialIconName;
  label: string;
  selected?: boolean;
};

export type CheckoutItem = {
  id: string;
  name: string;
  spec: string;
  quantity: number;
  price: string;
  image: string;
};

export type CheckoutTotalLine = {
  label: string;
  value: string;
};

export type FooterTrustItem = {
  icon: MaterialIconName;
  label: string;
};
