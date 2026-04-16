import {
  type OrderDetail,
  type SuccessBenefit,
  type SuccessFooterLink,
} from "./types";

export const orderSuccess = {
  reference: "#ZW-8942-00X",
  title: "Order Placed\nSuccessfully!",
  message:
    "Your architectural supplies are being prepared for dispatch. We've sent a confirmation email to your registered address.",
};

export const orderDetails: OrderDetail[] = [
  { label: "Delivery Date", value: "Oct 24, 2023" },
  { label: "Items Count", value: "12 Units" },
];

export const successBenefits: SuccessBenefit[] = [
  {
    icon: "local-shipping",
    title: "Priority Shipping",
    description: "Standard ground delivery in 3-5 days.",
  },
  {
    icon: "verified",
    title: "Quality Assured",
    description: "Each item inspected for structural integrity.",
  },
  {
    icon: "support-agent",
    title: "24/7 Support",
    description: "Dedicated team for project logistics.",
  },
];

export const footerLinks: SuccessFooterLink[] = [
  { label: "Privacy Policy" },
  { label: "Shipping Terms" },
  { label: "Contact Specs" },
];
