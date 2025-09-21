import { useState } from "react";
import { SafeAreaView, ScrollView, View, Image } from "react-native";
import { Mail, Lock } from "lucide-react-native";
import { GoogleSignInButton } from "@/components/google-sign-in-button";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
// Gluestack
import { Text as GSText } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { Divider } from "@/components/ui/divider";
import { signInEmail } from "@/services";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) return;
    try {
      setLoading(true);
      await signInEmail(email, password);
      Toast.show({
        type: "success",
        text1: "Login realizado",
        text2: "Bem-vindo novamente!",
      });
      router.push("/(tabs)/home");
    } catch (e) {
      console.error("Erro ao logar:", e);
      Toast.show({
        type: "error",
        text1: "Erro no login",
        text2: "Não foi possível entrar. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="bg-white px-10 pt-8 pb-6">
          <Image
            source={require("@/assets/logo-comunica.png")}
            resizeMode="cover"
            className="w-full h-44 mt-28"
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
            isLoading={loading}
            isDisabled={loading || !email || !password}
            className={`h-12 rounded-xl justify-center ${
              loading ? "bg-gray-300" : "bg-[#34A853]"
            }`}
          >
            <ButtonText className="text-white font-bold">
              {loading ? "Entrando..." : "Entrar"}
            </ButtonText>
          </Button>

          <View className="items-center mt-3">
            <GSText
              size="sm"
              underline
              className="color-blue-600"
              onPress={() => router.push("/(auth)/login/signup")}
            >
              Não possui uma conta?
            </GSText>
          </View>

          <View className="flex-row items-center my-5">
            <Divider className="flex-1 bg-neutral-200 h-[1px]" />
            <GSText size="xs" color="$textLight600" className="mx-3">
              ou
            </GSText>
            <Divider className="flex-1 bg-neutral-200 h-[1px]" />
          </View>

          <View className="items-center">
            <GoogleSignInButton
              showSpinnerOverlay={false}
              onSuccess={() => router.replace("/(tabs)/home")}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
