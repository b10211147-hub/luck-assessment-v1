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
      <div class="activity-card__body"><p>${item.description}</p><div class="meta"><div><small>報名費用</small><strong>隨喜</strong></div><span class="registered">已報名 ${item.registered} 名</span></div><button class="primary-btn" data-register="${item.id}">立即報名</button></div>
    </article>`).join("");
}

function openRegistration(id) {
  state.selected = state.activities.find((item) => item.id === id);
  const item = state.selected;
  $("#selectedActivity").innerHTML = `<small>祈福活動</small><h3>${item.title}</h3>`;
  $("select[name=people]").innerHTML = Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}">${i + 1} 人</option>`).join("");
  updateTotal(); showView("formView");
}

function updateTotal() { $("#totalPrice").textContent = "隨喜"; }

async function submitRegistration(event) {
  event.preventDefault();
  const button = event.submitter; button.disabled = true; button.textContent = "資料送出中…";
  try {
    const body = Object.fromEntries(new FormData(event.currentTarget)); body.activityId = state.selected.id; body.lineIdToken = state.lineIdToken;
    const response = await fetch(apiUrl("/api/orders"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const order = await response.json(); if (!response.ok) throw new Error(order.error);
    const notice = order.lineNotificationSent ? "專屬編號已傳送至你的 LINE" : "請先截圖保存專屬編號；正式 LINE 通知尚未連線";
    $("#orderSummary").innerHTML = `<div class="summary"><div><span>專屬報名編號</span><b>${order.id}</b></div><div><span>祈福活動</span><b>${order.activityTitle}</b></div><div><span>祈福人數</span><b>${order.people} 人</b></div><div><span>報名費用</span><strong>隨喜</strong></div><div><span>LINE 通知</span><b>${notice}</b></div></div>`;
    event.currentTarget.reset(); showView("successView");
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
