"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useRealtimeUsers, useRealtimeLocations } from '@/hooks/useRealtimeData';
import { User, EmployeeFormData, LocationHistory as LocationHistoryType } from '@/types';
import { toggleUserStatus, deleteUser, updateUser, getLocationHistory } from '@/lib/firebase-admin';
import { registerUser } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import EmployeeCard from '@/components/EmployeeCard';
import EmployeeModal from '@/components/EmployeeModal';
import LocationHistory from '@/components/LocationHistory';
import { 
  Users, 
  Plus, 
  Search,
  AlertTriangle,
  Filter,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function EmployeesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { users, loading: usersLoading } = useRealtimeUsers();
  const { locations } = useRealtimeLocations();

  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<User | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const [locationHistory, setLocationHistory] = useState<LocationHistoryType[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

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
    const matchesFilter = filter === 'all' ? true : filter === 'active' ? emp.isActive : !emp.isActive;
    const matchesSearch = searchQuery === '' || 
      emp.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (emp.department?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
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
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">إدارة الموظفين</h1>
                <p className="text-gray-500 text-sm">إضافة وتعديل وإدارة موظفي الشركة</p>
              </div>
            </div>
            <button
              onClick={() => {
                setEditingEmployee(null);
                setIsModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="h-5 w-5" />
              إضافة موظف جديد
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="البحث بالاسم أو البريد أو القسم..."
                className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-right"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  الكل ({employees.length})
                </button>
                <button
                  onClick={() => setFilter('active')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === 'active' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  نشط ({employees.filter(e => e.isActive).length})
                </button>
                <button
                  onClick={() => setFilter('inactive')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === 'inactive' ? 'bg-white text-red-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  غير نشط ({employees.filter(e => !e.isActive).length})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Employees Grid */}
        {usersLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-12 text-center">
            <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">لا يوجد موظفون</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery ? 'لا توجد نتائج مطابقة للبحث' : 'لم يتم إضافة أي موظفين بعد'}
            </p>
            <button
              onClick={() => {
                setEditingEmployee(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="h-5 w-5" />
              إضافة موظف جديد
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </main>

      {/* Modals */}
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEmployee(null);
        }}
        onSubmit={editingEmployee ? handleUpdateEmployee : handleAddEmployee}
        employee={editingEmployee}
      />

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
