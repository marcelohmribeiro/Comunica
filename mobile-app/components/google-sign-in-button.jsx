import { useEffect, useState } from "react";
import { ActivityIndicator, View, Pressable, Image, Text } from "react-native";
import { configureGoogleSignIn, signInWithGoogle } from "@/services";
import { useAuth } from "@/hooks";

export const GoogleSignInButton = ({
  onSuccess,
  onError,
  showSpinnerOverlay = false,
}) => {
  const { user, initializing } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  const handleGoogleSignin = async () => {
    if (loading) return;
    setLoading(true);
    const res = await signInWithGoogle();
    setLoading(false);

    if (res.ok) onSuccess && onSuccess();
    else onError && onError({ code: res.code, message: res.message });
  };

  if (initializing) {
    return showSpinnerOverlay ? (
      <View className="items-center justify-center">
        <ActivityIndicator />
      </View>
    ) : null;
  }

  if (user) return null;

  return (
    <View>
      <Pressable
        className={`flex-row items-center rounded-full border px-12 py-3 ${
          loading ? "bg-gray-200 border-gray-300" : "bg-white border-gray-300"
        }`}
        onPress={handleGoogleSignin}
        disabled={loading}
      >
        <Image
          source={require("@/assets/google-logo.png")}
          className="w-5 h-5 mr-2"
          resizeMode="contain"
        />
        <Text className="text-base text-[#3c4043] font-normal">
          Entrar com o Google
        </Text>
      </Pressable>
    </View>
  );
};
