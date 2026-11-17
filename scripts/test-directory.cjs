const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=path.resolve(__dirname,'..');const data=JSON.parse(fs.readFileSync(path.join(root,'data/atlas.json'),'utf8'));
const nodes=new Map();function node(id){if(!nodes.has(id))nodes.set(id,{value:'',checked:false,hidden:false,textContent:'',innerHTML:'',addEventListener(){},scrollIntoView(){},focus(){}});return nodes.get(id);}
const document={querySelector:s=>node(s),getElementById:id=>node('#'+id),addEventListener(){}};
const window={__DATA__:data};vm.runInNewContext(fs.readFileSync(path.join(root,'site/directory.js'),'utf8'),{window,document,console});
const dir=window.Directory;
for(const [query,id] of [['Udelar','udelar'],['INE','ine'],['BCU','bcu'],['ANII','anii'],['OPP','opp']]){const rows=dir.search(query).list;assert(rows.length>0,query);assert(rows.every(r=>dir.producer(r).id===id),query+' devuelve otras instituciones');console.log(query+': '+rows.length+' recursos de la institución');}
assert(dir.search('Udelar').list.some(r=>r.id==='UY-174'),'CSIC debe encontrarse con Udelar');
assert.equal(dir.search('CSIC').list.length,1);
assert.deepEqual(Array.from(dir.search('género').list,r=>r.id),Array.from(dir.search('genero').list,r=>r.id));
assert(dir.search('empleo INE').list.every(r=>dir.producer(r).id==='ine'));
assert.equal(dir.search('zzzzzz').list.length,0);
Object.assign(dir.state,{area:data.areas.A1,inst:'bcu',amb:'Internacional',download:true});
dir.resetFilters();assert.equal(dir.state.inst,'');assert.equal(dir.state.area,'');assert.equal(dir.state.amb,'');assert.equal(dir.state.download,false);
assert.equal(dir.search('').list.length,data.recursos.length);
dir.state.q='CSIC';dir.state.area=data.areas.A1;dir.resetFilters();assert.equal(dir.state.q,'CSIC','Limpiar filtros conserva la consulta');
dir.openResults('');assert.equal(dir.search('').list.length,148);
assert(!node('#results').innerHTML.includes('Referencias principales'));
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert(html.includes('id="instituciones"'));assert(!html.includes('id="qForm"'));assert(!html.includes('data-act="reset"'));
console.log('OK: CSIC, tildes, búsqueda combinada, filtros, directorio completo y navegación.');
