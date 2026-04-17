export interface StoreResponse<T = unknown> {
  status: "success" | "error";
  message: string;
  statusMessage: string;
  data?: T | null;
}
