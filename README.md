# ilogia Verify — موقع ثابت (HTML/CSS/JS)
بدون build. افتح `index.html` أو ارفع الفولدر كما هو على GitHub Pages (الدومين في ملف CNAME).

## الملفات
- `index.html` الصفحة الرئيسية (إدخال الرقم + مسح QR)
- `certificate.html?id=...` نتيجة التحقق + شهادة قابلة للطباعة A4 + QR
- `assets/js/config.js` مضبوط على نفس مشروع Supabase بتاع ilogia-eg.com (publishable key فقط)
- التحقق بيستخدم الدالة الموجودة فعلًا `verify_certificate(p_serial)` ولا يحتاج أي SQL جديد

## مهم
- لو الاتصال فشل تظهر "تعذر إجراء التحقق" — لا توجد بيانات وهمية. صيغة الرقم: ILG-2026-XXXXXXXXXXXX
- لا تضع service_role في الفرونت أبدًا.
- لوحة الإدارة (إصدار/إلغاء) تحتاج Backend وتسجيل دخول حقيقي، ولم تُنفَّذ هنا.
- الـ rate limiting يتم من جهة الخادم (Supabase / Cloudflare) وليس من الفرونت.
- المكتبات (خط Cairo، html5-qrcode، qrcodejs) تُحمَّل من CDN.
