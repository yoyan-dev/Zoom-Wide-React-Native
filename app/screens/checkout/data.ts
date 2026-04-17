import {
  type CheckoutField,
  type CheckoutItem,
  type CheckoutTotalLine,
  type FooterTrustItem,
  type PaymentMethod,
} from "./types";

export const contactFields: CheckoutField[] = [
  {
    label: "Full Name",
    placeholder: "Alex Builder",
  },
  {
    label: "Email Address",
    placeholder: "alex.b@architecture.com",
    keyboardType: "email-address",
  },
];

export const addressFields: CheckoutField[] = [
  {
    label: "Street Address",
    placeholder: "123 Industrial Way, Sector 7G",
  },
  {
    label: "City",
    placeholder: "Metropolis",
  },
  {
    label: "State",
    placeholder: "NY",
  },
  {
    label: "ZIP Code",
    placeholder: "10001",
    keyboardType: "number-pad",
  },
];

export const paymentMethods: PaymentMethod[] = [
  { icon: "credit-card", label: "Credit Card", selected: true },
  { icon: "account-balance", label: "Bank Transfer" },
  { icon: "local-shipping", label: "COD" },
];

export const cardFields: CheckoutField[] = [
  {
    label: "Card Number",
    placeholder: "0000 0000 0000 0000",
    keyboardType: "number-pad",
  },
  {
    label: "Expiry Date",
    placeholder: "MM / YY",
    keyboardType: "number-pad",
  },
  {
    label: "CVV",
    placeholder: "***",
    keyboardType: "number-pad",
  },
];

export const checkoutItems: CheckoutItem[] = [
  {
    id: "reinforced-i-beam",
    name: "Reinforced I-Beam 12m",
    spec: "Technical Grade A42",
    quantity: 2,
    price: "$1,240.00",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAZGB6AUjOLWSazquaccfF4o9JQUek9HJCtsWWWv2OC0ycrFs0u7tG_YvpYVSVHgxQtqvJYCYKWoWzGis_TXo7Ebz37XdVUIziNCMtOWARVkX8rkSxiOzejoHXm2coRds7Cw93_Sszx4-k30Qg_mi4WzgR-EqWdRv9AnJ_UXCflnmtf7bcWew7Cyw0E-guvfKyi-yMmKZ8TaApBz3XjUhOymuR4djdazIJlOp0hj6MiaS8mj7EI6iT8o0Nzgb3NoxuSYZue4BrodhE",
  },
  {
    id: "precision-laser-level",
    name: "Precision Laser Level",
    spec: "Digital Auto-Calibrate",
    quantity: 1,
    price: "$450.00",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDkvyt9LerH90fHnBL6-_wKXamLL9do0KXbIpcXskK5bvN7JWzfUjfXf7kGWB_e60x3aYFC1b_agGPTXLfsFvOTMJiRJ-1rr4VrQbRZcaUFlwgcdlIaMU2gC4yEA8F08h4jWTXcW3fFitifXRoy3MThgmEIvPsMC5T14pJArcZuDr8gA6Si-2zO678lCASBeLPIJ-2sVNsDhzlVNKf8oSGRtCY2xXdcdzjc_hO2qBSAgT8i8vsg3hVfnnTVbvR-MoZW4unT08zJ5Bs",
  },
];

export const checkoutTotals: CheckoutTotalLine[] = [
  { label: "Subtotal", value: "$1,690.00" },
  { label: "Shipping Standard", value: "$45.00" },
  { label: "Industrial Tax 5%", value: "$84.50" },
];

export const grandTotal = "$1,819.50";

export const footerTrustItems: FooterTrustItem[] = [
  { icon: "support-agent", label: "24/7 Field Support" },
  { icon: "policy", label: "Privacy Protocol" },
];
