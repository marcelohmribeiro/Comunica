import { useCallback, useState } from "react";
import { Text, View, ActivityIndicator } from "react-native";
import { LogOut } from "lucide-react-native";
import { signOutGoogle, signOutApp } from "@/services";
import { useReports } from "@/store";
import { Button } from "@/components/ui";

export const SignOutButton = () => {
  const [loading, setLoading] = useState(false);
  const { reset } = useReports();

  const HandleSignOut = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      await signOutGoogle();
      await signOutApp();
      reset();
    } catch (e) {
      console.error("Erro no signOut:", e);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  return (
    <Button
      variant="solid"
      size="lg"
      className="bg-red-600 w-full rounded-xl"
      isDisabled={loading}
      onPress={HandleSignOut}
      accessibilityLabel="Sair da conta"
    >
      {loading ? (
        <View className="flex-row items-center justify-center gap-2">
          <ActivityIndicator size="small" color="#fff" />
          <Text className="text-white font-semibold">Saindo...</Text>
        </View>
      ) : (
        <View className="flex-row items-center justify-center gap-2">
          <LogOut size={18} color="#fff" />
          <Text className="text-white font-semibold">Sair</Text>
        </View>
      )}
    </Button>
  );
};
