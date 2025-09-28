// components/report-detail-modal.js
import React from "react";
import { View, Image, Text } from "react-native";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  ButtonText,
} from "@/components/ui";

const STATUS_COLOR = {
  aberta: "#EF4444",
  em_andamento: "#F59E0B",
  resolvida: "#10B981",
};
const STATUS_LABEL = {
  aberta: "Aberta",
  em_andamento: "Em andamento",
  resolvida: "Resolvida",
};

export default function ReportDetail({
  open = false,
  onClose = () => {},
  report = null,
  onSeeMap, // opcional: callback p/ centralizar no mapa
  onShare, // opcional: callback p/ compartilhar
}) {
  if (!report) return null;

  return (
    <Modal isOpen={open} onClose={onClose} size="lg" avoidKeyboard>
      <ModalBackdrop />
      <ModalContent className="rounded-2xl overflow-hidden">
        <ModalHeader className="px-4 pt-4">
          <Text size="lg" className="text-gray-900" isTruncated>
            {report?.title || "Detalhes da denúncia"}
          </Text>
          <ModalCloseButton />
        </ModalHeader>

        <ModalBody className="px-4 pb-4">
          {report?.imageUrl ? (
            <Image
              source={{ uri: report.imageUrl }}
              className="w-full h-44 rounded-xl mb-3"
              resizeMode="cover"
            />
          ) : null}

          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-gray-700 font-medium">
              {report?.category || "Sem categoria"}
            </Text>

            <View
              className="px-2 py-1 rounded-full"
              style={{
                backgroundColor: STATUS_COLOR[report?.status] || "#9CA3AF",
              }}
            >
              <Text className="text-white text-xs font-medium">
                {STATUS_LABEL[report?.status] || "—"}
              </Text>
            </View>
          </View>

          {report?.description ? (
            <Text className="text-gray-700 leading-5">
              {report.description}
            </Text>
          ) : (
            <Text className="text-gray-400">Sem descrição.</Text>
          )}

          {report?.location?.latitude && report?.location?.longitude ? (
            <View className="mt-3">
              <Text className="text-xs text-gray-500">
                Lat: {report.location.latitude} • Lng:{" "}
                {report.location.longitude}
              </Text>
            </View>
          ) : null}
        </ModalBody>

        <ModalFooter className="px-4 pb-4 gap-2">
          {onShare ? (
            <Button
              variant="outline"
              action="secondary"
              onPress={() => onShare(report)}
            >
              <ButtonText>Compartilhar</ButtonText>
            </Button>
          ) : null}

          {onSeeMap ? (
            <Button action="primary" onPress={() => onSeeMap(report)}>
              <ButtonText>Ver no mapa</ButtonText>
            </Button>
          ) : null}

          <Button variant="outline" action="secondary" onPress={onClose}>
            <ButtonText>Fechar</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
