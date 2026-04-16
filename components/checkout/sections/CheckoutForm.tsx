import { View } from "react-native";

import {
  addressFields,
  cardFields,
  contactFields,
  paymentMethods,
} from "../data";
import { CheckoutInput } from "../ui/CheckoutInput";
import { CheckoutSectionTitle } from "../ui/CheckoutSectionTitle";
import { PaymentMethodCard } from "../ui/PaymentMethodCard";

export function CheckoutForm() {
  return (
    <View className="gap-12">
      <View>
        <CheckoutSectionTitle icon="contact-page" title="Contact Information" />
        <View className="gap-4">
          {contactFields.map((field) => (
            <CheckoutInput field={field} key={field.label} />
          ))}
        </View>
      </View>

      <View>
        <CheckoutSectionTitle icon="location-on" title="Delivery Address" />
        <View className="gap-4">
          {addressFields.map((field) => (
            <CheckoutInput field={field} key={field.label} />
          ))}
        </View>
      </View>

      <View>
        <CheckoutSectionTitle icon="payments" title="Payment Method" />
        <View className="gap-4">
          <View className="flex-row flex-wrap gap-4">
            {paymentMethods.map((method) => (
              <PaymentMethodCard key={method.label} method={method} />
            ))}
          </View>

          <View className="gap-4 rounded-lg bg-neutral-100 p-6">
            {cardFields.map((field) => (
              <CheckoutInput field={field} key={field.label} />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}
