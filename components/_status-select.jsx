import { memo } from "react";
import { View, Text } from "react-native";
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectItem,
} from "@/components/ui";
import { STATUS_LABEL } from "@/constants";

const STATUS_OPTIONS = [
  { value: "aberta", label: STATUS_LABEL.aberta },
  { value: "em_andamento", label: STATUS_LABEL.em_andamento },
  { value: "resolvida", label: STATUS_LABEL.resolvida },
];

export const StatusSelect = memo(({ value, onChange, label = "Status" }) => {
  return (
    <View className="mb-6">
      <Text className="text-lg font-bold text-gray-800 mb-3">{label}</Text>
      <Select selectedValue={value} onValueChange={onChange}>
        <SelectTrigger className="bg-white border border-gray-300 rounded-xl px-3 py-3">
          <SelectInput placeholder="Selecione o status..." />
          <SelectIcon className="ml-2" />
        </SelectTrigger>

        <SelectPortal>
          <SelectBackdrop />
          <SelectContent>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s.value} label={s.label} value={s.value} />
            ))}
          </SelectContent>
        </SelectPortal>
      </Select>
    </View>
  );
});
