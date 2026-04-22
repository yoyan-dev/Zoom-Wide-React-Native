import { ContractorOrdersScreen } from "@/app/screens/contractor/ContractorScreens";
import { OrderHistoryScreen } from "@/app/screens/orders/OrderHistoryScreen";
import { useAuthStore } from "@/store/authStore";
import { isContractorCustomer } from "@/utils/customerAccess";

export default function OrdersRoute() {
  const customer = useAuthStore((state) => state.customer);

  return isContractorCustomer() ? (
    <ContractorOrdersScreen />
  ) : (
    <OrderHistoryScreen />
  );
}
