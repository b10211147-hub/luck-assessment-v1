const assert = require("node:assert/strict");
const ZiweiCore = require("../ziwei-core.js");
const ZiweiReading = require("../ziwei-reading.js");

{
  const chart = ZiweiCore.calculate({ birthDate: "2023-03-06", timeIndex: 4, gender: "女", birthPlace: "台北市" });
  const reading = ZiweiReading.build(chart);
  assert.equal(reading.palaces.length, 12);
  assert.equal(reading.transformations.length, 4);
  assert.equal(reading.triad.items.length, 4);
  assert.ok(reading.core.fact.includes("命宮"));
  assert.ok(reading.core.hint.includes("身宮"));
  assert.ok(reading.method.length >= 6);
  assert.equal(reading.extension.decadals.items.length, 12);
  assert.ok(reading.extension.rulers.fact.includes("命主"));
  assert.ok(reading.extension.auxiliaries.fact.includes("十四輔星"));
  assert.ok(reading.palaces.every((item) => item.facts && item.hint && item.question));
  assert.ok(reading.palaces.find((item) => item.palace.name === "疾厄宮").caution.includes("醫療診斷"));
}

{
  const chart = ZiweiCore.calculate({ birthDate: "2026-08-22", timeIndex: 6, gender: "男", birthPlace: "台灣" });
  const reading = ZiweiReading.build(chart);
  const wenchang = reading.transformations.find((item) => item.star === "文昌");
  assert.equal(wenchang.status, "calculated");
  assert.ok(wenchang.palaceName);
  assert.ok(wenchang.text.includes("文昌"));
}

{
  const chart = ZiweiCore.calculate({ birthDate: "2023-08-01", timeIndex: 0, gender: "男", birthPlace: "台灣" });
  const reading = ZiweiReading.build(chart);
  const emptyPalace = reading.palaces.find((item) => item.palace.stars.length === 0);
  assert.ok(emptyPalace.hint.includes("不代表"));
  assert.ok(emptyPalace.hint.includes("不能直接視為同宮落星"));
}

console.log("ziwei-reading: all interpretation checks passed");
