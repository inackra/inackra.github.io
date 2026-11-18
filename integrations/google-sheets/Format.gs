/** Run formatEnquiries once in the EXISTING INACKRA Apps Script project.
 * Only presentation and validation change. No lead rows, sharing permissions,
 * deployment settings or form handlers are deleted or replaced.
 */
function formatEnquiries() {
  var bookId=PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID')||(typeof INACKRA_SHEET_ID!=='undefined'?INACKRA_SHEET_ID:'');
  if(!bookId)throw new Error('Spreadsheet ID is not configured. Nothing changed.');
  var book=SpreadsheetApp.openById(bookId),sheet=book.getSheetByName('Enquiries');
  if(!sheet)throw new Error('Enquiries sheet not found. Nothing changed.');
  var rowCount=Math.max(sheet.getMaxRows(),2),lastRow=sheet.getLastRow();
  var all=sheet.getRange(1,1,rowCount,8),body=sheet.getRange(2,1,rowCount-1,8);
  // Column order is the same as appendRow in doPost.
  sheet.getRange(1,1,1,8).setValues([['Дата','ID заявки','Тип','Имя','Email','Сообщение','Язык','Статус']]);
  all.setFontFamily('Arial').setFontSize(11).setVerticalAlignment('top');
  body.setBackground('#ffffff').setFontColor('#202124').setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
  sheet.getBandings().forEach(function(b){b.remove()});
  all.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY,true,false)
    .setHeaderRowColor('#171717').setFirstRowColor('#ffffff').setSecondRowColor('#f5f6f8');
  sheet.getRange(1,1,1,8).setBackground('#171717').setFontColor('#ffffff').setFontWeight('bold').setVerticalAlignment('middle').setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
  sheet.setRowHeight(1,42);sheet.setFrozenRows(1);sheet.setHiddenGridlines(true);
  [165,275,105,170,245,480,70,145].forEach(function(width,index){sheet.setColumnWidth(index+1,width)});
  sheet.getRange(2,1,rowCount-1,1).setNumberFormat('dd.MM.yyyy HH:mm');
  sheet.getRange(2,2,rowCount-1,1).setFontSize(9).setFontColor('#777777').setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
  sheet.getRange(2,7,rowCount-1,1).setHorizontalAlignment('center');
  sheet.getRange(1,1,1,8).setNotes([[
    'Дата получения заявки','Технический ID — нужен для защиты от дублей',
    'project — проект; role — предложение работы','Имя отправителя','Адрес для ответа',
    'Текст заявки. При необходимости увеличь высоту строки.', 'ru / en',
    'New — новая; In progress — в работе; Replied — ответил; Closed — закрыта'
  ]]);
  var statuses=sheet.getRange(2,8,rowCount-1,1);
  statuses.setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['New','In progress','Replied','Closed'],true).setAllowInvalid(true).build());
  // Keep unrelated rules and replace only this formatter's status rules.
  var statusNames=['New','In progress','Replied','Closed'];
  var rules=sheet.getConditionalFormatRules().filter(function(rule){
    var condition=rule.getBooleanCondition();
    return !(condition&&condition.getCriteriaType()===SpreadsheetApp.BooleanCriteria.TEXT_EQUAL_TO&&statusNames.indexOf(String(condition.getCriteriaValues()[0]))!==-1&&rule.getRanges().every(function(r){return r.getColumn()===8&&r.getNumColumns()===1}));
  });
  [['New','#e8f0fe','#174ea6'],['In progress','#fff4d0','#7a4e00'],['Replied','#e6f4ea','#137333'],['Closed','#eeeeee','#555555']].forEach(function(item){
    rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo(item[0]).setBackground(item[1]).setFontColor(item[2]).setRanges([statuses]).build());
  });
  sheet.setConditionalFormatRules(rules);
  if(!sheet.getFilter())all.createFilter();
  if(lastRow>1)sheet.autoResizeRows(2,lastRow-1);
  SpreadsheetApp.flush();
}
