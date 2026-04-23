import Link from 'next/link';
import { MapPin, Shield, Users, Clock, Lock, Globe, ArrowLeft, ChevronDown } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50" dir="rtl">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 relative">
          <nav className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-xl">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">نظام التتبع</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                تسجيل الدخول
              </Link>
              <Link 
                href="/register" 
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
              >
                إنشاء حساب
              </Link>
            </div>
          </nav>

          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-8">
              <Shield className="h-4 w-4" />
              نظام آمن وموثوق لإدارة الفرق الميدانية
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              نظام تتبع مواقع
              <span className="text-blue-600"> الموظفين</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              حل احترافي لإدارة فرق العمل الميدانية ومتابعة مواقع الموظفين بشكل لحظي، 
              مما يضمن دقة الوصول للعملاء وتقليل التأخير.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300"
              >
                ابدأ الآن مجاناً
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-xl font-semibold text-lg hover:border-blue-300 hover:text-blue-600 transition-all"
              >
                تسجيل الدخول
              </Link>
            </div>
          </div>

          <div className="mt-16 flex justify-center">
            <ChevronDown className="h-6 w-6 text-gray-400 animate-bounce" />
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <Stat number="10" label="دقائق تحديث" />
            <Stat number="100%" label="آمن وموثوق" />
            <Stat number="24/7" label="متابعة لحظية" />
            <Stat number="0" label="تأخير في الوصول" />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">مميزات النظام</h2>
            <p className="text-gray-600 max-w-xl mx-auto">كل ما تحتاجه لإدارة فريقك الميداني بكفاءة واحترافية</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MapPin className="h-6 w-6 text-white" />}
              iconBg="bg-blue-500"
              title="تتبع لحظي"
              description="متابعة مواقع جميع الموظفين على خريطة مباشرة مع تحديث تلقائي كل 10 دقائق"
            />
            <FeatureCard
              icon={<Clock className="h-6 w-6 text-white" />}
              iconBg="bg-green-500"
              title="سجل الحركة"
              description="حفظ سجل كامل لحركة كل موظف مع إمكانية المراجعة والتحليل لاحقاً"
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6 text-white" />}
              iconBg="bg-purple-500"
              title="أمان وحماية"
              description="تسجيل دخول إلزامي مع صلاحيات مختلفة للمدير والموظف وحماية البيانات"
            />
            <FeatureCard
              icon={<Users className="h-6 w-6 text-white" />}
              iconBg="bg-orange-500"
              title="إدارة الموظفين"
              description="إضافة وتعديل وحذف الموظفين مع إمكانية تفعيل/تعطيل الحسابات"
            />
            <FeatureCard
              icon={<Lock className="h-6 w-6 text-white" />}
              iconBg="bg-red-500"
              title="خصوصية تامة"
              description="جميع البيانات تُستخدم لأغراض تشغيلية داخل الشركة فقط مع موافقة صريحة"
            />
            <FeatureCard
              icon={<Globe className="h-6 w-6 text-white" />}
              iconBg="bg-cyan-500"
              title="وصول من أي مكان"
              description="النظام متوافق مع جميع الأجهزة والمتصفحات للوصول في أي وقت ومن أي مكان"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">كيف يعمل النظام؟</h2>
            <p className="text-gray-600 max-w-xl mx-auto">ثلاث خطوات بسيطة للبدء في تتبع فريقك</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="01"
              title="تسجيل الدخول"
              description="يدخل الموظف بياناته للنظام بشكل آمن عبر Firebase Authentication"
            />
            <StepCard
              number="02"
              title="مشاركة الموقع"
              description="يقوم النظام بإرسال الموقع تلقائياً كل 10 دقائق أثناء ساعات العمل"
            />
            <StepCard
              number="03"
              title="المتابعة اللحظية"
              description="يتابع المدير جميع المواقع على الخريطة ويراجع سجل الحركة بسهولة"
            />
          </div>
        </div>
      </section>

      {/* Admin vs Employee */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">لوحات التحكم</h2>
            <p className="text-gray-600 max-w-xl mx-auto">واجهات مصممة خصيصاً لكل دور</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <RoleCard
              role="المدير"
              icon={<Shield className="h-8 w-8 text-blue-600" />}
              features={[
                'عرض جميع الموظفين على الخريطة المباشرة',
                'متابعة موقع كل موظف بشكل لحظي',
                'تحديث الموقع تلقائياً كل 10 دقائق',
                'عرض سجل حركة كل موظف',
                'إضافة / حذف / تعديل موظفين',
                'فلترة الموظفين حسب الحالة',
              ]}
              color="blue"
            />
            <RoleCard
              role="الموظف"
              icon={<Users className="h-8 w-8 text-green-600" />}
              features={[
                'تسجيل الدخول عبر Firebase Authentication',
                'إرسال الموقع بشكل تلقائي كل 10 دقائق',
                'عرض رسالة توضيحية عن التتبع',
                'زر لتفعيل / إيقاف مشاركة الموقع',
                'عرض سجل حركته الشخصي',
                'تحديث الموقع يدوياً',
              ]}
              color="green"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ابدأ في إدارة فريقك الميداني اليوم
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            نظام احترافي لإدارة فرق العمل الميدانية وتحسين تنظيم حركة الموظفين 
            وضمان دقة وصولهم للعملاء وتقليل التأخير.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-lg"
            >
              إنشاء حساب مجاني
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-500 text-white rounded-xl font-bold text-lg hover:bg-blue-400 transition-all border-2 border-blue-400"
            >
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">نظام التتبع</span>
            </div>
            <p className="text-gray-400 text-sm text-center max-w-md">
              جميع البيانات تُستخدم لأغراض تشغيلية داخل الشركة فقط. نظام آمن وشفاف يحترم خصوصية الموظفين.
            </p>
            <div className="text-gray-500 text-sm">
              © 2026 نظام تتبع مواقع الموظفين
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <p className="text-3xl font-bold text-blue-600 mb-1">{number}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
}

function FeatureCard({ icon, iconBg, title, description }: { icon: React.ReactNode; iconBg: string; title: string; description: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all group">
      <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center hover:shadow-md transition-all">
      <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
        {number}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function RoleCard({ role, icon, features, color }: { role: string; icon: React.ReactNode; features: string[]; color: string }) {
  const borderColor = color === 'blue' ? 'border-blue-200' : 'border-green-200';
  const bgColor = color === 'blue' ? 'bg-blue-50' : 'bg-green-50';

  return (
    <div className={`bg-white rounded-2xl p-8 shadow-sm border ${borderColor} hover:shadow-md transition-all`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-3 ${bgColor} rounded-xl`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900">واجهة {role}</h3>
      </div>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
            <span className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${color === 'blue' ? 'bg-blue-500' : 'bg-green-500'}`}></span>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}
