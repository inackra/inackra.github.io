import {mkdir,readFile,writeFile} from 'node:fs/promises';
const catalog=JSON.parse(await readFile('src/gallery/catalog.json','utf8'));
const html=await readFile('dist/index.html','utf8');
for(const [route,title] of [['work','Work — INACKRA'],['privacy','Конфиденциальность — INACKRA'],...['plenum','semrush','aio','buburuza','evapolar'].map(id=>['work/'+id,id+' — INACKRA']),...catalog.map(item=>['work/visual/'+item.id,'Visual work — INACKRA'])]){
 await mkdir(`dist/${route}`,{recursive:true});
 await writeFile(`dist/${route}/index.html`,html.replace('<title>Yan Kavaleu — Product Designer</title>',`<title>${title}</title>`).replace('rel="canonical" href="https://inackra.work/"',`rel="canonical" href="https://inackra.work/${route}/"`));
}
