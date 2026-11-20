import {mkdir,readFile,writeFile} from 'node:fs/promises';
const html=await readFile('dist/index.html','utf8');
for(const [route,title] of [['work','Work — INACKRA'],['privacy','Конфиденциальность — INACKRA'],...['plenum','semrush','aio','buburuza','evapolar'].map(id=>['work/'+id,id+' — INACKRA'])]){
 await mkdir(`dist/${route}`,{recursive:true});
 await writeFile(`dist/${route}/index.html`,html.replace('<title>Yan Kavaleu — Product Designer</title>',`<title>${title}</title>`).replace('rel="canonical" href="https://inackra.work/"',`rel="canonical" href="https://inackra.work/${route}/"`));
}
