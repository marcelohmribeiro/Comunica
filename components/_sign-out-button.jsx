import { useCallback } from "react";
import { Text, View, ActivityIndicator } from "react-native";
import { LogOut } from "lucide-react-native";
import { signOutApp } from "@/services";
import { useReports } from "@/store";
import { Button } from "@/components/ui";
import { useLoading } from "@/store";

export const SignOutButton = () => {
  const { startLoading, stopLoading, loading } = useLoading();
  const { reset } = useReports();

  const HandleSignOut = useCallback(async () => {
    startLoading();
    try {
      await signOutApp();
      reset();
    } catch (e) {
      console.error("Erro no signOut:", e);
    } finally {
      stopLoading();
    }
  }, [loading]);

  return (
    <Button
      variant="solid"
      size="lg"
      className="bg-red-600 w-full rounded-xl"
      isDisabled={loading > 0}
      onPress={HandleSignOut}
      accessibilityLabel="Sair da conta"
    >
      {loading > 0 ? (
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
