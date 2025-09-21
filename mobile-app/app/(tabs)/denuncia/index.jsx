import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Denuncia() {
  return (
    <View className="flex-1 bg-gray-100 items-center justify-center p-6">
      <Text className="text-xl font-bold mb-6">📝 Fazer Denúncia</Text>

      <TextInput
        className="w-full border border-gray-300 rounded-lg p-3 bg-white mb-4"
        placeholder="Título da denúncia"
      />

      <TextInput
        className="w-full border border-gray-300 rounded-lg p-3 bg-white h-32 mb-4"
        placeholder="Descreva o problema..."
        multiline
      />

      <TouchableOpacity className="bg-blue-600 p-4 rounded-lg w-full items-center">
        <Text className="text-white font-semibold">Enviar Denúncia</Text>
      </TouchableOpacity>
    </View>
  );
}
