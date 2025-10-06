import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { ReportCard } from "@/components/_report-card";
import { ReportMap } from "@/components/_report-map";
import { ReportDetail } from "@/components/_report-detail";
import { getUserReports } from "@/services/_reports";
const { width } = Dimensions.get("window");

const Home = () => {
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [coordinate, setCoordinate] = useState({});

  useEffect(() => {
    (async () => {
      const list = await getUserReports();
      setReports(list);
      setLoading(false);
    })();
  }, []);

  const recent = useMemo(() => reports.slice(0, 5), [reports]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const list = await getUserReports();
      setReports(list);
    } catch (e) {
      console.error("refresh home:", e);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleOpen = (rep) => {
    setSelected(rep);
    setOpenDetail(true);
  };

  const handleSeeMap = (r) => {
    if (!r?.location) return;
    setCoordinate({
      latitude: r.location.latitude,
      longitude: r.location.longitude,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    });
    setOpenDetail(false);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        <View className="mt-4 px-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold text-gray-800">
              Denúncias Recentes
            </Text>
            <TouchableOpacity onPress={() => router.push("home/reports")}>
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
        <View className="flex-1 mt-4 px-4" style={{ height: 320 }}>
          <ReportMap reports={reports} focusCoord={coordinate} />
        </View>
      </ScrollView>
      {openDetail && (
        <ReportDetail
          open={openDetail}
          onClose={() => setOpenDetail(false)}
          report={selected}
          onSeeMap={(r) => {
            handleSeeMap(r);
          }}
        />
      )}
    </View>
  );
};

export default Home;
