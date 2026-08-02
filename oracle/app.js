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
      themes: ["工作", "事業", "財運", "合作", "格局", "名聲", "謀略", "根基"]
    },
    {
      key: "wealth", label: "財運走勢", icon: "財",
      themes: ["財運", "事業", "工作", "合作", "格局", "根基", "福德", "厚德"]
    },
    {
      key: "love", label: "感情", icon: "緣",
      themes: ["感情", "情緣", "放下"]
    },
    {
      key: "people", label: "人際", icon: "和",
      themes: ["人際", "朋友", "合作", "官非", "化解", "品德"]
    },
    {
      key: "exam", label: "考試", icon: "學",
      themes: ["學習", "學業", "考驗", "洞察"]
    },
    {
      key: "family", label: "家庭", icon: "家",
      themes: ["家庭", "家運", "居所", "日常", "根基"]
    },
    {
      key: "health", label: "健康", icon: "安",
      themes: ["身心", "苦心", "日常", "復原"]
    }
  ];

  const aspectBanks = {
    career: {
      positive: ["局勢已有向前的條件", "能力正逐漸被看見", "新的發展窗口正在形成"],
      steady: ["現在更需要穩住節奏", "成果仍在累積期", "眼前宜先整頓再擴張"],
      caution: ["職場訊息仍有不明之處", "目前容易因急切而判斷失準", "責任與風險尚未完全釐清"],
      turn: ["先完成最能證明價值的工作，再談下一個位置", "把目標、期限與責任寫清楚，減少內耗", "選一件能長期累積的能力，連續投入而不分心"],
      outcome: ["努力較容易轉成穩定成果", "後續將有更清楚的選擇權", "職場關係與發展空間會逐步打開"]
    },
    wealth: {
      positive: ["正財與累積條件正在轉強", "財務有逐步開源的跡象", "眼前已有讓收入更穩的機會"],
      steady: ["財運宜以守成與整理為先", "進財速度不快，但仍能逐步累積", "目前重點在減少耗損而非追逐快利"],
      caution: ["金錢判斷容易受急切與消息影響", "近期有支出放大或財務漏洞的可能", "看似快速的利益背後仍有風險未明"],
      turn: ["先盤點收支、債務與未收款，再決定下一筆資金用途", "把收入分成生活、儲蓄與成長三部分，先存再用", "看不懂的投資不碰，重大金錢決定至少隔一晚再確認"],
      outcome: ["財庫會從容易流失轉向能夠留下", "收支秩序建立後，財務壓力可逐步減輕", "正財較有機會穩定，對金錢也會更有掌握感"]
    },
    love: {
      positive: ["緣分有往真誠靠近的可能", "彼此之間仍有理解與靠近的空間", "感情正適合用真心推進"],
      steady: ["關係需要時間看清彼此", "現在宜先分辨真實與想像", "情意不弱，但節奏仍需調整"],
      caution: ["感情裡的焦慮正在放大猜測", "單方面用力容易讓自己受傷", "眼前不宜只憑一時感動下決定"],
      turn: ["用一次不試探、不逼迫的對話說清楚心意", "觀察對方是否長期言行一致，不替沉默找答案", "先守住自我價值，再決定這段關係是否值得前進"],
      outcome: ["真緣會更清楚，錯緣也較能平和放下", "彼此若有心，關係會走向穩定而非猜測", "你會更明白自己真正需要的愛是什麼"]
    },
    people: {
      positive: ["周圍已有可互相成就的善緣", "真誠往來容易得到正面回應", "人際局面有重新變暖的跡象"],
      steady: ["人與人之間仍在建立信任", "目前要先看清誰願意互相", "關係的品質比數量更重要"],
      caution: ["口舌與誤解容易從小處擴大", "有人情與責任混在一起的情況", "不透明的往來可能帶來消耗"],
      turn: ["少傳一句未查證的話，多做一次直接確認", "把界線與承諾說明白，只承擔自己能負責的部分", "主動靠近真誠可靠的人，逐步遠離反覆消耗的關係"],
      outcome: ["留下來的人會更值得信任", "誤會可逐步化開，合作也會更順", "你的人際圈將從熱鬧轉向真正有支持力"]
    },
    exam: {
      positive: ["理解與吸收能力正處在可提升的階段", "準備方向大致正確", "已有把實力轉成成績的條件"],
      steady: ["進步需要靠規律累積", "目前不是不會，而是基本功還要補齊", "讀書節奏比一次衝刺更重要"],
      caution: ["焦慮與分心可能壓過原有實力", "臨時硬撐容易讓判斷失常", "弱項若繼續迴避，考場上會更明顯"],
      turn: ["整理錯題原因，先攻克最常失分的一類", "用固定時段複習並保留睡眠，不用熬夜換心安", "把不懂的問題具體列出，向老師或同學問到真正理解"],
      outcome: ["臨場時較能穩定取回原有實力", "成績會隨方法調整而逐步上升", "你會從害怕題目，轉成知道如何拆解題目"]
    },
    family: {
      positive: ["家中仍有彼此扶持的力量", "家庭氣氛有重新和順的條件", "一家人的心有機會再次靠攏"],
      steady: ["家務與責任需要重新協調", "家人不是無情，只是表達方式不同", "日常的小摩擦正等待有人先放柔"],
      caution: ["舊帳與情緒容易讓談話失焦", "界線不清已讓親情變成壓力", "家中的安全與秩序需要被正視"],
      turn: ["先處理一件具體家務或責任，不在情緒裡一次解決所有舊事", "用詢問代替責怪，讓每個人把需要說完", "把金錢、時間與照顧責任寫清楚，避免愛變成理所當然"],
      outcome: ["家人會更知道如何互相幫忙", "關係可從對立慢慢回到同一邊", "家中秩序穩定後，人的心也會安定下來"]
    },
    health: {
      positive: ["身心仍有良好的恢復力量", "規律調養容易看見改善", "目前適合把健康基礎重新養穩"],
      steady: ["疲勞需要被認真照顧", "身體正在提醒你調整節奏", "恢復不宜求快，重點是持續"],
      caution: ["身體警訊不宜再被忽略", "壓力或拖延可能讓不適加重", "現在最重要的是先釐清真實狀況"],
      turn: ["先恢復睡眠、飲食與適度活動，再觀察身體變化", "記錄症狀與作息，讓專業人員能掌握完整情況", "減少一項非必要消耗，替身體留下真正休息的時間"],
      outcome: ["身體與情緒較能回到可掌握的節奏", "你會更清楚什麼生活方式真正適合自己", "穩定照顧能讓精神與行動力慢慢回來"]
    }
  };

  const deityLenses = {
    "無極老母娘": {
      career: "先安住心，不用靠工作成敗證明自己的價值", wealth: "錢財不是你的價值，先守住已有的福與安穩", love: "真心不必追趕，也不該用委屈交換", people: "善待別人之前，也要把自己的心照顧好", exam: "照自己的節奏扎根，不被他人的速度擾亂", family: "柔軟不是退讓，而是替家人留一條回來的路", health: "累了就休息，不必為需要照顧而自責"
    },
    "驪山老母": {
      career: "先讓能力配得上機會，再談位置與掌聲", wealth: "看不懂的錢不要賺，風險與條件一定先查清", love: "清醒觀察長期行動，不被短暫熱烈迷惑", people: "規矩與界線說得清楚，關係才能長久", exam: "調整方法、理解原理，比死背更能突破", family: "愛也需要清楚分工，不能用含糊維持和平", health: "面對警訊要查明，不拖延也不自行猜測"
    },
    "瑤池金母": {
      career: "把眼光放到長遠，以品德與格局承接位置", wealth: "財要來得正、守得穩，也要用在真正有價值之處", love: "彼此尊重且各自完整，才有長久的好緣", people: "選擇價值觀相近的人，不只看眼前能力", exam: "先建立秩序與架構，知識才容易融會貫通", family: "家中有序、彼此有分寸，福氣才住得安穩", health: "照顧自己是尊重生命，不等倒下才承認疲憊"
    },
    "觀音菩薩": {
      career: "不必把所有責任都扛在自己身上", wealth: "先放下比較與焦慮，夠用並能安心也是一種富足", love: "放下控制與猜測，讓真心有呼吸的空間", people: "先聽見對方未說出口的苦，再決定如何回應", exam: "不懂時勇敢求助，開口就可能遇見一盞燈", family: "家人的尖銳背後，也許藏著沒有被聽見的委屈", health: "允許自己慢下來，身心才有機會真正跟上"
    },
    "玄天上帝": {
      career: "方向若正就要果決，先除內耗再向前", wealth: "先堵住漏洞、清掉舊帳，再用正道開源", love: "不清不楚的關係，必須用真話照明", people: "面對爭議靠事實、紀錄與正當程序", exam: "紀律比一時情緒可靠，該做的功課不能逃", family: "該立的規矩要立，安全與責任不能含糊", health: "勇敢不是硬撐，而是及時檢查與處理"
    },
    "九天玄女": {
      career: "先看全局與關鍵節點，再集中資源出手", wealth: "分散風險並保留現金，財路才能進退有餘", love: "不要只看當下甜苦，要看長期互動模式", people: "先對齊資訊與利益，再決定信任的深度", exam: "用系統串起知識，找出能帶動全局的弱點", family: "先消除資訊落差，許多誤解便不攻自破", health: "找出真正耗能的來源，減少雜訊與反覆切換"
    },
    "地母元君": {
      career: "務實耕耘每天可累積的事，根穩才走得遠", wealth: "小財常聚也能成庫，穩定留下才是真正的財", love: "真心要看日常是否願意照顧、分擔與守信", people: "可靠比花俏重要，先看對方如何完成小事", exam: "基本功不能省，日日重溫才能臨場從容", family: "家不是一個人撐起來的，要讓眾人一起分擔", health: "回到規律作息與正常生活，比追求奇法可靠"
    },
    "中壇元帥": {
      career: "先做出可驗證的小成果，再邊走邊修正", wealth: "有本事賺也要有本事留，先存一份再開心使用", love: "喜歡就真誠表達，不用冷淡與猜心包裝", people: "講義氣也要講道理，不替別人扛完後果", exam: "把難題變成關卡，親手做過會記得更牢", family: "有話直說但把聲音放低，別讓急心變怒氣", health: "別只困在腦中，適量活動能幫助身心換氣"
    },
    "下壇元帥": {
      career: "先把每件答應的小事做好，信用自然累積", wealth: "便宜不等於省錢，先分清需要與一時心動", love: "關心要讓對方感受到，承諾也要做得到", people: "未查證的話不傳，重要事情直接問當事人", exam: "每天學一點，比偶爾熬夜拼命更有用", family: "看見日常付出，一句感謝能化開許多怨氣", health: "水要喝、飯要吃、覺要睡，先把基本照顧做好"
    }
  };

  function guidanceTone(level) {
    if (/上上|大吉|上吉|速吉|快吉|明吉/.test(level)) return "positive";
    if (/警|慎|凶|官非|斷吉/.test(level)) return "caution";
    return "steady";
  }

  function pick(list, seed) {
    return list[Math.abs(seed) % list.length];
  }

  function getAspectGuidance(oracle, aspect, aspectIndex = 0) {
    const tone = guidanceTone(oracle.level);
    const bank = aspectBanks[aspect.key];
    const seed = oracle.number * 7 + aspectIndex * 11;
    const related = aspect.themes.includes(oracle.theme);
    const quotedLine = oracle.poem[(oracle.number + aspectIndex) % oracle.poem.length];
    const lens = deityLenses[oracle.deity][aspect.key];
    const turn = related ? `依「${oracle.title}」落在${aspect.label}的提醒，${oracle.advice}` : `${pick(bank.turn, seed + 1)}；把「${oracle.title}」的提醒落實成今天能完成的一步。`;
    const healthNote = aspect.key === "health" ? " 此項僅供信仰與生活整理參考，不能取代醫療診斷。" : "";
    return {
      rise: `籤題「${oracle.title}」映照到${aspect.label}，${pick(bank[tone], seed)}。`,
      carry: `詩中「${quotedLine}」點出關鍵：${lens}；本籤的主軸仍在「${oracle.theme}」。`,
      turn: `${turn}${healthNote}`,
      close: `循此而行，${pick(bank.outcome, seed + 2)}；守住「${oracle.title}」所示的${oracle.theme}功課，結果仍要靠你的選擇與持續行動來完成。`
    };
  }

  function renderAspects(oracle) {
    aspectGrid.replaceChildren(...aspectDefinitions.map((aspect, aspectIndex) => {
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
      const guidance = getAspectGuidance(oracle, aspect, aspectIndex);
      const flow = document.createElement("div");
      flow.className = "guidance-flow";
      [
        ["起", "現況", guidance.rise],
        ["承", "關鍵", guidance.carry],
        ["轉", "行動", guidance.turn],
        ["合", "走向", guidance.close]
      ].forEach(([mark, label, content]) => {
        const row = document.createElement("div");
        row.className = "guidance-step";
        const badge = document.createElement("span");
        badge.className = "guidance-mark";
        badge.textContent = mark;
        const body = document.createElement("p");
        const name = document.createElement("b");
        name.textContent = label;
        body.append(name, document.createTextNode(content));
        row.append(badge, body);
        flow.append(row);
      });
      heading.append(icon, title);
      article.append(heading, flow);
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
      ...aspectDefinitions.map((aspect, aspectIndex) => {
        const guidance = getAspectGuidance(currentOracle, aspect, aspectIndex);
        return `\n${aspect.label}\n起・現況｜${guidance.rise}\n承・關鍵｜${guidance.carry}\n轉・行動｜${guidance.turn}\n合・走向｜${guidance.close}`;
      })
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
