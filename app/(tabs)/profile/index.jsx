import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import {
  Mail,
  CheckCircle2,
  AlertTriangle,
  Edit3,
  Image as ImageIcon,
  LogOut,
  Palette,
} from "lucide-react-native";

import useAuth from "@/hooks/_useAuth";
import { sendVerificationEmail } from "@/services";
import { SignOutButton } from "@/components/_sign-out-button";

// ⬇️ Ajuste este bloco se você usa outro pacote do gluestack (ex.: @gluestack-ui/themed)
import {
  Button,
  Input,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Divider,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectTrigger,
  SelectInput,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectItem,
} from "@/components/ui";

const Profile = () => {
  const { user, initializing } = useAuth();

  const [sendingEmail, setSendingEmail] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [phone, setPhone] = useState(user?.phoneNumber || "");
  const [theme, setTheme] = useState("system");

  // user have => "phoneNumber": undefined, "photoURL": undefined,

  const isVerified = !!user?.emailVerified;

  const initials = useMemo(() => {
    const name = user?.displayName || "";
    const parts = name.trim().split(" ").filter(Boolean);
    const first = parts[0]?.[0]?.toUpperCase() || "U";
    const last = parts[parts.length - 1]?.[0]?.toUpperCase() || "";
    return `${first}${last}`;
  }, [user?.displayName]);

  const avatarSrc = user?.photoURL ? { uri: user.photoURL } : null;

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
      {/* Conteúdo */}
      <ScrollView
        className="flex-1 px-5 py-6"
        contentContainerStyle={{ paddingBottom: 28 }}
      >
        {/* "Grid" simples: cartões empilhados (clean e agradável) */}
        {/* Card Identidade */}
        <View className="rounded-2xl bg-white p-6 shadow-sm mb-5">
          <View className="items-center">
            <TouchableOpacity
              accessibilityLabel="Trocar foto de perfil"
              className="relative"
              onPress={() =>
                Alert.alert("Foto de perfil", "Conecte aqui seu picker/câmera.")
              }
            >
              {avatarSrc ? (
                <Image source={avatarSrc} className="w-28 h-28 rounded-full" />
              ) : (
                <View className="w-28 h-28 rounded-full bg-gray-200 items-center justify-center">
                  <Text className="text-2xl font-bold text-gray-600">
                    {initials}
                  </Text>
                </View>
              )}
              <View className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow">
                <ImageIcon size={16} color="#1976D2" />
              </View>
            </TouchableOpacity>

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
                  setDisplayName(user?.displayName || "");
                  setPhone(user?.phoneNumber || "");
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

        {/* Card Preferências (só o essencial) */}
        <View className="rounded-2xl bg-white p-6 shadow-sm">
          <View className="flex-row items-center mb-2">
            <Palette size={18} color="#1976D2" />
            <Text className="ml-2 text-lg font-semibold text-gray-900">
              Preferências
            </Text>
          </View>
          <Text className="text-gray-500 mb-4">
            Ajuste a aparência do aplicativo
          </Text>

          <FormControl className="mb-3">
            <FormControlLabel>
              <FormControlLabelText>Tema</FormControlLabelText>
            </FormControlLabel>
            <Select selectedValue={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-full">
                <SelectInput placeholder="Selecione um tema" />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectItem label="Sistema" value="system" />
                  <SelectItem label="Claro" value="light" />
                  <SelectItem label="Escuro" value="dark" />
                </SelectContent>
              </SelectPortal>
            </Select>
          </FormControl>

          <Text className="text-gray-500 text-xs">
            * Persistir tema é opcional — conecte com seu store/context quando
            quiser.
          </Text>
        </View>
      </ScrollView>

      {/* MODAL: Edição simples de perfil */}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)}>
        <ModalBackdrop />
        <ModalContent className="mx-4">
          <ModalHeader>
            <Text className="text-lg font-semibold">Editar perfil</Text>
          </ModalHeader>
          <ModalBody>
            <FormControl className="mb-3">
              <FormControlLabel>
                <FormControlLabelText>Nome</FormControlLabelText>
              </FormControlLabel>
              <Input
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Seu nome"
                accessibilityLabel="Editar nome"
              />
            </FormControl>

            <FormControl>
              <FormControlLabel>
                <FormControlLabelText>Telefone</FormControlLabelText>
              </FormControlLabel>
              <Input
                value={phone}
                onChangeText={setPhone}
                placeholder="(00) 00000-0000"
                keyboardType="phone-pad"
                accessibilityLabel="Editar telefone"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter className="flex-row gap-3">
            <Button variant="outline" onPress={() => setEditOpen(false)}>
              <Text className="font-semibold text-gray-800">Cancelar</Text>
            </Button>
            <Button variant="solid" onPress={handleSaveProfile}>
              <Text className="text-white font-semibold">Salvar</Text>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </View>
  );
};

/* ====== Mini componentes só pra dar o acabamento visual ====== */

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
