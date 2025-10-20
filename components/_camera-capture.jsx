import React, { useCallback, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import { Camera, MapPin, X } from "lucide-react-native";
import { useLoading } from "@/store";

export const CameraCapture = ({ value, onChange }) => {
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [usingCamera, setUsingCamera] = useState(false);
  const { startLoading, stopLoading } = useLoading();

  const setValue = useCallback(
    (next) => onChange?.({ ...value, ...next }),
    [onChange, value]
  );

  const getLocation = async () => {
    try {
      const perm = await Location.requestForegroundPermissionsAsync();
      if (perm.status !== "granted") {
        return { coords: null, address: {} }; // negou
      }
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      const { latitude, longitude, accuracy } = position.coords;
      let addr = {};
      try {
        const results = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (results.length > 0) {
          const place = results[0];
          addr = {
            street: place.street || "",
            district: place.district || "",
            city: place.city || "",
            region: place.region || "",
          };
        }
      } catch (error) {
        console.error("Erro ao pegar endereço", +error);
      }
      return {
        coords: {
          latitude,
          longitude,
          accuracy,
        },
        address: addr,
      };
    } catch (error) {
      Alert.alert("Não foi possível obter a localização", "Tente novamente.");
      return { coords: null, address: {} };
    }
  };

  const openCamera = useCallback(async () => {
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
  }, [permission?.granted, requestPermission]);

  const takePhoto = useCallback(async () => {
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
      setUsingCamera(false);
      const { coords, address } = await getLocation();
      setValue({ photoUri: photo.uri, coords, address });
    } catch (e) {
      console.error(e);
      Alert.alert("Erro", "Falha ao tirar foto.");
    } finally {
      stopLoading();
    }
  }, [getLocation, setValue]);

  const clearPhoto = useCallback(() => {
    setValue({ photoUri: null, coords: null, address: {} });
  }, [setValue]);

  const photoUri = value?.photoUri;
  const coords = value?.coords;
  const address = value?.address;

  return (
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
          {coords && (
            <View className="mt-3 flex-row items-center">
              <MapPin color="#1976D2" size={18} />
              <Text className="text-gray-700 ml-2">
                {coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)}
              </Text>
            </View>
          )}
          {address && (
            <View className="mt-3 bg-white border border-gray-300 rounded-xl p-4">
              <View className="flex-row items-center mb-2">
                <MapPin color="#1976D2" size={20} />
                <Text className="text-gray-700 ml-2 font-semibold">
                  {address?.city} - {address?.region}
                </Text>
              </View>
              {!!address?.district && (
                <Text className="text-gray-600">
                  Bairro: {address.district}
                </Text>
              )}
              {!!address?.street && (
                <Text className="text-gray-600">Rua: {address.street}</Text>
              )}
            </View>
          )}
        </View>
      ) : (
        <TouchableOpacity
          className="flex-row items-center justify-center bg-white border-2 border-dashed border-gray-300 rounded-xl p-8"
          onPress={openCamera}
        >
          <Camera color="#1976D2" size={24} />
          <Text className="text-[#1976D2] font-medium ml-2">
            Adicionar Foto
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
