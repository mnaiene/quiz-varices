(function () {
  'use strict';
  const D=window.QuizData, main=document.querySelector('#main'), dialog=document.querySelector('#info-dialog');
  const state={answers:{},safety:null,result:null,view:'landing',index:0};
  const sourceLinks='<a href="https://www.nhs.uk/conditions/varicose-veins/" target="_blank" rel="noopener noreferrer">Varices · NHS ↗</a> <a href="https://www.nhs.uk/conditions/deep-vein-thrombosis-dvt/" target="_blank" rel="noopener noreferrer">Trombosis venosa · NHS ↗</a> <a href="https://www.nhs.uk/conditions/pulmonary-embolism/" target="_blank" rel="noopener noreferrer">Embolia pulmonar · NHS ↗</a>';
  const escapeHTML=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const button=(label,action,secondary=false)=>`<button type="button" class="button${secondary?' secondary':''}" data-action="${action}">${label}<span aria-hidden="true">↗</span></button>`;
  const purchaseLink=label=>`<a class="button purchase-link" data-action="purchase" href="${escapeHTML(D.purchaseUrl)}" rel="sponsored noreferrer">${label}<span aria-hidden="true">→</span></a>`;
  function route(view,index=0,replace=false){
    state.view=view;state.index=index;
    const hash={landing:'inicio',quiz:'test',safety:'seguridad',result:'resultado'}[view];
    history[replace?'replaceState':'pushState']({view,index},'',`#${hash}`);
    render();
  }
  function render(){
    main.innerHTML=state.view==='landing'?landing():state.view==='quiz'?question():state.view==='safety'?safety():result();
    const heading=main.querySelector('h1');
    if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}
    window.scrollTo({top:0,behavior:'instant'});
  }
  function landing(){return `
    <section class="hero" aria-labelledby="hero-title"><div>
      <div class="eyebrow">Veniselle · Crema para piernas</div>
      <h1 id="hero-title">¿Piernas pesadas<br>o varices<br><em>visibles?</em></h1>
      <p class="description">Conoce Veniselle, la crema para piernas que aparece en el anuncio. Responde 7 preguntas, identifica tus prioridades y continúa a la oferta para hacer tu pedido.</p>
      ${button('Hacer el test y conocer Veniselle','start')}
      <div class="hero-notes"><span>En unos 2 minutos</span><span>Sin registro obligatorio</span></div>
    </div><div class="art-panel">
      <span class="handwritten">Veniselle<small>CREMA PARA PIERNAS</small></span>
      <svg viewBox="0 0 450 520" role="img" aria-labelledby="art-title"><title id="art-title">Ilustración de una persona caminando entre plantas</title>
        <defs><pattern id="texture" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".5" fill="#234d40" opacity=".06"/></pattern></defs>
        <rect width="450" height="520" fill="url(#texture)"/><circle cx="200" cy="207" r="135" fill="#d8dfc4"/>
        <path d="M56 447C115 421 310 413 392 443" stroke="#a6b393" stroke-width="1" fill="none"/>
        <path d="M100 430C82 389 88 350 73 319M91 383Q50 374 58 346Q86 342 91 383M89 374Q112 350 106 325Q83 331 89 374M98 419Q68 415 67 394Q88 387 98 419" fill="#92a079" stroke="#829368" stroke-width="1.2"/>
        <path d="M354 435Q371 388 362 349M364 393Q338 381 341 359Q367 367 364 393M365 383Q392 369 393 346Q371 345 365 383M358 421Q383 414 384 395Q360 400 358 421" fill="#b1bd96"/>
        <path d="M225 265Q221 309 246 342L294 401L278 414L214 356Q193 330 184 289" fill="#c98d66" stroke="#76573d" stroke-width="1"/>
        <path d="M192 266Q183 314 160 343L137 404L156 414L190 358Q227 320 229 280" fill="#e0aa80" stroke="#76573d" stroke-width="1"/>
        <path d="M137 402L156 412L150 430Q139 435 117 429Q112 424 123 421Z" fill="#335443"/>
        <path d="M280 408L293 398L307 408Q321 413 323 422Q313 431 293 424Z" fill="#335443"/>
        <path d="M190 145Q211 130 234 145L251 206L235 287Q195 301 164 278L179 207Z" fill="#f1e8cb" stroke="#b7ae8e" stroke-width="1.3"/>
        <path d="M190 150Q181 179 170 197L140 217" stroke="#daa078" stroke-width="17" stroke-linecap="round" fill="none"/>
        <path d="M233 150Q241 171 252 186L279 171" stroke="#daa078" stroke-width="16" stroke-linecap="round" fill="none"/>
        <path d="M193 140L191 164L183 186L176 208M232 142L235 173L245 200" stroke="#8f9c71" stroke-width="3" fill="none"/>
        <path d="M205 142L208 124L224 122L225 145" fill="#daa078"/>
        <ellipse cx="217" cy="109" rx="22" ry="29" fill="#e2aa7d"/>
        <path d="M195 112Q181 87 202 77Q222 64 239 86Q249 109 230 129L227 111Q229 92 209 95L198 112Z" fill="#3c4733"/>
        <circle cx="239" cy="77" r="16" fill="#3c4733"/><path d="M226 106L233 112L227 115" fill="none" stroke="#9e6549" stroke-width="1"/>
        <path d="M181 206Q199 220 247 207M183 214Q187 250 177 278M216 221Q213 259 225 286" fill="none" stroke="#cdc3a3" stroke-width="1.5"/>
        <path d="M122 311Q119 301 129 294M302 294Q312 290 315 280" stroke="#738b59" stroke-width="2" fill="none"/>
      </svg><div class="art-caption"><span>PEQUEÑOS PASOS, CADA DÍA</span><span>CONOCE VENISELLE</span></div>
    </div></section>
    <aside class="intro-note"><span aria-hidden="true">ⓘ</span><div><strong>Contenido comercial.</strong> Este test te lleva a la página de venta de Veniselle. No diagnostica varices ni determina si el producto es adecuado para ti.</div></aside>
    <section class="how" aria-labelledby="how-title"><h2 id="how-title">Del anuncio<br>a tu siguiente paso.</h2><div class="how-list">
      <div class="how-item"><span>01</span><h3>Cuéntanos tu experiencia</h3><p>Siete preguntas sencillas sobre tu rutina y lo que notas.</p></div>
      <div class="how-item"><span>02</span><h3>Identifica tu prioridad</h3><p>Una página de continuación según tus respuestas.</p></div>
      <div class="how-item"><span>03</span><h3>Conoce la oferta</h3><p>Conoce Veniselle y continúa tu pedido, sin registro en este test.</p></div>
    </div></section>`;}
  function options(items,name,value){return `<fieldset class="options"><legend class="sr-only">Selecciona una respuesta</legend>${items.map((o,i)=>`<label class="option" for="answer-${i}"><input id="answer-${i}" type="radio" name="${name}" value="${o[0]}" ${value===o[0]?'checked':''} required><span>${o[1]}</span></label>`).join('')}</fieldset>`;}
  function question(){const q=D.questions[state.index];return `<section class="quiz-shell" aria-labelledby="question-title"><div class="quiz-top"><button type="button" class="back" data-action="back">← ${state.index===0?'Inicio':'Anterior'}</button><span>Pregunta ${state.index+1} de 7</span></div><div class="progress" role="progressbar" aria-label="Preguntas respondidas" aria-valuemin="0" aria-valuemax="7" aria-valuenow="${state.index}"><span style="width:${state.index/7*100}%"></span></div><span class="eyebrow">${q.label}</span><h1 class="question-heading" id="question-title">${q.title}</h1><p id="question-help" class="question-help">${q.help}</p><form id="question-form" aria-describedby="question-help">${options(q.options,q.id,state.answers[q.id])}<p class="error status-live" id="question-error" role="status"></p><div class="quiz-bottom"><p class="micro">Tus respuestas se usan solo en esta página. Puedes volver y cambiarlas.</p><button class="button" type="submit">${state.index===6?'Continuar':'Siguiente'} <span aria-hidden="true">→</span></button></div></form></section>`;}
  function safety(){return `<section class="quiz-shell" aria-labelledby="safety-title"><div class="quiz-top"><button class="back" data-action="back" type="button">← Volver</button><span>Comprobación adicional · sin puntuación</span></div><div class="progress"><span style="width:100%"></span></div><span class="eyebrow">Antes de continuar</span><h1 id="safety-title" class="question-heading">¿Tienes actualmente alguno de estos síntomas?</h1><p id="safety-help" class="question-help">Si tienes varios, selecciona el primero que aparezca en la lista.</p><div class="safety-box">Si tienes dolor en el pecho o dificultad repentina para respirar, contacta con emergencias ahora. No necesitas terminar el test.</div><form id="safety-form" aria-describedby="safety-help">${options(D.safetyOptions,'safety',state.safety)}<p class="error status-live" role="status" id="question-error"></p><div class="quiz-bottom"><p class="micro">Los signos de alerta siempre tienen prioridad sobre cualquier resultado.</p><button class="button" type="submit">Ver orientación <span aria-hidden="true">→</span></button></div></form></section>`;}
  function guideSteps(items){return `<ol class="guide-list">${items.map(([title,body])=>`<li><div><h3>${title}</h3><p>${body}</p></div></li>`).join('')}</ol>`;}
  function interest(){const g=state.answers.main_goal;if(g==='consultation'&&state.result.segment!=='C')return `<aside class="interest-note"><strong>Te interesa preparar una consulta.</strong><p>Lleva una lista de tus síntomas, medicamentos y preguntas. Puedes solicitar una valoración antes de decidir si comprar Veniselle.</p></aside>`;if(g==='appearance')return `<aside class="interest-note"><strong>Te interesa conocer las venas visibles.</strong><p>La apariencia por sí sola no permite valorar la salud de las venas. Un profesional puede explicarte si necesitan evaluación y qué opciones existen.</p></aside>`;if(state.answers.previous_actions==='consulted_professional')return `<aside class="interest-note"><strong>Ya has consultado con un profesional.</strong><p>Usa esta información para conversar en tu seguimiento y mantén las indicaciones que te hayan dado.</p></aside>`;return '';}
  function offer(){return `<section class="offer-panel" aria-labelledby="offer-title"><span class="eyebrow">VENISELLE · CREMA PARA PIERNAS</span><h2 id="offer-title" class="section-heading">Conoce Veniselle. Continúa tu pedido.</h2><p>Si llegaste por el anuncio, este es el producto que estabas buscando: Veniselle. Revisa su presentación y las condiciones de venta antes de hacer tu pedido.</p><div class="offer-price"><strong>49 €</strong><span>Precio anunciado en la página de venta.<br>Confirma el importe final, los gastos y la disponibilidad al continuar.</span></div><div class="offer-points"><div><span>01</span><h3>Conoce el producto</h3><p>Revisa su presentación y la información facilitada por el vendedor.</p></div><div><span>02</span><h3>Comprueba las condiciones</h3><p>Confirma precio, envío y condiciones de compra antes de hacer tu pedido.</p></div><div><span>03</span><h3>Continúa tu compra</h3><p>Si decides seguir, realiza el pedido en la página de destino.</p></div></div>${purchaseLink('Quiero pedir Veniselle')}<p class="micro">Saldrás de este test hacia una página externa. No necesitas dejar tu correo aquí.</p></section>`;}
  function result(){
    if(!state.result)return landing();
    const r=state.result,urgent=r.segment==='D',c=urgent?D.alerts[r.alert]:D.results[r.segment];
    const guide=`<section id="guide" class="guide" aria-labelledby="guide-title"><h2 id="guide-title" class="section-heading" tabindex="-1">${urgent?'Qué hacer ahora':c.guideTitle}</h2>${guideSteps(c.steps)}${urgent?'':`<div class="guide-actions">${button('Descargar información (.txt)','download',true)}${button('Imprimir información','print',true)}</div>`}<p class="source-note">Fuentes sanitarias (en inglés): ${sourceLinks}</p></section>`;
    return `<article class="result${urgent?' emergency':''}" aria-labelledby="result-title"><div class="result-top"><span>${urgent?'ORIENTACIÓN PRIORITARIA':'SIGUIENTE PASO · CONTENIDO COMERCIAL'}</span><span>A TU PASO</span></div><section class="result-hero"><div><span class="eyebrow">${c.label}</span><h1 id="result-title">${c.title}</h1><p class="result-intro">${c.intro}</p>${urgent?'':purchaseLink(c.cta)}${urgent?'':'<p class="micro">Continuarás a la página de venta de Veniselle para revisar la oferta y hacer tu pedido.</p>'}</div>${urgent?'':'<div class="result-seal" aria-hidden="true"><span>TU SIGUIENTE</span><b class="seal-product">Veniselle</b><span>CREMA PARA PIERNAS</span></div>'}</section><p class="result-disclaimer">${urgent?'Esta orientación no confirma la causa de tus síntomas. Busca la atención indicada.':'Este es un paso comercial para conocer Veniselle. No es un diagnóstico, una prescripción ni una confirmación de que el producto sea adecuado para ti.'}</p>${urgent?guide:offer()+interest()+`<details class="extra-content"><summary>Consultar información adicional sobre el cuidado de las piernas</summary>${guide}</details><details class="extra-content"><summary>Contacto opcional · formulario de demostración</summary>${leadForm()}</details>`}<div class="restart-row">${button('Volver al inicio','restart',true)}${urgent?'':'<button type="button" class="text-button" data-action="edit">Revisar mis respuestas</button>'}</div></article>`;
  }
  function leadForm(){return `<section class="lead-panel" aria-labelledby="lead-title"><div><span class="tag">CONTACTO OPCIONAL · DEMOSTRACIÓN</span><h2 id="lead-title">Tu guía, sin condiciones.</h2><p>Ya puedes leerla o descargarla arriba. Este formulario muestra cómo sería solicitarla por correo.</p><p><strong>Modo demostración:</strong> no se enviará ningún correo y tus datos no se guardarán. Para probarlo, utiliza datos ficticios.</p></div><form id="lead-form"><label class="field-label" for="lead-name">Nombre (opcional)</label><input class="field" id="lead-name" name="name" type="text" maxlength="80" autocomplete="off" placeholder="Tu nombre"><label class="field-label" for="lead-email">Correo electrónico</label><input class="field" id="lead-email" name="email" type="email" maxlength="254" required autocomplete="off" placeholder="nombre@ejemplo.com"><label class="consent"><input id="lead-consent" name="consent" type="checkbox" required><span>Aceptaría recibir esta guía por correo y he leído la información de privacidad.</span></label><p class="privacy-line">Este permiso es solo para la guía; no incluye mensajes promocionales. <button type="button" class="text-button" data-action="privacy">Ver privacidad</button></p><button class="button" type="submit">Probar formulario <span aria-hidden="true">→</span></button><p class="form-status" id="form-status" role="status" aria-live="polite"></p></form></section>`;}
  function openInfo(kind){
    const content=kind==='privacy'?`<h2 id="dialog-title">Tu privacidad, a tu paso.</h2><p>Este test comercial prepara el acceso a una página externa de venta. Las respuestas permanecen en la memoria de esta pestaña. No usamos cookies, almacenamiento local, píxeles de publicidad ni herramientas de seguimiento en este test.</p><p>Los botones de compra abren el enlace comercial configurado. No añadimos tus respuestas, puntuación, segmento ni contacto al enlace. La página de destino y sus intermediarios pueden tener su propia política de privacidad y sus propias herramientas de seguimiento.</p><p>El formulario no envía ni guarda el nombre, el correo ni el consentimiento. Usa datos ficticios para probarlo. Al reiniciar el test o recargar la página, se borran las respuestas en memoria.</p><p>La descarga de la guía contiene solo información educativa. No incluye tus respuestas, tu puntuación ni datos de contacto. Los enlaces del NHS abren un sitio externo con su propia política de privacidad.</p><p>Si esta página se publica, el proveedor de alojamiento puede procesar registros técnicos de acceso. Antes de activar un envío real, el responsable deberá identificar su organización, el uso y conservación de los datos, los derechos de las personas y un contacto de privacidad.</p>`:`<h2 id="dialog-title">Información que puedes consultar.</h2><p>Estas fuentes se usan para los consejos generales y las señales de alerta. No constituyen evidencia sobre la eficacia del producto anunciado ni un aval del NHS a esta oferta.</p><ul><li>${sourceLinks}</li><li><a href="https://www.england.nhs.uk/wp-content/uploads/2023/11/Decision-support-tool-making-a-decision-about-treatment-for-varicose-veins.pdf" target="_blank" rel="noopener noreferrer">Guía sobre opciones de tratamiento y sangrado · NHS England (PDF, inglés) ↗</a></li></ul><p>Revisión del contenido: 29 de octubre de 2026.</p><p>La puntuación de 0 a 12 sirve únicamente para organizar contenidos y segmentar el recorrido comercial. No es una escala clínica validada. Una puntuación baja no descarta una enfermedad.</p>`;
    document.querySelector('#dialog-content').innerHTML=content;
    dialog.showModal();
  }
  function download(){const c=D.results[state.result.segment];const content=['A TU PASO · GUÍA EDUCATIVA',c.guideTitle,'',...c.steps.flatMap(([t,b],i)=>[`${i+1}. ${t}`,b,'']),'Si tienes dolor, picor, hinchazón o empeoramiento, consulta con un profesional.','Señales de alerta: dolor en el pecho o falta de aire repentina requieren emergencias. Sangrado de una variz o hinchazón y dolor repentinos en una pierna requieren atención urgente.','','Información educativa. No diagnostica ni sustituye una valoración médica.','','Fuentes:', 'https://www.nhs.uk/conditions/varicose-veins/','https://www.nhs.uk/conditions/deep-vein-thrombosis-dvt/','https://www.nhs.uk/conditions/pulmonary-embolism/'].join('\n');const url=URL.createObjectURL(new Blob([content],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='a-tu-paso-guia.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  document.addEventListener('click',event=>{
    const el=event.target.closest('[data-action]');
    if(!el)return;
    const action=el.dataset.action;
    if(action==='start')route('quiz',0);
    if(action==='back'){if(state.view==='quiz')route(state.index?'quiz':'landing',Math.max(0,state.index-1));else history.back();}
    if(action==='safety'&&state.view!=='safety')route('safety');
    if(action==='privacy'||action==='sources')openInfo(action);
    if(action==='guide'){document.querySelector('#guide').scrollIntoView();document.querySelector('#guide-title').focus({preventScroll:true});}
    if(action==='download')download();
    if(action==='print')window.print();
    if(action==='edit')route('quiz',0);
    if(action==='restart'){state.answers={};state.safety=null;state.result=null;route('landing');}
  });
  document.querySelector('.brand').addEventListener('click',event=>{event.preventDefault();route('landing');});
  document.addEventListener('change',event=>{if(event.target.type!=='radio')return;if(state.view==='quiz')state.answers[D.questions[state.index].id]=event.target.value;if(state.view==='safety')state.safety=event.target.value;});
  document.addEventListener('submit',event=>{
    event.preventDefault();
    const form=event.target;if(!form.reportValidity())return;
    if(form.id==='lead-form'){
      document.querySelector('#form-status').textContent='Prueba completada. No se ha enviado ni guardado ningún dato. Puedes descargar tu guía sin registrarte.';
      form.reset();return;
    }
    if(form.id==='question-form'){
      const q=D.questions[state.index],answer=new FormData(form).get(q.id);
      if(!q.options.some(o=>o[0]===answer))return;
      state.answers[q.id]=answer;state.result=null;
      route(state.index===6?'safety':'quiz',state.index===6?0:state.index+1);
    }
    if(form.id==='safety-form'){
      const answer=new FormData(form).get('safety');
      if(!D.safetyOptions.some(o=>o[0]===answer))return;
      state.safety=answer;
      if(answer==='none'&&D.questions.some(q=>!state.answers[q.id])){route('quiz',D.questions.findIndex(q=>!state.answers[q.id]));return;}
      try{state.result=D.classify(state.answers,answer);route('result');}catch(error){document.querySelector('#question-error').textContent=escapeHTML(error.message);}
    }
  });
  dialog.querySelector('.close-button').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  window.addEventListener('popstate',event=>{
    const s=event.state;
    if(!s||!['landing','quiz','safety','result'].includes(s.view)||(s.view==='result'&&!state.result)){route('landing',0,true);return;}
    state.view=s.view;state.index=Math.max(0,Math.min(6,s.index||0));render();
  });
  route('landing',0,true);
})();
