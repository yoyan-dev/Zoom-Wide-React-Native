import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, Pressable, Switch, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMemo, useState } from "react";

import * as authApi from "@/services/authApi";
import { useAuthStore } from "@/store/authStore";

type PasswordErrors = {
  confirmPassword?: string;
  currentPassword?: string;
  newPassword?: string;
};

function validatePasswords(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
) {
  const errors: PasswordErrors = {};

  if (!currentPassword) {
    errors.currentPassword = "Current password is required.";
  }

  if (newPassword.length < 8) {
    errors.newPassword = "Use at least 8 characters.";
  }

  if (confirmPassword !== newPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

export function SecuritySettingsScreen() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const signOut = useAuthStore((state) => state.signOut);
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<PasswordErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isSigningOutAll, setIsSigningOutAll] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentDeviceLabel = useMemo(() => {
    switch (Platform.OS) {
      case "ios":
        return "iPhone / iPad";
      case "android":
        return "Android Device";
      case "web":
        return "Web Browser";
      default:
        return "Current Device";
    }
  }, []);

  const handleChangePassword = async () => {
    if (!accessToken || isSaving) {
      return;
    }

    const nextErrors = validatePasswords(
      currentPassword,
      newPassword,
      confirmPassword,
    );
    setErrors(nextErrors);
    setError(null);
    setMessage(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSaving(true);

    try {
      await authApi.changePassword(accessToken, {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage("Password updated successfully.");
    } catch (changeError) {
      setError(
        changeError instanceof Error
          ? changeError.message
          : "Unable to update your password.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOutAll = async () => {
    if (!accessToken || !refreshToken || isSigningOutAll) {
      return;
    }

    setIsSigningOutAll(true);
    setError(null);

    try {
      await authApi.logoutAllSessions(accessToken, refreshToken);
      await signOut();
      router.replace("/login");
    } catch (signOutError) {
      setError(
        signOutError instanceof Error
          ? signOutError.message
          : "Unable to sign out all sessions.",
      );
    } finally {
      setIsSigningOutAll(false);
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
              Account
            </Text>
          </View>

          <Text className="text-xl font-black uppercase tracking-widest text-white">
            ZOOM WIDE
          </Text>
        </View>
      </SafeAreaView>

      <View className="flex-1 px-6 pb-24 pt-8">
        <View className="mx-auto w-full max-w-xl space-y-10">
          <View>
            <Text className="text-3xl font-black tracking-tight text-primary-900">
              Security Settings
            </Text>
            <Text className="mt-2 max-w-[80%] text-base font-medium text-neutral-600">
              Manage your biometric credentials, active sessions, and password
              protection.
            </Text>
          </View>

          <View className="space-y-6">
            <View className="space-y-3">
              <Text className="px-1 text-xs font-black uppercase tracking-widest text-neutral-400">
                Authentication
              </Text>
              <View className="overflow-hidden rounded-lg bg-white">
                <View className="p-5">
                  <Text className="font-black text-primary-900">
                    Change Password
                  </Text>
                  <Text className="mt-1 text-xs text-neutral-500">
                    Keep your account protected with a fresh password.
                  </Text>
                </View>

                <View className="gap-4 border-t border-neutral-100 p-5">
                  <TextInput
                    className="rounded-lg bg-neutral-200 px-4 py-4 text-base font-medium text-neutral-900"
                    onChangeText={setCurrentPassword}
                    placeholder="Current password"
                    placeholderTextColor="#737781"
                    secureTextEntry
                    value={currentPassword}
                  />
                  {errors.currentPassword ? (
                    <Text className="text-xs font-semibold text-red-700">
                      {errors.currentPassword}
                    </Text>
                  ) : null}

                  <TextInput
                    className="rounded-lg bg-neutral-200 px-4 py-4 text-base font-medium text-neutral-900"
                    onChangeText={setNewPassword}
                    placeholder="New password"
                    placeholderTextColor="#737781"
                    secureTextEntry
                    value={newPassword}
                  />
                  {errors.newPassword ? (
                    <Text className="text-xs font-semibold text-red-700">
                      {errors.newPassword}
                    </Text>
                  ) : null}

                  <TextInput
                    className="rounded-lg bg-neutral-200 px-4 py-4 text-base font-medium text-neutral-900"
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm new password"
                    placeholderTextColor="#737781"
                    secureTextEntry
                    value={confirmPassword}
                  />
                  {errors.confirmPassword ? (
                    <Text className="text-xs font-semibold text-red-700">
                      {errors.confirmPassword}
                    </Text>
                  ) : null}

                  <Pressable
                    className="rounded-lg bg-primary-900 py-4 active:opacity-85"
                    disabled={isSaving}
                    onPress={handleChangePassword}
                  >
                    <Text className="text-center text-sm font-black uppercase tracking-widest text-white">
                      {isSaving ? "Updating Password..." : "Update Password"}
                    </Text>
                  </Pressable>
                </View>

                <View className="flex-row items-center justify-between border-t border-neutral-100 p-5">
                  <View className="flex-1 pr-4">
                    <Text className="font-black text-primary-900">
                      Face ID / Biometrics
                    </Text>
                    <Text className="mt-1 text-xs text-neutral-500">
                      Secure access via hardware token
                    </Text>
                  </View>
                  <Switch
                    onValueChange={setBiometricsEnabled}
                    thumbColor="#FFFFFF"
                    trackColor={{ false: "#C3C6D2", true: "#FC7719" }}
                    value={biometricsEnabled}
                  />
                </View>

                <View className="flex-row items-center justify-between border-t border-neutral-100 p-5">
                  <View className="flex-1 pr-4">
                    <Text className="font-black text-primary-900">
                      Two-Factor Authentication
                    </Text>
                    <Text className="mt-1 text-xs text-neutral-500">
                      Recommended for high-value accounts
                    </Text>
                  </View>
                  <Switch
                    onValueChange={setTwoFactorEnabled}
                    thumbColor="#FFFFFF"
                    trackColor={{ false: "#C3C6D2", true: "#FC7719" }}
                    value={twoFactorEnabled}
                  />
                </View>
              </View>
            </View>

            <View className="space-y-3">
              <View className="flex-row items-end justify-between px-1">
                <Text className="text-xs font-black uppercase tracking-widest text-neutral-400">
                  Authorized Devices
                </Text>
                <Text className="rounded-full bg-accent-600 px-2 py-0.5 text-[10px] font-black uppercase text-white">
                  1 Active
                </Text>
              </View>

              <View className="rounded-lg bg-white">
                <View className="flex-row items-center justify-between p-5">
                  <View className="flex-row items-center gap-4">
                    <View className="h-12 w-12 items-center justify-center rounded bg-neutral-200">
                      <MaterialIcons
                        color="#002A58"
                        name={Platform.OS === "web" ? "laptop-mac" : "smartphone"}
                        size={24}
                      />
                    </View>
                    <View>
                      <View className="flex-row items-center gap-2">
                        <Text className="font-black text-primary-900">
                          {currentDeviceLabel}
                        </Text>
                        <Text className="rounded border border-accent-600 px-1 py-0.5 text-[9px] font-black uppercase text-accent-700">
                          This Device
                        </Text>
                      </View>
                      <Text className="text-xs text-neutral-500">
                        Active now
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {message ? (
              <View className="rounded-lg bg-green-50 p-4">
                <Text className="text-sm font-semibold text-green-700">
                  {message}
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
              className="flex-row items-center justify-center gap-2 rounded-lg border border-red-200 py-4 active:bg-red-50"
              disabled={isSigningOutAll}
              onPress={handleSignOutAll}
            >
              <MaterialIcons name="logout" size={20} color="#BA1A1A" />
              <Text className="text-sm font-black uppercase tracking-widest text-red-700">
                {isSigningOutAll
                  ? "Signing Out All Sessions..."
                  : "Sign Out Of All Sessions"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
