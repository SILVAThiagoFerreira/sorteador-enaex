# Fluxo

1. Carregar configuração e autenticar no backend.
2. Ler e validar histórico do XLSX.
3. Validar e registrar estoque inicial ou ajuste.
4. Serializar o sorteio com lock, selecionar uma unidade, acrescentar registro e atualizar o arquivo por ID.
5. Confirmar resultado, animar a roleta e exibir quantidades.

Falhas são apresentadas e nenhuma confirmação é exibida antes da gravação. Confirme o histórico após qualquer interrupção de rede.
