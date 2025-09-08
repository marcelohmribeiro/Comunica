import {
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import {
  GoogleSignin,
  statusCodes,
  isErrorWithCode,
  isSuccessResponse,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
  signOut as firebaseSignOut,
} from "@react-native-firebase/auth";

export default function LoginScreen() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "978165368354-j3vf98uu79ck8jp0bgj3mu8at6ehem3e.apps.googleusercontent.com",
      offlineAccess: true,
    });
  }, []);

  // Observa o estado de auth (modular)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (u) => {
      setUser(u);
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  const signIn = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (Platform.OS === "android") {
        await GoogleSignin.hasPlayServices({
          showPlayServicesUpdateDialog: true,
        });
      }

      const response = await GoogleSignin.signIn();
      if (!isSuccessResponse(response)) {
        console.log("Login cancelado");
        return;
      }

      let idToken = response.data?.idToken;
      if (!idToken) {
        const tokens = await GoogleSignin.getTokens();
        idToken = tokens?.idToken ?? null;
      }
      if (!idToken) {
        throw new Error("Sem idToken.");
      }

      const googleCredential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(getAuth(), googleCredential);
    } catch (error) {
      if (isErrorWithCode(error)) {
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
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const signOut = useCallback(async () => {
    try {
      await firebaseSignOut(getAuth()); // sai do Firebase
      await GoogleSignin.signOut(); // limpa sessão Google no device
      await GoogleSignin.revokeAccess();
      setUser(null);
    } catch (error) {
      console.error("Erro no signOut:", error);
    }
  }, []);

  if (initializing) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <GoogleSigninButton
          style={{ width: 192, height: 48 }}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={signIn}
          disabled={loading}
        />
      </SafeAreaView>
    );
  }

  return (
    <View className="justify-center flex-1 items-center">
      <Text>
        Bem-vindo
        {user ? `, ${user.displayName}` : user.email ? `, ${user.email}` : ""}!
      </Text>
      <TouchableOpacity onPress={signOut} style={{ marginTop: 16 }}>
        <Text>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}
