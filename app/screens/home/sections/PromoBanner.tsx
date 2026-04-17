import { useRouter } from "expo-router";
import { ImageBackground, Pressable, Text, View } from "react-native";

import { heroBanner } from "../data";
import { homeStyles } from "../styles";

export function PromoBanner() {
  const router = useRouter();

  return (
    <View className="mb-12 h-72 overflow-hidden rounded-xl bg-primary-900">
      <ImageBackground
        className="h-full w-full"
        imageStyle={homeStyles.bannerImage}
        resizeMode="cover"
        source={{ uri: heroBanner.image }}
      >
        <View className="absolute inset-0 bg-primary-900 opacity-65" />
        <View className="absolute inset-0 justify-center p-8">
          <View className="self-start rounded bg-accent-600 px-3 py-1">
            <Text className="text-[10px] font-black uppercase tracking-widest text-white">
              {heroBanner.kicker}
            </Text>
          </View>

          <Text className="mt-4 max-w-sm text-4xl font-black uppercase leading-tight tracking-tighter text-white">
            {heroBanner.title}
          </Text>

          <Pressable
            className="mt-6 self-start rounded-lg bg-accent-600 px-8 py-3 active:bg-accent-700"
            onPress={() => router.push("/profile")}
          >
            <Text className="text-sm font-black uppercase tracking-widest text-white">
              Inquire Now
            </Text>
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
}
