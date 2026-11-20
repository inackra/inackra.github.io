export function contentAllocation(mode,weight=50){
 if(mode==='ai')return null;
 if(mode==='first')return [100,0];
 const value=Number(weight),a=Math.max(10,Math.min(90,Math.round(Number.isFinite(value)?value:50)));return [a,100-a];
}
export function contentEvidence(type,mode){return (type==='image'?{first:24,ai:34,weights:30}:{first:19,ai:31,weights:28})[mode];}
export function cohortColumns(period){return period==='long'?7:4;}
export function normalizeCohortCell(cell,period){return {row:Math.max(0,Math.min(2,cell.row)),column:Math.max(0,Math.min(cohortColumns(period)-1,cell.column))};}
export function moveCohortCell(cell,key,period){
 const rows=3,columns=cohortColumns(period),next={...cell};
 if(key==='ArrowRight')next.column=(cell.column+1)%columns;
 if(key==='ArrowLeft')next.column=(cell.column-1+columns)%columns;
 if(key==='ArrowDown')next.row=(cell.row+1)%rows;
 if(key==='ArrowUp')next.row=(cell.row-1+rows)%rows;
 if(key==='Home')next.column=0;
 if(key==='End')next.column=columns-1;
 return normalizeCohortCell(next,period);
}
