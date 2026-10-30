const CFG = window.ILOGIA_CONFIG;
const ID_RE = /^[A-Za-z0-9\-]{4,40}$/;
const MSG = {VALID:"شهادة صحيحة",REVOKED:"شهادة ملغاة",EXPIRED:"شهادة منتهية",NOT_FOUND:"الشهادة غير موجودة",ERROR:"تعذر إجراء التحقق حاليًا"};

function extractId(text){ // يقبل رقم الشهادة أو رابط التحقق (QR) ويأخذ الرقم فقط
  text = (text||"").trim();
  try{ const u = new URL(text); const m = u.pathname.match(/certificate(?:\.html)?\/?([^/]*)$/); return u.searchParams.get("id") || (m&&m[1]) || ""; }catch(e){ return text; }
}
function goVerify(raw, errEl){
  const id = extractId(raw);
  if(!ID_RE.test(id)){ errEl.textContent="رقم الشهادة غير صالح. استخدم حروفًا إنجليزية وأرقامًا وشرطات فقط."; return; }
  location.href = "certificate.html?id=" + encodeURIComponent(id);
}
// التحقق دايمًا من الـ Backend. لا توجد بيانات تجريبية.
async function verifyCertificate(id){
  if(!CFG.SUPABASE_URL||!CFG.SUPABASE_ANON_KEY) return {status:"ERROR"};
  try{
    const r = await fetch(CFG.SUPABASE_URL+"/rest/v1/rpc/verify_certificate",{method:"POST",
      headers:{"Content-Type":"application/json",apikey:CFG.SUPABASE_ANON_KEY,Authorization:"Bearer "+CFG.SUPABASE_ANON_KEY},
      body:JSON.stringify({p_id:id})});
    if(!r.ok) return {status:"ERROR"};
    const d = await r.json();
    return d && MSG[d.status] ? d : {status:"ERROR"};
  }catch(e){ return {status:"ERROR"}; }
}
