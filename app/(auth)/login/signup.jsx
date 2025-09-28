import { useState } from "react";
import { SafeAreaView, ScrollView, View, Image, Pressable } from "react-native";
import { Mail, Lock, User, ArrowLeft } from "lucide-react-native";
import { useRouter } from "expo-router";
import { signUpEmail } from "@/services";
import Toast from "react-native-toast-message";
// Gluestack
import {
  Button,
  ButtonText,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
} from "@/components/ui";

export default function SignUp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");

  const canSubmit = name && email && pass.length >= 6 && pass === confirm;

  const handleSignUp = async () => {
    if (!canSubmit || loading) return;

    try {
      setLoading(true);
      await signUpEmail(email, pass, name);
      Toast.show({
        type: "success",
        text1: "Conta criada com sucesso!",
        text2: "Bem-vindo!",
      });
      router.replace("/(tabs)/home");
    } catch (e) {
      console.error(e);
      Toast.show({
        type: "error",
        text1: "Erro ao criar conta",
        text2: "Não foi possível criar a conta. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 pt-6">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={28} color="#111827" />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="bg-white px-10 pt-8 pb-6">
          <Image
            source={require("@/assets/comunica.png")}
            resizeMode="cover"
            className="w-full p-6 h-44 mt-12"
          />

          <View className="mb-5">
            <FormControl isRequired>
              <FormControlLabel>
                <FormControlLabelText className="text-neutral-900 font-semibold mb-2">
                  Seu nome
                </FormControlLabelText>
              </FormControlLabel>
              <View className="flex-row items-center border border-[#E5E7EB] rounded-lg bg-white px-3 shadow-sm">
                <User size={20} color="#9CA3AF" style={{ marginRight: 8 }} />
                <Input variant="unstyled" className="flex-1">
                  <InputField
                    placeholder="Nome completo"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    className="text-neutral-900 text-base"
                    placeholderTextColor="#9CA3AF"
                  />
                </Input>
              </View>
            </FormControl>
          </View>

          <View className="mb-5">
            <FormControl isRequired>
              <FormControlLabel>
                <FormControlLabelText className="text-neutral-900 font-semibold mb-2">
                  Seu e-mail
                </FormControlLabelText>
              </FormControlLabel>
              <View className="flex-row items-center border border-[#E5E7EB] rounded-lg bg-white px-3 shadow-sm">
                <Mail size={20} color="#9CA3AF" style={{ marginRight: 8 }} />
                <Input variant="unstyled" className="flex-1">
                  <InputField
                    placeholder="exemplo@dominio.com"
                    value={email}
                    onChangeText={setEmail}
                    inputMode="email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    className="text-neutral-900 text-base"
                    placeholderTextColor="#9CA3AF"
                  />
                </Input>
              </View>
            </FormControl>
          </View>

          <View className="mb-5">
            <FormControl isRequired>
              <FormControlLabel>
                <FormControlLabelText className="text-neutral-900 font-semibold mb-2">
                  Crie uma senha
                </FormControlLabelText>
              </FormControlLabel>
              <View className="flex-row items-center border border-[#E5E7EB] rounded-lg bg-white px-3 shadow-sm">
                <Lock size={20} color="#9CA3AF" style={{ marginRight: 8 }} />
                <Input variant="unstyled" className="flex-1">
                  <InputField
                    placeholder="Senha (mín. 6)"
                    value={pass}
                    onChangeText={setPass}
                    secureTextEntry
                    className="text-neutral-900 text-base"
                    placeholderTextColor="#9CA3AF"
                  />
                </Input>
              </View>
            </FormControl>
          </View>

          <View className="mb-6">
            <FormControl isRequired>
              <FormControlLabel>
                <FormControlLabelText className="text-neutral-900 font-semibold mb-2">
                  Confirmar senha
                </FormControlLabelText>
              </FormControlLabel>
              <View className="flex-row items-center border border-[#E5E7EB] rounded-lg bg-white px-3 shadow-sm">
                <Lock size={20} color="#9CA3AF" style={{ marginRight: 8 }} />
                <Input variant="unstyled" className="flex-1">
                  <InputField
                    placeholder="Repita a senha"
                    value={confirm}
                    onChangeText={setConfirm}
                    secureTextEntry
                    className="text-neutral-900 text-base"
                    placeholderTextColor="#9CA3AF"
                  />
                </Input>
              </View>
            </FormControl>
          </View>

          <Button
            action="primary"
            size="lg"
            className={`h-12 rounded-xl justify-center ${
              loading ? "bg-gray-300" : "bg-[#34A853]"
            }`}
            onPress={handleSignUp}
            isLoading={loading}
            isDisabled={loading || !canSubmit}
          >
            <ButtonText className="text-white font-bold">
              {loading ? "Registrando..." : "Criar conta"}
            </ButtonText>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
