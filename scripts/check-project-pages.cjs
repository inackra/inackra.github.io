const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),{buildSync}=require('esbuild'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const ru=JSON.parse(fs.readFileSync('src/aio/tasks.ru.json')),en=JSON.parse(fs.readFileSync('src/aio/tasks.en.json'));
assert.deepEqual(ru.map(t=>t.id),en.map(t=>t.id));assert.equal(en.length,11);
const code=buildSync({entryPoints:['src/aio/AioStory.jsx'],bundle:true,format:'cjs',loader:{'.css':'empty'},external:['react'],write:false}).outputFiles[0].text;
const paths=new Set;for(let i=0;i<ru.length;i++){
 const r=ru[i],e=en[i];assert.equal(e.evidence.length,r.evidence.length);assert.equal(e.story.length,r.story.length);assert.equal(e.reasoning.length,r.reasoning.length);assert.equal(e.evidenceGroups?.length,r.evidenceGroups?.length);
 assert.equal(/[А-Яа-яЁё]/.test(JSON.stringify(e)),false,'English data has no Russian text: '+e.id);
 assert.deepEqual(e.evidence.map(x=>x.frame),r.evidence.map(x=>x.frame),'same screens in both languages');
 for(const lang of ['ru','en']){
 const sandbox={require,console,module:{exports:{}},exports:{},location:{pathname:'/work/aio/',hash:'#task='+r.id},matchMedia:()=>({matches:false})};vm.runInNewContext(code,sandbox);
 const html=renderToStaticMarkup(React.createElement(sandbox.module.exports.default,{lang,paused:false}));
 assert.ok(html.includes((lang==='en'?e:r).title));assert.ok(!html.includes('readymag'));assert.ok(!html.includes('aio-related-list'));assert.ok(html.includes(lang==='ru'?'Как задача связана с проектом':'How this task connects to the project'));
 if(lang==='en')assert.equal(/[А-Яа-яЁё]/.test(html),false,'English rendered controls: '+r.id);
 for(const item of r.evidence){const src=item.frame.src||'/assets/cases/allinone/'+String(item.frame.index).padStart(2,'0')+'.webp';assert.ok(fs.existsSync('public'+src),'asset '+src);paths.add(src)}
 }
}
assert.equal(paths.size,114);
for(const id of ['plenum','semrush','aio','buburuza','evapolar'])assert.ok(fs.existsSync('dist/work/'+id+'/index.html'),'static direct route '+id);
assert.ok(!fs.existsSync('dist/aio-tech/import-report'),'private import report is not public');
console.log('PASS: 11 tasks in RU/EN, all controls translated, 114 original screens, one related-task navigation and five static case routes.');
