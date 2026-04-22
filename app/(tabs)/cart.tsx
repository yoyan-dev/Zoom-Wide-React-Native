import { CartScreen } from "@/app/screens/cart/CartScreen";
import { ContractorCartScreen } from "@/app/screens/contractor/screens/CartScreen";
import { useAuthStore } from "@/store/authStore";
import { isContractorCustomer } from "@/utils/customerAccess";

export default function CartRoute() {
  const customer = useAuthStore((state) => state.customer);

  return isContractorCustomer() ? <ContractorCartScreen /> : <CartScreen />;
}
