const assert=require('node:assert/strict'),vm=require('node:vm'),{buildSync}=require('esbuild'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
for(const route of ['/','/work/']){
 const output=buildSync({entryPoints:['src/Demo.jsx'],bundle:true,format:'cjs',loader:{'.css':'empty'},external:['react'],define:{'import.meta.env.VITE_ENQUIRY_ENDPOINT':'""'},write:false}).outputFiles[0].text;
 const sandbox={require,console,module:{exports:{}},exports:{},location:{pathname:route},matchMedia:()=>({matches:false}),localStorage:{getItem:()=>null}};
 vm.runInNewContext(output,sandbox);const html=renderToStaticMarkup(React.createElement(sandbox.module.exports.default));
 assert.ok(html.includes('Semrush')&&html.includes('Buburuza'));
 if(route==='/'){assert.ok(html.includes('work-carousel'));assert.ok(!html.includes('archive-grid'));assert.ok(html.includes('href="/work/"'));assert.ok(html.includes('type="email"'));assert.ok(html.includes('Открыть письмо'),'without an endpoint, no fake server submission is offered');}
 else{assert.ok(html.includes('archive-grid'));assert.ok(!html.includes('work-carousel'));assert.ok(html.includes('Вайбкодинг'));assert.ok(html.includes('aria-pressed="true"'));}
}
const fs=require('node:fs');assert.ok(fs.existsSync('dist/work/index.html'),'archive supports direct visits on static Pages');
for(const url of ['/assets/inackra.svg','/assets/cases/semrush/00.webp','/assets/cases/allinone/06.webp','/assets/cases/buburuza/07.webp'])assert.ok(fs.existsSync('dist'+url),'boot asset exists: '+url);
console.log('PASS: home carousel, independent archive, filters, case content, email fallback and static /work/ output.');
