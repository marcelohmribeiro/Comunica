import React, { useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import Toast from "react-native-toast-message";
import { Camera, MapPin, Send, X } from "lucide-react-native";
import { CATEGORIES } from "@/constants";
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
} from "@/components/ui";
import { createReport } from "@/services/_reports";
import { useLoading } from "@/store/helpers/_loading";

const BRAND = { primary: "#1976D2" };
const DESC_MAX = 150;

const NewReport = () => {
  const { startLoading, stopLoading, loading } = useLoading();
  const cameraRef = useRef(null);

  const [form, setForm] = useState({
    description: "",
    category: "",
  });
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState(null);
  const [usingCamera, setUsingCamera] = useState(false);
  const [pendingLocation, setPendingLocation] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [address, setAddress] = useState({
    street: "",
    district: "",
    city: "",
    region: "",
  });

  const canSubmit =
    !!form.category &&
    !!form.description.trim() &&
    !!photoUri &&
    !!pendingLocation &&
    !submitting;

  async function getLocation() {
    try {
      const { currentStatus } = await Location.getCurrentPositionAsync();

      let status = currentStatus;
      if (currentStatus !== "granted") {
        const req = await Location.requestForegroundPermissionsAsync();
        status = req.status;
      }

      if (status !== "granted") {
        return null; // negou
      }

      const last = await Location.getLastKnownPositionAsync();
      const pos =
        last ??
        (await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        }));

      const { latitude, longitude, accuracy } = pos.coords;

      let addressObj = { street: "", district: "", city: "", region: "" };
      try {
        const results = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (results.length > 0) {
          const place = results[0];
          addressObj = {
            street: place.street || "",
            district: place.district || "",
            city: place.city || "",
            region: place.region || "",
          };
        }
      } catch (error) {
        console.error("Erro ao pegar endereço", +error);
      }
      setAddress(addressObj);
      return {
        latitude,
        longitude,
        accuracy,
        address: addressObj,
      };
    } catch (error) {
      console.error("Erro ao buscar localização" + error);
    }
  }

  async function openCamera() {
    if (!permission?.granted) {
      const res = await requestPermission();
      if (!res) {
        Alert.alert(
          "Permissão",
          "Câmera não autorizada. Ative nas configurações."
        );
        return;
      }
    }
    setUsingCamera(true);
  }

  async function takePhoto() {
    if (!cameraRef.current) {
      Alert.alert("Erro", "Câmera indisponível.");
      return;
    }
    try {
      startLoading();
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        exif: true,
      });
      setPhotoUri(photo.uri);
      setUsingCamera(false);
      let coords = await getLocation();
      setPendingLocation(coords);
    } catch (e) {
      console.error(e);
      Alert.alert("Erro", "Falha ao tirar foto.");
    } finally {
      stopLoading();
    }
  }

  function clearPhoto() {
    setPhotoUri(null);
    setPendingLocation(null);
  }

  async function handleSubmit() {
    if (!canSubmit) {
      Alert.alert("Erro", "Preencha todos os campos do formulário.");
      return;
    }
    startLoading();
    setSubmitting(true);
    try {
      await createReport({
        description: form.description.trim(),
        category: form.category,
        imageUri: photoUri || null,
        location: pendingLocation || null,
      });

      setForm({ description: "", category: "" });
      setPhotoUri(null);
      setPendingLocation(null);

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
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* CONTEÚDO */}
      <ScrollView
        className="flex-1 px-4 py-4"
        keyboardShouldPersistTaps="handled"
      >
        {/* Categoria */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            Categoria
          </Text>
          <Select
            selectedValue={form.category}
            onValueChange={(val) => setForm((f) => ({ ...f, category: val }))}
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

        {/* Foto + Localização */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-3">Foto</Text>

          {usingCamera ? (
            <View
              className="mb-3 rounded-2xl overflow-hidden"
              style={{ height: 360 }}
            >
              <CameraView ref={cameraRef} style={{ flex: 1 }} ratio="16:9" />
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
          ) : photoUri ? (
            <View className="relative">
              <Image
                source={{ uri: photoUri }}
                className="w-full h-48 rounded-xl"
                resizeMode="cover"
              />
              <TouchableOpacity
                className="absolute top-2 right-2 bg-red-500 rounded-full p-1"
                onPress={clearPhoto}
              >
                <X color="white" size={20} />
              </TouchableOpacity>
              {pendingLocation && (
                <View className="mt-3 flex-row items-center">
                  <MapPin color={BRAND.primary} size={18} />
                  <Text className="text-gray-700 ml-2">{`${pendingLocation.latitude.toFixed(
                    5
                  )}, ${pendingLocation.longitude.toFixed(5)}`}</Text>
                </View>
              )}
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

        {photoUri && address && (
          <View className="mb-8">
            <Text className="text-lg font-bold text-gray-800 mb-3">
              Localização
            </Text>
            <View className="bg-white border border-gray-300 rounded-xl p-4">
              <View className="flex-row items-center mb-2">
                <MapPin color={BRAND.primary} size={20} />
                <Text className="text-gray-700 ml-2 font-semibold">
                  {address?.city} - {address?.region}
                </Text>
              </View>
              {address.district ? (
                <Text className="text-gray-600">
                  Bairro: {address?.district}
                </Text>
              ) : null}
              {address.street ? (
                <Text className="text-gray-600">Rua: {address?.street}</Text>
              ) : null}
            </View>
          </View>
        )}

        {/* Descrição */}
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

      {/* Botão Enviar */}
      <View className="px-4 pb-6">
        <Button
          onPress={handleSubmit}
          isDisabled={!canSubmit}
          isLoading={loading > 0}
          className={`rounded-xl ${canSubmit ? "" : "opacity-60"}`}
          style={{ backgroundColor: BRAND.primary }}
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
