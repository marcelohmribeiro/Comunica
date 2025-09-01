import { Text, TouchableOpacity } from "react-native";
import { Container } from "@/components/page-container";

export default function Perfil() {
  return (
    <Container>
      <Text className="text-2xl font-bold mb-2">👤 Meu Perfil</Text>
      <Text className="text-gray-600 mb-6">Usuário Anônimo</Text>

      <TouchableOpacity className="bg-red-600 p-3 rounded-lg w-40 items-center">
        <Text className="text-white font-semibold">Sair</Text>
      </TouchableOpacity>
    </Container>
  );
}
