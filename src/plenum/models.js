export const canvasNodes=[
 {id:'team',label:'Team',x:90,y:35},
 {id:'developers',label:'Developers',x:55,y:170},
 {id:'marketing',label:'Marketing',x:415,y:65},
 {id:'design',label:'Design',x:55,y:310},
 {id:'web',label:'Web App',x:415,y:205},
 {id:'api',label:'API Gateway',x:415,y:345}
];
export const canvasEdges=[['team','developers'],['team','marketing'],['team','design'],['developers','web'],['design','web'],['web','api']];
export const compactCanvasNodes=canvasNodes.map((n,i)=>({...n,x:[90,12,12,195,195,195][i],y:[20,130,260,130,260,390][i]}));
export function moveCanvasNode(nodes,id,x,y,compact=false){return nodes.map(n=>n.id===id?{...n,x:Math.max(8,Math.min(compact?202:500,x)),y:Math.max(12,Math.min(compact?410:355,y))}:n)}
export const initialRelation={status:'candidate',revision:1,confirmedRevision:null};
export function relationAfter(state,action){
 if(action==='confirm')return {...state,status:'confirmed',confirmedRevision:state.revision};
 if(action==='reject')return {...state,status:'rejected',confirmedRevision:null};
 if(action==='revise')return {...state,status:state.confirmedRevision?'stale':'candidate',revision:state.revision+1};
 return state;
}
export const initialRun={completed:2,total:10,status:'running'};
export function advanceRun(state,action){
 if(action==='reset')return {...initialRun};
 if(action==='wait'&&['running','resumed'].includes(state.status))return {...state,status:'waiting'};
 if(action==='resume'&&state.status==='waiting')return {...state,status:'running'};
 if(action!=='tick'||state.status!=='running')return state;
 if(state.completed===6)return {...state,status:'waiting'};
 const completed=Math.min(state.total,state.completed+2);return {...state,completed,status:completed===state.total?'complete':'running'};
}
// A resumed checkpoint must not immediately simulate the same interruption a second time.
export function resumeRun(state){return state.status==='waiting'?{...state,completed:state.completed,status:'resumed'}:state}
export function tickResumed(state){if(state.status!=='resumed')return advanceRun(state,'tick');const completed=Math.min(state.total,state.completed+2);return {...state,completed,status:completed===state.total?'complete':'resumed'}}
export const exampleRows=[{Summary:'Checkout flow',State:'In Progress',Assignee:'Alex'},{Summary:'Export report',State:'Ready for review',Assignee:''},{Summary:'Session list',State:'Done',Assignee:'Sam'}];
export function importPreview(rows,mapping){if(!mapping.title||!mapping.status)return [];return rows.map(row=>({title:row.Summary,status:({'In Progress':'in-progress',Done:'done'})[row.State]||'unknown',sourceStatus:row.State,assignee:row.Assignee||null}))}
export const evaluations={corrected:{passed:99,total:106,groups:[]},blind:{passed:34,total:44,groups:[['Product Model',8,11],['Comparison',6,12],['Jira CSV',10,10],['History',10,11]]},comparison:{passed:6,total:12,groups:[]}};
