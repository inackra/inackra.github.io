const assert=require('node:assert/strict'),vm=require('node:vm'),{buildSync}=require('esbuild'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
for(const route of ['/','/work/','/privacy/']){
 const output=buildSync({entryPoints:['src/Demo.jsx'],bundle:true,format:'cjs',loader:{'.css':'empty'},external:['react'],define:{'import.meta.env.VITE_ENQUIRY_ENDPOINT':'""'},write:false}).outputFiles[0].text;
 const sandbox={require,console,module:{exports:{}},exports:{},location:{pathname:route},matchMedia:()=>({matches:false}),localStorage:{getItem:()=>null}};
 vm.runInNewContext(output,sandbox);const html=renderToStaticMarkup(React.createElement(sandbox.module.exports.default));
 if(route!=='/privacy/')assert.ok(html.includes('Semrush')&&html.includes('Buburuza'));
 assert.ok(!html.includes('Вильнюс')&&!html.includes('Коснись фона')&&!html.includes('01 / Подход'),'removed location, instructions and section numbering');
 if(route==='/'){assert.ok(html.includes('work-carousel'));assert.ok(html.includes('carousel-all-work'));assert.ok(!html.includes('class="more-work"'));assert.ok(!html.includes('archive-grid'));assert.ok(html.includes('href="/work/?v=20261120-pages-2"'));assert.ok(html.includes('type="email"'));assert.ok(html.includes('href="/privacy/"'),'form links to the privacy policy');assert.ok(html.includes('Открыть письмо'),'without an endpoint, no fake server submission is offered');}
 else if(route==='/work/'){assert.ok(html.includes('archive-grid'));assert.ok(!html.includes('work-carousel'));assert.ok(html.includes('Вайбкодинг'));assert.ok(html.includes('aria-pressed="true"'));for(const id of ['plenum','semrush','aio','buburuza','evapolar'])assert.ok(html.includes('href="/work/'+id+'/"'),'archive card opens page: '+id);assert.ok(!html.includes('<dialog'),'no project modal in archive');}
 else{assert.ok(html.includes('Конфиденциальность.'));assert.ok(html.includes('Google Sheets'));assert.ok(html.includes('mailto:info.inackra@gmail.com'));assert.ok(!html.includes('message-form'));}
}
const fs=require('node:fs');assert.ok(fs.existsSync('dist/privacy/index.html'),'privacy route supports direct visits on static Pages');
assert.ok(fs.readFileSync('dist/privacy/index.html','utf8').includes('href="https://inackra.work/privacy/"'),'privacy has its own canonical URL');assert.ok(fs.existsSync('dist/work/index.html'),'archive supports direct visits on static Pages');
for(const url of ['/assets/inackra.svg','/assets/cases/semrush/00.webp','/assets/cases/allinone/06.webp','/assets/cases/buburuza/07.webp'])assert.ok(fs.existsSync('dist'+url),'boot asset exists: '+url);
console.log('PASS: home carousel, independent archive, filters, case content, email fallback and static /work/ output.');
