# البدء السريع

دليل سريع لتشغيل متتبع وظائف LinkedIn في دقائق معدودة.

## الخطوات السريعة

### 1. إعداد Firebase (5 دقائق)

```bash
# اذهب إلى https://console.firebase.google.com/
# أنشئ مشروع جديد
# فعّل Firestore Database
# انسخ بيانات الاتصال
```

### 2. تحديث ملف Firebase

عدّل `client/src/lib/firebase.ts` وأضف بيانات اتصالك:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyDWvN2SHvvJUg0QyvRe5soR6BRgLQElxA4,
  authDomain: "job-tracker-1e476.firebaseapp.com",
  projectId: "job-tracker-1e476",
  storageBucket: "job-tracker-1e476.firebasestorage.app",
  messagingSenderId: "527529921550",
  appId: "1:527529921550:web:02fdd4e37047dc1f17005f"
};
```

### 3. تثبيت وتشغيل

```bash
# تثبيت المكتبات
npm install

# تشغيل التطبيق
npm run dev

# افتح http://localhost:3000
```

### 4. ابدأ الاستخدام

- انقر على **"إضافة وظيفة"**
- ملء النموذج
- انقر على **"إضافة الوظيفة"**
- تابع وظائفك!

## الأوامر المهمة

```bash
# التطوير المحلي
npm run dev

# بناء المشروع
npm run build

# معاينة البناء
npm run preview

# فحص TypeScript
npm run check

# تنسيق الكود
npm run format

# النشر على Firebase
firebase deploy
```

## المشاكل الشائعة

| المشكلة | الحل |
|--------|------|
| البيانات لا تحفظ | تأكد من إعدادات Firebase والتحقق من قواعد الأمان |
| الواجهة بطيئة | امسح ذاكرة التخزين المؤقت وأعد تحميل الصفحة |
| خطأ في Firebase | تحقق من استيراد Firebase وتثبيت المكتبة |

## روابط مهمة

- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [دليل الإعداد الكامل](./FIREBASE_SETUP.md)

## الخطوات التالية

بعد الإعداد الأساسي:
1. أضف بعض الوظائف التجريبية
2. جرب تحديث الحالات
3. استكشف الإحصائيات
4. اقرأ [دليل الإعداد الكامل](./FIREBASE_SETUP.md) لمزيد من الخيارات

---

**نصيحة**: احفظ رابط التطبيق بعد النشر على Firebase للوصول إليه من أي مكان!
