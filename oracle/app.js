(() => {
  "use strict";

  const oracles = window.FENGMU_ORACLES || [];
  const deities = window.FENGMU_DEITIES || [];
  const drawPanel = document.querySelector("#drawPanel");
  const resultPanel = document.querySelector("#resultPanel");
  const drawBtn = document.querySelector("#drawBtn");
  const lotVisual = document.querySelector("#lotVisual");
  const numberForm = document.querySelector("#numberForm");
  const numberInput = document.querySelector("#lotNumber");
  const numberError = document.querySelector("#numberError");
  const copyBtn = document.querySelector("#copyBtn");
  const againBtn = document.querySelector("#againBtn");
  const aspectGrid = document.querySelector("#aspectGrid");
  let currentOracle = null;
  let lastNumber = null;

  const fields = {
    level: document.querySelector("#resultLevel"),
    number: document.querySelector("#resultNumber"),
    deity: document.querySelector("#resultDeity"),
    attitude: document.querySelector("#resultAttitude"),
    theme: document.querySelector("#resultTheme"),
    poem: document.querySelector("#resultPoem"),
    title: document.querySelector("#resultTitle"),
    message: document.querySelector("#resultMessage"),
    reading: document.querySelector("#resultReading"),
    advice: document.querySelector("#resultAdvice")
  };

  function secureRandom(max) {
    if (window.crypto?.getRandomValues) {
      const buffer = new Uint32Array(1);
      window.crypto.getRandomValues(buffer);
      return buffer[0] % max;
    }
    return Math.floor(Math.random() * max);
  }

  function getRandomOracle() {
    let index = secureRandom(oracles.length);
    if (oracles.length > 1 && oracles[index].number === lastNumber) {
      index = (index + 1 + secureRandom(oracles.length - 1)) % oracles.length;
    }
    return oracles[index];
  }

  const aspectDefinitions = [
    {
      key: "career", label: "事業", icon: "業",
      themes: ["工作", "事業", "財運", "合作", "格局", "名聲", "謀略", "根基"],
      positive: "適合主動推進，把目標、期限與責任說清楚；有機會得到肯定或新的發展。",
      steady: "先穩住基本工作與節奏，完成手邊承諾，再評估擴張或轉換方向。",
      caution: "暫時不宜衝動離職、投資或承諾過多，先查清資訊並保留退路。"
    },
    {
      key: "love", label: "感情", icon: "緣",
      themes: ["感情", "情緣", "放下"],
      positive: "真誠表達有利，單身者可增加交流機會；有伴者適合談清楚共同方向。",
      steady: "先觀察彼此是否言行一致，不催促答案，也不要用猜測代替溝通。",
      caution: "避免在情緒中做分合決定；若關係只有單方面付出，先守住自己的界線。"
    },
    {
      key: "people", label: "人際", icon: "和",
      themes: ["人際", "朋友", "合作", "官非", "化解", "品德"],
      positive: "主動釋出善意與合作邀請容易得到回應，適合修復關係、拓展人脈。",
      steady: "少說多聽，重要承諾留下文字；把真心留給願意互相的人。",
      caution: "遠離口舌與不透明關係，不替他人背責任；爭議應保存證據並依法處理。"
    },
    {
      key: "exam", label: "考試", icon: "學",
      themes: ["學習", "學業", "考驗", "洞察"],
      positive: "理解力與臨場表現有提升空間，依計畫複習、正常作息即可穩定發揮。",
      steady: "回到基本功，整理錯題並固定複習；不與別人比較進度。",
      caution: "避免臨時抱佛腳與熬夜硬撐，先找出最弱單元，必要時向老師請教。"
    },
    {
      key: "family", label: "家庭", icon: "家",
      themes: ["家庭", "家運", "居所", "日常", "根基"],
      positive: "家人之間有互相支持的力量，適合團聚、整理住處或商量共同計畫。",
      steady: "從日常分工與一句好好說的話開始，不翻舊帳，先處理眼前能改善的事。",
      caution: "界線與責任要說清楚；涉及安全、暴力或成癮問題時，應立即尋求專業協助。"
    },
    {
      key: "health", label: "健康", icon: "安",
      themes: ["身心", "苦心", "日常", "復原"],
      positive: "身心適合回到規律生活，以睡眠、飲食與溫和活動維持良好狀態。",
      steady: "先休息、補水、正常用餐並減少過度消耗，讓身體有時間恢復。",
      caution: "不要把籤詩當成診斷；症狀持續、惡化或屬緊急情況，請儘速尋求合格醫療協助。"
    }
  ];

  function guidanceTone(level) {
    if (/上上|大吉|上吉|速吉|快吉|明吉/.test(level)) return "positive";
    if (/警|慎|凶|官非|斷吉/.test(level)) return "caution";
    return "steady";
  }

  function getAspectGuidance(oracle, aspect) {
    if (aspect.themes.includes(oracle.theme)) return oracle.advice;
    return aspect[guidanceTone(oracle.level)];
  }

  function renderAspects(oracle) {
    aspectGrid.replaceChildren(...aspectDefinitions.map(aspect => {
      const article = document.createElement("article");
      article.className = "aspect-item";
      const heading = document.createElement("div");
      heading.className = "aspect-label";
      const icon = document.createElement("span");
      icon.className = "aspect-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = aspect.icon;
      const title = document.createElement("strong");
      title.textContent = aspect.label;
      const text = document.createElement("p");
      text.textContent = getAspectGuidance(oracle, aspect);
      heading.append(icon, title);
      article.append(heading, text);
      return article;
    }));
  }

  function showOracle(oracle, updateUrl = true) {
    if (!oracle) return;
    currentOracle = oracle;
    lastNumber = oracle.number;
    fields.level.textContent = oracle.level;
    fields.number.textContent = `第 ${String(oracle.number).padStart(3, "0")} 籤`;
    fields.deity.textContent = oracle.deity;
    fields.attitude.textContent = oracle.attitude;
    fields.theme.textContent = oracle.theme;
    fields.poem.replaceChildren(...oracle.poem.map(line => {
      const p = document.createElement("p");
      p.textContent = line;
      return p;
    }));
    fields.title.textContent = oracle.title;
    fields.message.textContent = oracle.message;
    fields.reading.textContent = oracle.reading;
    fields.advice.textContent = oracle.advice;
    renderAspects(oracle);

    drawPanel.hidden = true;
    resultPanel.hidden = false;
    resultPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    if (updateUrl) history.replaceState(null, "", `${location.pathname}?lot=${oracle.number}`);
  }

  function resetDraw() {
    resultPanel.hidden = true;
    drawPanel.hidden = false;
    currentOracle = null;
    history.replaceState(null, "", location.pathname);
    drawPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  drawBtn.addEventListener("click", () => {
    if (oracles.length !== 108) {
      numberError.textContent = "籤詩資料尚未完整，請通知管理者。";
      return;
    }
    drawBtn.disabled = true;
    lotVisual.classList.add("is-shaking");
    setTimeout(() => {
      lotVisual.classList.remove("is-shaking");
      drawBtn.disabled = false;
      showOracle(getRandomOracle());
    }, 950);
  });

  numberForm.addEventListener("submit", event => {
    event.preventDefault();
    const number = Number(numberInput.value);
    if (!Number.isInteger(number) || number < 1 || number > 108) {
      numberError.textContent = "請輸入 1 到 108 之間的籤號。";
      numberInput.focus();
      return;
    }
    numberError.textContent = "";
    showOracle(oracles.find(item => item.number === number));
  });

  copyBtn.addEventListener("click", async () => {
    if (!currentOracle) return;
    const text = [
      `奉母宮・第 ${currentOracle.number} 籤｜${currentOracle.level}`,
      currentOracle.deity,
      currentOracle.poem.join("\n"),
      `\n神明慈語｜${currentOracle.title}`,
      currentOracle.message,
      `\n白話解籤｜${currentOracle.reading}`,
      `行動提醒｜${currentOracle.advice}`,
      ...aspectDefinitions.map(aspect => `${aspect.label}｜${getAspectGuidance(currentOracle, aspect)}`)
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      copyBtn.textContent = "已複製";
      setTimeout(() => { copyBtn.textContent = "複製籤詩"; }, 1600);
    } catch {
      copyBtn.textContent = "請長按文字複製";
    }
  });

  againBtn.addEventListener("click", resetDraw);

  const deityList = document.querySelector("#deityList");
  deities.forEach(deity => {
    const item = document.createElement("div");
    item.className = "deity-item";
    item.innerHTML = `<strong>${deity.name}</strong><span>${deity.attitude}</span>`;
    deityList.append(item);
  });

  const requested = Number(new URLSearchParams(location.search).get("lot"));
  if (Number.isInteger(requested) && requested >= 1 && requested <= 108) {
    showOracle(oracles.find(item => item.number === requested), false);
  }
})();
