# دليل النشر على Vercel

## المتطلبات المسبقة

1. حساب على [Vercel](https://vercel.com/)
2. حساب على [Firebase](https://console.firebase.google.com/)
3. حساب على [GitHub](https://github.com/)

---

## الخطوة 1: إعداد Firebase

### 1.1 إنشاء مشروع Firebase

1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. أنشئ مشروع جديد
3. أضف تطبيق ويب (Web App)
4. انسخ إعدادات Firebase

### 1.2 تفعيل Authentication

1. اذهب إلى **Authentication** > **Get Started**
2. فعّل **Email/Password** provider
3. احفظ الإعدادات

### 1.3 إنشاء Firestore Database

1. اذهب إلى **Firestore Database** > **Create Database**
2. اختر **Start in production mode**
3. اختر المنطقة الأقرب لك (مثل: europe-west أو us-central)

### 1.4 تحديث قواعد Firestore

1. اذهب إلى **Firestore Database** > **Rules**
2. انسخ محتوى ملف `firestore.rules` من المشروع
3. انشر القواعد (Publish)

### 1.5 إنشاء Indexes

1. اذهب إلى **Firestore Database** > **Indexes**
2. انسخ محتوى ملف `firestore.indexes.json`
3. أنشئ الـ indexes المطلوبة

---

## الخطوة 2: إعداد المتغيرات البيئية

### 2.1 ملف .env.local (محلياً)

```bash
# نسخ الملف
mv .env.local.example .env.local

# تعديل القيم
nano .env.local
```

### 2.2 متغيرات Vercel (للنشر)

1. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
2. اختر مشروعك
3. اذهب إلى **Settings** > **Environment Variables**
4. أضف كل متغير من `.env.local`

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | your_api_key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | your_project.firebaseapp.com |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | your_project_id |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | your_project.appspot.com |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | your_sender_id |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | your_app_id |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | your_measurement_id |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | YOUR_MAPS_API_KEY_HERE |
| `NEXT_PUBLIC_ADMIN_SECRET` | your_admin_secret |

---

## الخطوة 3: النشر على Vercel

### الطريقة 1: عبر GitHub (موصى بها)

```bash
# 1. إنشاء مستودع GitHub
git init
git add .
git commit -m "Initial commit"
gh repo create employee-tracking --public --source=. --push

# 2. الربط مع Vercel
vercel --prod
```

### الطريقة 2: يدوياً

1. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
2. اضغط **Add New** > **Project**
3. استورد من GitHub
4. اختر المستودع
5. اضبط:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
6. أضف متغيرات البيئة
7. اضغط **Deploy**

---

## الخطوة 4: إعداد Google Maps API (اختياري)

1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com/)
2. أنشئ مشروع أو استخدم موجود
3. فعّل **Geocoding API**
4. أنشئ **API Key**
5. اضبط قيود المفتاح:
   - HTTP referrers: `https://your-domain.vercel.app/*`
6. أضف المفتاح إلى متغيرات البيئة

---

## الخطوة 5: اختبار النظام

### 5.1 إنشاء حساب مدير

1. افتح التطبيق
2. اذهب إلى **إنشاء حساب**
3. أدخل بياناتك
4. في حقل "مفتاح المدير" أدخل القيمة من `NEXT_PUBLIC_ADMIN_SECRET`
5. سجل الدخول كمدير

### 5.2 إضافة موظفين

1. من لوحة التحكم، اضغط **إضافة موظف**
2. أدخل بيانات الموظف
3. سيتلقى الموظف بريداً للتفعيل

### 5.3 اختبار التتبع

1. سجل الدخول كموظف
2. فعّل مشاركة الموقع
3. تحقق من ظهور الموقع على الخريطة

---

## استكشاف الأخطاء

### مشكلة: الخريطة لا تظهر

```bash
# تأكد من تثبيت leaflet
npm install leaflet react-leaflet @types/leaflet
```

### مشكلة: Firebase Authentication لا يعمل

1. تأكد من تفعيل Email/Password في Firebase Console
2. تحقق من صحة متغيرات البيئة
3. تأكد من عدم وجود مسافات في القيم

### مشكلة: Firestore Rules تمنع الوصول

1. تأكد من نشر القواعد في Firebase Console
2. تحقق من صحة القواعد
3. انتظر دقيقة بعد النشر

---

## تحديث التطبيق

```bash
# سحب التغييرات
git pull origin main

# إعادة النشر
vercel --prod
```

---

## دعم PWA

لتحويل التطبيق إلى تطبيق ويب تقدمي (PWA):

1. أضف أيقونات في `public/`
2. تأكد من وجود `manifest.json`
3. في Vercel، اذهب إلى **Settings** > **General** > **Build & Development Settings**
4. تأكد من أن الإعدادات صحيحة

---

## اتصل بنا

للدعم الفني أو الاستفسارات، يرجى التواصل عبر:
- البريد الإلكتروني: support@yourcompany.com
- GitHub Issues
