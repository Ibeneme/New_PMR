import React, {ReactNode} from 'react';
import {Animated, View, StyleSheet, ViewStyle, Platform} from 'react-native';
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
  Region,
} from 'react-native-maps';

// Defining the types for the props
interface MapComponentProps {
  currentRegion: Region; // Type for the map region
  showsUserLocation: boolean; // Whether to show the user's location
  loadingEnabled: boolean; // Whether loading is enabled for the map
  address: string; // The address for the marker's description
  blinkAnim: Animated.Value; // Animated value controlling opacity for blinking effect
  children?: ReactNode; // Optional children that can be passed to the component
}

const MapComponent: React.FC<MapComponentProps> = ({
  currentRegion,
  showsUserLocation,
  loadingEnabled,
  address,
  blinkAnim,
  children, // Destructuring children prop
}) => {
  return (
    <>
      <MapView
        style={styles.map}
        region={currentRegion}
        showsUserLocation={showsUserLocation}
        loadingEnabled={loadingEnabled}
        provider={
          Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
        }>
        <Marker coordinate={currentRegion} title="You" description={address}>
          {children} {/* Rendering the passed children here */}
        </Marker>
      </MapView>
    </>
  );
};

// Styles
const styles = StyleSheet.create({
  map: {
    flex: 1, // Ensure the map takes up the full space available
  },
  blinkingMarker: {
    width: 20,
    height: 20,
    borderRadius: 10, // Circular shape
    backgroundColor: 'red', // Marker color (can be customized)
  },
});

export default MapComponent;
