import { ContractorCartScreen } from "@/app/screens/contractor/ContractorScreens";
import { CartScreen } from "@/app/screens/cart/CartScreen";
import { useAuthStore } from "@/store/authStore";
import { isContractorCustomer } from "@/utils/customerAccess";

export default function CartRoute() {
  const customer = useAuthStore((state) => state.customer);

  return isContractorCustomer(customer) ? <ContractorCartScreen /> : <CartScreen />;
}
