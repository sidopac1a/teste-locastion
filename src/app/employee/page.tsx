"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useLocationTracker } from '@/hooks/useLocationTracker';
import { toggleLocationSharing } from '@/lib/auth';
import { getLocationHistory } from '@/lib/firebase-admin';
import Navbar from '@/components/Navbar';
import LocationHistory from '@/components/LocationHistory';
import { LocationHistory as LocationHistoryType } from '@/types';
import { 
  MapPin, 
  Shield, 
  Clock, 
  ToggleLeft, 
  ToggleRight,
  AlertCircle,
  Navigation,
  Info,
  RefreshCw,
  History,
  Wifi,
  WifiOff,
  CheckCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import toast from 'react-hot-toast';

export default function EmployeePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [locationSharing, setLocationSharing] = useState(true);
  const [locationHistory, setLocationHistory] = useState<LocationHistoryType[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [manualUpdateLoading, setManualUpdateLoading] = useState(false);

  const { currentLocation, isTracking, error, updateLocation } = useLocationTracker({
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

  const handleToggleSharing = async () => {
    if (!user) return;

    const newValue = !locationSharing;
    try {
      await toggleLocationSharing(user.uid, newValue);
      setLocationSharing(newValue);
      toast.success(newValue ? 'تم تفعيل مشاركة الموقع' : 'تم إيقاف مشاركة الموقع');
    } catch (error) {
      toast.error('فشل تحديث الإعدادات');
    }
  };

  const handleManualUpdate = async () => {
    if (!user) return;
    setManualUpdateLoading(true);
    const toastId = toast.loading('جاري تحديث الموقع...');
    try {
      await updateLocation();
      toast.dismiss(toastId);
      if (currentLocation) {
        toast.success('تم تحديث الموقع بنجاح');
      } else {
        toast.error('تعذر الحصول على الموقع');
      }
    } catch (err) {
      toast.dismiss(toastId);
      toast.error('حدث خطأ أثناء تحديث الموقع');
    } finally {
      setManualUpdateLoading(false);
    }
  };

  const handleShowHistory = async () => {
    if (!user) return;
    setShowHistory(true);
    setHistoryLoading(true);
    try {
      const history = await getLocationHistory(user.uid, 30);
      setLocationHistory(history);
    } catch (error) {
      toast.error('فشل تحميل سجل الحركة');
    } finally {
      setHistoryLoading(false);
    }
  };

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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-6 md:p-8 mb-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Shield className="h-7 w-7 md:h-8 md:w-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">مرحباً، {user.displayName}</h1>
              <p className="text-blue-100 text-sm">لوحة تحكم الموظف</p>
            </div>
          </div>
          <div className="flex items-start gap-2 text-sm text-blue-100 bg-white/10 rounded-xl p-4">
            <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              يتم تتبع الموقع أثناء ساعات العمل فقط بهدف تنظيم العمليات وتحسين خدمة العملاء 
              وضمان وصول الموظفين في الوقت المناسب. جميع البيانات تُستخدم لأغراض تشغيلية داخل الشركة فقط.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Location Status Card */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">حالة الموقع</h2>
                  <p className="text-sm text-gray-500">مشاركة الموقع الحالية</p>
                </div>
              </div>
              <button
                onClick={handleToggleSharing}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title={locationSharing ? 'إيقاف المشاركة' : 'تفعيل المشاركة'}
              >
                {locationSharing ? (
                  <ToggleRight className="h-8 w-8 text-green-500" />
                ) : (
                  <ToggleLeft className="h-8 w-8 text-gray-400" />
                )}
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">الحالة</span>
                <span className={`text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1.5 ${
                  locationSharing 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {locationSharing ? (
                    <><CheckCircle className="h-3.5 w-3.5" /> مفعل</>
                  ) : (
                    <><WifiOff className="h-3.5 w-3.5" /> معطل</>
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">التتبع التلقائي</span>
                <span className={`text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1.5 ${
                  isTracking 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {isTracking ? (
                    <><Wifi className="h-3.5 w-3.5" /> يعمل</>
                  ) : (
                    'متوقف'
                  )}
                </span>
              </div>

              {currentLocation && (
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Navigation className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">الموقع الحالي</span>
                  </div>
                  <p className="text-sm text-blue-700 font-mono bg-white/50 p-2 rounded-lg">
                    {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                  </p>
                  {currentLocation.accuracy && (
                    <p className="text-xs text-blue-500 mt-2">
                      الدقة: ±{Math.round(currentLocation.accuracy)} متر
                    </p>
                  )}
                  <p className="text-xs text-blue-400 mt-1">
                    {formatDistanceToNow(currentLocation.timestamp, { addSuffix: true, locale: ar })}
                  </p>
                </div>
              )}

              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-100">
                  <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleManualUpdate}
                disabled={manualUpdateLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
              >
                {manualUpdateLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                تحديث الموقع الآن
              </button>
              <button
                onClick={handleShowHistory}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                <History className="h-4 w-4" />
                سجل الحركة
              </button>
            </div>
          </div>

          {/* Tracking Info Card */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">معلومات التتبع</h2>
                <p className="text-sm text-gray-500">كيفية عمل النظام</p>
              </div>
            </div>

            <div className="space-y-3">
              <InfoItem
                icon={<Clock className="h-5 w-5 text-blue-500" />}
                title="فترة التحديث"
                description="يتم إرسال الموقع تلقائياً كل 10 دقائق أثناء ساعات العمل"
              />
              <InfoItem
                icon={<Shield className="h-5 w-5 text-green-500" />}
                title="الخصوصية"
                description="البيانات تُستخدم لأغراض تشغيلية داخل الشركة فقط"
              />
              <InfoItem
                icon={<MapPin className="h-5 w-5 text-purple-500" />}
                title="الدقة"
                description="يستخدم نظام GPS للحصول على أدق إحداثيات ممكنة"
              />
              <InfoItem
                icon={<ToggleLeft className="h-5 w-5 text-orange-500" />}
                title="التحكم"
                description="يمكنك تفعيل أو إيقاف مشاركة الموقع في أي وقت"
              />
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-yellow-800 mb-1">تنبيه مهم</h4>
                  <p className="text-sm text-yellow-700 leading-relaxed">
                    يتم تتبع الموقع أثناء ساعات العمل فقط. يرجى التأكد من تفعيل خدمة الموقع 
                    في جهازك للحصول على أفضل دقة. يمكنك إيقاف المشاركة في أي وقت.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickStat 
            label="آخر تحديث" 
            value={currentLocation ? formatDistanceToNow(currentLocation.timestamp, { locale: ar }) : '—'} 
          />
          <QuickStat 
            label="الدقة" 
            value={currentLocation?.accuracy ? `±${Math.round(currentLocation.accuracy)}م` : '—'} 
          />
          <QuickStat 
            label="عدد التحديثات" 
            value={locationHistory.length > 0 ? `${locationHistory.length}+` : '—'} 
          />
          <QuickStat 
            label="حالة الجهاز" 
            value={isTracking ? 'متصل' : 'غير متصل'} 
            color={isTracking ? 'text-green-600' : 'text-gray-500'}
          />
        </div>
      </main>

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">سجل حركتك</h3>
              </div>
              <button 
                onClick={() => setShowHistory(false)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <span className="text-gray-500 text-xl">&times;</span>
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[65vh]">
              {historyLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <LocationHistory history={locationHistory} employeeName={user.displayName} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div>
        <h4 className="text-sm font-bold text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function QuickStat({ label, value, color = 'text-gray-900' }: { label: string; value: string; color?: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
      <p className={`text-lg font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}
