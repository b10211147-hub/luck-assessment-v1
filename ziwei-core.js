/*
 * 奉母宮紫微斗數第一版排盤核心
 *
 * 規則範圍：命身宮、五行局、十二宮、十四主星、生年四化。
 * 安星算法依《紫微斗數全書》常見法則整理，並與 MIT 授權的 iztro
 * (https://github.com/SylarLong/iztro) 之 default algorithm 交叉核對。
 */
(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory(require("./assets/lunar.js"));
  } else {
    root.ZiweiCore = factory(root);
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function (lunarLib) {
  "use strict";

  const Solar = lunarLib.Solar;
  const STEMS = [..."甲乙丙丁戊己庚辛壬癸"];
  const BRANCHES = [..."子丑寅卯辰巳午未申酉戌亥"];
  const PALACE_BRANCHES = [..."寅卯辰巳午未申酉戌亥子丑"];
  const PALACE_NAMES = ["命宮", "父母宮", "福德宮", "田宅宮", "官祿宮", "僕役宮", "遷移宮", "疾厄宮", "財帛宮", "子女宮", "夫妻宮", "兄弟宮"];
  const FIVE_ELEMENT_CLASS = {
    1: { name: "木三局", value: 3 },
    2: { name: "金四局", value: 4 },
    3: { name: "水二局", value: 2 },
    4: { name: "火六局", value: 6 },
    5: { name: "土五局", value: 5 }
  };
  const TIGER_START = { 甲: 2, 乙: 4, 丙: 6, 丁: 8, 戊: 0, 己: 2, 庚: 4, 辛: 6, 壬: 8, 癸: 0 };
  const MUTAGENS = {
    甲: ["廉貞", "破軍", "武曲", "太陽"],
    乙: ["天機", "天梁", "紫微", "太陰"],
    丙: ["天同", "天機", "文昌", "廉貞"],
    丁: ["太陰", "天同", "天機", "巨門"],
    戊: ["貪狼", "太陰", "右弼", "天機"],
    己: ["武曲", "貪狼", "天梁", "文曲"],
    庚: ["太陽", "武曲", "太陰", "天同"],
    辛: ["巨門", "太陽", "文曲", "文昌"],
    壬: ["天梁", "紫微", "左輔", "武曲"],
    癸: ["破軍", "巨門", "太陰", "貪狼"]
  };
  const MUTAGEN_LABELS = ["化祿", "化權", "化科", "化忌"];
  const TIME_LABELS = [
    "早子時 00:00–00:59", "丑時 01:00–02:59", "寅時 03:00–04:59", "卯時 05:00–06:59",
    "辰時 07:00–08:59", "巳時 09:00–10:59", "午時 11:00–12:59", "未時 13:00–14:59",
    "申時 15:00–16:59", "酉時 17:00–18:59", "戌時 19:00–20:59", "亥時 21:00–22:59",
    "晚子時 23:00–23:59"
  ];

  function mod(value, base = 12) {
    return ((value % base) + base) % base;
  }

  function assertDate(dateText) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateText || "")) throw new Error("請輸入完整的國曆出生日期");
    const [year, month, day] = dateText.split("-").map(Number);
    if (year < 1900 || year > 2100) throw new Error("第一版支援 1900 至 2100 年的出生日期");
    const probe = new Date(Date.UTC(year, month - 1, day));
    if (probe.getUTCFullYear() !== year || probe.getUTCMonth() !== month - 1 || probe.getUTCDate() !== day) {
      throw new Error("出生日期格式不正確");
    }
    return { year, month, day };
  }

  function getFiveElementsClass(stem, branch) {
    const stemNumber = Math.floor(STEMS.indexOf(stem) / 2) + 1;
    const branchNumber = Math.floor(mod(BRANCHES.indexOf(branch), 6) / 2) + 1;
    let key = stemNumber + branchNumber;
    while (key > 5) key -= 5;
    return FIVE_ELEMENT_CLASS[key];
  }

  function placeMainStars(ziweiIndex, tianfuIndex, transformations) {
    const palaces = Array.from({ length: 12 }, () => []);
    const ziweiGroup = ["紫微", "天機", "", "太陽", "武曲", "天同", "", "", "廉貞"];
    const tianfuGroup = ["天府", "太陰", "貪狼", "巨門", "天相", "天梁", "七殺", "", "", "", "破軍"];
    ziweiGroup.forEach((name, offset) => {
      if (name) palaces[mod(ziweiIndex - offset)].push({ name, transformation: transformations[name] || "" });
    });
    tianfuGroup.forEach((name, offset) => {
      if (name) palaces[mod(tianfuIndex + offset)].push({ name, transformation: transformations[name] || "" });
    });
    return palaces;
  }

  function calculate(input) {
    if (!Solar) throw new Error("農曆換算元件尚未載入");
    const dateParts = assertDate(input.birthDate);
    const timeIndex = Number(input.timeIndex);
    if (!Number.isInteger(timeIndex) || timeIndex < 0 || timeIndex > 12) throw new Error("請選擇出生時辰");

    const solar = Solar.fromYmdHms(dateParts.year, dateParts.month, dateParts.day, timeIndex === 12 ? 23 : Math.max(0, timeIndex * 2), 0, 0);
    const lunar = solar.getLunar();
    const lunarMonth = Math.abs(lunar.getMonth());
    const lunarDay = lunar.getDay();
    const isLeapMonth = lunar.getMonth() < 0;
    const adjustedMonth = lunarMonth + (isLeapMonth && lunarDay > 15 && timeIndex !== 12 ? 1 : 0);
    const monthIndex = mod(adjustedMonth - 1);
    const timeBranchIndex = mod(timeIndex);
    const soulIndex = mod(monthIndex - timeBranchIndex);
    const bodyIndex = mod(monthIndex + timeBranchIndex);
    const yearStem = lunar.getYearGan();
    const yearBranch = lunar.getYearZhi();
    const tigerStart = TIGER_START[yearStem];
    const lifeStem = STEMS[mod(tigerStart + soulIndex, 10)];
    const lifeBranch = PALACE_BRANCHES[soulIndex];
    const fiveElementsClass = getFiveElementsClass(lifeStem, lifeBranch);

    const starLunar = timeIndex === 12 ? solar.next(1).getLunar() : lunar;
    const placementDay = starLunar.getDay();
    let offset = 0;
    while ((placementDay + offset) % fiveElementsClass.value !== 0) offset += 1;
    const quotient = Math.floor((placementDay + offset) / fiveElementsClass.value) % 12;
    const ziweiIndex = mod(quotient - 1 + (offset % 2 === 0 ? offset : -offset));
    const tianfuIndex = mod(12 - ziweiIndex);

    const transformationTargets = MUTAGENS[yearStem];
    const transformations = Object.fromEntries(transformationTargets.map((name, index) => [name, MUTAGEN_LABELS[index]]));
    const starsByPalace = placeMainStars(ziweiIndex, tianfuIndex, transformations);
    const palaceNames = PALACE_BRANCHES.map((_, index) => PALACE_NAMES[mod(index - soulIndex)]);
    const palaces = PALACE_BRANCHES.map((branch, index) => ({
      index,
      name: palaceNames[index],
      heavenlyStem: STEMS[mod(tigerStart + index, 10)],
      earthlyBranch: branch,
      isSoul: index === soulIndex,
      isBody: index === bodyIndex,
      stars: starsByPalace[index]
    }));
    const fourTransformations = transformationTargets.map((name, index) => {
      const palace = palaces.find((item) => item.stars.some((star) => star.name === name));
      return {
        label: MUTAGEN_LABELS[index],
        star: name,
        palaceIndex: palace ? palace.index : null,
        palaceName: palace ? palace.name : null,
        status: palace ? "calculated" : "first-version-pending"
      };
    });
    const triadIndexes = [soulIndex, mod(soulIndex + 4), mod(soulIndex + 8), mod(soulIndex + 6)];

    return {
      version: "1.0.0",
      createdAt: new Date().toISOString(),
      input: {
        clientName: String(input.clientName || "").trim(),
        gender: input.gender === "女" ? "女" : "男",
        birthDate: input.birthDate,
        timeIndex,
        timeLabel: TIME_LABELS[timeIndex],
        birthPlace: String(input.birthPlace || "台灣").trim() || "台灣",
        timezone: "Asia/Taipei"
      },
      calendar: {
        solarDate: input.birthDate,
        lunarYear: lunar.getYear(),
        lunarMonth,
        lunarDay,
        isLeapMonth,
        display: `${lunar.getYearInGanZhi()}年 ${isLeapMonth ? "閏" : ""}${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
        yearStem,
        yearBranch,
        yearGanZhi: `${yearStem}${yearBranch}`,
        leapMonthRule: isLeapMonth ? "閏月前十五日依本月、十六日起依次月安命身宮" : "非閏月"
      },
      soulIndex,
      bodyIndex,
      lifeStem,
      lifeBranch,
      fiveElementsClass,
      ziweiIndex,
      tianfuIndex,
      palaces,
      fourTransformations,
      triadIndexes,
      limitations: [
        "採 Asia/Taipei 民用標準時間（UTC+8），第一版未依出生地經緯度換算真太陽時。",
        "歲首採農曆正月初一；閏月十六日起按次月安命身宮；晚子時按次日農曆日數起紫微星。",
        "第一版暫未計算左輔、右弼、文昌、文曲等輔星宮位；若生年四化落在這些星曜，僅列四化星名。",
        "第一版暫未計算星曜旺廟、命主身主、輔煞雜曜、大限與流年流月。",
        "性別在第一版僅作案例記錄；尚未計算需依陰陽男女判定順逆的大限。"
      ]
    };
  }

  return {
    calculate,
    getFiveElementsClass,
    constants: { STEMS, BRANCHES, PALACE_BRANCHES, PALACE_NAMES, TIME_LABELS, MUTAGENS }
  };
});
