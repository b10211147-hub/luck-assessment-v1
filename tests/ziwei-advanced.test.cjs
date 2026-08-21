const assert = require("node:assert/strict");
const ZiweiCore = require("../ziwei-core.js");
const ZiweiAdvanced = require("../ziwei-advanced.js");

{
  const input = {
    birthDate: "2000-08-16",
    timeIndex: 2,
    gender: "女",
    birthPlace: "台北市",
    horoscopeDate: "2026-08-22",
    horoscopeTimeIndex: 6
  };
  const result = ZiweiAdvanced.enrich(ZiweiCore.calculate(input), input);
  assert.equal(result.version, "1.2.0");
  assert.equal(result.advanced.engine, "iztro 2.5.8");
  assert.equal(result.soulRuler, "破軍");
  assert.equal(result.bodyRuler, "文昌");
  assert.ok(result.palaces.flatMap((palace) => palace.stars).every((star) => star.brightness));
  assert.equal(result.palaces.flatMap((palace) => palace.minorStars).length, 14);
  assert.ok(result.palaces.flatMap((palace) => palace.adjectiveStars).length >= 30);
  assert.ok(result.palaces.every((palace) => palace.changsheng12 && palace.boshi12 && palace.jiangqian12 && palace.suiqian12));
  assert.deepEqual(
    ["decadal", "yearly", "monthly", "daily", "hourly"].map((scope) => result.advanced.periods[scope].index),
    [2, 4, 6, 3, 9]
  );
  assert.deepEqual(result.advanced.periods.yearly.transformations.map((item) => `${item.label}:${item.star}`), [
    "化祿:天同", "化權:天機", "化科:文昌", "化忌:廉貞"
  ]);
  assert.ok(Object.values(result.advanced.periods).every((period) => period.transformations.length === 4));
  assert.ok(Object.values(result.advanced.periods).every((period) => period.stars.flat().length > 0));
}

for (const birthDate of ["2023-08-01", "2023-02-19", "1988-02-17"]) {
  for (const gender of ["男", "女"]) {
    for (let timeIndex = 0; timeIndex <= 12; timeIndex += 1) {
      const input = { birthDate, timeIndex, gender, birthPlace: "台灣", horoscopeDate: "2026-08-22", horoscopeTimeIndex: 6 };
      const result = ZiweiAdvanced.enrich(ZiweiCore.calculate(input), input);
      assert.equal(result.palaces.length, 12);
      assert.ok(result.palaces.every((palace) => palace.decadal && palace.changsheng12 && palace.boshi12));
    }
  }
}

console.log("ziwei-advanced: all advanced rule checks passed");
