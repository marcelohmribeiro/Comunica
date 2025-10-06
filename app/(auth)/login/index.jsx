import { useState } from "react";
import { ScrollView, View, Image, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Mail, Lock } from "lucide-react-native";
import { GoogleSignInButton } from "@/components/_google-sign-in-button";
import { useRouter } from "expo-router";
import { signInEmail } from "@/services";
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
  Divider,
} from "@/components/ui";
import { useLoading } from "@/store/helpers/_loading";

export default function SignIn() {
  const router = useRouter();
  const { startLoading, stopLoading, loading } = useLoading();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    if (!email || !password) return;
    try {
      startLoading();
      await signInEmail(email, password);
      Toast.show({
        type: "success",
        text1: "Login realizado",
        text2: "Bem-vindo novamente!",
      });
      router.replace("/(tabs)/home");
    } catch (e) {
      console.error("Erro ao logar:", e);
      Toast.show({
        type: "error",
        text1: "Erro no login",
        text2: "Não foi possível entrar. Tente novamente.",
      });
    } finally {
      stopLoading();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="bg-white px-10 pt-8 pb-6">
          <Image
            source={require("@/assets/comunica.png")}
            resizeMode="cover"
            className="w-full p-6 h-44 mt-28"
          />

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
                    value={email}
                    onChangeText={setEmail}
                    placeholder="exemplo@dominio.com"
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
                  Sua senha
                </FormControlLabelText>
              </FormControlLabel>

              <View className="flex-row items-center border border-[#E5E7EB] rounded-lg bg-white px-3 shadow-sm">
                <Lock size={20} color="#9CA3AF" style={{ marginRight: 8 }} />
                <Input variant="unstyled" className="flex-1">
                  <InputField
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Senha"
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
            onPress={handleSignIn}
            isLoading={loading > 0}
            isDisabled={loading > 0 || !email || !password}
            className={`h-12 rounded-xl justify-center ${
              loading ? "bg-gray-300" : "bg-[#34A853]"
            }`}
          >
            <ButtonText className="text-white font-bold">
              {loading ? "Entrando..." : "Entrar"}
            </ButtonText>
          </Button>

          <View className="items-center mt-3">
            <Text
              className="color-blue-600 underline text-sm"
              onPress={() => router.push("/(auth)/login/signup")}
            >
              Não possui uma conta?
            </Text>
          </View>

          <View className="flex-row items-center my-5">
            <Divider className="flex-1 bg-neutral-200 h-[1px]" />
            <Text className="mx-3 text-xs">ou</Text>
            <Divider className="flex-1 bg-neutral-200 h-[1px]" />
          </View>

          <View className="items-center">
            <GoogleSignInButton
              onSuccess={() => router.replace("/(tabs)/home")}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
