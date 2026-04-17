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

type LoginErrors = {
  email?: string;
  password?: string;
};

function validateLogin(email: string, password: string) {
  const errors: LoginErrors = {};

  if (!email.trim()) {
    errors.email = "Email is required.";
  } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  }

  return errors;
}

export function LoginScreen() {
  const router = useRouter();
  const isLoading = useAuthStore((state) => state.isLoading);
  const rememberSession = useAuthStore((state) => state.rememberSession);
  const setRememberSession = useAuthStore((state) => state.setRememberSession);
  const signIn = useAuthStore((state) => state.signIn);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (isLoading) {
      return;
    }

    const nextErrors = validateLogin(email, password);
    setErrors(nextErrors);
    setSubmitError(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      await signIn(
        {
          email: email.trim().toLowerCase(),
          password,
        },
        rememberSession,
      );
      router.replace("/");
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to sign in. Please try again.",
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
          contentContainerClassName="min-h-screen flex-grow"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <SafeAreaView className="flex-1">
            <View className="relative flex-1 overflow-hidden">
              <View pointerEvents="none" style={StyleSheet.absoluteFill}>
                <View className="absolute inset-0 bg-primary-900" />
                <View className="absolute -right-24 top-8 h-72 w-72 rounded-full bg-primary-500 opacity-20" />
                <View className="absolute -bottom-16 -left-20 h-64 w-64 rounded-full bg-accent-500 opacity-15" />
                <View className="absolute inset-x-0 top-0 h-72 bg-primary-800 opacity-60" />
              </View>

              <View className="flex-1 justify-between px-6 pb-8 pt-8">
                <View>
                  <View className="flex-row items-center gap-4">
                    <View
                      className="items-center justify-center"
                      style={styles.logoShadow}
                    >
                      <Image
                        accessibilityLabel="ZOOM WIDE logo"
                        className="h-16 w-16"
                        resizeMode="contain"
                        source={require("../../../../public/app-icon.png")}
                      />
                    </View>
                    <View>
                      <Text className="text-[11px] font-black uppercase tracking-widest text-accent-300">
                        Construction Supplies
                      </Text>
                      <Text className="mt-1 text-3xl font-black uppercase tracking-widest text-white">
                        ZOOM WIDE
                      </Text>
                    </View>
                  </View>

                  <View className="mt-16">
                    <Text className="text-[11px] font-black uppercase tracking-widest text-primary-100">
                      Secure customer access
                    </Text>
                    <Text className="mt-3 text-4xl font-black leading-tight text-white">
                      Sign in to manage your build orders.
                    </Text>
                    <Text className="mt-4 text-base font-semibold leading-6 text-primary-100">
                      Access pricing, cart checkout, delivery tracking, and
                      account details from your ZOOM WIDE workspace.
                    </Text>
                  </View>
                </View>

                <View
                  className="mt-12 rounded-lg bg-white p-5"
                  style={styles.formShadow}
                >
                  <View className="gap-5">
                    <View className="gap-2">
                      <Text className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                        Email address
                      </Text>
                      <View className="flex-row items-center rounded-lg bg-neutral-100 px-4">
                        <MaterialIcons name="mail" size={20} color="#667080" />
                        <TextInput
                          autoCapitalize="none"
                          autoComplete="email"
                          className="ml-3 flex-1 py-4 text-base font-semibold text-neutral-900"
                          editable={!isLoading}
                          keyboardType="email-address"
                          onChangeText={setEmail}
                          placeholder="customer@example.com"
                          placeholderTextColor="#8E97A3"
                          value={email}
                        />
                      </View>
                      {errors.email ? (
                        <Text className="text-xs font-semibold text-red-700">
                          {errors.email}
                        </Text>
                      ) : null}
                    </View>

                    <View className="gap-2">
                      <Text className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                        Password
                      </Text>
                      <View className="flex-row items-center rounded-lg bg-neutral-100 px-4">
                        <MaterialIcons name="lock" size={20} color="#667080" />
                        <TextInput
                          autoCapitalize="none"
                          autoComplete="password"
                          className="ml-3 flex-1 py-4 text-base font-semibold text-neutral-900"
                          editable={!isLoading}
                          onChangeText={setPassword}
                          placeholder="Enter password"
                          placeholderTextColor="#8E97A3"
                          secureTextEntry={!showPassword}
                          value={password}
                        />
                        <Pressable
                          accessibilityRole="button"
                          className="p-1"
                          onPress={() => setShowPassword((current) => !current)}
                        >
                          <MaterialIcons
                            color="#667080"
                            name={
                              showPassword ? "visibility-off" : "visibility"
                            }
                            size={22}
                          />
                        </Pressable>
                      </View>
                      {errors.password ? (
                        <Text className="text-xs font-semibold text-red-700">
                          {errors.password}
                        </Text>
                      ) : null}
                    </View>

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
                          <MaterialIcons
                            name="check"
                            size={15}
                            color="#FFFFFF"
                          />
                        ) : null}
                      </View>
                      <Text className="text-sm font-bold text-neutral-700">
                        Keep me logged in on this device
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
                        {isLoading ? "Securing session..." : "Secure login"}
                      </Text>
                    </Pressable>

                    <View className="items-center border-t border-neutral-100 pt-5">
                      <Text className="text-sm font-semibold text-neutral-500">
                        New trade customer?
                      </Text>
                      <Link asChild href="/signup">
                        <Pressable className="mt-2 rounded-lg border border-primary-900 px-5 py-3 active:bg-primary-50">
                          <Text className="text-xs font-black uppercase tracking-widest text-primary-900">
                            Sign up / Apply now
                          </Text>
                        </Pressable>
                      </Link>
                    </View>
                  </View>
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
  logoShadow: {
    elevation: 8,
    shadowColor: "#000000",
    shadowOffset: { height: 10, width: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
  },
});
