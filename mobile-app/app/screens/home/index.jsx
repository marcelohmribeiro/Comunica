import { View, Text, FlatList } from "react-native";
import { Container } from "@/components/page-container";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const resp = await axios.get("http://localhost:8080/users");
        setUsers(resp.data);
      } catch (error) {
        console.log("Erro na requisição: ", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Container>
      <Text className="text-xl font-bold mb-4">📍 Denúncias Recentes</Text>
      <View>
        <FlatList
          data={users}
          keyExtractor={(user) => user.id}
          renderItem={({ item }) => (
            <View className="bg-white p-4 rounded-xl mb-3 shadow">
              <Text className="text-lg font-semibold">{item.name}</Text>
              <Text className="text-sm text-gray-500">Email: {item.email}</Text>
            </View>
          )}
        />
      </View>
    </Container>
  );
}
