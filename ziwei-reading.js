/* 奉母宮紫微斗數第一版解讀層：解讀已可靠計算的主輔星、生年四化、命身主與宮位關係。 */
(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) module.exports = factory();
  else root.ZiweiReading = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const STAR_GUIDES = {
    紫微: { core: "主導、整合、秩序與承擔", strength: "能把人事資源收攏，建立方向與規則", watch: "容易把責任全攬在身上，或期待他人照自己的標準運作", question: "遇到需要帶頭的情況，會選擇親自掌控，還是分工授權？" },
    天機: { core: "思考、策劃、變通與移動", strength: "能快速看見替代方案，善於調整方法", watch: "想法過多時可能反覆衡量，執行深度不足", question: "目前最需要的是更多方案，還是選定一個方向持續完成？" },
    太陽: { core: "公開、付出、責任與影響力", strength: "願意站到前方承擔，也容易照顧整體", watch: "過度付出或追求被肯定時，可能忽略自己的界線", question: "現在的付出是出於自願，還是因為覺得自己必須負責？" },
    武曲: { core: "執行、效率、成果與資源", strength: "務實果決，面對任務時能迅速進入行動", watch: "過度重視結果時，可能少了溝通與前期規劃", question: "這件事除了做成以外，還需要哪些協調或關係成本？" },
    天同: { core: "和氣、舒適、協調與感受", strength: "能柔化緊張，營造較容易合作的氣氛", watch: "為維持和氣而延後面對問題，可能讓事情累積", question: "現在的退讓是真的放下，還是暫時不想處理衝突？" },
    廉貞: { core: "原則、界線、自我要求與企圖", strength: "對制度與人際分寸敏感，能看見不合理之處", watch: "保護意識太強時，容易顯得緊繃或不易交心", question: "這條界線是在保護重要價值，還是已經限制了合作？" },
    天府: { core: "穩定、承接、包容與管理", strength: "擅長守住基礎、配置資源並維持長期運作", watch: "過度求穩時，可能錯過需要主動改變的時機", question: "目前更需要守成，還是可以從穩定基礎上往外開展？" },
    太陰: { core: "內在感受、細節、累積與審美", strength: "觀察細膩，能照顧感受並長期累積", watch: "受環境與關係影響較深時，容易把情緒留在心裡", question: "這份敏感正在提供洞察，還是已經變成過度擔心？" },
    貪狼: { core: "人際、體驗、欲望與多元可能", strength: "適應力與交流能力強，能開拓興趣和連結", watch: "選項過多或追求新鮮時，容易分散長期投入", question: "目前最值得留下並長期培養的興趣或關係是哪一個？" },
    巨門: { core: "辨析、表達、追問與疑惑", strength: "能發現問題、說明差異，適合深入討論", watch: "過度反覆確認時，溝通可能變成懷疑或爭辯", question: "這次溝通的目的是釐清事實，還是證明自己的看法？" },
    天相: { core: "協調、公平、角色與分工", strength: "能兼顧不同立場，整理出可執行的合作方式", watch: "太在意整體和諧時，可能壓低自己的真實立場", question: "在照顧所有人的同時，自己的需求有沒有被清楚說出？" },
    天梁: { core: "原則、保護、經驗與提醒", strength: "重視長期影響，願意提供照顧與建議", watch: "站在保護者位置太久，容易替別人承擔過多", question: "這次是需要給建議，還是陪對方自己做決定？" },
    七殺: { core: "決斷、承壓、開創與風險", strength: "在壓力與不確定中仍能快速採取行動", watch: "速度過快時，可能忽略緩衝、細節與他人節奏", question: "行動前最少要完成哪一項風險檢查，才能放心推進？" },
    破軍: { core: "重整、突破、汰舊與重新開始", strength: "能切開僵局，處理需要大幅改變的情況", watch: "只看見必須改變時，可能一併捨棄仍有價值的基礎", question: "真正需要淘汰的是什麼？有哪些基礎應該先保留下來？" }
  };
  const MINOR_STAR_GUIDES = {
    左輔: { core: "協助、組織與同儕支援" },
    右弼: { core: "協調、人情與合作支援" },
    文昌: { core: "條理、文書、表達與學習" },
    文曲: { core: "感受、才藝、交流與修飾" },
    天魁: { core: "制度內的提攜與明顯助力" },
    天鉞: { core: "關係中的照應與隱性助力" },
    祿存: { core: "資源、累積與守成" },
    天馬: { core: "移動、變化與外部機會" },
    擎羊: { core: "直接、突破與摩擦壓力" },
    陀羅: { core: "延宕、反覆與耐力考驗" },
    火星: { core: "急速、爆發與立即反應" },
    鈴星: { core: "緊繃、敏銳與內在壓力" },
    地空: { core: "抽離、落差與重新理解價值" },
    地劫: { core: "變動、耗損與資源重整" }
  };

  const PALACE_GUIDES = {
    命宮: { domain: "自我定位、性格基調與面對人生的主要方式", focus: "看一個人如何理解自己、如何起步與回應環境", question: "當事人最常用哪一種方式處理壓力與選擇？" },
    兄弟宮: { domain: "手足、同輩、合作支援與資源分配", focus: "觀察平輩關係中的距離、互助與競爭", question: "在同輩合作中，最常出現的是互補、比較，還是責任不清？" },
    夫妻宮: { domain: "親密關係、伴侶期待與長期合作模式", focus: "不是直接斷婚姻好壞，而是看關係中重視的互動方式", question: "關係裡最需要被說清楚的是承諾、界線，還是情感表達？" },
    子女宮: { domain: "子女、晚輩、教養、創作與成果延伸", focus: "觀察如何帶領下一代，也可看創意與作品的表達方式", question: "面對晚輩或作品，較常選擇控制方向，還是給予發展空間？" },
    財帛宮: { domain: "金錢觀、取得資源與使用資源的方式", focus: "不單看有沒有錢，而是看如何賺取、管理與評估價值", question: "目前財務課題偏向開源、守成、規劃，還是風險控制？" },
    疾厄宮: { domain: "身體感受、壓力反應與日常照顧習慣", focus: "只作生活節奏與壓力觀察，不用星曜診斷疾病", question: "壓力最常透過睡眠、情緒、飲食或活動節奏中的哪一處被察覺？", caution: "健康相關內容不能代替醫療診斷；有症狀或疑慮應尋求合格醫療專業。" },
    遷移宮: { domain: "外在環境、移動、公開場合與他人眼中的表現", focus: "觀察離開熟悉環境後如何應變，以及外界提供的機會與壓力", question: "在新環境中，當事人會更主動表現，還是先觀察再調整？" },
    僕役宮: { domain: "朋友、同事、部屬、客戶與合作網絡", focus: "觀察人際圈的互動品質、分工方式與支持來源", question: "目前合作卡點在人選、信任、溝通，還是權責分配？" },
    官祿宮: { domain: "工作角色、職涯方向、責任與做事方式", focus: "不只看職業名稱，也看如何承接任務與建立成就感", question: "工作中最能發揮的是規劃、執行、協調、照顧，還是開創？" },
    田宅宮: { domain: "家庭根基、居住感受、不動產與安全基礎", focus: "觀察需要什麼環境才能安定，以及如何累積可長期依靠的基礎", question: "現在最需要整理的是居住空間、家庭界線，還是長期資產規劃？" },
    福德宮: { domain: "內在節奏、精神感受、休息方式與滿足感", focus: "觀察獨處時的心理運作，以及什麼方式真正能恢復能量", question: "目前的休息是在補充能量，還是只暫時逃離壓力？" },
    父母宮: { domain: "父母長輩、師長、教育、文書與制度支持", focus: "觀察與權威及照顧者的互動，也可看學習與文件制度的承接", question: "面對長輩或制度時，最需要調整的是期待、溝通，還是界線？" }
  };

  const BODY_GUIDES = {
    命宮: "先天表現與後天行動較一致，人生課題容易直接反映在自我選擇上。",
    夫妻宮: "後天投入常受到伴侶、親密關係與長期合作影響。",
    財帛宮: "後天行動較重視資源、成果與可持續的生活基礎。",
    遷移宮: "後天發展常在外部環境、移動或公開互動中被推動。",
    官祿宮: "後天重心較容易落在工作角色、責任與成就建立。",
    福德宮: "後天選擇較受內在感受、價值與精神滿足牽引。"
  };

  const MUTAGEN_GUIDES = {
    化祿: { force: "增加、投入與容易感到有收穫", caution: "增加的不一定全是好處，也可能增加忙碌、消耗或依賴" },
    化權: { force: "掌握、責任、執行與想要做出成果", caution: "不等於一定升遷，也可能表示事情變多、要求提高" },
    化科: { force: "整理、可見度、名聲與緩和問題", caution: "不等於沒有困難，而是較傾向用制度、說明或專業處理" },
    化忌: { force: "在意、牽掛、反覆關注與想補足缺口", caution: "不等於災難；它常指出最容易投入心力、也最難放下的地方" }
  };

  function starsText(palace) {
    return palace.stars.length ? palace.stars.map((star) => star.name).join("、") : "無十四主星";
  }

  function minorStarsText(palace) {
    return palace.minorStars && palace.minorStars.length ? palace.minorStars.map((star) => star.name).join("、") : "無十四輔星落宮";
  }

  function starsWithBrightness(stars, emptyText) {
    return stars.length ? stars.map((star) => `${star.name}${star.brightness ? `（${star.brightness}）` : ""}`).join("、") : emptyText;
  }

  function palaceReading(palace, result) {
    const guide = PALACE_GUIDES[palace.name];
    const opposite = result.palaces[(palace.index + 6) % 12];
    const facts = `${palace.name}在${palace.heavenlyStem}${palace.earthlyBranch}，十四主星為${starsWithBrightness(palace.stars, "無十四主星")}，輔星為${starsWithBrightness(palace.minorStars, "無輔星")}；長生十二神${palace.changsheng12}、博士十二神${palace.boshi12}、歲前${palace.suiqian12}、將前${palace.jiangqian12}；雜曜為${palace.adjectiveStars.map((star) => star.name).join("、") || "無"}；大限為虛歲${palace.decadal.range[0]}–${palace.decadal.range[1]}歲${palace.isBody ? "，同時也是身宮" : ""}。`;
    let hint;
    if (palace.stars.length) {
      hint = palace.stars.map((star) => `${star.name}把「${STAR_GUIDES[star.name].core}」的基調帶入${palace.name}`).join("；") + "。";
    } else {
      hint = `本宮無十四主星，不代表這個面向不存在或一定較弱。第一版可先借對宮${opposite.name}的${starsText(opposite)}作為訪談線索，但不能直接視為同宮落星。`;
    }
    const mutagens = [...palace.stars, ...(palace.minorStars || [])].filter((star) => star.transformation);
    if (mutagens.length) hint += ` 本宮另見${mutagens.map((star) => `${star.name}${star.transformation}`).join("、")}，相關特質會成為較明顯的投入或關注點。`;
    return { palace, guide, facts, hint, question: guide.question, caution: guide.caution || "" };
  }

  function transformationReading(item, result) {
    const guide = MUTAGEN_GUIDES[item.label];
    if (item.status !== "calculated") {
      return { ...item, force: guide.force, text: `${item.star}${item.label}已依生年天干確定；但第一版尚未排出${item.star}宮位，因此不能進一步判斷落在哪個生活面向。`, caution: guide.caution };
    }
    const palace = result.palaces[item.palaceIndex];
    const starGuide = STAR_GUIDES[item.star] || MINOR_STAR_GUIDES[item.star];
    return { ...item, force: guide.force, text: `${item.star}的「${starGuide.core}」在${palace.name}呈現${guide.force}的傾向。`, caution: guide.caution };
  }

  function build(result) {
    const life = result.palaces[result.soulIndex];
    const body = result.palaces[result.bodyIndex];
    const opposite = result.palaces[(result.soulIndex + 6) % 12];
    const lifeSource = life.stars.length ? life : opposite;
    const coreStars = lifeSource.stars.map((star) => STAR_GUIDES[star.name]);
    const coreIntro = life.stars.length
      ? `命宮主星為${starsText(life)}，先天基調可從${coreStars.map((guide) => guide.core).join("，以及")}切入。`
      : `命宮無十四主星，第一版借對宮${opposite.name}的${starsText(opposite)}建立訪談線索；這是借宮參考，不等於主星直接落命。`;
    const bodyText = BODY_GUIDES[body.name]
      ? `身宮落在${body.name}：${BODY_GUIDES[body.name]}`
      : `身宮落在${body.name}，後天行動較容易把心力投入「${PALACE_GUIDES[body.name].domain}」。`;
    const triad = result.triadIndexes.map((index) => result.palaces[index]);
    const triadText = triad.map((palace) => `${palace.name}見${starsText(palace)}`).join("；");
    const lifeMinor = minorStarsText(life);
    const toughInLife = (life.minorStars || []).filter((star) => star.type === "tough");
    const auxiliaryHint = `命宮輔星為${starsWithBrightness(life.minorStars, "無輔星")}。輔星用來調整主星的表現情境，不取代主星；${toughInLife.length ? `其中${toughInLife.map((star) => star.name).join("、")}提示壓力與反應方式，需配合實際事件核對。` : "本宮未見煞曜，不代表人生沒有壓力，仍需合看三方四正。"}`;
    const firstDecadal = life.decadal;

    return {
      core: {
        fact: `命宮在${life.heavenlyStem}${life.earthlyBranch}，主星為${starsText(life)}；身宮落${body.name}；命主${result.soulRuler}、身主${result.bodyRuler}；五行局為${result.fiveElementsClass.name}。`,
        hint: `${coreIntro}${bodyText}命主與身主只作輔助觀察，不應取代命宮、身宮與三方四正。`,
        starGuides: lifeSource.stars.map((star) => ({ name: star.name, ...STAR_GUIDES[star.name], borrowed: !life.stars.length })),
        note: "五行局在第一版用於起紫微星與排盤，不單獨把五行局當成性格結論。"
      },
      triad: {
        fact: triadText + "。",
        hint: "命宮看自我起點，財帛宮看資源運用，官祿宮看承擔方式，遷移宮看外在回應。四宮需一起閱讀，才能避免只用單一主星概括整個人。",
        items: triad.map((palace, index) => ({ relation: index === 0 ? "本宮" : index === 3 ? "對宮" : "三合宮", palace, domain: PALACE_GUIDES[palace.name].domain }))
      },
      transformations: result.fourTransformations.map((item) => transformationReading(item, result)),
      palaces: result.palaces.map((palace) => palaceReading(palace, result)),
      extension: {
        rulers: {
          fact: `命主為${result.soulRuler}，依命宮地支${result.lifeBranch}而定；身主為${result.bodyRuler}，依生年地支${result.calendar.yearBranch}而定。`,
          hint: "命主可作先天反應的補充線索，身主可作後天實踐方式的補充線索；兩者權重低於命宮主星、身宮及三方四正。"
        },
        auxiliaries: { fact: `本盤已安十四輔星並列出可用旺廟；${auxiliaryHint}`, hint: "旺廟只描述星曜在該地支的傳統強弱語彙，不等於吉凶分數。吉曜不保證順利，煞曜也不等於災禍。" },
        advanced: {
          fact: `十二宮均已列出長生十二神、博士十二神、歲前十二神、將前十二神，以及共${result.palaces.flatMap((palace) => palace.adjectiveStars).length}顆雜曜。`,
          hint: "十二神與雜曜用於補充事件語境和觀察細節，權重低於主星、命身宮、三方四正與四化；不宜用單顆神煞直接下結論。"
        },
        decadals: {
          fact: `大限採${result.decadalDirection}，由${result.fiveElementsClass.name}的虛歲${firstDecadal.range[0]}歲起限，每十年移一宮。`,
          hint: "大限宮位與虛歲區間建立人生階段順序；本版另列大限四化與流曜，但仍需合看本命和流年，不自動斷定某十年的吉凶事件。",
          items: result.palaces.map((palace) => ({ palace, range: palace.decadal.range }))
        }
      },
      method: [
        "先確認出生資料、時辰交界與本頁時間口徑。",
        "先讀命宮主星；空宮時只借對宮作線索，不直接移星。",
        "再讀身宮，分辨先天基調與後天實際投入。",
        "合看命宮、財帛、官祿、遷移四個三方四正宮位。",
        "加入主輔星旺廟、十四輔星與雜曜神煞；旺廟不是分數，單顆神煞不直接定吉凶。",
        "再加入生年四化；祿權科忌都需與星曜本質及落宮一起解釋。",
        "依序疊入大限、流年、流月、流日、流時，逐層核對命宮、四化與流曜，不跨層單斷。",
        "用當事人的實際經驗驗證，保留門派差異與未計算項目的空白。"
      ]
    };
  }

  return { build, STAR_GUIDES, MINOR_STAR_GUIDES, PALACE_GUIDES, MUTAGEN_GUIDES, BODY_GUIDES };
});
