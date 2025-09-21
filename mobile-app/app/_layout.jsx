import { Slot } from "expo-router";
import { KeyboardAvoidingView, Platform } from "react-native";
import Toast from "react-native-toast-message";
import "@/styles/global.css";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

const RootLayout = () => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex flex-col h-full "
    >
      <GluestackUIProvider mode="light">
        <Slot />
      </GluestackUIProvider>
      <Toast />
    </KeyboardAvoidingView>
  );
};

export default RootLayout;
