// app/home/reports.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from "react-native";
import { getUserReports } from "@/services/_reports";
import { ReportCard } from "@/components/_report-card";
import { ReportDetail } from "@/components/_report-detail";
import { Progress, ProgressFilledTrack } from "@/components/ui";
import { STATUS_LABEL, STATUS_COLOR, CATEGORIES } from "@/constants";

/* helpers simples */
const norm = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/\s+/g, "_");
const STATUS_PROGRESS = { aberta: 25, em_andamento: 70, resolvida: 100 };
const statusMeta = (s) => {
  const k = norm(s);
  return {
    key: k,
    label: STATUS_LABEL[k] ?? (s || "—"),
    color: STATUS_COLOR[k] ?? "#9CA3AF",
    pct: STATUS_PROGRESS[k] ?? 0,
  };
};
const catLabel = (v) =>
  CATEGORIES.find((c) => c.value === v)?.label ?? v ?? "—";

/* chip básico */
const Chip = ({ label, active, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className={`px-3 py-2 rounded-full border mr-2 mb-2 ${
      active ? "bg-[#1976D2] border-[#1976D2]" : "bg-gray-100 border-gray-200"
    }`}
  >
    <Text className={`text-xs ${active ? "text-white" : "text-gray-700"}`}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default function Reports() {
  /* dados */
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /* filtros */
  const [category, setCategory] = useState("todas");
  const [status, setStatus] = useState("todos");

  /* detalhe */
  const [openDetail, setOpenDetail] = useState(false);
  const [selected, setSelected] = useState(null);

  /* fetch único (guard p/ StrictMode) */
  const fetched = useRef(false);
  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    (async () => {
      try {
        const list = await getUserReports(); // backend já ordena
        setReports(Array.isArray(list) ? list : []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const list = await getUserReports();
      setReports(Array.isArray(list) ? list : []);
    } finally {
      setRefreshing(false);
    }
  };

  /* categorias (constantes + extras vindas do backend, simples) */
  const baseCats = CATEGORIES.map((c) => c.value);
  const extraCats = Array.from(
    new Set(
      reports
        .map((r) => r.category)
        .filter(Boolean)
        .filter((v) => !baseCats.includes(v))
    )
  );
  const categories = ["todas", ...baseCats, ...extraCats];

  /* aplica filtros (preserva ordem do backend) */
  const filtered = reports.filter((r) => {
    const okCat = category === "todas" || String(r.category) === category;
    const okSt = status === "todos" || norm(r.status) === status;
    return okCat && okSt;
  });

  /* resumo rápido */
  const sum = { aberta: 0, em_andamento: 0, resolvida: 0 };
  for (const r of reports) {
    const k = norm(r.status);
    if (sum[k] != null) sum[k] += 1;
  }

  /* header simples + resumo + filtros horizontais */
  const Header = (
    <View className="bg-white border-b border-gray-200">
      {/* título + contagem + limpar */}
      <View className="px-4 pt-4 pb-2 flex-row items-center justify-between">
        <View>
          <Text className="text-lg font-bold text-gray-800">
            Todos os reports
          </Text>
          <Text className="text-xs text-gray-500 mt-0.5">
            {filtered.length} resultados
          </Text>
        </View>
        {(category !== "todas" || status !== "todos") && (
          <TouchableOpacity
            onPress={() => {
              setCategory("todas");
              setStatus("todos");
            }}
            className="px-3 py-2 rounded-full bg-gray-100 border border-gray-200"
          >
            <Text className="text-xs text-gray-700">Limpar</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* cards de resumo (clicáveis) */}
      <View className="flex-row gap-3 mx-4">
        {["aberta", "em_andamento", "resolvida"].map((k) => {
          const active = status === k;
          return (
            <TouchableOpacity
              key={k}
              onPress={() => setStatus((prev) => (prev === k ? "todos" : k))}
              className={`flex-1 p-3 rounded-2xl border ${
                active
                  ? "bg-blue-50 border-blue-300"
                  : "bg-white border-gray-200"
              }`}
            >
              <Text className="text-[11px]" style={{ color: STATUS_COLOR[k] }}>
                {STATUS_LABEL[k]}
              </Text>
              <Text className="text-lg font-bold text-gray-800">
                {sum[k] ?? 0}
              </Text>
              <View className="mt-2">
                <Progress value={STATUS_PROGRESS[k]}>
                  <ProgressFilledTrack
                    style={{ backgroundColor: STATUS_COLOR[k] }}
                  />
                </Progress>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* filtros compactos (sempre visíveis, horizontais) */}
      <View className="px-4 mt-4">
        <Text className="text-[11px] font-semibold text-gray-600 mb-2">
          Categorias
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-2"
        >
          <View className="flex-row">
            {categories.map((c) => (
              <Chip
                key={`cat-${c}`}
                label={c === "todas" ? "Todas" : catLabel(c)}
                active={category === c}
                onPress={() => setCategory(c)}
              />
            ))}
          </View>
        </ScrollView>
      </View>
      <View className="h-px bg-gray-100 mt-2" />
    </View>
  );

  /* item: card + status juntos */
  const renderItem = ({ item }) => {
    const meta = statusMeta(item.status);
    return (
      <View className="mx-4 mt-4 rounded-2xl bg-white border border-gray-200">
        {/* card */}
        <View className="p-3">
          <ReportCard
            report={item}
            onPress={() => {
              setSelected(item);
              setOpenDetail(true);
            }}
          />
        </View>

        {/* divisor */}
        <View className="h-px bg-gray-100" />

        {/* status + progress */}
        <View className="p-3">
          <View className="flex-row justify-between items-center mb-2">
            <View className="flex-row items-center">
              <View
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: meta.color }}
              />
              <Text className="text-xs text-gray-700">
                Status:{" "}
                <Text className="font-semibold" style={{ color: meta.color }}>
                  {meta.label}
                </Text>
              </Text>
            </View>
            {!!item.category && (
              <View className="bg-indigo-50 px-2 py-1 rounded-full">
                <Text className="text-[10px] text-indigo-800">
                  {catLabel(item.category)}
                </Text>
              </View>
            )}
          </View>

          <Progress value={meta.pct}>
            <ProgressFilledTrack style={{ backgroundColor: meta.color }} />
          </Progress>
          <View className="flex-row justify-between mt-1">
            <Text className="text-[10px] text-gray-500">0%</Text>
            <Text className="text-[10px] text-gray-500">{meta.pct}%</Text>
          </View>
        </View>
      </View>
    );
  };

  /* render */
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="small" color="#1976D2" />
        <Text className="text-xs text-gray-500 mt-2">Carregando…</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={filtered}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        ListHeaderComponent={Header}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-8">
            <Text className="text-sm text-gray-500">
              Nenhum report encontrado
            </Text>
          </View>
        }
      />

      {openDetail && (
        <ReportDetail
          open={openDetail}
          onClose={() => setOpenDetail(false)}
          report={selected}
        />
      )}
    </View>
  );
}
