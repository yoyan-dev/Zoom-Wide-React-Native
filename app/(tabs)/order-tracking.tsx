import { ContractorOrderTrackingScreen } from "@/app/screens/contractor/ContractorScreens";
import { OrderTrackingScreen } from "@/app/screens/order-tracking/OrderTrackingScreen";
import { useAuthStore } from "@/store/authStore";
import { isContractorCustomer } from "@/utils/customerAccess";

export default function OrderTrackingRoute() {
  const customer = useAuthStore((state) => state.customer);

  return isContractorCustomer() ? (
    <ContractorOrderTrackingScreen />
  ) : (
    <OrderTrackingScreen />
  );
}
