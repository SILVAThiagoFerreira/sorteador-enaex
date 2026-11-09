# Sorteio de brindes | US Vale Verde

Página estática que sorteia, com chances iguais, entre chaveiro trena Enaex e lanterna chaveiro Enaex. Não requer login, estoque, Apps Script ou planilha. Cada clique realiza um sorteio independente no navegador; os resultados não são registrados.

A roleta gira por oito segundos e respeita a preferência de movimento reduzido do dispositivo. O QR Code em `assets/qr-sorteador.png` aponta para a página publicada em https://silvathiagoferreira.github.io/sorteador-enaex/.

Para verificar: `node --check app.js` e `node tests/contracts.cjs`. O diretório `backend/` é legado e não é usado pela página.
