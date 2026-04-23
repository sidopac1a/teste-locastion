"use client";

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useRealtimeUsers, useRealtimeLocations } from '@/hooks/useRealtimeData';
import { MapMarker } from '@/types';
import Navbar from '@/components/Navbar';
import { MapPin, Users, Navigation } from 'lucide-react';

const MapView = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-3"></div>
        <p className="text-sm text-gray-500">جاري تحميل الخريطة...</p>
      </div>
    </div>
  )
});
export default function MapPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { users } = useRealtimeUsers();
  const { locations } = useRealtimeLocations();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
    if (!authLoading && user && user.role !== 'admin') {
      router.push('/employee');
    }
  }, [user, authLoading, router]);

  const employees = users.filter(u => u.role === 'employee');

  const mapMarkers: MapMarker[] = locations
    .filter(loc => {
      const emp = employees.find(e => e.uid === loc.userId);
      return emp && emp.isActive;
    })
    .map(loc => {
      const emp = employees.find(e => e.uid === loc.userId);
      return {
        id: loc.userId,
        position: [loc.latitude, loc.longitude] as [number, number],
        name: emp?.displayName || 'Unknown',
        status: emp?.isActive ? 'active' : 'inactive',
        lastUpdate: loc.timestamp,
      };
    });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      <main className="h-[calc(100vh-64px)]">
        <div className="h-full relative">
          <MapView markers={mapMarkers} showAll={true} />

          {/* Overlay Stats */}
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-gray-100 z-[400]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">الموظفون على الخريطة</p>
                <p className="text-2xl font-bold text-blue-600">{mapMarkers.length}</p>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-gray-100 z-[400]">
            <h4 className="text-sm font-bold text-gray-900 mb-3">مفتاح الخريطة</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png" 
                     alt="active" className="w-4 h-6 object-contain" />
                <span className="text-xs text-gray-600">موظف نشط</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png" 
                     alt="inactive" className="w-4 h-6 object-contain" />
                <span className="text-xs text-gray-600">موظف غير نشط</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-green-500 bg-green-100"></div>
                <span className="text-xs text-gray-600">نطاق التغطية</span>
              </div>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-3 border border-gray-100 z-[400] max-w-xs">
            <div className="flex items-start gap-2">
              <Navigation className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-600 leading-relaxed">
                يتم تحديث المواقع تلقائياً كل 10 دقائق. البيانات للاستخدام التشغيلي فقط.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
