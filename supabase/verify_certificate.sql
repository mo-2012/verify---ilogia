-- مقترح فقط: راجعه على مشروع Supabase الحالي قبل التنفيذ، ولا تعدّل جداول الإنتاج بدون موافقة.
-- الجدول public.certificates يفترض وجود الأعمدة: certificate_number, student_display_name, course_title,
-- certificate_type, issue_date, completion_date, expiry_date, status ('ACTIVE'|'REVOKED')
alter table public.certificates enable row level security;  -- بدون policies عامة: لا قراءة مباشرة
create or replace function public.verify_certificate(p_id text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare c record;
begin
  if p_id !~ '^[A-Za-z0-9\-]{4,40}$' then return jsonb_build_object('status','NOT_FOUND'); end if;
  select * into c from certificates where certificate_number = p_id;
  if not found then return jsonb_build_object('status','NOT_FOUND'); end if;
  if c.status = 'REVOKED' then return jsonb_build_object('status','REVOKED'); end if;  -- بدون بيانات الطالب
  return jsonb_build_object(
    'status', case when c.expiry_date is not null and c.expiry_date < current_date then 'EXPIRED' else 'VALID' end,
    'student_name', c.student_display_name, 'course_title', c.course_title,
    'certificate_type', c.certificate_type, 'issue_date', c.issue_date,
    'completion_date', c.completion_date, 'issuer', 'iLogia', 'verified_at', now());
end $$;
revoke all on function public.verify_certificate(text) from public;
grant execute on function public.verify_certificate(text) to anon;
