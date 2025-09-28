import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Camera as ExpoCamera } from "expo-camera";
import * as Location from "expo-location";
import Toast from "react-native-toast-message";
import { Camera, MapPin, Send, Trash2, X } from "lucide-react-native";

import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectItem,
  Button,
  ButtonText,
  Spinner,
} from "@/components/ui";

import { createReport } from "@/services/_reports";
import { useLoading } from "@/helpers/_loading";

const BRAND = { primary: "#1976D2" };

const CATEGORIES = [
  { value: "buraco_rua", label: "Buraco na Rua" },
  { value: "iluminacao_publica", label: "Iluminação Pública" },
  { value: "lixo_acumulado", label: "Lixo Acumulado" },
  { value: "rede_agua", label: "Rede de Água" },
  { value: "poste_danificado", label: "Poste Danificado" },
  { value: "arvore_caida", label: "Árvore Caída" },
  { value: "calcada_danificada", label: "Calçada Danificada" },
  { value: "barulho", label: "Barulho" },
  { value: "vizinhança", label: "Vizinhança" },
  { value: "limpeza", label: "Limpeza" },
  { value: "segurança", label: "Segurança" },
  { value: "outros", label: "Outro" },
];

const TITLE_MAX = 60;
const DESC_MAX = 400;

export default function NewReportScreen() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [photoUri, setPhotoUri] = useState(null);
  const [usingCamera, setUsingCamera] = useState(false);
  const cameraRef = useRef(null);

  const [hasCamPermission, setHasCamPermission] = useState(null);
  const [hasLocPermission, setHasLocPermission] = useState(null);

  const [locationLabel, setLocationLabel] = useState("Usar localização atual");
  const [pendingLocation, setPendingLocation] = useState(null);

  const { startLoading, stopLoading } = useLoading();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const cam = await ExpoCamera.requestCameraPermissionsAsync();
      setHasCamPermission(cam.status === "granted");
      const loc = await Location.requestForegroundPermissionsAsync();
      setHasLocPermission(loc.status === "granted");
    })();
  }, []);

  useEffect(() => {
    if (pendingLocation) {
      setLocationLabel(
        `${pendingLocation.latitude.toFixed(
          5
        )}, ${pendingLocation.longitude.toFixed(5)} (${pendingLocation.source})`
      );
    } else {
      setLocationLabel("Usar localização atual");
    }
  }, [pendingLocation]);

  const canSubmit = useMemo(
    () =>
      !!selectedCategory &&
      !!description.trim() &&
      !!title.trim() &&
      !submitting,
    [selectedCategory, description, title, submitting]
  );

  const openCamera = () => {
    if (!hasCamPermission) {
      Alert.alert(
        "Permissão",
        "Câmera não autorizada. Ative nas configurações."
      );
      return;
    }
    setUsingCamera(true);
  };

  const takePhoto = async () => {
    if (!cameraRef.current) {
      Alert.alert("Erro", "Câmera indisponível.");
      return;
    }
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        exif: true,
      });
      setPhotoUri(photo.uri);
      setUsingCamera(false);

      let coords = null;
      const exif = photo?.exif;
      if (exif?.GPSLatitude && exif?.GPSLongitude) {
        const lat = Array.isArray(exif.GPSLatitude)
          ? exif.GPSLatitude[0]
          : exif.GPSLatitude;
        const lon = Array.isArray(exif.GPSLongitude)
          ? exif.GPSLongitude[0]
          : exif.GPSLongitude;
        coords = {
          latitude: Number(lat),
          longitude: Number(lon),
          accuracy: exif.GPSAltitude || null,
          timestamp: Date.now(),
          source: "exif",
        };
      }
      if (!coords && hasLocPermission) {
        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });
        coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy ?? null,
          timestamp: pos.timestamp ?? Date.now(),
          source: "gps",
        };
      }
      setPendingLocation(coords || null);
    } catch (e) {
      console.error(e);
      Alert.alert("Erro", "Falha ao tirar foto.");
    }
  };

  const removePhoto = () => {
    setPhotoUri(null);
    setPendingLocation(null);
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      Alert.alert("Erro", "Preencha título, descrição e categoria.");
      return;
    }
    startLoading();
    try {
      setSubmitting(true);
      await createReport({
        title: title.trim(),
        description: description.trim(),
        category: selectedCategory,
        imageUri: photoUri,
        location: pendingLocation || null,
      });
      setSelectedCategory(null);
      setDescription("");
      setTitle("");
      setPhotoUri(null);
      setPendingLocation(null);
      Toast.show({
        type: "success",
        text1: "Denúncia Enviada",
        text2: 'Sua denúncia foi registrada. Acompanhe na aba "Início".',
      });
    } catch (e) {
      console.error(e);
      Alert.alert("Erro", e?.message || "Não foi possível enviar a denúncia.");
    } finally {
      setSubmitting(false);
      stopLoading();
    }
  };

  const Header = () => (
    <>
      <StatusBar barStyle="light-content" backgroundColor={BRAND.primary} />
      <SafeAreaView style={{ backgroundColor: BRAND.primary }}>
        <View
          className="px-4 py-4"
          style={{
            backgroundColor: BRAND.primary,
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
            elevation: 6,
          }}
        >
          <Text className="text-2xl font-bold text-white">Nova Denúncia</Text>
          <Text className="text-white/90 mt-1">
            Registre um problema na sua comunidade
          </Text>
        </View>
      </SafeAreaView>
    </>
  );

  const PhotoArea = () => {
    if (usingCamera) {
      return (
        <View
          className="mb-6 rounded-2xl overflow-hidden"
          style={{ height: 360 }}
        >
          <ExpoCamera ref={cameraRef} style={{ flex: 1 }} ratio="16:9" />
          <View className="absolute bottom-4 left-0 right-0 px-4">
            <View className="flex-row gap-3 justify-center">
              <TouchableOpacity
                className="bg-white px-5 py-3 rounded-full flex-row items-center shadow"
                onPress={takePhoto}
              >
                <Camera size={18} />
                <Text className="font-semibold ml-2">Tirar foto</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-black/60 px-5 py-3 rounded-full"
                onPress={() => setUsingCamera(false)}
              >
                <Text className="text-white font-semibold">Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View className="mb-6">
        {photoUri ? (
          <View className="relative">
            <Image
              source={{ uri: photoUri }}
              className="w-full h-48 rounded-xl"
              resizeMode="cover"
            />
            <TouchableOpacity
              className="absolute top-2 right-2 bg-red-500 rounded-full p-1"
              onPress={removePhoto}
            >
              <X color="white" size={20} />
            </TouchableOpacity>

            <View className="mt-3 flex-row items-center">
              <MapPin color={BRAND.primary} size={18} />
              <Text className="text-gray-700 ml-2">
                {pendingLocation
                  ? `${pendingLocation.latitude.toFixed(
                      5
                    )}, ${pendingLocation.longitude.toFixed(5)} (${
                      pendingLocation.source
                    })`
                  : "Localização não disponível"}
              </Text>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            className="flex-row items-center justify-center bg-white border-2 border-dashed border-gray-300 rounded-xl p-8"
            onPress={openCamera}
          >
            <Camera color={BRAND.primary} size={24} />
            <Text className="text-[#1976D2] font-medium ml-2">
              Adicionar Foto
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Header />

      {/* Conteúdo */}
      <ScrollView
        className="flex-1 px-4 py-4"
        keyboardShouldPersistTaps="handled"
      >
        {/* Categoria em Select */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            Categoria
          </Text>
          <Select
            selectedValue={selectedCategory ?? ""}
            onValueChange={(val) => setSelectedCategory(val)}
          >
            <SelectTrigger className="bg-white border border-gray-300 rounded-xl px-3 py-3">
              <SelectInput placeholder="Selecione a categoria..." />
              <SelectIcon className="ml-2" />
            </SelectTrigger>
            <SelectPortal>
              <SelectBackdrop />
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.value} label={c.label} value={c.value} />
                ))}
              </SelectContent>
            </SelectPortal>
          </Select>
        </View>

        {/* Título */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-3">Título</Text>
          <TextInput
            className="bg-white border border-gray-300 rounded-xl p-4 text-gray-700"
            placeholder="Ex.: Barulho alto durante a madrugada"
            value={title}
            onChangeText={(t) => t.length <= TITLE_MAX && setTitle(t)}
            maxLength={TITLE_MAX}
          />
          <Text className="text-gray-400 text-xs mt-1 self-end">
            {title.length}/{TITLE_MAX}
          </Text>
        </View>

        {/* Descrição */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            Descrição
          </Text>
          <TextInput
            className="bg-white border border-gray-300 rounded-xl p-4 text-gray-700 h-32"
            placeholder="Descreva o problema com detalhes..."
            value={description}
            onChangeText={(t) => t.length <= DESC_MAX && setDescription(t)}
            multiline
            textAlignVertical="top"
            maxLength={DESC_MAX}
          />
          <Text className="text-gray-400 text-xs mt-1 self-end">
            {description.length}/{DESC_MAX}
          </Text>
        </View>

        {/* Foto */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-3">Foto</Text>
          <PhotoArea />
        </View>

        {/* Localização */}
        <View className="mb-8">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            Localização
          </Text>
          <TouchableOpacity className="flex-row items-center bg-white border border-gray-300 rounded-xl p-4">
            <MapPin color={BRAND.primary} size={20} />
            <Text className="text-gray-700 ml-2 flex-1">{locationLabel}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Botão primário */}
      <View className="px-4 pb-6">
        <Button
          onPress={handleSubmit}
          isDisabled={!canSubmit}
          className={`rounded-xl py-4 ${canSubmit ? "" : "opacity-60"}`}
          style={{ backgroundColor: BRAND.primary }}
        >
          {submitting ? (
            <>
              <Spinner accessibilityLabel="Enviando denúncia..." />
              <ButtonText className="ml-2">Enviando...</ButtonText>
            </>
          ) : (
            <View className="flex-row items-center justify-center">
              <Send color="white" size={20} />
              <ButtonText className="text-white text-lg font-bold ml-2">
                Enviar
              </ButtonText>
            </View>
          )}
        </Button>
      </View>
    </View>
  );
}
