import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import type { ContractorPaymentMethod } from "@/store/contractorOrderStore";
import type { Project } from "@/types/project";

export const PAYMENT_OPTIONS: Array<{
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: ContractorPaymentMethod;
}> = [
  {
    description: "Fast confirmation for online project payments.",
    icon: "account-balance-wallet",
    label: "GCash",
    value: "gcash",
  },
  {
    description: "Settle payment when the materials arrive on site.",
    icon: "payments",
    label: "Cash",
    value: "cash",
  },
  {
    description: "Use your company or personal card for checkout.",
    icon: "credit-card",
    label: "Card",
    value: "card",
  },
];

export const PROJECT_STATUS_META: Record<
  Project["status"],
  { chipClassName: string; label: string }
> = {
  active: { chipClassName: "bg-emerald-100", label: "Active" },
  cancelled: { chipClassName: "bg-rose-100", label: "Cancelled" },
  completed: { chipClassName: "bg-sky-100", label: "Completed" },
  on_hold: { chipClassName: "bg-amber-100", label: "On Hold" },
};
