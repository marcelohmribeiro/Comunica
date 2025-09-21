import { Text, View } from "react-native";
import { SignOutButton } from "@/components/sign-out-button";

export default function Perfil() {
  return (
    <View className="flex-1 bg-gray-100 items-center justify-center p-6">
      <Text className="text-2xl font-bold mb-2">👤 Meu Perfil</Text>
      <Text className="text-gray-600 mb-6">Usuário Anônimo</Text>
      <View>
        <SignOutButton />
      </View>
    </View>
  );
}
