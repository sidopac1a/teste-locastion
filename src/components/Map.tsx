"use client";

import { useEffect, useState, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapMarker } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

// Fix default Leaflet icons
const fixLeafletIcons = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
};

// Custom marker icons
const getActiveIcon = () => {
  fixLeafletIcons();
  return new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const getInactiveIcon = () => {
  fixLeafletIcons();
  return new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

// Map updater component
function MapUpdater({ center, markers, zoom }: { center?: [number, number]; markers: MapMarker[]; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    } else if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(m => m.position));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [center, markers, map, zoom]);

  return null;
}

interface MapViewProps {
  markers: MapMarker[];
  center?: [number, number];
  zoom?: number;
  showAll?: boolean;
}

const DEFAULT_CENTER: [number, number] = [24.7136, 46.6753];

export default function MapView({ markers, center, zoom = 13, showAll = true }: MapViewProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const activeIcon = useMemo(() => getActiveIcon(), []);
  const inactiveIcon = useMemo(() => getInactiveIcon(), []);

  const defaultCenter: [number, number] = useMemo(() => {
    return center || (markers.length > 0 ? markers[0].position : DEFAULT_CENTER);
  }, [center, markers]);

  if (!isClient) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-sm text-gray-500">جاري تحميل الخريطة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-lg overflow-hidden">
      <MapContainer
        center={defaultCenter}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={center} markers={markers} zoom={zoom} />

        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            icon={marker.status === 'active' ? activeIcon : inactiveIcon}
          >
            <Popup>
              <div className="text-right" dir="rtl" style={{ minWidth: '200px' }}>
                <h3 className="font-bold text-base mb-1 text-gray-900">{marker.name}</h3>
                <p className="text-sm text-gray-600 mb-1">
                  الحالة: {' '}
                  <span className={marker.status === 'active' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                    {marker.status === 'active' ? 'نشط' : 'غير نشط'}
                  </span>
                </p>
                <p className="text-xs text-gray-500 mb-1">
                  آخر تحديث: {formatDistanceToNow(marker.lastUpdate, { addSuffix: true, locale: ar })}
                </p>
                <p className="text-xs text-gray-400 font-mono">
                  {marker.position[0].toFixed(6)}, {marker.position[1].toFixed(6)}
                </p>
              </div>
            </Popup>
            {marker.status === 'active' && (
              <Circle
                center={marker.position}
                radius={500}
                pathOptions={{ color: '#22c55e', fillColor: '#22c55e', fillOpacity: 0.1 }}
              />
            )}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
