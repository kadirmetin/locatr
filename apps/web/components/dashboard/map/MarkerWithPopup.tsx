'use client';

import { useMemo } from 'react';

import L from 'leaflet';
import { renderToString } from 'react-dom/server';
import { Marker, Popup } from 'react-leaflet';

import { getDeviceIcon } from '@/lib/utils/getDeviceIcon';

interface CustomMarkerProps {
  position: [number, number];
  deviceName?: string;
  deviceIcon?: string;
  isOnline?: boolean;
  isTracking?: boolean;
  batteryLevel?: number | null;
  networkType?: string;
  timestamp: Date;
  accuracy?: number | null;
  speed?: number | null;
  altitude?: number | null;
  warning?: string;
  isSelected?: boolean;
}

const MarkerWithPopup = ({
  position,
  deviceName,
  deviceIcon,
  isOnline,
  isTracking,
  batteryLevel,
  networkType,
  timestamp,
  accuracy,
  speed,
  altitude,
  warning,
  isSelected = false,
}: CustomMarkerProps) => {
  const customIcon = useMemo(() => {
    const iconComponent = getDeviceIcon(deviceIcon);

    const statusColor = isOnline
      ? isTracking
        ? '#10b981' // green-500
        : '#3b82f6' // blue-500
      : '#6b7280'; // gray-500

    const ringColor = isSelected ? '#8b5cf6' : statusColor;

    const markerHtml = `
      <div style="
        position: relative;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <!-- Outer ring (selection indicator) -->
        <div style="
          position: absolute;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: ${ringColor};
          opacity: ${isSelected ? '0.3' : '0.2'};
          animation: ${isTracking ? 'pulse 2s infinite' : 'none'};
        "></div>
        
        <!-- Main marker circle -->
        <div style="
          position: relative;
          width: 36px;
          height: 36px;
          background: white;
          border: 3px solid ${statusColor};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 1;
        ">
          <!-- Device icon -->
          <div style="color: ${statusColor};">
            ${renderToString(iconComponent)}
          </div>
        </div>

        <!-- Status indicator dot -->
        <div style="
          position: absolute;
          top: 2px;
          right: 2px;
          width: 12px;
          height: 12px;
          background: ${statusColor};
          border: 2px solid white;
          border-radius: 50%;
          z-index: 2;
          animation: ${isTracking ? 'pulse 1.5s infinite' : 'none'};
        "></div>

        <!-- Battery indicator (if available) -->
        ${
          batteryLevel !== null && batteryLevel !== undefined
            ? `
          <div style="
            position: absolute;
            bottom: -2px;
            left: 50%;
            transform: translateX(-50%);
            width: 16px;
            height: 6px;
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid #e5e7eb;
            border-radius: 2px;
            z-index: 2;
          ">
            <div style="
              width: ${Math.max(batteryLevel, 10)}%;
              height: 100%;
              background: ${batteryLevel > 50 ? '#10b981' : batteryLevel > 20 ? '#f59e0b' : '#ef4444'};
              border-radius: 1px;
            "></div>
          </div>
        `
            : ''
        }
      </div>
    `;

    return L.divIcon({
      html: markerHtml,
      className: 'custom-marker',
      iconSize: [48, 48],
      iconAnchor: [24, 24],
      popupAnchor: [0, -24],
    });
  }, [deviceIcon, isOnline, isTracking, batteryLevel, isSelected]);

  const popupContent = (
    <div className="p-3 min-w-[250px]">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
          {getDeviceIcon(deviceIcon)}
        </div>
        <div>
          <h3 className="font-semibold text-sm">{deviceName || 'Unknown Device'}</h3>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isOnline ? (isTracking ? 'bg-green-500' : 'bg-blue-500') : 'bg-gray-400'
              }`}
            />
            <span className="text-xs text-gray-600">
              {isOnline ? (isTracking ? 'Live Tracking' : 'Online') : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-600">Last Update:</span>
          <span className="font-medium">{timestamp.toLocaleString()}</span>
        </div>

        {batteryLevel !== null && batteryLevel !== undefined && (
          <div className="flex justify-between">
            <span className="text-gray-600">Battery:</span>
            <span className="font-medium">{batteryLevel}%</span>
          </div>
        )}

        {networkType && (
          <div className="flex justify-between">
            <span className="text-gray-600">Network:</span>
            <span className="font-medium">{networkType}</span>
          </div>
        )}

        {accuracy && (
          <div className="flex justify-between">
            <span className="text-gray-600">Accuracy:</span>
            <span className="font-medium">±{Math.round(accuracy)}m</span>
          </div>
        )}

        {speed !== null && speed !== undefined && speed > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Speed:</span>
            <span className="font-medium">{(speed * 3.6).toFixed(1)} km/h</span>
          </div>
        )}

        {altitude !== null && altitude !== undefined && (
          <div className="flex justify-between">
            <span className="text-gray-600">Altitude:</span>
            <span className="font-medium">{Math.round(altitude)}m</span>
          </div>
        )}

        {warning && (
          <div className="flex items-start gap-2 p-2 bg-yellow-50 rounded border-l-2 border-yellow-400">
            <span className="text-yellow-600">⚠️</span>
            <span className="text-yellow-700 text-xs">{warning}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Marker position={position} icon={customIcon}>
      <Popup className="custom-popup" maxWidth={300}>
        {popupContent}
      </Popup>
    </Marker>
  );
};

export default MarkerWithPopup;
