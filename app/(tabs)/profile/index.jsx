import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  Mail,
  CheckCircle2,
  AlertTriangle,
  Edit3,
  LogOut,
} from "lucide-react-native";
import useAuth from "@/hooks/_useAuth";
import { sendVerificationEmail } from "@/services/_auth";
import { SignOutButton, ProfileEdit } from "@/components";
import { Button, Divider } from "@/components/ui";
import Toast from "react-native-toast-message";

const Profile = () => {
  const { user, initializing } = useAuth();

  const [sendingEmail, setSendingEmail] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  // user have => "phoneNumber": undefined, "photoURL": undefined,

  const isVerified = !!user?.emailVerified;

  const handleSendVerification = async () => {
    setSendingEmail(true);
    try {
      await sendVerificationEmail();
      Toast.show({
        type: "success",
        text1: "Verificação enviada",
        text2: "Confira seu email para confirmar sua conta.",
      });
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Ops! Algo deu errado",
        text2: "Não foi possível enviar o email de verificação.",
      });
    } finally {
      setSendingEmail(false);
    }
  };

  const handleSaveProfile = async () => {
    // TODO: integre com seu updateProfile do Firebase (displayName/phone)
    // ex: await updateProfile(auth.currentUser, { displayName });
    setEditOpen(false);
    Alert.alert("Pronto!", "Seu perfil foi atualizado.");
  };

  if (initializing) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1 px-5 py-6"
        contentContainerStyle={{ paddingBottom: 28 }}
      >
        <View className="rounded-2xl bg-white p-6 shadow-sm mb-5">
          <View className="items-center">
            <Image
              source={require("@/assets/default-profile.png")}
              className="w-28 h-28 rounded-full"
            />

            <Text
              className="text-xl font-bold text-gray-900 mt-3"
              testID="profile-name"
            >
              {user?.displayName || "Usuário"}
            </Text>

            <View className="flex-row items-center mt-1">
              <Mail size={16} color="#6b7280" />
              <Text className="text-gray-600 ml-1" testID="profile-email">
                {user?.email || "—"}
              </Text>
            </View>

            <View className="mt-3">
              {isVerified ? (
                <Pill
                  tone="success"
                  icon={CheckCircle2}
                  text="Email verificado"
                />
              ) : (
                <Pill
                  tone="warning"
                  icon={AlertTriangle}
                  text="Email não verificado"
                />
              )}
            </View>

            {!isVerified && (
              <Button
                variant="solid"
                size="md"
                onPress={handleSendVerification}
                isDisabled={sendingEmail}
                className="mt-3 w-full"
                accessibilityLabel="Enviar verificação de email"
              >
                <Text className="text-white font-semibold">
                  {sendingEmail ? "Enviando..." : "Enviar verificação de email"}
                </Text>
              </Button>
            )}

            <Divider className="my-6" />

            <View className="w-full gap-3">
              <Button
                variant="outline"
                size="md"
                onPress={() => {
                  setEditOpen(true);
                }}
                accessibilityLabel="Editar perfil"
              >
                <View className="flex-row items-center justify-center">
                  <Edit3 size={16} color="#1976D2" />
                  <Text className="ml-2 font-semibold text-[#1976D2]">
                    Editar perfil
                  </Text>
                </View>
              </Button>

              <SignOutButton>
                <View className="flex-row items-center justify-center bg-red-500 py-3 rounded-xl">
                  <LogOut size={18} color="#fff" />
                  <Text className="text-white font-semibold ml-2">Sair</Text>
                </View>
              </SignOutButton>
            </View>
          </View>
        </View>
      </ScrollView>

      <ProfileEdit
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        handleSave={handleSaveProfile}
      />
    </View>
  );
};

function Pill({ tone = "success", icon: Icon = CheckCircle2, text = "" }) {
  const styles =
    tone === "success"
      ? "bg-green-100"
      : tone === "warning"
      ? "bg-yellow-100"
      : "bg-gray-100";
  const textColor =
    tone === "success"
      ? "text-green-800"
      : tone === "warning"
      ? "text-yellow-800"
      : "text-gray-800";

  return (
    <View
      className={`flex-row items-center self-center px-3 py-1 rounded-full ${styles}`}
    >
      <Icon size={14} color="#075985" />
      <Text className={`ml-1 text-xs font-semibold ${textColor}`}>{text}</Text>
    </View>
  );
}

export default Profile;
