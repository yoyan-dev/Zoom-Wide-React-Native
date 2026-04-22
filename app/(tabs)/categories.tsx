import { CategoriesScreen } from "@/app/screens/categories/CategoriesScreen";
import { ContractorCategoriesScreen } from "@/app/screens/contractor/ContractorScreens";
import { useAuthStore } from "@/store/authStore";
import { isContractorCustomer } from "@/utils/customerAccess";

export default function CategoriesRoute() {
  const customer = useAuthStore((state) => state.customer);

  return isContractorCustomer() ? (
    <ContractorCategoriesScreen />
  ) : (
    <CategoriesScreen />
  );
}
