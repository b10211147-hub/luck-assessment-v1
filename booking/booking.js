const API_BASE = "https://fengmugong-registration-api.b10211147.chatgpt.site";
const LIFF_ID = "2010747679-nNL4BQhG";
const SOURCE_CODE = new URLSearchParams(location.search).get("src")?.trim().toLowerCase() === "764catfn" ? "764catfn" : "main";
const state = { slots: [], selectedDate: "", selectedSlot: null, lineIdToken: "", lineAccessToken: "", lineDisplayName: "" };
const $ = (id) => document.getElementById(id);
const format = (value, options) => new Intl.DateTimeFormat("zh-TW", { timeZone: "Asia/Taipei", ...options }).format(new Date(value));
const dateKey = (value) => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Taipei", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(value));
const shortDate = (value) => format(value, { month: "numeric", day: "numeric" });
const weekday = (value) => format(value, { weekday: "short" });
const timeLabel = (value) => format(value, { hour: "2-digit", minute: "2-digit", hour12: false });
const fullDateTime = (value) => format(value, { year: "numeric", month: "long", day: "numeric", weekday: "long", hour: "2-digit", minute: "2-digit", hour12: false });

function setIdentity(status, title) {
  const box = $("identity");
  box.className = `identity ${status}`;
  $("identityIcon").textContent = status === "ready" ? "✓" : status === "error" ? "!" : "•••";
  $("identityTitle").textContent = title;
  $("retryLine").hidden = status !== "error";
  updateSubmit();
}

function showError(message) {
  $("errorMessage").textContent = message;
  $("errorMessage").hidden = !message;
}

function updateSubmit() {
  const button = $("submitButton");
  const ready = Boolean((state.lineIdToken || state.lineAccessToken) && state.selectedSlot);
  button.disabled = !ready;
  button.textContent = state.lineIdToken || state.lineAccessToken ? "確認預約" : "請先連接 LINE";
}

async function initLine() {
  setIdentity("loading", "正在連接 LINE 身分");
  try {
    await liff.init({ liffId: LIFF_ID });
    if (!liff.isLoggedIn()) {
      // The canonical LIFF URL launches the app. Actual external-browser login
      // must use liff.login(), otherwise the LIFF entry and endpoint can loop.
      liff.login({ redirectUri: window.location.href });
      return;
    }
    const token = liff.getIDToken() || "";
    const accessToken = liff.getAccessToken() || "";
    if (!token && !accessToken) throw new Error("無法取得 LINE 登入資料");
    const response = await fetch(`${API_BASE}/api/identity`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lineIdToken: token, lineAccessToken: accessToken }) });
    const identity = await response.json();
    if (!response.ok) throw new Error(identity.error || "LINE 身分驗證失敗");
    state.lineIdToken = token;
    state.lineAccessToken = accessToken;
    state.lineDisplayName = identity.displayName || "LINE 使用者";
    $("lineNickname").value = state.lineDisplayName;
    setIdentity("ready", `已連接 LINE：${state.lineDisplayName}`);
  } catch (error) {
    state.lineIdToken = "";
    state.lineAccessToken = "";
    setIdentity("error", error instanceof Error ? error.message : "LINE 身分連接失敗");
  }
}

async function loadSlots() {
  try {
    const response = await fetch(`${API_BASE}/api/booking/slots?source=${encodeURIComponent(SOURCE_CODE)}`, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok || !Array.isArray(data)) throw new Error("可預約時段載入失敗");
    state.slots = data;
    state.selectedDate = data.length ? dateKey(data[0].startAt) : "";
    renderDates();
  } catch (error) {
    $("dateArea").className = "empty";
    $("dateArea").textContent = error instanceof Error ? error.message : "可預約時段載入失敗";
  }
}

function renderDates() {
  const area = $("dateArea");
  area.replaceChildren();
  if (!state.slots.length) {
    area.className = "empty";
    area.textContent = "目前尚未開放預約時段，請稍後再回來查看。";
    $("timeGrid").hidden = true;
    return;
  }
  area.className = "date-rail";
  const dates = [...new Map(state.slots.map((slot) => [dateKey(slot.startAt), slot])).entries()];
  dates.forEach(([key, slot]) => {
    const button = document.createElement("button");
    button.type = "button";
    if (key === state.selectedDate) button.className = "active";
    const strong = document.createElement("strong");
    const small = document.createElement("small");
    strong.textContent = shortDate(slot.startAt);
    small.textContent = weekday(slot.startAt);
    button.append(strong, small);
    button.addEventListener("click", () => { state.selectedDate = key; state.selectedSlot = null; $("detailsCard").hidden = true; renderDates(); renderTimes(); });
    area.append(button);
  });
  renderTimes();
}

function renderTimes() {
  const grid = $("timeGrid");
  grid.replaceChildren();
  const visible = state.slots.filter((slot) => dateKey(slot.startAt) === state.selectedDate);
  grid.hidden = !visible.length;
  visible.forEach((slot) => {
    const button = document.createElement("button");
    button.type = "button";
    if (state.selectedSlot?.id === slot.id) button.className = "active";
    const time = document.createElement("span");
    const description = document.createElement("small");
    time.textContent = timeLabel(slot.startAt);
    description.textContent = `${slot.service}・${slot.durationMinutes} 分鐘`;
    button.append(time, description);
    button.addEventListener("click", () => selectSlot(slot));
    grid.append(button);
  });
}

function selectSlot(slot) {
  state.selectedSlot = slot;
  renderTimes();
  const summary = $("selectedSummary");
  summary.replaceChildren();
  const title = document.createElement("b");
  const details = document.createElement("span");
  title.textContent = slot.service;
  details.textContent = `${fullDateTime(slot.startAt)}・${slot.durationMinutes} 分鐘`;
  summary.append(title, details);
  if (slot.note) { const note = document.createElement("small"); note.textContent = slot.note; summary.append(note); }
  $("detailsCard").hidden = false;
  updateSubmit();
  $("detailsCard").scrollIntoView({ behavior: "smooth", block: "start" });
}

$("bookingForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.selectedSlot || (!state.lineIdToken && !state.lineAccessToken)) return;
  const button = $("submitButton");
  const form = new FormData(event.currentTarget);
  button.disabled = true;
  button.textContent = "預約送出中…";
  showError("");
  try {
    const response = await fetch(`${API_BASE}/api/booking/appointments`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slotId: state.selectedSlot.id, customerName: form.get("customerName"), customerNote: form.get("customerNote"), lineIdToken: state.lineIdToken, lineAccessToken: state.lineAccessToken, sourceCode: SOURCE_CODE }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "預約失敗，請重新選擇時段");
    $("successSummary").replaceChildren(...[["預約編號", data.id], ["服務項目", data.service], ["預約時間", fullDateTime(data.startAt)], ["預約人", data.customerName], ["LINE 名稱", data.lineDisplayName || state.lineDisplayName]].map(([term, value]) => { const row = document.createElement("div"); const dt = document.createElement("dt"); const dd = document.createElement("dd"); dt.textContent = term; dd.textContent = value; row.append(dt, dd); return row; }));
    $("identity").hidden = true;
    document.querySelectorAll(".booking-card").forEach((card) => card.hidden = true);
    $("successCard").hidden = false;
    scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    showError(error instanceof Error ? error.message : "預約失敗，請稍後再試");
    await loadSlots();
  } finally {
    updateSubmit();
  }
});

$("retryLine").addEventListener("click", initLine);
$("newBooking").addEventListener("click", () => location.reload());
if (SOURCE_CODE === "764catfn") $("adminLink").href = `${API_BASE}/booking-admin-764catfn`;
loadSlots();
initLine();
