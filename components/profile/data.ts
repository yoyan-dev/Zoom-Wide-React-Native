import { type ProfileMetric, type ProfileOptionGroup } from "./types";

export const profile = {
  name: "Alex Builder",
  role: "Lead Architect • Verified Pro",
  tier: "Platinum Tier",
  badge: "Pro",
  avatar:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCyxmPquo9KFc4-zJ5kapaSNfUV5OJTRP9ObfpH7i0NaIw2d46GRSxWz33hRjxRMjC99RujgGfo-qVh4ruAn0sohP53FH1ei04VjjD9fUO1tzEXjkQyeKYCUHa7LFTu_kc9t8Gxywm6ztLvw_lmTjL0vyybAdwbzf3rzgmNMHy0tvyDFo5efgQ8YlmXrKumuGhUC-FRcLnDkn--8NDfwUNIfBv_8N3MtN8-F5AwLVKgH6DxEgGRwFNIw-w_y4D3Ovr9spGaBDzkOLY",
};

export const profileMetrics: ProfileMetric[] = [
  { label: "Total Orders", value: "128", variant: "primary" },
  { label: "Pro Credits", value: "$2,450", variant: "surface" },
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
      { icon: "help-center", label: "Help Center" },
      { icon: "logout", label: "Logout", destructive: true },
    ],
  },
];
