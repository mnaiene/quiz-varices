const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const dataCode=fs.readFileSync(path.join(__dirname,'../dist/quiz-data.js'),'utf8');
const appCode=fs.readFileSync(path.join(__dirname,'../dist/app.js'),'utf8');
const ctx=vm.createContext({});vm.runInContext(dataCode,ctx);const D=ctx.QuizData;
const answersFor=indices=>Object.fromEntries(D.questions.map((q,i)=>[q.id,q.options[indices[i]||0][0]]));

test('Todos os 16.384 caminhos e seus alertas respeitam pontuação e prioridade',()=>{
  let count=0,min=Infinity,max=-Infinity;
  function walk(i,answers,total){
    if(i===D.questions.length){
      const result=D.classify(answers,'none');
      assert.equal(result.score,total);
      assert.equal(result.segment,total<=3?'A':total<=9?'B':'C');
      for(const alert of ['chest','bleeding','swelling']){
        const r=D.classify(answers,alert);
        assert.equal(r.segment,'D');assert.equal(r.score,null);assert.equal(r.alert,alert);
      }
      count++;min=Math.min(min,total);max=Math.max(max,total);return;
    }
    const q=D.questions[i];for(const option of q.options)walk(i+1,{...answers,[q.id]:option[0]},total+option[2]);
  }
  walk(0,{},0);assert.equal(count,16384);assert.equal(min,0);assert.equal(max,12);
});
test('Limites exatos de segmentação 3/4/9/10/12',()=>{
  for(const [indices,score,segment] of [
    [[3,0,0,0,0,0,0],3,'A'],[[3,1,0,0,0,0,0],4,'B'],[[3,3,3,1,0,0,0],9,'B'],[[3,3,3,1,1,0,0],10,'C'],[[3,3,3,1,3,0,0],12,'C']
  ]){const r=D.classify(answersFor(indices),'none');assert.equal(r.score,score);assert.equal(r.segment,segment);}
});
test('Dados incompletos não dão resultado comum, mas não bloqueiam urgência',()=>{
  assert.throws(()=>D.classify({},'none'));
  assert.throws(()=>D.classify(answersFor([]),undefined));
  assert.throws(()=>D.classify({...answersFor([]),discomfort:'invalid'},'none'));
  for(const alert of ['chest','bleeding','swelling'])assert.equal(D.classify({},alert).segment,'D');
});

// Minimal event/DOM doubles: these tests exercise app wiring, not browser layout,
// native validation, focus behavior or accessibility APIs.
function harness(){
  const handlers={},elements={};let currentHistory=0;
  function element(id){return elements[id]??={innerHTML:'',textContent:'',tabIndex:0,focus(){},scrollIntoView(){},addEventListener(type,fn){this[type]=fn;},querySelector(sel){return element(sel);},showModal(){this.open=true;},close(){this.open=false;}};}
  const main=element('#main'),historyEntries=[];
  const context=vm.createContext({console,Blob,URL,setTimeout,
    document:{querySelector:element,addEventListener(type,fn){handlers[type]=fn;},body:{append(){}},createElement(){return {click(){},remove(){}};}},
    history:{pushState(s){historyEntries.splice(++currentHistory);historyEntries[currentHistory]=s;},replaceState(s){historyEntries[currentHistory]=s;},back(){if(currentHistory){currentHistory--;handlers.popstate({state:historyEntries[currentHistory]});}}},
    FormData:class{constructor(form){this.values=form.values;}get(key){return this.values[key]??null;}}
  });
  context.window=context;context.scrollTo=()=>{};context.print=()=>{};context.addEventListener=(type,fn)=>handlers[type]=fn;
  vm.runInContext(dataCode,context);vm.runInContext(appCode,context);
  const click=action=>handlers.click({target:{closest(){return {dataset:{action}};}}});
  const submit=(id,values={},valid=true)=>{let reset=false;handlers.submit({preventDefault(){},target:{id,values,reportValidity(){return valid;},reset(){reset=true;}}});return reset;};
  const choose=(name,value)=>handlers.change({target:{type:'radio',value,name}});
  return {main,elements,click,submit,choose,context,back:()=>context.history.back()};
}
function complete(h,indices=[]){h.click('start');D.questions.forEach((q,i)=>h.submit('question-form',{[q.id]:q.options[indices[i]||0][0]}));h.submit('safety-form',{safety:'none'});}
test('Fluxos A/B/C exibem pré-venda, acesso direto à compra e conteúdo secundário',()=>{
  for(const [indices,title] of [[[],D.results.A.title],[[3,1],D.results.B.title],[[3,3,3,1,3],D.results.C.title]]){
    const h=harness();complete(h,indices);
    assert.ok(h.main.innerHTML.includes(title));assert.ok(h.main.innerHTML.includes('id="guide"'));assert.ok(h.main.innerHTML.includes('id="lead-form"'));
    assert.ok(h.main.innerHTML.indexOf('data-action="purchase"')<h.main.innerHTML.indexOf('id="lead-form"'));
    h.click('edit');assert.ok(h.main.innerHTML.includes('name="discomfort"'));
  }
});
test('Navegação anterior conserva seleção, incluindo botão do navegador',()=>{
  const h=harness();h.click('start');h.choose('discomfort','medium');h.submit('question-form',{discomfort:'medium'});
  h.click('back');assert.match(h.main.innerHTML,/value="medium" checked/);
  h.submit('question-form',{discomfort:'medium'});h.back();assert.match(h.main.innerHTML,/value="medium" checked/);
  h.submit('question-form',{discomfort:'medium'},false);assert.ok(h.main.innerHTML.includes('name="discomfort"'));
});
test('Alerta acessível desde início ignora score e remove captação',()=>{
  for(const alert of ['chest','bleeding','swelling']){
    const h=harness();h.click('safety');h.submit('safety-form',{safety:alert});
    assert.ok(h.main.innerHTML.includes(D.alerts[alert].title));assert.ok(!h.main.innerHTML.includes('lead-form'));assert.ok(!h.main.innerHTML.includes('data-action="download"'));assert.ok(!h.main.innerHTML.includes('data-action="purchase"'));
  }
});
test('Segurança sem alertas e quiz incompleto retoma primeira pergunta pendente',()=>{
  const h=harness();h.click('safety');h.submit('safety-form',{safety:'none'});assert.ok(h.main.innerHTML.includes('name="discomfort"'));
});
test('Formulário demo valida, limpa campos e informa ausência de envio',()=>{
  const h=harness();complete(h);
  assert.equal(h.submit('lead-form',{email:'fake@example.com'},false),false);
  assert.equal(h.submit('lead-form',{email:'fake@example.com',consent:'on'},true),true);
  assert.match(h.elements['#form-status'].textContent,/No se ha enviado ni guardado/);
  h.click('restart');h.click('start');assert.ok(!h.main.innerHTML.includes('value="none" checked'));
});
test('Nenhum transporte, pixel ou armazenamento no código entregue',()=>{
  assert.doesNotMatch(appCode+dataCode,/\bfetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|document\.cookie|fbq\s*\(|gtag\s*\(/);
  const html=fs.readFileSync(path.join(__dirname,'../dist/index.html'),'utf8');
  assert.doesNotMatch(html,/<(?:script|link)[^>]+(?:src|href)="https?:/);
  assert.match(html,/<html lang="es">/);assert.match(html,/name="viewport"/);
});
test('Todos os CTAs comerciais preservam exatamente o link e abrem na mesma aba',()=>{
  const expected='https://uh21eb1372uh.axdsz.pro/?target=-7EBNQCgQAAAflWwUDyoMABQEBEREKEQkKEQ1CEQ0SAAF_YWRjb21ibwEx';
  assert.equal(D.purchaseUrl,expected);
  for(const indices of [[],[3,1],[3,3,3,1,3]]){
    const h=harness();complete(h,indices);
    const links=[...h.main.innerHTML.matchAll(/<a\b[^>]*data-action="purchase"[^>]*>/g)].map(m=>m[0]);
    assert.equal(links.length,2);
    for(const link of links){assert.ok(link.includes(`href="${expected}"`));assert.doesNotMatch(link,/\starget\s*=/);assert.match(link,/rel="sponsored noreferrer"/);}
    assert.ok(h.main.innerHTML.includes('CONTENIDO COMERCIAL'));
    assert.ok(h.main.innerHTML.includes('Veniselle'));assert.ok(h.main.innerHTML.includes('49 €'));
    assert.ok(h.main.innerHTML.includes('Confirma el importe final'));
  }
});
