const $ = (selector) => document.querySelector(selector);
const API_BASE = "https://fengmugong-registration-api.b10211147.chatgpt.site";
const apiUrl = (path) => `${API_BASE}${path}`;
const state = { activities: [], selected: null, lineIdToken: "", liffReady: false };
const views = ["activitiesView", "formView", "successView", "ordersView"];

function money(value) { return `NT$${Number(value).toLocaleString("zh-TW")}`; }
function showToast(message) { const toast = $("#toast"); toast.textContent = message; toast.classList.add("is-visible"); setTimeout(() => toast.classList.remove("is-visible"), 2400); }
function showView(id) { views.forEach((view) => $("#" + view).classList.toggle("is-hidden", view !== id)); window.scrollTo({ top: 300, behavior: "smooth" }); }
function setTab(name) { document.querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("is-active", tab.dataset.view === name)); }

function renderActivities() {
  $("#activityList").innerHTML = state.activities.map((item) => `
    <article class="activity-card">
      <div class="activity-card__top"><h3>${item.title}</h3></div>
      <div class="activity-card__body"><p>${[...item.description].slice(0, 50).join("")}</p>${item.details ? `<button class="read-more" data-register="${item.id}">閱讀更多</button>` : ""}<div class="meta"><div><small>報名費用</small><strong>隨喜</strong></div><span class="registered">已報名 ${item.registered} 名</span></div><button class="primary-btn" data-register="${item.id}">立即報名</button></div>
    </article>`).join("");
}

function setFieldText(fieldName, text) {
  const label = $(`[name="${fieldName}"]`).closest("label");
  label.firstChild.nodeValue = text;
}

function configureRegistrationFields(isEnterprise) {
  const name = $('[name="name"]');
  const birthday = $('[name="birthday"]');
  const address = $('[name="address"]');
  const prayerNames = $('[name="prayerNames"]');
  setFieldText("name", "報名人姓名");
  setFieldText("birthday", isEnterprise ? "創立日期（民國）" : "生日（民國）");
  setFieldText("address", isEnterprise ? "公司地址（營業地址）" : "居住地址（最常待的地方）");
  setFieldText("people", isEnterprise ? "公司人數" : "祈福人數");
  setFieldText("prayerNames", isEnterprise ? "祈福公司行號名" : "祈福姓名");
  name.placeholder = "請輸入真實姓名";
  birthday.placeholder = isEnterprise ? "例如 0840228" : "例如 0840228";
  birthday.title = isEnterprise ? "請輸入 7 位民國創立日期，例如 0840228" : "請輸入 7 位民國生日，例如 0840228";
  address.placeholder = isEnterprise ? "請填寫公司實際營業地址" : "請填寫平時最常居住的完整地址";
  prayerNames.placeholder = isEnterprise ? "請輸入祈福的公司或商號名稱" : "多人請以頓號分隔，例如：王大明、王小美";
}

function openRegistration(id) {
  state.selected = state.activities.find((item) => item.id === id);
  const item = state.selected;
  configureRegistrationFields(item.id === "enterprise-2026");
  $("#selectedActivity").innerHTML = `<small>祈福活動</small><h3>${item.title}</h3><p class="selected-activity__details">${item.details || item.description}</p>`;
  $("select[name=people]").innerHTML = Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}">${i + 1} 人</option>`).join("");
  updateTotal(); showView("formView");
}

function updateTotal() { $("#totalPrice").textContent = "隨喜"; }

async function submitRegistration(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.checkValidity()) {
    const invalidField = form.querySelector(":invalid");
    const isEnterprise = state.selected?.id === "enterprise-2026";
    const messages = isEnterprise ? {
      name: "請輸入報名人姓名",
      birthday: "創立日期請輸入 7 位民國日期，例如 0840228",
      address: "請輸入公司營業地址",
      people: "請選擇公司人數",
    } : {
      name: "請輸入報名人姓名",
      birthday: "生日請輸入 7 位民國日期，例如 0840228",
      address: "請輸入居住地址",
      people: "請選擇祈福人數",
    };
    showToast(invalidField?.id === "consent" ? "請勾選同意隱私權與個資告知事項" : (messages[invalidField?.name] || "請確認必填資料"));
    invalidField?.focus();
    return;
  }
  const button = event.submitter || form.querySelector('button[type="submit"]'); button.disabled = true; button.textContent = "資料送出中…";
  try {
    const body = Object.fromEntries(new FormData(event.currentTarget)); body.activityId = state.selected.id; body.lineIdToken = state.lineIdToken;
    const response = await fetch(apiUrl("/api/orders"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const order = await response.json(); if (!response.ok) throw new Error(order.error);
    const notice = order.lineNotificationSent ? "專屬編號已傳送至你的 LINE" : "請先截圖保存專屬編號；正式 LINE 通知尚未連線";
    $("#orderSummary").innerHTML = `<div class="summary"><div><span>專屬報名編號</span><b>${order.id}</b></div><div><span>祈福活動</span><b>${order.activityTitle}</b></div><div><span>祈福人數</span><b>${order.people} 人</b></div><div><span>報名費用</span><strong>隨喜</strong></div><div><span>LINE 通知</span><b>${notice}</b></div></div>`;
    form.reset(); showView("successView");
  } catch (error) { showToast(error.message || "報名失敗，請稍後再試"); }
  finally { button.disabled = false; button.textContent = "確認送出報名"; }
}

function renderOrders(orders) {
  $("#orderList").innerHTML = orders.length ? orders.map((order) => `<article class="order-card"><header class="order-card__head"><small>✓ 祈福報名</small><h3>${order.activityTitle}</h3></header><dl><div><dt>專屬報名編號</dt><dd>${order.id}</dd></div><div><dt>報名人</dt><dd>${order.name}</dd></div><div><dt>祈福人數</dt><dd>${order.people} 人</dd></div><div><dt>報名費用</dt><dd><span class="badge">隨喜</span></dd></div></dl></article>`).join("") : `<div class="empty">查無此專屬報名編號，請確認後再試</div>`;
}

async function lookupOrders(event) { event.preventDefault(); const id = new FormData(event.currentTarget).get("id"); const response = await fetch(apiUrl(`/api/orders?id=${encodeURIComponent(id)}`)); renderOrders(await response.json()); }

document.addEventListener("click", (event) => { const register = event.target.closest("[data-register]"); if (register) openRegistration(register.dataset.register); });
document.querySelectorAll(".tab").forEach((tab) => tab.addEventListener("click", () => { setTab(tab.dataset.view); showView(tab.dataset.view === "orders" ? "ordersView" : "activitiesView"); }));
$("#backBtn").addEventListener("click", () => showView("activitiesView"));
$("#newOrderBtn").addEventListener("click", () => { setTab("activities"); showView("activitiesView"); });
$("select[name=people]").addEventListener("change", updateTotal);
$("#registrationForm").addEventListener("submit", submitRegistration);
$("#lookupForm").addEventListener("submit", lookupOrders);

fetch(apiUrl("/api/activities")).then((response) => response.json()).then((items) => { state.activities = items; renderActivities(); }).catch(() => showToast("活動資料載入失敗"));

async function initLineIdentity() {
  try {
    const config = await fetch(apiUrl("/api/config")).then((response) => response.json());
    if (!config.liffId || !window.liff) return;
    await liff.init({ liffId: config.liffId });
    if (!liff.isLoggedIn()) { liff.login({ redirectUri: window.location.href }); return; }
    state.lineIdToken = liff.getIDToken() || "";
    state.liffReady = Boolean(state.lineIdToken);
  } catch (error) {
    console.warn("LINE identity is not available", error);
  }
}

initLineIdentity();
