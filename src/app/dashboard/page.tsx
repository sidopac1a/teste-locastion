"use client";

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useRealtimeUsers, useRealtimeLocations } from '@/hooks/useRealtimeData';
import { User, MapMarker, EmployeeFormData, LocationHistory as LocationHistoryType } from '@/types';
import { toggleUserStatus, deleteUser, updateUser, getLocationHistory } from '@/lib/firebase-admin';
import { registerUser } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import EmployeeCard from '@/components/EmployeeCard';
import EmployeeModal from '@/components/EmployeeModal';
import LocationHistory from '@/components/LocationHistory';
import { 
  Users, 
  MapPin, 
  Activity, 
  Clock,
  Plus,
  AlertTriangle,
  RefreshCw,
  TrendingUp,
  Map
} from 'lucide-react';
import toast from 'react-hot-toast';

// Dynamically import Map with SSR disabled
const MapView = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-3"></div>
        <p className="text-sm text-gray-500">جاري تحميل الخريطة...</p>
      </div>
    </div>
  )
});
export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { users, loading: usersLoading } = useRealtimeUsers();
  const { locations, loading: locationsLoading } = useRealtimeLocations();

  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<User | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const [locationHistory, setLocationHistory] = useState<LocationHistoryType[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
    if (!authLoading && user && user.role !== 'admin') {
      router.push('/employee');
    }
  }, [user, authLoading, router]);

  const employees = users.filter(u => u.role === 'employee');
  const filteredEmployees = employees.filter(emp => {
    if (filter === 'active') return emp.isActive;
    if (filter === 'inactive') return !emp.isActive;
    return true;
  });

  const activeCount = employees.filter(e => e.isActive).length;
  const onlineCount = locations.filter(l => {
    const emp = employees.find(e => e.uid === l.userId);
    return emp && emp.isActive;
  }).length;
  const offlineCount = activeCount - onlineCount;

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

  const getEmployeeLocation = useCallback((uid: string) => {
    return locations.find(l => l.userId === uid);
  }, [locations]);

  const handleToggleStatus = async (uid: string, isActive: boolean) => {
    try {
      await toggleUserStatus(uid, isActive);
      toast.success(isActive ? 'تم تفعيل الموظف بنجاح' : 'تم تعطيل الموظف بنجاح');
    } catch (error) {
      toast.error('فشل تحديث الحالة');
    }
  };

  const handleDelete = async (uid: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الموظف؟ لا يمكن التراجع عن هذا الإجراء.')) return;
    try {
      await deleteUser(uid);
      toast.success('تم حذف الموظف بنجاح');
    } catch (error) {
      toast.error('فشل حذف الموظف');
    }
  };

  const handleEdit = (employee: User) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleAddEmployee = async (data: EmployeeFormData) => {
    try {
      await registerUser(data);
      toast.success('تم إضافة الموظف بنجاح');
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'فشل إضافة الموظف');
    }
  };

  const handleUpdateEmployee = async (data: EmployeeFormData) => {
    if (!editingEmployee) return;
    try {
      await updateUser(editingEmployee.uid, {
        displayName: data.displayName,
        phone: data.phone,
        department: data.department,
        role: data.role,
      });
      toast.success('تم تحديث بيانات الموظف');
      setIsModalOpen(false);
      setEditingEmployee(null);
    } catch (error) {
      toast.error('فشل تحديث البيانات');
    }
  };

  const handleShowHistory = async (employee: User) => {
    setSelectedEmployee(employee);
    setShowHistory(true);
    setHistoryLoading(true);
    try {
      const history = await getLocationHistory(employee.uid, 50);
      setLocationHistory(history);
    } catch (error) {
      toast.error('فشل تحميل سجل الحركة');
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleRefresh = () => {
    setLastRefresh(new Date());
    toast.success('تم تحديث البيانات');
  };

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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة التحكم</h1>
          <p className="text-gray-600">نظرة عامة على فريق العمل ومواقعهم</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Users className="h-5 w-5 text-blue-600" />}
            title="إجمالي الموظفين"
            value={employees.length}
            color="bg-blue-50 border-blue-100"
            textColor="text-blue-600"
          />
          <StatCard
            icon={<Activity className="h-5 w-5 text-green-600" />}
            title="الموظفون النشطون"
            value={activeCount}
            color="bg-green-50 border-green-100"
            textColor="text-green-600"
          />
          <StatCard
            icon={<MapPin className="h-5 w-5 text-purple-600" />}
            title="متصلون الآن"
            value={onlineCount}
            color="bg-purple-50 border-purple-100"
            textColor="text-purple-600"
          />
          <StatCard
            icon={<TrendingUp className="h-5 w-5 text-orange-600" />}
            title="غير متصلين"
            value={offlineCount}
            color="bg-orange-50 border-orange-100"
            textColor="text-orange-600"
          />
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mb-8">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Map className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">الخريطة المباشرة</h2>
                <p className="text-xs text-gray-500">متابعة مواقع الموظفين لحظياً</p>
              </div>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                مباشر
              </span>
            </div>
            <button 
              onClick={handleRefresh}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="تحديث"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
          <div className="h-[400px] md:h-[500px]">
            <MapView markers={mapMarkers} showAll={true} />
          </div>
        </div>

        {/* Employees Section */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">إدارة الموظفين</h2>
                <p className="text-xs text-gray-500">{filteredEmployees.length} موظف</p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 flex-1 sm:flex-none">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex-1 sm:flex-none ${
                    filter === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  الكل
                </button>
                <button
                  onClick={() => setFilter('active')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex-1 sm:flex-none ${
                    filter === 'active' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  نشط
                </button>
                <button
                  onClick={() => setFilter('inactive')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex-1 sm:flex-none ${
                    filter === 'inactive' ? 'bg-white text-red-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  غير نشط
                </button>
              </div>
              <button
                onClick={() => {
                  setEditingEmployee(null);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap"
              >
                <Plus className="h-4 w-4" />
                إضافة
              </button>
            </div>
          </div>

          <div className="p-4">
            {usersLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="text-center py-12">
                <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">لا يوجد موظفون مطابقون للفلتر المحدد</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEmployees.map(employee => (
                  <div key={employee.uid} className="relative">
                    <EmployeeCard
                      employee={employee}
                      onToggleStatus={handleToggleStatus}
                      onDelete={handleDelete}
                      onEdit={handleEdit}
                      lastLocation={getEmployeeLocation(employee.uid)}
                    />
                    <button
                      onClick={() => handleShowHistory(employee)}
                      className="absolute top-4 left-4 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="عرض سجل الحركة"
                    >
                      <Clock className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Employee Modal */}
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEmployee(null);
        }}
        onSubmit={editingEmployee ? handleUpdateEmployee : handleAddEmployee}
        employee={editingEmployee}
      />

      {/* Location History Modal */}
      {showHistory && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">سجل حركة: {selectedEmployee.displayName}</h3>
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
                <LocationHistory history={locationHistory} employeeName={selectedEmployee.displayName} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, title, value, color, textColor }: { 
  icon: React.ReactNode; 
  title: string; 
  value: string | number; 
  color: string;
  textColor: string;
}) {
  return (
    <div className={`${color} rounded-xl p-4 border`}>
      <div className="flex items-center justify-between mb-2">
        <div className="p-2 bg-white rounded-lg shadow-sm">
          {icon}
        </div>
      </div>
      <p className={`text-2xl font-bold ${textColor} mb-1`}>{value}</p>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  );
}
