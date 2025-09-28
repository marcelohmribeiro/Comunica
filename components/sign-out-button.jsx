import { useCallback, useState } from "react";
import { TouchableOpacity, Text } from "react-native";
import { signOutGoogle, signOutApp } from "@/services";

export const SignOutButton = () => {
  const [loading, setLoading] = useState(false);

  const HandleSignOut = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      await signOutGoogle();
      await signOutApp();
    } catch (e) {
      console.error("Erro no signOut:", e);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  return (
    <TouchableOpacity
      onPress={HandleSignOut}
      className="bg-red-600 p-3 rounded-lg w-40 items-center"
    >
      <Text className="text-white font-semibold">
        {loading ? "Saindo..." : "Sair"}
      </Text>
    </TouchableOpacity>
  );
};
