# A tu paso — Quiz + pré-venda Veniselle

Funil em espanhol para apresentar Veniselle, a crema para pernas do anúncio, e encaminhar visitantes à página de pedido indicada. Arquivos estáticos, editáveis, sem dependências. Atualizado em 29/10/2026.

## Fluxo de venda

**Anúncio → landing do quiz → 7 perguntas → verificação de alertas → pré-venda personalizada A/B/C → página de compra.**

A finalidade comercial aparece na entrada e nos resultados. O resultado funciona como pré-venda: identifica a prioridade declarada, prepara a revisão da oferta e apresenta dois CTAs de compra. Guias e formulário são secundários, recolhidos em seções expansíveis. A compra não exige preencher o formulário.

Os CTAs abrem, na mesma aba, exatamente este endereço:

https://uh21eb1372uh.axdsz.pro/?target=-7EBNQCgQAAAflWwUDyoMABQEBEREKEQkKEQ1CEQ0SAAF_YWRjb21ibwEx

A navegação acontece ao clicar em **Ver Veniselle y hacer mi pedido**, **Ver la oferta de Veniselle**, **Conocer Veniselle y revisar el pedido** ou **Quiero pedir Veniselle**. Não existe temporizador nem navegação automática antes de a pessoa ler a pré-venda. Nenhuma compra é realizada pelo próprio quiz.

O parâmetro `target` foi mantido. O quiz não acrescenta respostas, pontuação, segmento, nome, e-mail ou parâmetros UTM ao link. A página externa e seus intermediários podem usar rastreamento próprio; o quiz não controla isso.

## Abrir

1. Extraia o ZIP.
2. Abra `dist/index.html` num navegador atual.
3. Responda ao quiz, veja a pré-venda e clique no botão para continuar à compra.

Alternativamente, com Python instalado, execute na pasta do projeto:

```sh
python3 -m http.server 8080 --directory dist
```

Abra `http://localhost:8080`. Esse servidor é local e não publica o site na internet.

## Personalização do produto

O endereço de rastreamento fornecido bloqueou a leitura automática com HTTP 403. As capturas enviadas pelo usuário e a leitura da página `https://es7.veniselle.name/` identificaram o produto como **Veniselle, creme para pernas**, com preço anunciado de **49 EUR**. Esses dados foram integrados à landing e à pré-venda. O preço é apresentado como anunciado, com pedido de confirmação de importe final, gastos e disponibilidade no destino.

O funil permanece comercial e voltado à compra. Não foram reproduzidas como fatos comprovados as alegações de cura, regeneração das veias, percentuais de eficácia, ausência de alergias, programas especiais, escassez ou cronômetros presentes na página do vendedor. A identificação e apresentação comercial não demonstram eficácia clínica.

O checkout externo e a disponibilidade do endereço de rastreamento para visitantes reais precisam ser conferidos no país de veiculação. O local do link é `purchaseUrl`, no final de `dist/quiz-data.js`. Todas as chamadas de compra usam essa única configuração. A embalagem das capturas serviu como referência de identificação; as capturas não são distribuídas neste pacote.

## Arquivos editáveis

| Arquivo | Conteúdo |
| --- | --- |
| `dist/index.html` | Estrutura, cabeçalho, rodapé e metadados |
| `dist/styles.css` | Visual, responsividade, pré-venda e impressão |
| `dist/quiz-data.js` | Perguntas, pontuação, segmentos, copy de resultados, alertas e link de compra |
| `dist/app.js` | Landing, navegação, pré-venda, CTAs, guias e formulário |
| `tests/quiz.test.cjs` | Testes de lógica e simulação de eventos |
| `VALIDACAO.md` | Verificações e limitações |

Para mudar a headline de entrada, edite `landing()` em `app.js`. Para mudar a argumentação da pré-venda, edite os resultados em `quiz-data.js` e a função `offer()` em `app.js`.

## Segmentação

| Pergunta | Pontos |
| --- | --- |
| Desconforto | 0–3 |
| Frequência | 0–3 |
| Tempo de evolução | 0–2 |
| Contexto | 0–1 |
| Impacto na rotina | 0–3 |
| Medidas anteriores | Sem pontos; personalização |
| Prioridade antes da compra | Sem pontos; personalização |

- A, 0–3: pré-venda com foco em rotina e interesse inicial; CTA **Ver Veniselle y hacer mi pedido**.
- B, 4–9: pré-venda com foco em comparar opções; CTA **Ver la oferta de Veniselle**.
- C, 10–12: pré-venda com foco em decisão informada e avaliação profissional para os sintomas; CTA **Conocer Veniselle y revisar el pedido**.
- D, qualquer sinal de alerta: orientação prioritária, sem oferta ou encaminhamento de compra. A pessoa pode acessar a verificação de alertas já no cabeçalho.

A pontuação organiza o percurso comercial; não é escala clínica validada, indicação de produto, diagnóstico ou medida de gravidade. Os três percursos A/B/C têm acesso à oferta. Apenas D interrompe a venda diante de sinais de urgência.

## Formulário e privacidade

O formulário opcional continua demonstrativo: valida e-mail e consentimento, informa que nada foi enviado e limpa os campos. Não há CRM ou captação real. Ele fica recolhido abaixo da pré-venda e não bloqueia a compra.

As respostas ficam somente na memória da aba. Não há pixel Meta, cookies, analytics, fontes remotas ou armazenamento persistente no quiz. Recarregar ou reiniciar apaga as respostas. Uma integração futura de captação exigirá endpoint seguro e política de privacidade do responsável. Não exponha credenciais de CRM no JavaScript. Não envie dados ou inferências de saúde a pixels ou plataformas publicitárias.

## Publicação posterior

Nenhuma publicação foi realizada. O projeto funciona em hospedagem estática com HTTPS, sem backend nem build.

1. Crie um projeto no provedor escolhido.
2. Envie **o conteúdo da pasta `dist`**, com `index.html` na raiz pública. Se o provedor pedir diretório de saída, selecione `dist`; não há comando de build.
3. Não envie testes e documentação para a raiz pública.
4. Confira a aparência em celular/desktop e no navegador interno de Facebook/Instagram.
5. Teste todos os segmentos e, especialmente, a saída pelo link no país de veiculação.

O destino externo pode variar conforme o país, o dispositivo ou as regras do vendedor. O código não depende de acessar o destino durante o quiz.

## Testes

Com Node.js 18 ou superior:

```sh
node --test tests/quiz.test.cjs
node --check dist/app.js
node --check dist/quiz-data.js
```

Os testes simulam eventos com doubles de DOM; não substituem inspeção visual em navegador. Confira `VALIDACAO.md`.

## Fontes para informações gerais

- [Varicose veins — NHS](https://www.nhs.uk/conditions/varicose-veins/)
- [Deep vein thrombosis — NHS](https://www.nhs.uk/conditions/deep-vein-thrombosis-dvt/)
- [Pulmonary embolism — NHS](https://www.nhs.uk/conditions/pulmonary-embolism/)
- [Decision support tool: varicose veins — NHS England, PDF](https://www.england.nhs.uk/wp-content/uploads/2023/11/Decision-support-tool-making-a-decision-about-treatment-for-varicose-veins.pdf)

Essas fontes sustentam somente orientações gerais e sinais de alerta. Não são evidência de eficácia do produto anunciado nem aval do NHS à oferta. O conteúdo pede serviços locais de emergência sem supor um país específico.

## Referência comercial

Identificação do produto, apresentação como creme e preço anunciado: capturas fornecidas pelo usuário e [página comercial de Veniselle](https://es7.veniselle.name/), consultada em 29/10/2026. O link de compra do funil permanece o endereço de rastreamento fornecido, sem substituição pelo endereço de referência.
