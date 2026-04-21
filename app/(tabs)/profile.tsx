import { ContractorProfileScreen } from "@/app/screens/contractor/ContractorScreens";
import { ProfileScreen } from "@/app/screens/profile/ProfileScreen";
import { useAuthStore } from "@/store/authStore";
import { isContractorCustomer } from "@/utils/customerAccess";

export default function ProfileRoute() {
  const customer = useAuthStore((state) => state.customer);

  return isContractorCustomer(customer) ? <ContractorProfileScreen /> : <ProfileScreen />;
}
