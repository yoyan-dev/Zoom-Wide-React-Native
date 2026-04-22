import { useAuthStore } from "@/store/authStore";

export function isContractorCustomer() {
  const user = useAuthStore((state) => state.user);
  return user?.customer_type === "contractor";
  // return true;
}
