import { LocationPuck } from "@rnmapbox/maps";
import React from "react";

const MapLocationPuck = () => {
  return (
    <LocationPuck
      puckBearingEnabled={true}
      puckBearing="heading"
      visible={true}
    />
  );
};

export default MapLocationPuck;
