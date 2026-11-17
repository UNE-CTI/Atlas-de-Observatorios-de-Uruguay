const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');let n=0;
for(const m of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)){if(m[0].includes('application/json'))continue;new vm.Script(m[1]);n++;}
const d=JSON.parse(fs.readFileSync(path.join(root,'data/atlas.json'),'utf8'));
if(new Set(d.recursos.map(r=>r.id)).size!==d.recursos.length)throw Error('IDs duplicados');
for(const r of d.recursos)if(!d.temas[r.tema])throw Error('Tema inválido');
console.log('JavaScript válido:',n,'bloques. Datos:',d.recursos.length,'recursos; IDs únicos y temas válidos.');
