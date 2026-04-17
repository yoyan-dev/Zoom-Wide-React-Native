import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import * as authApi from "@/services/authApi";
import { useAuthStore } from "@/store/authStore";
import type { UpdateAccountPayload } from "@/types/account";

type ProfileFormValues = {
  company_name: string;
  email: string;
  full_name: string;
  image_url: string;
  license_number: string;
  phone: string;
};

type ProfileFormErrors = Partial<Record<keyof ProfileFormValues, string>>;

function buildInitialValues() {
  const { customer, user } = useAuthStore.getState();

  return {
    company_name: customer?.company_name ?? "",
    email: user?.email ?? "",
    full_name:
      user?.full_name ?? user?.contact_name ?? customer?.contact_name ?? "",
    image_url: user?.image_url ?? "",
    license_number:
      (typeof user?.license_number === "string" ? user.license_number : "") ??
      "",
    phone: user?.phone ?? customer?.phone ?? "",
  };
}

function validateProfile(values: ProfileFormValues) {
  const errors: ProfileFormErrors = {};

  if (!values.full_name.trim()) {
    errors.full_name = "Full name is required.";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/\S+@\S+\.\S+/.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.phone.trim()) {
    errors.phone = "Phone number is required.";
  }

  return errors;
}

function buildPayload(values: ProfileFormValues): UpdateAccountPayload {
  return {
    company_name: values.company_name.trim() || null,
    contact_name: values.full_name.trim() || null,
    email: values.email.trim().toLowerCase(),
    full_name: values.full_name.trim() || null,
    image_url: values.image_url.trim() || null,
    license_number: values.license_number.trim() || null,
    phone: values.phone.trim() || null,
  };
}

export function EditProfileScreen() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);
  const [formValues, setFormValues] = useState<ProfileFormValues>(
    buildInitialValues(),
  );
  const [initialValues, setInitialValues] = useState<ProfileFormValues>(
    buildInitialValues(),
  );
  const [errors, setErrors] = useState<ProfileFormErrors>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      if (!accessToken) {
        if (isMounted) {
          setError("Please sign in again to edit your profile.");
          setIsLoading(false);
        }
        return;
      }

      try {
        const account = await authApi.getAccountProfile(accessToken);
        if (!isMounted) {
          return;
        }

        const nextValues: ProfileFormValues = {
          company_name: account.customer?.company_name ?? "",
          email: account.user.email ?? "",
          full_name:
            account.user.full_name ??
            account.user.contact_name ??
            account.customer?.contact_name ??
            "",
          image_url: account.user.image_url ?? "",
          license_number:
            (typeof account.user.license_number === "string"
              ? account.user.license_number
              : "") ?? "",
          phone: account.user.phone ?? account.customer?.phone ?? "",
        };

        setFormValues(nextValues);
        setInitialValues(nextValues);
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load your account profile.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [accessToken]);

  const isDirty = useMemo(
    () => JSON.stringify(formValues) !== JSON.stringify(initialValues),
    [formValues, initialValues],
  );

  const setFieldValue = (field: keyof ProfileFormValues, value: string) => {
    setFormValues((current) => ({ ...current, [field]: value }));
  };

  const handleDiscard = () => {
    setFormValues(initialValues);
    setErrors({});
    setError(null);
    setMessage(null);
  };

  const handleSave = async () => {
    if (!accessToken || isSaving) {
      return;
    }

    const nextErrors = validateProfile(formValues);
    setErrors(nextErrors);
    setError(null);
    setMessage(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSaving(true);

    try {
      await authApi.updateAccount(accessToken, buildPayload(formValues));
      await fetchCurrentUser();
      setInitialValues(formValues);
      setMessage("Profile updated successfully.");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save your profile changes.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-neutral-50">
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1 bg-primary-900" edges={["top"]}>
        <View className="flex-row items-center justify-between bg-primary-900 px-6 py-4">
          <View className="flex-row items-center gap-4">
            <Pressable
              className="rounded-full p-2 active:opacity-70"
              onPress={() => router.back()}
            >
              <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
            </Pressable>
            <Text className="text-xl font-black tracking-tight text-white">
              Account
            </Text>
          </View>

          <Text className="text-xl font-black uppercase tracking-widest text-white">
            ZOOM WIDE
          </Text>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 pb-32 pt-8"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="mx-auto w-full max-w-2xl">
            <View className="mb-10">
              <Text className="text-3xl font-black tracking-tight text-primary-900">
                Edit Profile
              </Text>
              <Text className="mt-2 text-base font-medium text-neutral-600">
                Manage your professional identity and trade credentials.
              </Text>
            </View>

            {isLoading ? (
              <View className="items-center justify-center rounded-lg bg-white p-8">
                <Text className="text-xs font-black uppercase tracking-widest text-neutral-500">
                  Loading profile
                </Text>
              </View>
            ) : null}

            {!isLoading ? (
              <>
                <View className="mb-12 items-center gap-6 md:items-start">
                  <View className="relative">
                    <View className="h-32 w-32 overflow-hidden rounded-lg bg-neutral-200">
                      {formValues.image_url ? (
                        <Image
                          className="h-full w-full"
                          resizeMode="cover"
                          source={{ uri: formValues.image_url }}
                        />
                      ) : (
                        <View className="h-full w-full items-center justify-center bg-primary-900">
                          <Text className="text-3xl font-black text-white">
                            {formValues.full_name.charAt(0) || "Z"}
                          </Text>
                        </View>
                      )}
                    </View>
                    <View className="absolute -bottom-3 -right-3 h-10 w-10 items-center justify-center rounded-lg bg-accent-600">
                      <MaterialIcons name="edit" size={20} color="#FFFFFF" />
                    </View>
                  </View>
                  <View className="items-center md:items-start">
                    <Text className="text-sm font-black uppercase tracking-widest text-primary-900">
                      Profile Photo
                    </Text>
                    <Text className="mt-1 text-xs font-medium text-neutral-500">
                      Provide an image URL for your account photo.
                    </Text>
                  </View>
                </View>

                <View className="gap-6">
                  {[
                    {
                      field: "image_url" as const,
                      keyboardType: "default" as const,
                      label: "Profile Image URL",
                      placeholder: "https://example.com/profile.jpg",
                    },
                    {
                      field: "full_name" as const,
                      keyboardType: "default" as const,
                      label: "Full Name",
                      placeholder: "Enter full name",
                    },
                    {
                      field: "email" as const,
                      keyboardType: "email-address" as const,
                      label: "Email Address",
                      placeholder: "Enter email",
                    },
                    {
                      field: "phone" as const,
                      keyboardType: "phone-pad" as const,
                      label: "Phone Number",
                      placeholder: "Enter phone number",
                    },
                    {
                      field: "company_name" as const,
                      keyboardType: "default" as const,
                      label: "Company Name",
                      placeholder: "Enter company name",
                    },
                    {
                      field: "license_number" as const,
                      keyboardType: "default" as const,
                      label: "Trade License Number",
                      placeholder: "Enter license number",
                    },
                  ].map((field) => (
                    <View className="gap-2" key={field.field}>
                      <Text className="pl-1 text-sm font-black uppercase tracking-widest text-primary-900">
                        {field.label}
                      </Text>
                      <TextInput
                        autoCapitalize={
                          field.field === "email" || field.field === "image_url"
                            ? "none"
                            : "words"
                        }
                        className="rounded-lg bg-neutral-200 px-5 py-4 text-base font-medium text-neutral-900"
                        keyboardType={field.keyboardType}
                        onChangeText={(value) => setFieldValue(field.field, value)}
                        placeholder={field.placeholder}
                        placeholderTextColor="#737781"
                        value={formValues[field.field]}
                      />
                      {errors[field.field] ? (
                        <Text className="pl-1 text-xs font-semibold text-red-700">
                          {errors[field.field]}
                        </Text>
                      ) : null}
                    </View>
                  ))}
                </View>

                {message ? (
                  <View className="mt-6 rounded-lg bg-green-50 p-4">
                    <Text className="text-sm font-semibold text-green-700">
                      {message}
                    </Text>
                  </View>
                ) : null}

                {error ? (
                  <View className="mt-6 rounded-lg bg-red-50 p-4">
                    <Text className="text-sm font-semibold text-red-700">
                      {error}
                    </Text>
                  </View>
                ) : null}

                <View className="pt-6">
                  <Pressable
                    className="flex-row items-center justify-center gap-3 rounded-lg bg-primary-900 py-4 active:opacity-85"
                    disabled={isSaving}
                    onPress={handleSave}
                  >
                    <MaterialIcons name="save" size={20} color="#FFFFFF" />
                    <Text className="text-sm font-black uppercase tracking-widest text-white">
                      {isSaving ? "Saving Changes..." : "Save Changes"}
                    </Text>
                  </Pressable>
                  <Pressable
                    className="mt-4 rounded-lg border border-neutral-300 py-3 active:bg-white"
                    disabled={!isDirty}
                    onPress={handleDiscard}
                  >
                    <Text className="text-center text-xs font-black uppercase tracking-widest text-neutral-600">
                      Discard Changes
                    </Text>
                  </Pressable>
                </View>
              </>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
