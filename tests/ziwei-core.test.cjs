const assert = require("node:assert/strict");
const ZiweiCore = require("../ziwei-core.js");

function starMatrix(result) {
  return result.palaces.map((palace) => palace.stars.map((star) => star.name));
}

{
  const result = ZiweiCore.calculate({ birthDate: "2023-03-06", timeIndex: "4", gender: "女", birthPlace: "台北市" });
  assert.deepEqual(starMatrix(result), [
    ["七殺"], ["天同"], ["武曲"], ["太陽"], ["破軍"], ["天機"], ["紫微", "天府"], ["太陰"], ["貪狼"], ["巨門"], ["廉貞", "天相"], ["天梁"]
  ]);
  assert.equal(result.fiveElementsClass.name, "水二局");
  assert.deepEqual(result.fourTransformations.map((item) => `${item.label}:${item.star}`), ["化祿:破軍", "化權:巨門", "化科:太陰", "化忌:貪狼"]);
}

{
  const expectedZiwei = [11, 11, 2, 2, 6, 6, 2, 2, 6, 6, 4, 4, 4];
  const expectedTianfu = [1, 1, 10, 10, 6, 6, 10, 10, 6, 6, 8, 8, 8];
  for (let timeIndex = 0; timeIndex <= 12; timeIndex += 1) {
    const result = ZiweiCore.calculate({ birthDate: "2023-08-01", timeIndex, gender: "男", birthPlace: "台灣" });
    assert.equal(result.ziweiIndex, expectedZiwei[timeIndex]);
    assert.equal(result.tianfuIndex, expectedTianfu[timeIndex]);
  }
}

{
  const result = ZiweiCore.calculate({ birthDate: "2023-02-19", timeIndex: "12", gender: "男", birthPlace: "台灣" });
  assert.equal(result.soulIndex, 0);
  assert.equal(result.bodyIndex, 0);
  assert.equal(result.lifeStem, "甲");
  assert.equal(result.lifeBranch, "寅");
  assert.equal(result.ziweiIndex, 11);
  assert.equal(result.tianfuIndex, 1);
}

{
  assert.equal(ZiweiCore.getFiveElementsClass("庚", "申").name, "木三局");
  assert.equal(ZiweiCore.getFiveElementsClass("己", "未").name, "火六局");
  assert.equal(ZiweiCore.getFiveElementsClass("乙", "丑").name, "金四局");
  assert.equal(ZiweiCore.getFiveElementsClass("辛", "酉").name, "木三局");
}

console.log("ziwei-core: all rule checks passed");
