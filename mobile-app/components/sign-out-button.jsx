import React, { useCallback, useState } from "react";
import { TouchableOpacity, Text } from "react-native";
import {
  getAuth,
  signOut as firebaseSignOut,
} from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export const SignOutButton = () => {
  const [loading, setLoading] = useState(false);

  const signOut = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      await firebaseSignOut(getAuth());
      await GoogleSignin.signOut();
    } catch (e) {
      console.error("Erro no signOut:", e);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  return (
    <TouchableOpacity
      onPress={signOut}
      className="bg-red-600 p-3 rounded-lg w-40 items-center"
    >
      <Text className="text-white font-semibold">
        {loading ? "Saindo..." : "Sair"}
      </Text>
    </TouchableOpacity>
  );
}