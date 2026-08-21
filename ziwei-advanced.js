/* 奉母宮紫微斗數進階排盤層：以固定版本 iztro 2.5.8 補足旺廟、雜曜神煞與運限。 */
(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) {
    if (typeof globalThis.self === "undefined") globalThis.self = globalThis;
    module.exports = factory(require("./assets/vendor/iztro-2.5.8.min.js"));
  } else {
    root.ZiweiAdvanced = factory(root.iztro);
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function (iztroLib) {
  "use strict";

  const VERSION = "2.5.8";
  const MUTAGEN_LABELS = ["化祿", "化權", "化科", "化忌"];
  const TIME_LABELS = [
    "早子時 00:00–00:59", "丑時 01:00–02:59", "寅時 03:00–04:59", "卯時 05:00–06:59",
    "辰時 07:00–08:59", "巳時 09:00–10:59", "午時 11:00–12:59", "未時 13:00–14:59",
    "申時 15:00–16:59", "酉時 17:00–18:59", "戌時 19:00–20:59", "亥時 21:00–22:59",
    "晚子時 23:00–23:59"
  ];

  function dateText(value) {
    const text = String(value || "");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new Error("請選擇完整的運限日期");
    const [year, month, day] = text.split("-").map(Number);
    const probe = new Date(Date.UTC(year, month - 1, day));
    if (year < 1900 || year > 2100 || probe.getUTCFullYear() !== year || probe.getUTCMonth() !== month - 1 || probe.getUTCDate() !== day) {
      throw new Error("運限日期需介於 1900 至 2100 年");
    }
    return text;
  }

  function currentTimeIndex(date = new Date()) {
    const hour = date.getHours();
    if (hour === 23) return 12;
    if (hour === 0) return 0;
    return Math.floor((hour + 1) / 2);
  }

  function localToday(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function compactStar(star) {
    return { name: star.name, type: star.type || "", scope: star.scope || "", brightness: star.brightness || "", transformation: star.mutagen ? `化${star.mutagen}` : "" };
  }

  function compactPeriod(item) {
    return {
      name: item.name,
      index: item.index,
      heavenlyStem: item.heavenlyStem,
      earthlyBranch: item.earthlyBranch,
      palaceNames: [...item.palaceNames],
      transformations: item.mutagen.map((star, index) => ({ label: MUTAGEN_LABELS[index], star })),
      stars: item.stars ? item.stars.map((stars) => stars.map(compactStar)) : Array.from({ length: 12 }, () => [])
    };
  }

  function enrich(result, sourceInput = {}) {
    if (!iztroLib || !iztroLib.astro) throw new Error("進階排盤元件尚未載入");
    iztroLib.astro.config({ algorithm: "default", yearDivide: "normal", horoscopeDivide: "normal", ageDivide: "normal", dayDivide: "forward" });
    const birthDate = result.input.birthDate;
    const timeIndex = Number(result.input.timeIndex);
    const gender = result.input.gender;
    const astrolabe = iztroLib.astro.bySolar(birthDate, timeIndex, gender, true, "zh-TW");

    astrolabe.palaces.forEach((officialPalace, index) => {
      const palace = result.palaces[index];
      const expected = palace.stars.map((star) => star.name).sort().join("、");
      const actual = officialPalace.majorStars.map((star) => star.name).sort().join("、");
      if (expected !== actual) throw new Error(`進階排盤核對不一致：${palace.earthlyBranch}宮主星`);
      palace.stars = officialPalace.majorStars.map((star) => ({ name: star.name, brightness: star.brightness || "", transformation: star.mutagen ? `化${star.mutagen}` : "" }));
      palace.minorStars = officialPalace.minorStars.map(compactStar);
      palace.adjectiveStars = officialPalace.adjectiveStars.map(compactStar);
      palace.changsheng12 = officialPalace.changsheng12;
      palace.boshi12 = officialPalace.boshi12;
      palace.jiangqian12 = officialPalace.jiangqian12;
      palace.suiqian12 = officialPalace.suiqian12;
      palace.ages = [...officialPalace.ages];
      palace.decadal = { range: [...officialPalace.decadal.range], heavenlyStem: officialPalace.decadal.heavenlyStem, earthlyBranch: officialPalace.decadal.earthlyBranch };
    });

    result.soulRuler = astrolabe.soul;
    result.bodyRuler = astrolabe.body;
    result.version = "1.2.0";
    const horoscopeDate = dateText(sourceInput.horoscopeDate || result.input.horoscopeDate || localToday());
    const rawTimeIndex = sourceInput.horoscopeTimeIndex ?? result.input.horoscopeTimeIndex ?? currentTimeIndex();
    const horoscopeTimeIndex = Number(rawTimeIndex);
    if (!Number.isInteger(horoscopeTimeIndex) || horoscopeTimeIndex < 0 || horoscopeTimeIndex > 12) throw new Error("請選擇流時時辰");
    const horoscope = astrolabe.horoscope(horoscopeDate, horoscopeTimeIndex);
    result.input.horoscopeDate = horoscopeDate;
    result.input.horoscopeTimeIndex = horoscopeTimeIndex;
    result.input.horoscopeTimeLabel = TIME_LABELS[horoscopeTimeIndex];
    result.advanced = {
      engine: `iztro ${VERSION}`,
      copyright: astrolabe.copyright,
      solarDate: horoscope.solarDate,
      lunarDate: horoscope.lunarDate,
      age: {
        index: horoscope.age.index,
        nominalAge: horoscope.age.nominalAge,
        name: horoscope.age.name,
        heavenlyStem: horoscope.age.heavenlyStem,
        earthlyBranch: horoscope.age.earthlyBranch,
        palaceNames: [...horoscope.age.palaceNames],
        transformations: horoscope.age.mutagen.map((star, index) => ({ label: MUTAGEN_LABELS[index], star }))
      },
      periods: {
        decadal: compactPeriod(horoscope.decadal),
        yearly: compactPeriod(horoscope.yearly),
        monthly: compactPeriod(horoscope.monthly),
        daily: compactPeriod(horoscope.daily),
        hourly: compactPeriod(horoscope.hourly)
      }
    };
    result.limitations = [
      "採 Asia/Taipei 民用標準時間（UTC+8），第一版仍未依出生地經緯度換算真太陽時。",
      "歲首採農曆正月初一；閏月十六日起按次月安命身宮；晚子時按次日農曆日數起紫微星。",
      `主星與輔星旺廟、長生十二神、博士十二神、雜曜與歲前／將前神煞，採 ${result.advanced.engine} default algorithm。`,
      "大限、流年、流月、流日與流時均依選定運限日期及時辰計算，並列出各層四化與流曜。",
      "運限日期用於定位時間層，不代表自動預測吉凶；格局、事件與應期仍需老師合盤核對。"
    ];
    return result;
  }

  return { enrich, currentTimeIndex, localToday, constants: { VERSION, MUTAGEN_LABELS, TIME_LABELS } };
});
