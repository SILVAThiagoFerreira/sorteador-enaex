# Especificação

Dois brindes configurados com estoque inteiro não negativo; cada sorteio consome exatamente uma unidade escolhida com probabilidade proporcional ao estoque. A seleção e escrita são serializadas no Apps Script; a interface não confirma o resultado se a gravação falhar. Ajustes de estoque exigem senha. O estado é reconstruído a partir do histórico na aba Sorteios_IA do XLSX original. A senha simples é apenas um bloqueio operacional; não representa segurança de produção.

O serviço bloqueia requisições inválidas, estoque zerado e IDs duplicados de catálogo. Requisições de sorteio são identificadas por UUID para evitar gravação duplicada em repetição da mesma solicitação. Falhas de rede podem deixar resultado incerto e exigem conferência do histórico antes de nova tentativa.
