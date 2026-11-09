const fs=require('fs'),assert=require('assert');
const html=fs.readFileSync('index.html','utf8'),js=fs.readFileSync('app.js','utf8');
for(const path of ['assets/qr-sorteador.png','assets/logo.png','assets/trena.png','assets/lanterna.png','assets/xbooster-mascote.svg','assets/xbooster-animado.svg'])assert(fs.existsSync(path),path);
assert(html.includes('id="wheel"')&&html.includes('id="spin"'));
assert(js.includes('12000')&&js.includes('crypto.getRandomValues'));
assert(!/fetch\s*\(/.test(js));
console.log('Contratos da página estática verificados.');
