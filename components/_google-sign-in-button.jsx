import { useEffect, useState } from "react";
import { View, Pressable, Image, Text } from "react-native";
import { configureGoogleSignIn, signInWithGoogle } from "@/services";

const GoogleSignInButton = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  const handleGoogleSignin = async () => {
    try {
      if (loading) return;
      setLoading(true);
      const res = await signInWithGoogle();
      setLoading(false);
      if (res.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error("cancelou");
      throw error;
    }
  };
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

export { GoogleSignInButton };
