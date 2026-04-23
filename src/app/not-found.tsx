import Link from 'next/link';
import { MapPin, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-50 p-4" dir="rtl">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <MapPin className="h-10 w-10 text-blue-600" />
        </div>
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-2">الصفحة غير موجودة</p>
        <p className="text-gray-500 mb-8">الصفحة التي تبحث عنها غير متوفرة أو تم نقلها</p>
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-200"
        >
          <ArrowLeft className="h-5 w-5" />
          العودة للصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
}
