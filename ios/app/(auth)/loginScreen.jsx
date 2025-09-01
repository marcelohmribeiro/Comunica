// LoginScreen.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
} from "react-native";
import { Feather } from "@expo/vector-icons";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="flex-1 bg-[#F7F9FC]">
        <StatusBar barStyle="light-content" />
        {/* Faixa superior */}
        <View className="h-40 bg-[#0B3D91]">
          <View className="flex-1 items-center justify-end pb-6">
            <View className="w-16 h-16 rounded-full items-center justify-center bg-[#0B3D91] border border-[#C9A227]">
              <Feather name="shield" size={26} color="#C9A227" />
            </View>
            <Text className="mt-3 text-white text-xl font-semibold tracking-wider">
              PORTAL CIDADÃO
            </Text>
            <Text className="text-[#E2E8F0] text-xs tracking-widest uppercase">
              Acesso Seguro
            </Text>
          </View>
        </View>

        {/* CONTAINER CENTRALIZADO */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1 -mt-10 px-6 items-center justify-center"
        >
          {/* Card central (largura limitada e centralizado) */}
          <View
            className="bg-white rounded-2xl shadow-lg p-6 w-full"
            style={{ maxWidth: 420, alignSelf: "center" }}
          >
            <Text className="text-[#0B3D91] text-2xl font-bold">Entrar</Text>
            <Text className="text-[#64748B] mt-1">
              Utilize suas credenciais para prosseguir
            </Text>

            {/* E-mail */}
            <View className="mt-6">
              <Text className="text-[#0B3D91] text-sm font-medium mb-2">
                E-mail institucional
              </Text>
              <View className="flex-row items-center bg-[#F1F5F9] border border-[#CBD5E1] rounded-xl px-3">
                <Feather name="mail" size={18} color="#0B3D91" />
                <TextInput
                  className="flex-1 ml-2 h-12 text-[#0F172A]"
                  placeholder="nome.sobrenome@org.gov"
                  placeholderTextColor="#94A3B8"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Senha */}
            <View className="mt-4">
              <Text className="text-[#0B3D91] text-sm font-medium mb-2">
                Senha
              </Text>
              <View className="flex-row items-center bg-[#F1F5F9] border border-[#CBD5E1] rounded-xl px-3">
                <Feather name="lock" size={18} color="#0B3D91" />
                <TextInput
                  className="flex-1 ml-2 h-12 text-[#0F172A]"
                  placeholder="••••••••"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry
                  value={senha}
                  onChangeText={setSenha}
                />
              </View>
            </View>

            {/* Ações */}
            <View className="mt-6">
              <Pressable className="h-12 rounded-xl bg-[#0B3D91] items-center justify-center">
                <Text className="text-white font-semibold text-base tracking-wide">
                  Acessar
                </Text>
              </Pressable>

              <View className="mt-4 items-center">
                <Pressable>
                  <Text className="text-[#0B3D91] text-sm font-medium">
                    Esqueci minha senha
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Rodapé do cartão */}
            <View className="mt-6 border-t border-[#E2E8F0] pt-4">
              <View className="flex-row items-center">
                <View className="w-2 h-2 rounded-full bg-[#C9A227] mr-2" />
                <Text className="text-xs text-[#64748B]">
                  Este é um ambiente seguro do Governo. Não compartilhe sua
                  senha.
                </Text>
              </View>
            </View>
          </View>

          {/* Assinatura visual */}
          <View className="items-center mt-6 opacity-90">
            <View className="w-24 h-1.5 rounded-full bg-[#0B3D91]" />
            <Text className="mt-3 text-[11px] tracking-widest text-[#475569] uppercase">
              Secretaria Digital
            </Text>
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}
