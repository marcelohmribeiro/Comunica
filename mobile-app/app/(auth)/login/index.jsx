import { useEffect } from "react";
import { SafeAreaView, Text, View } from "react-native";
import { useAuth } from "@/hooks/_useAuth";
import { GoogleSignInButton } from "@/components/google-sign-in-button";
import { useRouter } from "expo-router";
import { Loading } from "@/components/loading";

export default function Login() {
  const { user, initializing } = useAuth();
  const router = useRouter();

  if (initializing) {
    <Loading />;
  }

  useEffect(() => {
    if (user) {
      router.replace("/(tabs)/home");
    }
  }, [user, initializing]);

  if (!user) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center px-6">
        <View className="mb-8 items-center">
          <Text className="text-xl font-semibold">Bem-vindo</Text>
          <Text className="text-gray-500 mt-1 text-center">
            Entre com sua conta Google para continuar
          </Text>
        </View>

        <GoogleSignInButton
          width={240}
          height={56}
          showSpinnerOverlay
          onSuccess={() => {
            router.replace("/(tabs)/home");
          }}
        />
      </SafeAreaView>
    );
  }
}
