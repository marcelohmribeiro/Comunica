import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { settings } from "@/settings";
import { Platform } from "react-native";

const { WEB_CLIENT_ID, IOS_CLIENT_ID } = settings;

let configured = false;

const configureGoogleSignIn = () => {
  if (configured) return;
  GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID,
    ...(Platform.OS === "ios" && { iosClientId: IOS_CLIENT_ID }),
    offlineAccess: true,
  });
  configured = true;
}

export { configureGoogleSignIn }