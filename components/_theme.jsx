import React, { useState } from "react";
import { View, Text } from "react-native";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Select,
  SelectTrigger,
  SelectInput,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectItem,
} from "@/components/ui";
import { Palette } from "lucide-react-native";

export const ThemeSelect = () => {
  const [theme, setTheme] = useState("system");

  return (
    <View className="rounded-2xl bg-white p-6 shadow-sm">
      <View className="flex-row items-center mb-2">
        <Palette size={18} color="#1976D2" />
        <Text className="ml-2 text-lg font-semibold text-gray-900">
          Preferências
        </Text>
      </View>
      <Text className="text-gray-500 mb-4">
        Ajuste a aparência do aplicativo
      </Text>

      <FormControl className="mb-3">
        <FormControlLabel>
          <FormControlLabelText>Tema</FormControlLabelText>
        </FormControlLabel>
        <Select selectedValue={theme} onValueChange={setTheme}>
          <SelectTrigger className="w-full">
            <SelectInput placeholder="Selecione um tema" />
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              <SelectItem label="Sistema" value="system" />
              <SelectItem label="Claro" value="light" />
              <SelectItem label="Escuro" value="dark" />
            </SelectContent>
          </SelectPortal>
        </Select>
      </FormControl>

      <Text className="text-gray-500 text-xs">
        * Persistir tema é opcional — conecte com seu store/context quando
        quiser.
      </Text>
    </View>
  );
};
