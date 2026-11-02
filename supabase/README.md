# لا يوجد SQL هنا عمدًا
الدالة `public.verify_certificate(p_serial text)` موجودة بالفعل في مشروع ilogia-eg.com (نفس قاعدة البيانات)،
وهذا الموقع يناديها كما هي. الملف القديم `verify_certificate.sql` كان بيفترض أعمدة غير موجودة
(`certificate_number`, `student_display_name`, `ACTIVE/REVOKED`) وكان سيفشل أو يكسر الدالة الشغالة، فتم حذفه.
