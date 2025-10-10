import React, { useCallback, useState, useMemo } from "react";
import { View, Text, ScrollView, TextInput } from "react-native";
import { Send } from "lucide-react-native";
import { Button, ButtonText } from "@/components/ui";
import { CategorySelect, CameraCapture } from "@/components";
import { createReport } from "@/services/_reports";
import { useLoading } from "@/store";
import Toast from "react-native-toast-message";

const DESC_MAX = 150;

const NewReport = () => {
  const { startLoading, stopLoading, loading } = useLoading();
  const [form, setForm] = useState({
    description: "",
    category: "",
  });
  const [cameraValue, setCameraValue] = useState({
    photoUri: null,
    coords: {},
    address: {},
  });
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      !!form.category &&
      !!form.description.trim() &&
      !!cameraValue.photoUri &&
      !!cameraValue.coords &&
      !submitting
    );
  }, [form, cameraValue, submitting]);

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) {
      Toast.show({
        type: "info",
        text1: "Os campos são obrigatórios",
        text2: "Preencha todos os campos do formulário.",
      });
      return;
    }
    startLoading();
    setSubmitting(true);
    try {
      await createReport({
        description: form.description.trim(),
        category: form.category,
        imageUri: cameraValue.photoUri,
        location: cameraValue.coords
          ? { coordinate: cameraValue.coords, address: cameraValue.address }
          : null,
      });
      setForm({ description: "", category: null });
      setCameraValue({ photoUri: null, coords: {}, address: {} });
      Toast.show({
        type: "success",
        text1: "Denúncia Enviada",
        text2: 'Sua denúncia foi registrada. Acompanhe na aba "Início".',
      });
    } catch (e) {
      console.error(e);
      Toast.show({
        type: "error",
        text1: "Ops! Algo deu errado",
        text2:
          "Não conseguimos enviar sua denúncia. Por favor, Tente novamente.",
      });
    } finally {
      setSubmitting(false);
      stopLoading();
    }
  }, [canSubmit, form, cameraValue]);

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1 px-4 py-4"
        keyboardShouldPersistTaps="handled"
      >
        <CategorySelect
          value={form.category}
          onChange={(val) => setForm((f) => ({ ...f, category: val }))}
        />

        <CameraCapture value={cameraValue} onChange={setCameraValue} />

        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            Descrição
          </Text>
          <TextInput
            className="bg-white border border-gray-300 rounded-xl p-4 text-gray-700 h-32"
            placeholder="Descreva o problema com detalhes..."
            value={form.description}
            onChangeText={(t) =>
              t.length <= DESC_MAX && setForm((f) => ({ ...f, description: t }))
            }
            multiline
            textAlignVertical="top"
            maxLength={DESC_MAX}
          />
          <Text className="text-gray-400 text-xs mt-1 self-end">
            {form.description.length}/{DESC_MAX}
          </Text>
        </View>
      </ScrollView>

      <View className="px-4 pb-6">
        <Button
          onPress={handleSubmit}
          isDisabled={!canSubmit}
          isLoading={loading > 0}
          className={`rounded-xl ${canSubmit ? "" : "opacity-60"}`}
          style={{ backgroundColor: "#1976D2" }}
        >
          <View className="flex-row items-center justify-center">
            <Send color="white" size={20} />
            <ButtonText className="text-white text-lg font-bold ml-2">
              {submitting ? "Enviando..." : "Enviar"}
            </ButtonText>
          </View>
        </Button>
      </View>
    </View>
  );
};

export default NewReport;
