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
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const [markerLocation, setMarkerLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
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
