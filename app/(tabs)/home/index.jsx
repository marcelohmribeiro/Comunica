import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import ReportCard from "@/components/report-card";
import ReportMap from "@/components/report-map";
import ReportDetail from "@/components/report-detail";
import { getUserReports } from "@/services/_reports";
const { width } = Dimensions.get("window");

export default function Home() {
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);

  useEffect(() => {
    (async () => {
      const list = await getUserReports();
      setReports(list);
      setLoading(false);
    })();
  }, []);

  const recent = useMemo(() => reports.slice(0, 5), [reports]);

  const handleOpen = (r) => {
    setSelected(r);
    setOpenDetail(true);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#1976D2] pt-12 pb-6 px-4">
        <Text className="text-2xl font-bold text-white">Comunica</Text>
        <Text className="text-white/90 mt-1">
          Ajude a melhorar sua comunidade
        </Text>
      </View>

      <View className="mt-4 px-4">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-lg font-bold text-gray-800">
            Denúncias Recentes
          </Text>
          <TouchableOpacity onPress={() => router.push("ReportsList")}>
            <Text className="text-[#1976D2] text-sm">Ver todas</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View className="h-48 items-center justify-center">
            <ActivityIndicator size="small" color="#1976D2" />
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="max-h-48"
          >
            <View className="flex-row gap-4 pr-4">
              {recent.map((r) => (
                <ReportCard
                  key={r.id}
                  report={r}
                  width={width * 0.8}
                  onPress={() => handleOpen(r)}
                />
              ))}
            </View>
          </ScrollView>
        )}
      </View>
      {openDetail && (
        <ReportDetail
          open={openDetail}
          onClose={() => setOpenDetail(false)}
          report={selected}
          onSeeMap={(rep) => {
            setOpenDetail(false);
            // opcional: centrar mapa no ponto da denúncia
            // mapRef?.animateToRegion({ ...rep.location, latitudeDelta: 0.01, longitudeDelta: 0.01 });
          }}
        />
      )}
      <View className="flex-1 mt-4 px-4">
        <ReportMap reports={reports} />
      </View>
    </View>
  );
}
