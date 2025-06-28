import Mapbox, { Camera, MapView } from "@rnmapbox/maps";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

import { useColorScheme } from "~/hooks/use-color-scheme";
import { useDevice } from "~/hooks/use-device";
import { useLocationPermission } from "~/hooks/use-location-permission";

import MapCamera from "./MapCamera";
import MapControls from "./MapControls";
import MapLoading from "./MapLoading";
import MapLocatrLogo from "./MapLocatrLogo";
import MapUserLocation from "./MapUserLocation";

if (process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN) {
  Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN);
}

const DEFAULT_COORDINATES: [number, number] = [
  38.41891195372863, 27.128696593593254,
];

const Map = () => {
  const { isDarkColorScheme } = useColorScheme();
  const { hasLocationPermission, isPermissionLoading } =
    useLocationPermission();
  const { data: device } = useDevice();

  const [isMapComponentLoaded, setIsMapComponentLoaded] = useState(false);
  const [userCoordinates, setUserCoordinates] = useState<
    [number, number] | null
  >(null);
  const [isInitialAnimationComplete, setIsInitialAnimationComplete] =
    useState(false);
  const [shouldFollowUser, setShouldFollowUser] = useState(false);

  const cameraRef = useRef<Camera>(null);

  const styleUrl = useMemo(
    () =>
      isDarkColorScheme
        ? "mapbox://styles/mapbox/dark-v11"
        : "mapbox://styles/mapbox/light-v11",
    [isDarkColorScheme],
  );

  const validCoordinates: [number, number] =
    Array.isArray(device?.lastLocation?.coordinates) &&
    device.lastLocation.coordinates.length === 2
      ? device.lastLocation.coordinates
      : DEFAULT_COORDINATES;

  useEffect(() => {
    if (
      !isMapComponentLoaded ||
      !userCoordinates ||
      isInitialAnimationComplete ||
      !cameraRef.current
    )
      return;

    cameraRef.current.setCamera({
      centerCoordinate: validCoordinates,
      zoomLevel: 3,
      animationDuration: 0,
    });

    const flyTimeout = setTimeout(() => {
      if (userCoordinates && cameraRef.current) {
        cameraRef.current.setCamera({
          centerCoordinate: userCoordinates,
          zoomLevel: 6,
          animationMode: "flyTo",
          animationDuration: 3000,
        });

        const zoomTimeout = setTimeout(() => {
          if (cameraRef.current) {
            cameraRef.current.setCamera({
              zoomLevel: 15,
              animationMode: "flyTo",
              animationDuration: 1500,
            });

            const followTimeout = setTimeout(() => {
              setIsInitialAnimationComplete(true);
              setShouldFollowUser(true);
            }, 1500);

            return () => clearTimeout(followTimeout);
          }
        }, 3000);

        return () => clearTimeout(zoomTimeout);
      }
    }, 500);

    return () => clearTimeout(flyTimeout);
  }, [
    validCoordinates,
    isMapComponentLoaded,
    userCoordinates,
    isInitialAnimationComplete,
  ]);

  const handleRecenterMap = () => {
    if (userCoordinates && cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: userCoordinates,
        zoomLevel: 15,
        animationMode: "flyTo",
        animationDuration: 1000,
      });
      const followTimeout = setTimeout(() => setShouldFollowUser(true), 1000);
      return () => clearTimeout(followTimeout);
    }
  };

  const handleCompassPress = () => {
    if (cameraRef.current) {
      cameraRef.current.setCamera({
        heading: 0,
        animationMode: "flyTo",
        animationDuration: 800,
      });
    }
  };

  const handleCameraChanged = () => {
    if (shouldFollowUser) {
      setShouldFollowUser(false);
    }
  };

  if (isPermissionLoading || !hasLocationPermission) {
    return <MapLoading />;
  }

  return (
    <View className="flex-1 items-center justify-center">
      <MapView
        style={styles.mapView}
        styleURL={styleUrl}
        onDidFinishLoadingMap={() => setIsMapComponentLoaded(true)}
        onCameraChanged={handleCameraChanged}
        logoEnabled={false}
        attributionEnabled={false}
        compassEnabled={false}
        scaleBarEnabled={false}
      >
        <MapCamera ref={cameraRef} shouldFollowUser={shouldFollowUser} />
        <MapUserLocation onLocationUpdate={setUserCoordinates} />
      </MapView>

      {!isMapComponentLoaded && (
        <View className="absolute inset-0 justify-center items-center">
          <MapLoading />
        </View>
      )}

      {isInitialAnimationComplete && (
        <>
          <MapLocatrLogo />
          <MapControls
            onRecenter={handleRecenterMap}
            onCompass={handleCompassPress}
          />
        </>
      )}
    </View>
  );
};

export default Map;

const styles = StyleSheet.create({
  mapView: { flex: 1, width: "100%", height: "100%" },
});
