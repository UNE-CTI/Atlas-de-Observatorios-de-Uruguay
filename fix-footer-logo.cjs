const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const css='\n/* Preserve the footer logo aspect ratio instead of stretching it across a flex row. */\n.une-footer .wrap{display:flex;flex-direction:column;align-items:flex-start;justify-content:flex-start;gap:22px}.une-footer img{display:block;flex:none;align-self:flex-start;width:310px;max-width:100%;height:auto;object-fit:contain}.une-footer p{margin:0}\n';
for(const name of ['site/template.html','index.html']){
 const file=path.join(root,name);let text=fs.readFileSync(file,'utf8');
 if(!text.includes('/* Preserve the footer logo aspect ratio'))text=text.replace('</style>',css+'</style>');
 fs.writeFileSync(file,text);
}
const generator=path.join(root,'scripts/update-une.cjs');
if(!fs.readFileSync(generator,'utf8').includes("require('./fix-footer-logo.cjs')"))fs.appendFileSync(generator,"\nrequire('./fix-footer-logo.cjs');\n");
console.log('Logo del pie: proporciones conservadas y alineación sin estiramiento.');
