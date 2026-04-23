"use client";

import { LocationHistory as LocationHistoryType } from '@/types';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { MapPin, Clock, Navigation, History } from 'lucide-react';

interface LocationHistoryProps {
  history: LocationHistoryType[];
  employeeName: string;
}

export default function LocationHistory({ history, employeeName }: LocationHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <History className="h-12 w-12 mx-auto mb-3 text-gray-300" />
        <p className="text-gray-500 font-medium">لا يوجد سجل مواقع لهذا الموظف</p>
        <p className="text-sm text-gray-400 mt-1">سيتم تسجيل المواقع عند بدء التتبع</p>
      </div>
    );
  }

  return (
    <div className="space-y-3" dir="rtl">
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900">سجل الحركة</h3>
            <p className="text-sm text-gray-500">{employeeName} - {history.length} موقع مسجل</p>
          </div>
          <div className="p-2 bg-blue-100 rounded-lg">
            <History className="h-5 w-5 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto space-y-2 pr-1">
        {history.map((location, index) => (
          <div 
            key={location.id} 
            className="p-4 bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                <span className="text-xs font-bold text-white">{history.length - index}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-sm text-gray-900 mb-1">
                  <Navigation className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <span className="font-mono text-xs">
                    {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  </span>
                </div>
                {location.address && (
                  <p className="text-sm text-gray-600 mb-2">{location.address}</p>
                )}
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Clock className="h-3 w-3" />
                  <span>{format(location.timestamp, 'PPpp', { locale: ar })}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
