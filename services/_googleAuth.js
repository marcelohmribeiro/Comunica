import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { Platform } from "react-native";
import {
  signOut as fbSignOut,
  signInWithCredential,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "@/lib/_firebase";
import { settings } from "@/settings";

WebBrowser.maybeCompleteAuthSession();

// Mantém compatibilidade com o seu settings
const { WEB_CLIENT_ID, IOS_CLIENT_ID, ANDROID_CLIENT_ID } = settings;

let configured = false;
export const configureGoogleSignIn = () => {
  configured = true;
};

// Códigos "compatíveis" com os que você usava
const statusCodes = {
  SIGN_IN_CANCELLED: "cancel",
  IN_PROGRESS: "in_progress",
  PLAY_SERVICES_NOT_AVAILABLE: "play_services_not_available",
};

function pickClientId() {
  if (Platform.OS === "ios") return IOS_CLIENT_ID || WEB_CLIENT_ID;
  if (Platform.OS === "android") return ANDROID_CLIENT_ID || WEB_CLIENT_ID;
  return WEB_CLIENT_ID;
}

export const signInWithGoogle = async () => {
  configureGoogleSignIn();
  try {
    const clientId = pickClientId();
    if (!clientId) {
      return { ok: false, message: "Client ID do Google não configurado" };
    }

    // URL de redirecionamento via proxy (funciona em Dev Client e Expo Go)
    const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });

    // Pedimos um id_token (OIDC) para autenticar no Firebase
    const params = new URLSearchParams({
      client_id: String(clientId),
      redirect_uri: redirectUri,
      response_type: "id_token",
      scope: "openid profile email",
      prompt: "select_account",
      // opcional: um nonce simples
      nonce: Math.random().toString(36).slice(2),
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

    const res = await AuthSession.startAsync({
      authUrl,
      returnUrl: redirectUri,
    });

    if (res.type !== "success") {
      // mapeia para seus códigos
      const code =
        res.type === "cancel"
          ? statusCodes.SIGN_IN_CANCELLED
          : res.type === "dismiss"
          ? "dismiss"
          : "error";
      const message =
        code === statusCodes.SIGN_IN_CANCELLED
          ? "Login cancelado"
          : code === "dismiss"
          ? "Fluxo fechado"
          : "Falha no login com Google";
      return { ok: false, code, message };
    }

    const idToken = res.params?.id_token;
    if (!idToken) {
      return { ok: false, message: "idToken ausente" };
    }

    // Converte o id_token em credencial Firebase
    const credential = GoogleAuthProvider.credential(idToken);
    const userCred = await signInWithCredential(auth, credential);
    return { ok: true, user: userCred.user };
  } catch (err) {
    return {
      ok: false,
      code: err?.code,
      message: err?.message || "Erro inesperado no Google Sign-In",
    };
  }
};

export const signOutGoogle = async () => {
  try {
    // Não há sessão nativa a encerrar; basta sair do Firebase
    await fbSignOut(auth);
    return { ok: true };
  } catch (err) {
    return { ok: false, message: err?.message || "Erro ao sair" };
  }
};

export const getCurrentGoogleUser = () => {
  // compatível com o que você já expunha
  const u = auth.currentUser;
  return u ? { user: u } : null;
};
