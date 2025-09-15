import { Redirect } from "expo-router";
import { useAuth } from "@/hooks/_useAuth";
import { Loading } from "@/components/loading";

export default function Index() {
  const { user, initializing } = useAuth();
  if (initializing) {
    return <Loading />;
  }
  return <Redirect href={user ? "/(tabs)/home" : "/(auth)/login"} />;
}
