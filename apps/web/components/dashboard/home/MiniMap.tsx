'use client';

import { useEffect, useMemo } from 'react';

import type { LatLngTuple } from 'leaflet';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet/dist/leaflet.css';
import { useTheme } from 'next-themes';
import { useMap } from 'react-leaflet';

import MapContainer from '@/components/dashboard/map/MapContainer';
import MarkerWithPopup from '@/components/dashboard/map/MarkerWithPopup';
import TileLayer from '@/components/dashboard/map/TileLayer';

import { useLiveLocationTracker } from '@/hooks/use-live-location-tracker';

import { useAuthContext } from '@/context/auth-provider';

const MapRecenter = ({ center }: { center: LatLngTuple }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true, duration: 0.5 });
  }, [center, map]);
  return null;
};

const MiniMap = () => {
  const { resolvedTheme } = useTheme();
  const { user } = useAuthContext();

  const { liveLocations } = useLiveLocationTracker(user?._id);

  const markersData = useMemo(() => {
    return Array.from(liveLocations.values())
      .filter((liveLocationUpdate) => {
        return (
          liveLocationUpdate.location?.coordinates?.latitude &&
          liveLocationUpdate.location?.coordinates?.longitude
        );
      })
      .map((liveLocationUpdate) => ({
        deviceId: liveLocationUpdate.deviceId,
        deviceName: liveLocationUpdate.deviceName,
        deviceIcon: liveLocationUpdate.deviceIcon,
        position: [
          liveLocationUpdate.location.coordinates.latitude,
          liveLocationUpdate.location.coordinates.longitude,
        ] as [number, number],
        timestamp: liveLocationUpdate.location.timestamp,
        batteryLevel: liveLocationUpdate.location.batteryLevel,
        networkType: liveLocationUpdate.location.networkType,
        speed: liveLocationUpdate.location.coordinates.speed,
        heading: liveLocationUpdate.location.coordinates.heading,
        accuracy: liveLocationUpdate.location.coordinates.accuracy,
        altitude: liveLocationUpdate.location.coordinates.altitude,
        isLiveTracking: liveLocationUpdate.isTracking,
        isOnline: liveLocationUpdate.isOnline,
        warning: liveLocationUpdate.location.warning,
      }));
  }, [liveLocations]);

  const mapCenter: LatLngTuple = useMemo(() => {
    if (markersData.length > 0) {
      const latSum = markersData.reduce((sum, marker) => sum + marker.position[0], 0);
      const lngSum = markersData.reduce((sum, marker) => sum + marker.position[1], 0);
      return [latSum / markersData.length, lngSum / markersData.length] as LatLngTuple;
    }

    return [38.41891195372863, 27.128696593593254] as LatLngTuple;
  }, [markersData]);

  const tileUrl = useMemo(() => {
    return resolvedTheme === 'dark'
      ? `https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/{z}/{x}/{y}?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
      : `https://api.mapbox.com/styles/v1/mapbox/light-v11/tiles/{z}/{x}/{y}?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`;
  }, [resolvedTheme]);

  return (
    <div className="flex-1 h-64">
      <MapContainer
        center={mapCenter}
        zoom={10}
        scrollWheelZoom={false}
        dragging={false}
        zoomControl={false}
        attributionControl={false}
        className="z-0 w-full h-full rounded-lg"
      >
        <TileLayer key={resolvedTheme} url={tileUrl} tileSize={512} zoomOffset={-1} />
        <MapRecenter center={mapCenter} />

        {markersData.map((markerData) => (
          <MarkerWithPopup
            key={markerData.deviceId}
            position={markerData.position}
            deviceName={markerData.deviceName}
            deviceIcon={markerData.deviceIcon}
            isOnline={markerData.isOnline}
            isTracking={markerData.isLiveTracking}
            batteryLevel={markerData.batteryLevel}
            networkType={markerData.networkType}
            timestamp={new Date(markerData.timestamp)}
            accuracy={markerData.accuracy}
            speed={markerData.speed}
            altitude={markerData.altitude}
            warning={markerData.warning}
            isSelected={false}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default MiniMap;
