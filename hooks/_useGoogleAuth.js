import { useEffect, useMemo, useCallback } from "react";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, ResponseType } from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import { signInWithGoogle, signOutGoogle } from "@/services";
import { Platform } from "react-native";
import Constants from "expo-constants";
import { settings } from "@/settings";

const { WEB_CLIENT_ID, IOS_CLIENT_ID } = settings;

WebBrowser.maybeCompleteAuthSession();

export default function useGoogleAuth({
  webClientId = WEB_CLIENT_ID,
  iosClientId = IOS_CLIENT_ID,
  scheme = "comunica",
} = {}) {
  const useProxy = true;

  const expoUsername =
    Constants.expoConfig?.owner ||
    Constants.manifest2?.owner ||
    Constants.manifest?.owner;

  const expoSlug =
    Constants.expoConfig?.slug ||
    Constants.manifest2?.slug ||
    Constants.manifest?.slug;

  const redirectUri = useMemo(() => {
    if (expoUsername && expoSlug) {
      return `https://auth.expo.io/@${expoUsername}/${expoSlug}`;
    }
    return makeRedirectUri({ scheme, useProxy });
  }, [scheme, useProxy, expoUsername, expoSlug]);

  const [request, response, promptAsync] = Google.useAuthRequest(
    {
      responseType: ResponseType.IdToken,
      scopes: ["openid", "profile", "email"],
      redirectUri,
      selectAccount: true,
      webClientId,
      iosClientId: Platform.OS === "ios" ? iosClientId : undefined,
    },
    { useProxy }
  );

  const signin = useCallback(async () => {
    try {
      const res = await promptAsync();
      if (res?.type === "success") {
        const idToken = res.params?.id_token || res.authentication?.idToken;
        if (!idToken) {
          console.log("Token de ID não recebido do Google.");
          return { ok: false };
        }
        return await signInWithGoogle(idToken);
      }
      if (res?.type === "dismiss") {
        console.log("Login cancelado pelo usuário.");
        return { ok: false };
      }
      if (res?.type === "error") {
        console.log("Erro no login com Google:", res.error?.message);
        return { ok: false };
      }
      console.log("Falha no login com Google.");
      return { ok: false };
    } catch (error) {
      console.log("Erro capturado:", error.message);
      return { ok: false };
    }
  }, [promptAsync]);

  const logout = useCallback(async () => {
    await signOutGoogle();
  }, []);

  return { request, response, signin, logout };
}
