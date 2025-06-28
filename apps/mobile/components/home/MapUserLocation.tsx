import { UserLocation } from "@rnmapbox/maps";
import React from "react";

import MapLocationPuck from "./MapLocationPuck";

interface MapUserLocationProps {
  onLocationUpdate: (coords: [number, number]) => void;
  visible?: boolean;
  animated?: boolean;
}

const MapUserLocation = ({
  onLocationUpdate,
  visible = true,
  animated = true,
}: MapUserLocationProps) => (
  <UserLocation
    visible={visible}
    animated={animated}
    onUpdate={(location) => {
      if (location?.coords) {
        const coords: [number, number] = [
          location.coords.longitude,
          location.coords.latitude,
        ];
        onLocationUpdate(coords);
      }
    }}
  >
    <MapLocationPuck />
  </UserLocation>
);

export default MapUserLocation;
