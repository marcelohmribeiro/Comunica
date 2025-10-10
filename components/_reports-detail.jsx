import { memo } from "react";
import { View, Image, Text } from "react-native";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  ButtonText,
} from "@/components/ui";
import { STATUS_COLOR, STATUS_LABEL } from "@/constants";
import { getCategoryLabel } from "@/utils/_category";

const ReportDetail = memo(
  ({ open = false, onClose = () => {}, report = null, onSeeMap }) => {
    if (!report) return null;

    return (
      <Modal isOpen={open} onClose={onClose} size="lg" avoidKeyboard>
        <ModalBackdrop />
        <ModalContent className="rounded-2xl overflow-hidden">
          <ModalBody className="px-4 pb-4">
            {report?.imageUrl ? (
              <Image
                source={{ uri: report.imageUrl }}
                className="w-full h-44 rounded-xl mb-3"
                resizeMode="cover"
              />
            ) : null}

            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-indigo-600 font-semibold text-sm uppercase tracking-wide">
                {getCategoryLabel(report.category)}
              </Text>

              <View
                className="px-2 py-1 rounded-full"
                style={{
                  backgroundColor: STATUS_COLOR[report.status] || "#9CA3AF",
                }}
              >
                <Text className="text-white text-xs font-medium">
                  {STATUS_LABEL[report.status]}
                </Text>
              </View>
            </View>

            {report?.description ? (
              <Text className="text-gray-800 leading-6 mb-4">
                {report.description}
              </Text>
            ) : (
              <Text className="text-gray-400">Sem descrição.</Text>
            )}

            {report?.location?.address && (
              <View className="mt-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                <Text className="text-gray-900 font-semibold text-base mb-1">
                  {report.location.address.city} -{" "}
                  {report.location.address.region}
                </Text>
                <Text className="text-gray-700 text-sm">
                  {report.location.address.street} -{" "}
                  {report.location.address.district}
                </Text>
              </View>
            )}

            {report?.location?.coordinate && report?.location?.coordinate ? (
              <View className="mt-3">
                <Text className="text-xs text-gray-500">
                  Lat: {report.location.coordinate.latitude} • Lng:{" "}
                  {report.location.coordinate.longitude}
                </Text>
              </View>
            ) : null}
          </ModalBody>

          <ModalFooter className="px-4 pb-4 gap-2">
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
);

export { ReportDetail };
