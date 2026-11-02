const CFG = window.ILOGIA_CONFIG;
// الصيغة الفعلية لأرقام الشهادات في ilogia-eg.com: ILG-2026-XXXXXXXXXXXX
const ID_RE = /^ILG-\d{4}-[A-Z0-9]{12}$/;
const MSG = {VALID:"شهادة صحيحة",REVOKED:"شهادة ملغاة",EXPIRED:"شهادة منتهية",NOT_FOUND:"الشهادة غير موجودة",ERROR:"تعذر إجراء التحقق حاليًا"};

function extractId(text){ // يقبل رقم الشهادة أو رابط التحقق (QR) ويأخذ الرقم فقط. يدعم ?id= و ?c= (الصيغة المطبوعة من الموقع الرئيسي)
  text = (text||"").trim();
  try{ const u = new URL(text); const m = u.pathname.match(/certificate(?:\.html)?\/?([^/]*)$/);
    return (u.searchParams.get("id") || u.searchParams.get("c") || (m&&m[1]) || "").trim().toUpperCase(); }
  catch(e){ return text.toUpperCase(); }
}
function goVerify(raw, errEl){
  const id = extractId(raw);
  if(!ID_RE.test(id)){ errEl.textContent="رقم الشهادة غير صالح. الصيغة: ILG-2026-XXXXXXXXXXXX"; return; }
  location.href = "certificate.html?id=" + encodeURIComponent(id);
}
// التحقق دايمًا من الـ Backend (الدالة الموجودة فعلًا: verify_certificate(p_serial) وبترجع صفوف). لا توجد بيانات تجريبية.
// الدالة بتحوّل الصف الحقيقي للشكل اللي certificate.html بيعرضه.
async function verifyCertificate(id){
  if(!CFG.SUPABASE_URL||!CFG.SUPABASE_ANON_KEY) return {status:"ERROR"};
  try{
    const r = await fetch(CFG.SUPABASE_URL+"/rest/v1/rpc/verify_certificate",{method:"POST",
      headers:{"Content-Type":"application/json",apikey:CFG.SUPABASE_ANON_KEY,Authorization:"Bearer "+CFG.SUPABASE_ANON_KEY},
      body:JSON.stringify({p_serial:id})});
    if(!r.ok) return {status:"ERROR"};
    const data = await r.json();
    const row = Array.isArray(data) ? data[0] : data;
    if(!row) return {status:"NOT_FOUND"};
    if(row.revoked) return {status:"REVOKED"};
    return {
      status:"VALID",
      student_name: row.student_name,
      course_title: [row.subject_name, row.grade_name, row.term].filter(Boolean).join(" — "),
      certificate_type: "شهادة إتمام",
      issue_date: row.issued_at,
      completion_date: null,
      issuer: row.site_name || "ilogia",
      verified_at: new Date().toISOString()
    };
  }catch(e){ return {status:"ERROR"}; }
}
