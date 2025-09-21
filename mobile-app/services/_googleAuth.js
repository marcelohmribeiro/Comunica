import { signOut } from "@react-native-firebase/auth";
import {
  GoogleSignin,
  isSuccessResponse,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { settings } from "@/settings";
import { Platform } from "react-native";

const { WEB_CLIENT_ID, IOS_CLIENT_ID } = settings;

let configured = false;

export const configureGoogleSignIn = () => {
  if (configured) return;
  GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID,
    ...(Platform.OS === "ios" && { iosClientId: IOS_CLIENT_ID }),
    offlineAccess: true,
  });
  configured = true;
};

export const signInWithGoogle = async () => {
  configureGoogleSignIn();

  try {
    if (Platform.OS === "android") {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
    }

    const response = await GoogleSignin.signIn();

    if (!isSuccessResponse(response)) {
      return { ok: false, message: "Login cancelado pelo usuário" };
    }

    const idToken = response.data?.idToken || null;
    const accessToken = response.data?.accessToken || null;

    if (!idToken) {
      return { ok: false, message: "idToken ausente" };
    }

    const credential = auth.GoogleAuthProvider.credential(idToken, accessToken);
    const userCred = await auth().signInWithCredential(credential);

    return { ok: true, user: userCred.user };
  } catch (err) {
    if (isErrorWithCode(err)) {
      switch (err.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          return { ok: false, code: err.code, message: "Login cancelado" };
        case statusCodes.IN_PROGRESS:
          return {
            ok: false,
            code: err.code,
            message: "Login já em andamento",
          };
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          return {
            ok: false,
            code: err.code,
            message: "Google Play Services indisponível",
          };
        default:
          return { ok: false, code: err.code, message: err.message };
      }
    }
    return {
      ok: false,
      message: err?.message || "Erro inesperado no Google Sign-In",
    };
  }
};

export const signOutGoogle = async () => {
  try {
    await GoogleSignin.signOut();
    await signOut();
    return { ok: true };
  } catch (err) {
    return { ok: false, message: err?.message || "Erro ao sair" };
  }
};

export const getCurrentGoogleUser = () => {
  try {
    const userInfo = GoogleSignin.getCurrentUser();
    return userInfo;
  } catch {
    return null;
  }
};
