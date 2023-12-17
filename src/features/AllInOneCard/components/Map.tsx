import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { LatLng, Marker } from "react-native-maps";

import { LocationState } from "../types";

interface MapProps {
  onMarkerSelection: (latlng: LatLng) => void;
  locationState: LocationState;
}

export default function Map({ locationState, onMarkerSelection }: MapProps) {
  const initialRegion = {
    latitude: 24.662963,
    longitude: 46.6864334,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const [markerLocation, setMarkerLocation] = useState({
    latitude: 24.662963,
    longitude: 46.6864334,
  });

  const [markerRegion, setMarkerRegion] = useState(locationState.location);

  useEffect(() => {
    if (locationState.shouldUpdateMarker) {
      setMarkerLocation({ latitude: locationState.location.latitude, longitude: locationState.location.longitude });
      setMarkerRegion(locationState.location);
    }
  }, [locationState]);

  return (
    <>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          region={markerRegion}
          onPoiClick={e => {
            setMarkerLocation(e.nativeEvent.coordinate);
            onMarkerSelection(e.nativeEvent.coordinate);
          }}
          onPress={e => {
            setMarkerLocation(e.nativeEvent.coordinate);
            onMarkerSelection(e.nativeEvent.coordinate);
          }}>
          <Marker
            draggable
            onDragEnd={e => onMarkerSelection(e.nativeEvent.coordinate)}
            coordinate={markerLocation}
            title={locationState.location?.name ?? ""}
          />
        </MapView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    padding: 116,
  },
});
