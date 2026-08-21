"use strict";

const TEACHER_PASSWORD = "138668";
const AUTH_KEY = "fengmugong.ziwei.auth.v1";
const CASES_KEY = "fengmugong.ziwei.cases.v1";
const $ = (selector) => document.querySelector(selector);
const STAR_HINTS = {
  紫微: "重視主導、整合與秩序，可觀察承擔責任時是否也願意授權。",
  天機: "偏向思考、規劃與調整，可觀察變通是否轉成穩定行動。",
  太陽: "偏向公開、付出與責任，可觀察熱心投入後是否仍照顧自己的界線。",
  武曲: "重視效率、執行與成果，可觀察做決策時是否過度只看實際得失。",
  天同: "重視和氣、舒適與協調，可觀察遇到壓力時是化解還是延後面對。",
  廉貞: "在意原則、關係界線與自我要求，可觀察企圖心如何被合宜地運用。",
  天府: "重視穩定、承接與資源管理，可觀察守成與主動開展之間的平衡。",
  太陰: "偏向內在感受、細節與累積，可觀察敏感度是否成為洞察而非負擔。",
  貪狼: "重視體驗、人際與多元可能，可觀察興趣能否聚焦成可持續的方向。",
  巨門: "重視辨析、表達與追問，可觀察清楚說明與反覆質疑之間的分寸。",
  天相: "重視協調、公平與角色分工，可觀察照顧整體時是否保留自己的立場。",
  天梁: "重視原則、保護與經驗，可觀察提供建議時是否也允許他人自己選擇。",
  七殺: "偏向決斷、承壓與開創，可觀察快速推進前是否留有風險檢查。",
  破軍: "偏向重整、突破與汰舊，可觀察改變之前是否先保留必要的基礎。"
};
const chartAreas = { 3: "si", 4: "wu", 5: "wei", 6: "shen", 2: "chen", 7: "you", 1: "mao", 8: "xu", 0: "yin", 11: "chou", 10: "zi", 9: "hai" };
const PALACE_DISPLAY_ORDER = ["命宮", "兄弟宮", "夫妻宮", "子女宮", "財帛宮", "疾厄宮", "遷移宮", "僕役宮", "官祿宮", "田宅宮", "福德宮", "父母宮"];
let currentResult = null;
let toastTimer = null;

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function getCases() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CASES_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setCases(cases) {
  localStorage.setItem(CASES_KEY, JSON.stringify(cases));
}

function starNames(palace) {
  return palace.stars.length ? palace.stars.map((star) => star.name).join("、") : "無十四主星";
}

function minorStarNames(palace) {
  return palace.minorStars.length ? palace.minorStars.map((star) => star.name).join("、") : "無十四輔星落宮";
}

function renderPalace(palace) {
  const flags = [palace.isSoul ? "命宮" : "", palace.isBody ? "身宮" : ""].filter(Boolean);
  return `<article class="palace${palace.isSoul ? " is-soul" : ""}${palace.isBody ? " is-body" : ""}" style="grid-area:${chartAreas[palace.index]}">
    <div><header><h4>${palace.name}</h4><span class="ganzhi">${palace.heavenlyStem}${palace.earthlyBranch}</span></header>${flags.length ? `<div class="flags">${flags.map((flag) => `<span class="flag">${flag}</span>`).join("")}</div>` : ""}</div>
    <div>${palace.stars.length ? `<div class="star-list">${palace.stars.map((star) => `<span class="star"><b>${star.name}</b>${star.transformation ? `<small class="mutagen">${star.transformation}</small>` : ""}</span>`).join("")}</div>` : '<p class="empty-star">本宮無十四主星</p>'}
    <div class="minor-star-list">${palace.minorStars.map((star) => `<span class="minor-star ${star.type}">${star.name}${star.transformation ? `<small class="mutagen">${star.transformation}</small>` : ""}</span>`).join("") || '<span class="minor-star">無輔星</span>'}</div><small class="decadal-range">大限・虛歲 ${palace.decadal.range[0]}–${palace.decadal.range[1]}</small></div>
  </article>`;
}

function factHint(fact, hint) {
  return `<div class="fact-hint"><section class="reading-fact"><b>排盤事實</b><p>${escapeHtml(fact)}</p></section><section class="reading-hint-box"><b>解讀提示</b><p>${escapeHtml(hint)}</p></section></div>`;
}

function renderDetailedReading(result) {
  const reading = ZiweiReading.build(result);
  $("#coreReadingContent").innerHTML = factHint(reading.core.fact, reading.core.hint) + `<div class="star-guide-list">${reading.core.starGuides.length ? reading.core.starGuides.map((guide) => `<section class="star-guide"><h5>${guide.name}${guide.borrowed ? "（借對宮參考）" : ""}</h5><p><b>核心基調：</b>${guide.core}</p><p><b>可發揮：</b>${guide.strength}</p><p><b>需留意：</b>${guide.watch}</p><p class="teacher-question"><b>可追問：</b>${guide.question}</p></section>`).join("") : '<p class="pending-copy">命宮與對宮都沒有十四主星，第一版不產生主星性格稿。</p>'}</div><p class="reading-note">${reading.core.note}</p>`;
  $("#triadReadingContent").innerHTML = factHint(reading.triad.fact, reading.triad.hint) + `<div class="triad-reading-list">${reading.triad.items.map((item) => `<section><b>${item.relation}・${item.palace.name}</b><span>${escapeHtml(item.domain)}</span><p>${escapeHtml(starNames(item.palace))}</p></section>`).join("")}</div>`;
  $("#mutagenReadingContent").innerHTML = `<div class="mutagen-reading-list">${reading.transformations.map((item) => `<section><header><b>${item.label}・${item.star}</b><span>${item.palaceName || "宮位暫未計算"}</span></header><p>${escapeHtml(item.text)}</p><small>判讀界線：${escapeHtml(item.caution)}</small></section>`).join("")}</div>`;
  const palaceReadings = [...reading.palaces].sort((a, b) => PALACE_DISPLAY_ORDER.indexOf(a.palace.name) - PALACE_DISPLAY_ORDER.indexOf(b.palace.name));
  $("#palaceReadingContent").innerHTML = palaceReadings.map((item) => `<details class="palace-reading" ${item.palace.isSoul ? "open" : ""}><summary><span>${item.palace.name}${item.palace.isBody ? "・身宮" : ""}</span><small>${escapeHtml(starNames(item.palace))}</small></summary><div class="palace-reading-body"><p class="palace-domain"><b>這一宮看什麼：</b>${escapeHtml(item.guide.domain)}。${escapeHtml(item.guide.focus)}。</p>${factHint(item.facts, item.hint)}<p class="teacher-question"><b>老師可追問：</b>${escapeHtml(item.question)}</p>${item.caution ? `<p class="health-caution">${escapeHtml(item.caution)}</p>` : ""}</div></details>`).join("");
  $("#extensionReadingContent").innerHTML = `<div class="extension-reading"><section class="extension-section"><h5>命主與身主</h5>${factHint(reading.extension.rulers.fact, reading.extension.rulers.hint)}</section><section class="extension-section"><h5>十四輔星</h5>${factHint(reading.extension.auxiliaries.fact, reading.extension.auxiliaries.hint)}</section><section class="extension-section"><h5>十二宮大限</h5>${factHint(reading.extension.decadals.fact, reading.extension.decadals.hint)}<div class="decadal-grid">${reading.extension.decadals.items.sort((a, b) => a.range[0] - b.range[0]).map((item) => `<div class="decadal-item"><b>虛歲 ${item.range[0]}–${item.range[1]}</b><span>${item.palace.name}・${item.palace.heavenlyStem}${item.palace.earthlyBranch}</span></div>`).join("")}</div></section></div>`;
  $("#methodReadingContent").innerHTML = reading.method.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function renderResult(result) {
  if (!result || result.version !== "1.1.0") result = ZiweiCore.calculate(result.input || result);
  currentResult = result;
  const lifePalace = result.palaces[result.soulIndex];
  const bodyPalace = result.palaces[result.bodyIndex];
  const client = result.input.clientName || "未填姓名";
  $("#resultMeta").textContent = `${client}・${result.input.gender}・${result.input.solarDate || result.input.birthDate}・${result.input.timeLabel}`;
  $("#resultTitle").textContent = `${result.calendar.yearGanZhi}年・${result.fiveElementsClass.name}・命宮${result.lifeStem}${result.lifeBranch}`;
  $("#factSummary").innerHTML = [
    `農曆 ${result.calendar.display}`,
    `命宮 ${lifePalace.name.replace("宮", "")}・${result.lifeStem}${result.lifeBranch}`,
    `身宮在${bodyPalace.name}`,
    `命主${result.soulRuler}・身主${result.bodyRuler}`,
    `大限${result.decadalDirection}`,
    result.fiveElementsClass.name,
    `${result.input.birthPlace}・${result.input.timezone}`
  ].map((item) => `<span>${escapeHtml(item)}</span>`).join("");

  const center = `<div class="chart-center"><div><span class="seal" aria-hidden="true">紫</span><strong>${escapeHtml(client)}</strong><p>${result.calendar.yearGanZhi}年・${result.fiveElementsClass.name}<br>命宮 ${result.lifeStem}${result.lifeBranch}・身宮 ${bodyPalace.name}<br>命主 ${result.soulRuler}・身主 ${result.bodyRuler}</p></div></div>`;
  $("#palaceChart").innerHTML = result.palaces.map(renderPalace).join("") + center;
  $("#lifeStars").innerHTML = `<p><strong>${escapeHtml(starNames(lifePalace))}</strong></p><p>${lifePalace.stars.length ? "以上為命宮內的十四主星。" : "命宮為空宮；第一版只陳列事實，解讀時可再人工參考對宮及三方。"}</p>`;
  $("#bodyPalace").innerHTML = `<p><strong>${bodyPalace.name}・${bodyPalace.heavenlyStem}${bodyPalace.earthlyBranch}</strong></p><p>宮內十四主星：${escapeHtml(starNames(bodyPalace))}</p>`;
  $("#rulers").innerHTML = `<p><strong>命主 ${result.soulRuler}・身主 ${result.bodyRuler}</strong></p><p>命主依命宮地支，身主依生年地支而定；作為命身宮的補充線索。</p>`;
  $("#decadalDirection").innerHTML = `<p><strong>${result.decadalDirection}・${result.fiveElementsClass.value}歲起限</strong></p><p>採虛歲區間，每十年移一宮；目前不含大限四化與流年。</p>`;
  $("#auxiliaryStars").innerHTML = result.palaces.filter((palace) => palace.minorStars.length).map((palace) => `<div class="auxiliary-item"><b>${palace.name}・${palace.heavenlyStem}${palace.earthlyBranch}</b><span>${escapeHtml(minorStarNames(palace))}</span></div>`).join("");
  $("#fourTransformations").innerHTML = result.fourTransformations.map((item) => `<div class="transformation-item"><b>${item.label}・${item.star}</b>${item.status === "calculated" ? `<span>${item.palaceName}</span>` : '<span class="pending">第一版暫未計算該輔星宮位</span>'}</div>`).join("");
  $("#triadPalaces").innerHTML = result.triadIndexes.map((index, position) => {
    const palace = result.palaces[index];
    const relation = position === 0 ? "本宮" : position === 3 ? "對宮" : "三合宮";
    return `<div class="triad-item"><b>${relation}・${palace.name}</b><span>${palace.heavenlyStem}${palace.earthlyBranch}・${escapeHtml(starNames(palace))}</span></div>`;
  }).join("");

  const readingStars = lifePalace.stars.length ? lifePalace.stars : result.palaces[result.triadIndexes[3]].stars;
  const readingIntro = lifePalace.stars.length
    ? `命宮見${starNames(lifePalace)}，可先從下列方向提問：`
    : `命宮無十四主星；以下暫借對宮${result.palaces[result.triadIndexes[3]].name}的${starNames(result.palaces[result.triadIndexes[3]])}作為訪談線索，不等同直接落命：`;
  $("#plainReading").innerHTML = `<p>${escapeHtml(readingIntro)}</p><ul class="interpretation-list">${readingStars.length ? readingStars.map((star) => `<li><strong>${star.name}</strong>：${STAR_HINTS[star.name]}</li>`).join("") : "<li>本宮與對宮都未見十四主星，第一版不自動產生主星解讀，請人工合看三方四正。</li>"}<li><strong>身宮在${bodyPalace.name}</strong>：後天投入與行動焦點可優先從此宮主題觀察，但仍需結合實際人生階段。</li><li><strong>命主／身主</strong>：${result.soulRuler}與${result.bodyRuler}只作補充線索，不取代命身宮。</li><li><strong>大限${result.decadalDirection}</strong>：從虛歲${result.fiveElementsClass.value}歲起限，目前只讀人生階段，不直接預測吉凶事件。</li><li><strong>三方四正</strong>：命、財帛、官祿與遷移四個面向應連動觀察，不宜只用命宮單點下結論。</li></ul>`;
  renderDetailedReading(result);
  $("#limitationsList").innerHTML = result.limitations.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  $("#resultView").hidden = false;
  $("#resultView").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
}

function resultText(result) {
  const lifePalace = result.palaces[result.soulIndex];
  const bodyPalace = result.palaces[result.bodyIndex];
  const detailed = ZiweiReading.build(result);
  const lines = [
    "【奉母宮紫微斗數命盤・第一版】",
    `姓名／代稱：${result.input.clientName || "未填"}`,
    `性別：${result.input.gender}`,
    `出生：${result.input.birthDate}　${result.input.timeLabel}`,
    `出生地／時區：${result.input.birthPlace}／${result.input.timezone}`,
    `農曆：${result.calendar.display}`,
    `命宮：${result.lifeStem}${result.lifeBranch}　主星：${starNames(lifePalace)}`,
    `身宮：${bodyPalace.name}（${bodyPalace.heavenlyStem}${bodyPalace.earthlyBranch}）`,
    `命主／身主：${result.soulRuler}／${result.bodyRuler}`,
    `五行局：${result.fiveElementsClass.name}`,
    `大限：${result.decadalDirection}，虛歲${result.fiveElementsClass.value}歲起限`,
    "",
    "【排盤事實・十二宮】"
  ];
  result.palaces.forEach((palace) => lines.push(`${palace.name} ${palace.heavenlyStem}${palace.earthlyBranch}${palace.isBody ? "［身宮］" : ""}｜大限虛歲${palace.decadal.range[0]}–${palace.decadal.range[1]}：主星 ${palace.stars.length ? palace.stars.map((star) => `${star.name}${star.transformation ? `（${star.transformation}）` : ""}`).join("、") : "無十四主星"}；輔星 ${minorStarNames(palace)}`));
  lines.push("", "【生年四化】", ...result.fourTransformations.map((item) => `${item.label}・${item.star}：${item.palaceName || "宮位暫未計算"}`));
  lines.push("", "【命主身主・十四輔星・大限】", `命主 ${result.soulRuler}；身主 ${result.bodyRuler}`, ...result.palaces.filter((palace) => palace.minorStars.length).map((palace) => `${palace.name}：${minorStarNames(palace)}`), ...result.palaces.slice().sort((a, b) => a.decadal.range[0] - b.decadal.range[0]).map((palace) => `虛歲${palace.decadal.range[0]}–${palace.decadal.range[1]}：${palace.name} ${palace.heavenlyStem}${palace.earthlyBranch}`));
  lines.push("", "【命宮三方四正】", ...result.triadIndexes.map((index, position) => {
    const palace = result.palaces[index];
    return `${position === 0 ? "本宮" : position === 3 ? "對宮" : "三合宮"}・${palace.name} ${palace.heavenlyStem}${palace.earthlyBranch}：${starNames(palace)}`;
  }));
  const readingPalace = lifePalace.stars.length ? lifePalace : result.palaces[result.triadIndexes[3]];
  lines.push("", "【解讀提示】", ...(readingPalace.stars.length
    ? readingPalace.stars.map((star) => `${star.name}：${STAR_HINTS[star.name]}`)
    : ["命宮與對宮都未見十四主星，第一版不自動產生主星解讀，請人工合看三方四正。"]));
  lines.push(`身宮在${bodyPalace.name}：後天投入與行動焦點可優先從此宮主題觀察，但仍需結合實際人生階段。`);
  lines.push("", "【完整解讀・核心輪廓】", `排盤事實：${detailed.core.fact}`, `解讀提示：${detailed.core.hint}`);
  detailed.core.starGuides.forEach((guide) => lines.push(`${guide.name}${guide.borrowed ? "（借對宮參考）" : ""}：${guide.core}。可發揮：${guide.strength}。需留意：${guide.watch}。可追問：${guide.question}`));
  lines.push("", "【完整解讀・三方四正】", `排盤事實：${detailed.triad.fact}`, `解讀提示：${detailed.triad.hint}`);
  lines.push("", "【完整解讀・生年四化】", ...detailed.transformations.flatMap((item) => [`${item.label}・${item.star}${item.palaceName ? `（${item.palaceName}）` : "（宮位暫未計算）"}：${item.text}`, `判讀界線：${item.caution}`]));
  lines.push("", "【完整解讀・十二宮】");
  [...detailed.palaces].sort((a, b) => PALACE_DISPLAY_ORDER.indexOf(a.palace.name) - PALACE_DISPLAY_ORDER.indexOf(b.palace.name)).forEach((item) => {
    lines.push(`${item.palace.name}${item.palace.isBody ? "［身宮］" : ""}`, `這一宮看什麼：${item.guide.domain}。${item.guide.focus}。`, `排盤事實：${item.facts}`, `解讀提示：${item.hint}`, `老師可追問：${item.question}`);
    if (item.caution) lines.push(item.caution);
  });
  lines.push("", "【完整解讀・輔星與大限】", `排盤事實：${detailed.extension.rulers.fact}`, `解讀提示：${detailed.extension.rulers.hint}`, `排盤事實：${detailed.extension.auxiliaries.fact}`, `解讀提示：${detailed.extension.auxiliaries.hint}`, `排盤事實：${detailed.extension.decadals.fact}`, `解讀提示：${detailed.extension.decadals.hint}`);
  lines.push("", "【老師解讀順序】", ...detailed.method.map((item, index) => `${index + 1}. ${item}`));
  lines.push("", "【第一版限制】", ...result.limitations.map((item) => `・${item}`));
  return lines.join("\n");
}

async function copyResult() {
  if (!currentResult) return;
  const text = resultText(currentResult);
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
  showToast("命盤已複製");
}

async function downloadPdf() {
  if (!currentResult) return;
  if (typeof html2canvas === "undefined" || !window.jspdf) return showToast("PDF 元件尚未載入，請重新整理後再試");
  const capture = $("#pdfCaptureArea");
  const readingDetails = [...capture.querySelectorAll(".palace-reading")];
  const detailStates = readingDetails.map((detail) => detail.open);
  showToast("正在產生 PDF，請稍候…");
  capture.classList.add("pdf-export");
  readingDetails.forEach((detail) => detail.open = true);
  try {
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const canvas = await html2canvas(capture, { scale: 1.35, useCORS: true, backgroundColor: "#ffffff", windowWidth: 1180, scrollX: 0, scrollY: 0 });
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4", compress: true });
    const margin = 7, pageWidth = 297, pageHeight = 210, printWidth = pageWidth - margin * 2, printHeight = pageHeight - margin * 2;
    const imageHeight = canvas.height * printWidth / canvas.width;
    const image = canvas.toDataURL("image/jpeg", .92);
    for (let offset = 0, page = 0; offset < imageHeight; offset += printHeight, page += 1) {
      if (page) pdf.addPage("a4", "landscape");
      pdf.addImage(image, "JPEG", margin, margin - offset, printWidth, imageHeight, undefined, "FAST");
    }
    const safeName = (currentResult.input.clientName || "紫微命盤").replace(/[\\/:*?"<>|]/g, "_").slice(0, 35);
    pdf.save(`${safeName}-${currentResult.input.birthDate}.pdf`);
    showToast("PDF 已下載");
  } catch (error) {
    console.error(error);
    showToast("PDF 產生失敗，請重新整理後再試");
  } finally {
    readingDetails.forEach((detail, index) => detail.open = detailStates[index]);
    capture.classList.remove("pdf-export");
  }
}

function saveCurrentCase() {
  if (!currentResult) return;
  const cases = getCases();
  const stored = JSON.parse(JSON.stringify(currentResult));
  stored.id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `ziwei-${Date.now()}`;
  stored.savedAt = new Date().toISOString();
  cases.unshift(stored);
  setCases(cases.slice(0, 100));
  renderCases();
  showToast("紫微案例已儲存在這台裝置");
}

function populateForm(result) {
  const form = $("#ziweiForm");
  ["clientName", "gender", "birthDate", "timeIndex", "birthPlace"].forEach((name) => {
    if (form.elements[name]) form.elements[name].value = result.input[name] ?? "";
  });
}

function renderCases() {
  const cases = getCases();
  $("#caseList").innerHTML = cases.length ? cases.map((item) => `<article class="case-card"><div><h3>${escapeHtml(item.input.clientName || "未填姓名")}</h3><p>${item.input.birthDate}・${item.input.timeLabel}<br>${item.fiveElementsClass.name}・命宮${item.lifeStem}${item.lifeBranch}・${escapeHtml(starNames(item.palaces[item.soulIndex]))}</p></div><div class="case-actions"><button class="ghost" data-open-case="${item.id}" type="button">開啟</button><button class="ghost delete" data-delete-case="${item.id}" type="button">刪除</button></div></article>`).join("") : '<div class="empty">尚未儲存任何紫微案例</div>';
}

function showTool() {
  sessionStorage.setItem(AUTH_KEY, "1");
  $("#loginView").hidden = true;
  $("#toolView").hidden = false;
  $("#logoutBtn").hidden = false;
  renderCases();
}

$("#loginForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const password = new FormData(event.currentTarget).get("password");
  if (password !== TEACHER_PASSWORD) {
    $("#loginError").textContent = "老師密碼不正確";
    return;
  }
  $("#loginError").textContent = "";
  showTool();
});

$("#logoutBtn").addEventListener("click", () => {
  sessionStorage.removeItem(AUTH_KEY);
  location.reload();
});

document.querySelectorAll(".tool-tabs button").forEach((button) => button.addEventListener("click", () => {
  document.querySelectorAll(".tool-tabs button").forEach((item) => item.classList.toggle("active", item === button));
  ["castingPanel", "historyPanel"].forEach((id) => $("#" + id).hidden = id !== button.dataset.panel);
  if (button.dataset.panel === "historyPanel") renderCases();
}));

$("#ziweiForm").addEventListener("submit", (event) => {
  event.preventDefault();
  try {
    const input = Object.fromEntries(new FormData(event.currentTarget));
    renderResult(ZiweiCore.calculate(input));
  } catch (error) {
    showToast(error.message || "排盤資料有誤");
  }
});

$("#copyBtn").addEventListener("click", copyResult);
$("#pdfBtn").addEventListener("click", downloadPdf);
$("#saveBtn").addEventListener("click", saveCurrentCase);
$("#caseList").addEventListener("click", (event) => {
  const openButton = event.target.closest("[data-open-case]");
  const deleteButton = event.target.closest("[data-delete-case]");
  if (openButton) {
    const item = getCases().find((candidate) => candidate.id === openButton.dataset.openCase);
    if (!item) return;
    populateForm(item);
    document.querySelector('[data-panel="castingPanel"]').click();
    renderResult(item);
  }
  if (deleteButton) {
    const item = getCases().find((candidate) => candidate.id === deleteButton.dataset.deleteCase);
    if (!item || !confirm(`確定刪除「${item.input.clientName || "未填姓名"}」的紫微案例？`)) return;
    setCases(getCases().filter((candidate) => candidate.id !== item.id));
    renderCases();
    showToast("案例已刪除");
  }
});

if (sessionStorage.getItem(AUTH_KEY) === "1") showTool();
