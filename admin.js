const API="https://fengmugong-registration-api.b10211147.chatgpt.site";
let password="";
const $=s=>document.querySelector(s);
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const formatBirthday=v=>/^\d{7}$/.test(v??"")?`${v.slice(0,3)}/${v.slice(3,5)}/${v.slice(5,7)}`:String(v??"").replaceAll("-","/");

async function load(q=""){
  const r=await fetch(`${API}/api/admin/orders?q=${encodeURIComponent(q)}`,{headers:{Authorization:`Bearer ${password}`}});
  if(!r.ok)throw new Error("管理密碼不正確");
  const rows=await r.json();
  $("#count").textContent=rows.length;
  $("#orders").innerHTML=rows.length?rows.map(o=>`<article><header><b>${esc(o.name)}</b><span>${esc(o.id)}</span></header><dl><div><dt>LINE 名稱</dt><dd>${esc(o.lineDisplayName)||"—"}</dd></div><div><dt>活動</dt><dd>${esc(o.activityTitle)}</dd></div><div><dt>生日（民國）</dt><dd>${esc(formatBirthday(o.birthday))}</dd></div><div><dt>地址</dt><dd>${esc(o.address)}</dd></div><div><dt>人數</dt><dd>${esc(o.people)} 人</dd></div><div><dt>祈福姓名</dt><dd>${esc(o.prayerNames)||"—"}</dd></div><div><dt>備註</dt><dd>${esc(o.note)||"—"}</dd></div><div><dt>狀態</dt><dd>${esc(o.status)}／${esc(o.paymentStatus)}</dd></div><div><dt>報名時間</dt><dd>${new Date(o.createdAt).toLocaleString("zh-TW")}</dd></div></dl></article>`).join(""):"<p class=empty>目前沒有符合的報名資料</p>";
}

$("#loginForm").addEventListener("submit",async e=>{e.preventDefault();password=new FormData(e.currentTarget).get("password");try{await load();$("#login").hidden=true;$("#dashboard").hidden=false;$("#loginError").textContent=""}catch(err){password="";$("#loginError").textContent=err.message}});
$("#searchForm").addEventListener("submit",e=>{e.preventDefault();load(new FormData(e.currentTarget).get("q"))});
$("#logout").addEventListener("click",()=>{password="";$("#dashboard").hidden=true;$("#login").hidden=false;$("#loginForm").reset()});
