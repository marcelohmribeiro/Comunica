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

  useEffect(() => {
    console.log("Google Auth:", {
      platform: Platform.OS,
      redirectUri,
      useProxy,
      hasExpoClientId: !!webClientId,
      hasIosClientId: !!iosClientId,
    });
  }, [redirectUri, useProxy, webClientId, iosClientId]);

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
    const res = await promptAsync();
    if (res?.type === "success") {
      const idToken = res.params?.id_token || res.authentication?.idToken;
      if (!idToken) throw new Error("Token de ID não recebido do Google.");
      return await signInWithGoogle(idToken);
    }
    if (res?.type === "dismiss")
      throw new Error("Login cancelado pelo usuário.");
    if (res?.type === "error")
      throw new Error(res.error?.message || "Erro no login com Google.");
    throw new Error("Falha no login com Google.");
  }, [promptAsync]);

  const logout = useCallback(async () => {
    await signOutGoogle();
  }, []);

  return { request, response, signin, logout };
}
