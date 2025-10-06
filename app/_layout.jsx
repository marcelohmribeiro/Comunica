import { Slot } from "expo-router";
import { KeyboardAvoidingView, Platform } from "react-native";
import { LoadingProvider } from "@/components/_loading";
import Toast from "react-native-toast-message";
import "@/styles/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { View, Image } from "react-native";
import useAuth from "@/hooks/_useAuth";

const Header = () => {
  return (
    <View className="bg-white pt-12 pb-6 px-4 border-b border-gray-200">
      <Image
        className="w-[65%] m-auto h-28"
        source={require("@/assets/logo-comunica.png")}
      />
    </View>
  );
};

const RootLayout = () => {
  const { user } = useAuth();
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex flex-col h-full"
    >
      <LoadingProvider>
        <GluestackUIProvider mode="light">
          {user && <Header />}
          <Slot />
        </GluestackUIProvider>
        <Toast />
      </LoadingProvider>
    </KeyboardAvoidingView>
  );
};

export default RootLayout;
