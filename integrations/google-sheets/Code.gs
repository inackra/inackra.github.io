// Set SPREADSHEET_ID in Project Settings → Script Properties.
// Deploy as Web app, execute as owner, allow public submissions.
// The spreadsheet itself stays private. No OAuth credentials go into the site.
function doPost(e) {
  var p=(e&&e.parameter)||{}, id=String(p.requestId||'');
  var result={type:'inackra-enquiry',id:id,ok:false};
  try {
    if (!/^[a-zA-Z0-9-]{20,80}$/.test(id)) throw new Error('request');
    if (p.website) throw new Error('spam');
    var name=String(p.name||'').trim(), email=String(p.email||'').trim(), message=String(p.message||'').trim();
    if (!name||name.length>120||!/^\S+@\S+\.\S+$/.test(email)||email.length>254||message.length<10||message.length>3000) throw new Error('invalid');
    var lock=LockService.getScriptLock();lock.waitLock(10000);
    try {
      var cache=CacheService.getScriptCache();
      if(cache.get(id)){result.ok=true;return response_(result)}
      var key='email-'+Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,email.toLowerCase())).slice(0,40);
      if(cache.get(key)) throw new Error('rate');
      var sheet=SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID')).getSheetByName('Enquiries');
      if(!sheet) throw new Error('sheet');
      // Treat all visitor inputs as text, never spreadsheet formulas.
      var text=function(value){return "'"+String(value)};
      sheet.appendRow([new Date(),text(id),text(p.intent==='role'?'role':'project'),text(name),text(email),text(message),text(p.lang==='en'?'en':'ru'),'New']);
      cache.put(id,'1',21600);cache.put(key,'1',60);result.ok=true;
    } finally {lock.releaseLock()}
  } catch(error) {result.ok=false}
  return response_(result);
}
function response_(result) {
  var json=JSON.stringify(result).replace(/</g,'\\u003c');
  return HtmlService.createHtmlOutput('<!doctype html><meta charset="utf-8"><script>window.top.postMessage('+json+',"https://inackra.work");<\/script>').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
function setup() {
  var book=SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID'));
  var sheet=book.getSheetByName('Enquiries')||book.insertSheet('Enquiries');
  if(sheet.getLastRow()===0)sheet.appendRow(['Date','Request ID','Type','Name','Email','Message','Language','Status']);
  sheet.setFrozenRows(1);
}
