const fs=require('fs'),assert=require('assert');
const html=fs.readFileSync('index.html','utf8'),js=fs.readFileSync('app.js','utf8');
for(const path of ['assets/qr-sorteador.png','assets/logo.png','assets/trena.png','assets/lanterna.png'])assert(fs.existsSync(path),path);
assert(html.includes('id="wheel"')&&html.includes('id="spin"'));
assert(js.includes('8000')&&js.includes('crypto.getRandomValues'));
assert(!/fetch\s*\(/.test(js));
console.log('Contratos da página estática verificados.');
