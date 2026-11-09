const FILE_ID = '12kzc2a1VS7hLdK17wgk1yyHDNC-sI4Ta';
const SHEET_NAME = 'Sorteios_IA';
const CATALOG = [{id:'trena',name:'Chaveiro trena Enaex'},{id:'lanterna',name:'Lanterna chaveiro Enaex'}];
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
    const q = JSON.parse(e.postData.contents);
    if(q.user !== 'admin' || q.password !== 'admin') throw Error('Usuário ou senha incorretos.');
    const archive = readArchive_(), history = readHistory_(archive), last = history.length ? history[history.length-1].state : {active:false,delivered:0,items:CATALOG.map(x=>({...x,quantity:0}))};
    if(q.action==='verify' || q.action==='state') return json_({ok:true,state:last});
    if(q.action==='configure') {
      if(!Array.isArray(q.items) || q.items.length!==CATALOG.length || new Set(q.items.map(x=>x.id)).size!==CATALOG.length) throw Error('Lista de brindes inválida.');
      const items=CATALOG.map(x=>{const found=q.items.find(y=>y.id===x.id);if(!found||!Number.isSafeInteger(found.quantity)||found.quantity<0||found.quantity>100000)throw Error('Quantidade inválida.');return {...x,quantity:found.quantity}});
      if(!items.some(x=>x.quantity))throw Error('Informe pelo menos um brinde disponível.');
      const state={active:true,delivered:last.delivered,items};
      append_(archive,history,{type:'ajuste',timestamp:new Date().toISOString(),state});return json_({ok:true,state});
    }
    if(q.action==='draw') {
      if(typeof q.requestId!=='string'||!/^[-a-f0-9]{36}$/i.test(q.requestId))throw Error('Identificador de sorteio inválido.');
      const previous=history.find(x=>x.requestId===q.requestId);if(previous)return json_({ok:true,state:previous.state,prize:previous.prize});
      if(!last.active)throw Error('Inicie o evento antes de sortear.');
      const total=last.items.reduce((a,x)=>a+x.quantity,0);if(!total)throw Error('Não há brindes disponíveis.');
      let ticket=Math.random()*total, selected;for(const x of last.items){if(ticket<x.quantity){selected=x;break}ticket-=x.quantity}
      const prize={id:selected.id,name:selected.name,offset:ticket};
      const state={active:true,delivered:last.delivered+1,items:last.items.map(x=>({...x,quantity:x.quantity-(x.id===selected.id?1:0)}))};
      append_(archive,history,{type:'sorteio',timestamp:new Date().toISOString(),requestId:q.requestId,prize,state});return json_({ok:true,state,prize});
    }
    throw Error('Operação desconhecida.');
  } catch(err) { console.error(err.stack||err);return json_({ok:false,error:err.message||'Erro na base.'}); } finally {if(lock.hasLock())lock.releaseLock();}
}
function json_(v){return ContentService.createTextOutput(JSON.stringify(v)).setMimeType(ContentService.MimeType.JSON)}
function readArchive_(){const file=DriveApp.getFileById(FILE_ID);if(file.getMimeType()!=='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')throw Error('A base precisa ser um arquivo XLSX.');const blobs=Utilities.unzip(file.getBlob());const files={};blobs.forEach(b=>files[b.getName()]=b);return files}
function xml_(files,name){if(!files[name])throw Error('Estrutura XLSX inválida: '+name);return files[name].getDataAsString('UTF-8')}
function sheetPath_(files){const w=xml_(files,'xl/workbook.xml'), r=xml_(files,'xl/_rels/workbook.xml.rels');const m=w.match(/<sheet\b[^>]*\bname="Sorteios_IA"[^>]*\br:id="([^"]+)"[^>]*\/?\s*>/);if(!m)return null;const rel=[...r.matchAll(/<Relationship\b[^>]*\/?\s*>/g)].map(x=>x[0]).find(x=>x.includes('Id="'+m[1]+'"'));if(!rel)throw Error('Referência da aba de sorteios inválida.');let target=(rel.match(/Target="([^"]+)"/)||[])[1];if(!target)throw Error('Caminho da aba inválido.');return target.startsWith('/')?target.slice(1):'xl/'+target.replace(/^\.\//,'')}
function readHistory_(files){const path=sheetPath_(files);if(!path)return [];const content=xml_(files,path);return [...content.matchAll(/<c\b[^>]*\br="E\d+"[^>]*>\s*<is>\s*<t>([^<]+)<\/t>\s*<\/is>\s*<\/c>/g)].map(m=>JSON.parse(Utilities.newBlob(Utilities.base64Decode(m[1])).getDataAsString('UTF-8')))}
function put_(files,name,text){files[name]=Utilities.newBlob(text,'application/xml',name)}
function escapeXml_(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function append_(files,history,event){let path=sheetPath_(files);if(!path){let w=xml_(files,'xl/workbook.xml'),rels=xml_(files,'xl/_rels/workbook.xml.rels'),ct=xml_(files,'[Content_Types].xml');const nums=Object.keys(files).map(x=>/^xl\/worksheets\/sheet(\d+)\.xml$/.exec(x)).filter(Boolean).map(x=>+x[1]);const n=Math.max(0,...nums)+1;path='xl/worksheets/sheet'+n+'.xml';const ids=[...w.matchAll(/sheetId="(\d+)"/g)].map(x=>+x[1]);const sheetId=Math.max(0,...ids)+1;const rids=[...rels.matchAll(/Id="rId(\d+)"/g)].map(x=>+x[1]);const rid='rId'+(Math.max(0,...rids)+1);w=w.replace('</sheets>','<sheet name="'+SHEET_NAME+'" sheetId="'+sheetId+'" r:id="'+rid+'"/></sheets>');rels=rels.replace('</Relationships>','<Relationship Id="'+rid+'" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet'+n+'.xml"/></Relationships>');ct=ct.replace('</Types>','<Override PartName="/'+path+'" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>');put_(files,'xl/workbook.xml',w);put_(files,'xl/_rels/workbook.xml.rels',rels);put_(files,'[Content_Types].xml',ct);put_(files,path,'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData><row r="1">'+['Data UTC','Operação','Brinde','ID sorteio','Registro'].map((s,i)=>'<c r="'+String.fromCharCode(65+i)+'1" t="inlineStr"><is><t>'+s+'</t></is></c>').join('')+'</row></sheetData></worksheet>')}
const row=history.length+2,values=[event.timestamp,event.type,event.prize?event.prize.name:'',event.requestId||'',Utilities.base64Encode(JSON.stringify(event),Utilities.Charset.UTF_8)];const cells=values.map((v,i)=>'<c r="'+String.fromCharCode(65+i)+row+'" t="inlineStr"><is><t>'+escapeXml_(v)+'</t></is></c>').join('');put_(files,path,xml_(files,path).replace('</sheetData>','<row r="'+row+'">'+cells+'</row></sheetData>'));
const zipped=Utilities.zip(Object.values(files),'base.xlsx');const response=UrlFetchApp.fetch('https://www.googleapis.com/upload/drive/v3/files/'+FILE_ID+'?uploadType=media',{method:'patch',contentType:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',payload:zipped.getBytes(),headers:{Authorization:'Bearer '+ScriptApp.getOAuthToken()},muteHttpExceptions:true});if(response.getResponseCode()!==200)throw Error('Falha ao salvar na base ('+response.getResponseCode()+'). Nenhum sorteio foi confirmado.');}
