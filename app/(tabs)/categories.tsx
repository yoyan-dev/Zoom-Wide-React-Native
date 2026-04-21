import { ContractorCategoriesScreen } from "@/app/screens/contractor/ContractorScreens";
import { CategoriesScreen } from "@/app/screens/categories/CategoriesScreen";
import { useAuthStore } from "@/store/authStore";
import { isContractorCustomer } from "@/utils/customerAccess";

export default function CategoriesRoute() {
  const customer = useAuthStore((state) => state.customer);

  return isContractorCustomer(customer) ? (
    <ContractorCategoriesScreen />
  ) : (
    <CategoriesScreen />
  );
}
