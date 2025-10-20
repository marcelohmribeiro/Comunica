import React, { memo, useMemo } from "react";
import { View, Text } from "react-native";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  ButtonText,
} from "@/components/ui";
import { ReportStatus } from "./_reports-status";
import { getCategoryLabel } from "@/utils/_category";

export const ReportsDistrictDetail = memo(
  ({ open = false, onClose = () => {}, district = null, reports = [] }) => {
    if (!district) return null;

    const districtReports = useMemo(() => {
      const key = district.label?.toLowerCase?.() || "";
      return reports.filter(
        (r) => (r?.location?.address?.district || "").toLowerCase() === key
      );
    }, [reports, district]);

    const total = districtReports.length || 0;

    const categoryCount = useMemo(() => {
      const map = new Map();
      districtReports.forEach((r) => {
        const c = r?.category || "Outros";
        map.set(c, (map.get(c) || 0) + 1);
      });
      const arr = Array.from(map.entries()).map(([label, value]) => ({
        label,
        value,
      }));
      const sum = arr.reduce((s, i) => s + i.value, 0) || 1;
      return arr
        .map((i) => ({ ...i, pct: Math.round((i.value / sum) * 100) }))
        .sort((a, b) => b.value - a.value);
    }, [districtReports]);

    const topProblem = categoryCount[0];

    return (
      <Modal isOpen={open} onClose={onClose} size="lg" avoidKeyboard>
        <ModalBackdrop />
        <ModalContent className="rounded-2xl overflow-hidden">
          <ModalBody className="px-5 pb-4 pt-5">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <View
                  className="w-3.5 h-3.5 rounded mr-2.5"
                  style={{ backgroundColor: district.color }}
                />
                <Text
                  className="text-xl font-bold text-slate-800"
                  numberOfLines={1}
                >
                  {district.label}
                </Text>
              </View>

              {district.pct != null && (
                <View className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200">
                  <Text className="text-slate-700 text-xs font-semibold">
                    {district.pct}% do total
                  </Text>
                </View>
              )}
            </View>

            <View className="bg-white border border-slate-200 rounded-xl p-4 mb-5">
              <View className="flex-row justify-between items-center">
                <View className="flex-1 mr-3">
                  <Text className="text-slate-500 text-xs mb-1">
                    Total de denúncias
                  </Text>
                  <Text className="text-3xl font-extrabold text-slate-800">
                    {total}
                  </Text>
                </View>

                <View className="flex-1 ml-3">
                  <Text className="text-slate-500 text-xs mb-1">
                    Mais recorrente
                  </Text>
                  {topProblem ? (
                    <Text
                      className="text-base font-semibold text-slate-800"
                      numberOfLines={2}
                    >
                      {getCategoryLabel(topProblem.label)} ({topProblem.value})
                    </Text>
                  ) : (
                    <Text className="text-slate-400">—</Text>
                  )}
                </View>
              </View>
            </View>

            <View>
              <Text className="text-base font-semibold text-slate-800 mb-2">
                Problemas denunciados
              </Text>

              {categoryCount.length === 0 ? (
                <Text className="text-slate-400">Sem dados...</Text>
              ) : (
                categoryCount.map((item) => (
                  <ReportStatus
                    key={item.label}
                    status={item.label}
                    labelOverride={item.label}
                    colorOverride={district.color}
                    pctOverride={item.pct}
                    showPercent
                  />
                ))
              )}
            </View>
          </ModalBody>

          <ModalFooter className="px-5 pb-5">
            <Button
              variant="outline"
              action="secondary"
              onPress={onClose}
              className="flex-1"
            >
              <ButtonText>Fechar</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
);
