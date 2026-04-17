import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { type ComponentProps } from "react";

export type MaterialIconName = ComponentProps<typeof MaterialIcons>["name"];

export type TrackingStepStatus = "complete" | "current" | "pending";

export type TrackingStep = {
  title: string;
  timestamp: string;
  description?: string;
  icon: MaterialIconName;
  status: TrackingStepStatus;
};

export type PackageItem = {
  id: string;
  name: string;
  sku: string;
  price: string;
  image: string;
};

export type DeliveryAddress = {
  name: string;
  lines: string[];
  mapImage: string;
};

export type TrackingOrderSummary = {
  orderNumber: string;
  estimatedArrival: string;
  totalWeight: string;
};
