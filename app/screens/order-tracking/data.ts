import { type DeliveryAddress, type PackageItem, type TrackingStep } from "./types";

export const trackingOrder = {
  orderNumber: "#ZW-882910",
  estimatedArrival: "Oct 24, 2023",
  totalWeight: "2,450 KG",
};

export const trackingSteps: TrackingStep[] = [
  {
    title: "Order Placed",
    timestamp: "October 18, 2023 - 09:42 AM",
    description:
      "Your order for heavy-duty industrial framing has been received and is being processed by our sales team.",
    icon: "check-circle",
    status: "complete",
  },
  {
    title: "Confirmed",
    timestamp: "October 18, 2023 - 11:15 AM",
    description:
      "Inventory verified. Payment successful. Order is scheduled for manufacturing and picking.",
    icon: "verified",
    status: "complete",
  },
  {
    title: "Preparing for Shipment",
    timestamp: "Current status - Oct 20, 2023",
    description:
      "Items are being secured on pallets and shrink-wrapped for transit. Estimated dispatch in 4 hours.",
    icon: "inventory",
    status: "current",
  },
  {
    title: "Out for Delivery",
    timestamp: "Expected October 22",
    icon: "local-shipping",
    status: "pending",
  },
  {
    title: "Delivered",
    timestamp: "Pending arrival",
    icon: "home",
    status: "pending",
  },
];

export const deliveryAddress: DeliveryAddress = {
  name: "Alex Builder",
  lines: [
    "882 Architect Way, Steel District",
    "North Port Industrial Park",
    "Chicago, IL 60601",
  ],
  mapImage:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA3a4VI_cVMHvpFdVvxuw_0NGF8c2JTR3R0rtOSEutQwdFTuX9x_IjWNb-DmUb_KkExvU0zYOgPQDm293beLTArYSDN9nHwf-BI8eRikAEjymMK4HtDHzMwsQn0ggAHoksG3gjmI5L3sZP9cGnwIclGT4g9aTytUhrMv_4-VIOM7cyjdij24eVATPDy_MLMG_hu3PUTLNqMYA1hjAuLOukIyzUCuap327fFWTuAco0jujdnq5-U_aZIFHXMHQBmybna3d-Nwdc6fvc",
};

export const packageItems: PackageItem[] = [
  {
    id: "beam-set",
    name: "Structural I-Beam Set (x12)",
    sku: "ZW-STR-449",
    price: "\u20B14,250.00",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDe7NbCn0VO0MQKM4IrnVRzJY1L90HxjQeWl8A2Qz4ksDzVXSPaH554xzyjrlCszepQbbeZl6Ycon6YIJ2UIclGHC9-R4YmpXGmQZ_ZswFDaS9jv6vqv1G9tELBy7L9VZF9c1zdtYJgUy3Kc7iKThhQEJsUK_cMDy4-03HgSMAwAoLedReHvUwH2JwRUvwEUskRJS2nz4PdlgdFx1G1BLKtuxpTrdHtbZJZomNOHNadMO55-rdHFhJBGrkoFhPLjIb8J2Nb5QP7exA",
  },
  {
    id: "anchors",
    name: "Concrete Anchors Bulk (200pk)",
    sku: "ZW-ANC-112",
    price: "\u20B1185.00",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAH1vdSnuJ7De7o3F3Pl_H4fH7NyWw-xAEBTeF62PgxI3KDzUZ0LfVXd_8nGdYLOhLz947MG5H3RAiycoYuHH__jZ5Qxv5Mu2IpNn1fnNFnG8a6Ot4DjVHqKKVLzwjYz8ajH75--Dwao0PdTLDz-SazhtK0hDVJ2AYzYLhGsmRJ3ZzVD5Dje0efVvuCI1JKFL-r9PhK-PBi5u9pR8sq9cvzixqxJ1qckN2b-lTeAeTC3K-sf3iIqYrmGfFQTKvHTwcQ36UmhQVNZa8",
  },
];
