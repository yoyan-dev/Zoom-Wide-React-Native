import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthStore } from "@/store/authStore";
import type { CustomerType, RegisterPayload } from "@/types/auth";

type FormFieldName = Exclude<
  keyof RegisterPayload,
  "role" | "customer_type"
> | "confirmPassword";

type SignUpValues = Record<FormFieldName, string> & {
  customer_type: CustomerType;
};

type SignUpErrors = Partial<Record<FormFieldName | "customer_type", string>>;

type FieldConfig = {
  autoComplete?: "email" | "name" | "organization" | "tel" | "street-address";
  keyboardType?: "default" | "email-address" | "phone-pad";
  label: string;
  name: FormFieldName;
  placeholder: string;
  required?: boolean;
  secure?: boolean;
};

const SIGN_UP_FIELDS: FieldConfig[] = [
  {
    autoComplete: "email",
    keyboardType: "email-address",
    label: "Email address",
    name: "email",
    placeholder: "customer@example.com",
    required: true,
  },
  {
    label: "Password",
    name: "password",
    placeholder: "Create a strong password",
    required: true,
    secure: true,
  },
  {
    label: "Confirm password",
    name: "confirmPassword",
    placeholder: "Repeat password",
    required: true,
    secure: true,
  },
  {
    autoComplete: "organization",
    label: "Company name",
    name: "company_name",
    placeholder: "ABC Trading",
    required: true,
  },
  {
    autoComplete: "name",
    label: "Contact name",
    name: "contact_name",
    placeholder: "Jane Doe",
    required: true,
  },
  {
    autoComplete: "tel",
    keyboardType: "phone-pad",
    label: "Phone",
    name: "phone",
    placeholder: "+63 900 000 0000",
  },
];

const INITIAL_VALUES: Record<FormFieldName, string> = {
  billing_address: "",
  company_name: "",
  confirmPassword: "",
  contact_name: "",
  email: "",
  password: "",
  phone: "",
  shipping_address: "",
};

const CUSTOMER_TYPE_OPTIONS: Array<{
  description: string;
  label: string;
  value: CustomerType;
}> = [
  {
    description: "Buy materials for home, business, or general supply needs.",
    label: "Customer",
    value: "customer",
  },
  {
    description: "Manage project-based purchases as a trade or construction account.",
    label: "Contractor",
    value: "contractor",
  },
];

function validateSignUp(values: SignUpValues) {
  const errors: SignUpErrors = {};

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/\S+@\S+\.\S+/.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (values.password.length < 8) {
    errors.password = "Use at least 8 characters.";
  }

  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (
    values.customer_type === "contractor" &&
    !values.company_name.trim()
  ) {
    errors.company_name = "Company name is required.";
  }

  if (!values.contact_name.trim()) {
    errors.contact_name = "Contact name is required.";
  }

  return errors;
}

function toRegisterPayload(values: SignUpValues): RegisterPayload {
  return {
    billing_address: values.billing_address.trim() || null,
    company_name: values.company_name.trim() || null,
    contact_name: values.contact_name.trim(),
    customer_type: values.customer_type,
    email: values.email.trim().toLowerCase(),
    password: values.password,
    phone: values.phone.trim() || null,
    role: "customer",
    shipping_address: values.shipping_address.trim() || null,
  };
}

export function SignUpScreen() {
  const router = useRouter();
  const isLoading = useAuthStore((state) => state.isLoading);
  const rememberSession = useAuthStore((state) => state.rememberSession);
  const setRememberSession = useAuthStore((state) => state.setRememberSession);
  const signUp = useAuthStore((state) => state.signUp);
  const [values, setValues] = useState<SignUpValues>({
    ...INITIAL_VALUES,
    customer_type: "customer",
  });
  const [errors, setErrors] = useState<SignUpErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const setFieldValue = (name: FormFieldName, value: string) => {
    setValues((current) => ({ ...current, [name]: value }));
  };

  const setCustomerType = (customerType: CustomerType) => {
    setValues((current) => ({ ...current, customer_type: customerType }));
    setErrors((current) => ({ ...current, company_name: undefined }));
  };

  const handleSubmit = async () => {
    if (isLoading) {
      return;
    }

    const nextErrors = validateSignUp(values);
    setErrors(nextErrors);
    setSubmitError(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      await signUp(toRegisterPayload(values), rememberSession);
      router.replace("/");
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to create your account. Please try again.",
      );
    }
  };

  return (
    <View className="flex-1 bg-primary-900">
      <StatusBar style="light" translucent />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <SafeAreaView className="flex-1">
            <View className="relative flex-1 overflow-hidden px-6 pb-8 pt-8">
              <View pointerEvents="none" style={StyleSheet.absoluteFill}>
                <View className="absolute inset-0 bg-primary-900" />
                <View className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary-500 opacity-20" />
                <View className="absolute -bottom-14 -right-20 h-64 w-64 rounded-full bg-accent-500 opacity-15" />
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <View className="items-center justify-center ">
                    <Image
                      accessibilityLabel="ZOOM WIDE logo"
                      className="h-16 w-16"
                      resizeMode="contain"
                      source={require("../../../../public/app-icon.png")}
                    />
                  </View>
                  <View>
                    <Text className="text-[10px] font-black uppercase tracking-widest text-accent-300">
                      Trade access
                    </Text>
                    <Text className="text-2xl font-black uppercase tracking-widest text-white">
                      ZOOM WIDE
                    </Text>
                  </View>
                </View>

                <Link asChild href="/login">
                  <Pressable className="rounded-lg border border-white/30 px-4 py-2 active:bg-white/10">
                    <Text className="text-[10px] font-black uppercase tracking-widest text-white">
                      Login
                    </Text>
                  </Pressable>
                </Link>
              </View>

              <View className="mt-10">
                <Text className="text-[11px] font-black uppercase tracking-widest text-primary-100">
                  Customer registration
                </Text>
                <Text className="mt-3 text-4xl font-black leading-tight text-white">
                  Apply for your project supply account.
                </Text>
              </View>

              <View
                className="mt-8 rounded-lg bg-white p-5"
                style={styles.formShadow}
              >
                <View className="gap-5">
                  <View className="gap-3">
                    <Text className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                      Account type *
                    </Text>
                    <View className="gap-3">
                      {CUSTOMER_TYPE_OPTIONS.map((option) => {
                        const isSelected =
                          values.customer_type === option.value;

                        return (
                          <Pressable
                            className={[
                              "rounded-lg border px-4 py-4",
                              isSelected
                                ? "border-accent-600 bg-accent-50"
                                : "border-neutral-200 bg-white",
                            ].join(" ")}
                            disabled={isLoading}
                            key={option.value}
                            onPress={() => setCustomerType(option.value)}
                          >
                            <Text
                              className={[
                                "text-sm font-black uppercase tracking-widest",
                                isSelected
                                  ? "text-accent-700"
                                  : "text-neutral-700",
                              ].join(" ")}
                            >
                              {option.label}
                            </Text>
                            <Text className="mt-1 text-sm font-medium leading-5 text-neutral-500">
                              {option.description}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>

                  {SIGN_UP_FIELDS.map((field) => {
                    const isPasswordField =
                      field.name === "password" ||
                      field.name === "confirmPassword";
                    const isCompanyField = field.name === "company_name";
                    const isRequired =
                      field.required &&
                      (!isCompanyField ||
                        values.customer_type === "contractor");
                    const fieldLabel = isCompanyField
                      ? values.customer_type === "contractor"
                        ? "Company name"
                        : "Company name (optional)"
                      : field.label;

                    return (
                      <View className="gap-2" key={field.name}>
                        <Text className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                          {fieldLabel}
                          {isRequired ? " *" : ""}
                        </Text>
                        <View className="flex-row items-center rounded-lg bg-neutral-100 px-4">
                          <TextInput
                            autoCapitalize={
                              field.keyboardType === "email-address"
                                ? "none"
                                : "words"
                            }
                            autoComplete={field.autoComplete}
                            className="flex-1 py-4 text-base font-semibold text-neutral-900"
                            editable={!isLoading}
                            keyboardType={field.keyboardType ?? "default"}
                            onChangeText={(value) =>
                              setFieldValue(field.name, value)
                            }
                            placeholder={field.placeholder}
                            placeholderTextColor="#8E97A3"
                            secureTextEntry={field.secure && !showPassword}
                            value={values[field.name]}
                          />
                          {isPasswordField ? (
                            <Pressable
                              accessibilityRole="button"
                              className="p-1"
                              onPress={() =>
                                setShowPassword((current) => !current)
                              }
                            >
                              <MaterialIcons
                                color="#667080"
                                name={
                                  showPassword ? "visibility-off" : "visibility"
                                }
                                size={22}
                              />
                            </Pressable>
                          ) : null}
                        </View>
                        {errors[field.name] ? (
                          <Text className="text-xs font-semibold text-red-700">
                            {errors[field.name]}
                          </Text>
                        ) : null}
                      </View>
                    );
                  })}

                  <Pressable
                    className="flex-row items-center gap-3"
                    onPress={() => setRememberSession(!rememberSession)}
                  >
                    <View
                      className={[
                        "h-5 w-5 items-center justify-center rounded border",
                        rememberSession
                          ? "border-accent-600 bg-accent-600"
                          : "border-neutral-300 bg-white",
                      ].join(" ")}
                    >
                      {rememberSession ? (
                        <MaterialIcons name="check" size={15} color="#FFFFFF" />
                      ) : null}
                    </View>
                    <Text className="text-sm font-bold text-neutral-700">
                      Keep me logged in after approval
                    </Text>
                  </Pressable>

                  {submitError ? (
                    <View className="rounded-lg bg-red-50 p-3">
                      <Text className="text-sm font-semibold text-red-700">
                        {submitError}
                      </Text>
                    </View>
                  ) : null}

                  <Pressable
                    className={[
                      "items-center rounded-lg bg-accent-600 px-5 py-4",
                      isLoading ? "opacity-70" : "active:opacity-85",
                    ].join(" ")}
                    disabled={isLoading}
                    onPress={handleSubmit}
                  >
                    <Text className="text-sm font-black uppercase tracking-widest text-white">
                      {isLoading ? "Creating account..." : "Create account"}
                    </Text>
                  </Pressable>

                  <Text className="text-center text-xs font-semibold leading-5 text-neutral-500">
                    @zoomwide © 2026 All rights reserved.
                  </Text>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  formShadow: {
    elevation: 16,
    shadowColor: "#000000",
    shadowOffset: { height: 18, width: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
  },
});
