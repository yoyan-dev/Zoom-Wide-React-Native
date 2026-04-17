import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import * as addressesApi from "@/services/addressesApi";
import {
  fetchBarangaysByLocality,
  fetchCitiesMunicipalitiesByProvince,
  fetchCitiesMunicipalitiesByRegion,
  fetchProvincesByRegion,
  fetchRegions,
  type PSGCBarangay,
  type PSGCLocality,
  type PSGCProvince,
  type PSGCRegion,
} from "@/services/psgcApi";
import { useAuthStore } from "@/store/authStore";
import type { Address, AddressPayload } from "@/types/address";

type AddressFormValues = {
  address_line: string;
  country: string;
  postal_code: string;
  street: string;
};

type AddressFormErrors = Partial<
  Record<
    keyof AddressFormValues | "barangayCode" | "cityCode" | "provinceCode" | "regionCode",
    string
  >
>;

type PickerTarget = "region" | "province" | "locality" | "barangay" | null;

type PickerOption = {
  description?: string;
  key: string;
  label: string;
};

const heroImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuABWfd8Px9tamNDwF1eHldNQi9KYvabOkgWvnQ51X4kN9iv8HRzgkkkeFzdJQdkTOyz2Aj4eNJOIJ4L9OaqbP8it-H6kIeOpA-DXs5L0U8EWuAXy-eLcYy9xI7mubTFYIaQsuOo_Hqips7ARPJFt_1W2OrdEUk5Xs8inm48_dL6sOgE1hlRvFTWrrmA0Cika9Eahyf_xPWErx8UmVJGijkMHz1eFN9nqv804enQrMfahmuqjphVBp5bCuEYZeCdB8xZ0rMXHX0o6wo";

const emptyValues: AddressFormValues = {
  address_line: "",
  country: "Philippines",
  postal_code: "",
  street: "",
};

function normalizeText(value?: string | null) {
  return value?.replace(/\s+/g, " ").trim().toLowerCase() ?? "";
}

function splitStreetAndBarangay(
  street: string,
  barangays: PSGCBarangay[],
): { barangayCode: string | null; street: string } {
  const normalizedStreet = street.trim();

  for (const barangay of barangays) {
    const candidates = [barangay.name, barangay.oldName].filter(Boolean) as string[];

    for (const candidate of candidates) {
      if (!candidate) {
        continue;
      }

      const prefix = `${candidate}, `;

      if (normalizedStreet.startsWith(prefix)) {
        return {
          barangayCode: barangay.code,
          street: normalizedStreet.slice(prefix.length),
        };
      }
    }
  }

  return {
    barangayCode: null,
    street: normalizedStreet,
  };
}

function validateAddress({
  barangayCode,
  cityCode,
  formValues,
  provinceCode,
  regionCode,
}: {
  barangayCode: string | null;
  cityCode: string | null;
  formValues: AddressFormValues;
  provinceCode: string | null;
  regionCode: string | null;
}) {
  const errors: AddressFormErrors = {};

  if (!formValues.address_line.trim()) {
    errors.address_line = "Address label is required.";
  }

  if (!regionCode) {
    errors.regionCode = "Select a region.";
  }

  if (!provinceCode) {
    errors.provinceCode = "Select a province or regional area.";
  }

  if (!cityCode) {
    errors.cityCode = "Select a city or municipality.";
  }

  if (!barangayCode) {
    errors.barangayCode = "Select a barangay.";
  }

  if (!formValues.street.trim()) {
    errors.street = "Street address is required.";
  }

  return errors;
}

function buildPayload({
  barangay,
  formValues,
  locality,
  province,
  region,
}: {
  barangay: PSGCBarangay | null;
  formValues: AddressFormValues;
  locality: PSGCLocality | null;
  province: PSGCProvince | null;
  region: PSGCRegion | null;
}): AddressPayload {
  const streetParts = [barangay?.name, formValues.street.trim()].filter(Boolean);

  return {
    address_line: formValues.address_line.trim() || null,
    city: locality?.name ?? "",
    country: formValues.country.trim() || null,
    postal_code:
      formValues.postal_code.trim() ||
      locality?.zip_code?.trim() ||
      null,
    province: province?.name ?? region?.name ?? "",
    street: streetParts.join(", "),
  };
}

type PickerModalProps = {
  isLoading?: boolean;
  onClose: () => void;
  onSelect: (key: string) => void;
  open: boolean;
  options: PickerOption[];
  title: string;
};

function PickerModal({
  isLoading,
  onClose,
  onSelect,
  open,
  options,
  title,
}: PickerModalProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  const filteredOptions = useMemo(() => {
    const normalizedQuery = normalizeText(query);

    if (!normalizedQuery) {
      return options;
    }

    return options.filter((option) =>
      normalizeText(`${option.label} ${option.description ?? ""}`).includes(
        normalizedQuery,
      ),
    );
  }, [options, query]);

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
      transparent
      visible={open}
    >
      <View className="flex-1 justify-end bg-black/35">
        <View className="max-h-[80%] rounded-t-3xl bg-white px-6 pb-10 pt-6">
          <View className="mb-5 flex-row items-center justify-between">
            <Text className="text-xl font-black text-primary-900">{title}</Text>
            <Pressable className="rounded-full p-2 active:opacity-70" onPress={onClose}>
              <MaterialIcons name="close" size={22} color="#002A58" />
            </Pressable>
          </View>

          <TextInput
            className="mb-4 rounded-lg bg-neutral-100 px-4 py-3 text-base font-medium text-neutral-900"
            onChangeText={setQuery}
            placeholder="Search options"
            placeholderTextColor="#8E97A3"
            value={query}
          />

          {isLoading ? (
            <View className="items-center justify-center py-10">
              <ActivityIndicator color="#002A58" />
              <Text className="mt-3 text-xs font-black uppercase tracking-widest text-neutral-500">
                Loading options
              </Text>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="gap-3 pb-4">
                {filteredOptions.map((option) => (
                  <Pressable
                    className="rounded-xl bg-neutral-100 px-4 py-4 active:bg-neutral-200"
                    key={option.key}
                    onPress={() => onSelect(option.key)}
                  >
                    <Text className="text-base font-black text-primary-900">
                      {option.label}
                    </Text>
                    {option.description ? (
                      <Text className="mt-1 text-sm font-medium text-neutral-500">
                        {option.description}
                      </Text>
                    ) : null}
                  </Pressable>
                ))}

                {!filteredOptions.length ? (
                  <View className="rounded-xl bg-neutral-100 px-4 py-5">
                    <Text className="text-sm font-medium text-neutral-500">
                      No matching options found.
                    </Text>
                  </View>
                ) : null}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

function SelectionField({
  disabled,
  error,
  helper,
  label,
  onPress,
  value,
}: {
  disabled?: boolean;
  error?: string;
  helper?: string;
  label: string;
  onPress: () => void;
  value: string;
}) {
  return (
    <View className="gap-2">
      <Text className="px-1 text-xs font-black uppercase tracking-wider text-neutral-400">
        {label}
      </Text>
      <Pressable
        className={[
          "flex-row items-center justify-between rounded-lg px-4 py-4",
          disabled ? "bg-neutral-100" : "bg-neutral-200 active:bg-neutral-300",
        ].join(" ")}
        disabled={disabled}
        onPress={onPress}
      >
        <Text
          className={[
            "flex-1 text-base font-medium",
            value ? "text-neutral-900" : "text-neutral-500",
          ].join(" ")}
        >
          {value || helper || "Select an option"}
        </Text>
        <MaterialIcons
          color={disabled ? "#A3AAB5" : "#002A58"}
          name="keyboard-arrow-down"
          size={22}
        />
      </Pressable>
      {error ? (
        <Text className="text-xs font-semibold text-red-700">{error}</Text>
      ) : null}
    </View>
  );
}

export function DeliveryAddressFormScreen() {
  const params = useLocalSearchParams<{ address_id?: string }>();
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const customer = useAuthStore((state) => state.customer);
  const user = useAuthStore((state) => state.user);
  const [formValues, setFormValues] = useState<AddressFormValues>(emptyValues);
  const [errors, setErrors] = useState<AddressFormErrors>({});
  const [isLoading, setIsLoading] = useState(Boolean(params.address_id));
  const [isSaving, setIsSaving] = useState(false);
  const [isHydratingSelections, setIsHydratingSelections] = useState(false);
  const [hasHydratedSelections, setHasHydratedSelections] = useState(false);
  const [isLoadingRegions, setIsLoadingRegions] = useState(true);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [isLoadingLocalities, setIsLoadingLocalities] = useState(false);
  const [isLoadingBarangays, setIsLoadingBarangays] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [regions, setRegions] = useState<PSGCRegion[]>([]);
  const [provinces, setProvinces] = useState<PSGCProvince[]>([]);
  const [localities, setLocalities] = useState<PSGCLocality[]>([]);
  const [barangays, setBarangays] = useState<PSGCBarangay[]>([]);
  const [regionCode, setRegionCode] = useState<string | null>(null);
  const [provinceCode, setProvinceCode] = useState<string | null>(null);
  const [localityCode, setLocalityCode] = useState<string | null>(null);
  const [barangayCode, setBarangayCode] = useState<string | null>(null);
  const [pickerTarget, setPickerTarget] = useState<PickerTarget>(null);
  const [loadedAddress, setLoadedAddress] = useState<Address | null>(null);

  const addressId =
    typeof params.address_id === "string" && params.address_id.length > 0
      ? params.address_id
      : null;
  const isEditing = Boolean(addressId);

  const selectedRegion =
    regions.find((region) => region.code === regionCode) ?? null;
  const selectedProvince =
    provinces.find((province) => province.code === provinceCode) ?? null;
  const selectedLocality =
    localities.find((locality) => locality.code === localityCode) ?? null;
  const selectedBarangay =
    barangays.find((barangay) => barangay.code === barangayCode) ?? null;

  const contactName = useMemo(
    () =>
      user?.full_name ??
      user?.contact_name ??
      customer?.contact_name ??
      "",
    [customer?.contact_name, user?.contact_name, user?.full_name],
  );

  const pickerOptions = useMemo<PickerOption[]>(() => {
    switch (pickerTarget) {
      case "region":
        return regions.map((region) => ({
          key: region.code,
          label: region.name,
        }));
      case "province":
        return provinces.map((province) => ({
          key: province.code,
          label: province.name,
        }));
      case "locality":
        return localities.map((locality) => ({
          description: locality.type === "city" ? "City" : "Municipality",
          key: locality.code,
          label: locality.name,
        }));
      case "barangay":
        return barangays.map((barangay) => ({
          key: barangay.code,
          label: barangay.name,
        }));
      default:
        return [];
    }
  }, [barangays, localities, pickerTarget, provinces, regions]);

  const pickerTitle = useMemo(() => {
    switch (pickerTarget) {
      case "region":
        return "Select Region";
      case "province":
        return "Select Province";
      case "locality":
        return "Select City or Municipality";
      case "barangay":
        return "Select Barangay";
      default:
        return "Select Option";
    }
  }, [pickerTarget]);

  const isPickerLoading =
    (pickerTarget === "region" && isLoadingRegions) ||
    (pickerTarget === "province" && isLoadingProvinces) ||
    (pickerTarget === "locality" && isLoadingLocalities) ||
    (pickerTarget === "barangay" && isLoadingBarangays);

  const setFieldValue = (field: keyof AddressFormValues, value: string) => {
    setFormValues((current) => ({ ...current, [field]: value }));
  };

  const loadRegionsData = async () => {
    setIsLoadingRegions(true);

    try {
      const nextRegions = await fetchRegions();
      setRegions(nextRegions);
    } finally {
      setIsLoadingRegions(false);
    }
  };

  useEffect(() => {
    void loadRegionsData();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadAddress = async () => {
      if (!isEditing) {
        setIsLoading(false);
        return;
      }

      if (!accessToken || !customer?.id || !addressId) {
        if (isMounted) {
          setError("Please sign in again to manage delivery addresses.");
          setIsLoading(false);
        }
        return;
      }

      try {
        const address = await addressesApi.fetchCustomerAddress(
          accessToken,
          customer.id,
          addressId,
        );

        if (!isMounted) {
          return;
        }

        setLoadedAddress(address);
        setHasHydratedSelections(false);
        setFormValues({
          address_line: address.address_line ?? "",
          country: address.country ?? "Philippines",
          postal_code: address.postal_code ?? "",
          street: address.street ?? "",
        });
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load this delivery address.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadAddress();

    return () => {
      isMounted = false;
    };
  }, [accessToken, addressId, customer?.id, isEditing]);

  useEffect(() => {
    if (
      !loadedAddress ||
      !regions.length ||
      isHydratingSelections ||
      hasHydratedSelections
    ) {
      return;
    }

    let isMounted = true;

    const hydrateSelections = async () => {
      setIsHydratingSelections(true);

      try {
        let matchedRegion: PSGCRegion | null =
          regions.find((region) => normalizeText(region.name) === normalizeText(loadedAddress.province)) ??
          null;
        let matchedProvince: PSGCProvince | null = null;
        let matchedProvinces: PSGCProvince[] = [];

        if (!matchedRegion) {
          for (const region of regions) {
            const regionProvinces = await fetchProvincesByRegion(region.code).catch(
              () => [],
            );
            const province = regionProvinces.find(
              (item) =>
                normalizeText(item.name) === normalizeText(loadedAddress.province),
            );

            if (province) {
              matchedRegion = region;
              matchedProvince = province;
              matchedProvinces = regionProvinces;
              break;
            }
          }
        }

        if (!matchedRegion) {
          return;
        }

        if (isMounted) {
          setRegionCode(matchedRegion.code);
        }

        if (!matchedProvince) {
          matchedProvinces = await fetchProvincesByRegion(matchedRegion.code).catch(
            () => [],
          );
          matchedProvince =
            matchedProvinces.find(
              (item) =>
                normalizeText(item.name) === normalizeText(loadedAddress.province),
            ) ?? null;
        }

        if (isMounted) {
          setProvinces(matchedProvinces);
          setProvinceCode(matchedProvince?.code ?? matchedRegion.code);
        }

        const nextLocalities = matchedProvince
          ? await fetchCitiesMunicipalitiesByProvince(matchedProvince.code)
          : await fetchCitiesMunicipalitiesByRegion(matchedRegion.code);

        const matchedLocality =
          nextLocalities.find(
            (item) =>
              normalizeText(item.name) === normalizeText(loadedAddress.city),
          ) ?? null;

        if (isMounted) {
          setLocalities(nextLocalities);
          setLocalityCode(matchedLocality?.code ?? null);
        }

        if (!matchedLocality) {
          return;
        }

        const nextBarangays = await fetchBarangaysByLocality(
          matchedLocality.code,
          matchedLocality.type,
        ).catch(() => []);
        const streetParts = splitStreetAndBarangay(
          loadedAddress.street ?? "",
          nextBarangays,
        );

        if (isMounted) {
          setBarangays(nextBarangays);
          setBarangayCode(streetParts.barangayCode);
          setFormValues((current) => ({
            ...current,
            postal_code:
              current.postal_code || matchedLocality.zip_code?.trim() || "",
            street: streetParts.street,
          }));
        }
      } finally {
        if (isMounted) {
          setHasHydratedSelections(true);
          setIsHydratingSelections(false);
        }
      }
    };

    void hydrateSelections();

    return () => {
      isMounted = false;
    };
  }, [hasHydratedSelections, isHydratingSelections, loadedAddress, regions]);

  const handleSelectRegion = async (nextRegionCode: string) => {
    setPickerTarget(null);
    setRegionCode(nextRegionCode);
    setProvinceCode(null);
    setLocalityCode(null);
    setBarangayCode(null);
    setErrors((current) => ({
      ...current,
      barangayCode: undefined,
      cityCode: undefined,
      provinceCode: undefined,
      regionCode: undefined,
    }));
    setLocalities([]);
    setBarangays([]);
    setError(null);

    setIsLoadingProvinces(true);
    setIsLoadingLocalities(true);

    try {
      const nextProvinces = await fetchProvincesByRegion(nextRegionCode).catch(
        () => [],
      );
      setProvinces(nextProvinces);

      if (!nextProvinces.length) {
        const nextLocalities = await fetchCitiesMunicipalitiesByRegion(nextRegionCode);
        setLocalities(nextLocalities);
        const matchedRegion =
          regions.find((region) => region.code === nextRegionCode) ?? null;
        setProvinceCode(matchedRegion?.code ?? null);
      }
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load provinces for this region.",
      );
    } finally {
      setIsLoadingProvinces(false);
      setIsLoadingLocalities(false);
    }
  };

  const handleSelectProvince = async (nextProvinceCode: string) => {
    setPickerTarget(null);
    setProvinceCode(nextProvinceCode);
    setLocalityCode(null);
    setBarangayCode(null);
    setErrors((current) => ({
      ...current,
      barangayCode: undefined,
      cityCode: undefined,
      provinceCode: undefined,
    }));
    setBarangays([]);
    setError(null);

    setIsLoadingLocalities(true);

    try {
      const nextLocalities = await fetchCitiesMunicipalitiesByProvince(
        nextProvinceCode,
      );
      setLocalities(nextLocalities);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load cities and municipalities.",
      );
    } finally {
      setIsLoadingLocalities(false);
    }
  };

  const handleSelectLocality = async (nextLocalityCode: string) => {
    setPickerTarget(null);
    setLocalityCode(nextLocalityCode);
    setBarangayCode(null);
    setErrors((current) => ({
      ...current,
      barangayCode: undefined,
      cityCode: undefined,
    }));
    setError(null);

    const locality =
      localities.find((item) => item.code === nextLocalityCode) ?? null;

    if (!locality) {
      return;
    }

    if (!formValues.postal_code.trim() && locality.zip_code) {
      setFieldValue("postal_code", locality.zip_code);
    }

    setIsLoadingBarangays(true);

    try {
      const nextBarangays = await fetchBarangaysByLocality(
        locality.code,
        locality.type,
      );
      setBarangays(nextBarangays);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load barangays for this city or municipality.",
      );
    } finally {
      setIsLoadingBarangays(false);
    }
  };

  const handleSelectBarangay = (nextBarangayCode: string) => {
    setPickerTarget(null);
    setBarangayCode(nextBarangayCode);
    setErrors((current) => ({
      ...current,
      barangayCode: undefined,
    }));
  };

  const handlePickerSelect = (key: string) => {
    switch (pickerTarget) {
      case "region":
        void handleSelectRegion(key);
        break;
      case "province":
        void handleSelectProvince(key);
        break;
      case "locality":
        void handleSelectLocality(key);
        break;
      case "barangay":
        handleSelectBarangay(key);
        break;
      default:
        break;
    }
  };

  const handleSave = async () => {
    if (!accessToken || !customer?.id || isSaving) {
      return;
    }

    const nextErrors = validateAddress({
      barangayCode,
      cityCode: localityCode,
      formValues,
      provinceCode,
      regionCode,
    });
    setErrors(nextErrors);
    setError(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSaving(true);

    try {
      const payload = buildPayload({
        barangay: selectedBarangay,
        formValues,
        locality: selectedLocality,
        province: selectedProvince,
        region: selectedRegion,
      });

      if (isEditing && addressId) {
        await addressesApi.updateCustomerAddress(
          accessToken,
          customer.id,
          addressId,
          payload,
        );
      } else {
        await addressesApi.createCustomerAddress(accessToken, customer.id, payload);
      }

      router.replace("/delivery-addresses");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save this delivery address.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-neutral-50">
      <StatusBar style="dark" />
      <SafeAreaView className="bg-primary-900" edges={["top"]}>
        <View className="flex-row items-center justify-between bg-primary-900 px-6 py-4">
          <View className="flex-row items-center gap-4">
            <Pressable
              className="rounded-full p-2 active:opacity-70"
              onPress={() => router.back()}
            >
              <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
            </Pressable>
            <Text className="text-xl font-black tracking-tight text-white">
              Delivery Addresses
            </Text>
          </View>

          <Pressable className="rounded-full p-2 active:opacity-70">
            <MaterialIcons name="add-location-alt" size={24} color="#FFFFFF" />
          </Pressable>
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
              <View className="relative mb-6 h-48 overflow-hidden rounded-xl">
                <Image
                  className="h-full w-full"
                  resizeMode="cover"
                  source={{ uri: heroImage }}
                />
                <View className="absolute inset-0 bg-primary-900/40" />
                <View className="absolute bottom-4 left-4">
                  <Text className="text-xs font-black uppercase tracking-[3px] text-white/80">
                    Site Logistics
                  </Text>
                  <Text className="mt-1 text-2xl font-black text-white">
                    {isEditing ? "Update Project Point" : "New Project Point"}
                  </Text>
                </View>
              </View>

              <Text className="text-base font-medium leading-7 text-neutral-600">
                Define a precise delivery destination for your industrial
                components. Accuracy keeps your crew moving without downtime.
              </Text>
            </View>

            {isLoading ? (
              <View className="rounded-xl bg-white p-8">
                <Text className="text-xs font-black uppercase tracking-widest text-neutral-500">
                  Loading address
                </Text>
              </View>
            ) : null}

            {!isLoading ? (
              <View className="gap-8">
                <View className="gap-4">
                  <View className="flex-row items-center gap-2">
                    <MaterialIcons color="#002A58" name="badge" size={18} />
                    <Text className="text-sm font-black uppercase tracking-widest text-primary-900">
                      Contact Information
                    </Text>
                  </View>

                  <View className="gap-6">
                    <View className="gap-2">
                      <Text className="px-1 text-xs font-black uppercase tracking-wider text-neutral-400">
                        Full Name
                      </Text>
                      <TextInput
                        className="rounded-lg bg-neutral-200 px-4 py-3 text-base font-medium text-neutral-600"
                        editable={false}
                        value={contactName}
                      />
                    </View>

                    <View className="gap-2">
                      <Text className="px-1 text-xs font-black uppercase tracking-wider text-neutral-400">
                        Phone Number
                      </Text>
                      <TextInput
                        className="rounded-lg bg-neutral-200 px-4 py-3 text-base font-medium text-neutral-600"
                        editable={false}
                        value={user?.phone ?? customer?.phone ?? ""}
                      />
                    </View>
                  </View>
                </View>

                <View className="gap-4">
                  <View className="flex-row items-center gap-2">
                    <MaterialIcons color="#002A58" name="location-on" size={18} />
                    <Text className="text-sm font-black uppercase tracking-widest text-primary-900">
                      Site Coordinates
                    </Text>
                  </View>

                  <View className="gap-6">
                    <View className="gap-2">
                      <Text className="px-1 text-xs font-black uppercase tracking-wider text-neutral-400">
                        Address Label
                      </Text>
                      <TextInput
                        className="rounded-lg bg-neutral-200 px-4 py-3 text-base font-medium text-neutral-900"
                        onChangeText={(value) => setFieldValue("address_line", value)}
                        placeholder="Regional Distribution Hub"
                        placeholderTextColor="#8E97A3"
                        value={formValues.address_line}
                      />
                      {errors.address_line ? (
                        <Text className="text-xs font-semibold text-red-700">
                          {errors.address_line}
                        </Text>
                      ) : null}
                    </View>

                    <SelectionField
                      error={errors.regionCode}
                      helper="Choose a region"
                      label="Region"
                      onPress={() => setPickerTarget("region")}
                      value={selectedRegion?.name ?? ""}
                    />

                    <SelectionField
                      disabled={!regionCode}
                      error={errors.provinceCode}
                      helper={
                        provinces.length
                          ? "Choose a province"
                          : regionCode
                            ? "This region has no provinces"
                            : "Select a region first"
                      }
                      label="Province / State"
                      onPress={() =>
                        provinces.length ? setPickerTarget("province") : undefined
                      }
                      value={
                        provinces.length
                          ? (selectedProvince?.name ?? "")
                          : (selectedRegion?.name ?? "")
                      }
                    />

                    <SelectionField
                      disabled={!regionCode || (!provinceCode && provinces.length > 0)}
                      error={errors.cityCode}
                      helper="Choose a city or municipality"
                      label="City / Municipality"
                      onPress={() => setPickerTarget("locality")}
                      value={selectedLocality?.name ?? ""}
                    />

                    <SelectionField
                      disabled={!localityCode}
                      error={errors.barangayCode}
                      helper="Choose a barangay"
                      label="Barangay"
                      onPress={() => setPickerTarget("barangay")}
                      value={selectedBarangay?.name ?? ""}
                    />

                    <View className="gap-2">
                      <Text className="px-1 text-xs font-black uppercase tracking-wider text-neutral-400">
                        Street Address
                      </Text>
                      <TextInput
                        className="rounded-lg bg-neutral-200 px-4 py-3 text-base font-medium text-neutral-900"
                        onChangeText={(value) => setFieldValue("street", value)}
                        placeholder="Building, lot, gate, or street details"
                        placeholderTextColor="#8E97A3"
                        value={formValues.street}
                      />
                      {errors.street ? (
                        <Text className="text-xs font-semibold text-red-700">
                          {errors.street}
                        </Text>
                      ) : null}
                    </View>

                    <View className="gap-2">
                      <Text className="px-1 text-xs font-black uppercase tracking-wider text-neutral-400">
                        ZIP Code
                      </Text>
                      <TextInput
                        className="rounded-lg bg-neutral-200 px-4 py-3 text-base font-medium text-neutral-900"
                        keyboardType="number-pad"
                        onChangeText={(value) => setFieldValue("postal_code", value)}
                        placeholder="1100"
                        placeholderTextColor="#8E97A3"
                        value={formValues.postal_code}
                      />
                    </View>

                    <View className="gap-2">
                      <Text className="px-1 text-xs font-black uppercase tracking-wider text-neutral-400">
                        Country
                      </Text>
                      <TextInput
                        className="rounded-lg bg-neutral-200 px-4 py-3 text-base font-medium text-neutral-900"
                        onChangeText={(value) => setFieldValue("country", value)}
                        placeholder="Philippines"
                        placeholderTextColor="#8E97A3"
                        value={formValues.country}
                      />
                    </View>
                  </View>
                </View>

                {isHydratingSelections ? (
                  <View className="rounded-lg bg-white p-4">
                    <Text className="text-sm font-medium text-neutral-500">
                      Matching the saved address with PSGC location data...
                    </Text>
                  </View>
                ) : null}

                {error ? (
                  <View className="rounded-lg bg-red-50 p-4">
                    <Text className="text-sm font-semibold text-red-700">
                      {error}
                    </Text>
                  </View>
                ) : null}

                <Pressable
                  className="mt-2 flex-row items-center justify-center gap-2 rounded-lg bg-primary-900 py-5 active:bg-primary-800"
                  disabled={isSaving || isHydratingSelections}
                  onPress={handleSave}
                >
                  <Text className="text-sm font-black uppercase tracking-[2px] text-white">
                    {isSaving ? "Saving Address..." : "Save Address"}
                  </Text>
                  <MaterialIcons name="check-circle" size={20} color="#FFFFFF" />
                </Pressable>
              </View>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <PickerModal
        isLoading={isPickerLoading}
        onClose={() => setPickerTarget(null)}
        onSelect={handlePickerSelect}
        open={pickerTarget !== null}
        options={pickerOptions}
        title={pickerTitle}
      />
    </View>
  );
}
