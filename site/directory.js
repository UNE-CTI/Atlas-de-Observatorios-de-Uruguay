(function(){
const D=window.__DATA__,R=D.recursos,T=D.temas,E=D.enfoques,A=D.areas;
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const groups=[
 ['udelar','Udelar',['udelar','universidad de la republica']],
 ['bcu','Banco Central del Uruguay',['bcu','banco central del uruguay']],
 ['ine','Instituto Nacional de Estadística',['ine','instituto nacional de estadistica']],
 ['bps','Banco de Previsión Social',['bps','banco de prevision social']],
 ['anii','ANII',['anii','agencia nacional de investigacion e innovacion']],
 ['ande','ANDE',['ande','agencia nacional de desarrollo']],
 ['opp','OPP',['opp','oficina de planeamiento y presupuesto']],
 ['anep','ANEP',['anep','dgetp utu']],
 ['mec','Ministerio de Educación y Cultura',['mec','ministerio de educacion cultura','ministerio de educacion y cultura']],
 ['mef','Ministerio de Economía y Finanzas',['mef','ministerio de economia y finanzas']],
 ['mgap','Ministerio de Ganadería, Agricultura y Pesca',['mgap','ministerio de ganaderia agricultura y pesca']],
 ['mides','MIDES',['mides','ministerio de desarrollo social']],
 ['miem','MIEM',['miem','ministerio de industria energia y mineria']],
 ['msp','Ministerio de Salud Pública',['msp','ministerio de salud publica']],
 ['mtss','Ministerio de Trabajo y Seguridad Social',['mtss','ministerio de trabajo y seguridad social']],
 ['interior','Ministerio del Interior',['ministerio del interior','ministerio interior']],
 ['ambiente','Ministerio de Ambiente',['ministerio de ambiente']],
 ['cuti','CUTI',['cuti','observatorio ti de cuti y advice']],
 ['onu','ONU · División de Estadística',['onu division de estadistica']]
];
const hasPhrase=(text,phrase)=>(' '+norm(text)+' ').includes(' '+norm(phrase)+' ');
function producer(r){const found=groups.find(g=>g[2].some(a=>hasPhrase(r.inst,a)));return found?{id:found[0],label:found[1],aliases:found[2]}:{id:norm(r.inst),label:r.inst,aliases:[norm(r.inst)]};}
const producers=new Map();R.forEach(r=>{const p=producer(r);if(!producers.has(p.id))producers.set(p.id,{...p,items:[]});producers.get(p.id).items.push(r);});
const STOP=new Set(['de','del','la','las','el','los','en','y','o','a','para','con','sobre','por','un','una','datos','dato','uruguay','observatorio','observatorios']);
const concepts=Object.entries(T).flatMap(([id,t])=>[t.nombre,...t.sin].map(s=>({id,phrase:norm(s)}))).filter(c=>c.phrase.length>2).sort((a,b)=>b.phrase.length-a.phrase.length);
const state={q:'',area:'',inst:'',amb:'',download:false,limit:24};
const areaLimits={};
function search(q=state.q){
 let rest=norm(q);const institutionMatches=[];
 const aliases=[...producers.values()].flatMap(p=>p.aliases.map(alias=>({id:p.id,alias:norm(alias)}))).sort((a,b)=>b.alias.length-a.alias.length);
 for(const {id,alias} of aliases){if(hasPhrase(rest,alias)){if(!institutionMatches.includes(id))institutionMatches.push(id);rest=(' '+rest+' ').replace(' '+alias+' ',' ').trim();}}
 const topicIds=[];for(const c of concepts){if(hasPhrase(rest,c.phrase)){if(!topicIds.includes(c.id))topicIds.push(c.id);rest=(' '+rest+' ').replace(' '+c.phrase+' ',' ').trim();}}
 const words=rest.split(/\s+/).filter(w=>w.length>1&&!STOP.has(w));
 const list=R.map(r=>{const p=producer(r),text=norm([r.nombre,r.inst,r.desc,r.etiquetas,r.tipo,...p.aliases].join(' '));
 const pass=(!state.area||r.area===state.area)&&(!state.inst||p.id===state.inst)&&(!state.amb||r.ambito===state.amb)&&(!state.download||r.descarga==='Sí')&&(!institutionMatches.length||institutionMatches.includes(p.id))&&topicIds.every(id=>r.tema===id||r.temas_sec.includes(id))&&words.every(w=>text.includes(w));
 const score=(norm(r.nombre)===norm(q)?100:0)+(norm(q)&&norm(r.nombre).includes(norm(q))?20:0)+words.filter(w=>norm(r.nombre).includes(w)).length*3+topicIds.filter(id=>r.tema===id).length*2;
 return {r,score,pass};}).filter(x=>x.pass).sort((a,b)=>b.score-a.score||a.r.nombre.localeCompare(b.r.nombre,'es')).map(x=>x.r);
 return {list,institutionMatches,topicIds};
}
function card(r){return `<article class="card"><div class="meta">${esc(r.tipo)}<span class="amb">${esc(r.ambito)}</span></div><h3>${esc(r.nombre)}</h3><div class="inst">${esc(r.inst)}</div><p class="desc">${esc(r.desc)}</p><div class="resource-actions"><a class="visit" href="${esc(r.url)}" target="_blank" rel="noopener">Visitar sitio ↗<span class="sr-only"> (abre en otra pestaña)</span></a><button class="more" data-ficha="${esc(r.id)}" aria-expanded="false" aria-controls="f-${esc(r.id)}">Más información</button></div><dl class="ficha" id="f-${esc(r.id)}" hidden><dt>Tema</dt><dd>${esc(T[r.tema].nombre)}</dd><dt>Alcance</dt><dd>${esc(r.alcance)}</dd><dt>Descarga</dt><dd>${esc(r.descarga)}</dd>${r.periodo?`<dt>Período de los datos</dt><dd>${esc(r.periodo)}</dd>`:''}${r.notas?`<dt>Notas</dt><dd>${esc(r.notas)}</dd>`:''}</dl></article>`;}
function render(){
 const {list,institutionMatches}=search();$('#resTitle').textContent=state.q?`Resultados para «${state.q}»`:'Recursos disponibles';
 $('#count').textContent=`${list.length} ${list.length===1?'recurso':'recursos'}`;
 const active=[state.area,state.inst?producers.get(state.inst)?.label:'',state.amb,state.download?'Con descarga':'',...institutionMatches.map(id=>producers.get(id).label)].filter(Boolean);
 $('#interp').textContent=active.length?'Selección: '+[...new Set(active)].join(' · '):'';
 $('#results').innerHTML=list.length?Object.entries(A).map(([key,area])=>{
  const items=list.filter(r=>r.area===area);if(!items.length)return '';
  const limit=areaLimits[key]||6;
  return `<section class="resource-block" aria-labelledby="block-${key}"><div class="resource-block-head"><h3 id="block-${key}">${esc(area)}</h3><span>${items.length} ${items.length===1?'recurso':'recursos'}</span></div><div class="results">${items.slice(0,limit).map(card).join('')}</div>${items.length>limit?`<button class="showall" data-more-area="${key}">Ver más de esta área (${items.length-limit} restantes)</button>`:''}</section>`;
 }).join(''):'<div class="empty">No encontramos coincidencias. Probá otra palabra o limpiá los filtros.</div>';
 $('#clearFilters').disabled=!(state.area||state.inst||state.amb||state.download);
}
const resetFilters=()=>{state.area='';state.inst='';state.amb='';state.download=false;state.limit=24;$('#areaFilter').value='';$('#institutionFilter').value='';$('#scopeFilter').value='';$('#downloadFilter').checked=false;};
function openResults(q=state.q){state.q=q;state.limit=24;$('#heroQ').value=q;$('#resultados').hidden=false;render();$('#resultados').scrollIntoView({behavior:'auto',block:'start'});$('#resTitle').focus({preventScroll:true});}
$('#filters').innerHTML=`<h3>Filtrar recursos</h3><label for="areaFilter">Tema general</label><select id="areaFilter"><option value="">Todos los temas</option>${Object.values(A).map(a=>`<option value="${esc(a)}">${esc(a)}</option>`).join('')}</select><label for="institutionFilter">Institución</label><select id="institutionFilter"><option value="">Todas las instituciones</option>${[...producers.values()].sort((a,b)=>a.label.localeCompare(b.label,'es')).map(p=>`<option value="${esc(p.id)}">${esc(p.label)}</option>`).join('')}</select><label for="scopeFilter">Ámbito</label><select id="scopeFilter"><option value="">Todos</option>${['Nacional','Departamental','Internacional'].map(a=>`<option>${a}</option>`).join('')}</select><label class="check"><input id="downloadFilter" type="checkbox"> Con descarga confirmada</label><button class="reset" id="clearFilters" data-act="clear">Limpiar filtros</button>`;
$('#areas').innerHTML=Object.entries(A).map(([k,a])=>{const ts=Object.entries(T).filter(([id,t])=>t.area===k).map(([id,t])=>({id,t,n:R.filter(r=>r.tema===id||r.temas_sec.includes(id)).length})).filter(x=>x.n);return `<div class="area"><header><h3>${esc(a)}</h3></header><div class="tiles">${ts.map(({id,t,n})=>`<button class="tile available" data-topic="${id}"><span class="tn">${esc(t.nombre)}</span><span class="tc">${n}</span></button>`).join('')}</div></div>`;}).join('');
let showAllInstitutions=false;
function renderInstitutions(){const q=norm($('#institutionSearch').value);const items=[...producers.values()].filter(p=>norm([p.label,...p.aliases].join(' ')).includes(q)).sort((a,b)=>a.label.localeCompare(b.label,'es'));const shown=q||showAllInstitutions?items:items.slice(0,12);$('#institutionList').innerHTML=shown.map(p=>`<button class="institution-entry" data-institution="${esc(p.id)}"><span>${esc(p.label)}</span><small>${p.items.length} ${p.items.length===1?'recurso':'recursos'}</small></button>`).join('')||'<p>No encontramos esa institución.</p>';$('#moreInstitutions').hidden=!!q||showAllInstitutions||items.length<=12;}
$('#institutionSearch').addEventListener('input',renderInstitutions);
$('#moreInstitutions').addEventListener('click',()=>{showAllInstitutions=true;renderInstitutions();});
renderInstitutions();
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
 if(b.dataset.moreArea){const key=b.dataset.moreArea;areaLimits[key]=(areaLimits[key]||6)+12;render();}
 if(b.dataset.q!==undefined){resetFilters();openResults(b.dataset.q);}
 if(b.dataset.topic){resetFilters();openResults(T[b.dataset.topic].nombre);}
 if(b.dataset.institution){resetFilters();state.inst=b.dataset.institution;$('#institutionFilter').value=state.inst;openResults('');}
 if(b.dataset.ficha){const panel=document.getElementById('f-'+b.dataset.ficha);panel.hidden=!panel.hidden;b.setAttribute('aria-expanded',String(!panel.hidden));b.textContent=panel.hidden?'Más información':'Ocultar información';}
 if(b.dataset.act==='browse'){resetFilters();openResults('');}
 if(b.dataset.act==='clear'){resetFilters();render();}
 if(b.dataset.act==='close'){$('#resultados').hidden=true;$('#heroQ').focus();}
 if(b.dataset.act==='more'){state.limit+=24;render();}
});
$('#heroForm').addEventListener('submit',e=>{e.preventDefault();resetFilters();openResults($('#heroQ').value);});
$('#filters').addEventListener('change',()=>{state.area=$('#areaFilter').value;state.inst=$('#institutionFilter').value;state.amb=$('#scopeFilter').value;state.download=$('#downloadFilter').checked;state.limit=24;render();});
// Expose pure directory queries for local regression checks, without depending on layout.
window.Directory={search,producer,state,producers,resetFilters,openResults};
render();
})();
