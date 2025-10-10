import { Text, View } from "react-native";
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
} from "@/components/ui";

const CategorySelect = ({ value, onChange, label = "Categoria" }) => {
  return (
    <View className="mb-6">
      <Text className="text-lg font-bold text-gray-800 mb-3">{label}</Text>
      <Select selectedValue={value} onValueChange={onChange}>
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
  );
};

export { CategorySelect };
