import { useAuthStore } from "@/store/authStore";
import { isContractorCustomer } from "@/utils/customerAccess";

export function useContractorSession() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const customer = useAuthStore((state) => state.customer);
  const user = useAuthStore((state) => state.user);

  return {
    accessToken,
    customer,
    isContractor: isContractorCustomer(),
    user,
  };
}
