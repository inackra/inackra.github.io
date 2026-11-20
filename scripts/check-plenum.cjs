const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server'),{buildSync}=require('esbuild');
function moduleAt(file){const code=buildSync({entryPoints:[file],bundle:true,format:'cjs',loader:{'.css':'empty'},external:['react'],write:false}).outputFiles[0].text,sandbox={require,console,module:{exports:{}},exports:{},location:{pathname:'/work/plenum/',hash:''},matchMedia:()=>({matches:false}),localStorage:{getItem:()=>null}};vm.runInNewContext(code,sandbox);return sandbox.module.exports}
const {taskIds,getPlenumTasks,resolvePlenumTask}=moduleAt('src/plenum/story.js'),m=moduleAt('src/plenum/models.js'),Page=moduleAt('src/plenum/PlenumStory.jsx').default;
assert.equal(taskIds.length,6);assert.equal(resolvePlenumTask('#task=runtime'),'runtime');assert.equal(resolvePlenumTask('#task=%'),'canvas');
for(const lang of ['ru','en'])for(const task of getPlenumTasks(lang)){
 const html=renderToStaticMarkup(React.createElement(Page,{lang,initialTask:task.id,paused:true}));
 assert.ok(html.includes(task.title),task.id);assert.ok(html.includes('aria-controls="plenum-task-panel"'));assert.ok(html.includes('class="plenum-prototype'));
 assert.ok(!html.includes('readymag')&&!html.includes('<dialog'));if(lang==='en')assert.equal(/[А-Яа-яЁё]/.test(html),false,'English Plenum has no Russian strings: '+task.id);
}
let r=m.relationAfter(m.initialRelation,'confirm');assert.equal(r.confirmedRevision,1);r=m.relationAfter(r,'revise');assert.equal(r.status,'stale');assert.equal(r.revision,2);assert.equal(r.confirmedRevision,1);r=m.relationAfter(r,'confirm');assert.equal(r.confirmedRevision,2);
let run=m.initialRun;run=m.advanceRun(run,'tick');run=m.advanceRun(run,'tick');assert.equal(run.completed,6);run=m.advanceRun(run,'tick');assert.equal(run.status,'waiting');const frozen=run;for(let i=0;i<5;i++)run=m.tickResumed(run);assert.equal(run,frozen,'waiting preserves the exact checkpoint');run=m.resumeRun(run);assert.equal(run.completed,6);run=m.tickResumed(run);run=m.tickResumed(run);assert.equal(run.completed,10);assert.equal(run.status,'complete');
assert.equal(m.importPreview(m.exampleRows,{title:true,status:false}).length,0);const imported=m.importPreview(m.exampleRows,{title:true,status:true});assert.equal(imported.length,3);assert.equal(imported[1].status,'unknown');assert.equal(imported[1].sourceStatus,'Ready for review');assert.equal(imported[1].assignee,null);
assert.equal(m.evaluations.blind.groups.reduce((n,g)=>n+g[1],0),34);assert.equal(m.evaluations.blind.groups.reduce((n,g)=>n+g[2],0),44);
const moved=m.moveCanvasNode(m.canvasNodes,'team',-100,500);assert.equal(moved[0].x,8);assert.equal(moved[0].y,355);assert.equal(m.canvasNodes[0].x,90,'dragging does not mutate the initial layout');
const {content}=moduleAt('src/content.js'),{getCaseStudies}=moduleAt('src/caseStudies.js');
for(const lang of ['ru','en']){
 const cases=getCaseStudies(content[lang].work.cases,lang);for(const id of ['plenum','aio']){const p=cases.find(p=>p.id===id);assert.equal(p.cover.path,`/assets/covers/${id}.png`);const bytes=fs.readFileSync('public'+p.cover.path);assert.equal(bytes.readUInt32BE(16),p.cover.width);assert.equal(bytes.readUInt32BE(20),p.cover.height);assert.equal(p.status,'ready')}
 const copy=JSON.stringify(content[lang]);assert.ok(!copy.includes('A2')&&!copy.includes('B1'),'language level removed from website copy');assert.ok(!/\b[Cc]ontributed\b|[Уу]частвовал(?:\s|[.,])/.test(JSON.stringify(cases)),'direct authorship copy');
}
assert.ok(fs.existsSync('dist/work/plenum/index.html'));
console.log('PASS: six Plenum stories in RU/EN, revision-bound confirmation, preserved checkpoints, lossless unknown import values, exact evaluation denominators, shared supplied covers and direct authorship.');
