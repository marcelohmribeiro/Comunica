import { useState } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import { useAuth } from "@/hooks/_useAuth";
import { SignOutButton } from "@/components/sign-out-button";

import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { sendVerificationEmail } from "@/services";

export default function Profile() {
  const { user, initializing } = useAuth();
  const [sendingEmail, setSendingEmail] = useState(false);

  const handleSendVerification = async () => {
    setSendingEmail(true);
    try {
      await sendVerificationEmail();
      Alert.alert(
        "Verificação enviada",
        "Confira seu email para confirmar sua conta."
      );
    } catch (e) {
      Alert.alert("Erro", "Não foi possível enviar o email de verificação.");
    } finally {
      setSendingEmail(false);
    }
  };

  if (initializing) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <ActivityIndicator />
      </View>
    );
  }

  const isVerified = user.emailVerified;

  return (
    <View className="flex-1 bg-gray-100">
      <View className="flex-1 items-center justify-center p-6">
        {/* Card */}
        <View
          className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg"
          accessibilityLabel="Cartão de perfil"
        >
          {/* Header */}
          <VStack space="xs" className="mb-4">
            <Text className="text-2xl font-extrabold tracking-tight">
              👤 Meu Perfil
            </Text>
            <Text className="text-gray-500 text-sm">
              Veja seus dados de conta e status de verificação
            </Text>
          </VStack>

          {/* Info block */}
          <View className="rounded-xl border border-gray-200 p-4 mb-4">
            <VStack space="xs">
              <Text className="text-xl font-semibold" testID="profile-name">
                {user.displayName || "Usuário"}
              </Text>
              <Text className="text-gray-600" testID="profile-email">
                {user.email || "—"}
              </Text>

              <View className="mt-2">
                {isVerified ? (
                  <Badge action="success" variant="solid">
                    <BadgeText>Email verificado</BadgeText>
                  </Badge>
                ) : (
                  <Badge action="warning" variant="solid">
                    <BadgeText>Email não verificado</BadgeText>
                  </Badge>
                )}
              </View>
            </VStack>
          </View>

          {/* Actions */}
          <VStack space="md">
            {!isVerified && (
              <Button
                size="md"
                variant="solid"
                onPress={handleSendVerification}
                isDisabled={sendingEmail}
                className="w-full"
                accessibilityLabel="Enviar verificação de email"
              >
                <Text className="text-white font-semibold">
                  {sendingEmail ? "Enviando..." : "Enviar verificação de email"}
                </Text>
              </Button>
            )}

            <View className="pt-2 border-t border-gray-100">
              <SignOutButton />
            </View>
          </VStack>
        </View>
      </View>
    </View>
  );
}
