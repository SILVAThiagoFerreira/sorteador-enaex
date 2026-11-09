# Sorteio de brindes | US Vale Verde

Aplicação estática de eventos com backend Google Apps Script e registros no arquivo XLSX do Drive informado. Acesso inicial solicitado: admin / admin. Essas credenciais são públicas e oferecem apenas uma barreira operacional, não segurança contra acesso indevido.

## Configuração
`config.json` define nome, catálogo, endereço do backend e identificador da planilha. O backend em `backend/Code.js` mantém seu próprio catálogo e identificador para validação; mantenha ambos sincronizados. O arquivo XLSX ganha a aba `Sorteios_IA` com histórico, sem converter o original. Apps Script requer autorização do proprietário para acesso ao Drive antes do primeiro uso.

## Uso
Entre, informe as quantidades e inicie. O backend escolhe um item proporcionalmente ao estoque, registra e só então confirma o resultado. A senha é exigida para gerenciar o evento. O navegador não impede que alguém feche a aba ou abra ferramentas de desenvolvedor.

## Publicação
O GitHub Pages serve a raiz. `npx @google/clasp push` atualiza o backend; uma nova versão da implantação é necessária para disponibilizar alterações. Não inclua credenciais privadas no repositório.

## Verificação
Execute `node --check app.js`, `node --check backend/Code.js` e `node tests/contracts.cjs`. Antes de um evento, verifique a autorização do serviço, teste em cópia da base e valide o registro no XLSX.
