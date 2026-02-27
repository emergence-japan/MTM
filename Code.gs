// Code.gs - 階層構造に対応し、確実にデータを抽出する強化版

/**
 * WebアプリからのPOSTリクエストを処理します
 */
function doPost(e) {
  try {
    var jsonString = e.postData ? e.postData.contents : e.parameter.data;
    var data = JSON.parse(jsonString);
    
    var targetSheetName = "all-survey";
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(targetSheetName);
    
    if (!sheet) {
      sheet = ss.insertSheet(targetSheetName);
    }
    
    setupHeader(sheet);
    
    var timestamp = new Date().toISOString();
    var anonymous_code = data.anonymous_code || "";
    var gender = data.gender || "";
    var age = data.age || "";
    var language = data.language || "";
    var page = data.page || "";
    var payload = data.payload || {};
    
    // 既存の「匿名コード」を行内に存在するか検索（A列）
    var values = sheet.getDataRange().getValues();
    var rowIndex = -1;
    for (var i = 1; i < values.length; i++) {
      if (values[i][0] == anonymous_code) {
        rowIndex = i + 1;
        break;
      }
    }
    
    if (rowIndex === -1) {
      var newRow = new Array(96).fill("");
      newRow[0] = anonymous_code;
      newRow[1] = gender;
      newRow[2] = age;
      newRow[3] = language;
      sheet.appendRow(newRow);
      rowIndex = sheet.getLastRow();
    }
    
    sheet.getRange(rowIndex, 5).setValue(timestamp); // 最終更新日
    
    if (page === "pre") {
      sheet.getRange(rowIndex, 6).setValue(timestamp);
      // Q1-Q36を抽出して書き込み
      for (var j = 1; j <= 36; j++) {
        var val = deepSearch(payload, "q" + j);
        sheet.getRange(rowIndex, 6 + j).setValue(val !== undefined ? val : "");
      }
    } else if (page === "post") {
      sheet.getRange(rowIndex, 43).setValue(timestamp);
      // Q1-Q52を抽出
      for (var k = 1; k <= 52; k++) {
        var val = deepSearch(payload, "q" + k);
        sheet.getRange(rowIndex, 43 + k).setValue(val !== undefined ? val : "");
      }
      // Q53 (feedback) を抽出
      var q53Val = deepSearch(payload, "q53") || payload["feedback"] || "";
      sheet.getRange(rowIndex, 96).setValue(q53Val);
    }
    
    return ContentService.createTextOutput(JSON.stringify({status: "success", rowIndex: rowIndex})).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({status: "error", message: error.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * オブジェクトの深い階層まで指定されたキーを検索します
 */
function deepSearch(obj, key) {
  if (obj.hasOwnProperty(key)) return obj[key];
  for (var k in obj) {
    if (obj[k] && typeof obj[k] === 'object') {
      var found = deepSearch(obj[k], key);
      if (found !== undefined) return found;
    }
  }
  return undefined;
}

function setupHeader(sheet) {
  if (sheet.getLastRow() > 0) return;
  var header = ["匿名コード", "性別", "年齢", "言語", "最終更新日", "Timestamp(Pre)"];
  for (var i = 1; i <= 36; i++) header.push("Pre_Q" + i);
  header.push("Timestamp(Post)");
  for (var j = 1; j <= 53; j++) header.push("Post_Q" + j);
  sheet.appendRow(header);
  sheet.getRange(1, 1, 1, header.length).setFontWeight("bold");
  sheet.setFrozenRows(1);
}

function doGet(e) {
  return ContentService.createTextOutput("GAS is running (Enhanced Data Extraction Mode).").setMimeType(ContentService.MimeType.TEXT);
}