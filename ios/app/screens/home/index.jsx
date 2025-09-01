import { View, Text, FlatList } from "react-native";
import { Container } from "@/components/page-container";

export default function Home() {
  const denuncias = [
    { id: "1", titulo: "Buraco na rua", status: "Em análise" },
    { id: "2", titulo: "Falta de iluminação", status: "Resolvido" },
  ];

  return (
    <Container>
      <Text className="text-xl font-bold mb-4">📍 Denúncias Recentes</Text>
      <FlatList
        data={denuncias}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="bg-white p-4 rounded-xl mb-3 shadow">
            <Text className="text-lg font-semibold">{item.titulo}</Text>
            <Text className="text-sm text-gray-500">Status: {item.status}</Text>
          </View>
        )}
      />
    </Container>
  );
}
