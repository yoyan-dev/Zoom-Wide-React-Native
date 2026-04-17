import { Pressable, Text, View } from "react-native";

import { CheckoutInput } from "../ui/CheckoutInput";
import { CheckoutSectionTitle } from "../ui/CheckoutSectionTitle";
import { type CheckoutField } from "../types";

type CheckoutFormProps = {
  accountFields: CheckoutField[];
  deliveryAddressLines: string[];
  onChangeAddress: () => void;
  noteField: CheckoutField;
};

export function CheckoutForm({
  accountFields,
  deliveryAddressLines,
  onChangeAddress,
  noteField,
}: CheckoutFormProps) {
  return (
    <View className="gap-12">
      <View>
        <CheckoutSectionTitle icon="contact-page" title="Contact Information" />
        <View className="gap-4">
          {accountFields.map((field) => (
            <CheckoutInput field={field} key={field.label} />
          ))}
        </View>
      </View>

      <View>
        <CheckoutSectionTitle icon="location-on" title="Delivery Address" />
        <View className="gap-4">
          <View className="rounded-xl bg-white p-6">
            {deliveryAddressLines.length ? (
              <View className="gap-3">
                {deliveryAddressLines.map((line) => (
                  <Text
                    className="text-sm font-medium leading-6 text-neutral-700"
                    key={line}
                  >
                    {line}
                  </Text>
                ))}
              </View>
            ) : (
              <Text className="text-sm font-medium leading-6 text-neutral-500">
                No default delivery address selected yet.
              </Text>
            )}

            <Pressable
              className="mt-5 self-start rounded-lg border border-primary-200 px-4 py-3 active:bg-primary-50"
              onPress={onChangeAddress}
            >
              <Text className="text-xs font-black uppercase tracking-widest text-primary-900">
                Change Address
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View>
        <CheckoutSectionTitle icon="description" title="Order Notes" />
        <View className="gap-4">
          <CheckoutInput field={noteField} />
        </View>
      </View>
    </View>
  );
}
