const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
for(const name of ['site/template.html','index.html']){
 let t=fs.readFileSync(path.join(root,name),'utf8');
 t=t.replace(/<nav aria-label="Menú principal de Ciencia Uruguay">[\s\S]*?<\/nav>/,'<a class="ciencia-link" href="https://gersnano.github.io/cienciaUruguay-pagina/#inicio">Ciencia Uruguay ↗</a>');
 t=t.replace('href="https://gersnano.github.io/cienciaUruguay-pagina/#inicio" aria-label="U+I · UNE: Ciencia Uruguay"','href="#inicio" aria-label="U+I · UNE: inicio del observatorio"');
 t=t.replace('<a href="#inicio">Buscar</a>','<a href="#inicio">Inicio y búsqueda</a>');
 t=t.replace('</style>','\n.ciencia-link{font-size:12px;text-decoration:none;color:var(--head)}.ciencia-link:hover{text-decoration:underline}\n</style>');
 fs.writeFileSync(path.join(root,name),t);
 const header=t.match(/<header class="top">[\s\S]*?<\/header>/)[0];
 if(/#sni|#no-categorizados|#produccion|#ecosistema/.test(header))throw Error('Enlaces ajenos al observatorio');
}
// Ensure regenerating the design applies the same navigation correction.
const generator=path.join(root,'scripts/update-une.cjs');
let g=fs.readFileSync(generator,'utf8');
if(!g.includes("require('./fix-navigation.cjs')"))fs.appendFileSync(generator,"\nrequire('./fix-navigation.cjs');\n");
console.log('Navegación corregida en plantilla y vista previa.');
