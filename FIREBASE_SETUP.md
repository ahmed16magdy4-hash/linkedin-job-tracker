# LinkedIn Job Tracker - Firebase Setup Guide

هذا الدليل يشرح كيفية إعداد مشروع Firebase الخاص بك وربطه بتطبيق متتبع الوظائف.

## الخطوة 1: إنشاء مشروع Firebase

1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. انقر على **"إنشاء مشروع"** (Create Project)
3. أدخل اسم المشروع (مثال: `job-tracker`)
4. اتبع الخطوات والقبول بالشروط
5. انتظر إنشاء المشروع (قد يستغرق بضع دقائق)

## الخطوة 2: تفعيل Firestore Database

1. في Firebase Console، انقر على **"Firestore Database"** من القائمة اليسرى
2. انقر على **"إنشاء قاعدة بيانات"** (Create Database)
3. اختر **"ابدأ في وضع الإنتاج"** (Start in production mode)
4. اختر الموقع الجغرافي الأقرب لك (مثال: `us-central1`)
5. انقر على **"إنشاء"**

## الخطوة 3: تكوين قواعد الأمان (Security Rules)

1. في Firestore، انتقل إلى تبويب **"القواعد"** (Rules)
2. استبدل القواعد الحالية بالقواعد التالية:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // السماح للمستخدمين المصرح لهم فقط
    match /jobs/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. انقر على **"نشر"** (Publish)

## الخطوة 4: الحصول على بيانات الاتصال

1. في Firebase Console، انقر على **"إعدادات المشروع"** (Project Settings) - رمز الترس في الأعلى
2. اختر تبويب **"تطبيقاتك"** (Your apps)
3. انقر على رمز الويب `</>` أو أنشئ تطبيق جديد
4. سيظهر لك كود التكوين. انسخ الجزء التالي:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## الخطوة 5: تحديث ملف Firebase في المشروع

1. افتح ملف `client/src/lib/firebase.ts`
2. استبدل `firebaseConfig` بالبيانات التي نسختها:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## الخطوة 6: تفعيل المصادقة (Authentication) - اختياري

إذا كنت تريد إضافة تسجيل الدخول:

1. في Firebase Console، انقر على **"المصادقة"** (Authentication)
2. انقر على **"ابدأ"** (Get started)
3. اختر **"البريد الإلكتروني/كلمة المرور"** (Email/Password)
4. فعّل الخيار

## الخطوة 7: النشر على Firebase Hosting

### الخطوة 7.1: تثبيت Firebase CLI

```bash
npm install -g firebase-tools
```

### الخطوة 7.2: تسجيل الدخول

```bash
firebase login
```

سيفتح متصفح لتسجيل الدخول إلى حسابك على Google.

### الخطوة 7.3: بناء المشروع

```bash
npm run build
```

### الخطوة 7.4: نشر التطبيق

```bash
firebase deploy
```

سيظهر لك رابط التطبيق الحي بعد النشر.

## الخطوة 8: إضافة بيانات تجريبية (اختياري)

لاختبار التطبيق بسرعة، يمكنك إضافة بيانات تجريبية:

1. في Firestore Console، انقر على **"+ إضافة مجموعة"** (+ Add collection)
2. أدخل اسم المجموعة: `jobs`
3. انقر على **"التالي"**
4. أضف وثيقة جديدة بالبيانات التالية:

```json
{
  "companyName": "Google",
  "jobTitle": "Senior Software Engineer",
  "status": "applied",
  "appliedDate": "2026-04-15",
  "location": "Dubai, UAE",
  "salary": "150,000 - 200,000 AED",
  "notes": "وظيفة رائعة",
  "createdAt": "2026-04-15",
  "updatedAt": "2026-04-15"
}
```

## استكشاف الأخطاء

### الخطأ: "Permission denied"
- تأكد من تحديث قواعد الأمان في Firestore
- تأكد من تسجيل الدخول إلى Firebase في التطبيق

### الخطأ: "Firebase is not defined"
- تأكد من تثبيت مكتبة Firebase: `npm install firebase`
- تأكد من استيراد Firebase بشكل صحيح

### التطبيق لا يحفظ البيانات
- تأكد من أن Firestore Database مفعّل
- تأكد من أن قواعد الأمان تسمح بالكتابة
- افتح أدوات المطور (F12) وتحقق من الأخطاء في Console

## الميزات المتاحة

- ✅ إضافة وظائف جديدة
- ✅ تحديث حالة الوظيفة (تم التقديم، قيد الانتظار، مقابلة، مقبول، مرفوض)
- ✅ حذف الوظائف
- ✅ تصفية الوظائف حسب الحالة
- ✅ عرض إحصائيات شاملة
- ✅ واجهة عربية كاملة
- ✅ تحديث فوري للبيانات (Real-time)

## نصائح مهمة

1. **الخصوصية**: لا تشارك مفاتيح Firebase العامة مع أحد
2. **النسخ الاحتياطية**: قم بتصدير بيانات Firestore بانتظام
3. **المراقبة**: استخدم Firebase Console لمراقبة استخدام قاعدة البيانات
4. **التطوير**: استخدم Firebase Emulator للاختبار المحلي

## المساعدة والدعم

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Console](https://console.firebase.google.com/)

---

**ملاحظة**: هذا التطبيق مصمم للاستخدام الشخصي. إذا كنت تريد استخدامه لأغراض تجارية، تأكد من اتباع سياسات الخصوصية والأمان المناسبة.
