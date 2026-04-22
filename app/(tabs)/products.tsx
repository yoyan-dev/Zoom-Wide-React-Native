import { ContractorProductListingScreen } from "@/app/screens/contractor/ContractorScreens";
import { ProductListingScreen } from "@/app/screens/products/ProductListingScreen";
import { useAuthStore } from "@/store/authStore";
import { isContractorCustomer } from "@/utils/customerAccess";

export default function ProductsRoute() {
  const customer = useAuthStore((state) => state.customer);

  return isContractorCustomer() ? (
    <ContractorProductListingScreen />
  ) : (
    <ProductListingScreen />
  );
}
