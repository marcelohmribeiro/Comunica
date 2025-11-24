import { useState } from "react";
import { View, Pressable, Image, Text } from "react-native";
import useGoogleAuth from "@/hooks/_useGoogleAuth";

export const GoogleSignInButton = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { signin } = useGoogleAuth({ scheme: "comunica" });

  const handleGoogleSignin = async () => {
    try {
      if (loading) return;
      setLoading(true);
      const res = await signin();
      setLoading(false);
      if (res.ok) {
        onSuccess();
      }
    } catch (error) {
      console.log("Login com Google não disponível");
      setLoading(false);
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
          {loading ? "Entrando..." : "Entrar com o Google"}
        </Text>
      </Pressable>
    </View>
  );
};
