'use client';

import { useEffect, useMemo, useState } from 'react';

import type { LatLngTuple } from 'leaflet';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet/dist/leaflet.css';
import { useTheme } from 'next-themes';
import { useMap } from 'react-leaflet';

import DeviceList from '@/components/dashboard/map/DeviceList';
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

const MapPage = () => {
  const { resolvedTheme } = useTheme();
  const { user } = useAuthContext();
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  const { liveLocations, isConnected, error } = useLiveLocationTracker(user?._id);

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
    if (selectedDeviceId) {
      const selectedMarker = markersData.find((m) => m.deviceId === selectedDeviceId);
      if (selectedMarker) {
        return selectedMarker.position as LatLngTuple;
      }
    }

    if (markersData.length > 0) {
      return markersData[0].position as LatLngTuple;
    }

    return [38.41891195372863, 27.128696593593254] as LatLngTuple;
  }, [selectedDeviceId, markersData]);

  useEffect(() => {
    if (markersData.length > 0 && selectedDeviceId === null) {
      setSelectedDeviceId(markersData[0].deviceId);
    }
  }, [markersData, selectedDeviceId]);

  const tileUrl = useMemo(() => {
    return resolvedTheme === 'dark'
      ? `https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/{z}/{x}/{y}?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
      : `https://api.mapbox.com/styles/v1/mapbox/light-v11/tiles/{z}/{x}/{y}?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`;
  }, [resolvedTheme]);

  return (
    <div className="flex flex-col lg:flex-row h-full w-full p-4 pt-0 gap-4">
      <div className="flex-1 lg:w-3/4 h-64 lg:h-full">
        <MapContainer
          center={mapCenter}
          zoom={13}
          scrollWheelZoom={true}
          className="z-0 h-full w-full rounded-lg"
          attributionControl={false}
          zoomControl={false}
        >
          <TileLayer key={resolvedTheme} url={tileUrl} tileSize={512} zoomOffset={-1} />
          <MapRecenter center={mapCenter} />

          {/* Custom markers */}
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
              isSelected={selectedDeviceId === markerData.deviceId}
            />
          ))}

          {!isConnected && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-white p-2 rounded-md shadow-lg z-50">
              <p>Connecting...</p>
            </div>
          )}
          {error && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white p-2 rounded-md shadow-lg z-50">
              <p>Error: {error}</p>
            </div>
          )}
          {isConnected && !error && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white p-2 rounded-md shadow-lg z-50">
              <p>Devices loading...</p>
            </div>
          )}
          {isConnected && markersData.length === 0 && !error && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-500 text-white p-2 rounded-md shadow-lg z-50">
              <p>No device location found</p>
            </div>
          )}
        </MapContainer>
      </div>

      <div className="w-full lg:w-1/4 h-96 lg:h-full">
        <DeviceList
          liveLocations={liveLocations}
          onSelectDevice={setSelectedDeviceId}
          selectedDeviceId={selectedDeviceId}
        />
      </div>
    </div>
  );
};

export default MapPage;
