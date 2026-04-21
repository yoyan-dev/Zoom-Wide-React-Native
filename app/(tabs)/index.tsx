import { ContractorDashboardScreen } from "@/app/screens/contractor/ContractorScreens";
import { HomeScreen } from "@/app/screens/home/HomeScreen";
import { useAuthStore } from "@/store/authStore";
import { isContractorCustomer } from "@/utils/customerAccess";

export default function HomeRoute() {
  const customer = useAuthStore((state) => state.customer);
  return isContractorCustomer(customer) ? (
    <ContractorDashboardScreen />
  ) : (
    <HomeScreen />
  );
}
