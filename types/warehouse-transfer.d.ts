export type WarehouseTransferStatus =
  | "pending"
  | "approved"
  | "in_transit"
  | "received"
  | "cancelled";

export interface WarehouseTransfer {
  id: string;
  product_id: string;
  source_warehouse: string;
  destination_warehouse: string;
  quantity: number;
  status: WarehouseTransferStatus;
  created_at: string;
}
