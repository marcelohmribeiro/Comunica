import { Slot } from "expo-router";
import { KeyboardAvoidingView, Platform } from "react-native";
import Toast from "react-native-toast-message";
import "@/styles/global.css";

const RootLayout = () => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex flex-col h-full "
    >
      <Slot />
      <Toast />
    </KeyboardAvoidingView>
  );
};

export default RootLayout;
