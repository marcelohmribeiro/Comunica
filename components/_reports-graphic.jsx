import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { PolarChart, Pie } from "victory-native";
import { Info } from "lucide-react-native";
import { useReports } from "@/store";
import { ReportsDistrictDetail } from "./_reports-district-datail";

const generateUniqueColors = (count) => {
  const colors = [];
  const hueStep = 360 / count;
  for (let i = 0; i < count; i++) {
    const hue = Math.round(i * hueStep);
    colors.push(`hsl(${hue}, 70%, 60%)`);
  }
  return colors;
};

export const ReportGraphic = () => {
  const { items } = useReports();
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  // Agrupa denúncias por bairro
  const data = useMemo(() => {
    const map = new Map();
    items.forEach((r) => {
      const b = r?.location?.address?.district || "Sem bairro";
      map.set(b, (map.get(b) || 0) + 1);
    });

    const entries = Array.from(map.entries());
    const total = entries.reduce((s, [, v]) => s + v, 0);
    const sorted = entries
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);

    const colors = generateUniqueColors(sorted.length);
    return sorted.map((item, i) => ({
      ...item,
      color: colors[i],
      pct: ((item.value / total) * 100).toFixed(1),
    }));
  }, [items]);

  if (!data.length)
    return (
      <View className="h-64 items-center justify-center">
        <Text className="text-slate-500">Nenhum dado disponível</Text>
      </View>
    );

  return (
    <View className="mt-4">
      <Text className="text-xl font-semibold text-slate-800 mb-4">
        Denúncias por Bairro
      </Text>

      <View className="h-72 mb-6">
        <PolarChart
          data={data}
          labelKey="label"
          valueKey="value"
          colorKey="color"
        >
          <Pie.Chart innerRadius={60} padAngle={2} />
        </PolarChart>
      </View>

      <View className="flex-row bg-slate-100 rounded-t-lg px-4 py-3">
        <Text className="flex-1 font-semibold text-slate-700 text-base">
          Bairro
        </Text>
        <Text className="w-20 text-right font-semibold text-slate-700 text-base">
          % / Info
        </Text>
      </View>

      {data.map((item, i) => (
        <TouchableOpacity
          key={item.label}
          className={"flex-row items-center px-4 py-3 bg-white"}
          onPress={() => setSelectedDistrict(item)}
        >
          <View className="flex-row items-center flex-1">
            <View
              className="w-3.5 h-3.5 rounded mr-3"
              style={{ backgroundColor: item.color }}
            />
            <Text
              className="text-slate-800 text-base flex-shrink"
              numberOfLines={1}
            >
              {item.label}
            </Text>
          </View>

          <View className="flex-row items-center justify-end w-20 gap-2">
            <Text className="text-slate-700 text-base">{item.pct}%</Text>
            <TouchableOpacity
              onPress={() => setSelectedDistrict(item)}
              activeOpacity={0.7}
            >
              <Info size={18} color="#475569" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}

      <ReportsDistrictDetail
        open={!!selectedDistrict}
        onClose={() => setSelectedDistrict(null)}
        district={selectedDistrict}
        reports={items}
      />
    </View>
  );
};
