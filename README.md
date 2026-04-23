# نظام تتبع مواقع الموظفين (Employee Location Tracking System)

<div align="center">

🗺️ نظام احترافي لإدارة فرق العمل الميدانية ومتابعة مواقع الموظفين بشكل لحظي

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-10-orange)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-cyan)](https://tailwindcss.com/)

</div>

## 📋 جدول المحتويات

- [المميزات](#-المميزات)
- [التقنيات](#-التقنيات)
- [الهيكل](#-الهيكل)
- [الإعداد](#-الإعداد)
- [النشر](#-النشر)
- [الأمان](#-الأمان)
- [الترخيص](#-الترخيص)

## ✨ المميزات

### للمدير (Admin)
- ✅ عرض جميع الموظفين على خريطة مباشرة
- ✅ متابعة موقع كل موظف بشكل لحظي
- ✅ تحديث الموقع تلقائياً كل 10 دقائق
- ✅ عرض سجل حركة كل موظف (Location History)
- ✅ إضافة / حذف / تعديل موظفين
- ✅ فلترة الموظفين حسب الحالة (نشط / غير نشط)
- ✅ إحصائيات فورية عن الفريق

### للموظف (Employee)
- ✅ تسجيل الدخول عبر Firebase Authentication
- ✅ إرسال الموقع بشكل تلقائي كل 10 دقائق
- ✅ رسالة توضيحية عن أهداف التتبع
- ✅ زر لتفعيل / إيقاف مشاركة الموقع
- ✅ عرض سجل الحركة الشخصي
- ✅ تحديث الموقع يدوياً

## 🛠️ التقنيات

| الطبقة | التقنية |
|--------|---------|
| **Frontend** | Next.js 14 + React 18 + TypeScript |
| **Styling** | Tailwind CSS + Lucide Icons |
| **Backend** | Firebase (Auth + Firestore + Realtime DB) |
| **Maps** | React Leaflet + OpenStreetMap |
| **Hosting** | Vercel |
| **Notifications** | React Hot Toast |

## 📁 الهيكل

```
employee-tracking-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # الصفحة الرئيسية
│   │   ├── layout.tsx          # التخطيط الرئيسي
│   │   ├── login/              # تسجيل الدخول
│   │   ├── register/           # التسجيل
│   │   ├── dashboard/          # لوحة المدير
│   │   ├── map/                # الخريطة المباشرة
│   │   ├── employees/          # إدارة الموظفين
│   │   └── employee/           # لوحة الموظف
│   ├── components/             # المكونات المشتركة
│   │   ├── Map.tsx             # خريطة Leaflet
│   │   ├── Navbar.tsx          # شريط التنقل
│   │   ├── EmployeeCard.tsx    # بطاقة الموظف
│   │   ├── LocationHistory.tsx # سجل الحركة
│   │   ├── EmployeeModal.tsx   # نموذج الموظف
│   │   └── ProtectedRoute.tsx  # حماية المسارات
│   ├── hooks/                  # Custom Hooks
│   │   ├── useAuth.ts          # إدارة المصادقة
│   │   ├── useLocationTracker.ts # تتبع الموقع
│   │   └── useRealtimeData.ts  # البيانات اللحظية
│   ├── lib/                    # المكتبات والأدوات
│   │   ├── firebase.ts         # إعداد Firebase
│   │   ├── firebase-admin.ts   # عمليات Firestore
│   │   ├── auth.ts             # مصادقة المستخدمين
│   │   └── location.ts         # خدمات الموقع
│   └── types/                  # أنواع TypeScript
│       └── index.ts
├── public/                     # الملفات العامة
├── firestore.rules             # قواعد Firestore
├── firestore.indexes.json      # فهارس Firestore
├── firebase.json               # إعداد Firebase
├── .env.local                  # متغيرات البيئة
├── next.config.js              # إعداد Next.js
└── package.json
```

## ⚙️ الإعداد

### 1. المتطلبات

- Node.js 18+
- npm أو yarn
- حساب Firebase

### 2. التثبيت

```bash
# استنساخ المستودع
git clone https://github.com/yourusername/employee-tracking.git
cd employee-tracking

# تثبيت الحزم
npm install

# إعداد المتغيرات البيئية
cp .env.local.example .env.local
# عدل القيم في .env.local

# تشغيل محلياً
npm run dev
```

### 3. إعداد Firebase

1. أنشئ مشروع في [Firebase Console](https://console.firebase.google.com/)
2. فعّل **Authentication** (Email/Password)
3. أنشئ **Firestore Database**
4. انسخ الإعدادات إلى `.env.local`
5. انشر قواعد Firestore من ملف `firestore.rules`

### 4. إعداد Google Maps (اختياري)

1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com/)
2. فعّل **Geocoding API**
3. أنشئ مفتاح API
4. أضف المفتاح إلى `.env.local`

## 🚀 النشر

### النشر على Vercel

```bash
# تثبيت Vercel CLI
npm i -g vercel

# النشر
vercel --prod
```

أو عبر GitHub:

1. ارفع المشروع على GitHub
2. اربط المستودع مع Vercel
3. أضف متغيرات البيئة
4. اضغط Deploy

📖 [دليل النشر الكامل](DEPLOYMENT.md)

## 🔒 الأمان

- ✅ تسجيل دخول إلزامي عبر Firebase Auth
- ✅ صلاحيات مختلفة (Admin / Employee)
- ✅ قواعد Firestore لحماية البيانات
- ✅ Headers أمانية في Middleware
- ✅ CSP (Content Security Policy)
- ✅ X-Frame-Options: DENY
- ✅ جميع البيانات مشفرة

## 📍 نظام التتبع

| الميزة | التفاصيل |
|--------|---------|
| API | Geolocation API (متصفح) |
| فترة التحديث | كل 10 دقائق |
| الدقة | GPS عالي الدقة |
| التخزين | Firestore مع Timestamp |
| الخريطة | OpenStreetMap (مجاني) |

## 🎯 الاستخدام

### إنشاء حساب مدير

1. افتح `/register`
2. أدخل بياناتك
3. في حقل "مفتاح المدير" أدخل القيمة من `NEXT_PUBLIC_ADMIN_SECRET`
4. سجل الدخول

### إضافة موظف

1. من لوحة التحكم، اضغط "إضافة موظف"
2. أدخل بيانات الموظف
3. الموظف يستلم بريد التفعيل

### تتبع الموقع

1. سجل الدخول كموظف
2. فعّل "مشاركة الموقع"
3. سيتم التتبع تلقائياً كل 10 دقائق

## 📝 ملاحظات

- يتطلب المتصفح إذن الوصول إلى الموقع
- يعمل بشكل أفضل على الأجهزة المحمولة
- يمكن تثبيته كـ PWA
- جميع البيانات للاستخدام التشغيلي فقط

## 📄 الترخيص

هذا المشروع مفتوح المصدر للاستخدام الداخلي في الشركات.

---

<div align="center">

**تم البناء بـ ❤️ لإدارة فرق العمل الميدانية**

</div>
