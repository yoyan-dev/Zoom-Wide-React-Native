export type CartItem = {
  id: string;
  category: string;
  name: string;
  description: string;
  quantity: number;
  price: string;
  unitPrice?: string;
  image: string;
};

export type SummaryLine = {
  label: string;
  value: string;
  accent?: boolean;
};
