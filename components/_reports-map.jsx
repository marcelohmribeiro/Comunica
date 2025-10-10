import React, { memo, useEffect, useRef, useState } from "react";
import { View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { getCategoryLabel } from "@/utils/_category";
import { STATUS_COLOR, DEFAULT_REGION } from "@/constants";

const ReportMap = memo(({ reports = [], focusCoord }) => {
  const mapRef = useRef(null);
  const [markers, setMarkers] = useState(reports);

  useEffect(() => {
    setMarkers(reports);
  }, [reports]);

  useEffect(() => {
    if (focusCoord?.latitude && focusCoord?.longitude && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: focusCoord.latitude,
          longitude: focusCoord.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500
      );
    }
  }, [focusCoord]);

  return (
    <View className="flex-1 bg-white rounded-xl shadow overflow-hidden">
      <MapView ref={mapRef} style={{ flex: 1 }} initialRegion={DEFAULT_REGION}>
        {markers.map((r) => (
          <Marker
            key={r.id}
            coordinate={{
              latitude: r.location.coordinate.latitude,
              longitude: r.location.coordinate.longitude,
            }}
            title={getCategoryLabel(r.category)}
            pinColor={STATUS_COLOR[r.status]}
          />
        ))}
      </MapView>
    </View>
  );
});

export { ReportMap };
