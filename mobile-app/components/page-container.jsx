import { View } from "react-native";

export const Container = ({ children }) => {
  return (
    <View className="flex-1 bg-gray-100 items-center justify-center p-6">
      {children}
    </View>
  );
};
