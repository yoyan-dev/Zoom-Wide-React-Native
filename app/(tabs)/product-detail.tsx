import { ContractorProductDetailScreen } from "@/app/screens/contractor/ContractorScreens";
import { ProductDetailScreen } from "@/app/screens/product-detail/ProductDetailScreen";
import { useAuthStore } from "@/store/authStore";
import { isContractorCustomer } from "@/utils/customerAccess";

export default function ProductDetailRoute() {
  const customer = useAuthStore((state) => state.customer);

  return isContractorCustomer(customer) ? (
    <ContractorProductDetailScreen />
  ) : (
    <ProductDetailScreen />
  );
}
