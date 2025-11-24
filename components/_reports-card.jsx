import { memo } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { MapPin } from "lucide-react-native";
import { STATUS_COLOR, STATUS_LABEL } from "@/constants";
import { getCategoryLabel } from "@/utils";

export const ReportCard = memo(
  ({ report = {}, width = 320, onPress, status = false }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        className="bg-white rounded-xl shadow overflow-hidden"
        style={{ width }}
      >
        {report?.imageUrl ? (
          <Image
            source={{ uri: report.imageUrl }}
            className="w-full h-32"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-32 bg-gray-200 items-center justify-center">
            <MapPin size={20} color="#666" />
          </View>
        )}

        <View className="p-3">
          <View className="flex-row justify-between items-start">
            <Text
              className="text-base font-bold text-gray-800"
              numberOfLines={1}
            >
              {getCategoryLabel(report.category)}
            </Text>
            {status && (
              <View
                className="px-2 py-1 rounded-full"
                style={{
                  backgroundColor: STATUS_COLOR[report?.status] || "#9CA3AF",
                }}
              >
                <Text className="text-xs text-white font-medium">
                  {STATUS_LABEL[report?.status] || "—"}
                </Text>
              </View>
            )}
          </View>

          <Text className="text-sm text-gray-600 mt-1" numberOfLines={1}>
            {report?.description || ""}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
);
