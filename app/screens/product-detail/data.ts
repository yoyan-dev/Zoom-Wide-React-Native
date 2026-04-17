import { type ProductSpec, type ProductThumbnail, type RelatedProduct } from "./types";

export const productDetail = {
  title: "REBAR D16 HIGH-TENSILE",
  description:
    "BS 4449:2005 Grade B500B high-tensile carbon steel reinforcement bar for heavy-duty structural concrete casting.",
  price: "$42.50",
  unit: "Per Unit / 12M Length",
  deliveryNote: "FREE DELIVERY FOR BULK ORDERS OVER $2,500",
  stock: "8,400 UNITS IN STOCK",
  warehouse: "Warehouse A1",
  quantity: 120,
  heroImage:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBqgEzZMBOTmVn32x4korUVgSjwlLp6w3e92Mc5piJ0Nk6Imrw0ihxSxPIow2uVAdlFdYoEl_eM2srCmDOoMRzuWKIH45ywZVR0xBk9QiqdwA6uUpFcFNYIhRVr5sM-YnJz5X7lBTRqIVaX-IXyAmij28nUeTyhZyJrulq6cRlwXXYUmr9G5Zxbv4uzUc4-Yvlmu6CJV44uBZPOz3kcOIgBj1rjLurWfLolkBzQNwsLM1HkbVyt_qTj4iDXMuCO0E0csdOo6hfKn6U",
};

export const productBadges = ["Certified Pro", "Bulk Pricing"];

export const productThumbnails: ProductThumbnail[] = [
  {
    id: "surface",
    active: true,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBPIDo5rB2noK9V9sGub4x8kYdjyDqiHNdJteweTRCa4q5eFrxbvV1Pbriiic7o5BrIvtYhlON8TYkbPEV1BOxwmb8m9H5W1WnZhPJ8dxoTfgUVYBIThxfzTn9PAtHhcPrfK4NBQ56HIlVM2dOc31ABpnm7IU9wXKJ0MT20ug3ZEIVVZ4C6YGfE9Vp-D7xkFZavlrjeV8JSqYPBb4N1_Ru-RTFNKVu-WtqtmIka3jHyqSGaFiCCVduZWQtuDoAjmDRSFgeiMrhWsx8",
  },
  {
    id: "blueprint",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBBm3-EbBmGCExZTBnpntZ11Zhh4egymSfX67SYDfdlXbVgK-1gRpQOw7kI5Ws-QCis9gz9DyZBGIldCbSNcAQzjOCcMAzwxwJY1oYmUfTcXFtYYJzCs0BJAj9I1KiFQmKajx0b3Q0_UnESlI2qSwcOFDZ73cJO8r6xP1y2714vIvvRcEFo2Wgze-Opjvx8U6FxZlJbcw-6JEy9vIKNbuZOY0XsS1fa3BcZ-zDFGrJ2c_vXyo9z9SHU17N-F4w_BhmFnj8w47KgcFw",
  },
  { id: "video", icon: "videocam" },
  { id: "model", icon: "3d-rotation" },
];

export const productSpecs: ProductSpec[] = [
  { label: "Diameter", value: "16.0 mm" },
  { label: "Standard", value: "BS 4449:2005" },
  { label: "Nominal Mass", value: "1.58 kg/m" },
  { label: "Yield Strength", value: "500 N/mm2" },
  { label: "Elongation", value: ">= 5.0%" },
];

export const detailCopy = [
  "Designed for professional masonry and structural reinforcement, our D16 Grade B500B steel bars offer exceptional weldability and mechanical properties. These bars are essential for constructing reinforced concrete structures like bridges, multi-story buildings, and high-load foundations.",
  "The unique ribbed surface pattern ensures maximum bonding with concrete, preventing slippage under seismic loads. Every batch undergoes rigorous tensile and chemical testing to ensure compliance with international construction standards.",
];

export const relatedProducts: RelatedProduct[] = [
  {
    id: "portland-cement",
    name: "PORTLAND CEMENT 50KG",
    price: "$12.45",
    status: "In Stock",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB3WK01Scd4GkTtJNyUlHwOEhwo0h5QatLkg7AERTc0S-xZGN6HdcZswyCYXmx8cf-4eiC3MAFpRovRmk2TCSnPH1OlZcpLIsc_ckAI6EJERThNEtL9T_8vXm9ZyVR7AEFxI7eNJErO_NGfxXLqQAu0blDR4HxS2Linm6v_530F1KZiKtCt3K8RC-Q8WKu490qwUdmvR7HjgZfsoQDyGnpj7f7ZJ7lXgkBq1ANy9M9yzZsPXr8CM1_54bo12nidG8Cqk_IAfSssTUs",
  },
  {
    id: "concrete-spacers",
    name: "CONCRETE SPACERS 100PC",
    price: "$28.00",
    status: "Limited",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCwIf3rlSBo56VKRl3jdQGgZq7OcOmfKZuNCeSABPpq0k2FvKhzgNU9ple-D8Al-UCHcRw1oNybAXKRAXa673GueEqJDSCBBnIMJSYduaCu06roujv6iW8nN-wBaJ-XtywkPAO7iGuxqjtVhcpKQSBPN9oiWuS1Xly5ddABzX43ysaMDlkunXrDXvwhocmRKK0HVawe7pWjRTiEbpo17TVNum3RQk4ph5U4aQ-ppIvC1-qrZL2PPg_lxiiwHH7IeXaxarCn5-yJ04c",
  },
  {
    id: "binding-wire",
    name: "BINDING WIRE G16",
    price: "$8.90",
    status: "In Stock",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD_A4Xq39za-BJ-W7vff0hfTTb2eTDjAXav6HYRbo1apCzfN9QzjtHVW2wHFrOe21dwJnpsZjFRc0pD0pwDesxGyCfbWgKOL-dYMV4vlanNE-3As4eDDeYe2YAXiVXZVYlUXmvg-3zwnymSd2YRTjjOshXGCBUGZI59U9h6Kw_bgzQoh1o9gtG7dGXvMDr0C7-W4yQU3r4lKkV_apNqXa8HND0Ge9rSTLj8XxW9SfocR7xzoLzVVGemHLAkAjWUVwLS9S6F3RG9VrQ",
  },
  {
    id: "protective-mesh",
    name: "PROTECTIVE MESH GRID",
    price: "$55.20",
    status: "Ships Fast",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAkXgGm_y_A9hxev0XFMQZyKt63b_rS31TIzm12kd0DfHAuRKVY3HlmvFUdC5Bes0ZbxRtVSS-rSr6tZRgBYBqvreK6qCeYt7LT18xSf6cGAlWhfaXfJ8uFw_ymgxDLOioZYFe3KpoNFbX-e1IbVR9KfFAEtP_GTkt5zhUjVCV7zcFhPQp5ilsg3tGU6mEPvbrctn0mie8hPW-GAmKZThEZyvCmdnt4KQ0u2fqmpXJ-P2tcMq0ijeQEeEdVYSp66vbVHmBo5FGcpR4",
  },
];
