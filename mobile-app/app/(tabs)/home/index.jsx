import { View, Text, FlatList } from "react-native";
import { Container } from "@/components/page-container";
import { useEffect, useState } from "react";
import { api } from "@/services/_api";

export default function Home() {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const resp = await api.get("/users");
        setUsers(resp.data);
      } catch (error) {
        console.log("Erro na requisição: ", error);
      }
    };

    fetchUsers();
  }, []);

  if (users) {
    return (
      <View className="flex-1 bg-gray-100 items-center justify-center p-6">
        <Text className="text-xl font-bold mb-4">📍 Denúncias Recentes</Text>
        <View className="flex items-center justify-center">
          <FlatList
            data={users}
            keyExtractor={(user) => user.id}
            renderItem={({ item }) => (
              <View className="bg-white p-4 rounded-xl mb-3 shadow">
                <Text className="text-lg font-semibold">{item.name}</Text>
                <Text className="text-sm text-gray-500">
                  Email: {item.email}
                </Text>
              </View>
            )}
          />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100 items-center justify-center p-6">
      <Text>Olá</Text>
    </View>
  );
}
