import { ContractorCheckoutScreen } from "@/app/screens/contractor/ContractorScreens";
import { CheckoutScreen } from "@/app/screens/checkout/CheckoutScreen";
import { useAuthStore } from "@/store/authStore";
import { isContractorCustomer } from "@/utils/customerAccess";

export default function CheckoutRoute() {
  const customer = useAuthStore((state) => state.customer);

  return isContractorCustomer(customer) ? <ContractorCheckoutScreen /> : <CheckoutScreen />;
}
