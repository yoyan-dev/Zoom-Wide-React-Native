export type WarehouseStatus = "active" | "inactive" | "archived";

export interface Warehouse {
  id: string;
  name: string;
  address: string;
  manager_id: string | null;
  capacity: number;
  status: WarehouseStatus;
  created_at: string;
  updated_at: string;
}

export interface FetchWarehouseParams {
  q?: string;
  status?: WarehouseStatus | "";
  page?: number;
  limit?: number;
}

export interface WarehousePagination {
  page?: number;
  limit?: number;
  total?: number;
  total_pages?: number;
}

export interface CreateWarehousePayload {
  name: string;
  address: string;
  manager_id?: string | null;
  capacity: number;
  status?: WarehouseStatus;
}

export interface UpdateWarehousePayload {
  name?: string;
  address?: string;
  manager_id?: string | null;
  capacity?: number;
  status?: WarehouseStatus;
}
