import { type ProductListingItem } from "./types";

export const activeFilters = ["Size: 10mm - 32mm", "In Stock"];

export const steelBarProducts: ProductListingItem[] = [
  {
    id: "high-tensile-rebar-t12",
    name: "High-Tensile Rebar T12",
    specification: "12mm x 6m Length",
    price: "$24.50",
    unit: "/ unit",
    status: "in-stock",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCBRwQGikMUXLGBicmjgqXUzabMOgBKuclf0ZhNroRpw9AW3enKjwci1u42JqIz02Farp2oFXgkCfVPzHWxfCX02geyX3wXnVcXartJEZJnw6DflOWDhL9m8HJ3O7DCuZ1Pvsc9sSVJ_b7Vz4N89EhF_sOlBlAYa6HtwHwk8nI8HbTaHh42LxlCPago2LbtNzMUroZW__jsY24MGLGSz94yQHrTTgNtePMe_ANsbxvCO3wnTQWFSQRSaQPKhQ6kxQN1vzf-on1D-O4",
  },
  {
    id: "standard-grade-rebar-t10",
    name: "Standard Grade Rebar T10",
    specification: "10mm x 6m Length",
    price: "$18.90",
    unit: "/ unit",
    status: "in-stock",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCG5C4LgxtqXldWSYTi9nPbRnxZlZEcSrxt4aycAo0cXz9cLvAzkKoguAmMYw1Un7W2htCCCaFHnlIWmhHdTev-IMhyp7RAIiOGbB_Ih4n18mlLCv5uDlP9HnE1XZI23moW2QED2IGXJQ_54--f4n2b1I5WzntVWLEuOlCZgxIXw_Em_4AvoUWf8ODwv6DtJMIPw6bwcZ4NSr3Uec9UOpTB0v5AqnN0hsNwahA-dWdyl4I7rJc7pGCM24ZnM3uijahGljJFqORi1GM",
  },
  {
    id: "structural-reinforcer-t16",
    name: "Structural Reinforcer T16",
    specification: "16mm x 6m Length",
    price: "$42.00",
    unit: "/ unit",
    status: "limited-stock",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCuaY7EeYk0_dLDgvt4qdmqo07VG2quGetUZIGXaqWhfYBZ3e4N7iHOMVL853ZC4lCNMi8wDTW6YbHWE-brUcn6tbVNFyIykiwXM17teE79yCTQsWD-8YSeqyP6nG-0Y-J4dMj-4RZTJxerioRvU5BMHlbU00ec5plsp40vJWOiqVwbvszE0L-4bECFAngh4PL7ynSfJnlXxmXfk5KbxgOjt89V-pNp2wyRzfwEPGbmvYnshLb4VLrmRHO5tDGj51snVVMlZ4XE5IE",
  },
  {
    id: "heavy-duty-rebar-t25",
    name: "Heavy Duty Rebar T25",
    specification: "25mm x 12m Length",
    price: "$105.00",
    unit: "/ unit",
    status: "in-stock",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD-oNy3g9TNhqUji-7iMVVz2nj6QwY1BHdjVIPh8ox2Pjz1E8TREho3EQ-IXuYem31j_SBYrT7XWENCrTq3F-u7tljoshf28_FFWbdVNQbvXyNmMBU3-z5XqMW4FNJpJlmxuRGsRjT5CTPINTyw6I0bLkdCvuTFSFxuarIp7GTOpo8tm27kxU1lyKvYHybufpoiuhZcF6wWyXiPXqYyQEmwboQEJaP4pXo-pxmiWEnTZlUicurmrRyI5cGiTsjQIHzKCtN2nlIK0ow",
  },
  {
    id: "galvanized-rebar-t10",
    name: "Galvanized Rebar T10",
    specification: "10mm x 6m Corrosion Resistant",
    price: "$31.20",
    unit: "/ unit",
    status: "in-stock",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAENBntIjWyfLvC9JgWiSXAWutyoyvYD5NXMTHcGVOaXEvEPhtyI01bAtiL-1Rql6jD-oFb4Glo58f_VCKYxJoORje6XbSg0j7aH-OFr6du-isrDu2UYI_wWdL7Jymfgdahu6wyzviK0yXNnaqOQe8k6vUtGckSk3BfkxVjH8jtxBn0yP6_AUYOB1WaQGem_pDbP89UBOAzy9GQpczTOaUW61pEmokiqERWOnGhQO8evFt6EG64Emgn5StWZxOKG_BaYN3kxfwwe0Q",
  },
  {
    id: "foundation-mesh-rebar",
    name: "Foundation Mesh Rebar",
    specification: "8mm x 4m Welded Grid",
    price: "$15.75",
    unit: "/ unit",
    status: "out-of-stock",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCHQZB0-hkjPIU1Vukp_DVbUv-hTDSF1eucaED9KbEp3VFlL5Vq-qxOIT-WX2WAP5DgHz0Ol8q2s-UVWRfRzZZXUjnvW8ZTIZSzr3QEFY6l4L1T1s4r0DJHKL-XyrbyaFOiytB1YqVYmeIluX9s2di2JHoOZuTkpn8ptuOivG0zFukqAL7Q9wVDt7i-Vsxkr6mvgcSdWg_2UvP3w5-Ilai631YGt3AduXujuMi3dAOTloifJFINUEeZacYegnJXrd8C7jvFarIg13w",
  },
  {
    id: "industrial-link-rebar-t8",
    name: "Industrial Link Rebar T8",
    specification: "8mm x 6m Coil Option",
    price: "$12.40",
    unit: "/ unit",
    status: "in-stock",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDcOLi3IXKBfF3iJS9YwZb_0-FdEennzR5AjJ-_w5-onbCB8YjEyw6UwV8664YeDZN54aw8nlsCG_yKY3n235IQyxx6Dn1N39Q3UmZNeiY-e-HqrfiW3tZzW6htFZmwlPa-XetSPASCZeNjMsTqFoj1ukvYfWSrOUJ0dCfJ4GIqe0CCsIBk6fnueXP9gN-VbX-qxQ7WDGOHrT2KXaGERov-t3tK64TXH1I28kSZqZFkpYsKJ9AhM8poxKEbCH-uBYF3SbF_zjSadi4",
  },
  {
    id: "mega-structure-rebar-t32",
    name: "Mega-Structure Rebar T32",
    specification: "32mm x 12m Extreme Duty",
    price: "$188.00",
    unit: "/ unit",
    status: "in-stock",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAwHBxxeXhXOEsJep1GE02GKkx6Cu_YRJUkZN6c_nFZhoS9cTWEq-AIs_9vRegcJt0tXR_iN4gYjFFnT1p174n0SbNtFQNh-K9oyICreRj3Oq9tm4XPCN8dXHkLonOG79-WG1fVk7Xdy9oQCRL60H_RgGDyLIv4QHZJN3mSf3XY365cMxfwqWAlvqDF28GCLwzmYleoSUgiiCsrTbOZy6ksedRypjpW7_wq9cSThtoU4dgLTqVT4Q4teemtQJlEx7FxV97faQGVuYM",
  },
];
