import { type CartItem, type SummaryLine } from "./types";

export const cartItems: CartItem[] = [
  {
    id: "reinforced-i-beam",
    category: "Structural",
    name: "Reinforced I-Beam G2",
    description:
      "Hot-rolled carbon steel, 24-foot standard length, corrosion resistant.",
    quantity: 2,
    price: "$1,450.00",
    unitPrice: "$725.00 UNIT",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB39QW_ErmLsomRs_7TmUXQp-FHzK0DmHQ_yrE4O0eJmvdF_Nf-ZrMhtNaG_kf2k4bdYmcg69FOBiJEt-6uaHqtXEpvZ51DqkXaux2xhFNDfM9cHt9Iw-qDo3rv9wle2kGsToEqSnkRDDtcbflNejnfrnM3_1PI1GGlNmbv3v3TxDYchaVxpn-F-fENxnGoXsh0pK27W7MSZHutM5Eh4NrzipHluNjKyY5hRk0uVqkexfsKv4f-XLkNFQeAVQtZGlnrt_HsBd8S4J8",
  },
  {
    id: "mastermix-5000-pro",
    category: "Equipment",
    name: "MasterMix 5000 Pro",
    description:
      "Variable speed, dual-stage motor, anti-vibration ergonomic handle.",
    quantity: 1,
    price: "$899.00",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCQVoBYHPvIcUK7V05Wu_Zmkt9YH9OuZYnEyJgXoy-5azC_dX6RKFFJVlzX4WJMK1FvVwzK5IUL3BQr3YkiHk1n8I0zy-OWEAJWXhR163cLaHNBp-vxK8nfWEI6DAiUfT0NBqJh5rldfnpgP7WeD-r_kZyIeoacjsZ1tQ_mRp5vGOlSX-LG00MziyZsj5ZtbzYTFYj3405KnajNrmOxckE5w3hCn21kGxIKfsThFHKzW9BeRNLrvda_knR0CaRpI9aC5A0FR2j4U0Q",
  },
  {
    id: "titan-shield-kit",
    category: "Safety",
    name: "Titan Shield Kit",
    description:
      "Class A hard hat, impact goggles, and reinforced steel-toe guards.",
    quantity: 5,
    price: "$345.00",
    unitPrice: "$69.00 UNIT",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDIgJGljLtehGv9gpF-tnMGHPHP7yQA2-bzrOzTAFccm1K9AzOBnQqyPi2Ca4Ad9I1rrl6_eIFr8t9FQiC737Fau6HSEzjLGKWH0JwRxtWzX5pUedb8twiKDgWqAqXQ8qY4vLpAxcw7Oq9xtrvdKfIlf68i8h9M1ofMCuPtUyQWHJVHOC9d-ziM39Gev2cgORm0cCCtzMTzSo0su3gRM09Llz-jBtc7_rWTuMJ4YK1RGcEw4-dHEuxY2NP2kOFdltCWt80NsC-QX2M",
  },
];

export const summaryLines: SummaryLine[] = [
  { label: "Subtotal", value: "$2,694.00" },
  { label: "Freight & Handling", value: "FREE", accent: true },
  { label: "Estimated Tax", value: "$215.52" },
];

export const orderTotal = "$2,909.52";
