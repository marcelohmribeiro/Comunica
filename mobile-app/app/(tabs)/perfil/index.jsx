import { Text, View } from "react-native";
import { Container } from "@/components/page-container";
import { SignOutButton } from "@/components/sign-out-button";

export default function Perfil() {
  return (
    <Container>
      <Text className="text-2xl font-bold mb-2">👤 Meu Perfil</Text>
      <Text className="text-gray-600 mb-6">Usuário Anônimo</Text>
      <View>
        <SignOutButton />
      </View>
    </Container>
  );
}
