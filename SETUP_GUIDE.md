# دليل الإعداد السريع (Quick Start Guide)

## 🚀 البدء في 5 دقائق

### الخطوة 1: إنشاء مشروع Firebase (2 دقيقة)

```bash
# 1. اذهب إلى https://console.firebase.google.com
# 2. أنشئ مشروع جديد
# 3. أضف تطبيق ويب (Web App)
# 4. انسخ الإعدادات
```

### الخطوة 2: تفعيل الخدمات (2 دقيقة)

```
Firebase Console:
├── Authentication → Get Started → Email/Password → Enable
├── Firestore Database → Create Database → Start in production mode
└── Project Settings → General → Your apps → Web → Config
```

### الخطوة 3: إعداد المشروع (1 دقيقة)

```bash
# تثبيت الحزم
npm install

# إعداد البيئة
cp .env.local.example .env.local
# عدل القيم في .env.local بإعدادات Firebase

# تشغيل محلياً
npm run dev
# افتح http://localhost:3000
```

---

## 📊 هيكل قاعدة البيانات

### Collection: `users`
```javascript
{
  uid: string,           // معرف المستخدم
  email: string,           // البريد الإلكتروني
  displayName: string,     // الاسم الكامل
  phone: string,           // رقم الجوال (اختياري)
  department: string,      // القسم (اختياري)
  role: "admin" | "employee", // الدور
  isActive: boolean,       // الحالة
  locationSharingEnabled: boolean, // مشاركة الموقع
  createdAt: Timestamp,    // تاريخ الإنشاء
  updatedAt: Timestamp     // تاريخ التحديث
}
```

### Collection: `locations`
```javascript
{
  userId: string,          // معرف المستخدم
  latitude: number,        // خط العرض
  longitude: number,       // خط الطول
  accuracy: number,        // الدقة (اختياري)
  timestamp: Timestamp,    // وقت التسجيل
  address: string          // العنوان (اختياري)
}
```

### Collection: `locationHistory`
```javascript
{
  userId: string,          // معرف المستخدم
  latitude: number,        // خط العرض
  longitude: number,       // خط الطول
  accuracy: number,        // الدقة (اختياري)
  timestamp: Timestamp,    // وقت التسجيل
  address: string          // العنوان (اختياري)
}
```

---

## 🔐 قواعد Firestore

انسخ هذا إلى Firebase Console > Firestore Database > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }

    function isAdmin() {
      return isAuthenticated() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAdmin();
      allow update: if isAdmin() || (isOwner(userId) && 
        request.resource.data.diff(resource.data).affectedKeys()
          .hasOnly(['locationSharingEnabled', 'updatedAt']));
      allow delete: if isAdmin();
    }

    match /locations/{locationId} {
      allow read: if isAdmin() || isOwner(locationId);
      allow create, update: if isOwner(locationId) || isAdmin();
      allow delete: if isAdmin();
    }

    match /locationHistory/{docId} {
      allow read: if isAdmin() || isOwner(resource.data.userId);
      allow create: if isAuthenticated() && 
        (isOwner(request.resource.data.userId) || isAdmin());
      allow delete: if isAdmin();
    }
  }
}
```

---

## 📱 استخدام PWA

لتحويل التطبيق إلى تطبيق ويب تقدمي:

1. أضف أيقونات في `public/`:
   - `icon-192x192.png`
   - `icon-512x512.png`
   - `apple-touch-icon.png`
   - `favicon.ico`

2. تأكد من وجود `manifest.json`

3. على الهاتف:
   - Chrome → Menu → "Add to Home Screen"
   - Safari → Share → "Add to Home Screen"

---

## 🧪 اختبار النظام

### سيناريو 1: إنشاء مدير
```
1. افتح /register
2. أدخل:
   - الاسم: مدير النظام
   - البريد: admin@company.com
   - كلمة المرور: 123456
   - مفتاح المدير: your_admin_secret_key_123
3. سجل الدخول
4. يجب التوجيه إلى /dashboard
```

### سيناريو 2: إضافة موظف
```
1. من لوحة التحكم
2. اضغط "إضافة موظف"
3. أدخل بيانات الموظف
4. الموظف يظهر في القائمة
```

### سيناريو 3: تتبع الموقع
```
1. سجل الدخول كموظف
2. فعّل "مشاركة الموقع"
3. اضغط "تحديث الموقع الآن"
4. تحقق من ظهور الموقع على الخريطة كمدير
```

---

## 🔧 استكشاف الأخطاء الشائعة

| المشكلة | الحل |
|---------|------|
| `Firebase Error: auth/invalid-api-key` | تحقق من صحة `NEXT_PUBLIC_FIREBASE_API_KEY` |
| `Missing or insufficient permissions` | تأكد من نشر قواعد Firestore |
| `Leaflet CSS not loaded` | تأكد من استيراد CSS في المكون |
| `Geolocation not supported` | استخدم HTTPS أو localhost |
| `Build failed` | تأكد من تثبيت جميع الحزم: `npm install` |
| `Module not found` | تأكد من صحة المسارات في `tsconfig.json` |

---

## 📞 دعم فني

للاستفسارات أو المشاكل:
- 📧 البريد: support@yourcompany.com
- 🐛 GitHub Issues
- 📖 اقرأ [DEPLOYMENT.md](DEPLOYMENT.md) للنشر

---

<div align="center">

**تم البناء بـ ❤️ لإدارة فرق العمل الميدانية**

</div>
