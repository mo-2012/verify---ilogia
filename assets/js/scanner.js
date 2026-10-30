let scanner=null;
function startScan(onText,errEl){
  const area=document.getElementById("scanArea");
  if(!window.Html5Qrcode){errEl.textContent="تعذر تحميل ماسح QR. أدخل رقم الشهادة يدويًا.";return;}
  area.style.display="block";
  scanner=new Html5Qrcode("reader");
  scanner.start({facingMode:"environment"},{fps:10,qrbox:240},t=>{stopScan();onText(t);})
   .catch(()=>{area.style.display="none";errEl.textContent="لم يتم السماح بالكاميرا أو غير متاحة. أدخل رقم الشهادة يدويًا.";});
}
function stopScan(){ if(scanner){scanner.stop().catch(()=>{});scanner=null;} document.getElementById("scanArea").style.display="none"; }
