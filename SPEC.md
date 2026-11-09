# Especificação

A página abre diretamente na roleta e sorteia entre chaveiro trena Enaex (15%), lanterna chaveiro Enaex (15%) e nenhuma premiação (70%), com sorteios independentes. A seleção acontece no navegador com `crypto.getRandomValues`. Não há autenticação, estoque, histórico ou requisições ao backend.

O giro dura 12 segundos e para no setor correspondente ao resultado. A preferência do sistema por movimento reduzido é respeitada. O QR Code direciona para a página pública.
