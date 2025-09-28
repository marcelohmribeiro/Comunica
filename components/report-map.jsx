import React, { useMemo } from "react";
import { View } from "react-native";
import MapView, { Marker } from "react-native-maps";

const STATUS_COLOR = {
  aberta: "#EF4444",
  em_andamento: "#F59E0B",
  resolvida: "#10B981",
};
const FALLBACK_REGION = {
  latitude: -3.7319,
  longitude: -38.5267,
  latitudeDelta: 0.15,
  longitudeDelta: 0.15,
};

export default function ReportMap({ reports = [], height }) {
  const markers = useMemo(
    () =>
      reports.filter((r) => r?.location?.latitude && r?.location?.longitude),
    [reports]
  );

  const initialRegion = useMemo(() => {
    const first = markers[0];
    return first
      ? {
          latitude: first.location.latitude,
          longitude: first.location.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }
      : FALLBACK_REGION;
  }, [markers]);

  return (
    <View
      className="bg-white rounded-xl shadow overflow-hidden"
      style={height ? { height } : { flex: 1 }}
    >
      <MapView style={{ flex: 1 }} initialRegion={initialRegion}>
        {markers.map((r) => (
          <Marker
            key={r.id}
            coordinate={r.location}
            title={r.title}
            description={r.category || ""}
            pinColor={STATUS_COLOR[r.status] || "#3B82F6"}
          />
        ))}
      </MapView>
    </View>
  );
}
