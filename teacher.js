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
const advanceBranch = {亥:"子",寅:"卯",巳:"午",申:"酉",丑:"辰",辰:"未",未:"戌",戌:"丑"};
const clashBranch = {子:"午",午:"子",丑:"未",未:"丑",寅:"申",申:"寅",卯:"酉",酉:"卯",辰:"戌",戌:"辰",巳:"亥",亥:"巳"};
const combineBranch = {子:"丑",丑:"子",寅:"亥",亥:"寅",卯:"戌",戌:"卯",辰:"酉",酉:"辰",巳:"申",申:"巳",午:"未",未:"午"};
const harmonyGroups = [
  {branches:["申","子","辰"],element:"水"},{branches:["亥","卯","未"],element:"木"},
  {branches:["寅","午","戌"],element:"火"},{branches:["巳","酉","丑"],element:"金"}
];
const sixGods = ["青龍","朱雀","勾陳","螣蛇","白虎","玄武"];
const sixGodMeanings = {青龍:"喜、順、享受",朱雀:"表達、消息、文書",勾陳:"拖延、穩定、土地",螣蛇:"猜疑、幻想、糾纏",白虎:"強烈、傷害、衝突",玄武:"隱藏、秘密、欺瞞"};
const yaoTextDataPromise = import("./assets/yao-texts.mjs").then(module=>module.default).catch(()=>null);
const godStart = {甲:0,乙:0,丙:1,丁:1,戊:2,己:3,庚:4,辛:4,壬:5,癸:5};
const lineLabels = ["初","二","三","四","五","上"];
const useGodOptions = ["父母","兄弟","子孫","妻財","官鬼"];
const positionMeanings = [
  "事情剛開始，條件尚未成熟，宜先觀察與準備。",
  "事情進入互動階段，重點在取得支持、建立配合。",
  "正處內外轉折，容易進退反覆，行動宜審慎。",
  "已進入外部環境，接近關鍵位置，宜掌握分寸。",
  "居於核心位置，影響力較強，宜看能否得時得位。",
  "事情發展至末段，重點在收尾、轉向或避免過度。"
];
let password = sessionStorage.getItem("teacherPassword") || "";
let currentResult = null;

function getUseGods(input={}) {
  if (Array.isArray(input.useGods)) return input.useGods.filter(Boolean);
  return input.useGod ? [input.useGod] : [];
}
function addUseGod(value="") {
  if ($("#useGodList").children.length >= useGodOptions.length) return showToast("最多可加入五個用神");
  const row=document.createElement("div");
  row.className="use-god-row";
  row.innerHTML=`<span class="use-god-order"></span><select aria-label="用神">${useGodOptions.map(x=>`<option value="${x}" ${x===value?"selected":""}>${x}</option>`).join("")}</select><span class="use-god-actions"><button type="button" data-move="-1" title="往前">↑</button><button type="button" data-move="1" title="往後">↓</button><button type="button" data-remove title="刪除">×</button></span>`;
  $("#useGodList").appendChild(row);
  refreshUseGodRows();
}
function refreshUseGodRows() {
  [...$("#useGodList").children].forEach((row,index)=>row.querySelector(".use-god-order").textContent=index+1);
}
function selectedUseGods() {
  return [...document.querySelectorAll("#useGodList select")].map(select=>select.value).filter((value,index,all)=>all.indexOf(value)===index);
}
function useGodDetails(result,useGod) {
  const visible=result.rows.filter(row=>row.relative===useGod);
  if (visible.length) return `${visible.map(row=>`${row.position}爻 ${row.stem}${row.branch}${row.element}（${row.strength}${row.moving?"、動":""}）`).join("、")}`;
  const hidden=result.hidden.filter(item=>item.relative===useGod);
  return hidden.length ? hidden.map(item=>`${item.position}爻伏 ${item.stem}${item.branch}${item.element}，飛神 ${result.rows[item.position-1].relative}${result.rows[item.position-1].stem}${result.rows[item.position-1].branch}${result.rows[item.position-1].element}`).join("；") : "本卦與伏神均未見";
}
function simpleReadingItems(result) {
  const gods=getUseGods(result.input);
  const moving=result.rows.filter(row=>row.moving);
  const items=[];
  if (gods.length) {
    gods.forEach((god,index)=>{
      const rows=result.rows.filter(row=>row.relative===god);
      const strengths=rows.map(row=>row.strength);
      const tone=strengths.includes("旺")||strengths.includes("相")?"得月令助力":strengths.includes("休")||strengths.includes("囚")||strengths.includes("死")?"月令力量偏弱":"需合看日辰與動變";
      items.push(`${index+1}. ${god}${index===0?"（主要用神）":""}：${rows.length?`${rows.length}爻上卦，${tone}`:"不上卦，需查看伏神與飛神"}`);
    });
  } else items.push("尚未指定用神，先依占問事項選定主要與次要用神。");
  if (!moving.length) items.push("本卦無動爻：現況較穩定，宜以本卦、世應與月日旺衰為主。");
  else {
    items.push(`共有 ${moving.length} 個動爻：變化集中在${moving.map(row=>`${row.position}爻`).join("、")}。`);
    const tags=moving.flatMap(row=>row.changeTags||[]);
    if (tags.length) items.push(`動變關係見「${[...new Set(tags)].join("、")}」，需再看其生剋對用神與世爻的作用。`);
  }
  const shi=result.rows[result.palace.shi-1],ying=result.rows[result.palace.ying-1];
  items.push(`世爻為${shi.relative}${shi.stem}${shi.branch}${shi.element}（${shi.strength}），應爻為${ying.relative}${ying.stem}${ying.branch}${ying.element}（${ying.strength}）；用來對照我方與對方／事情環境。`);
  const all=result.rows.flatMap(row=>allJudgments(result,row));
  const voidCount=all.filter(item=>item.label==="空亡").length;
  const brokenCount=all.filter(item=>item.label==="月破"||item.label==="日破").length;
  const hiddenMove=all.filter(item=>item.label==="暗動").length;
  if(voidCount)items.push(`本卦有 ${voidCount} 爻逢空亡：先視為作用延後或不實，再看有無填實、沖空。`);
  if(brokenCount)items.push(`有 ${brokenCount} 處月破／日破提示：相關爻的當下力量較不穩。`);
  if(hiddenMove)items.push(`有 ${hiddenMove} 爻形成暗動：外表安靜，但實際已有變化。`);
  harmonyFindings(result).forEach(item=>items.push(`${item.label}：${item.text}`));
  return items;
}
function hexagramTextRecord(data,fullName) {
  if(!data)return null;
  const normalized=fullName.replaceAll("無","无");
  return Object.entries(data).sort((a,b)=>b[0].length-a[0].length).find(([name])=>normalized.includes(name))?.[1]||null;
}
async function renderMovingLines(result) {
  const moving=result.rows.filter(row=>row.moving);
  if(!moving.length) {
    $("#movingAnalysis").innerHTML="<p>本卦無動爻，以本卦、世用及月日生剋為主要觀察。</p>";
    return;
  }
  $("#movingAnalysis").innerHTML="<p>正在載入動爻白話解釋…</p>";
  const data=await yaoTextDataPromise;
  if(currentResult!==result)return;
  const record=hexagramTextRecord(data,result.hex.name);
  $("#movingAnalysis").innerHTML=`<ul>${moving.map(row=>{
    const yao=record?.yaoTexts?.[row.position-1];
    if(yao){row.yaoText=yao.text;row.yaoTranslation=yao.translation;}
    return `<li><strong>${row.position}爻・${row.lineTitle}</strong>：${row.relative}${row.stem}${row.branch}${row.element}，變 ${row.changedNaJia.stem}${row.changedNaJia.branch}${row.changedNaJia.element}${row.changeTags.length?`，判為<strong>${row.changeTags.join("、")}</strong>`:""}。<div class="line-reading">${yao?`<b>爻辭：</b>${yao.text}<br><b>白話：</b>${yao.translation}`:`<b>白話提示：</b>${positionMeanings[row.position-1]} 此爻由${row.yang?"陽":"陰"}轉${row.changedYang?"陽":"陰"}。`}</div></li>`;
  }).join("")}</ul>`;
}

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
function changeTags(original,changed) {
  const tags=[];
  if (elementGenerates[changed.element] === original.element) tags.push("回頭生");
  if (elementControls[changed.element] === original.element) tags.push("回頭剋");
  if (original.element === changed.element && advanceBranch[original.branch] === changed.branch) tags.push("化進");
  if (original.element === changed.element && advanceBranch[changed.branch] === original.branch) tags.push("化退");
  return tags;
}
function addJudgment(items,label,text){if(!items.some(item=>item.label===label))items.push({label,text});}
function judgmentsFor(row,input) {
  const items=[];
  const month=input.monthBranch,day=input.dayBranch;
  if(row.element===branchElement[month])addJudgment(items,"臨月建","與當月五行同氣，當下力量較明顯。");
  else if(elementGenerates[branchElement[month]]===row.element)addJudgment(items,"月生","受到月建生扶，基礎力量有助。");
  else if(elementControls[branchElement[month]]===row.element)addJudgment(items,"月剋","受到月建壓制，行動較受限制。");
  if(row.element===branchElement[day])addJudgment(items,"臨日辰","與當日五行同氣，當天助力較直接。");
  else if(elementGenerates[branchElement[day]]===row.element)addJudgment(items,"日生","日辰生扶此爻，短期有支援。");
  else if(elementControls[branchElement[day]]===row.element)addJudgment(items,"日剋","日辰克制此爻，短期承受壓力。");
  if(combineBranch[row.branch]===month)addJudgment(items,"合月","與月建六合，事情容易受當月環境牽合。");
  if(combineBranch[row.branch]===day)addJudgment(items,"合日","與日辰六合，當下容易出現連結、合作或牽絆。");
  if(clashBranch[row.branch]===month)addJudgment(items,"月破","被月建沖破，整月基礎較不穩定。");
  if(clashBranch[row.branch]===day){
    addJudgment(items,"日沖","受日辰衝動，事情容易突然變化。");
    if(!row.moving&&(row.strength==="旺"||row.strength==="相"))addJudgment(items,"暗動","靜爻旺相而受日沖，表面不動、實際已在變化。");
    else if(!row.moving)addJudgment(items,"日破","靜爻休囚又受日沖，短期力量較散弱。");
  }
  if((input.voidBranches||"").includes(row.branch)){
    addJudgment(items,"空亡","此爻目前像是落空、延後或作用不實，仍須看是否填實或沖空。");
    if(row.branch===month)addJudgment(items,"填實","月建與此支相同，空亡受到填補，作用較能落實。");
    if(clashBranch[row.branch]===month||clashBranch[row.branch]===day)addJudgment(items,"沖空","空亡受到月日沖動，可能由空轉實，但仍須配合旺衰判斷。");
  }
  if(row.moving&&row.changedNaJia){
    if(combineBranch[row.branch]===row.changedNaJia.branch)addJudgment(items,"動化合","本爻與變爻六合，變化中有結合，也可能形成牽絆。");
    if(clashBranch[row.branch]===row.changedNaJia.branch)addJudgment(items,"動化沖","本爻與變爻相沖，前後狀態衝突、變化較急。");
    (row.changeTags||[]).forEach(tag=>{
      const text={回頭生:"變爻回來生扶本爻，動後力量得到補充。",回頭剋:"變爻回來克制本爻，動後反受壓力。",化進:"同五行向前推進，事情有漸強、向前之象。",化退:"同五行向後退轉，事情有減弱、退縮之象。"}[tag];
      addJudgment(items,tag,text);
    });
  }
  return items;
}
function harmonyFindings(result) {
  const active=new Set([result.input.monthBranch,result.input.dayBranch]);
  result.rows.forEach(row=>{if(row.moving){active.add(row.branch);active.add(row.changedNaJia.branch);}});
  return harmonyGroups.filter(group=>group.branches.every(branch=>active.has(branch))).map(group=>({
    label:`${group.branches.join("")}三合${group.element}局`,
    text:`月日與動變支已湊齊三支，顯示${group.element}氣集中；是否真正成局，仍須合看空破、受剋與動爻力量。`
  }));
}
function allJudgments(result,row) {
  const items=judgmentsFor(row,result.input);
  result.rows.filter(other=>other.position!==row.position).forEach(other=>{
    if(combineBranch[row.branch]===other.branch)addJudgment(items,"卦內六合",`與${other.position}爻${other.branch}六合，兩個層面容易互相連結，也可能彼此牽制。`);
    if(clashBranch[row.branch]===other.branch)addJudgment(items,"卦內六沖",`與${other.position}爻${other.branch}相沖，兩個層面立場或節奏容易衝突。`);
  });
  return items;
}
function showToast(text) { const t=$("#toast");t.textContent=text;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2300); }
function authHeaders() { return {"Content-Type":"application/json","Authorization":`Bearer ${password}`}; }
function calendarFromSolar(value) {
  if (!value || typeof Solar === "undefined") return null;
  const [date,time="00:00"] = value.split("T");
  const [year,month,day] = date.split("-").map(Number);
  const [hour,minute] = time.split(":").map(Number);
  const lunar = Solar.fromYmdHms(year,month,day,hour,minute,0).getLunar();
  const monthGanZhi = lunar.getMonthInGanZhiExact();
  const dayGanZhi = lunar.getDayInGanZhiExact2();
  return {
    monthGanZhi,
    monthBranch: monthGanZhi.slice(1),
    dayGanZhi,
    dayStem: dayGanZhi.slice(0,1),
    dayBranch: dayGanZhi.slice(1),
    voidBranches: lunar.getDayXunKongExact2()
  };
}
function updateCalendarPreview() {
  const calendar = calendarFromSolar($('[name="castTime"]').value);
  $("#calendarPreview").textContent = calendar ? `月柱 ${calendar.monthGanZhi}（月建 ${calendar.monthBranch}）・日辰 ${calendar.dayGanZhi}・旬空 ${calendar.voidBranches}` : "請選擇有效的國曆時間";
}
function setupInputs() {
  const now = new Date(); now.setMinutes(now.getMinutes()-now.getTimezoneOffset());
  $('[name="castTime"]').value = now.toISOString().slice(0,16);
  updateCalendarPreview();
}
function calculate(data) {
  const calendar = calendarFromSolar(data.castTime);
  if (!calendar) throw new Error("無法換算起卦時間");
  Object.assign(data,calendar);
  const values = data.castCode.split("").map(Number);
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
    changeTags:values[i]===6||values[i]===9 ? changeTags(najia[i],changedNajia[i]) : [],
    lineTitle:`${i===0?"初":i===5?"上":lineLabels[i]}${yang?"九":"六"}`
  }));
  const visibleRelatives=new Set(rows.map(row=>row.relative));
  const pureLines=(trigramBits[palace.palace]+trigramBits[palace.palace]).split("").map(Number);
  const pureNaJia=getNaJia(pureLines);
  const hidden=pureNaJia.map((item,i)=>({...item,position:i+1,relative:relativeFor(item.element,palace.element)})).filter(item=>!visibleRelatives.has(item.relative));
  rows.forEach(row=>{row.fushen=hidden.filter(item=>item.position===row.position);});
  return {input:data,values,hex,changedHex,palace,rows,hidden};
}
function renderResult(result) {
  result.hidden ||= [];
  result.rows.forEach(row=>{row.changeTags ||= [];row.fushen ||= [];});
  result.input.useGods=getUseGods(result.input);
  result.input.useGod=result.input.useGods[0]||"";
  currentResult=result;
  $("#resultView").hidden=false;
  $("#mainHexagram").textContent=result.hex.name;
  $("#changedHexagram").textContent=result.changedHex.name;
  $("#resultMeta").textContent=`${result.input.castTime.replace("T"," ")}・${result.input.question}・${result.palace.palace}宮 ${result.palace.stage}`;
  const useGods=getUseGods(result.input);
  $("#strengthSummary").innerHTML=[`月建 ${result.input.monthBranch}`,`日辰 ${result.input.dayStem}${result.input.dayBranch}`,`旬空 ${result.input.voidBranches||"未填"}`,`世爻 ${result.palace.shi}`,`應爻 ${result.palace.ying}`,`用神 ${useGods.length?useGods.map((god,index)=>`${index+1}.${god}`).join(" → "):"未指定"}`].map(x=>`<span>${x}</span>`).join("");
  $("#hexagramRows").innerHTML=[...result.rows].reverse().map(row=>`<tr class="${row.moving?"moving":""} ${useGods.includes(row.relative)?"use-god":""}">
    <td title="${sixGodMeanings[row.god]}">${row.god}<br><small>${sixGodMeanings[row.god]}</small></td><td>${row.relative}${useGods.includes(row.relative)?`・用${useGods.indexOf(row.relative)+1}`:""}</td><td>${row.stem}${row.branch}${row.element}</td><td>${row.strength}</td><td><div class="judgment-tags">${allJudgments(result,row).map(item=>`<b title="${item.text}">${item.label}</b>`).join("")||"—"}</div></td><td>${row.shiYing}</td>
    <td><span class="yao"><i class="${row.yang?"yang":"yin"}"></i>${row.moving?`<b class="move">${row.value===9?"○":"×"}</b>`:""}</span></td>
    <td>${row.moving?`${row.changedNaJia.stem}${row.changedNaJia.branch}${row.changedNaJia.element}・${row.changedYang?"陽":"陰"}${row.changeTags.length?`<br><b>${row.changeTags.join("・")}</b>`:""}`:"—"}</td>
    <td>${row.fushen.length?row.fushen.map(f=>`伏：${f.relative}${f.stem}${f.branch}${f.element}<br>飛：${row.relative}${row.stem}${row.branch}${row.element}`).join("<br>"):"—"}</td></tr>`).join("");
  $("#useGodAnalysis").innerHTML=useGods.length
    ? `<ol class="reading-list">${useGods.map((god,index)=>`<li><strong>${god}${index===0?"（主要）":""}</strong>：${useGodDetails(result,god)}</li>`).join("")}</ol>`
    : "<p>尚未指定用神。請依占問類別與實際取象，由老師選定後再看旺衰、生剋與動變。</p>";
  $("#simpleReading").innerHTML=`<ul class="reading-list">${simpleReadingItems(result).map(item=>`<li>${item}</li>`).join("")}</ul><p class="reading-note">這是快速整理，不是最終吉凶；仍需合看日辰、空破、合沖、生剋與占問背景。</p>`;
  $("#lineJudgmentGuide").innerHTML=`<div class="line-judgment-list">${[...result.rows].reverse().map(row=>{
    const items=allJudgments(result,row);
    return `<section><h4>${row.position}爻・${row.relative}${row.stem}${row.branch}${row.element}${row.shiYing?`・${row.shiYing}`:""}</h4>${items.length?items.map(item=>`<p><b>${item.label}</b>：${item.text}</p>`).join(""):"<p>目前未見明顯月日、合沖或空亡標記。</p>"}</section>`;
  }).join("")}${harmonyFindings(result).map(item=>`<section class="harmony"><h4>${item.label}</h4><p>${item.text}</p></section>`).join("")}</div>`;
  $("#sixGodGuide").innerHTML=`<div class="six-god-guide">${sixGods.map(god=>`<span><b>${god}</b>${sixGodMeanings[god]}</span>`).join("")}</div>`;
  renderMovingLines(result);
  $("#resultNotes").textContent=result.input.notes||"尚未填寫老師筆記。";
  $("#resultView").scrollIntoView({behavior:"smooth",block:"start"});
}
function resultText(result) {
  const lines=[`【奉母宮六爻排盤】`,`占問：${result.input.question}`,`求占者：${result.input.clientName||"未填"}`,`起卦：${result.input.castTime.replace("T"," ")}`,`月建：${result.input.monthBranch}　日辰：${result.input.dayStem}${result.input.dayBranch}　旬空：${result.input.voidBranches||"未填"}`,`本卦：${result.hex.name}　→　變卦：${result.changedHex.name}`,`${result.palace.palace}宮・${result.palace.stage}　世${result.palace.shi} 應${result.palace.ying}`,``];
  [...result.rows].reverse().forEach(r=>lines.push(`${r.god}　${r.relative}　${r.stem}${r.branch}${r.element}　${r.strength}　${r.shiYing||"　"}　${r.yang?"━━━":"━ ━"}${r.moving?` ${r.value===9?"○":"×"} → ${r.changedNaJia.stem}${r.changedNaJia.branch}${r.changedNaJia.element}${r.changeTags.length?`（${r.changeTags.join("、")}）`:""}`:""}${r.fushen.length?`　伏神：${r.fushen.map(f=>`${f.relative}${f.stem}${f.branch}${f.element}`).join("、")}／飛神：${r.relative}${r.stem}${r.branch}${r.element}`:""}　判別：${allJudgments(result,r).map(item=>item.label).join("、")||"無"}`));
  lines.push("",`用神順序：${getUseGods(result.input).map((god,index)=>`${index+1}.${god}`).join(" → ")||"未指定"}`,"【簡易判讀】",...simpleReadingItems(result));
  const moving=result.rows.filter(row=>row.moving);
  if(moving.length) lines.push("","【動爻爻辭白話】",...moving.map(row=>`${row.position}爻・${row.lineTitle}：${row.yaoText?`${row.yaoText}｜${row.yaoTranslation}`:positionMeanings[row.position-1]}`));
  lines.push("","【逐爻判別白話】",...[...result.rows].reverse().flatMap(row=>allJudgments(result,row).map(item=>`${row.position}爻 ${item.label}：${item.text}`)),...harmonyFindings(result).map(item=>`${item.label}：${item.text}`));
  lines.push("","【六神簡義】",...sixGods.map(god=>`${god}：${sixGodMeanings[god]}`));
  lines.push("",`老師筆記：${result.input.notes||"無"}`);
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
$("#castingForm").addEventListener("submit",e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.currentTarget));data.useGods=selectedUseGods();data.useGod=data.useGods[0]||"";try{renderResult(calculate(data));}catch(error){showToast(error.message||"排盤資料有誤");}});
$("#copyBtn").addEventListener("click",async()=>{await navigator.clipboard.writeText(resultText(currentResult));showToast("排盤已複製");});
$("#saveBtn").addEventListener("click",async()=>{if(!currentResult)return;const res=await fetch(`${API_BASE}/api/teacher/cases`,{method:"POST",headers:authHeaders(),body:JSON.stringify({question:currentResult.input.question,clientName:currentResult.input.clientName,hexagramName:currentResult.hex.name,changedHexagramName:currentResult.changedHex.name,data:currentResult})});const body=await res.json();if(!res.ok)return showToast(body.error||"儲存失敗");showToast(`案例已儲存：${body.id}`);await loadCases();});
setupInputs();
addUseGod("妻財");
$("#addUseGodBtn").addEventListener("click",()=>addUseGod());
$("#useGodList").addEventListener("click",event=>{
  const button=event.target.closest("button");
  if(!button)return;
  const row=button.closest(".use-god-row");
  if(button.hasAttribute("data-remove")){
    if($("#useGodList").children.length===1)return showToast("至少保留一個用神欄位");
    row.remove();
  }else{
    const direction=Number(button.dataset.move);
    const sibling=direction<0?row.previousElementSibling:row.nextElementSibling;
    if(sibling)$("#useGodList").insertBefore(direction<0?row:sibling,direction<0?sibling:row);
  }
  refreshUseGodRows();
});
$('[name="castTime"]').addEventListener("change",updateCalendarPreview);
$('[name="castCode"]').addEventListener("input",event=>{event.target.value=event.target.value.replace(/[^6789]/g,"").slice(0,6);});
if(password)login(password).catch(()=>sessionStorage.removeItem("teacherPassword"));
