import { Tabs, Redirect } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAuth } from "@/hooks/_useAuth";

export default function TabLayout() {
  const { user, initializing } = useAuth();

  if (initializing) return null;
  if (!user) return <Redirect href="/(auth)/login" />;
  return (
    <Tabs
      screenOptions={{ headerShown: false, tabBarActiveTintColor: "#009b91" }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="house" color={color} />
          ),
          unmountOnBlur: true,
        }}
      />
      <Tabs.Screen
        name="denuncia/index"
        options={{
          title: "Denuncia",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="add-circle" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil/index"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="person" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
