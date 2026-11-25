-- Certificate Verification RPC Function
-- Aligns with frontend call in assets/js/common.js: rpc/verify_certificate({ p_serial: id })
-- Supports both parameter names: p_serial (primary) and p_id (fallback alias)

create or replace function public.verify_certificate(p_serial text default null, p_id text default null)
returns table (
  student_name text,
  subject_name text,
  grade_name text,
  term text,
  issued_at timestamptz,
  revoked boolean,
  site_name text
)
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare
  v_serial text;
begin
  -- Resolve serial parameter
  v_serial := coalesce(nullif(btrim(p_serial), ''), nullif(btrim(p_id), ''));

  -- Strict format validation: alphanumeric with hyphens, 4 to 50 characters
  if v_serial is null or v_serial !~* '^[A-Za-z0-9\-]{4,50}$' then
    return;
  end if;

  return query
  select
    coalesce(c.student_display_name, c.student_name, 'طالب')::text as student_name,
    coalesce(c.course_title, c.subject_name, 'دورة تعليمية')::text as subject_name,
    coalesce(c.grade_name, '')::text as grade_name,
    coalesce(c.term, '')::text as term,
    coalesce(c.issued_at, c.issue_date, c.created_at, now())::timestamptz as issued_at,
    (coalesce(c.status, '') = 'REVOKED' or coalesce(c.revoked, false))::boolean as revoked,
    coalesce(c.issuer, 'ilogia')::text as site_name
  from public.certificates c
  where (c.certificate_number = v_serial or c.serial = v_serial)
  limit 1;
end;
$$;

revoke all on function public.verify_certificate(text, text) from public;
grant execute on function public.verify_certificate(text, text) to anon, authenticated;

-- Also provide single-parameter overload to guarantee compatibility with any client calling verify_certificate(p_serial)
create or replace function public.verify_certificate(p_serial text)
returns table (
  student_name text,
  subject_name text,
  grade_name text,
  term text,
  issued_at timestamptz,
  revoked boolean,
  site_name text
)
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
begin
  return query select * from public.verify_certificate(p_serial, null);
end;
$$;

revoke all on function public.verify_certificate(text) from public;
grant execute on function public.verify_certificate(text) to anon, authenticated;

notify pgrst, 'reload schema';
