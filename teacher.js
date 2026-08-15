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
const yaoTextDataPromise = import("./assets/yao-texts.mjs").then(module=>module.default).catch(()=>null);
const godStart = {甲:0,乙:0,丙:1,丁:1,戊:2,己:3,庚:4,辛:4,壬:5,癸:5};
const lineLabels = ["初","二","三","四","五","上"];
const useGodOptions = ["父母","兄弟","子孫","妻財","官鬼"];
const timingRuleLabels = {auto:"自動優先",value:"動而逢值",fill:"填實／出空",combine:"逢合",clash:"逢沖",changed:"化神應期",month:"月令轉換"};
const positionMeanings = [
  "事情剛開始，條件尚未成熟，宜先觀察與準備。",
  "事情進入互動階段，重點在取得支持、建立配合。",
  "正處內外轉折，容易進退反覆，行動宜審慎。",
  "已進入外部環境，接近關鍵位置，宜掌握分寸。",
  "居於核心位置，影響力較強，宜看能否得時得位。",
  "事情發展至末段，重點在收尾、轉向或避免過度。"
];
const yaoPlainRules = [
  {match:/勿逐|不逐/,meaning:"眼前即使有所失，也不要急著追回或強求；先穩住局面，事情反而較可能自然回復。"},
  {match:/征凶|往凶/,meaning:"現在不適合硬闖、催促或擴大行動，越急著推進，越容易把問題放大。"},
  {match:/利有攸往|往有尚|征吉/,meaning:"方向大致可行，準備清楚後可以主動推進，行動比原地等待更有利。"},
  {match:/利涉大川/,meaning:"可以處理較大的事情或跨過目前障礙，但前提是準備充分，不能只靠一時衝動。"},
  {match:/有孚|孚乃|誠信/,meaning:"成敗關鍵在真誠與信任；把話說清楚、承諾做到，比技巧或強勢更有效。"},
  {match:/遲|徐徐|七日|三年|待|終/,meaning:"這件事需要時間醞釀，短期看不出結果不代表沒有進展，不宜因焦急而亂改方向。"},
  {match:/喪|失|亡|不見/,meaning:"目前可能出現失去、落空或聯繫中斷；先接受暫時缺口，再判斷是否值得挽回。"},
  {match:/得|獲|有慶|有譽|受福/,meaning:"有取得資源、成果或他人認可的機會；重點是接得住，也要避免得意後鬆懈。"},
  {match:/困|蹇|險|厲|危/,meaning:"當下確有阻力或風險，先處理限制條件與安全問題，比勉強求快更重要。"},
  {match:/婚|歸妹|妻|夫|娣|媾/,meaning:"此爻也涉及關係中的位置、承諾與配合；要先確認彼此角色是否對等、心意是否一致。"},
  {match:/言|鳴|號|告|疑/,meaning:"溝通與消息是關鍵，容易因猜測或表達不清產生誤會，宜直接確認而非自行推論。"},
  {match:/酒|食|宴|樂|兌/,meaning:"眼前的舒適或喜悅未必是壞事，但不可只顧享受而忽略真正要處理的問題。"},
  {match:/升|進|登|躋|上/,meaning:"事情有往上發展的趨勢，但每一步都要站穩；位置提升後，責任與風險也會增加。"},
  {match:/止|艮|不出|居貞/,meaning:"此時更適合停一下、守住界線或維持現況；不動不是退縮，而是避免在錯誤時機出手。"},
  {match:/雲|雨/,meaning:"條件正在累積，但尚未完全成熟；先補足欠缺的條件，等待真正能落實的時點。"},
  {match:/井|泉|汲/,meaning:"現成資源其實存在，問題在於是否整理好、能否被正確使用，以及有沒有讓需要的人取得。"},
  {match:/鼎|甕|瓶/,meaning:"要先檢查承載事情的基礎是否穩固；能力、制度或工具若有缺口，再好的資源也可能流失。"},
  {match:/車|輪|足|趾|腓|行/,meaning:"這是在提醒行動方式與基礎：先確認腳步、工具和方向，再決定是否繼續前進。"},
  {match:/門|戶|庭|宮|家/,meaning:"事情與界線、內外關係或家庭環境有關；哪些事該進、哪些人該隔開，需要分清楚。"}
];

function plainYaoAnalysis(record,yao,row) {
  const source=`${yao.text} ${yao.translation}`;
  const matched=yaoPlainRules.filter(rule=>rule.match.test(source)).slice(0,2).map(rule=>rule.meaning);
  const outcome=/無攸利/.test(source)
    ? "整體不利，暫時沒有適合強求的方向。"
    : /無不利/.test(source)
      ? "整體條件相當順，依正道處理多半能有所進展。"
      : /大吉|元吉/.test(source)
        ? "這是明顯偏吉的訊號，表示條件與方向較能互相配合。"
        : /凶/.test(source)
          ? "這是偏凶的警示，表示照目前方式繼續，很可能出現損失或反效果。"
          : /吉/.test(source)
            ? "結果偏吉，只要做法不偏離原則，事情有機會往好的方向發展。"
            : /無咎/.test(source)
              ? "重點不是保證順利，而是照此提醒調整後，可以避免把責任或問題擴大。"
              : /悔亡/.test(source)
                ? "原有的困擾仍有改善空間，及時修正做法，就能逐漸減少後悔。"
                : /吝/.test(source)
                  ? "進展會有卡頓或不舒服之處，需要收斂並修正，不能當作完全順利。"
                  : /厲/.test(source)
                    ? "局面帶有風險，可以處理，但必須提高警覺並預留退路。"
                    : "此爻沒有單純判成吉或凶，需配合用神、旺衰、世應與動變決定實際結果。";
  const guaContext=(record?.vernacularExplanation||"").split(/[。！？]/).filter(Boolean).slice(0,1).join("");
  const core=matched.length?matched.join(""):positionMeanings[row.position-1];
  const advice=/凶|厲|吝|無攸利/.test(source)
    ? `${positionMeanings[row.position-1]}先降低風險、釐清問題，再決定是否繼續。`
    : /吉|無咎|悔亡|無不利/.test(source)
      ? `${positionMeanings[row.position-1]}可依正確方法推進，但仍要留意過度與鬆懈。`
      : positionMeanings[row.position-1];
  return {
    literal:yao.translation,
    summary:`${guaContext?`放在「${guaContext}」的卦意下，` : ""}${core}${outcome}`,
    advice
  };
}
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
    const plain=yao?plainYaoAnalysis(record,yao,row):null;
    if(yao){row.yaoText=yao.text;row.yaoTranslation=`${plain.summary} 行動建議：${plain.advice}`;}
    return `<li><strong>${row.position}爻・${row.lineTitle}</strong>：${row.relative}${row.stem}${row.branch}${row.element}，變 ${row.changedNaJia.stem}${row.changedNaJia.branch}${row.changedNaJia.element}${row.changeTags.length?`，判為<strong>${row.changeTags.join("、")}</strong>`:""}。<div class="line-reading">${yao?`<p><b>原爻辭：</b>${yao.text}</p><p><b>字面翻譯：</b>${plain.literal}</p><p><b>白話解析：</b>${plain.summary}</p><p><b>行動建議：</b>${plain.advice}</p>`:`<p><b>白話解析：</b>${positionMeanings[row.position-1]} 此爻由${row.yang?"陽":"陰"}轉${row.changedYang?"陽":"陰"}。</p>`}</div></li>`;
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
  if(row.branch===month)addJudgment(items,"臨月建","爻支與月建完全相同，得到當月最直接的力量。");
  else if(row.element===branchElement[month]&&clashBranch[row.branch]!==month)addJudgment(items,"得月令","雖非同一地支，但五行與月建同氣，當月力量偏旺。");
  else if(elementGenerates[branchElement[month]]===row.element)addJudgment(items,"月生","受到月建生扶，基礎力量有助。");
  else if(elementControls[branchElement[month]]===row.element)addJudgment(items,"月剋","受到月建壓制，行動較受限制。");
  if(row.branch===day)addJudgment(items,"臨日辰","爻支與日辰完全相同，得到當日最直接的力量。");
  else if(row.element===branchElement[day]&&clashBranch[row.branch]!==day)addJudgment(items,"日辰同氣","雖非同一地支，但五行與日辰相同，當日有同氣助力。");
  else if(elementGenerates[branchElement[day]]===row.element)addJudgment(items,"日生","日辰生扶此爻，短期有支援。");
  else if(elementControls[branchElement[day]]===row.element)addJudgment(items,"日剋","日辰克制此爻，短期承受壓力。");
  if(combineBranch[row.branch]===month)addJudgment(items,"合月","與月建六合，事情容易受當月環境牽合。");
  if(combineBranch[row.branch]===day)addJudgment(items,"合日","與日辰六合，當下容易出現連結、合作或牽絆。");
  if(clashBranch[row.branch]===month)addJudgment(items,"月破","被月建沖破，整月基礎較不穩定。");
  if(clashBranch[row.branch]===day){
    addJudgment(items,"日沖","受日辰衝動，事情容易突然變化。");
    if(!row.moving&&clashBranch[row.branch]!==month&&(row.strength==="旺"||row.strength==="相"))addJudgment(items,"暗動","靜爻旺相而受日沖，表面不動、實際已在變化。");
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
  const fullClash=[0,1,2].every(index=>clashBranch[result.rows[index].branch]===result.rows[index+3].branch);
  const fullCombine=[0,1,2].every(index=>combineBranch[result.rows[index].branch]===result.rows[index+3].branch);
  const counterpart=row.position<=3?result.rows[row.position+2]:result.rows[row.position-4];
  if(fullClash)addJudgment(items,"六沖卦",`本卦三組內外爻全部相沖；此爻與${counterpart.position}爻${counterpart.branch}相沖，整體變動與分散性較強。`);
  if(fullCombine)addJudgment(items,"六合卦",`本卦三組內外爻全部六合；此爻與${counterpart.position}爻${counterpart.branch}相合，整體較有結合、維繫或牽絆之象。`);
  result.rows.filter(other=>other.position!==row.position&&(row.moving||other.moving)).forEach(other=>{
    if(combineBranch[row.branch]===other.branch)addJudgment(items,"動爻相合",`與${other.position}爻${other.branch}六合，且至少一方為動爻，表示兩個層面正在結合或互相牽制。`);
    if(clashBranch[row.branch]===other.branch)addJudgment(items,"動爻相沖",`與${other.position}爻${other.branch}相沖，且至少一方為動爻，表示衝突或變動正在發生。`);
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
function dateText(date){
  return `${date.getFullYear()}/${String(date.getMonth()+1).padStart(2,"0")}/${String(date.getDate()).padStart(2,"0")}`;
}
function dateInputText(date){
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}T12:00`;
}
function addDays(date,days){const next=new Date(date);next.setDate(next.getDate()+days);return next;}
function yearGanZhiForDate(date){
  const lunar=Solar.fromYmdHms(date.getFullYear(),date.getMonth()+1,date.getDate(),12,0,0).getLunar();
  const ganZhi=lunar.getYearInGanZhiExact();
  return {ganZhi,stem:ganZhi.slice(0,1),branch:ganZhi.slice(1)};
}
function yearBoundary(year){
  const before=yearGanZhiForDate(new Date(year,0,31)).ganZhi;
  for(let day=1;day<=10;day++){
    const date=new Date(year,1,day);
    if(yearGanZhiForDate(date).ganZhi!==before)return date;
  }
  return new Date(year,1,4);
}
function annualSegments(result,count=13){
  const center=new Date(result.input.castTime),year=center.getFullYear();
  const thisBoundary=yearBoundary(year),startYear=center>=thisBoundary?year:year-1;
  return Array.from({length:count},(_,offset)=>{
    const start=yearBoundary(startYear+offset),next=yearBoundary(startYear+offset+1),info=yearGanZhiForDate(addDays(start,1));
    return {offset,ganZhi:info.ganZhi,branch:info.branch,start:dateText(start),end:dateText(addDays(next,-1))};
  });
}
function nextAnnualBranch(result,targetBranch){return annualSegments(result,25).find(segment=>segment.branch===targetBranch)||null;}
function firstBranchDays(start,targetBranch,limit=120,count=2){
  const found=[];
  for(let offset=0;offset<=limit&&found.length<count;offset++){
    const date=addDays(start,offset),calendar=calendarFromSolar(dateInputText(date));
    if(calendar?.dayBranch===targetBranch)found.push(dateText(date));
  }
  return found;
}
function valueMonthWindow(start,targetBranch){
  let first=null;
  const current=calendarFromSolar(dateInputText(start))?.monthBranch===targetBranch;
  for(let offset=0;offset<=800;offset++){
    const date=addDays(start,offset);
    if(calendarFromSolar(dateInputText(date))?.monthBranch===targetBranch){first=date;break;}
  }
  if(!first)return null;
  let actualStart=first;
  if(current){
    for(let offset=1;offset<=40;offset++){
      const date=addDays(first,-offset);
      if(calendarFromSolar(dateInputText(date))?.monthBranch!==targetBranch)break;
      actualStart=date;
    }
  }
  let end=first;
  for(let offset=1;offset<=40;offset++){
    const date=addDays(first,offset);
    if(calendarFromSolar(dateInputText(date))?.monthBranch!==targetBranch)break;
    end=date;
  }
  return {start:dateText(actualStart),end:dateText(end),current};
}
function firstOutOfVoid(start,targetBranch){
  for(let offset=1;offset<=20;offset++){
    const date=addDays(start,offset),calendar=calendarFromSolar(dateInputText(date));
    if(calendar&&!calendar.voidBranches.includes(targetBranch))return dateText(date);
  }
  return null;
}
function timingTargets(result){
  return getUseGods(result.input).flatMap((useGod,index)=>{
    const visible=result.rows.filter(row=>row.relative===useGod);
    const source=visible.length?visible:result.hidden.filter(row=>row.relative===useGod).map(row=>({...row,moving:false,changedNaJia:null}));
    return source.map(row=>({useGod,order:index+1,row}));
  }).filter((target,index,all)=>all.findIndex(item=>item.useGod===target.useGod&&item.row.branch===target.row.branch)===index);
}
function mainTimingTarget(result){
  const candidates=timingTargets(result).filter(target=>target.order===1);
  return candidates.find(target=>target.row.moving)||candidates.find(target=>(result.input.voidBranches||"").includes(target.row.branch))||candidates[0]||null;
}
function timingForTarget(result,target){
  const start=new Date(result.input.castTime);
  const branch=target.row.branch;
  const isVoid=(result.input.voidBranches||"").includes(branch);
  const valueDays=firstBranchDays(start,branch);
  const month=valueMonthWindow(start,branch);
  const combineDays=firstBranchDays(start,combineBranch[branch],120,1);
  const clashDays=firstBranchDays(start,clashBranch[branch],120,1);
  const changed=target.row.moving&&target.row.changedNaJia?target.row.changedNaJia.branch:null;
  const changedDays=changed?firstBranchDays(start,changed,120,1):[];
  return [
    `<b>動而逢值：</b>${target.row.moving?"此用神爻正在動；":"此用神爻未動；"}值日為 ${valueDays.join("、")||"未找到"}；${month?`值月約 ${month.start}～${month.end}${month.current?"（目前正在值月）":""}`:"未找到值月"}`,
    `<b>填實／出空：</b>${isVoid?`目前空亡；<em>${valueDays[0]||"未找到"} 值日兼填實</em>，另於 ${firstOutOfVoid(start,branch)||"未找到"} 起先脫離本旬空亡`:"目前不空亡，不必只等出空；若後續論填實，可優先參考值日"}`,
    `<b>逢合、逢沖：</b>${combineBranch[branch]}日 ${combineDays[0]||"未找到"} 為逢合；${clashBranch[branch]}日 ${clashDays[0]||"未找到"} 為逢沖`,
    `<b>化神應期：</b>${changed?`此爻變${changed}，可先看 ${changedDays[0]||"未找到"}（${changed}日）`:"此用神爻未動，沒有直接化神日期"}`,
    `<b>月令轉換：</b>${month?`${month.start} 左右進入${branch}月，至 ${month.end} 左右結束`:"未找到"}`
  ];
}
function primaryTimingForTarget(result,target){
  if(result.input.readingMode==="六爻流年推演")return annualPrimaryTimingForTarget(result,target);
  const choices=timingForTarget(result,target);
  const branch=target.row.branch,start=new Date(result.input.castTime),isVoid=(result.input.voidBranches||"").includes(branch);
  const rule=result.input.timingRule||"auto";
  const manual={
    value:()=>target.row.moving?{rank:1,title:"動而逢值",html:choices[0]}:{rank:1,title:"動而逢值（條件未成立）",html:"主用神不是動爻，不能以『動而逢值』作第一優先；可改選一般月令轉換，或使用自動判定。"},
    fill:()=>isVoid?{rank:2,title:"填實／出空",html:choices[1]}:{rank:2,title:"填實／出空（條件未成立）",html:"主用神目前沒有空亡，不需要等待填實或出空。"},
    combine:()=>{const date=firstBranchDays(start,combineBranch[branch],120,1)[0];return {rank:3,title:"逢合",html:`主用神為${branch}，下一個${combineBranch[branch]}日 ${date||"未找到"} 為六合候選。`};},
    clash:()=>{const date=firstBranchDays(start,clashBranch[branch],120,1)[0];return {rank:3,title:"逢沖",html:`主用神為${branch}，下一個${clashBranch[branch]}日 ${date||"未找到"} 為相沖候選。`};},
    changed:()=>target.row.moving&&target.row.changedNaJia?{rank:4,title:"化神應期",html:choices[3]}:{rank:4,title:"化神應期（條件未成立）",html:"主用神不是動爻，沒有直接化神可供取期。"},
    month:()=>({rank:5,title:"月令轉換",html:choices[4]})
  };
  if(rule!=="auto"&&manual[rule])return manual[rule]();
  if(target.row.moving)return manual.value();
  if(isVoid)return manual.fill();
  return {rank:3,title:"逢合／逢沖",html:choices[2]};
}
function annualCandidateText(segment,label){return segment?`${label}落在 ${segment.ganZhi}年（約 ${segment.start}～${segment.end}）`:`未來24年內未找到${label}`;}
function annualPrimaryTimingForTarget(result,target){
  const branch=target.row.branch,isVoid=(result.input.voidBranches||"").includes(branch),rule=result.input.timingRule||"auto";
  const value=nextAnnualBranch(result,branch),combine=nextAnnualBranch(result,combineBranch[branch]),clash=nextAnnualBranch(result,clashBranch[branch]);
  const changed=target.row.moving&&target.row.changedNaJia?nextAnnualBranch(result,target.row.changedNaJia.branch):null;
  const manual={
    value:()=>target.row.moving?{rank:1,title:"動而逢值年",html:annualCandidateText(value,"主用神值年")}:{rank:1,title:"動而逢值年（條件未成立）",html:"主用神不是動爻，不能以動而逢值年作第一優先。"},
    fill:()=>isVoid?{rank:2,title:"太歲填實",html:annualCandidateText(value,"太歲值用神並填實")}:{rank:2,title:"太歲填實（條件未成立）",html:"主用神目前沒有空亡，不需要以流年填實為第一優先。"},
    combine:()=>({rank:3,title:"太歲逢合",html:annualCandidateText(combine,`${combineBranch[branch]}年合主用神`)}),
    clash:()=>({rank:3,title:"太歲逢沖",html:annualCandidateText(clash,`${clashBranch[branch]}年沖主用神`)}),
    changed:()=>changed?{rank:4,title:"化神值年",html:annualCandidateText(changed,`${target.row.changedNaJia.branch}化神值年`)}:{rank:4,title:"化神值年（條件未成立）",html:"主用神不是動爻，沒有化神可供流年取期。"},
    month:()=>({rank:5,title:"月令轉換（不適用）",html:"目前選擇六爻流年推演；月令轉換屬流月條件，請改選值年、太歲合沖或化神值年。"})
  };
  if(rule!=="auto"&&manual[rule])return manual[rule]();
  if(target.row.moving)return manual.value();
  if(isVoid)return manual.fill();
  const first=[combine,clash].filter(Boolean).sort((a,b)=>a.start.localeCompare(b.start))[0];
  return first===combine?manual.combine():manual.clash();
}
function flowMonthSegments(result){
  const center=new Date(result.input.castTime),start=addDays(center,-150),end=addDays(center,430),segments=[];
  for(let date=new Date(start);date<=end;date=addDays(date,1)){
    const branch=calendarFromSolar(dateInputText(date))?.monthBranch;
    const last=segments[segments.length-1];
    if(!last||last.branch!==branch)segments.push({branch,start:dateText(date),end:dateText(date)});
    else last.end=dateText(date);
  }
  const centerText=dateText(center),currentIndex=segments.findIndex(segment=>segment.start<=centerText&&segment.end>=centerText);
  return segments.slice(Math.max(0,currentIndex-3),currentIndex+13).map((segment,index)=>({...segment,offset:index-Math.min(3,currentIndex)}));
}
function monthReadingFor(result,segment,target){
  if(!target)return {label:"未指定主用神",text:"請先設定第一順位用神。"};
  const row=target.row,labels=[],texts=[];
  if(segment.branch===row.branch){labels.push("主用神值月");texts.push("主用神當令，這個月是最直接的觀察月份");}
  else if(clashBranch[row.branch]===segment.branch){labels.push("月沖／月破");texts.push("月令沖主用神，事情容易出現變動或壓力");}
  else if(combineBranch[row.branch]===segment.branch){labels.push("月合");texts.push("月令合主用神，容易出現連結、合作或牽絆");}
  else if(branchElement[segment.branch]===row.element){labels.push("得令同氣");texts.push("五行同氣，主用神力量偏旺");}
  else if(elementGenerates[branchElement[segment.branch]]===row.element){labels.push("月生用神");texts.push("月令生扶主用神，整體較有助力");}
  else if(elementControls[branchElement[segment.branch]]===row.element){labels.push("月剋用神");texts.push("月令克制主用神，推進時較有壓力");}
  else if(elementGenerates[row.element]===branchElement[segment.branch]){labels.push("用神泄氣");texts.push("主用神生月令，力量容易向外耗散");}
  else {labels.push("用神剋月");texts.push("主用神克月令，需要主動付出力量掌控局面");}
  if(row.moving&&row.changedNaJia?.branch===segment.branch){labels.push("化神值月");texts.push("變爻地支在此月當值，可留意變化落實");}
  return {label:labels.join("・"),text:texts.join("；")+"。"};
}
function renderYearTimeline(result){
  const card=$("#yearlyTimelineCard"),enabled=result.input.readingMode==="六爻流月推演"||result.input.readingMode==="流年推演";
  card.hidden=!enabled;
  if(!enabled)return;
  const target=mainTimingTarget(result),segments=flowMonthSegments(result);
  $("#yearlyTimeline").innerHTML=`<div class="year-timeline">${segments.map(segment=>{
    const reading=monthReadingFor(result,segment,target),state=segment.offset<0?"past":segment.offset===0?"current":"future";
    const title=segment.offset<0?`前${Math.abs(segment.offset)}月`:segment.offset===0?"起卦當月":`後${segment.offset}月`;
    return `<section class="month-card ${state}"><h4>${title}・${segment.branch}月</h4><small>${segment.start}～${segment.end}</small><b>${reading.label}</b><p>${reading.text}</p></section>`;
  }).join("")}</div><p class="reading-note">前3個節氣月供驗卦，起卦當月與後續12個節氣月供趨勢觀察；流月提示不等於單獨定吉凶。</p>`;
}
function annualReadingFor(result,segment,target){
  if(!target)return {label:"未指定主用神",text:"請先設定第一順位用神。"};
  const row=target.row,labels=[],texts=[];
  if(segment.branch===row.branch){labels.push("太歲值用神");texts.push("主用神值年，是長期應期的重要觀察年");if((result.input.voidBranches||"").includes(row.branch)){labels.push("太歲填實");texts.push("起卦時的空亡地支在此年得到填實");}}
  else if(clashBranch[row.branch]===segment.branch){labels.push("太歲沖用神");texts.push("流年太歲沖主用神，容易出現明顯變動或壓力");}
  else if(combineBranch[row.branch]===segment.branch){labels.push("太歲合用神");texts.push("流年太歲合主用神，容易出現合作、結合或牽絆");}
  else if(branchElement[segment.branch]===row.element){labels.push("太歲同氣");texts.push("太歲五行與主用神同氣，主用神力量偏旺");}
  else if(elementGenerates[branchElement[segment.branch]]===row.element){labels.push("太歲生用神");texts.push("流年太歲生扶主用神，長期環境較有助力");}
  else if(elementControls[branchElement[segment.branch]]===row.element){labels.push("太歲剋用神");texts.push("流年太歲克制主用神，這一年壓力較明顯");}
  else if(elementGenerates[row.element]===branchElement[segment.branch]){labels.push("用神生太歲");texts.push("主用神力量向流年環境輸出，較容易耗力");}
  else {labels.push("用神剋太歲");texts.push("主用神對流年形成制約，需要主動掌握局面");}
  if(row.moving&&row.changedNaJia?.branch===segment.branch){labels.push("化神值年");texts.push("變爻地支在此年當值，可留意變化落實");}
  return {label:labels.join("・"),text:texts.join("；")+"。"};
}
function renderAnnualTimeline(result){
  const card=$("#annualTimelineCard"),enabled=result.input.readingMode==="六爻流年推演";
  card.hidden=!enabled;if(!enabled)return;
  const target=mainTimingTarget(result),segments=annualSegments(result,13);
  $("#annualTimeline").innerHTML=`<div class="year-timeline">${segments.map(segment=>{const reading=annualReadingFor(result,segment,target);return `<section class="month-card ${segment.offset===0?"current":"future"}"><h4>${segment.offset===0?"起卦流年":`後${segment.offset}年`}・${segment.ganZhi}</h4><small>${segment.start}～${segment.end}</small><b>${reading.label}</b><p>${reading.text}</p></section>`;}).join("")}</div><p class="reading-note">本區是六爻太歲流年：從起卦流年到未來12年，只延伸本卦主用神、動變與太歲關係，不是八字大運或八字流年。</p>`;
}
function elementRelationText(a,b,aName,bName){
  if(!a||!b)return "五行關係未取得";
  if(a.element===b.element)return `${aName}與${bName}五行同氣，彼此力量容易連動`;
  if(elementGenerates[a.element]===b.element)return `${aName}生${bName}，力量由${aName}流向${bName}`;
  if(elementGenerates[b.element]===a.element)return `${bName}生${aName}，${aName}受到${bName}支持`;
  if(elementControls[a.element]===b.element)return `${aName}剋${bName}，${aName}對${bName}形成制約`;
  return `${bName}剋${aName}，${aName}受到${bName}壓力`;
}
function analysisFlowSteps(result){
  const gods=getUseGods(result.input),mainGod=gods[0];
  const visible=mainGod?result.rows.filter(row=>row.relative===mainGod):[];
  const hidden=mainGod&&!visible.length?result.hidden.filter(row=>row.relative===mainGod):[];
  const mainRows=visible.length?visible:hidden;
  const shi=result.rows[result.palace.shi-1],ying=result.rows[result.palace.ying-1];
  const moving=result.rows.filter(row=>row.moving);
  const mainSummary=mainGod
    ? `${mainGod}為第一順位主用神。${visible.length?visible.map(row=>`${row.position}爻${row.stem}${row.branch}${row.element}（${row.strength}${row.moving?"、動":""}；${allJudgments(result,row).map(item=>item.label).join("、")||"無特殊標記"}）`).join("；"):`不上本卦，伏於${hidden.map(row=>`${row.position}爻${row.stem}${row.branch}${row.element}`).join("、")||"未找到伏神"}`}。`
    :"尚未指定主用神，請先把最重要的用神排在第一順位。";
  const mainRelation=mainRows[0]?elementRelationText(mainRows[0],shi,"主用神","世爻"):"主用神與世爻關係尚無法判斷";
  const movingRelations=moving.map(row=>{
    const toMain=mainRows[0]?elementRelationText(row,mainRows[0],`${row.position}爻動爻`,"主用神"):"尚無主用神";
    return `${toMain}；${elementRelationText(row,shi,`${row.position}爻動爻`,"世爻")}`;
  }).join("。");
  const timingTarget=mainTimingTarget(result);
  const primaryTiming=timingTarget?primaryTimingForTarget(result,timingTarget):null;
  const timingSummary=primaryTiming?[`第一優先：${primaryTiming.title}`,primaryTiming.html.replace(/<[^>]+>/g,"")]:["尚無主用神，無法計算應期"];
  return [
    {title:"主用神",body:mainSummary,extra:gods.length>1?`輔助用神順序：${gods.slice(1).map((god,index)=>`${index+2}.${god}`).join(" → ")}`:"目前未設定輔助用神"},
    {title:"世爻",body:`世爻在${shi.position}爻：${shi.relative}${shi.stem}${shi.branch}${shi.element}，旺衰為${shi.strength}。${allJudgments(result,shi).map(item=>item.label).join("、")||"未見特殊標記"}。`,extra:mainRelation},
    {title:"動爻",body:moving.length?`共有${moving.length}個動爻：${moving.map(row=>`${row.position}爻${row.relative}${row.branch}→${row.changedNaJia.branch}${row.changeTags.length?`（${row.changeTags.join("、")}）`:""}`).join("；")}。`:"本卦無動爻，事情目前較偏靜態，以主用神、世應及月日為重。",extra:moving.length?movingRelations:"沒有動爻時，不強行套用化神應期。"},
    {title:"應爻",body:`應爻在${ying.position}爻：${ying.relative}${ying.stem}${ying.branch}${ying.element}，旺衰為${ying.strength}。${allJudgments(result,ying).map(item=>item.label).join("、")||"未見特殊標記"}。`,extra:elementRelationText(shi,ying,"世爻","應爻")},
    {title:"應期",body:timingSummary[0],extra:timingSummary.slice(1).join("；")}
  ];
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
  result.rows.forEach(row=>{row.changeTags ||= [];row.fushen ||= [];row.strength=strengthFor(row.element,result.input.monthBranch);});
  result.input.useGods=getUseGods(result.input);
  result.input.useGod=result.input.useGods[0]||"";
  currentResult=result;
  $("#resultView").hidden=false;
  $("#mainHexagram").textContent=result.hex.name;
  $("#changedHexagram").textContent=result.changedHex.name;
  $("#resultMeta").textContent=`${result.input.castTime.replace("T"," ")}・${result.input.question}・${result.palace.palace}宮 ${result.palace.stage}`;
  const useGods=getUseGods(result.input);
  $("#strengthSummary").innerHTML=[`月建 ${result.input.monthBranch}`,`日辰 ${result.input.dayStem}${result.input.dayBranch}`,`旬空 ${result.input.voidBranches||"未填"}`,`世爻 ${result.palace.shi}`,`應爻 ${result.palace.ying}`,`用神 ${useGods.length?useGods.map((god,index)=>`${index+1}.${god}`).join(" → "):"未指定"}`,`應期 ${timingRuleLabels[result.input.timingRule||"auto"]}`].map(x=>`<span>${x}</span>`).join("");
  $("#hexagramRows").innerHTML=[...result.rows].reverse().map(row=>`<tr class="${row.moving?"moving":""} ${useGods.includes(row.relative)?"use-god":""}">
    <td>${row.god}</td><td>${row.relative}${useGods.includes(row.relative)?`・用${useGods.indexOf(row.relative)+1}`:""}</td><td>${row.stem}${row.branch}${row.element}</td><td>${row.strength}</td><td><div class="judgment-tags">${allJudgments(result,row).map(item=>`<b title="${item.text}">${item.label}</b>`).join("")||"—"}</div></td><td>${row.shiYing}</td>
    <td><span class="yao"><i class="${row.yang?"yang":"yin"}"></i>${row.moving?`<b class="move">${row.value===9?"○":"×"}</b>`:""}</span></td>
    <td>${row.moving?`${row.changedNaJia.stem}${row.changedNaJia.branch}${row.changedNaJia.element}・${row.changedYang?"陽":"陰"}${row.changeTags.length?`<br><b>${row.changeTags.join("・")}</b>`:""}`:"—"}</td>
    <td>${row.fushen.length?row.fushen.map(f=>`伏：${f.relative}${f.stem}${f.branch}${f.element}<br>飛：${row.relative}${row.stem}${row.branch}${row.element}`).join("<br>"):"—"}</td></tr>`).join("");
  $("#useGodAnalysis").innerHTML=useGods.length
    ? `<ol class="reading-list">${useGods.map((god,index)=>`<li><strong>${god}${index===0?"（主要）":""}</strong>：${useGodDetails(result,god)}</li>`).join("")}</ol>`
    : "<p>尚未指定用神。請依占問類別與實際取象，由老師選定後再看旺衰、生剋與動變。</p>";
  $("#simpleReading").innerHTML=`<div class="analysis-flow">${analysisFlowSteps(result).map((step,index)=>`<section class="flow-step"><span class="flow-number">${index+1}</span><div><h4>${step.title}</h4><p>${step.body}</p><p class="flow-tags">${step.extra}</p></div></section>`).join("")}</div><p class="reading-note">固定依主用神、世爻、動爻、應爻、應期逐步閱讀；這是整理流程，不直接取代老師斷卦。</p>`;
  const primaryTarget=mainTimingTarget(result),primaryTiming=primaryTarget?primaryTimingForTarget(result,primaryTarget):null;
  $("#timingAnalysis").innerHTML=primaryTarget&&primaryTiming
    ? `<div class="timing-list"><section class="timing-card"><h4>第一優先・${primaryTiming.title}</h4><p>主用神 ${primaryTarget.useGod}：${primaryTarget.row.stem}${primaryTarget.row.branch}${primaryTarget.row.element}${primaryTarget.row.moving?"・動爻":""}</p><ol><li>${primaryTiming.html}</li></ol></section></div><p class="reading-note">只顯示目前條件下的第一優先應期，其餘順位不列出；日期是候選，不是保證發生日期。</p>`
    : "<p>請先指定至少一個用神，系統才能依用神地支計算值日、值月與出空。</p>";
  renderYearTimeline(result);
  renderAnnualTimeline(result);
  $("#lineJudgmentGuide").innerHTML=`<div class="line-judgment-list">${[...result.rows].reverse().map(row=>{
    const items=allJudgments(result,row);
    return `<section><h4>${row.position}爻・${row.relative}${row.stem}${row.branch}${row.element}${row.shiYing?`・${row.shiYing}`:""}</h4>${items.length?items.map(item=>`<p><b>${item.label}</b>：${item.text}</p>`).join(""):"<p>目前未見明顯月日、合沖或空亡標記。</p>"}</section>`;
  }).join("")}${harmonyFindings(result).map(item=>`<section class="harmony"><h4>${item.label}</h4><p>${item.text}</p></section>`).join("")}</div>`;
  renderMovingLines(result);
  $("#resultNotes").textContent=result.input.notes||"尚未填寫老師筆記。";
  $("#resultView").scrollIntoView({behavior:"smooth",block:"start"});
}
function resultText(result) {
  const lines=[`【奉母宮六爻排盤】`,`排盤模式：${result.input.readingMode||"單次占問"}`,`應期條件：${timingRuleLabels[result.input.timingRule||"auto"]}`,`占問：${result.input.question}`,`求占者：${result.input.clientName||"未填"}`,`起卦：${result.input.castTime.replace("T"," ")}`,`月建：${result.input.monthBranch}　日辰：${result.input.dayStem}${result.input.dayBranch}　旬空：${result.input.voidBranches||"未填"}`,`本卦：${result.hex.name}　→　變卦：${result.changedHex.name}`,`${result.palace.palace}宮・${result.palace.stage}　世${result.palace.shi} 應${result.palace.ying}`,``];
  [...result.rows].reverse().forEach(r=>lines.push(`${r.god}　${r.relative}　${r.stem}${r.branch}${r.element}　${r.strength}　${r.shiYing||"　"}　${r.yang?"━━━":"━ ━"}${r.moving?` ${r.value===9?"○":"×"} → ${r.changedNaJia.stem}${r.changedNaJia.branch}${r.changedNaJia.element}${r.changeTags.length?`（${r.changeTags.join("、")}）`:""}`:""}${r.fushen.length?`　伏神：${r.fushen.map(f=>`${f.relative}${f.stem}${f.branch}${f.element}`).join("、")}／飛神：${r.relative}${r.stem}${r.branch}${r.element}`:""}　判別：${allJudgments(result,r).map(item=>item.label).join("、")||"無"}`));
  lines.push("",`用神順序：${getUseGods(result.input).map((god,index)=>`${index+1}.${god}`).join(" → ")||"未指定"}`,"【五步分析流程】",...analysisFlowSteps(result).flatMap((step,index)=>[`${index+1}. ${step.title}：${step.body}`,`   ${step.extra}`]));
  const moving=result.rows.filter(row=>row.moving);
  if(moving.length) lines.push("","【動爻白話解析】",...moving.map(row=>`${row.position}爻・${row.lineTitle}：${row.yaoText?`${row.yaoText}｜${row.yaoTranslation}`:positionMeanings[row.position-1]}`));
  lines.push("","【逐爻判別白話】",...[...result.rows].reverse().flatMap(row=>allJudgments(result,row).map(item=>`${row.position}爻 ${item.label}：${item.text}`)),...harmonyFindings(result).map(item=>`${item.label}：${item.text}`));
  const primaryTarget=mainTimingTarget(result);
  if(primaryTarget){const primary=primaryTimingForTarget(result,primaryTarget);lines.push("","【第一優先應期】",`${primary.title}：${primary.html.replace(/<[^>]+>/g,"")}`);}
  if(result.input.readingMode==="六爻流月推演"||result.input.readingMode==="流年推演"){
    const target=primaryTarget;
    lines.push("","【流年流月】",...flowMonthSegments(result).map(segment=>{const reading=monthReadingFor(result,segment,target);return `${segment.branch}月 ${segment.start}～${segment.end}｜${reading.label}：${reading.text}`;}));
  }
  if(result.input.readingMode==="六爻流年推演")lines.push("","【六爻流年・太歲】",...annualSegments(result,13).map(segment=>{const reading=annualReadingFor(result,segment,primaryTarget);return `${segment.ganZhi}年 ${segment.start}～${segment.end}｜${reading.label}：${reading.text}`;}));
  lines.push("",`老師筆記：${result.input.notes||"無"}`);
  return lines.join("\n");
}
async function downloadResultPdf(){
  if(!currentResult)return;
  if(typeof html2canvas==="undefined"||!window.jspdf)return showToast("PDF元件尚未載入，請重新整理後再試");
  const result=$("#pdfCaptureArea"),tableWrap=result.querySelector(".table-wrap");
  showToast("正在產生PDF，請稍候…");
  result.classList.add("pdf-export");
  const oldOverflow=tableWrap.style.overflow;tableWrap.style.overflow="visible";
  try{
    const canvas=await html2canvas(result,{scale:1.5,useCORS:true,backgroundColor:"#ffffff",windowWidth:1160,scrollX:0,scrollY:0});
    const {jsPDF}=window.jspdf,pdf=new jsPDF({orientation:"landscape",unit:"mm",format:"a4",compress:true});
    const margin=7,pageWidth=297,pageHeight=210,printWidth=pageWidth-margin*2,printHeight=pageHeight-margin*2;
    const imageHeight=canvas.height*printWidth/canvas.width,image=canvas.toDataURL("image/jpeg",.92);
    let offset=0,page=0;
    while(offset<imageHeight){if(page>0)pdf.addPage("a4","landscape");pdf.addImage(image,"JPEG",margin,margin-offset,printWidth,imageHeight,undefined,"FAST");offset+=printHeight;page++;}
    const safe=(currentResult.input.question||"六爻排盤").replace(/[\\/:*?"<>|]/g,"_").slice(0,35);
    pdf.save(`${safe}-${dateText(new Date(currentResult.input.castTime))}.pdf`);
    showToast("PDF已下載");
  }catch(error){console.error(error);showToast("PDF產生失敗，請重新整理後再試");}
  finally{tableWrap.style.overflow=oldOverflow;result.classList.remove("pdf-export");}
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
$("#pdfBtn").addEventListener("click",downloadResultPdf);
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
