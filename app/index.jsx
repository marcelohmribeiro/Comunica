import { Redirect } from "expo-router";
import useAuth from "@/hooks/_useAuth";

export default function Index() {
  const { user, initializing } = useAuth();
  if (initializing) {
    return null;
  }
  return <Redirect href={user ? "/(tabs)/home" : "/(auth)/login"} />;
}
