"use client";

import { useState, useEffect } from 'react';
import { User, EmployeeFormData } from '@/types';
import { X, UserPlus, Save } from 'lucide-react';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EmployeeFormData) => void;
  employee?: User | null;
}

export default function EmployeeModal({ isOpen, onClose, onSubmit, employee }: EmployeeModalProps) {
  const [formData, setFormData] = useState<EmployeeFormData>({
    email: '',
    password: '',
    displayName: '',
    phone: '',
    department: '',
    role: 'employee',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (employee) {
      setFormData({
        email: employee.email,
        password: '',
        displayName: employee.displayName,
        phone: employee.phone || '',
        department: employee.department || '',
        role: employee.role,
      });
    } else {
      setFormData({
        email: '',
        password: '',
        displayName: '',
        phone: '',
        department: '',
        role: 'employee',
      });
    }
    setErrors({});
  }, [employee, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.displayName.trim()) newErrors.displayName = 'الاسم مطلوب';
    if (!formData.email.trim()) newErrors.email = 'البريد الإلكتروني مطلوب';
    if (!employee && !formData.password) newErrors.password = 'كلمة المرور مطلوبة';
    if (!employee && formData.password && formData.password.length < 6) {
      newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" dir="rtl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2">
            {employee ? (
              <Save className="h-5 w-5 text-blue-600" />
            ) : (
              <UserPlus className="h-5 w-5 text-blue-600" />
            )}
            <h2 className="text-lg font-bold text-gray-900">
              {employee ? 'تعديل موظف' : 'إضافة موظف جديد'}
            </h2>
          </div>
          <button 
            onClick={handleClose} 
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل *</label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className={`w-full px-3 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-right bg-gray-50 focus:bg-white ${
                errors.displayName ? 'border-red-300 focus:ring-red-200' : 'border-gray-300'
              }`}
              placeholder="أدخل اسم الموظف"
            />
            {errors.displayName && <p className="text-red-500 text-xs mt-1">{errors.displayName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-3 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-right bg-gray-50 focus:bg-white ${
                errors.email ? 'border-red-300 focus:ring-red-200' : 'border-gray-300'
              }`}
              placeholder="email@company.com"
              disabled={!!employee}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {!employee && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور *</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`w-full px-3 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-right bg-gray-50 focus:bg-white ${
                  errors.password ? 'border-red-300 focus:ring-red-200' : 'border-gray-300'
                }`}
                placeholder="6 أحرف على الأقل"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">رقم الجوال</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-right bg-gray-50 focus:bg-white"
                placeholder="05xxxxxxxx"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">القسم</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-right bg-gray-50 focus:bg-white"
                placeholder="مثال: المبيعات"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الدور</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'employee' })}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-right bg-gray-50 focus:bg-white"
            >
              <option value="employee">موظف</option>
              <option value="admin">مدير</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md"
            >
              {employee ? 'حفظ التغييرات' : 'إضافة موظف'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
