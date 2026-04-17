import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { type ComponentProps } from "react";

export type MaterialIconName = ComponentProps<typeof MaterialIcons>["name"];

export type CheckoutField = {
  editable?: boolean;
  multiline?: boolean;
  label: string;
  placeholder: string;
  value: string;
  keyboardType?: "default" | "email-address" | "number-pad";
  onChangeText?: (value: string) => void;
};

export type PaymentMethod = {
  icon: MaterialIconName;
  label: string;
  selected?: boolean;
};

export type CheckoutItem = {
  id: string;
  image?: string | null;
  name: string;
  spec: string;
  quantity: number;
  price: string;
};

export type CheckoutTotalLine = {
  label: string;
  value: string;
};

export type FooterTrustItem = {
  icon: MaterialIconName;
  label: string;
};
