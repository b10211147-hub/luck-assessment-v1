const SHEET_NAME = '測驗結果';
const HEADERS = [
  '送出時間',
  '測驗產生時間',
  '測驗版本',
  '題數',
  '姓名或暱稱',
  'LINE 名稱',
  '目前最想改善的問題',
  '主要類型',
  '類型名稱',
  '類型描述',
  '目前面臨的困境',
  '大概可以怎麼改善',
  '推薦科儀項目',
  '八大面向排序',
  '四軸結果',
  '八大面向分數',
  '檢核提醒',
  '服務適用性',
  '完整答案 JSON',
  '完整結果 JSON',
  '來源頁面',
  '裝置資訊'
];

function doGet() {
  return jsonResponse_({ ok: true, message: 'Luck assessment receiver is ready.' });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const payload = JSON.parse(e.postData.contents || '{}');
    const result = payload.result || {};
    const sheet = getResultSheet_();
    ensureHeader_(sheet);
    sheet.appendRow(buildRow_(payload, result));

    return jsonResponse_({ ok: true });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err && err.message ? err.message : err) });
  } finally {
    lock.releaseLock();
  }
}

function getResultSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) {
    throw new Error('請從 Google Sheet 的「擴充功能 > Apps Script」建立此腳本。');
  }

  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
}

function ensureHeader_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    return;
  }

  let headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0];
  HEADERS.forEach((header, index) => {
    if (headers.indexOf(header) !== -1) return;

    const previousHeader = HEADERS[index - 1];
    const previousIndex = previousHeader ? headers.indexOf(previousHeader) + 1 : 0;

    if (previousIndex > 0) {
      sheet.insertColumnAfter(previousIndex);
      sheet.getRange(1, previousIndex + 1).setValue(header);
      headers.splice(previousIndex, 0, header);
    } else {
      const nextColumn = sheet.getLastColumn() + 1;
      sheet.getRange(1, nextColumn).setValue(header);
      headers.push(header);
    }
  });
}

function buildRow_(payload, result) {
  const assessment = result.assessment || {};
  const profile = result.profile || {};
  const summary = result.customerSummary || {};

  return [
    payload.submittedAt || new Date().toISOString(),
    result.generatedAt || '',
    assessment.label || '完整版',
    assessment.questionCount || '',
    profile.name || '',
    profile.line || '',
    profile.concern || '',
    result.code || '',
    result.typeName || '',
    joinLines_(summary.typeDescription),
    joinLines_(summary.challenges),
    joinLines_(summary.improvements),
    joinLines_(result.recommendedRituals),
    stringify_(result.ranked || []),
    stringify_(result.axes || {}),
    stringify_(result.domains || {}),
    joinLines_(result.internalNotes),
    stringify_(result.safety || {}),
    stringify_(result.answers || {}),
    stringify_(result),
    payload.pageUrl || '',
    payload.userAgent || ''
  ];
}

function joinLines_(value) {
  if (Array.isArray(value)) return value.join('\n');
  return value || '';
}

function stringify_(value) {
  return JSON.stringify(value || '');
}

function jsonResponse_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
