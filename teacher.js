const API_BASE = "https://fengmugong-registration-api.b10211147.chatgpt.site";
const $ = (s) => document.querySelector(s);
const stems = [..."甲乙丙丁戊己庚辛壬癸"];
const branches = [..."子丑寅卯辰巳午未申酉戌亥"];
const branchElement = {子:"水",丑:"土",寅:"木",卯:"木",辰:"土",巳:"火",午:"火",未:"土",申:"金",酉:"金",戌:"土",亥:"水"};
const trigramBits = {乾:"111",兌:"110",離:"101",震:"100",巽:"011",坎:"010",艮:"001",坤:"000"};
const trigramElement = {乾:"金",兌:"金",離:"火",震:"木",巽:"木",坎:"水",艮:"土",坤:"土"};
const hexNames = {
  乾:{乾:"乾為天",兌:"天澤履",離:"天火同人",震:"天雷無妄",巽:"天風姤",坎:"天水訟",艮:"天山遯",坤:"天地否"},
  兌:{乾:"澤天夬",兌:"兌為澤",離:"澤火革",震:"澤雷隨",巽:"澤風大過",坎:"澤水困",艮:"澤山咸",坤:"澤地萃"},
  離:{乾:"火天大有",兌:"火澤睽",離:"離為火",震:"火雷噬嗑",巽:"火風鼎",坎:"火水未濟",艮:"火山旅",坤:"火地晉"},
  震:{乾:"雷天大壯",兌:"雷澤歸妹",離:"雷火豐",震:"震為雷",巽:"雷風恆",坎:"雷水解",艮:"雷山小過",坤:"雷地豫"},
  巽:{乾:"風天小畜",兌:"風澤中孚",離:"風火家人",震:"風雷益",巽:"巽為風",坎:"風水渙",艮:"風山漸",坤:"風地觀"},
  坎:{乾:"水天需",兌:"水澤節",離:"水火既濟",震:"水雷屯",巽:"水風井",坎:"坎為水",艮:"水山蹇",坤:"水地比"},
  艮:{乾:"山天大畜",兌:"山澤損",離:"山火賁",震:"山雷頤",巽:"山風蠱",坎:"山水蒙",艮:"艮為山",坤:"山地剝"},
  坤:{乾:"地天泰",兌:"地澤臨",離:"地火明夷",震:"地雷復",巽:"地風升",坎:"地水師",艮:"地山謙",坤:"坤為地"}
};
const naJia = {
  乾:{inner:{stem:"甲",branches:["子","寅","辰"]},outer:{stem:"壬",branches:["午","申","戌"]}},
  坤:{inner:{stem:"乙",branches:["未","巳","卯"]},outer:{stem:"癸",branches:["丑","亥","酉"]}},
  震:{inner:{stem:"庚",branches:["子","寅","辰"]},outer:{stem:"庚",branches:["午","申","戌"]}},
  巽:{inner:{stem:"辛",branches:["丑","亥","酉"]},outer:{stem:"辛",branches:["未","巳","卯"]}},
  坎:{inner:{stem:"戊",branches:["寅","辰","午"]},outer:{stem:"戊",branches:["申","戌","子"]}},
  離:{inner:{stem:"己",branches:["卯","丑","亥"]},outer:{stem:"己",branches:["酉","未","巳"]}},
  艮:{inner:{stem:"丙",branches:["辰","午","申"]},outer:{stem:"丙",branches:["戌","子","寅"]}},
  兌:{inner:{stem:"丁",branches:["巳","卯","丑"]},outer:{stem:"丁",branches:["亥","酉","未"]}}
};
const palacePatterns = [
  {flips:[],stage:"本宮",shi:6},{flips:[1],stage:"一世",shi:1},{flips:[1,2],stage:"二世",shi:2},
  {flips:[1,2,3],stage:"三世",shi:3},{flips:[1,2,3,4],stage:"四世",shi:4},{flips:[1,2,3,4,5],stage:"五世",shi:5},
  {flips:[1,2,3,5],stage:"遊魂",shi:4},{flips:[5],stage:"歸魂",shi:3}
];
const elementGenerates = {木:"火",火:"土",土:"金",金:"水",水:"木"};
const elementControls = {木:"土",土:"水",水:"火",火:"金",金:"木"};
const sixGods = ["青龍","朱雀","勾陳","螣蛇","白虎","玄武"];
const godStart = {甲:0,乙:0,丙:1,丁:1,戊:2,己:3,庚:4,辛:4,壬:5,癸:5};
const lineLabels = ["初","二","三","四","五","上"];
let password = sessionStorage.getItem("teacherPassword") || "";
let currentResult = null;

function trigramFromBits(bits) { return Object.keys(trigramBits).find((key) => trigramBits[key] === bits); }
function getHexagram(lines) {
  const lower = trigramFromBits(lines.slice(0,3).join(""));
  const upper = trigramFromBits(lines.slice(3,6).join(""));
  return { lower, upper, name: hexNames[upper][lower] };
}
function getPalace(lines) {
  for (const palace of Object.keys(trigramBits)) {
    const pure = (trigramBits[palace] + trigramBits[palace]).split("").map(Number);
    for (const pattern of palacePatterns) {
      const candidate = pure.map((bit,i) => pattern.flips.includes(i+1) ? 1-bit : bit);
      if (candidate.every((bit,i) => bit === lines[i])) return {palace, element:trigramElement[palace], ...pattern, ying:((pattern.shi+2)%6)+1};
    }
  }
}
function getNaJia(lines) {
  const hex = getHexagram(lines);
  return lines.map((_,i) => {
    const part = i < 3 ? naJia[hex.lower].inner : naJia[hex.upper].outer;
    const index = i < 3 ? i : i-3;
    const branch = part.branches[index];
    return {stem:part.stem, branch, element:branchElement[branch]};
  });
}
function relativeFor(lineElement,palaceElement) {
  if (lineElement === palaceElement) return "兄弟";
  if (elementGenerates[lineElement] === palaceElement) return "父母";
  if (elementGenerates[palaceElement] === lineElement) return "子孫";
  if (elementControls[lineElement] === palaceElement) return "官鬼";
  return "妻財";
}
function strengthFor(element,monthBranch) {
  const monthElement = branchElement[monthBranch];
  if (element === monthElement) return "旺";
  if (elementGenerates[monthElement] === element) return "相";
  if (elementGenerates[element] === monthElement) return "休";
  if (elementControls[element] === monthElement) return "囚";
  return "死";
}
function showToast(text) { const t=$("#toast");t.textContent=text;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2300); }
function authHeaders() { return {"Content-Type":"application/json","Authorization":`Bearer ${password}`}; }
function setupInputs() {
  const now = new Date(); now.setMinutes(now.getMinutes()-now.getTimezoneOffset());
  $('[name="castTime"]').value = now.toISOString().slice(0,16);
  $('[name="monthBranch"]').innerHTML = branches.map(v=>`<option>${v}</option>`).join("");
  $('[name="dayStem"]').innerHTML = stems.map(v=>`<option>${v}</option>`).join("");
  $('[name="dayBranch"]').innerHTML = branches.map(v=>`<option>${v}</option>`).join("");
  $("#lineInputs").innerHTML = lineLabels.map((label,i)=>`<div class="line-input"><label>${label}爻<select name="line${i+1}"><option value="7">7 少陽 ⚊</option><option value="8">8 少陰 ⚋</option><option value="9">9 老陽 ○</option><option value="6">6 老陰 ×</option></select></label></div>`).join("");
}
function calculate(data) {
  const values = Array.from({length:6},(_,i)=>Number(data[`line${i+1}`]));
  const lines = values.map(v => v === 7 || v === 9 ? 1 : 0);
  const changedLines = values.map((v,i) => v === 6 || v === 9 ? 1-lines[i] : lines[i]);
  const hex = getHexagram(lines), changedHex = getHexagram(changedLines), palace=getPalace(lines);
  const najia=getNaJia(lines), changedNajia=getNaJia(changedLines);
  const gods = lines.map((_,i)=>sixGods[(godStart[data.dayStem]+i)%6]);
  const rows = lines.map((yang,i)=>({
    position:i+1, yang, value:values[i], moving:values[i]===6||values[i]===9,
    god:gods[i], ...najia[i], relative:relativeFor(najia[i].element,palace.element),
    strength:strengthFor(najia[i].element,data.monthBranch),
    shiYing:palace.shi===i+1?"世":palace.ying===i+1?"應":"",
    changedYang:changedLines[i], changedNaJia:changedNajia[i],
    lineTitle:`${i===0?"初":i===5?"上":lineLabels[i]}${yang?"九":"六"}`
  }));
  return {input:data,values,hex,changedHex,palace,rows};
}
function renderResult(result) {
  currentResult=result;
  $("#resultView").hidden=false;
  $("#mainHexagram").textContent=result.hex.name;
  $("#changedHexagram").textContent=result.changedHex.name;
  $("#resultMeta").textContent=`${result.input.castTime.replace("T"," ")}・${result.input.question}・${result.palace.palace}宮 ${result.palace.stage}`;
  $("#strengthSummary").innerHTML=[`月建 ${result.input.monthBranch}`,`日辰 ${result.input.dayStem}${result.input.dayBranch}`,`旬空 ${result.input.voidBranches||"未填"}`,`世爻 ${result.palace.shi}`,`應爻 ${result.palace.ying}`,`用神 ${result.input.useGod||"未指定"}`].map(x=>`<span>${x}</span>`).join("");
  $("#hexagramRows").innerHTML=[...result.rows].reverse().map(row=>`<tr class="${row.moving?"moving":""} ${result.input.useGod===row.relative?"use-god":""}">
    <td>${row.god}</td><td>${row.relative}${result.input.useGod===row.relative?"・用":""}</td><td>${row.stem}${row.branch}${row.element}</td><td>${row.strength}</td><td>${row.shiYing}</td>
    <td><span class="yao"><i class="${row.yang?"yang":"yin"}"></i>${row.moving?`<b class="move">${row.value===9?"○":"×"}</b>`:""}</span></td>
    <td>${row.moving?`${row.changedNaJia.stem}${row.changedNaJia.branch}${row.changedNaJia.element}・${row.changedYang?"陽":"陰"}`:"—"}</td></tr>`).join("");
  const useRows=result.rows.filter(r=>r.relative===result.input.useGod);
  $("#useGodAnalysis").innerHTML=result.input.useGod
    ? `<p>指定「${result.input.useGod}」為用神，共見於 ${useRows.length} 爻：${useRows.map(r=>`${r.position}爻（${r.stem}${r.branch}${r.element}・${r.strength}${r.moving?"・動":""}）`).join("、")||"不上卦，需再查伏神"}。</p>`
    : "<p>尚未指定用神。請依占問類別與實際取象，由老師選定後再看旺衰、生剋與動變。</p>";
  const moving=result.rows.filter(r=>r.moving);
  $("#movingAnalysis").innerHTML=moving.length
    ? `<ul>${moving.map(r=>`<li>${r.position}爻・${r.lineTitle}：${r.relative}${r.stem}${r.branch}${r.element}，變 ${r.changedNaJia.stem}${r.changedNaJia.branch}${r.changedNaJia.element}。請對照《周易》「${result.hex.name}」${r.lineTitle}爻辭。</li>`).join("")}</ul>`
    : "<p>本卦無動爻，以本卦、世用及月日生剋為主要觀察。</p>";
  $("#resultNotes").textContent=result.input.notes||"尚未填寫老師筆記。";
  $("#resultView").scrollIntoView({behavior:"smooth",block:"start"});
}
function resultText(result) {
  const lines=[`【奉母宮六爻排盤】`,`占問：${result.input.question}`,`求占者：${result.input.clientName||"未填"}`,`起卦：${result.input.castTime.replace("T"," ")}`,`月建：${result.input.monthBranch}　日辰：${result.input.dayStem}${result.input.dayBranch}　旬空：${result.input.voidBranches||"未填"}`,`本卦：${result.hex.name}　→　變卦：${result.changedHex.name}`,`${result.palace.palace}宮・${result.palace.stage}　世${result.palace.shi} 應${result.palace.ying}`,``];
  [...result.rows].reverse().forEach(r=>lines.push(`${r.god}　${r.relative}　${r.stem}${r.branch}${r.element}　${r.strength}　${r.shiYing||"　"}　${r.yang?"━━━":"━ ━"}${r.moving?` ${r.value===9?"○":"×"} → ${r.changedNaJia.stem}${r.changedNaJia.branch}${r.changedNaJia.element}`:""}`));
  lines.push("",`用神：${result.input.useGod||"未指定"}`,`老師筆記：${result.input.notes||"無"}`);
  return lines.join("\n");
}
async function loadCases() {
  const res=await fetch(`${API_BASE}/api/teacher/cases`,{headers:authHeaders()});
  if(!res.ok) throw new Error("老師密碼不正確");
  const cases=await res.json();
  $("#caseList").innerHTML=cases.length?cases.map(c=>`<article class="case-card"><div><h3>${c.question}</h3><p>${c.clientName||"未填姓名"}・${c.hexagramName} → ${c.changedHexagramName}・${new Date(c.createdAt).toLocaleString("zh-TW")}</p></div><button class="ghost" data-case="${c.id}">開啟排盤</button></article>`).join(""):'<div class="empty">尚未儲存任何案例</div>';
  document.querySelectorAll("[data-case]").forEach(btn=>btn.addEventListener("click",()=>{const item=cases.find(c=>c.id===btn.dataset.case);renderResult(item.data);document.querySelector('[data-panel="castingPanel"]').click();}));
}
async function login(pass) {
  password=pass;
  const res=await fetch(`${API_BASE}/api/teacher/cases`,{headers:authHeaders()});
  if(!res.ok) throw new Error("老師密碼不正確");
  sessionStorage.setItem("teacherPassword",password);
  $("#loginView").hidden=true;$("#toolView").hidden=false;$("#logoutBtn").hidden=false;
  await loadCases();
}
$("#loginForm").addEventListener("submit",async e=>{e.preventDefault();$("#loginError").textContent="";try{await login(new FormData(e.currentTarget).get("password"));}catch(err){$("#loginError").textContent=err.message;}});
$("#logoutBtn").addEventListener("click",()=>{sessionStorage.removeItem("teacherPassword");location.reload();});
document.querySelectorAll(".tool-tabs button").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".tool-tabs button").forEach(b=>b.classList.toggle("active",b===btn));["castingPanel","historyPanel"].forEach(id=>$("#"+id).hidden=id!==btn.dataset.panel);if(btn.dataset.panel==="historyPanel")loadCases().catch(e=>showToast(e.message));}));
$("#castingForm").addEventListener("submit",e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.currentTarget));renderResult(calculate(data));});
$("#copyBtn").addEventListener("click",async()=>{await navigator.clipboard.writeText(resultText(currentResult));showToast("排盤已複製");});
$("#saveBtn").addEventListener("click",async()=>{if(!currentResult)return;const res=await fetch(`${API_BASE}/api/teacher/cases`,{method:"POST",headers:authHeaders(),body:JSON.stringify({question:currentResult.input.question,clientName:currentResult.input.clientName,hexagramName:currentResult.hex.name,changedHexagramName:currentResult.changedHex.name,data:currentResult})});const body=await res.json();if(!res.ok)return showToast(body.error||"儲存失敗");showToast(`案例已儲存：${body.id}`);await loadCases();});
setupInputs();
if(password)login(password).catch(()=>sessionStorage.removeItem("teacherPassword"));
