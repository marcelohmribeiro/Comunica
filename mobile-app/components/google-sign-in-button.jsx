import React, { useEffect, useState } from "react";
import { ActivityIndicator, Platform, View } from "react-native";
import {
  GoogleSignin,
  statusCodes,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import {
  getAuth,
  signInWithCredential,
  GoogleAuthProvider,
} from "@react-native-firebase/auth";
import { configureGoogleSignIn } from "@/services/_googleAuth";
import { useAuth } from "@/hooks/_useAuth";
import { api } from "@/services/_api";

export const GoogleSignInButton = ({
  onSuccess,
  onError,
  style,
  size = GoogleSigninButton.Size.Wide,
  color = GoogleSigninButton.Color.Dark,
  width = 192,
  height = 48,
  showSpinnerOverlay = false,
}) => {
  const { user, initializing } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  const handleGoogleSignIn = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (Platform.OS === "android") {
        await GoogleSignin.hasPlayServices({
          showPlayServicesUpdateDialog: true,
        });
      }
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        // Token do google
        let idToken = response.data?.idToken;
        if (!idToken) {
          const tokens = await GoogleSignin.getTokens();
          idToken = tokens?.idToken ?? null;
        }
        if (!idToken) {
          throw new Error("Sem idToken.");
        }

        const gooogleCredential = GoogleAuthProvider.credential(idToken);
        signInWithCredential(getAuth(), gooogleCredential);
        /*
      const firebaseIdToken = await user.getIdToken(true);
      await api.post(
        "/login",
        {
          id: user.uid,
          name:
            user.displayName || (user.email ? user.email.split("@")[0] : ""),
          email: user.email,
          emailVerified: !!user.emailVerified,
          image: user.photoURL,
        },
        {
          headers: { Authorization: `Bearer ${firebaseIdToken}` },
        }
      );
      */
        onSuccess?.();
      } else {
        return;
      }
    } catch (error) {
      if (error) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            console.log("Sign-in já em andamento");
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.log("Play Services indisponível/desatualizado");
            break;
          default:
            console.log("Erro Google Sign-In:", error);
        }
      } else {
        console.log("Erro geral no signIn:", error?.message || error);
      }
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return showSpinnerOverlay ? (
      <View className="items-center justify-center">
        <ActivityIndicator />
      </View>
    ) : null;
  }

  if (user) return null;

  return (
    <View style={style}>
      <GoogleSigninButton
        style={{ width, height }}
        size={size}
        color={color}
        onPress={handleGoogleSignIn}
        disabled={loading}
      />
    </View>
  );
};
