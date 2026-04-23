"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useLocationTracker } from '@/hooks/useLocationTracker';
import Navbar from '@/components/Navbar';
import { MapPin, Navigation, AlertCircle, Info } from 'lucide-react';

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
export default function EmployeeMapPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [locationSharing, setLocationSharing] = useState(true);

  const { currentLocation, error } = useLocationTracker({
    userId: user?.uid || '',
    enabled: locationSharing && !!user,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
    if (!authLoading && user && user.role === 'admin') {
      router.push('/dashboard');
    }
    if (user) {
      setLocationSharing(user.locationSharingEnabled);
    }
  }, [user, authLoading, router]);

  const markers = currentLocation ? [{
    id: user?.uid || 'me',
    position: [currentLocation.latitude, currentLocation.longitude] as [number, number],
    name: user?.displayName || 'أنا',
    status: 'active' as const,
    lastUpdate: currentLocation.timestamp,
  }] : [];

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || user.role === 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      <main className="h-[calc(100vh-64px)]">
        <div className="h-full relative">
          <MapView markers={markers} center={markers[0]?.position} zoom={16} />

          {/* Location Info Overlay */}
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-gray-100 z-[400] max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <Navigation className="h-5 w-5 text-blue-600" />
              <h3 className="font-bold text-gray-900">موقعك الحالي</h3>
            </div>

            {currentLocation ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">خط العرض:</span>
                  <span className="font-mono text-gray-900 text-xs">{currentLocation.latitude.toFixed(6)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">خط الطول:</span>
                  <span className="font-mono text-gray-900 text-xs">{currentLocation.longitude.toFixed(6)}</span>
                </div>
                {currentLocation.accuracy && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">الدقة:</span>
                    <span className="text-gray-900 text-xs">±{Math.round(currentLocation.accuracy)} متر</span>
                  </div>
                )}
                <div className="flex items-center gap-2 mt-3 p-2 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-700 font-medium">الموقع يتم مشاركته</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <AlertCircle className="h-4 w-4" />
                <span>جاري تحديد الموقع...</span>
              </div>
            )}

            {error && (
              <div className="mt-3 p-2 bg-red-50 rounded-lg border border-red-100">
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}
          </div>

          {/* Privacy Notice */}
          <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-gray-100 z-[400]">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-600 leading-relaxed">
                يتم تتبع الموقع أثناء ساعات العمل فقط بهدف تنظيم العمليات وتحسين خدمة العملاء 
                وضمان وصول الموظفين في الوقت المناسب. جميع البيانات تُستخدم لأغراض تشغيلية داخل الشركة فقط.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
