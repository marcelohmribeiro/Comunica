import { memo } from "react";
import { View, Text } from "react-native";
import { Progress, ProgressFilledTrack } from "@/components/ui";
import { STATUS_LABEL, STATUS_COLOR, STATUS_PROGRESS } from "@/constants";

const ReportStatus = memo(({ status, showPercent = true }) => {
  const label = STATUS_LABEL[status];
  const color = STATUS_COLOR[status];
  const pct = STATUS_PROGRESS[status];

  return (
    <View className="p-3">
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-row items-center">
          <View
            className="w-2 h-2 rounded-full mr-2"
            style={{ backgroundColor: color }}
          />
          <Text className="text-xs text-gray-700">
            Status:{" "}
            <Text className="font-semibold" style={{ color }}>
              {label}
            </Text>
          </Text>
        </View>
      </View>

      <Progress value={pct} size="sm" className="rounded-full bg-gray-200 h-2">
        <ProgressFilledTrack
          style={{ backgroundColor: color }}
          className="rounded-full"
        />
      </Progress>

      {showPercent && (
        <View className="flex-row justify-between mt-1">
          <Text className="text-[10px] text-gray-500">0%</Text>
          <Text className="text-[10px] text-gray-500">{pct}%</Text>
        </View>
      )}
    </View>
  );
});

export { ReportStatus };
