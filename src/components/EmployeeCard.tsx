"use client";

import { User } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { 
  Phone, 
  Building2, 
  MapPin, 
  Clock,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Edit,
  UserCircle
} from 'lucide-react';

interface EmployeeCardProps {
  employee: User;
  onToggleStatus: (uid: string, isActive: boolean) => void;
  onDelete: (uid: string) => void;
  onEdit: (employee: User) => void;
  lastLocation?: { latitude: number; longitude: number; timestamp: Date };
}

export default function EmployeeCard({ 
  employee, 
  onToggleStatus, 
  onDelete, 
  onEdit,
  lastLocation 
}: EmployeeCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm ${
              employee.isActive ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-gray-400 to-gray-500'
            }`}>
              {employee.displayName.charAt(0)}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-gray-900 truncate">{employee.displayName}</h3>
              <p className="text-sm text-gray-500 truncate">{employee.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(employee)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="تعديل"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(employee.uid)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="حذف"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {employee.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span className="truncate">{employee.phone}</span>
            </div>
          )}
          {employee.department && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building2 className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span className="truncate">{employee.department}</span>
            </div>
          )}
          {lastLocation && (
            <>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-xs font-mono">
                  {lastLocation.latitude.toFixed(4)}, {lastLocation.longitude.toFixed(4)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-xs">
                  {formatDistanceToNow(lastLocation.timestamp, { addSuffix: true, locale: ar })}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">مشاركة الموقع:</span>
            {employee.locationSharingEnabled ? (
              <ToggleRight className="h-6 w-6 text-green-500" />
            ) : (
              <ToggleLeft className="h-6 w-6 text-gray-400" />
            )}
          </div>
          <button
            onClick={() => onToggleStatus(employee.uid, !employee.isActive)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              employee.isActive 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {employee.isActive ? 'نشط' : 'غير نشط'}
          </button>
        </div>
      </div>
    </div>
  );
}
