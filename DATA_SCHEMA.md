# Dados

A aba `Sorteios_IA` é acrescentada ao XLSX de origem. Colunas: Data UTC, Operação, Brinde, ID sorteio e Registro. Registro contém JSON codificado em Base64, com estado completo, horário, tipo e, para sorteios, identificador e brinde. O estoque é o último estado registrado; registros anteriores são mantidos para auditoria.
