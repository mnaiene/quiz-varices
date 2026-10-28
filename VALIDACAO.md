# Validação — Quiz + pré-venda comercial

Atualizada em 29/10/2026.

## Resultado

- **10 testes automatizados aprovados; 0 falhas.**
- Sintaxe dos dois scripts JavaScript validada com `node --check`.
- Estrutura do HTML, referências locais e integridade do ZIP verificadas.

## Cobertura

1. Todas as 16.384 combinações de respostas, scores 0–12 e classificação A/B/C.
2. Três sinais de alerta por combinação: 49.152 verificações de prioridade D, sem cálculo de score.
3. Limites 3/4/9/10/12 e dados incompletos ou inválidos.
4. Simulação dos percursos A/B/C com pré-venda, CTAs antes do formulário e edição de respostas.
5. Simulação de navegação anterior e histórico com conservação das escolhas.
6. Alertas acessíveis antes do quiz, sem CTAs de compra, formulário ou download no resultado D.
7. Retomada da primeira pergunta pendente no percurso sem alertas.
8. Simulação do formulário demonstrativo, respeito ao retorno de validação, limpeza e mensagem sem envio.
9. Ausência de chamadas de transporte, pixels e armazenamento persistente no código do quiz.
10. Dois links comerciais em cada resultado A/B/C com o endereço exato fornecido, parâmetro `target` preservado, navegação na mesma aba e sem respostas anexadas.

Os testes de eventos usam doubles mínimos de DOM. Não verificam o comportamento real da validação nativa, o foco, a renderização, o download ou a navegação externa de um navegador.

## Limites

A inspeção visual em navegador não está disponível no ambiente desta sessão. O endereço de rastreamento devolveu HTTP 403 à leitura automática. As capturas fornecidas e a leitura da página comercial `https://es7.veniselle.name/` confirmaram a identificação Veniselle, a apresentação como creme para pernas e os 49 EUR anunciados. O destino do rastreador e o checkout externo não foram testados para visitantes reais. O preço deve ser confirmado no destino. Não foram presumidas evidências clínicas, garantias ou disponibilidade.

## Conferência manual antes de veicular anúncios

- Abra `dist/index.html` em 320, 390, 768 e 1440 px e teste também no navegador interno de Facebook/Instagram.
- Teste teclado, rádios, Enter e Escape no diálogo.
- Confira A com todas as primeiras opções; B com desconforto intenso e frequência “Algunos días”; C com as maiores pontuações nas cinco primeiras perguntas.
- Em cada resultado A/B/C, clique nos dois CTAs de compra e confira o destino final no país de veiculação.
- Selecione cada alerta e confirme que a compra não é oferecida.
- Teste voltar, editar e reiniciar. Confira as seções expansíveis de informações e contato.
- Teste o formulário com e-mail inválido, consentimento desmarcado e dados válidos fictícios.
- Confira downloads, impressão, privacidade e fontes.

Nada foi publicado; nenhum CRM foi conectado; nenhuma compra ou envio de lead foi realizado.
