import "@/styles/global.css";
import { Slot } from "expo-router";
import { View, Image } from "react-native";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { LoadingProvider } from "@/components/_loading";
import { VLibrasProvider } from "@/contexts/_vlibras-context";
import { VLibrasWidget } from "@/components";
import Toast from "react-native-toast-message";
import useAuth from "@/hooks/_useAuth";

const Header = () => {
  return (
    <View className="bg-white pt-12 px-4 border-b border-gray-200">
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
    <LoadingProvider>
      <GluestackUIProvider mode="light">
        <VLibrasProvider>
          {user && <Header />}
          <Slot />
          {user && <VLibrasWidget />}
        </VLibrasProvider>
      </GluestackUIProvider>
      <Toast />
    </LoadingProvider>
  );
};

export default RootLayout;
