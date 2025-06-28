import { Camera, UserTrackingMode } from "@rnmapbox/maps";
import React, { forwardRef } from "react";

interface MapCameraProps {
  shouldFollowUser: boolean;
}

const MapCamera = forwardRef<Camera, MapCameraProps>(
  ({ shouldFollowUser }, ref) => (
    <Camera
      ref={ref}
      defaultSettings={{
        centerCoordinate: [-74.006, 40.7128],
        zoomLevel: 3,
      }}
      followUserLocation={shouldFollowUser}
      followUserMode={UserTrackingMode.FollowWithHeading}
      followZoomLevel={15}
      followPitch={0}
    />
  ),
);

MapCamera.displayName = "CameraControl";

export default MapCamera;
