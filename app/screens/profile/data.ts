import { type ProfileMetric, type ProfileOptionGroup } from "./types";

export const profileMetrics: ProfileMetric[] = [
  { label: "Total Orders", value: "128", variant: "primary" },
];

export const profileOptionGroups: ProfileOptionGroup[] = [
  {
    title: "Account Management",
    options: [
      { icon: "history", label: "Order History" },
      { icon: "location-on", label: "Saved Addresses" },
      { icon: "favorite", label: "Wishlist" },
      { icon: "notifications", label: "Notifications", badge: "3" },
    ],
  },
  {
    title: "Support & Safety",
    options: [
      { icon: "settings", label: "Settings" },
      { icon: "security", label: "Security Settings" },
      { icon: "help-center", label: "Help Center" },
      { icon: "logout", label: "Logout", destructive: true },
    ],
  },
];
