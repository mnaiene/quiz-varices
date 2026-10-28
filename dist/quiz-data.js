/* Commercial pre-sell routing. Score is not a clinical scale or diagnosis. */
(function (root) {
  'use strict';
  const questions = [
    {id:'discomfort', label:'Lo que sientes', title:'¿Cómo describirías las molestias de tus piernas?', help:'Elige la opción que mejor refleja tu experiencia habitual.', options:[
      ['none','No tengo molestias',0], ['light','Son leves',1], ['medium','Son moderadas',2], ['strong','Son intensas',3]]},
    {id:'frequency', label:'Tu día a día', title:'¿Con qué frecuencia notas estas molestias?', help:'Piensa en las últimas semanas.', options:[
      ['never','Nunca o casi nunca',0], ['sometimes','Algunos días',1], ['often','La mayoría de los días',2], ['daily','Todos los días',3]]},
    {id:'duration', label:'Desde cuándo', title:'¿Desde cuándo notas molestias o venas visibles?', help:'Una estimación es suficiente.', options:[
      ['none','No las he notado',0], ['recent','Desde hace menos de 3 meses',1], ['months','Desde hace entre 3 y 12 meses',1], ['long','Desde hace más de un año',2]]},
    {id:'context', label:'Tu rutina', title:'¿En qué situación sueles notar más las molestias?', help:'Selecciona la situación más habitual.', options:[
      ['none','No suelo tener molestias',0], ['standing','Tras pasar mucho tiempo de pie',1], ['sitting','Tras pasar mucho tiempo sentado/a',1], ['end_day','Al final del día o en otras situaciones',1]]},
    {id:'impact', label:'Lo que te importa', title:'¿Cuánto afectan las molestias a tus actividades?', help:'Incluye caminar, trabajar, descansar o hacer lo que te gusta.', options:[
      ['none','No afectan a mis actividades',0], ['little','Las noto, pero sigo con mi rutina',1], ['some','A veces tengo que cambiar mis planes',2], ['high','Me limitan de forma importante',3]]},
    {id:'previous_actions', label:'Tu experiencia', title:'¿Qué has hecho hasta ahora para cuidar tus piernas?', help:'Elige la opción que mejor describe tu experiencia. No cambia la puntuación.', options:[
      ['not_started','Todavía no he tomado medidas',0], ['self_care','He probado cambios de hábitos',0], ['products','He probado productos o medias',0], ['consulted_professional','He consultado con un profesional',0]]},
    {id:'main_goal', label:'Tu siguiente paso', title:'¿Qué te gustaría revisar antes de decidir tu compra?', help:'Elige tu prioridad para el siguiente paso. No cambia la puntuación.', options:[
      ['habits','Cómo encajaría en mi rutina',0], ['appearance','La información sobre venas visibles',0], ['care_options','La presentación y las condiciones de la oferta',0], ['consultation','Qué consultar con un profesional antes de usarlo',0]]}
  ];
  const safetyOptions = [
    ['chest','Dolor en el pecho o dificultad repentina para respirar'],
    ['bleeding','Sangrado de una vena varicosa'],
    ['swelling','Hinchazón repentina y dolor en una sola pierna'],
    ['none','Ninguno de los anteriores']
  ];
  function scoreAnswers(answers) {
    let score=0;
    for (const q of questions) {
      const option=q.options.find(o=>o[0]===answers[q.id]);
      if (!option) throw new Error('Completa todas las preguntas antes de ver el resultado.');
      score+=option[2];
    }
    return score;
  }
  function classify(answers, safety) {
    if (!safetyOptions.some(o=>o[0]===safety)) throw new Error('Selecciona una respuesta en la comprobación de seguridad.');
    if(safety!=='none') return {segment:'D',score:null,alert:safety};
    const score=scoreAnswers(answers);
    return {segment:score<=3?'A':score<=9?'B':'C',score,alert:null};
  }
  const results={
    A:{label:'Tu prioridad: cuidado cotidiano',title:'Conoce Veniselle y da tu siguiente paso.',intro:'Has indicado pocas molestias o interés por el cuidado de tus piernas. Continúa a la página de Veniselle para conocer la crema y decidir si quieres hacer tu pedido.',cta:'Ver Veniselle y hacer mi pedido',guideTitle:'Información adicional: cinco hábitos para el día a día',steps:[
      ['Muévete con regularidad','Caminar puede formar parte de una rutina de cuidado adaptada a tus posibilidades.'],
      ['Cambia de postura','Evita pasar largos periodos sentado/a o de pie sin moverte.'],
      ['Descansa con las piernas elevadas','Cuando te resulte cómodo, apoya las piernas al descansar.'],
      ['Cuida la piel','Si está seca, una crema hidratante puede ayudar a cuidarla.'],
      ['Presta atención a los cambios','Si aparecen dolor, picor, hinchazón o empeoramiento, consulta con un profesional.']
    ]},
    B:{label:'Tu prioridad: comparar opciones',title:'Ya conoces tu prioridad. Ahora conoce Veniselle.',intro:'Has señalado molestias recurrentes. Puedes conocer Veniselle y revisar la información de la crema antes de decidir tu compra. Si tienes dolor, picor o hinchazón, solicita también una valoración profesional.',cta:'Ver la oferta de Veniselle',guideTitle:'Información adicional: opciones para conversar en consulta',steps:[
      ['Movimiento y descanso','Pregunta qué actividad y cambios de postura son adecuados para ti.'],
      ['Medias de compresión','Pregunta si son apropiadas para tu caso y cómo elegir la talla y la compresión.'],
      ['Valoración individual','Comenta los síntomas, desde cuándo aparecen y qué actividades afectan.'],
      ['Otras opciones','Un profesional puede explicarte si hacen falta pruebas o tratamientos según tu situación.']
    ]},
    C:{label:'Tu prioridad: decidir con información',title:'Revisa Veniselle con tus necesidades en mente.',intro:'Has indicado molestias que afectan a tu rutina. Solicita una valoración profesional antes de iniciar un producto para esos síntomas. También puedes consultar la página de Veniselle; este resultado no confirma que la crema sea adecuada para ti.',cta:'Conocer Veniselle y revisar el pedido',guideTitle:'Información adicional: prepara tus preguntas para una consulta',steps:[
      ['Describe lo que notas','Anota cuándo aparecen las molestias, desde cuándo y si afectan a una pierna o a ambas.'],
      ['Explica el impacto','Cuenta qué actividades o momentos de descanso se ven afectados.'],
      ['Lleva tus antecedentes','Prepara una lista de medicamentos, tratamientos y medidas que ya has probado.'],
      ['Pregunta por el siguiente paso','¿Necesito alguna prueba? ¿Qué opciones son adecuadas para mí? ¿Cuándo debo volver?']
    ]}
  };
  const alerts={
    chest:{label:'Atención inmediata',title:'Busca atención de emergencia ahora.',intro:'El dolor en el pecho o la dificultad repentina para respirar requieren atención inmediata. Contacta con los servicios de emergencia de tu país. No conduzcas tú mismo/a.',steps:[['Contacta con emergencias','No esperes a completar este test ni a recibir un mensaje.'],['Pide ayuda cercana','Si puedes, pide a alguien que se quede contigo mientras llega la ayuda.']]},
    bleeding:{label:'Atención urgente',title:'El sangrado necesita atención urgente.',intro:'Busca atención médica urgente por el sangrado de una vena varicosa. Si es abundante, no se detiene o te encuentras mal, contacta con los servicios de emergencia.',steps:[['Mientras buscas ayuda','Túmbate, eleva la pierna si puedes y aplica presión firme sobre el punto de sangrado con un paño limpio.'],['Aunque el sangrado se detenga','Solicita una valoración médica urgente.']]},
    swelling:{label:'Atención urgente',title:'Busca una valoración médica sin demora.',intro:'La hinchazón repentina y el dolor en una sola pierna necesitan una evaluación urgente. No esperes a recibir una guía ni una respuesta comercial.',steps:[['Busca atención urgente','Contacta con un servicio sanitario que pueda evaluarte sin demora.'],['Si también hay dolor en el pecho o falta de aire','Contacta con los servicios de emergencia de tu país inmediatamente.']]}
  };
  const purchaseUrl='https://uh21eb1372uh.axdsz.pro/?target=-7EBNQCgQAAAflWwUDyoMABQEBEREKEQkKEQ1CEQ0SAAF_YWRjb21ibwEx';
  root.QuizData={questions,safetyOptions,scoreAnswers,classify,results,alerts,purchaseUrl};
})(typeof window==='undefined'?globalThis:window);
