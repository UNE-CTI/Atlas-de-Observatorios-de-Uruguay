const fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'..');
const data=JSON.parse(fs.readFileSync(path.join(root,'data/atlas.json'),'utf8'));
let body=fs.readFileSync(path.join(root,'site/template.html'),'utf8').replace('__DATA_JSON__',JSON.stringify(data).replaceAll('</','<\\/'));
const i=body.indexOf('</style>')+8;
fs.writeFileSync(path.join(root,'index.html'),'<!doctype html>\n<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Encontrá datos, estadísticas e informes sobre Uruguay y conocé quién los publica.">'+body.slice(0,i)+'<style>body{margin:0}[hidden]{display:none!important}</style></head><body>'+body.slice(i)+'</body></html>');
console.log('Vista previa generada con',data.recursos.length,'recursos.');
