import type { Customer } from "@/types/customer";

export function isContractorCustomer(customer: Customer | null | undefined) {
  return customer?.customer_type === "contractor";
}
