import React from "react";
import { StyleSheet, View } from "react-native";
import MapView, { LatLng, Marker } from "react-native-maps";

import { Location } from "../types";

interface MapProps {
  onMarkerSelection: (latlng: LatLng) => void;
  location: Location | undefined;
}

export default function Map({ location, onMarkerSelection }: MapProps) {
  const initialRegion = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };
  return (
    <>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          region={location}
          onPress={e => onMarkerSelection(e.nativeEvent.coordinate)}>
          {location !== undefined ? (
            <Marker
              draggable
              onDragEnd={e => onMarkerSelection(e.nativeEvent.coordinate)}
              coordinate={{
                latitude: location?.latitude,
                longitude: location?.longitude,
              }}
              title={location.name}
            />
          ) : (
            <></>
          )}
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
