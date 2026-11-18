const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const rows=[],cache=new Map();let releases=0;
const sandbox={Date,JSON,Error,String,RegExp,PropertiesService:{getScriptProperties:()=>({getProperty:()=> 'test-sheet'})},LockService:{getScriptLock:()=>({waitLock(){},releaseLock(){releases++}})},CacheService:{getScriptCache:()=>({get:k=>cache.get(k),put:(k,v)=>cache.set(k,v)})},Utilities:{DigestAlgorithm:{SHA_256:1},computeDigest:(_,v)=>v,base64EncodeWebSafe:v=>Buffer.from(v).toString('base64url')},SpreadsheetApp:{openById:()=>({getSheetByName:()=>({appendRow:row=>rows.push(row)})})},HtmlService:{XFrameOptionsMode:{ALLOWALL:1},createHtmlOutput:html=>({html,setXFrameOptionsMode(){return this}})}};
vm.createContext(sandbox);vm.runInContext(fs.readFileSync('integrations/google-sheets/Code.gs','utf8'),sandbox);
const valid={requestId:'f940662b-9ff0-483e-9fb1-a00f292f0be1',name:'=IMPORTXML("bad")',email:'test@example.com',message:'A real project enquiry with enough detail.',intent:'project',lang:'ru'};
const submit=p=>sandbox.doPost({parameter:p}).html;
assert.ok(submit(valid).includes('"ok":true'));assert.equal(rows.length,1);assert.ok(rows[0][3].startsWith("'="),'visitor text never executes as a formula');assert.ok(submit(valid).includes('"ok":true'));assert.equal(rows.length,1,'a retry with the same ID must not duplicate a lead');
assert.ok(submit({...valid,requestId:'other-request-01234567890123456789'}).includes('"ok":false'),'same email is rate-limited');
for(const changes of [{website:'bot'},{email:'bad'},{message:'tiny'},{requestId:'bad'},{name:'x'.repeat(121)}])assert.ok(submit({...valid,...changes}).includes('"ok":false'));
assert.equal(rows.length,1);assert.equal(releases,3,'locks release even after a duplicate or rate limit');assert.ok(submit({...valid,name:'</script>'}).includes('https://inackra.work'),'receipt is sent to the production origin only');
console.log('PASS: Sheets validation, deduplication, rate limit, honeypot, formula escaping, acknowledged receipts and lock cleanup.');

// Presentation may update headers, but it must never rewrite an enquiry row.
const formatCalls=[],chain=new Proxy({}, {get:(_,name)=>(...args)=>{formatCalls.push({name,args});return chain}});
const formatSheet={getMaxRows:()=>1000,getLastRow:()=>2,getRange:(row,column,height,width)=>new Proxy({}, {get:(_,name)=>(...args)=>{if(name==='setValues')assert.equal(row,1,'formatting must not write lead values');formatCalls.push({row,column,height,width,name,args});return chain}}),getBandings:()=>[],getConditionalFormatRules:()=>[],getFilter:()=>null,setRowHeight(){},setFrozenRows(){},setHiddenGridlines(){},setColumnWidth(){},setConditionalFormatRules(){},autoResizeRows(){}};
const formatter={PropertiesService:{getScriptProperties:()=>({getProperty:()=> 'test-sheet'})},SpreadsheetApp:{openById:id=>{assert.equal(id,'test-sheet');return {getSheetByName:name=>{assert.equal(name,'Enquiries');return formatSheet}}},WrapStrategy:{WRAP:1,CLIP:2},BandingTheme:{LIGHT_GREY:1},BooleanCriteria:{TEXT_EQUAL_TO:1},newDataValidation:()=>chain,newConditionalFormatRule:()=>chain,flush(){}}};
vm.createContext(formatter);vm.runInContext(fs.readFileSync('integrations/google-sheets/Format.gs','utf8'),formatter);formatter.formatEnquiries();
const header=formatCalls.find(c=>c.name==='setValues');assert.equal(header.args[0][0].length,8);assert.equal(header.args[0][0][5],'Сообщение');assert.ok(formatCalls.some(c=>c.name==='createFilter'));assert.ok(formatCalls.some(c=>c.name==='setDataValidation'));assert.ok(formatCalls.some(c=>c.name==='setNumberFormat'));
console.log('PASS: sheet formatter preserves lead rows and column order while adding dates, filters and status controls.');
