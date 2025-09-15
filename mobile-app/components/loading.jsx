import { SafeAreaView, ActivityIndicator } from "react-native";

export const Loading = () => {
  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <ActivityIndicator />
    </SafeAreaView>
  );
};
