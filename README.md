# ilogia Verify — موقع ثابت (HTML/CSS/JS)
بدون build. افتح `index.html` أو ارفع الفولدر كما هو على GitHub Pages (الدومين في ملف CNAME).

## الملفات
- `index.html` الصفحة الرئيسية (إدخال الرقم + مسح QR)
- `certificate.html?id=...` نتيجة التحقق + شهادة قابلة للطباعة A4 + QR
- `assets/js/config.js` ضع فيه SUPABASE_URL و anon key فقط
- `supabase/verify_certificate.sql` دالة التحقق المقترحة (راجعها قبل التنفيذ)

## مهم
- بدون إعداد config.js تظهر "تعذر إجراء التحقق" — لا توجد بيانات وهمية.
- لا تضع service_role في الفرونت أبدًا.
- لوحة الإدارة (إصدار/إلغاء) تحتاج Backend وتسجيل دخول حقيقي، ولم تُنفَّذ هنا.
- الـ rate limiting يتم من جهة الخادم (Supabase / Cloudflare) وليس من الفرونت.
- المكتبات (خط Cairo، html5-qrcode، qrcodejs) تُحمَّل من CDN.
