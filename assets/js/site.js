/* Pro Motion Sport Marketing — interacciones del sitio */
(function () {
  'use strict';
  var WA = '593984678812';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  function waLink(t) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(t); }
  window.PM = { waLink: waLink };
  function abrirWA(t) { window.open(waLink(t), '_blank', 'noopener'); }

  /* ---------- Diagnosticador: resumen gratis + diagnóstico completo a cambio del contacto ---------- */
  function dxEsc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function dxResp(form) {
    var o = {}; new FormData(form).forEach(function (val, k) { val = String(val).trim(); if (!val || k.indexOf('_gx_') === 0) return; o[k] = o[k] ? o[k] + ' | ' + val : val; });
    return o;
  }
  function dxPost(d) {
    return fetch('/api/dx/guardar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) })
      .then(function (r) { return r.ok ? r.json() : {}; }).catch(function () { return {}; });
  }
  /* Lectura a fondo: lo que se lee al cruzar respuestas, el plan paso a paso y el porqué del siguiente paso. */
  var DX_AUD = ['Primer paso: Auditoría ProMatch', 'El paso mínimo antes de invertir en algo más grande: revisamos tu contenido y tu información real y te entregamos un informe con evidencia, tus primeras propuestas de valor y los sectores compatibles.', 'USD 60 + IVA (primeros 10 proyectos)'];
  var DX_AUD_FIN = ' Recibes tu <b>Commercial Readiness Score</b> (8 categorías), el <b>Evidence Confidence Score</b>, el nivel de <b>integración de marcas</b> del 0 al 5, las <b>13 capacidades comerciales</b> y los <b>sectores compatibles</b>, porque no todas las marcas tienen sentido para tu proyecto.';
  var DX_AUD_INI = 'Las dudas del empresario que viste arriba son las preguntas que se hace una marca antes de decidir. Si sientes que necesitas ayuda para responderlas, te recomendamos empezar por la <b>Auditoría ProMatch</b>, antes de invertir cientos de dólares en una propuesta, en servicios mensuales o en producción de foto y video sin saber todavía para qué te van a servir. Ahí revisamos tu contenido real e identificamos tus primeras propuestas de valor: ';
  var DX_AUD_P = DX_AUD_INI + 'no solo según lo que busca hoy una marca auspiciante, sino según lo que tú puedes ofrecer desde tu personalidad, tu estilo y tu frecuencia de comunicación, tu disciplina y el tipo de deportista que eres, incluidas las capacidades que tienes y que hoy no se ven.' + DX_AUD_FIN;
  var DX_AUD_PG = DX_AUD_INI + 'no solo según lo que busca hoy una marca auspiciante, sino según lo que el proyecto puede ofrecer desde su historia, su comunidad, su forma de comunicar y lo que ya hace bien y hoy no se ve.' + DX_AUD_FIN;
  function dxLee(le) { return le.length ? '<div class="dx-lee"><span class="lbl">Lo que leemos en tus respuestas</span><ul class="dx-l">' + le.map(function (x) { return '<li><b>' + x[0] + '.</b> ' + x[1] + '</li>'; }).join('') + '</ul></div>' : ''; }
  function dxPlan(pl) { return pl.length ? '<div class="dx-plan"><span class="lbl">Tu plan, paso a paso</span><p class="dx-plan-n">Cada prioridad con su porqué, tres pasos que puedes dar por tu cuenta y la señal de que ya está hecha.</p>' + pl.map(function (x, i) { return '<div class="dx-plan-i"><b class="dx-plan-num">' + (i + 1) + '</b><div><h5>' + x[0] + '</h5><p>' + x[1] + '</p><ol><li>' + x.slice(2, 5).join('</li><li>') + '</li></ol><p class="dx-plan-ok"><b>Listo cuando:</b> ' + x[5] + '</p></div></div>'; }).join('') + '</div>' : ''; }
  function dxSig(parr, of, aud) {
    var cards = of.map(function (o) { return '<a class="dx-of-c" href="' + o[3] + '"><span class="lbl">' + (aud ? 'Después, si hace falta' : 'Sugerido') + '</span><b>' + o[0] + '</b><p>' + o[1] + '</p><em>' + o[2] + '</em></a>'; }).join('');
    return '<span class="lbl dx-of-t">Tu siguiente paso, y por qué</span><div class="dx-sig">' + parr.map(function (t) { return '<p>' + t + '</p>'; }).join('') + '</div>' +
      '<div class="dx-of">' + (aud ? '<a class="dx-of-c prin uno" href="../promatch/#como-funciona"><span class="lbl">Primer paso</span><b>Auditoría ProMatch</b><p>' + DX_AUD[1] + '</p><em>' + DX_AUD[2] + '</em></a>' : '') + cards + '</div>' +
      '<p class="dg-nota">Valores referenciales: cada proyecto cambia según sus necesidades y se cotiza a medida. Con el plan de arriba también puedes avanzar por tu cuenta.</p>';
  }
  var DX_BOAR = ['boar_crossed', 'boar_confused', 'boar_magnify'];
  function dxVoz(ni, fr) { return fr.length ? '<div class="dx-voz"><img src="../assets/img/' + DX_BOAR[ni] + '.webp" alt="Jabalí empresario, la marca"><div class="dx-voz-b"><span class="lbl">Así te vería hoy una marca</span>' + fr.map(function (t) { return '<p>' + t + '</p>'; }).join('') + '<small>Es una lectura simulada a partir de tus respuestas, no la opinión de una marca real.</small></div></div>' : ''; }
  var DX_INC = 'Este diagnóstico no toma en cuenta si tu proyecto está aprobado por el Ministerio del Deporte para usar el incentivo tributario. Tenerlo aprobado aumenta las probabilidades de conectar con auspiciantes interesados en deducir impuestos, pero es una oportunidad financiera, no lo que te diferencia: no garantiza que elijan tu proyecto ni que la relación dure. Si una marca tiene delante tres o cuatro proyectos y todos tienen el incentivo, ¿por qué escogería el tuyo? Eso es lo que mide este diagnóstico.';
  function dxInc() { return '<div class="dx-inc"><span class="lbl">¿Y el incentivo tributario?</span><p>' + DX_INC + '</p><p><b>El incentivo acelera una decisión. No la reemplaza.</b></p></div>'; }
  function dxBrecha(D, nom) { var k = Object.keys(D).sort(function (x, y) { return D[y] - D[x]; }), a = k[0], b = k[k.length - 1], n = D[a] - D[b], N = function (x) { return (nom ? nom[x] : x).toLowerCase(); };
    return ['Tu punto más fuerte es ' + N(a) + ' (' + D[a] + ') y el más débil, ' + N(b) + ' (' + D[b] + ')', n >= 30 ? 'Hay ' + n + ' puntos de distancia entre ambos. Conviene apoyarte en lo primero para resolver lo segundo: es más rápido que empezar de cero.' : 'Solo hay ' + n + ' puntos entre ambos: el proyecto está parejo, así que avanzar depende de subir todo un escalón y no de arreglar un solo frente.']; }
  function dxSinHtml(t) { return String(t).replace(/<[^>]*>/g, ''); }
  function dxGate(res, d) {
    var box = res.querySelector('.dg-res'); if (!box) return;
    var base = { perfil: d.perfil, total: d.total, nivel: d.nivel, dims: d.dims };
    var idP = dxPost(base).then(function (x) { return x.id || ''; });
    function conContacto(c) {
      return idP.then(function (id) {
        var m = { id: id, nombre: c.nombre, canal: c.canal, contacto: c.contacto, acepta: true, proyecto: d.proyecto, ciudad: d.ciudad, respuestas: d.respuestas, resumen: d.resumen, detalle: d.detalle };
        for (var k in base) m[k] = base[k];
        return dxPost(m);
      });
    }
    var prev = null; try { prev = JSON.parse(localStorage.getItem('pm_dx_c') || 'null'); } catch (e) {}
    if (prev && prev.contacto) { conContacto(prev); return; }
    box.classList.add('dx-cerrado');
    var g = document.createElement('div'); g.className = 'dx-gate';
    g.innerHTML = '<span class="lbl">Hay más</span>' +
      '<h4>Mira tu diagnóstico completo</h4>' +
      '<p>Ya viste tu puntaje, tus ventajas y tu prioridad número uno. En el diagnóstico completo analizamos además tus <b>oportunidades, tus riesgos, lo que leemos al cruzar tus respuestas, el plan paso a paso de cada prioridad y cuál es tu siguiente paso, con su porqué</b>. Dinos si prefieres correo o WhatsApp y lo ves aquí mismo, al instante.</p>' +
      '<div class="dx-gate-f">' +
        '<label>Tu nombre<input type="text" name="_gx_nombre" maxlength="80" autocomplete="name" placeholder="Ej.: Ana Pérez"></label>' +
        '<div class="dx-gate-canal" role="radiogroup" aria-label="¿Por dónde te escribimos?">' +
          '<button type="button" role="radio" aria-checked="true" data-c="correo">Por correo</button>' +
          '<button type="button" role="radio" aria-checked="false" data-c="whatsapp">Por WhatsApp</button></div>' +
        '<label><span data-gx-l>Tu correo</span><input type="email" name="_gx_contacto" maxlength="120" autocomplete="email" inputmode="email" placeholder="tucorreo@ejemplo.com"></label>' +
        '<label class="dx-gate-ok"><input type="checkbox" name="_gx_ok"><span>Acepto que Pro Motion me escriba por este medio con mi diagnóstico y sugerencias para profundizarlo. <a href="/privacidad/" target="_blank" rel="noopener">Política de privacidad</a>.</span></label>' +
        '<button type="button" class="btn rojo lg" data-gx-ir>Ver mi diagnóstico completo <span class="chev">»</span></button>' +
        '<p class="dx-gate-av" aria-live="polite"></p>' +
      '</div>';
    var ancla = box.querySelector('.dg-dims'); ancla.parentNode.insertBefore(g, ancla.nextSibling);
    // Adelanto gratis: las ventajas y la prioridad número uno se ven antes de pedir el contacto.
    var gratis = document.createElement('div'); gratis.className = 'dx-cuad dx-gratis';
    var vOk = box.querySelector('.dx-cuad .dx-ok'), cP = box.querySelector('.dx-cuad .dx-c:last-child'), p1 = cP && (cP.querySelector('ol li') || cP.querySelector('p'));
    if (vOk) gratis.appendChild(vOk.cloneNode(true));
    if (p1) { var c1 = document.createElement('div'); c1.className = 'dx-c dx-uno'; c1.innerHTML = '<span class="lbl">Tu prioridad número uno</span><p>' + p1.innerHTML + '</p>'; gratis.appendChild(c1); }
    if (gratis.children.length) g.parentNode.insertBefore(gratis, g);
    var canal = 'correo', inC = g.querySelector('[name=_gx_contacto]'), inN = g.querySelector('[name=_gx_nombre]'), av = g.querySelector('.dx-gate-av');
    if (d.nombreSug) inN.value = d.nombreSug;
    $$('.dx-gate-canal button', g).forEach(function (b) { b.addEventListener('click', function () {
      canal = b.dataset.c;
      $$('.dx-gate-canal button', g).forEach(function (x) { x.setAttribute('aria-checked', x === b); });
      var w = canal === 'whatsapp';
      g.querySelector('[data-gx-l]').textContent = w ? 'Tu WhatsApp' : 'Tu correo';
      inC.type = w ? 'tel' : 'email'; inC.setAttribute('inputmode', w ? 'tel' : 'email'); inC.autocomplete = w ? 'tel' : 'email';
      inC.placeholder = w ? 'Ej.: 099 123 4567' : 'tucorreo@ejemplo.com'; inC.value = ''; av.textContent = '';
    }); });
    g.addEventListener('keydown', function (e) { if (e.key === 'Enter' && e.target.tagName === 'INPUT') { e.preventDefault(); g.querySelector('[data-gx-ir]').click(); } });
    g.querySelector('[data-gx-ir]').addEventListener('click', function () {
      var nombre = inN.value.trim(), cont = inC.value.trim();
      if (!nombre) { av.textContent = 'Escribe tu nombre.'; inN.focus(); return; }
      if (canal === 'correo' ? !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cont) : cont.replace(/\D/g, '').length < 8) { av.textContent = canal === 'correo' ? 'Revisa tu correo: parece incompleto.' : 'Revisa tu número de WhatsApp.'; inC.focus(); return; }
      if (!g.querySelector('[name=_gx_ok]').checked) { av.textContent = 'Marca la casilla para poder escribirte.'; return; }
      var c = { nombre: nombre, canal: canal, contacto: cont };
      try { localStorage.setItem('pm_dx_c', JSON.stringify(c)); } catch (e) {}
      if (canal === 'whatsapp') abrirWA('Hola Daniel, soy ' + nombre + '. Hice el diagnóstico de Pro Motion como ' + d.quien + ' y obtuve ' + d.total + '/100 (' + d.nivel + '). Quiero recibir por aquí las sugerencias para profundizarlo.');
      var envio = conContacto(c);
      box.classList.remove('dx-cerrado');
      var ok = document.createElement('p'); ok.className = 'dx-gate-listo';
      ok.innerHTML = '<b>Listo, ' + dxEsc(nombre.split(' ')[0]) + '.</b> Aquí tienes tu diagnóstico completo. ' + (canal === 'whatsapp' ? 'Envíanos el mensaje que se abrió en WhatsApp y seguimos por ahí.' : 'Te escribiremos a ' + dxEsc(cont) + ' con sugerencias para profundizarlo.');
      g.parentNode.replaceChild(ok, g); if (gratis.parentNode) gratis.parentNode.removeChild(gratis);
      ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (canal === 'correo') envio.then(function (x) { if (x && x.correo) ok.innerHTML = '<b>Listo, ' + dxEsc(nombre.split(' ')[0]) + '.</b> Aquí tienes tu diagnóstico completo. También te lo enviamos a ' + dxEsc(cont) + ' (si no lo ves, revisa la carpeta de spam).'; });
    });
  }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---------- WhatsApp ---------- */
  $$('[data-wa]').forEach(function (a) {
    a.href = waLink(a.getAttribute('data-wa') || 'Hola Daniel, vi la web de Pro Motion y quiero más información.');
    a.target = '_blank'; a.rel = 'noopener';
  });

  /* ---------- Menú móvil ---------- */
  var burger = $('.burger');
  if (burger) burger.addEventListener('click', function () {
    var on = document.body.classList.toggle('menu-abierto');
    burger.setAttribute('aria-expanded', on);
  });
  $$('.menu-movil a').forEach(function (a) { a.addEventListener('click', function () { document.body.classList.remove('menu-abierto'); }); });

  /* ---------- Revelado ---------- */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' }) : null;
  $$('.rv,.pop,.cae,.tacha,[data-in]').forEach(function (el) { io ? io.observe(el) : el.classList.add('in'); });
  // respaldo: lo que ya está en pantalla se muestra sin esperar al observador
  var pendientes = $$('.rv,.pop,.cae,.tacha,[data-in]');
  function revelarVisibles() {
    var alto = innerHeight * 0.95;
    pendientes = pendientes.filter(function (el) {
      if (el.classList.contains('in')) return false;
      var r = el.getBoundingClientRect();
      if (r.top < alto && r.bottom > 0) { el.classList.add('in'); return false; }
      return true;
    });
  }
  revelarVisibles(); requestAnimationFrame(revelarVisibles);
  var rt = false; addEventListener('scroll', function () { if (rt) return; rt = true; setTimeout(function () { revelarVisibles(); rt = false; }, 120); }, { passive: true });

  /* ---------- Titulares: ninguna palabra se parte ----------
     GC Epic es muy ancha: si la palabra más larga no cabe en su columna,
     el titular baja de tamaño lo justo para que entre completa. */
  function ajustarTitulos() {
    $$('h1,h2,h3,.epic,.stat .n').forEach(function (h) {
      h.style.fontSize = '';
      var ancho = h.clientWidth; if (!ancho) return;
      var mayor = 0, tw = document.createTreeWalker(h, NodeFilter.SHOW_TEXT), n;
      while ((n = tw.nextNode())) {
        var re = /\S+/g, m;
        while ((m = re.exec(n.data))) {
          var rg = document.createRange(); rg.setStart(n, m.index); rg.setEnd(n, m.index + m[0].length);
          var rs = rg.getClientRects(), w = 0; for (var i = 0; i < rs.length; i++) w += rs[i].width;
          if (w > mayor) mayor = w;
        }
      }
      // grupos que deben quedar en una sola línea (.nw)
      h.querySelectorAll('.nw').forEach(function (g) { var w = g.getBoundingClientRect().width; if (w > mayor) mayor = w; });
      if (mayor > ancho) {
        var fs = parseFloat(getComputedStyle(h).fontSize);
        h.style.fontSize = Math.max(16, Math.floor(fs * (ancho / mayor) * 0.97)) + 'px';
      }
    });
  }
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(ajustarTitulos);
  var at; addEventListener('resize', function () { clearTimeout(at); at = setTimeout(ajustarTitulos, 150); });

  /* ---------- Botón flotante ---------- */
  var flot = $('.wa-flot');
  function onScroll() { if (flot) flot.classList.toggle('on', scrollY > innerHeight * 0.8); }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- Cursor punto ---------- */
  if (matchMedia('(hover:hover) and (pointer:fine)').matches && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
    var cur = document.createElement('div'); cur.className = 'cursor'; document.body.appendChild(cur);
    var tx = 0, ty = 0, cx = 0, cy = 0;
    addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; cur.classList.add('on'); });
    document.addEventListener('mouseleave', function () { cur.classList.remove('on'); });
    document.addEventListener('mouseover', function (e) { cur.classList.toggle('grande', !!e.target.closest('a,button,.pt,.peldano,.chk,select,input,textarea,.vc-item')); });
    (function loop() { cx += (tx - cx) * 0.22; cy += (ty - cy) * 0.22; cur.style.transform = 'translate(' + cx + 'px,' + cy + 'px)'; requestAnimationFrame(loop); })();
  }

  /* ---------- Carrusel de videos (portada) ---------- */
  var vc = $('.vc');
  if (vc) (function () {
    var items = $$('.vc-item', vc), n = items.length, act = 0, timer = null, visible = false;
    var tit = $('.vc-tit'), sub = $('.vc-sub'), num = $('.vc-num'), barra = $('.vc-barra i');
    // Si el teléfono bloquea la reproducción automática (p. ej. modo de bajo consumo), mostrar un botón de play
    function intentar(it, v) {
      var p = v.play();
      if (p && p.then) p.then(function () { it.classList.remove('bloq'); }).catch(function () { it.classList.add('bloq'); });
    }
    items.forEach(function (it) { if ($('video', it)) { var b = document.createElement('span'); b.className = 'vc-play'; b.setAttribute('aria-hidden', 'true'); it.appendChild(b); } });
    function pos(i) { var d = (i - act + n) % n; if (d > n / 2) d -= n; return d; }
    function pintar() {
      items.forEach(function (it, i) {
        var d = pos(i), v = $('video', it), ad = Math.abs(d);
        it.dataset.d = d;
        it.style.setProperty('--d', d); it.style.setProperty('--ad', ad);
        it.style.zIndex = 20 - ad;
        it.style.opacity = ad > 2 ? 0 : 1;
        it.setAttribute('aria-hidden', d !== 0);
        if (ad <= 1 && v && !v.src) v.src = v.dataset.src;
        if (d === 0 && v) { if (visible) { v.currentTime = 0; intentar(it, v); } }
        else if (v) v.pause();
      });
      var it = items[act];
      if (tit) { tit.textContent = it.dataset.tit; }
      if (sub) { sub.textContent = it.dataset.sub; }
      if (num) { contar(num, +it.dataset.vistas); }
      $$('.vc-dots button').forEach(function (b, i) { b.classList.toggle('on', i === act); });
      $$('.vc-pilares button').forEach(function (b) { b.classList.toggle('on', b.dataset.pilar === it.dataset.pilar); });
      reiniciarBarra();
    }
    function contar(el, fin) {
      var t0 = null; cancelAnimationFrame(el._r);
      (function paso(ts) { if (!t0) t0 = ts; var k = Math.min(1, (ts - t0) / 900); el.textContent = Math.round(fin * (1 - Math.pow(1 - k, 3))).toLocaleString('es-EC'); if (k < 1) el._r = requestAnimationFrame(paso); })(performance.now());
    }
    function reiniciarBarra() { if (!barra) return; barra.style.transition = 'none'; barra.style.width = '0'; void barra.offsetWidth; }
    function ir(i) { act = (i + n) % n; pintar(); }
    items.forEach(function (it, i) {
      var v = $('video', it);
      it.addEventListener('click', function (e) { if (e.target.closest('a')) return; if (i !== act) { ir(i); return; } if (v && v.paused) { if (!v.src) v.src = v.dataset.src; intentar(it, v); return; } if (it.dataset.ig) window.open(it.dataset.ig, '_blank', 'noopener'); });
      if (v) {
        v.addEventListener('timeupdate', function () { if (i === act && barra && v.duration) { barra.style.transition = 'width .25s linear'; barra.style.width = (v.currentTime / v.duration * 100) + '%'; } });
        v.addEventListener('ended', function () { if (i === act) ir(act + 1); });
      }
    });
    $('.vc-prev') && $('.vc-prev').addEventListener('click', function () { ir(act - 1); });
    $('.vc-next') && $('.vc-next').addEventListener('click', function () { ir(act + 1); });
    $$('.vc-pilares button').forEach(function (b) { b.addEventListener('click', function () { var k = items.findIndex(function (x) { return x.dataset.pilar === b.dataset.pilar; }); if (k >= 0) ir(k); }); });
    var dots = $('.vc-dots');
    if (dots) items.forEach(function (_, i) { var b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Video ' + (i + 1)); b.addEventListener('click', function () { ir(i); }); dots.appendChild(b); });
    // deslizar en móvil
    var x0 = null;
    vc.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    vc.addEventListener('touchend', function (e) { if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) ir(act + (dx < 0 ? 1 : -1)); x0 = null; });
    // reproducir solo cuando se ve
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) {
      visible = es[0].isIntersecting;
      var v = $('video', items[act]); if (!v) return;
      if (visible) { if (!v.src) v.src = v.dataset.src; intentar(items[act], v); } else v.pause();
    }, { threshold: 0.35 }).observe(vc);
    // respaldo: si un video no puede reproducirse, avanzar cada 7 s
    timer = setInterval(function () { var it = items[act], v = $('video', it); if (it.classList.contains('bloq')) return; if (visible && (!v || v.paused && v.readyState < 2)) ir(act + 1); }, 7000);
    pintar();
  })();

  /* ---------- Videos sueltos: tocar para reproducir si el teléfono bloqueó el autoplay ---------- */
  document.addEventListener('click', function (e) {
    var v = e.target.closest && e.target.closest('video');
    if (!v || v.closest('.vc-item')) return;
    if (v.paused) { if (!v.src && v.dataset.src) v.src = v.dataset.src; v.play().catch(function () {}); }
  });

  /* ---------- Problema: burbujas sobre los puntos (toque en móvil) ---------- */
  var grid = $('.puntos-grid');
  if (grid) $$('.pt', grid).forEach(function (p) {
    p.addEventListener('click', function () {
      $$('.pt', grid).forEach(function (x) { if (x !== p && !x.classList.contains('tu')) x.classList.remove('on'); });
      if (!p.classList.contains('tu')) p.classList.toggle('on');
    });
  });

  /* ---------- Otras estrategias: leer más ---------- */
  $$('.estr-mas').forEach(function (b) {
    b.addEventListener('click', function () {
      var a = b.closest('.estr-it'), on = a.classList.toggle('abierto');
      b.setAttribute('aria-expanded', on); b.textContent = on ? 'Leer menos' : 'Leer más';
    });
  });

  /* ---------- Versus: la bolita rebota de frase en frase ---------- */
  var vt = $('.versus-tabla'), bola = vt && $('.vs-bola', vt), rata = vt && $('.vs-rata', vt);
  if (bola && bola.animate && !matchMedia('(prefers-reduced-motion: reduce)').matches) (function () {
    var corriendo = false, visible = false;
    function puntos() {
      var base = vt.getBoundingClientRect();
      return $$('.vs-fila', vt).map(function (f) {
        var pm = $('.pm', f), tx = pm.lastChild, r = document.createRange(); r.selectNodeContents(tx);
        var b = r.getBoundingClientRect();
        return { f: f, x: b.right - base.left - 18, y: b.top - base.top - 15 };
      });
    }
    function ciclo() {
      if (!visible) { corriendo = false; return; }
      corriendo = true;
      var p = puntos(), k = [], t = 0, T = 0, seg = 620, n = p.length;
      T = seg * (n + 1);
      function at(ms, x, y, o, sc) { k.push({ offset: ms / T, transform: 'translate(' + x + 'px,' + y + 'px) scale(' + (sc || '1,1') + ')', opacity: o }); }
      at(0, p[0].x - 70, p[0].y - 90, 0);
      for (var i = 0; i < n; i++) {
        var a = i ? p[i - 1] : { x: p[0].x - 70, y: p[0].y - 90 }, c = p[i];
        var mx = (a.x + c.x) / 2, my = Math.min(a.y, c.y) - 46;
        at(t + seg * .5, mx, my, 1); t += seg;
        at(t - 40, c.x, c.y - 4, 1, '0.92,1.1'); at(t, c.x, c.y + 3, 1, '1.3,0.7');
        (function (f, ms) { setTimeout(function () { f.classList.add('tocada'); setTimeout(function () { f.classList.remove('tocada'); }, 900); }, ms); })(c.f, t);
      }
      var u = p[n - 1]; at(t + seg * .5, u.x + 60, u.y - 30, 1); at(T, u.x + 120, u.y + 40, 0);
      var an = bola.animate(k, { duration: T, easing: 'linear' });
      an.onfinish = function () { setTimeout(ciclo, 1400); };
    }
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible && !corriendo) ciclo(); }, { threshold: 0.3 }).observe(vt);
  })();

  /* ---------- Servicios: calculadora de beneficios por plan ---------- */
  var icp = $('#ic-pz');
  if (icp) (function () {
    var icm = $('#ic-ms');
    function f(n) { return Math.round(n).toLocaleString('es-EC'); }
    function pintar() {
      var p = +icp.value, m = +icm.value, n = p * m;
      $('#ic-p').textContent = p; $('#ic-m').textContent = m + (m === 1 ? ' mes' : ' meses');
      $('#ic-v').textContent = f(n * 6500 / 1000) + ' mil'; $('#ic-a').textContent = f(n * 2900 / 1000) + ' mil';
      $('#ic-i').textContent = f(n * 235); $('#ic-s').textContent = Math.min(Math.round(m * 4.33), Math.round(n)) + ' de ' + Math.round(m * 4.33);
    }
    icp.addEventListener('input', pintar); icm.addEventListener('input', pintar); pintar();
  })();

  /* ---------- Servicios: protagonista intercambiable ---------- */
  var pe = $('.perfil-ej');
  if (pe) $$('.pe-mini a', pe).forEach(function (m) {
    m.addEventListener('click', function (e) {
      e.preventDefault();
      var main = $('.pe-main', pe), mi = $('img', main), si = $('img', m);
      var t = [mi.src, mi.alt, main.href, main.dataset.nombre, main.dataset.score];
      mi.src = si.src; mi.alt = si.alt; main.href = m.href; main.dataset.nombre = m.dataset.nombre; main.dataset.score = m.dataset.score;
      si.src = t[0]; si.alt = t[1]; m.href = t[2]; m.dataset.nombre = t[3]; m.dataset.score = t[4];
      var b = $('.pe-score b', main); if (b) b.textContent = main.dataset.score;
      var tag = $('.pe-tag', main); if (tag) tag.textContent = 'Ejemplo real · ' + main.dataset.nombre;
      $('span', m).textContent = m.dataset.nombre.split(' ')[0] + ' · ' + m.dataset.score;
      pe.classList.remove('cambia'); void pe.offsetWidth; pe.classList.add('cambia');
    });
  });
  /* ---------- Servicios: KPIs animados ---------- */
  $$('.kpi-vis').forEach(function (k) { if ('IntersectionObserver' in window) new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { k.classList.add('ve'); o.disconnect(); } }).observe(k); else k.classList.add('ve'); });
  $$('[data-kpi]').forEach(function (b) {
    var fin = +b.dataset.kpi, hecho = false;
    function go() { if (hecho) return; hecho = true; var t0 = null; (function paso(ts) { if (!t0) t0 = ts; var k = Math.min(1, (ts - t0) / 1200); b.textContent = Math.round(fin * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(paso); })(performance.now()); }
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { go(); o.disconnect(); } }).observe(b); else go();
  });

  /* ---------- Tarjetas de foto: leer más ---------- */
  $$('.foto-card .fc-btn').forEach(function (b) { b.addEventListener('click', function () {
    var c = b.closest('.foto-card'), on = c.classList.toggle('abierto'); b.textContent = on ? 'Leer menos' : 'Leer más';
  }); });
  /* ---------- Conócenos: el puente sigue al cursor ---------- */
  var pu = $('[data-puente]');
  if (pu) [['.lado-dep', 'h-izq'], ['.medio', 'h-med'], ['.lado-emp', 'h-der']].forEach(function (p) {
    var el = $(p[0], pu); if (!el) return;
    el.addEventListener('mouseenter', function () { pu.classList.remove('h-izq', 'h-med', 'h-der'); pu.classList.add(p[1]); });
  });
  if (pu) pu.addEventListener('mouseleave', function () { pu.classList.remove('h-izq', 'h-med', 'h-der'); });

  /* ---------- Artículo: interacciones ---------- */
  var blog = $('.blog');
  if (blog) (function () {
    var cb = $('[data-cambio]');
    if (cb) $$('.cambio-tabs button', cb).forEach(function (b) { b.addEventListener('click', function () {
      $$('.cambio-tabs button', cb).forEach(function (x) { x.classList.toggle('on', x === b); });
      $$('.cambio-panel', cb).forEach(function (p) { p.hidden = p.dataset.p !== b.dataset.v; });
    }); });
    var qs = $$('.q-chip'), qr = $('.quiere-res');
    qs.forEach(function (b) { b.addEventListener('click', function () {
      b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true');
      var n = qs.filter(function (x) { return x.getAttribute('aria-pressed') === 'true'; }).length;
      qr.textContent = n === 0 ? 'Todavía no has elegido ninguno. Así se ve una propuesta que solo informa.'
        : n < 3 ? n + ' objetivo' + (n > 1 ? 's' : '') + ': ya empiezas a hablar el idioma de la marca. ¿Puedes demostrarlo con datos?'
        : n + ' objetivos: esto ya no es un pedido, es una propuesta. Ahora conviértelo en entregables medibles.';
    }); });
    var pn = $('[data-pn]');
    if (pn) $$('.pn-switch button', pn).forEach(function (b) { b.addEventListener('click', function () {
      $$('.pn-switch button', pn).forEach(function (x) { x.classList.toggle('on', x === b); });
      $('.pn-switch', pn).classList.toggle('neg', b.dataset.m === 'negociar');
      $$('.pn-lado', pn).forEach(function (l) { l.hidden = l.dataset.m !== b.dataset.m; });
    }); });
    var qd = $('[data-queda]');
    if (qd) (function () {
      var cks = $$('input', qd), barra = $('.queda-barra i', qd), tx = $('.queda-tx', qd);
      function pintar() {
        var n = cks.filter(function (c) { return c.checked; }).length;
        barra.style.width = (n / cks.length * 100) + '%';
        var m = n <= 3 ? 'Sin incentivo, hoy tu propuesta se sostiene sobre muy poco.' : n <= 7 ? 'Tienes base. Falta ordenarla y demostrarla con evidencias.' : 'Tienes valor propio. El incentivo sería un acelerador, no tu único argumento.';
        tx.innerHTML = '<b>' + n + ' de ' + cks.length + '</b><span>' + m + '</span>';
      }
      cks.forEach(function (c) { c.addEventListener('change', pintar); });
    })();
    var links = $$('.blog-indice a'), barraL = $('.blog-progreso i'), secs = links.map(function (a) { return $(a.getAttribute('href')); });
    function onScroll() {
      var tx = $('.blog'), r = tx.getBoundingClientRect(), p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
      if (barraL) barraL.style.width = (p * 100) + '%';
      var k = -1; secs.forEach(function (s, i) { if (s && s.getBoundingClientRect().top < innerHeight * .35) k = i; });
      links.forEach(function (a, i) { a.classList.toggle('on', i === k); });
    }
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
  })();

  /* ---------- ProMatch: vistazo de la calculadora ---------- */
  var cvn = $('#cv-n');
  if (cvn) (function () {
    var o = $('#cv-o'), r = $('#cv-r'), mx = $('#cv-mx'), reel = 0.5;
    // Vistas por pieza de Diego Serrano en 2026: reels mediana 5.253 / media 6.084; carruseles mediana 6.915 / media 7.872
    function k(v) { return (Math.round(v / 1000) * 1000).toLocaleString('es-EC'); }
    function pintar() {
      var n = +cvn.value; o.textContent = n;
      r.textContent = k(n * (reel * 5253 + (1 - reel) * 6915)) + ' – ' + k(n * (reel * 6084 + (1 - reel) * 7872));
      if (mx) mx.textContent = reel === 0.5 ? 'Mitad reels, mitad carruseles.' : reel > 0.5 ? 'Tres de cada cuatro piezas son reels.' : 'Tres de cada cuatro piezas son carruseles.';
    }
    $$('.cv-mix button').forEach(function (b) { b.addEventListener('click', function () { reel = +b.dataset.m; $$('.cv-mix button').forEach(function (x) { x.classList.toggle('on', x === b); }); pintar(); }); });
    cvn.addEventListener('input', pintar); pintar();
  })();

  /* ---------- ProMatch: el aro entra y la rata se sienta ---------- */
  var pmEsc = $('.pm-escena');
  if (pmEsc) {
    var sc = pmEsc.closest('.score');
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { sc.classList.add('visto'); o.disconnect(); } }, { threshold: 0.4 }).observe(sc);
    else sc.classList.add('visto');
  }

  /* ---------- Guía: viñetas del cómic en secuencia ---------- */
  var comic = $('.comic');
  if (comic) (function () {
    var paso = 0, t = null;
    function sig() { paso = paso % 4 + 1; comic.className = 'comic' + (paso <= 3 ? ' v-' + paso : ' v-3'); t = setTimeout(sig, paso === 3 ? 3600 : paso === 4 ? 600 : 1800); if (paso === 4) paso = 0; }
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { clearTimeout(t); if (es[0].isIntersecting) { paso = 0; sig(); } }, { threshold: 0.3 }).observe(comic);
    else comic.classList.add('v-3');
  })();

  /* ---------- Portada: video de introducción, Espid empuja la barra ---------- */
  var hvc = $('#hv');
  if (hvc) (function () {
    var v = $('#hv-v', hvc), barra = $('.hv-barra', hvc), t = $('.hv-t b', hvc), cargado = false, cayo = false, raf = 0;
    function mmss(s) { s = Math.max(0, Math.floor(s || 0)); return Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2); }
    function dur() { return v.duration && isFinite(v.duration) ? v.duration : 191.4; }
    function pintar() {
      var p = Math.min(1, v.currentTime / dur());
      barra.style.setProperty('--p', p);
      t.textContent = mmss(v.currentTime);
      barra.setAttribute('aria-valuenow', Math.floor(v.currentTime));
      barra.setAttribute('aria-valuetext', mmss(v.currentTime) + ' de ' + mmss(dur()));
    }
    function bucle() { pintar(); if (!v.paused) raf = requestAnimationFrame(bucle); }
    function cargar(listo) {
      if (cargado) return listo();
      cargado = true;
      var src = v.dataset.hls;
      if (v.canPlayType('application/vnd.apple.mpegurl') && !window.MediaSource) { v.src = src; return listo(); }
      var s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.13/dist/hls.min.js';
      s.onload = function () {
        if (window.Hls && Hls.isSupported()) { var h = new Hls({ capLevelToPlayerSize: true }); h.loadSource(src); h.attachMedia(v); }
        else v.src = src;
        listo();
      };
      s.onerror = function () { v.src = src; listo(); };
      document.head.appendChild(s);
    }
    function play() { cargar(function () { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }); }
    /* Espid: se sube a la bola, se sienta, se cae y empieza a empujar */
    function secuencia() {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) { hvc.classList.add('hv-empuja'); return; }
      var c = hvc.classList;
      c.add('hv-sube');
      setTimeout(function () { c.remove('hv-sube'); c.add('hv-sentado'); }, 1500);
      setTimeout(function () { c.remove('hv-sentado'); c.add('hv-cae'); }, 2700);
      setTimeout(function () { c.add('hv-empuja'); c.remove('hv-cae'); }, 3950);
    }
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) hvc.classList.add('hv-rm', 'hv-manual');
    function alternar() { if (v.paused || v.ended) play(); else v.pause(); }
    $('.hv-play', hvc).addEventListener('click', play);
    v.addEventListener('click', function () { if (hvc.classList.contains('hv-auto')) $('.hv-sonido', hvc).click(); else alternar(); });
    $('.hv-pp', hvc).addEventListener('click', alternar);
    $('.hv-son', hvc).addEventListener('click', function () { v.muted = !v.muted; hvc.classList.toggle('hv-mudo', v.muted); this.setAttribute('aria-label', v.muted ? 'Activar sonido' : 'Silenciar'); });
    $('.hv-full', hvc).addEventListener('click', function () {
      if (document.fullscreenElement) return document.exitFullscreen();
      if (hvc.requestFullscreen) hvc.requestFullscreen(); else if (v.webkitEnterFullscreen) v.webkitEnterFullscreen();
    });
    $('.hv-otra', hvc).addEventListener('click', function (e) { e.stopPropagation(); v.currentTime = 0; play(); });
    v.addEventListener('play', function () {
      hvc.classList.add('hv-iniciado', 'hv-corre'); hvc.classList.remove('hv-fin');
      $('.hv-pp', hvc).setAttribute('aria-label', 'Pausar');
      if (!cayo) { cayo = true; secuencia(); }
      cancelAnimationFrame(raf); bucle();
    });
    v.addEventListener('pause', function () { hvc.classList.remove('hv-corre'); $('.hv-pp', hvc).setAttribute('aria-label', 'Reproducir'); pintar(); });
    v.addEventListener('ended', function () { hvc.classList.add('hv-fin'); hvc.classList.remove('hv-corre'); pintar(); });
    v.addEventListener('seeked', pintar);
    /* Reproducción automática en silencio; el botón «Activar sonido» reinicia con voz */
    function salirAuto() { hvc.classList.remove('hv-auto'); }
    $('.hv-sonido', hvc).addEventListener('click', function (e) {
      e.stopPropagation(); salirAuto(); v.muted = false; hvc.classList.remove('hv-mudo');
      $('.hv-son', hvc).setAttribute('aria-label', 'Silenciar'); v.currentTime = 0; play();
    });
    ['.hv-pp', '.hv-son', '.hv-barra', '.hv-otra'].forEach(function (s) { $(s, hvc).addEventListener('pointerdown', salirAuto); });
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      v.muted = true; v.setAttribute('muted', ''); hvc.classList.add('hv-auto', 'hv-mudo'); $('.hv-son', hvc).setAttribute('aria-label', 'Activar sonido');
      new IntersectionObserver(function (es) {
        if (!hvc.classList.contains('hv-auto')) return;
        if (es[0].isIntersecting) cargar(function () { var pr = v.play(); if (pr && pr.catch) pr.catch(function () { hvc.classList.remove('hv-auto', 'hv-mudo'); hvc.classList.add('hv-manual'); v.muted = false; }); });
        else v.pause();
      }, { threshold: .35 }).observe(hvc);
    }
    v.addEventListener('loadedmetadata', pintar);
    function buscar(x) {
      var r = $('.hv-pista', hvc).getBoundingClientRect(), p = Math.min(1, Math.max(0, (x - r.left) / r.width));
      cargar(function () {
        var ir = function () { v.currentTime = p * dur(); if (p < 1) hvc.classList.remove('hv-fin'); pintar(); };
        if (v.readyState >= 1) ir(); else v.addEventListener('loadedmetadata', ir, { once: true });
      });
      barra.style.setProperty('--p', p);
    }
    var arrastra = false;
    barra.addEventListener('pointerdown', function (e) { if (e.target.closest('.hv-otra')) return; arrastra = true; barra.setPointerCapture(e.pointerId); buscar(e.clientX); });
    barra.addEventListener('pointermove', function (e) { if (arrastra) buscar(e.clientX); });
    barra.addEventListener('pointerup', function () { arrastra = false; });
    barra.addEventListener('keydown', function (e) {
      var d = { ArrowRight: 5, ArrowLeft: -5, Home: -1e4, End: 1e4 }[e.key];
      if (d === undefined) return;
      e.preventDefault();
      cargar(function () { v.currentTime = Math.min(dur(), Math.max(0, v.currentTime + d)); pintar(); });
    });
  })();

  /* ---------- Franja acordeón de deportistas ---------- */
  $$('.atl-strip').forEach(function (st) {
    var cs = $$('.atl-c', st), tocado = false, visto = false, k = 0, hover = matchMedia('(hover:hover)').matches;
    function abrir(c) {
      cs.forEach(function (x) {
        var on = x === c, v = $('video', x); x.classList.toggle('on', on);
        if (!v) return;
        if (on && visto) { if (!v.src) v.src = v.dataset.src; v.play().then(function () { v.classList.add('vivo'); }).catch(function () {}); }
        else { v.pause(); v.classList.remove('vivo'); }
      });
      k = cs.indexOf(c);
    }
    cs.forEach(function (c) {
      if (hover) {
        c.addEventListener('mouseenter', function () { tocado = true; st.classList.add('activo'); abrir(c); });
        c.addEventListener('click', function (e) { if (!e.target.closest('a')) location.href = c.dataset.href; });
      } else {
        c.addEventListener('click', function (e) { if (e.target.closest('a')) return; tocado = true; if (!c.classList.contains('on')) { abrir(c); } else { location.href = c.dataset.href; } });
      }
      c.addEventListener('focus', function () { tocado = true; abrir(c); });
      c.addEventListener('keydown', function (e) { if (e.key === 'Enter') location.href = c.dataset.href; });
    });
    st.addEventListener('mouseleave', function () { st.classList.remove('activo'); });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visto = es[0].isIntersecting; var c = cs[k] || cs[0]; if (visto) abrir(c); else cs.forEach(function (x) { var v = $('video', x); if (v) v.pause(); }); }, { threshold: .35 }).observe(st);
    // ciclo automático hasta que la persona interactúe
    var t = setInterval(function () { if (tocado) { clearInterval(t); return; } var r = st.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return; abrir(cs[(k + 1) % cs.length]); }, 3800);
  });


  /* ---------- ProMatch: simulador de puntaje ---------- */
  var sim = $('#pm-sim');
  if (sim) (function () {
    var ins = $$('input[type=range]', sim), c = $('circle.prog', sim), b = $('.val b', sim), rp = $('.reco p', sim), L = 2 * Math.PI * 90;
    c.style.strokeDasharray = L; c.style.transition = 'stroke-dashoffset .5s cubic-bezier(.16,1,.3,1)';
    var nombres = { valores: 'la afinidad de valores', audiencia: 'la compatibilidad de audiencia', territorio: 'el territorio y calendario', contenido: 'las capacidades de contenido', experiencia: 'la experiencia comercial' };
    function calc() {
      var t = 0, min = null;
      ins.forEach(function (i) { var v = +i.value; t += v * (+i.dataset.peso) / 100; i.parentNode.querySelector('output').textContent = v; i.style.setProperty('--p', v + '%'); if (!min || v < +min.value) min = i; });
      t = Math.round(t); b.textContent = t; c.style.strokeDashoffset = L * (1 - t / 100);
      var debil = nombres[min.id.replace('sim-', '')];
      rp.textContent = t >= 80 ? 'Alta compatibilidad. Se recomienda avanzar a propuesta; antes, reforzar ' + debil + ' con una activación piloto.'
        : t >= 65 ? 'Compatibilidad media. Hay base para conversar, pero ' + debil + ' debe trabajarse antes de presentar una propuesta.'
        : 'Compatibilidad baja. No se recomienda la alianza todavía: el punto más débil es ' + debil + '.';
    }
    ins.forEach(function (i) { i.addEventListener('input', calc); }); calc();
  })();

  /* ---------- ProMatch: comparar perfiles ---------- */
  var comp = $('#pm-comp');
  if (comp) (function () {
    var filas = $$('.cmp-fila', comp), tabs = $$('.cmp-tabs button');
    function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
    function ver(k) {
      tabs.forEach(function (t) { t.classList.toggle('on', t.dataset.k === k); t.setAttribute('aria-selected', t.dataset.k === k); });
      var mx = Math.max.apply(null, filas.map(function (f) { return +f.dataset[k]; }));
      filas.slice().sort(function (a, b) { return b.dataset[k] - a.dataset[k]; }).forEach(function (f, i) {
        f.style.order = i; var v = +f.dataset[k];
        $('.cmp-barra i', f).style.width = (k === 'score' ? v : v / mx * 100) + '%';
        $('.cmp-v', f).textContent = fmt(v);
      });
    }
    tabs.forEach(function (t) { t.addEventListener('click', function () { ver(t.dataset.k); }); });
    setTimeout(function () { ver('score'); }, 300);
  })();

  /* ---------- ProMatch: registro ---------- */
  /* ---------- ProMatch: más seguidores no es más encaje (ejemplo interactivo) ---------- */
  var vs = $('#vs');
  if (vs) (function () {
    var M = JSON.parse(vs.dataset.marcas), cards = $$('.vs-p', vs), msg = $('.vs-msg', vs);
    function contar(el, n) {
      var de = +el.textContent || 0, t0 = performance.now();
      (function paso(t) { var k = Math.min(1, (t - t0) / 600); el.textContent = Math.round(de + (n - de) * k); if (k < 1) requestAnimationFrame(paso); })(t0);
    }
    function ver(i) {
      var m = M[i], enc = {};
      $$('.vs-m', vs).forEach(function (b) { b.setAttribute('aria-pressed', +b.dataset.i === i); });
      cards.forEach(function (c) {
        var v = m[c.dataset.k], e = Math.round((v[0] + v[1] + v[2]) / 3);
        enc[c.dataset.k] = e;
        $$('.vs-dims em', c).forEach(function (em, x) { em.style.width = v[x] + '%'; });
        $('.vs-venn', c).style.setProperty('--o', e / 100);
        contar($('.vs-encaje b', c), e);
      });
      cards.forEach(function (c) { c.classList.toggle('gana', enc[c.dataset.k] === Math.max(enc.a, enc.b)); });
      msg.textContent = m.m;
    }
    $$('.vs-m', vs).forEach(function (b) { b.addEventListener('click', function () { ver(+b.dataset.i); }); });
    ver(0);
  })();
  /* ---------- ProMatch: metodología en pestañas ---------- */
  var tabs = $('#pmx-tabs');
  if (tabs) $$('[role=tab]', tabs).forEach(function (b) {
    b.addEventListener('click', function () {
      $$('[role=tab]', tabs).forEach(function (x) { x.setAttribute('aria-selected', x === b); });
      $$('.pmx-panel', tabs).forEach(function (p) { p.hidden = p.dataset.tab !== b.dataset.tab; if (!p.hidden) $$('.rv', p).forEach(function (r) { r.classList.add('in'); }); });
    });
  });
  /* ---------- ProMatch: cómo funciona ---------- */
  var crs = $('#pmx-crs');
  if (crs) (function () {
    var bs = $$('.pmx-bar', crs);
    function ver(b) { bs.forEach(function (x) { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
      $('#pmx-det-t').textContent = b.dataset.t; $('#pmx-det-p').textContent = b.dataset.p; $('#pmx-det-s').textContent = b.dataset.nv ? 'En la auditoría de ejemplo: ' + b.dataset.nv.toLowerCase() + '.' : ''; }
    bs.forEach(function (b) { b.addEventListener('click', function () { ver(b); }); });
    ver(bs[1]);
  })();
  var pint = $('#pmx-int');
  if (pint) (function () {
    var bs = $$('.pmx-esc-b button', pint);
    function ver(b) { bs.forEach(function (x) { x.classList.toggle('lleno', +x.dataset.n <= +b.dataset.n); x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); });
      $('#pmx-niv-t').textContent = b.dataset.n + ' · ' + b.dataset.t; $('#pmx-niv-p').textContent = b.dataset.p; }
    bs.forEach(function (b) { b.addEventListener('click', function () { ver(b); }); });
    ver(bs[0]);
  })();

  /* ---------- ProMatch: registro con medidor ---------- */
  var reg = $('#pm-reg');
  if (reg) (function () {
    var sec = $('#registro');
    function rol() { return reg.querySelector('input[name=quien]:checked').value; }
    function v(n) {
      var ins = reg.querySelectorAll('[name=' + n + ']');
      if (!ins.length) return '';
      if (ins[0].type === 'radio' || ins[0].type === 'checkbox') return [].filter.call(ins, function (x) { return x.checked; }).map(function (x) { return x.value; }).join(', ');
      return (ins[0].value || '').trim();
    }
    function cuenta(n) { return reg.querySelectorAll('input[name=' + n + ']:checked').length; }
    $$('input[name=d_valores]', reg).forEach(function (x) { x.addEventListener('change', function () { if (cuenta('d_valores') > 3) x.checked = false; }); });
    function vars() {
      if (rol() === 'marca') return [
        ['Objetivo', v('m_reto') || v('m_frase') ? 'ok' : ''],
        ['Público', v('m_pub') ? 'ok' : ''],
        ['Territorio', v('m_ter') ? 'ok' : ''],
        ['Formato', v('m_formato') ? 'ok' : ''],
        ['Momento', v('m_cuando') ? (v('m_cuando') === 'Estamos explorando' ? 'med' : 'ok') : ''],
        ['Inversión', v('m_inv') ? (v('m_inv') === 'Por definir' ? 'med' : 'ok') : '']];
      var of = cuenta('d_ofrece'), ex = v('d_exp'), au = v('d_aud'), te = (v('d_ciudad') ? 1 : 0) + (v('d_prox') ? 1 : 0);
      return [
        ['Valores', cuenta('d_valores') ? 'ok' : ''],
        ['Audiencia', au ? (au === 'Aún no lo sé' ? 'med' : 'ok') : ''],
        ['Territorio', te === 2 ? 'ok' : te ? 'med' : ''],
        ['Contenido', of >= 3 ? 'ok' : of ? 'med' : ''],
        ['Experiencia', ex ? (ex === 'Nunca' ? 'med' : 'ok') : '']];
    }
    function lectura(L) {
      function f(k) { return L.filter(function (x) { return x[1] === k; }).map(function (x) { return x[0]; }); }
      return { f: f('ok'), m: f('med'), z: f('') };
    }
    function pintar() {
      var M = rol() === 'marca', L = vars(), r = lectura(L), n = r.f.length + r.m.length, t = [];
      $('#pmr-med-t').textContent = M ? 'Su briefing ProMatch' : 'Tu perfil ProMatch';
      $('#pmr-med-n').textContent = n + ' de ' + L.length;
      $('#pmr-med-l').innerHTML = L.map(function (x) { return '<li class="' + x[1] + '">' + x[0] + '</li>'; }).join('');
      if (r.f.length) t.push((M ? 'Claro: ' : 'Fuerte: ') + r.f.join(', ') + '.');
      if (r.m.length) t.push((M ? 'Por definir: ' : 'Por trabajar: ') + r.m.join(', ') + '.');
      if (!n) t.push(M ? 'Responda y mire cómo se arma su briefing.' : 'Responde y mira cómo se arma tu perfil.');
      else if (r.z.length) t.push('Falta: ' + r.z.join(', ') + '.');
      else t.push(M ? 'Briefing completo: listo para comparar perfiles.' : 'Perfil completo: listo para una primera lectura.');
      $('#pmr-med-p').textContent = t.join(' ');
    }
    function mostrar() {
      var r = rol();
      $$('[data-para]', sec).forEach(function (f) { f.hidden = f.dataset.para !== r || f.classList.contains('pmr-ok'); });
      $('.aviso', reg).textContent = ''; pintar();
    }
    $$('input[name=quien]', reg).forEach(function (r) { r.addEventListener('change', mostrar); });
    reg.addEventListener('input', pintar); reg.addEventListener('change', pintar);
    function linea(k, x) { return x ? '\n• ' + k + ': ' + x : ''; }
    reg.addEventListener('submit', function (e) {
      e.preventDefault();
      var av = $('.aviso', reg), m = rol() === 'marca';
      if (m ? !(v('m_rep') && v('m_empresa')) : !(v('d_nombre') && v('d_disciplina'))) { av.textContent = m ? 'Completa el nombre del representante y de la empresa.' : 'Completa tu nombre y tu disciplina.'; return; }
      av.textContent = '';
      var r = lectura(vars()), res = '\n\n*Lectura ProMatch*' + linea(m ? 'Claro' : 'Fuerte', r.f.join(', ')) + linea(m ? 'Por definir' : 'Por trabajar', r.m.join(', ')) + linea('Sin responder', r.z.join(', '));
      abrirWA(m
        ? 'Hola Daniel, quiero unirme a la lista de ProMatch como marca.\n\n*La marca*' + linea('Representante', v('m_rep')) + linea('Cargo', v('m_cargo')) + linea('Empresa', v('m_empresa')) + linea('Sector', v('m_sector')) + linea('Web/Instagram', v('m_web'))
          + '\n\n*La necesidad*' + linea('Resolver', v('m_reto')) + linea('El reto', v('m_frase')) + linea('Público', v('m_pub')) + linea('Territorio', v('m_ter'))
          + '\n\n*Cómo y cuándo*' + linea('Espera del deportista', v('m_formato')) + linea('Cuándo', v('m_cuando')) + linea('Experiencia previa', v('m_prev')) + linea('Inversión', v('m_inv')) + res
        : 'Hola Daniel, quiero unirme a la lista de ProMatch como deportista.\n\n*Mi perfil*' + linea('Nombre', v('d_nombre')) + linea('Disciplina', v('d_disciplina')) + linea('Ciudad', v('d_ciudad')) + linea('Instagram', v('d_ig')) + linea('Nivel', v('d_nivel'))
          + '\n\n*Mi momento*' + linea('Busco', v('d_obj')) + linea('Experiencia con marcas', v('d_exp')) + linea('Próxima competencia', v('d_prox'))
          + '\n\n*Lo que ofrezco*' + linea('Puedo hacer', v('d_ofrece')) + linea('Me representa', v('d_valores')) + linea('Me siguen sobre todo', v('d_aud')) + linea('No aceptaría', v('d_no')) + res);
      $$('.pmr-ok', reg).forEach(function (o) { o.hidden = o.dataset.para !== rol(); });
    });
    pintar();
  })();


  /* ---------- Caso GT: pestañas por fecha y fases ---------- */
  $$('.gt-identidad').forEach(function (g) {
    var tabs = $$('.gt-tabs button', g), panels = $$('.gt-panel', g);
    function ver(k) {
      tabs.forEach(function (t) { var on = t.dataset.t === k; t.classList.toggle('on', on); t.setAttribute('aria-selected', on); });
      panels.forEach(function (p) { var on = p.dataset.p === k; p.hidden = !on; if (on) { p.classList.remove('visto'); void p.offsetWidth; setTimeout(function () { p.classList.add('visto'); }, 60); $$('.rv', p).forEach(function (e) { e.classList.add('in'); }); } });
    }
    tabs.forEach(function (t) { t.addEventListener('click', function () { ver(t.dataset.t); }); });
    panels.forEach(function (p) {
      var fs = $$('.fase', p), tx = $('.fase-txt', p);
      fs.forEach(function (f) { f.addEventListener('click', function () { fs.forEach(function (x) { x.classList.toggle('on', x === f); }); tx.textContent = f.dataset.txt; }); });
    });
    if ('IntersectionObserver' in window) { var o = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { o.disconnect(); var p = panels.filter(function (x) { return !x.hidden; })[0]; if (p) p.classList.add('visto'); } }, { threshold: .2 }); o.observe(g); } else panels.forEach(function (p) { p.classList.add('visto'); });
  });


  /* ---------- Pestañas genéricas ---------- */
  $$('[data-tabs]').forEach(function (g) {
    var tb = $$('[role=tablist] button', g), ps = $$('[data-p]', g);
    tb.forEach(function (t) { t.addEventListener('click', function () {
      tb.forEach(function (x) { x.classList.toggle('on', x === t); x.setAttribute('aria-selected', x === t); });
      ps.forEach(function (p) { p.hidden = p.dataset.p !== t.dataset.t; });
    }); });
  });


  /* ---------- Galería horizontal con flechas ---------- */
  $$('.gh-nav').forEach(function (n) {
    var g = n.previousElementSibling;
    $$('button', n).forEach(function (b) { b.addEventListener('click', function () { g.scrollBy({ left: (+b.dataset.dir) * g.clientWidth * .8, behavior: 'smooth' }); }); });
  });


  /* ---------- Estrategias: videos que se reproducen al verse ---------- */
  if ('IntersectionObserver' in window) $$('.estr-v video').forEach(function (v) {
    new IntersectionObserver(function (es) { if (es[0].isIntersecting) { if (!v.src) v.src = v.dataset.src; v.play().catch(function () {}); } else v.pause(); }, { threshold: .4 }).observe(v);
  });

  /* ---------- Metodología: escalera ---------- */
  var esc_ = $('.escalera');
  if (esc_) (function () {
    var D = JSON.parse($('#metodo-data').textContent), pel = $$('.peldano', esc_), fig = $('.sube', esc_), txt = $('.metodo-txt');
    function ver(i) {
      pel.forEach(function (p, k) { p.classList.toggle('on', k === i); p.setAttribute('aria-pressed', k === i); });
      var p = pel[i], r = p.getBoundingClientRect(), rr = esc_.getBoundingClientRect();
      fig.style.left = (r.left - rr.left + r.width / 2 - fig.offsetWidth / 2) + 'px';
      fig.style.bottom = r.height + 'px';
      if (p.dataset.fig) { var u = 'url(' + p.dataset.fig + ')'; fig.style.webkitMaskImage = u; fig.style.maskImage = u; fig.style.setProperty('--ar', p.dataset.ar); }
      var d = D[i];
      txt.innerHTML = '<div class="num">0' + (i + 1) + '</div><div class="epic t">' + d[0] + '</div><p class="lead" style="margin-top:8px;font-size:18px">' + d[1] + '</p><dl><div><dt>Entregables</dt><dd>' + d[2] + '</dd></div><div><dt>Tu parte</dt><dd>' + d[3] + '</dd></div></dl>';
    }
    pel.forEach(function (p, i) { p.addEventListener('click', function () { ver(i); }); });
    var i0 = 0; ver(0);
    addEventListener('resize', function () { ver(pel.findIndex(function (p) { return p.classList.contains('on'); })); });
    // avance automático la primera vez que se ve
    if ('IntersectionObserver' in window) { var o = new IntersectionObserver(function (es) { if (!es[0].isIntersecting) return; o.disconnect(); var k = 0; var t = setInterval(function () { k++; if (k > 4) { clearInterval(t); return; } ver(k); }, 1100); }, { threshold: .5 }); o.observe(esc_); }
  })();

  /* ---------- ProMatch: anillo y barras ---------- */
  var score = $('.score:not(.sim-score)');
  if (score && 'IntersectionObserver' in window) {
    var oo = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return; oo.disconnect();
      var c = $('circle.prog', score), L = 2 * Math.PI * 90, v = +score.dataset.v;
      c.style.strokeDasharray = L; c.style.strokeDashoffset = L; void c.getBoundingClientRect();
      c.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(.16,1,.3,1)'; c.style.strokeDashoffset = L * (1 - v / 100);
      var b = $('.val b', score), t0 = performance.now();
      (function p(ts) { var k = Math.min(1, (ts - t0) / 1600); b.textContent = Math.round(v * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(p); })(t0);
      $$('.var-f .barra i').forEach(function (i) { i.style.width = i.dataset.w + '%'; });
    }, { threshold: .4 });
    oo.observe(score);
  }

  /* ---------- Parallax suave ---------- */
  var par = $$('[data-par]');
  if (par.length && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
    var tick = false;
    addEventListener('scroll', function () {
      if (tick) return; tick = true;
      requestAnimationFrame(function () {
        par.forEach(function (el) { var r = el.parentElement.getBoundingClientRect(); var y = (r.top + r.height / 2 - innerHeight / 2) * (+el.dataset.par); el.style.translate = '0 ' + y.toFixed(1) + 'px'; });
        tick = false;
      });
    }, { passive: true });
  }

  /* ---------- Ejemplos de servicios: videos que se reproducen al verse ---------- */
  var ejs = $$('.ej video');
  if (ejs.length && 'IntersectionObserver' in window) {
    var oe = new IntersectionObserver(function (es) {
      es.forEach(function (e) { var v = e.target; if (e.isIntersecting) { if (!v.src) v.src = v.dataset.src; v.play().catch(function () {}); } else v.pause(); });
    }, { threshold: .45 });
    ejs.forEach(function (v) { oe.observe(v); });
  }

  /* ---------- ¿Qué cobertura necesitas? ---------- */
  var elige = $('#elige-form');
  if (elige) elige.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = elige.dias.value, v = elige.valor.value, f = elige.fin.value, r;
    if (f === 'marca') r = ['Video de presentación', 'Una pieza que presenta quién eres y hacia dónde vas, grabada en una competencia real.', '#presentacion'];
    else if (d === '0') r = ['Contenido eventual', 'La pieza exacta para el momento: video comercial, arte, video compuesto o fotografía.', '#eventual'];
    else if (d === '2' || v === '2' || f === 'pro') r = ['Cobertura completa', 'Antes, durante y después, con dron, cámara 360 y video resumen profesional.', '#completa'];
    else r = ['Cobertura simple', 'Producción móvil e instantánea para un evento de un día.', '#simple'];
    var box = $('.elige-res');
    box.innerHTML = '<div class="resultado"><span class="lbl" style="color:var(--rojo-vivo)">Te recomendamos</span><h3 class="epic">' + r[0] + '</h3><p>' + r[1] + '</p><div class="btns" style="margin-top:16px"><a class="btn crema" href="' + r[2] + '">Ver ejemplos »</a><button class="btn rojo" type="button">Cotizar esta cobertura »</button></div></div>';
    $('button', box).onclick = function () { abrirWA('Hola Daniel, hice el test de coberturas de Pro Motion y me recomendó: ' + r[0] + '. Quiero cotizarla para mi evento.'); };
  });

  /* ---------- Fichas: sectores compatibles ---------- */
  $$('.sectores').forEach(function (g) {
    var idea = g.parentElement.querySelector('.idea p');
    $$('.sector', g).forEach(function (b, i) {
      b.addEventListener('click', function () {
        $$('.sector', g).forEach(function (x) { x.classList.toggle('on', x === b); });
        idea.textContent = b.dataset.idea;
      });
      if (i === 0) b.click();
    });
  });
  /* ---------- Barras que se llenan al verse ---------- */
  var barras = $$('.barra i');
  if (barras.length && 'IntersectionObserver' in window) {
    var ob = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.style.width = e.target.dataset.w + '%'; ob.unobserve(e.target); } }); }, { threshold: .3 });
    barras.forEach(function (b) { ob.observe(b); });
  }

  /* =================== HERRAMIENTAS =================== */

  /* ---------- Configurador (deportistas) ---------- */
  var cfg = $('#configurador');
  if (cfg) (function () {
    var S = JSON.parse($('#servicios-data').textContent), paso = 1;
    var lista = $('.opciones-chk', cfg);
    lista.innerHTML = S.map(function (s) { return '<label class="chk"><span><span class="cat">' + s.cat + '</span>' + s.name + '</span><small>USD ' + s.min + '–' + s.max + ' · ' + s.rec + '</small><input type="checkbox" value="' + s.id + '"></label>'; }).join('');
    function irPaso(p, init) {
      paso = p; $$('.cfg-paso', cfg).forEach(function (el) { el.hidden = +el.dataset.p !== p; });
      $$('.pasos i', cfg).forEach(function (el, i) { el.classList.toggle('on', i < p); });
      if (p === 3) cotizar();
      if (p === 4) analizar();
      if (!init) cfg.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    $$('[data-ir]', cfg).forEach(function (b) { b.addEventListener('click', function () { irPaso(+b.dataset.ir); }); });
    function sel() { return $$('input:checked', lista).map(function (i) { return i.value; }); }
    function cotizar() {
      var ids = sel(), pick = S.filter(function (s) { return ids.indexOf(s.id) > -1; });
      $('.cot-n', cfg).textContent = pick.length;
      var F = ['identidad', 'narrativa', 'mediakit', 'perfiles', 'valor'], P = ['cobertura', 'dron', 'doc', 'video'];
      var tieneF = ids.some(function (i) { return F.indexOf(i) > -1; }), tieneP = ids.some(function (i) { return P.indexOf(i) > -1; });
      var av = '';
      if (tieneP && !tieneF) av = 'Estás eligiendo producción sin identidad ni dossier. Es el error más caro del mercado: piezas bonitas que no cierran ningún auspicio. Suma primero identidad y media kit.';
      else if (pick.length && pick.every(function (s) { return s.rec === 'una vez'; })) av = 'Todo tu mix es de una sola vez. Sin producción sostenida, en tres meses no tendrás nada nuevo que mostrar.';
      $('.aviso-mix', cfg).textContent = av;
    }
    lista.addEventListener('change', cotizar);
    function analizar() {
      var f = function (n) { var e = $('[name="' + n + '"]', cfg); return e ? e.value : ''; };
      var pts = 0;
      if (f('nivel') === 'Profesional / élite') pts += 3; else if (f('nivel') === 'Semi-profesional') pts += 2; else pts += 1;
      if (f('compite') === 'Sí') pts += 1; if (f('auspicios') === 'Sí') pts += 2; if (f('redes') === 'Sí') pts += 1; if (f('contenido') === 'Sí') pts += 1;
      pts += (+f('constancia') || 3) / 2.5;
      var cat = pts >= 8 ? ['PERFIL ALTO VALOR', 'Referente con estructura. Listo para alianzas de largo plazo y campañas con marcas nacionales.', 'Dossier comercial + coordinación de auspiciantes + cobertura presencial.']
        : pts >= 6 ? ['PERFIL PROYECCIÓN', 'Buen nivel deportivo y narrativa en marcha. Falta ordenar la oferta comercial.', 'Media kit estratégico + plan de contenido mensual + preparación de negociación.']
          : pts >= 4 ? ['PERFIL CRECIMIENTO', 'Ya comunicas, pero sin sistema. Necesitas estructura para escalar y sostener.', 'Identidad verbal + calendario editorial + 3 piezas mensuales.']
            : ['PERFIL SEMILLA', 'Mucho potencial, poco orden. Conviene empezar por lo mínimo viable y sostenerlo.', 'Diagnóstico + optimización de perfiles + primera rutina de contenido.'];
      var nombres = S.filter(function (s) { return sel().indexOf(s.id) > -1; }).map(function (s) { return s.name; });
      $('.cfg-res', cfg).innerHTML = '<span class="lbl">Tu categoría</span><h3 class="epic">' + cat[0] + '</h3><p>' + cat[1] + '</p><span class="lbl">Ruta sugerida</span><p>' + cat[2] + '</p><span class="lbl">Tu mix</span><p>' + (nombres.length ? esc(nombres.join(' · ')) : 'Sin servicios seleccionados todavía.') + '</p>';
      var msg = 'Hola Daniel, hice el configurador de Pro Motion.\n\nNombre: ' + f('nombre') + '\nDeporte: ' + f('deporte') + '\nCiudad: ' + f('ciudad') + '\nNivel: ' + f('nivel') + '\nCategoría: ' + cat[0] + '\nMix: ' + (nombres.join(', ') || 'por definir') + '\n\nQuiero una cotización personalizada.';
      $('.cfg-enviar', cfg).onclick = function () { abrirWA(msg); };
    }
    irPaso(1, true);
  })();

  /* ---------- Brief de marca ---------- */
  var brief = $('#brief');
  if (brief) brief.addEventListener('click', function (e) { if (e.target.closest('[data-b-otra]')) { $('.b-ok', brief).hidden = true; } });
  if (brief) brief.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = new FormData(brief), faltan = [];
    ['objetivo', 'audiencia', 'territorio'].forEach(function (k) { if (!String(d.get(k) || '').trim()) faltan.push(k); });
    var av = $('.brief-aviso');
    if (faltan.length) { av.textContent = 'Completa: ' + faltan.join(', ') + '.'; return; }
    av.textContent = '';
    var L = [['Empresa', 'empresa'], ['Instagram / web', 'ig'], ['Contacto', 'contacto'], ['Objetivo', 'objetivo'], ['Audiencia', 'audiencia'], ['Territorio', 'territorio'], ['Duración', 'duracion'], ['Inversión', 'inversion'], ['Esperamos del deportista', 'espera'], ['Deportes de interés', 'deportes'], ['Éxito medido por', 'kpi'], ['Fecha clave', 'fecha'], ['Valores de marca', 'valores'], ['Referencias', 'referencias'], ['Manual / logo', 'manual'], ['Evitar', 'evitar']];
    var txt = L.map(function (x) { var v = d.getAll(x[1]).map(function (y) { return String(y).trim(); }).filter(Boolean).join(', '); return v && v !== 'Por definir' ? x[0] + ': ' + v : ''; }).filter(Boolean).join('\n');
    abrirWA('Hola Daniel, soy de una marca y quiero diseñar una activación deportiva. Este es nuestro briefing:\n\n' + txt);
    var ok = $('.b-ok', brief); if (ok) { ok.hidden = false; ok.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
  });

  /* ---------- Academy: prediagnóstico de valor comercial (3 pasos) ---------- */
  var diag = $('#diagnostico-form');
  if (diag) (function () {
    var T = JSON.parse($('#arquetipos-data').textContent), paso = 1;
    var pasos = $$('.dg-paso', diag), sig = $('.dg-sig', diag), atras = $('.dg-atras', diag), aviso = $('.dg-aviso', diag), res = $('.diag-res', diag);
    function v(n) { var d = new FormData(diag); return d.getAll(n).map(function (x) { return String(x).trim(); }).filter(Boolean); }
    function uno(n) { return v(n)[0] || ''; }
    function idx(n, ops) { return ops.indexOf(uno(n)); }
    function conOtro(n) { var o = uno(n + '_otro'); return v(n).map(function (x) { return /^Otr[ao]$/.test(x) && o ? x + ': ' + o : x; }).join(', '); }
    $$('input[name="valores"]', diag).forEach(function (c) { c.addEventListener('change', function () { if (v('valores').length > 3) c.checked = false; }); });
    function mostrar() {
      pasos.forEach(function (f) { f.hidden = +f.dataset.p !== paso; });
      $('.dg-paso-t b', diag).textContent = paso;
      $('.dg-barra i', diag).style.width = (paso / 3 * 100) + '%';
      atras.hidden = paso === 1;
      sig.innerHTML = paso < 3 ? 'Siguiente <span class="chev">»</span>' : 'Ver mi diagnóstico <span class="chev">»</span>';
      aviso.textContent = '';
    }
    function calc() {
      var cap = function (x) { return Math.max(0, Math.min(100, Math.round(x))); };
      var et = idx('etapa', ['En formación', 'Amateur competitivo', 'Profesional nacional', 'Internacional']);
      var off = v('off').filter(function (x) { return x !== 'Ninguna' && x !== 'No lo sé'; }).length;
      var D = {
        Identidad: cap((et + 1) * 10 + Math.min(v('valores').length, 2) * 15 + (uno('logro') ? 20 : 0) + (off ? 10 : 0)),
        Audiencia: cap([10, 30, 50, 70][idx('tam', ['Menos de 1.000', '1.000 a 5.000', '5.000 a 20.000', 'Más de 20.000'])] || 0) + Math.min(v('quien').filter(function (x) { return x !== 'No lo sé'; }).length, 2) * 8 + ([5, 8, 10, 15][idx('donde', ['Mi ciudad', 'Varias ciudades', 'Mi país', 'Varios países'])] || 0),
        Calendario: cap(([25, 50, 70][idx('comp', ['1 a 3', '4 a 8', '9 o más'])] || 0) + ([10, 20, 30][idx('alcance', ['Local', 'Nacional', 'Internacional'])] || 0)),
        Contenido: cap(([10, 35, 60][idx('frec', ['Casi no publico', '1 o 2 por semana', '3 o más por semana'])] || 0) + ([10, 20, 30][idx('prod', ['Yo, con el celular', 'Alguien me ayuda', 'Un equipo profesional'])] || 0) + ([0, 5, 10][idx('cam', ['Me cuesta', 'Más o menos', 'Con soltura'])] || 0)),
        Experiencia: cap(([50, 30, 0][idx('dossier', ['Sí, actualizado', 'Sí, pero desactualizado', 'No'])] || 0) + ([0, 20, 50][idx('ausp', ['Nunca', 'Sí, sin entregar resultados', 'Sí, con informe de resultados'])] || 0))
      };
      D.Audiencia = cap(D.Audiencia);
      var P = { Identidad: 20, Audiencia: 25, Calendario: 20, Contenido: 20, Experiencia: 15 }, total = 0;
      Object.keys(P).forEach(function (k) { total += D[k] * P[k] / 100; });
      return { D: D, total: Math.round(total) };
    }
    /* Lectura con el modelo Pro Motion: las 5 variables de ProMatch, las 4 capas de valor y el método en 7 pasos */
    var NOM = { Identidad: 'Valores e identidad', Audiencia: 'Audiencia', Calendario: 'Territorio y calendario', Contenido: 'Contenido y vocería', Experiencia: 'Experiencia comercial' };
    var FZ = {
      Identidad: 'Tienes una identidad y valores que una marca puede hacer suyos.',
      Audiencia: 'Tu comunidad tiene tamaño y un perfil reconocible.',
      Calendario: 'Tu calendario le da a una marca momentos concretos para activar.',
      Contenido: 'Publicas con constancia y te comunicas bien: hay con qué mostrar a la marca.',
      Experiencia: 'Ya trabajaste con marcas y tienes material para demostrarlo.'
    };
    var ACC = {
      Identidad: ['Ordena tu propuesta de valor', 'Define qué representas y qué gana una marca contigo, más allá de tus resultados.', 'Ordenar'],
      Audiencia: ['Conoce y documenta a tu audiencia', 'Revisa en tus estadísticas la edad, la ciudad y el género de quienes te siguen: es lo primero que pregunta una marca.', 'Identificar'],
      Calendario: ['Convierte tu calendario en momentos de marca', 'Cada competencia tiene un antes, un durante y un después que una marca puede activar.', 'Crear'],
      Contenido: ['Gana constancia y vocería', 'Publica con un plan semanal y entrena tu forma de hablar a cámara.', 'Crear'],
      Experiencia: ['Construye evidencia comercial', 'Arma tu perfil comercial y entrega un informe a cada auspiciante: así se renueva.', 'Probar']
    };
    var PLAN = {
      Identidad: ['Una marca no se asocia con resultados sueltos: se asocia con lo que representas. Si no lo dices tú, lo decide la marca, o no lo decide nadie.', 'Escribe tres cosas: qué te mueve a competir, qué has superado y qué defiendes. Quédate con las que podrías sostener en una entrevista.', 'Redacta tu presentación en dos líneas: quién eres, qué haces y qué gana una marca contigo. Ponla en tu biografía.', 'Elige tres temas de los que siempre vas a hablar (por ejemplo: entrenamiento, tu ciudad, tu familia) y úsalos como guía de lo que publicas.', 'Alguien que no te conoce lee tu perfil y puede decir en una frase qué representas.'],
      Audiencia: ['Es lo primero que pregunta una marca: a quién llegas. Importa menos el tamaño que poder demostrar quiénes son.', 'Abre las estadísticas de tu red principal y guarda capturas de edad, género, ciudades y alcance de los últimos 30 días. Si no aparecen, cambia tu cuenta a perfil profesional: es gratis.', 'Suma la comunidad que no está en redes: tu club, tu gimnasio, tu colegio o empresa, tus grupos. Anota cuántas personas son.', 'Resume todo en una ficha de una página: cuántos, quiénes y dónde. Actualízala cada tres meses.', 'Puedes responder en 30 segundos, con cifras, a quién le llega lo que haces.'],
      Calendario: ['Cada competencia es un momento que una marca puede usar: hay expectativa antes, emoción durante e historia después.', 'Escribe tu calendario de los próximos 12 meses: fecha, lugar, nivel y cuánta gente asiste o lo sigue.', 'Para cada competencia importante define tres momentos: antes (anuncio, preparación), durante (presencia, contenido en vivo) y después (resultado, agradecimiento).', 'Marca las dos o tres fechas más fuertes del año: son las primeras que vas a ofrecer.', 'Tienes un calendario de una página donde una marca ve qué podría hacer contigo y cuándo.'],
      Contenido: ['Entre competencia y competencia, tu contenido es lo único que una marca puede ver de ti. La constancia pesa más que la producción.', 'Fija un mínimo que puedas cumplir: dos publicaciones por semana durante ocho semanas. Mejor poco y constante que mucho y luego un mes de silencio.', 'Reparte los temas: una de entrenamiento o competencia y una de tu historia o tu día a día. Graba varias el mismo día.', 'Practica hablar a cámara 60 segundos, una vez por semana, sobre algo que sepas de tu deporte. Al principio no hace falta publicarlo.', 'Llevas ocho semanas seguidas publicando sin saltarte ninguna.'],
      Experiencia: ['Una marca decide con evidencia. Si hoy alguien se interesa, necesita un documento que evaluar; y si ya te apoyó, necesita ver qué recibió.', 'Reúne lo que ya tienes: resultados, fotos buenas, cifras de audiencia, menciones en medios y marcas que te hayan apoyado, aunque fuera en especie.', 'Arma un perfil comercial de pocas páginas: quién eres, a quién llegas, tu calendario y qué puede hacer una marca contigo. No es una carpeta de logros: es una propuesta.', 'Si tienes o tuviste un auspiciante, prepárale un informe sencillo: qué publicaste, cuánta gente lo vio y fotos de la marca en uso.', 'Puedes enviar tu perfil comercial en PDF el mismo día que te lo piden.']
    };
    var PLAN_S = [['Negocia con datos', 'Ya tienes con qué negociar. La diferencia ahora está en llegar a cada reunión con cifras y no solo con trayectoria.', 'Actualiza tu ficha de audiencia y tus resultados con marcas antes de cada reunión.', 'Lleva una propuesta con dos o tres opciones de distinto tamaño, no una sola.', 'Deja por escrito qué entrega cada parte y cómo se va a medir.', 'Cada acuerdo nuevo queda por escrito, con entregables y forma de medir.'],
      ['Mide cada activación', 'Lo que no se mide no se puede renovar ni mejorar.', 'Define con la marca, antes de empezar, qué se va a medir.', 'Guarda capturas y cifras de cada publicación o acción el mismo día.', 'Entrega un informe al cierre, aunque nadie te lo pida.', 'Cada marca recibe su informe al terminar cada activación.'],
      ['Sostén y renueva', 'Renovar cuesta menos que conseguir un auspiciante nuevo, pero hay que proponerlo a tiempo.', 'Agenda la conversación de renovación dos o tres meses antes de que termine el acuerdo.', 'Llega con el informe de lo hecho y una idea nueva para la siguiente temporada.', 'Pregunta qué le sirvió más a la marca y ajusta la propuesta.', 'Tus auspiciantes actuales conocen tu plan de la próxima temporada antes de que termine esta.']];
    var FIX = { 'Sin perfil comercial': 'Empieza por una versión de una página: quién eres, a quién llegas y tu calendario.', 'Auspicios sin informe': 'Envía al cierre un resumen con publicaciones, alcance y fotos, aunque nadie te lo pida.', 'No conoces a tu audiencia': 'Revisa las estadísticas de tu red principal y guarda capturas de edad, ciudad y género.', 'Desapareces entre competencias': 'Comprométete con un mínimo semanal que puedas sostener todo el año.', 'Te cuesta hablar a cámara': 'Practica un minuto por semana: se entrena igual que un gesto técnico.', 'Sin valores definidos': 'Elige dos o tres ideas que puedas sostener con tu propia historia.', 'Poca comunidad fuera de redes': 'Empieza por un grupo cercano: tu club, tu gimnasio o tu colegio.' };
    var SOSTENER = [['Negocia con datos', 'Lleva a cada reunión tu audiencia real y tus resultados con marcas.', 'Negociar'], ['Mide cada activación', 'Entrega a cada marca un informe con lo que recibió.', 'Medir'], ['Sostén y renueva', 'Planifica la temporada siguiente con tus auspiciantes antes de que termine la actual.', 'Sostener']];
    var METODO = ['Identificar', 'Ordenar', 'Crear', 'Probar', 'Medir', 'Negociar', 'Sostener'];
    var ETAPAS = [
      ['Etapa 1 · Ordenar la base', 'Tienes talento y algo que contar, pero todavía no está traducido a algo que una marca pueda entender, activar y medir. Antes de salir a buscar auspicios, toca ordenar quién eres, a quién llegas y qué ofreces.', 1],
      ['Etapa 2 · Crear y probar', 'Ya tienes bases: identidad, comunidad o calendario. Falta convertirlas en contenido constante y en una propuesta con evidencia, y probarla con una primera marca o activación.', 3],
      ['Etapa 3 · Listo para negociar', 'Tu proyecto ya habla el idioma de las marcas. El siguiente paso es negociar con datos, cumplir lo que prometes y medir para renovar.', 5]
    ];
    var OF = [
      [['Consultoría 1 a 1', '1 hora para ordenar tu punto de partida y salir con un plan escrito.', 'USD 35', '../servicios/#estrategia'], ['Perfil comercial y media kit', 'Tu trayectoria traducida a un documento que una marca puede evaluar.', 'A cotizar', '../servicios/#perfil']],
      [['Perfil comercial y media kit', 'Lo que ofreces, a quién y con qué evidencia, listo para presentar.', 'A cotizar', '../servicios/#perfil'], ['Sesión intensiva', '2 horas para definir narrativa, oferta y guion.', 'USD 70', '../servicios/#estrategia']],
      [['Gestión de comunicación digital', 'Estrategia, producción, publicación e informe, mes a mes.', 'Desde USD 260 al mes', '../servicios/#gestion'], ['Informe de resultados para auspiciantes', 'Exposición real de cada marca para renovar con datos.', 'Incluido en la gestión', '../servicios/#informe']]
    ];
    function lista(arr) { arr = arr.map(function (x) { return x.toLowerCase(); }); return arr.length < 2 ? arr.join('') : arr.slice(0, -1).join(', ') + ' y ' + arr[arr.length - 1]; }
    function lectura() {
      var r = calc(), ni = r.total >= 70 ? 2 : r.total >= 45 ? 1 : 0, E = ETAPAS[ni];
      var dep = uno('deporte').toLowerCase();
      var a = T.filter(function (t) { return t.k.some(function (k) { return dep.indexOf(k) > -1; }); })[0] || T[T.length - 1];
      var orden = Object.keys(r.D).sort(function (x, y) { return r.D[x] - r.D[y]; });
      var fuertes = orden.slice().reverse().filter(function (k) { return r.D[k] >= 60; }).slice(0, 3);
      var debiles = orden.filter(function (k) { return r.D[k] < 60; });
      if (uno('dossier') === 'No' && debiles.indexOf('Experiencia') > 0) { debiles.splice(debiles.indexOf('Experiencia'), 1); debiles.unshift('Experiencia'); }
      var prios = debiles.slice(0, 3).map(function (k) { return ACC[k]; });
      var plan = debiles.slice(0, 3).map(function (k) { return [ACC[k][0]].concat(PLAN[k]); });
      if (!prios.length) { prios = SOSTENER; plan = PLAN_S; }
      var quien = v('quien').filter(function (x) { return x !== 'No lo sé'; }), off = v('off').filter(function (x) { return x !== 'Ninguna' && x !== 'No lo sé'; });
      var capas = [
        ['Personal y narrativa', 'Tu historia y lo que representas', !!(v('valores').length || uno('logro'))],
        ['Social y comunitaria', 'La comunidad que te rodea, dentro y fuera de redes', !!(off.length || quien.length)],
        ['Temporal', 'Tus fechas de competencia como momentos de marca', !!(uno('comp') && uno('comp') !== 'No lo sé')],
        ['Constante', 'Tu presencia semana a semana, entre competencias', ['1 o 2 por semana', '3 o más por semana'].indexOf(uno('frec')) > -1]
      ];
      var R = [];
      if (uno('dossier') === 'No') R.push(['Sin perfil comercial', 'Si una marca se interesa hoy, no tiene qué evaluar.']);
      if (uno('ausp') === 'Sí, sin entregar resultados') R.push(['Auspicios sin informe', 'Si la marca no ve lo que recibió, la renovación queda en el aire.']);
      if (uno('tam') === 'No lo sé' || v('quien').indexOf('No lo sé') > -1 || uno('donde') === 'No lo sé') R.push(['No conoces a tu audiencia', 'Es lo primero que pregunta una marca y hoy no tendrías la respuesta.']);
      if (uno('frec') === 'Casi no publico') R.push(['Desapareces entre competencias', 'Una marca necesita presencia constante, no solo el día de la carrera.']);
      if (uno('cam') === 'Me cuesta') R.push(['Te cuesta hablar a cámara', 'Limita la vocería, que es lo que más piden las marcas.']);
      if (!v('valores').length) R.push(['Sin valores definidos', 'Sin algo que representes, es difícil diferenciarte de otros deportistas.']);
      if (!off.length) R.push(['Poca comunidad fuera de redes', 'Reduce las opciones de activaciones presenciales.']);
      R = R.slice(0, 3).map(function (x) { return [x[0], x[1], FIX[x[0]] || '']; });
      var LE = [], tam = uno('tam'), frec = uno('frec'), comp = uno('comp'), ausp = uno('ausp'), sinPerfil = uno('dossier') === 'No';
      var et = idx('etapa', ['En formación', 'Amateur competitivo', 'Profesional nacional', 'Internacional']), publica = ['1 o 2 por semana', '3 o más por semana'].indexOf(frec) > -1;
      if (tam === 'Menos de 1.000' || tam === '1.000 a 5.000') LE.push(['Una comunidad pequeña no te descarta', 'Con ' + tam.toLowerCase() + ' seguidores no ofreces alcance masivo: ofreces cercanía. Te conviene hablar con marcas locales o de tu disciplina y proponer acciones concretas (contenido, visitas, clínicas) antes que «exposición».']);
      if (tam === 'Más de 20.000' && sinPerfil) LE.push(['Tienes audiencia, pero no un documento que la presente', 'Es una de las brechas más fáciles de cerrar y, probablemente, la que más te está costando.']);
      else if (publica && sinPerfil) LE.push(['Generas valor que nadie puede evaluar', 'Publicas con constancia, pero no tienes un perfil comercial. El trabajo ya lo haces: falta ponerlo en un formato que una marca pueda leer.']);
      if (frec === 'Casi no publico' && (comp === '4 a 8' || comp === '9 o más')) LE.push(['Compites mucho y lo cuentas poco', 'Cada competencia que no se publica es un momento de marca que se pierde. Tu calendario ya te da el contenido.']);
      if (ausp === 'Nunca' && et >= 2) LE.push(['Compites alto y nunca has tenido un auspicio', 'Normalmente eso no habla de tu nivel deportivo, sino de que tu propuesta todavía no está escrita en el idioma de una marca.']);
      if (ausp === 'Sí, sin entregar resultados') LE.push(['Ya confiaron en ti una vez', 'Lo que falta es cerrar el ciclo: un informe convierte un apoyo puntual en una relación que se puede renovar.']);
      if (off.length >= 2) LE.push(['Tienes comunidad fuera de redes', 'Estás cerca de ' + lista(off.map(function (x) { return /^Otr[ao]$/.test(x) && uno('off_otro') ? uno('off_otro') : x; })) + '. Eso abre activaciones presenciales, que muchas marcas valoran más que una publicación.']);
      if (uno('donde') === 'Mi ciudad') LE.push(['Tu comunidad está en ' + (uno('ciudad') || 'tu ciudad'), 'Tu primera marca probablemente también. Los negocios locales suelen valorar la cercanía más que el número de seguidores.']);
      if (et === 0) LE.push(['Estás en formación', 'Hoy tu valor es de proyección. Te sirve más una marca que te acompañe en el proceso que una que busque resultados inmediatos.']);
      if (uno('alcance') === 'Internacional') LE.push(['Compites fuera del país', 'Eso le da a una marca una historia de representación que pocas propuestas pueden ofrecer.']);
      LE = LE.slice(0, 4); if (LE.length < 3) LE.push(dxBrecha(r.D, NOM));
      var sabeQuien = quien.length > 0, noSabeAud = tam === 'No lo sé' || v('quien').indexOf('No lo sé') > -1 || uno('donde') === 'No lo sé' || (!sabeQuien && !uno('tam'));
      var dondeV = { 'Mi ciudad': 'en ' + (uno('ciudad') || 'tu ciudad'), 'Varias ciudades': 'en varias ciudades', 'Mi país': 'en todo el país', 'Varios países': 'en varios países' }[uno('donde')] || '';
      var dep0 = uno('deporte').toLowerCase(), etapaT = uno('etapa').toLowerCase(), compOk = comp && comp !== 'No lo sé';
      var abre = 'Veo que compites en ' + dep0 + (etapaT ? ', a nivel ' + etapaT.replace('en formación', 'formativo') : '') + (compOk ? ', con ' + comp + ' competencias al año' : '') + '.';
      var dud = [];
      if (noSabeAud) dud.push('Pero no sé a qué público llegas. Sin eso no puedo saber si tu gente es la gente a la que yo le quiero hablar.');
      if (sinPerfil && !publica) dud.push('No sé cada cuánto te comunicas con tu audiencia ni tengo un documento donde verlo. La verdad, hoy no sabría cómo podríamos trabajar juntos.');
      else if (sinPerfil) dud.push('Veo que publicas, pero no tengo un documento que me diga qué me ofreces ni qué has logrado.');
      else if (frec === 'Casi no publico') dud.push('Casi no te veo en redes. Si te apoyo, ¿dónde aparece mi marca entre una competencia y otra?');
      if (sabeQuien && !noSabeAud && ausp !== 'Sí, con informe de resultados') dud.push('Sé que llegas a ' + lista(quien) + (dondeV ? ' ' + dondeV : '') + (compOk ? ' y que compites ' + comp + ' veces al año' : '') + ', pero todavía no entiendo qué ganaría mi marca más allá de un logo en tu uniforme.');
      if (ausp === 'Sí, sin entregar resultados') dud.push('Ya trabajaste con marcas, pero no veo qué recibieron. ¿Cómo sé qué voy a recibir yo?');
      if (uno('cam') === 'Me cuesta') dud.push('Y si necesito que hables de mi producto a cámara, no sé si te sentirías cómodo.');
      if ((tam === 'Menos de 1.000' || tam === '1.000 a 5.000') && dud.length < 3) dud.push('Tu comunidad es pequeña. No me molesta, pero entonces necesito saber qué tan cercana es y qué puedes hacer con ella.');
      var cierraV = ['Hoy, lo más probable es que te diga «déjame tu información» y no te vuelva a llamar. No es por tu nivel deportivo: es que no tengo cómo evaluarte.', 'Me interesas, pero necesito algo concreto para presentarlo dentro de mi empresa.', dud.length ? 'Tienes con qué. Resuelve eso y tráeme una propuesta con opciones.' : 'Sé a quién llegas, veo que publicas y que ya respondiste a otras marcas. Tráeme una propuesta con dos o tres opciones y cómo vamos a medir, y conversamos.'][ni];
      var voz = [abre].concat(dud.slice(0, 3), [cierraV]);
      var masDebil = orden[0], pasoM = METODO[E[2]];
      var porque = ['Tu puntaje te ubica en el paso <b>«' + pasoM + '»</b> del método Pro Motion, y tu variable más baja es <b>' + NOM[masDebil].toLowerCase() + '</b> (' + r.D[masDebil] + '/100). ' +
        (ni === 2 ? 'Ya estás en condiciones de sentarte con una marca. Lo que te falta no es más contenido: es respaldo. Un informe con evidencia te da seguridad para sostener lo que dices y pedir lo que corresponde.'
          : 'Seguramente quieres empezar a desarrollarte mejor en lo comercial, pero ' + (sinPerfil ? 'sin un perfil comercial' : 'sin una propuesta definida') + ' es muy difícil que una marca entienda el valor de lo que ofreces. Y una carpeta con tus logros no alcanza: hace falta una propuesta pensada desde tu personalidad, tu forma de competir y lo que de verdad puedes ofrecer, sean activaciones, experiencias u otras formas de conectar con tu audiencia.'), DX_AUD_P];
      var donde = { 'Mi ciudad': 'en tu ciudad', 'Varias ciudades': 'en varias ciudades', 'Mi país': 'en todo el país', 'Varios países': 'en varios países' }[uno('donde')] || '';
      var perd = [];
      if (quien.length) perd.push('Llegar a ' + lista(quien) + (donde ? ' ' + donde : '') + '.');
      if (uno('comp') && uno('comp') !== 'No lo sé') perd.push('Estar presente en ' + uno('comp') + ' competencias al año.');
      if (v('valores').length) perd.push('Contar una historia de ' + lista(v('valores').map(function (x) { return x === 'Otro' && uno('valores_otro') ? uno('valores_otro') : x; })) + '.');
      return { r: r, ni: ni, E: E, a: a, fuertes: fuertes, prios: prios, capas: capas, R: R, perd: perd, of: OF[ni], plan: plan, LE: LE, porque: porque, voz: voz };
    }
    function anilloDep(el, n) { if (!el) return; $('.fg', el).style.strokeDashoffset = 100 - n; $('b', el).textContent = n; }
    function resultado() {
      var L0 = lectura(), r = L0.r, a = L0.a, nivel = L0.E[0];
      var ul = function (arr) { return '<ul class="dx-l">' + arr.join('') + '</ul>'; };
      res.innerHTML = '<div class="dg-res dep-res">' +
        '<div class="dg-score"><div class="dx-ring grande"><svg viewBox="0 0 120 120" aria-hidden="true"><circle class="bg" cx="60" cy="60" r="52"/><circle class="fg" cx="60" cy="60" r="52" pathLength="100"/></svg><b>0</b><small>/100</small></div><div><span class="lbl">Estado actual · Deportista</span><h3>' + nivel + '</h3></div><img class="dx-res-esc" src="../assets/escenas/tool-diagnostico.webp" alt=""></div>' +
        '<p class="dx-estado">' + L0.E[1] + '</p>' +
        '<ol class="dep-metodo" aria-label="Tu punto en el método Pro Motion">' + METODO.map(function (m, i) { return '<li class="' + (i < L0.E[2] ? 'hecho' : i === L0.E[2] ? 'aqui' : '') + '">' + m + '</li>'; }).join('') + '</ol>' +
        '<div class="dg-dims">' + Object.keys(r.D).map(function (k) { return '<div class="dg-dim"><span>' + NOM[k] + '</span><i><em style="width:' + r.D[k] + '%"></em></i><b>' + r.D[k] + '</b></div>'; }).join('') + '</div>' +
        dxVoz(L0.ni, L0.voz) +
        '<div class="dx-perderia"><span class="lbl">¿Qué perdería una marca si no existieras?</span>' + (L0.perd.length ? '<p>Hoy perdería la posibilidad de:</p><ul class="dx-l">' + L0.perd.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>' : '<p>Todavía no hay una respuesta clara. Encontrarla es tu primer trabajo.</p>') + '</div>' +
        dxLee(L0.LE) +
        '<div class="dx-cuad">' +
          '<div class="dx-c dx-ok"><span class="lbl">Ventajas</span>' + (L0.fuertes.length ? ul(L0.fuertes.map(function (k) { return '<li><b>' + NOM[k] + '.</b> ' + FZ[k] + '</li>'; })) : '<p>Aún no hay una variable fuerte. Tu mejor punto de partida es <b>' + NOM[Object.keys(r.D).sort(function (x, y) { return r.D[y] - r.D[x]; })[0]].toLowerCase() + '</b>.</p>') + '</div>' +
          '<div class="dx-c"><span class="lbl">Oportunidades · ' + a.a + '</span><p>' + a.v + '</p><p><b>Industrias compatibles:</b> ' + a.o + '</p><p><b>Idea de activación:</b> ' + a.act + '</p></div>' +
          '<div class="dx-c dx-risk"><span class="lbl">Riesgos y conflictos</span>' + (L0.R.length ? ul(L0.R.map(function (x) { return '<li><b>' + x[0] + '.</b> ' + x[1] + (x[2] ? ' <span class="dx-fix"><b>Cómo se resuelve:</b> ' + x[2] + '</span>' : '') + '</li>'; })) : '<p>Con tus respuestas no vemos riesgos fuertes. El riesgo ahora es estancarte: mide y renueva.</p>') + '</div>' +
          '<div class="dx-c"><span class="lbl">Prioridades a 90 días</span><ol class="dx-l">' + L0.prios.map(function (p) { return '<li><b>' + p[0] + '.</b> ' + p[1] + ' <em class="dep-paso">' + p[2] + '</em></li>'; }).join('') + '</ol></div>' +
        '</div>' + dxPlan(L0.plan) +
        '<span class="lbl">Tus capas de valor</span><ul class="dep-capas">' + L0.capas.map(function (c) { return '<li class="' + (c[2] ? 'on' : '') + '"><b>' + c[0] + '</b><span>' + c[1] + '</span><em>' + (c[2] ? 'Activa' : 'Por desarrollar') + '</em></li>'; }).join('') + '</ul>' +
        dxSig(L0.porque, L0.of, true) +
        '<div class="dg-cta dx-aud"><span class="lbl">Dos caminos</span><h4>Tu diagnóstico está completo. ¿Qué sigue?</h4><p><b>Para ejecutar tu plan</b>, habla con un asesor de Pro Motion: revisamos tu diagnóstico contigo y definimos los primeros pasos. <b>Si quieres ir más a fondo</b>, la <b>Auditoría ProMatch</b> revisa tu contenido real y te entrega tu <b>Commercial Readiness Score</b> (8 categorías), el <b>Evidence Confidence Score</b>, tu nivel de <b>integración de marcas</b> del 0 al 5, tus <b>13 capacidades comerciales</b> y los <b>sectores compatibles</b>. Así no solo sabes en qué punto está tu proyecto comercial deportivo: ganas seguridad y tienes un informe que respalda lo que dices cuando hables con posibles auspiciantes.</p>' +
        '<div class="dx-aud-precio"><span class="dx-cupo">Lanzamiento · solo 10 proyectos</span><b>USD 60 <small>+ IVA</small></b><span>Precio por tiempo limitado para los primeros 10 proyectos que usen esta herramienta.</span></div>' +
        '<div class="dx-cta-btns"><button type="button" class="btn crema" data-carrito="auditoria-promatch"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.4 10.2a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.1L21 8H6.2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.4" fill="currentColor"/><circle cx="17" cy="20" r="1.4" fill="currentColor"/></svg>Quiero la Auditoría ProMatch completa</button><button type="button" class="btn rojo lg" data-dg-wa>Quiero ejecutar mi plan con un asesor <span class="chev">»</span></button></div>' +
        '<a class="dx-mas" href="../promatch/#como-funciona">Ver cómo funciona la Auditoría ProMatch »</a><a class="dx-mas dx-casos" href="../deportistas/#fichas">Quiero ver casos de deportistas con mejor puntaje »</a><button type="button" class="dg-atras" data-dg-otra>Volver a empezar</button></div>' +
        dxInc() + '<p class="dg-nota">Resultado orientativo, calculado solo con tus respuestas. No garantiza auspicios: mide qué tan preparada está tu propuesta comercial y qué le falta, no cuánto vale tu deporte ni tu trayectoria.</p></div>';
      setTimeout(function () { anilloDep($('.dx-ring', res), r.total); }, 250);
      var dimsDep = {}; Object.keys(r.D).forEach(function (k) { dimsDep[NOM[k]] = r.D[k]; });
      dxGate(res, { perfil: 'deportista', quien: 'deportista', total: r.total, nivel: nivel, dims: dimsDep, proyecto: uno('deporte'), ciudad: uno('ciudad'), respuestas: dxResp(diag),
        detalle: { estado: L0.E[1], arq: [a.a, a.v, a.o, a.act], ventajas: L0.fuertes.map(function (k) { return [NOM[k], FZ[k]]; }), riesgos: L0.R, prios: L0.prios.map(function (p) { return [p[0], p[1]]; }), oferta: [DX_AUD].concat(L0.of.map(function (o) { return ['Después, si hace falta: ' + o[0], o[1], o[2]]; })), lecturas: L0.LE, plan: L0.plan, porque: L0.porque.map(dxSinHtml), voz: L0.voz, etapa: L0.ni },
        resumen: 'Arquetipo: ' + a.a + '\nPrioridades: ' + L0.prios.map(function (p) { return p[0]; }).join('; ') + '\nRiesgos: ' + (L0.R.map(function (x) { return x[0]; }).join('; ') || 'sin riesgos fuertes') + '\nOferta: ' + L0.of.map(function (o) { return o[0]; }).join('; ') });
      $('[data-dg-wa]', res).onclick = function () {
        var L = function (t, x) { return x ? '\n• ' + t + ': ' + x : ''; };
        var msg = 'Hola Daniel, ' + (uno('nombre') ? 'soy ' + uno('nombre') + '. Hice' : 'hice') + ' el diagnóstico de Pro Motion como deportista y quiero ejecutar mi plan con un asesor.\n' +
          '\n*Estado actual*\n• ' + r.total + '/100 · ' + nivel + Object.keys(r.D).map(function (k) { return '\n• ' + NOM[k] + ': ' + r.D[k]; }).join('') + '\n• Arquetipo: ' + a.a +
          '\n\n*Capas de valor activas*\n' + (L0.capas.filter(function (c) { return c[2]; }).map(function (c) { return '• ' + c[0]; }).join('\n') || '• Ninguna todavía') +
          '\n\n*Riesgos*\n' + (L0.R.map(function (x) { return '• ' + x[0]; }).join('\n') || '• Sin riesgos fuertes') +
          '\n\n*Prioridades a 90 días*\n' + L0.prios.map(function (p, i) { return (i + 1) + '. ' + p[0]; }).join('\n') +
          '\n\n*Siguiente paso sugerido*\n• Auditoría ProMatch (USD 60 + IVA)\n' + L0.of.map(function (o) { return '• Después: ' + o[0] + ' (' + o[2] + ')'; }).join('\n') +
          '\n\n*Mi perfil*' + L('Disciplina', uno('deporte')) + L('Ciudad', uno('ciudad')) + L('Etapa', uno('etapa')) + L('Competencias al año', uno('comp')) + L('Alcance', uno('alcance')) + L('Logro reciente', uno('logro')) +
          '\n\n*Mi comunidad*' + L('Tamaño', uno('tam')) + L('Quiénes', conOtro('quien')) + L('Dónde', uno('donde')) + L('Red principal', uno('red')) + L('Publico', uno('frec')) + L('Fuera de redes', conOtro('off')) +
          '\n\n*Lo que ofrezco*' + L('Perfil comercial', uno('dossier')) + L('Auspicios', uno('ausp')) + L('Contenido', uno('prod')) + L('A cámara', uno('cam')) + L('Valores', conOtro('valores')) +
          '\n\n*Siguiente paso*\nQuiero conversar con un asesor para poner en marcha la oferta recomendada. Si conviene, también quiero saber más de la Auditoría ProMatch.';
        abrirWA(msg);
      };
      $('[data-dg-otra]', res).onclick = function () { diag.reset(); res.innerHTML = ''; paso = 1; $('.dg-nav', diag).hidden = false; $('.dg-top', diag).hidden = false; mostrar(); diag.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
      pasos.forEach(function (f) { f.hidden = true; }); $('.dg-nav', diag).hidden = true; $('.dg-top', diag).hidden = true;
      res.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    sig.addEventListener('click', function () {
      if (paso === 1 && (!uno('deporte') || !uno('etapa'))) { aviso.textContent = 'Escribe tu disciplina y elige tu etapa.'; return; }
      if (paso < 3) { paso++; mostrar(); diag.scrollIntoView({ behavior: 'smooth', block: 'start' }); } else resultado();
    });
    atras.addEventListener('click', function () { if (paso > 1) { paso--; mostrar(); } });
    diag.addEventListener('submit', function (e) { e.preventDefault(); });
    diag.addEventListener('input', function () { aviso.textContent = ''; });
    mostrar();
  })();

  /* ---------- Diagnóstico inicial: equipos, eventos y marcas ---------- */
  var dxd = $('#dx-data');
  if (dxd) (function () {
    var DATA = JSON.parse(dxd.textContent), AUD = JSON.parse($('#dx-auditoria').textContent);
    var AUD_TXT = AUD.replace(/<[^>]+>/g, '');
    function abrir(k, mover) {
      $$('.dx-op[data-dx]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.dx === k); });
      $$('.dx-form, .dx-dep').forEach(function (f) { f.hidden = f.dataset.perfil !== k; });
      var f = $('.dx-form[data-perfil="' + k + '"], .dx-dep[data-perfil="' + k + '"]');
      if (f && mover) f.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    $$('.dx-bur').forEach(function (b) { b.addEventListener('click', function () {
      $$('.dx-bur').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      $$('.dx-causa').forEach(function (c) { c.hidden = c.dataset.i !== b.dataset.i; c.classList.toggle('entra', !c.hidden); });
    }); });
    function anillo(el, n) { if (!el) return; $('.fg', el).style.strokeDashoffset = 100 - n; $('b', el).textContent = n; }
    $$('.dx-op[data-dx]').forEach(function (b) { b.addEventListener('click', function () { abrir(b.dataset.dx, true); history.replaceState(null, '', '#' + b.dataset.dx); }); });
    $$('.dx-form').forEach(function (form) {
      var P = DATA[form.dataset.perfil], paso = 1;
      var pasos = $$('.dg-paso', form), sig = $('.dg-sig', form), atras = $('.dg-atras', form), aviso = $('.dg-aviso', form), res = $('.diag-res', form);
      function v(n) { return new FormData(form).getAll(n).map(function (x) { return String(x).trim(); }).filter(Boolean); }
      function preguntas() { return P.pasos.reduce(function (a, p) { return a.concat(p.q); }, []); }
      function mostrar() {
        pasos.forEach(function (f) { f.hidden = +f.dataset.p !== paso; });
        $('.dg-paso-t b', form).textContent = paso;
        $('.dg-barra i', form).style.width = (paso / 3 * 100) + '%';
        atras.hidden = paso === 1;
        sig.innerHTML = paso < 3 ? 'Siguiente <span class="chev">»</span>' : 'Ver mi diagnóstico <span class="chev">»</span>';
        aviso.textContent = '';
        var tip = $('.dx-tip-g', form), T = JSON.parse(form.dataset.tips || '[]');
        if (tip && T[paso - 1]) { tip.textContent = T[paso - 1]; tip.classList.remove('nuevo'); void tip.offsetWidth; tip.classList.add('nuevo'); }
      }
      function vivo() {
        var r = calc();
        anillo($('.dx-lado .dx-ring', form), r.total);
        $$('.dx-vivo li', form).forEach(function (li) { var n = r.D[li.dataset.k]; $('em', li).style.width = n + '%'; li.classList.toggle('ok', n >= 55); });
      }
      form.addEventListener('change', vivo); form.addEventListener('input', vivo);
      function calc() {
        var D = {}, M = {};
        Object.keys(P.dims).forEach(function (k) { D[k] = 0; M[k] = 0; });
        preguntas().forEach(function (q) {
          if (q.tipo === 'text') {
            if (q.pts) Object.keys(q.pts).forEach(function (k) { M[k] += q.pts[k]; if (v(q.id).length) D[k] += q.pts[k]; });
            return;
          }
          var elegidos = v(q.id);
          // máximo posible: en radio la mejor opción; en casillas la suma
          var tope = {};
          q.o.forEach(function (o) { Object.keys(o.p).forEach(function (k) { tope[k] = q.tipo === 'radio' ? Math.max(tope[k] || 0, o.p[k]) : (tope[k] || 0) + o.p[k]; }); });
          Object.keys(tope).forEach(function (k) { M[k] += tope[k]; });
          q.o.forEach(function (o) { if (elegidos.indexOf(o.t) > -1) Object.keys(o.p).forEach(function (k) { D[k] += o.p[k]; }); });
        });
        var total = 0;
        Object.keys(D).forEach(function (k) { D[k] = M[k] ? Math.min(100, Math.round(D[k] / Math.min(M[k], 100) * 100)) : 0; total += D[k] * P.dims[k] / 100; });
        return { D: D, total: Math.round(total) };
      }
      function arquetipo() {
        return P.arq.filter(function (a) {
          if (!a.si) return true;
          return Object.keys(a.si).some(function (q) { return v(q).some(function (x) { return a.si[q].indexOf(x) > -1; }); });
        })[0];
      }
      function resultado() {
        var r = calc(), a = arquetipo(), ni = r.total >= 70 ? 2 : r.total >= 45 ? 1 : 0;
        var orden = Object.keys(r.D).sort(function (x, y) { return r.D[x] - r.D[y]; });
        var brechas = orden.filter(function (k) { return r.D[k] < 55; }).slice(0, 3);
        var fuertes = orden.slice().reverse().filter(function (k) { return r.D[k] >= 55; }).slice(0, 3);
        var riesgos = P.riesgos.filter(function (g) { return Object.keys(g.todas).every(function (q) { return v(q).some(function (x) { return g.todas[q].indexOf(x) > -1; }); }); }).slice(0, 3);
        var nivel = P.niveles[ni], oferta = P.oferta[ni], esMarca = form.dataset.perfil === 'marca';
        var cumple = function (g) { return Object.keys(g.todas).every(function (q) { return v(q).some(function (x) { return g.todas[q].indexOf(x) > -1; }); }); };
        var LE = P.lecturas.filter(cumple).slice(0, 4).map(function (g) { return [g.t, g.d]; }); if (LE.length < 3) LE.push(dxBrecha(r.D));
        var plan = brechas.map(function (k) { return [P.acc[k][0]].concat(P.plan[k]); });
        var porque = ['Tu puntaje te ubica en <b>«' + nivel + '»</b>, y tu dimensión más baja es <b>' + orden[0].toLowerCase() + '</b> (' + r.D[orden[0]] + '/100). ' + P.porque[ni]].concat(esMarca ? [] : [DX_AUD_PG]);
        var ofL = oferta.map(function (o) { return [o.n, o.d, o.r, o.h]; });
        var nomV = v('nombre')[0] || '', ciuV = v('ciudad')[0] || '';
        var voz = P.voz ? [(nomV ? 'Conozco ' + (form.dataset.perfil === 'equipo' ? 'a ' : '') + nomV + (ciuV && nomV.toLowerCase().indexOf(ciuV.toLowerCase()) < 0 ? ', de ' + ciuV : '') + '. ' : '') + P.voz.abre[ni]].concat(P.voz.dudas.filter(cumple).slice(0, 3).map(function (g) { return g.d; }), [P.voz.cierra[ni]]) : [];
        var nombre = v('nombre')[0] || '';
        var lista = function (arr) { return '<ul class="dx-l">' + arr.join('') + '</ul>'; };
        res.innerHTML = '<div class="dg-res">' +
          '<div class="dg-score"><div class="dx-ring grande"><svg viewBox="0 0 120 120" aria-hidden="true"><circle class="bg" cx="60" cy="60" r="52"/><circle class="fg" cx="60" cy="60" r="52" pathLength="100"/></svg><b>0</b><small>/100</small></div><div><span class="lbl">Estado actual · ' + P.n + '</span><h3>' + nivel + '</h3></div><img class="dx-res-esc" src="../assets/escenas/dx-' + form.dataset.perfil + '.webp" alt=""></div>' +
          '<p class="dx-estado">' + P.estado[ni] + '</p>' +
          '<div class="dg-dims">' + Object.keys(r.D).map(function (k) { return '<div class="dg-dim"><span>' + k + '</span><i><em style="width:' + r.D[k] + '%"></em></i><b>' + r.D[k] + '</b></div>'; }).join('') + '</div>' +
          dxVoz(ni, voz) + dxLee(LE) +
          '<div class="dx-cuad">' +
            '<div class="dx-c dx-ok"><span class="lbl">Ventajas</span>' + (fuertes.length ? lista(fuertes.map(function (k) { return '<li><b>' + k + '</b> ' + P.fz[k] + '</li>'; })) : '<p>Todavía no hay una dimensión fuerte. Tu mejor punto de partida es <b>' + orden[orden.length - 1].toLowerCase() + '</b>: ' + P.fz[orden[orden.length - 1]].charAt(0).toLowerCase() + P.fz[orden[orden.length - 1]].slice(1) + '</p>') + '</div>' +
            '<div class="dx-c"><span class="lbl">Oportunidades · ' + a.a + '</span><p>' + a.v + '</p><p><b>' + (form.dataset.perfil === 'marca' ? 'Lo que te conviene: ' : 'Industrias compatibles: ') + '</b>' + a.o.replace(/^Te conviene: /, '') + '</p><p><b>Idea de activación:</b> ' + a.act + '</p></div>' +
            '<div class="dx-c dx-risk"><span class="lbl">Riesgos y conflictos</span>' + lista((riesgos.length ? riesgos.map(function (g) { return '<li><b>' + g.t + '.</b> ' + g.d + (g.f ? ' <span class="dx-fix"><b>Cómo se resuelve:</b> ' + g.f + '</span>' : '') + '</li>'; }) : brechas.slice(0, 2).map(function (k) { return '<li><b>' + P.acc[k][0] + '.</b> ' + P.acc[k][1] + '</li>'; }))) + '</div>' +
            '<div class="dx-c"><span class="lbl">Prioridades a 90 días</span>' + (brechas.length ? '<ol class="dx-l">' + brechas.map(function (k) { return '<li><b>' + P.acc[k][0] + '.</b> ' + P.acc[k][1] + '</li>'; }).join('') + '</ol>' : '<p>Tus variables están en buen nivel. La prioridad ahora es medir cada acción y sostener lo que funciona.</p>') + '</div>' +
          '</div>' +
          dxPlan(plan) +
          dxSig(porque, ofL, !esMarca) +
          '<div class="dg-cta dx-aud"><span class="lbl">Dos caminos</span><h4>Tu diagnóstico está completo. ¿Qué sigue?</h4><p>' + AUD + '</p>' +
          '<div class="dx-aud-precio"><span class="dx-cupo">Lanzamiento · solo 10 proyectos</span><b>USD 60 <small>+ IVA</small></b><span>Precio por tiempo limitado para los primeros 10 proyectos que usen esta herramienta.</span></div>' +
          '<div class="dx-cta-btns">' + '<button type="button" class="btn crema" data-carrito="auditoria-promatch"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.4 10.2a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.1L21 8H6.2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.4" fill="currentColor"/><circle cx="17" cy="20" r="1.4" fill="currentColor"/></svg>Quiero la Auditoría ProMatch completa</button>' +
          '<button type="button" class="btn rojo lg" data-dx-wa>Quiero ejecutar mi plan con un asesor <span class="chev">»</span></button></div>' +
          '<a class="dx-mas" href="../promatch/#como-funciona">Ver cómo funciona la Auditoría ProMatch »</a>' +
          '<a class="dx-mas dx-casos" href="../deportistas/#fichas">Ver deportistas con un puntaje ProMatch alto »</a>' +
          '<button type="button" class="dg-atras" data-dx-otra>Volver a empezar</button></div>' +
          (esMarca ? '' : dxInc()) + '<p class="dg-nota">Resultado orientativo, calculado solo con tus respuestas. No garantiza auspicios: mide qué tan preparada está la propuesta comercial y qué le falta, no el valor del proyecto en sí.</p></div>';
        $('[data-dx-wa]', res).onclick = function () {
          var cont = v('contacto')[0];
          var msg = 'Hola Daniel, ' + (cont ? 'soy ' + cont + '. Hice' : 'hice') + ' el diagnóstico de Pro Motion como ' + P.quien + (nombre ? ' (' + nombre + ')' : '') + ' y quiero ejecutar mi plan con un asesor.\n' +
            '\n*Estado actual*\n• ' + r.total + '/100 · ' + nivel + Object.keys(r.D).map(function (k) { return '\n• ' + k + ': ' + r.D[k]; }).join('') +
            '\n• Arquetipo: ' + a.a +
            (fuertes.length ? '\n\n*Ventajas*\n' + fuertes.map(function (k) { return '• ' + k; }).join('\n') : '') +
            '\n\n*Riesgos*\n' + (riesgos.length ? riesgos.map(function (g) { return '• ' + g.t; }) : brechas.slice(0, 2).map(function (k) { return '• ' + P.acc[k][0]; })).join('\n') +
            '\n\n*Oferta recomendada*\n' + oferta.map(function (o) { return '• ' + o.n + ' (' + o.r + ')'; }).join('\n') +
            P.pasos.map(function (p) {
              var L = p.q.filter(function (q) { return q.id !== 'contacto' && v(q.id).length; }).map(function (q) { var o = v(q.id + '_otro')[0]; return '\n• ' + q.l.replace(/\?$/, '').replace(/^¿/, '') + ': ' + v(q.id).map(function (x) { return /^Otr[ao]$/.test(x) && o ? x + ': ' + o : x; }).join(', '); });
              return L.length ? '\n\n*' + p.t + '*' + L.join('') : '';
            }).join('') +
            '\n\n*Siguiente paso*\nQuiero conversar con un asesor para poner en marcha la oferta recomendada. Si conviene, también quiero saber más de la Auditoría ProMatch.';
          abrirWA(msg);
        };
        $('[data-dx-otra]', res).onclick = function () { form.reset(); form.classList.remove('dx-hecho'); res.innerHTML = ''; vivo(); paso = 1; $('.dg-nav', form).hidden = false; $('.dg-top', form).hidden = false; mostrar(); form.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
        form.classList.add('dx-hecho');
        setTimeout(function () { anillo($('.dg-res .dx-ring', res), r.total); }, 250);
        dxGate(res, { perfil: form.dataset.perfil, quien: P.quien, total: r.total, nivel: nivel, dims: r.D, proyecto: nombre, ciudad: (v('ciudad')[0] || ''), nombreSug: (v('contacto')[0] || '').split(',')[0], respuestas: dxResp(form),
          detalle: { estado: P.estado[ni], arq: [a.a, a.v, a.o.replace(/^Te conviene: /, ''), a.act || ''], ventajas: fuertes.map(function (k) { return [k, P.fz[k]]; }), riesgos: (riesgos.length ? riesgos.map(function (g) { return [g.t, g.d, g.f || '']; }) : brechas.slice(0, 2).map(function (k) { return [P.acc[k][0], P.acc[k][1]]; })), prios: brechas.map(function (k) { return [P.acc[k][0], P.acc[k][1]]; }), oferta: (esMarca ? [] : [DX_AUD]).concat(oferta.map(function (o) { return [(esMarca ? '' : 'Después, si hace falta: ') + o.n, o.d, o.r]; })), lecturas: LE, plan: plan, porque: porque.map(dxSinHtml), voz: voz, etapa: ni },
          resumen: 'Arquetipo: ' + a.a + '\nPrioridades: ' + brechas.map(function (k) { return P.acc[k][0]; }).join('; ') + '\nRiesgos: ' + (riesgos.map(function (g) { return g.t; }).join('; ') || 'sin riesgos fuertes') + '\nOferta: ' + oferta.map(function (o) { return o.n; }).join('; ') });
        pasos.forEach(function (f) { f.hidden = true; }); $('.dg-nav', form).hidden = true; $('.dg-top', form).hidden = true;
        res.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      sig.addEventListener('click', function () {
        var falta = P.pasos[paso - 1].q.filter(function (q) { return q.req && !v(q.id).length; });
        if (falta.length) { aviso.textContent = 'Completa: ' + falta.map(function (q) { return q.l.toLowerCase(); }).join(' y ') + '.'; return; }
        if (paso < 3) { paso++; mostrar(); form.scrollIntoView({ behavior: 'smooth', block: 'start' }); } else resultado();
      });
      atras.addEventListener('click', function () { if (paso > 1) { paso--; mostrar(); } });
      form.addEventListener('submit', function (e) { e.preventDefault(); });
      form.addEventListener('input', function () { aviso.textContent = ''; });
      mostrar(); vivo();
    });
    /* Enlaces directos por perfil (para campañas): #deportista, #equipo, #evento, #marca y sus alias */
    var ALIAS = { atleta: 'deportista', piloto: 'deportista', club: 'equipo', escuela: 'equipo', academia: 'equipo', organizador: 'evento', eventos: 'evento', marcas: 'marca', empresa: 'marca' };
    var ini = ((location.hash || '').slice(1) || new URLSearchParams(location.search).get('perfil') || '').toLowerCase();
    ini = ALIAS[ini] || ini;
    if (DATA[ini] || ini === 'deportista') { abrir(ini, false); setTimeout(function () { abrir(ini, true); }, 350); }
  })();

  /* ---------- Academy: constructor de pitch en 3 pasos ---------- */
  var pitch = $('#pitch-form');
  if (pitch) (function () {
    var paso = 1, pasos = $$('.dg-paso', pitch), sig = $('.dg-sig', pitch), atras = $('.dg-atras', pitch), aviso = $('.dg-aviso', pitch), res = $('.pitch-res', pitch);
    function v(n) { return new FormData(pitch).getAll(n).map(function (x) { return String(x).trim(); }).filter(Boolean); }
    function uno(n) { return v(n)[0] || ''; }
    function cap(x) { x = (x || '').trim(); return x ? x.charAt(0).toUpperCase() + x.slice(1) + (/[.!?]$/.test(x) ? '' : '.') : ''; }
    function lista(arr) { arr = arr.map(function (x) { return x.charAt(0).toLowerCase() + x.slice(1); }); return arr.length < 2 ? arr.join('') : arr.slice(0, -1).join(', ') + ' y ' + arr[arr.length - 1]; }
    $$('input[name="pvalores"]', pitch).forEach(function (c) { c.addEventListener('change', function () { if (v('pvalores').length > 3) c.checked = false; }); });
    var pista = $('.pt-pista', pitch);
    $$('input[name="industria"]', pitch).forEach(function (c) { c.addEventListener('change', function () { pista.innerHTML = 'Lo que suele comprar esta industria: <b>' + c.dataset.compra + '</b>.'; }); });
    function mostrar() {
      pasos.forEach(function (f) { f.hidden = +f.dataset.p !== paso; });
      $('.dg-paso-t b', pitch).textContent = paso; $('.dg-barra i', pitch).style.width = (paso / 3 * 100) + '%';
      atras.hidden = paso === 1; aviso.textContent = '';
      sig.innerHTML = paso < 3 ? 'Siguiente <span class="chev">»</span>' : 'Construir mi pitch <span class="chev">»</span>';
    }
    function resultado() {
      var nom = uno('nombre'), dep = uno('deporte'), ciu = uno('ciudad'), marca = uno('marca'), ind = uno('industria');
      var compra = (pitch.querySelector('input[name="industria"]:checked') || {}).dataset ? pitch.querySelector('input[name="industria"]:checked').dataset.compra : '';
      var nec = v('necesita'), of = v('ofrece'), val = v('pvalores'), dato = uno('dato'), cifra = uno('cifra');
      var prueba = cifra ? (dato === 'Resultado deportivo' ? cifra : cifra + ' ' + (dato || '').toLowerCase()) : '';
      var a = marca ? 'el equipo de ' + marca : 'su equipo';
      var m1 = 'Hola' + (marca ? ', equipo de ' + marca : '') + '. Soy ' + nom + ', ' + dep + (ciu ? ' de ' + ciu : '') + '.\n\n' +
        'Sé que en ' + ind.toLowerCase() + ' buscan ' + (compra || 'conectar con su cliente') + (nec.length ? ', y que hoy necesitan ' + lista(nec) : '') + '. ' +
        'Tengo una propuesta concreta para lograrlo' + (prueba ? ', con ' + prueba : '') + ' y una comunidad que confía en mí.\n\n¿Podemos agendar 15 minutos esta semana?';
      var m2 = '1. Quién soy (10 s): ' + nom + ', ' + dep + '.' + (uno('logro') ? ' ' + cap(uno('logro')) : '') + '\n' +
        '2. Lo que su marca necesita (10 s): ' + (nec.length ? lista(nec) : 'conectar con ' + (uno('cliente') || 'su cliente')) + (uno('cliente') ? ', hablándole a ' + uno('cliente') : '') + '.\n' +
        '3. Mi propuesta (20 s): ' + (of.length ? lista(of) : 'una alianza con entregables medibles') + '.\n' +
        '4. La prueba (10 s): ' + (prueba ? cap(prueba) + ' ' : '') + cap(uno('valor')) + (val.length ? ' Comparto sus valores: ' + lista(val) + '.' : '') + '\n' +
        '5. Cierre (10 s): ¿Qué objetivo tiene su marca este trimestre en el que yo pueda ser parte de la solución?';
      var m3 = 'Propuesta de alianza: ' + nom + (marca ? ' × ' + marca : '') + '\n' +
        '• Quién soy y mi trayectoria\n• Lo que ' + (marca || 'la marca') + ' necesita' + (nec.length ? ': ' + lista(nec) : '') + '\n• Mi comunidad y mis datos' + (prueba ? ': ' + prueba : '') + '\n• Lo que propongo: ' + (of.length ? lista(of) : '[tu propuesta]') + '\n• Cómo lo vamos a medir y el informe al cierre\n• Próximo paso y fecha';
      var texto = [uno('logro'), uno('valor'), uno('cliente')].join(' ');
      var C = [
        ['Sin «apoyo», «ayuda» ni «sueño»', !/\b(apoyo|apoyen|ayuda|ay[uú]dame|sueño|sueños)\b/i.test(texto), 'Cambia esas palabras por lo que gana la marca.'],
        ['Hablas de lo que necesita la marca', nec.length > 0, 'Elige al menos una necesidad de la marca en el paso 2.'],
        ['Incluyes un número', /\d/.test(cifra), 'Agrega tu dato fuerte con una cifra real.'],
        ['Propones algo concreto', of.length > 0, 'Elige qué le ofreces en el paso 3.'],
        ['Está dirigido a una marca real', !!marca, 'Escribe el nombre de la marca: un pitch genérico se nota.']
      ];
      var ok = C.filter(function (c) { return c[1]; }).length, fuerza = ok * 20;
      var piezas = [['Primer mensaje', m1], ['Guion de 60 segundos', m2], ['Estructura de tu propuesta', m3]];
      var uso = uno('uso'); if (uso === 'Primer mensaje') piezas = [piezas[0], piezas[2]]; else if (uso === 'Una reunión') piezas = [piezas[1], piezas[2]];
      res.innerHTML = '<div class="dg-res">' +
        '<div class="dg-score"><div class="dg-num"><b>' + fuerza + '</b><span>/100</span></div><div><span class="lbl">Fuerza de tu pitch</span><h3>' + (fuerza >= 80 ? 'Listo para enviar' : fuerza >= 60 ? 'Casi listo' : 'Hay que reforzarlo') + '</h3></div></div>' +
        '<ul class="pt-checks">' + C.map(function (c) { return '<li class="' + (c[1] ? 'ok' : 'no') + '"><b>' + (c[1] ? '✓' : '✗') + '</b><span>' + c[0] + (c[1] ? '' : '<small>' + c[2] + '</small>') + '</span></li>'; }).join('') + '</ul>' +
        piezas.map(function (pz, i) { return '<div class="pt-pieza"><div class="pt-pieza-c"><span class="lbl">' + pz[0] + '</span><button type="button" class="pt-copiar" data-i="' + i + '">Copiar</button></div><pre>' + esc(pz[1]) + '</pre></div>'; }).join('') +
        '<div class="dg-cta"><h4>Esto es un borrador</h4><p>Revisemos tu pitch juntos y adaptémoslo a la marca real que quieres conquistar.</p><button type="button" class="btn rojo lg" data-pt-wa>Enviar mi pitch por WhatsApp <span class="chev">»</span></button><button type="button" class="dg-atras" data-pt-otra>Volver a empezar</button></div></div>';
      $$('.pt-copiar', res).forEach(function (b) { b.onclick = function () { navigator.clipboard && navigator.clipboard.writeText(piezas[+b.dataset.i][1]); b.textContent = 'Copiado ✓'; }; });
      $('[data-pt-wa]', res).onclick = function () {
        abrirWA('Hola Daniel, soy ' + nom + ' (' + dep + (ciu ? ', ' + ciu : '') + '). Armé mi pitch en Pro Academy y quiero revisarlo contigo.\n' +
          '\nMarca objetivo: ' + (marca || 'por definir') + ' · ' + ind + (nec.length ? '\nLo que necesita: ' + lista(nec) : '') + (uno('cliente') ? '\nSu cliente: ' + uno('cliente') : '') +
          (of.length ? '\nLo que propongo: ' + lista(of) : '') + (prueba ? '\nMi dato fuerte: ' + prueba : '') + (val.length ? '\nMis valores: ' + lista(val) : '') +
          '\nFuerza del pitch: ' + fuerza + '/100\n\n' + piezas.map(function (pz) { return '— ' + pz[0] + ' —\n' + pz[1]; }).join('\n\n'));
      };
      $('[data-pt-otra]', res).onclick = function () { pitch.reset(); res.innerHTML = ''; paso = 1; $('.dg-nav', pitch).hidden = false; $('.dg-top', pitch).hidden = false; pista.textContent = ''; mostrar(); pitch.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
      pasos.forEach(function (f) { f.hidden = true; }); $('.dg-nav', pitch).hidden = true; $('.dg-top', pitch).hidden = true;
      res.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    sig.addEventListener('click', function () {
      if (paso === 1 && (!uno('nombre') || !uno('deporte'))) { aviso.textContent = 'Escribe tu nombre y tu disciplina.'; return; }
      if (paso === 2 && (!uno('industria') || !v('necesita').length)) { aviso.textContent = 'Elige la industria y lo que necesita la marca.'; return; }
      if (paso === 3 && !v('ofrece').length) { aviso.textContent = 'Elige qué le ofreces.'; return; }
      if (paso < 3) { paso++; mostrar(); pitch.scrollIntoView({ behavior: 'smooth', block: 'start' }); } else resultado();
    });
    atras.addEventListener('click', function () { if (paso > 1) { paso--; mostrar(); } });
    pitch.addEventListener('submit', function (e) { e.preventDefault(); });
    pitch.addEventListener('input', function () { aviso.textContent = ''; });
    mostrar();
  })();

  /* ---------- Academy: juego "La mesa" — el jabalí reacciona a lo que escribes ---------- */
  var sim = $('#simulador-panel');
  if (sim) (function () {
    var R = JSON.parse($('#simulador-data').textContent), k = 0, pts = 0, interes = 30, faltas = [], reloj = null, seg = 25, ocupado = false;
    var escena = $('.mj-esc', sim), img = $('.mj-jab img', sim), gEl = $('.mj-globo.el', sim), gTu = $('.mj-globo.tu', sim), dep = $('.mj-dep', sim);
    var emote = $('.mj-emote', sim), ptsEl = $('.mj-pts', sim), barra = $('.mj-barra i', sim), ronda = $('.mj-ronda b', sim);
    var arco = $('.mj-reloj .arco', sim), relojEl = $('.mj-reloj', sim), relojN = $('.mj-reloj b', sim);
    var ctrl = $('.mj-ctrl', sim), form = $('.mj-form', sim), txt = $('#mj-txt'), enviar = $('.mj-enviar', sim), cartas = $('.mj-cartas', sim), fb = $('.mj-fb', sim), cont = $('.mj-cont', sim);
    var base = sim.dataset.img, pj = '', depImg = $('.mj-dep img', sim);
    function estado(e) {
      if (!pj) return;
      depImg.src = base + 'mj_' + pj + '_' + e + '.webp?v=1';
      depImg.classList.remove('cambia'); void depImg.offsetWidth; depImg.classList.add('cambia');
      sim.setAttribute('data-pjest', e);
    }
    var GESTOS = { espera: 'boar_crossed', bien: 'boar_magnify', duda: 'boar_confused', mal: 'boar_walk', vete: 'boar_walk', trato: 'handshake' };
    var REACC = {
      bien: ['Mmm… eso sí me interesa. Sigue.', 'Ok, ahora estás hablando de mi negocio.', 'Interesante. Cuéntame más.', 'Eso no me lo había ofrecido nadie esta semana.'],
      duda: ['Mmm… no me convence del todo.', 'Eso ya lo escuché esta semana.', 'Ajá… ¿y eso a mí en qué me ayuda?', 'Puede ser… pero no me dijiste nada nuevo.'],
      mal: ['Tengo otra reunión en cinco minutos…', 'Creo que estamos perdiendo el tiempo.', 'Bueno… cualquier cosa te escribo.', 'Esto suena a pedido, no a negocio.']
    };
    var EMOTE = { bien: '!', duda: '?', mal: '…' };

    // Qué busca el gerente en cada objeción (orden fijo de las 4 objeciones)
    var EXTRA = [
      ['Le diste una razón propia', /\b(zona|ciudad|cuenca|quito|guayaquil|comunidad|unico|diferente|nadie mas|exclusiv)/],
      ['Moviste la charla a su presupuesto de marketing', /\b(marketing|trimestre|campana|activar|activacion|lanzamiento|presupuesto de)/],
      ['Cambiaste seguidores por audiencia útil', /\b(alcance|audiencia|zona|interaccion|engagement|calendario|competencias|carreras|vistas|reproducciones|%|por ciento)/],
      ['Aseguraste la siguiente reunión', /\b(reunion|presento|presentar|presentacion|lunes|martes|miercoles|jueves|viernes|minutos|quien decide|quien mas decide|objetivo)/]
    ];
    var CRIT = [
      { t: 'Hablaste de su negocio', p: 8, re: /\b(cliente|clientes|tu marca|su marca|marca|ventas|vender|consumidor|mercado|producto|negocio|objetivo|publico|audiencia|comunidad|target)/ },
      { t: 'Diste datos concretos', p: 7, re: /(\d|%|\bmil\b|por ciento)/ },
      { t: 'Propusiste algo concreto', p: 7, re: /\b(activacion|contenido|evento|experiencia|serie|video|propuesta|plan|calendario|presencia|medir|medicion|resultado|reporte|retorno|alcance|campana)/ }
    ];
    var MALOS = [
      { t: 'Sonó a pedido de ayuda', p: -12, re: /\b(apoyo|apoyar|apoyarme|ayuda|ayudar|ayudarme|aporte|por favor|porfa|necesito|regalar|regalen|donar|donacion|sueno|auspiciame|patrociname)/ },
      { t: 'Te vendiste barato', p: -8, re: /\b(cualquier|lo que sea|lo que puedan|poquito|algo es algo)/ },
      { t: 'Hablaste solo de ti', p: -4, re: /\b(entreno|campeon|medalla|esfuerzo|sacrificio|mis logros|gane|trofeo)/ }
    ];
    function norm(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
    function evaluar(t, i) {
      var n = norm(t), p = 0, chips = [], palabras = n.split(/\s+/).filter(Boolean).length;
      CRIT.forEach(function (c) { if (c.re.test(n)) { p += c.p; chips.push([c.t, 1]); } });
      if (EXTRA[i][1].test(n)) { p += 11; chips.push([EXTRA[i][0], 1]); }
      MALOS.forEach(function (c) {
        if (c.re.test(n) && !(c.p === -4 && chips.length > 1)) { p += c.p; chips.push([c.t, 0]); }
      });
      if (palabras < 6) { p -= 6; chips.push(['Respuesta muy corta', 0]); }
      if (!chips.some(function (c) { return c[1]; })) chips.push(['No le diste una razón de negocio', 0]);
      return { p: Math.max(0, Math.min(25, p)), chips: chips };
    }

    // ---- Réplicas del jabalí según lo que escribió el deportista ----
    var CIUDADES = { cuenca: 'Cuenca', quito: 'Quito', guayaquil: 'Guayaquil', ambato: 'Ambato', loja: 'Loja', manta: 'Manta', machala: 'Machala', riobamba: 'Riobamba', ibarra: 'Ibarra', azogues: 'Azogues', latacunga: 'Latacunga', esmeraldas: 'Esmeraldas', portoviejo: 'Portoviejo', 'santo domingo': 'Santo Domingo', salinas: 'Salinas', gualaceo: 'Gualaceo', paute: 'Paute', canar: 'Cañar', imbabura: 'Imbabura', galapagos: 'Galápagos', ecuador: 'Ecuador' };
    var REDES = { instagram: 'Instagram', tiktok: 'TikTok', 'tik tok': 'TikTok', facebook: 'Facebook', youtube: 'YouTube', strava: 'Strava', twitter: 'X', linkedin: 'LinkedIn' };
    var DIAS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];
    function elige(arr, k) { return arr[(k + arr.length) % arr.length]; }
    function contexto(t) {
      var n = norm(t), c = { n: n };
      var cifra = t.match(/\d[\d.,]*\s*(mil|k|millones|m\b)?/i);
      if (cifra) c.cifra = cifra[0].trim().replace(/\s+/g, ' ');
      var pct = t.match(/\d+[.,]?\d*\s*%/); if (pct) c.pct = pct[0].replace(/\s/g, '');
      c.redes = Object.keys(REDES).filter(function (r) { return n.indexOf(r) >= 0; }).map(function (r) { return REDES[r]; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
      Object.keys(CIUDADES).some(function (x) { if (new RegExp('\\b' + x + '\\b').test(n)) { c.ciudad = CIUDADES[x]; return true; } });
      DIAS.some(function (d) { if (n.indexOf(d) >= 0) { c.dia = d.replace('miercoles', 'miércoles'); return true; } });
      var logro = n.match(/\b(subcampeon|campeon|medalla|podio|titulo|record|gane|primer lugar)/);
      if (logro) c.logro = { subcampeon: 'tu subcampeonato', campeon: 'tu título de campeón', medalla: 'tus medallas', podio: 'tus podios', titulo: 'tus títulos', record: 'tu récord', gane: 'lo que ganaste', 'primer lugar': 'ese primer lugar' }[logro[1]];
      var act = n.match(/\b(activacion(es)?|evento[s]?|clinica[s]?|serie|reto[s]?|carrera[s]? con|experiencia[s]?|concurso[s]?|sorteo[s]?|video[s]?|contenido[s]?|campana[s]?)\b/); if (act) c.act = act[0];
      c.pide = /\b(apoyo|apoyar|apoyarme|ayuda|ayudar|ayudarme|por favor|porfa|necesito|regal|donar|donacion)/.test(n);
      c.barato = /\b(cualquier|lo que sea|lo que puedan|poquito|algo es algo)/.test(n);
      c.seguidores = /\b(seguidores|followers|seguidor|me siguen|redes|cuentas?)\b/.test(n) || (c.redes.length > 0 && !!c.cifra);
      c.calidad = /\b(zona|ciudad|audiencia|clientes?|compran|edad|entre \d|mujeres|hombres|interaccion|engagement|alcance|vistas|reproducciones)\b/.test(n) || !!c.pct || !!c.ciudad;
      c.comunidad = /\b(comunidad|club|grupo|familias|escuela|barrio|corredores|ciclistas|deportistas)\b/.test(n);
      c.marketing = /\b(marketing|trimestre|campana|lanzamiento|activar marca|presupuesto de)/.test(n);
      c.despues = /\b(proximo ano|el otro ano|mas adelante|despues|cuando tengan)\b/.test(n);
      c.envio = /\b(te la envio|te lo envio|te envio|la mando|te mando|esta semana|por correo|ok|perfecto|dale)\b/.test(n);
      c.pregunta = t.indexOf('?') >= 0;
      c.reunion = !!c.dia || /\b(reunion|presento|presentar|presentacion|llamada|minutos|quien (mas )?decide|objetivo)\b/.test(n);
      c.corta = n.split(/\s+/).filter(Boolean).length < 6;
      return c;
    }
    function replica(t, tipo, k) {
      var c = contexto(t), redes = c.redes.join(' y '), op = [];
      // Primero lo que más le molesta a un gerente
      if (c.pide) op.push(['mal', '¿Apoyo? Yo no manejo un fondo de ayuda, manejo metas de ventas. ¿Qué gana mi marca con esto?', 'Todos los que se sientan ahí me piden ayuda. Yo necesito que alguien me ayude a vender.']);
      if (c.barato) op.push(['mal', 'Si tú mismo dices “cualquier aporte”, ¿cuánto crees que vale lo que me ofreces?', '“Lo que puedan”… así no se negocia. Ponle un valor a lo que traes.']);
      if (k === 1 && c.despues) op.push(['mal', '¿El próximo año? Entonces ya te despediste de este.', 'Si me dices “más adelante”, yo escucho “nunca”.']);
      if (k === 3 && c.envio && !c.reunion) op.push(['duda', 'Perfecto… la reviso cuando tenga un espacio. (Spoiler: casi nunca tengo espacio.)', 'Ok, mándala al correo. Ya tengo nueve propuestas esperando ahí.']);
      if (c.seguidores && c.cifra && !c.calidad) op.push(['duda', '¿' + c.cifra + (redes ? ' en ' + redes : ' seguidores') + '? Seguidores tiene cualquiera. ¿Cuántos de ellos le compran a mi marca?', c.cifra + (redes ? ' en ' + redes : '') + ', ok… pero el influencer de la otra mesa tiene el triple. ¿Qué tienes tú que él no?']);
      if (c.seguidores && !c.cifra && !c.calidad) op.push(['duda', '“Muchos seguidores” no es un dato. ¿Cuántos, de dónde son y qué compran?', 'Las redes las tiene todo el mundo. Dame un número que me sirva.']);
      if (c.logro && !c.calidad && !c.act) op.push(['duda', 'Felicitaciones por ' + c.logro + '. Pero las otras nueve solicitudes también traen medallas.', 'Lo de ' + c.logro + ' habla de ti. Yo necesito saber qué hace por mi marca.']);
      if (c.corta) op.push(['duda', '¿Eso es todo? Con eso no convenzo ni a mi jefe ni a nadie.', 'Muy corto. Dame algo con lo que yo pueda defenderte en la reunión de gerencia.']);
      // Lo que le interesa
      if (c.seguidores && c.calidad) op.push(['bien', (c.cifra ? c.cifra + (redes ? ' en ' + redes : '') + ' y ' : 'Y ') + (c.pct ? 'el ' + c.pct + ' en mi zona… ' : 'además gente que me sirve… ') + 'eso ya es otra conversación.', 'Ok, no me hablaste de seguidores, me hablaste de clientes. Sigue.']);
      if (c.ciudad) op.push(['bien', c.ciudad + '… justo es una plaza donde queremos crecer este año. ¿Cómo llegarías a esa gente?', '¿Tu gente está en ' + c.ciudad + '? Ahí sí tengo puntos de venta. Te escucho.']);
      if (c.pct && !c.seguidores) op.push(['bien', 'Me gustan los números. ¿Ese ' + c.pct + ' lo puedes respaldar con un reporte?', c.pct + '… ok, eso ya lo puedo poner en una presentación.']);
      if (k === 1 && c.marketing) op.push(['bien', 'Si lo planteas como campaña de marketing y no como auspicio, ahí sí tengo de dónde mover presupuesto.', 'Ok, del rubro de auspicios no hay nada… pero de marketing sí. Sigue.']);
      var ACT = { activacion: 'una activación', evento: 'un evento', clinica: 'una clínica', serie: 'una serie', reto: 'un reto', experiencia: 'una experiencia', concurso: 'un concurso', sorteo: 'un sorteo', video: 'un video', contenido: 'contenido', campana: 'una campaña' };
      var actTxt = c.act ? (ACT[c.act.replace(/(es|s)$/, '').replace(/ con$/, '')] || 'esa idea') : '';
      if (c.act) op.push(['bien', '¿' + actTxt.charAt(0).toUpperCase() + actTxt.slice(1) + '? Eso me interesa. ¿Qué haríamos exactamente y cómo lo mido?', 'Una propuesta concreta, por fin. Cuéntame cómo medimos si funcionó.']);
      if (c.comunidad) op.push(['bien', 'Una comunidad que te sigue de verdad vale más que mil likes. ¿Cuánta gente mueves?', 'Eso de tu comunidad me interesa. ¿Los podemos convertir en clientes?']);
      if (c.reunion) op.push(['bien', (c.dia ? '¿El ' + c.dia + '? ' : '') + 'Está bien, pero trae los números y quince minutos, no más.', 'Me gusta que ya pienses en el siguiente paso. Agéndalo con mi asistente.']);
      if (c.pregunta) op.push(['bien', 'Me haces preguntas a mí. Casi nadie lo hace, y eso me gusta.', 'Buena pregunta. Eso significa que quieres entender mi negocio.']);
      // Elegir la réplica que coincide con la reacción del jabalí; si no hay, la más cercana
      var pref = tipo === 'duda' ? ['duda', 'mal', 'bien'] : tipo === 'mal' ? ['mal', 'duda'] : ['bien'];
      for (var i = 0; i < pref.length; i++) {
        var hit = op.filter(function (o) { return o[0] === pref[i]; })[0];
        if (hit) return hit[1 + (k % 2)];
      }
      return REACC[tipo][k % 4];
    }

    function tipea(el, t, cb) {
      var i = 0; el.hidden = false; el.textContent = ''; el.classList.remove('mj-pop'); void el.offsetWidth; el.classList.add('mj-pop');
      (function paso() { el.textContent = t.slice(0, ++i); if (i < t.length) setTimeout(paso, t.length > 90 ? 14 : 24); else if (cb) setTimeout(cb, 250); })();
    }
    function pensando() { gTu.classList.add('viejo'); gEl.hidden = false; gEl.innerHTML = '<span class="puntos"><i></i><i></i><i></i></span>'; gEl.classList.remove('mj-pop'); void gEl.offsetWidth; gEl.classList.add('mj-pop'); }
    function gesto(g) {
      img.classList.remove('entra'); void img.offsetWidth;
      img.src = base + GESTOS[g] + '.webp?v=1'; img.classList.add('entra');
      sim.setAttribute('data-gesto', g);
    }
    function emo(c, color) { emote.textContent = c; emote.style.color = color || ''; emote.classList.remove('on'); void emote.offsetWidth; emote.classList.add('on'); }
    function flota(v) { ptsEl.textContent = (v > 0 ? '+' : '') + v; ptsEl.style.color = v > 0 ? '#2f8f45' : 'var(--rojo)'; ptsEl.classList.remove('on'); void ptsEl.offsetWidth; ptsEl.classList.add('on'); }
    function setInteres(v) { interes = Math.max(0, Math.min(100, v)); barra.style.width = interes + '%'; sim.setAttribute('data-int', interes >= 60 ? 'alto' : 'bajo'); }
    function bloquear(b) { txt.disabled = b; enviar.disabled = b; $('.mj-cartas-btn', sim).disabled = b; }
    function paraReloj() { clearInterval(reloj); relojEl.classList.remove('urge'); }
    function arrancaReloj() {
      paraReloj(); seg = 25; relojN.textContent = seg; arco.style.strokeDashoffset = 0;
      reloj = setInterval(function () {
        seg--; relojN.textContent = seg; arco.style.strokeDashoffset = 97.4 * (1 - seg / 25);
        relojEl.classList.toggle('urge', seg <= 7);
        if (seg <= 0) { paraReloj(); responder('', null, true); }
      }, 1000);
    }

    function pregunta() {
      if (k >= R.length || interes <= 0) return fin();
      var r = R[k]; ocupado = false;
      ronda.textContent = k + 1; fb.hidden = true; cartas.hidden = true; gTu.hidden = true;
      txt.value = ''; cont.textContent = '0/280';
      gesto(k ? 'duda' : 'espera'); estado('base');
      tipea(gEl, r.q.replace(/[“”]/g, ''), function () { bloquear(false); txt.focus({ preventScroll: true }); arrancaReloj(); });
    }

    function responder(t, carta, silencio) {
      if (ocupado) return; ocupado = true; paraReloj(); bloquear(true); cartas.hidden = true;
      var r = R[k], res;
      if (silencio) { res = { p: 0, chips: [['Te quedaste en silencio', 0]] }; t = '…'; }
      else if (carta) { res = { p: carta[1], chips: [[carta[2], carta[1] >= 20 ? 1 : 0]] }; t = carta[0]; }
      else res = evaluar(t, k);
      estado(silencio ? 'mal' : 'idea');
      dep.classList.remove('habla'); void dep.offsetWidth; dep.classList.add('habla');
      gEl.hidden = true; gTu.classList.remove('viejo');
      tipea(gTu, t, function () {
        pensando();
        setTimeout(function () {
          var tipo = res.p >= 18 ? 'bien' : res.p >= 10 ? 'duda' : 'mal';
          pts += res.p;
          var delta = tipo === 'bien' ? 22 : tipo === 'duda' ? -4 : -20;
          setInteres(interes + delta);
          gesto(tipo); estado(tipo === 'bien' ? 'bien' : tipo === 'mal' ? 'mal' : 'base'); emo(EMOTE[tipo], tipo === 'bien' ? '#2f8f45' : tipo === 'mal' ? 'var(--negro)' : 'var(--rojo)'); flota(res.p);
          if (tipo === 'mal') { escena.classList.remove('sacude'); void escena.offsetWidth; escena.classList.add('sacude'); }
          if (silencio) tipea(gEl, '¿Hola? Mi tiempo también vale.');
          else { var rep = replica(t, tipo, k); tipea(gEl, interes <= 0 ? rep + ' Mejor lo dejamos aquí.' : rep); }
          var mejor = r.o.filter(function (x) { return x[1] >= 20; })[0][0];
          if (res.p < 18) faltas.push(mejor);
          var ult = k >= R.length - 1 || interes <= 0;
          fb.innerHTML = '<div class="mj-chips">' + res.chips.map(function (c) { return '<span class="' + (c[1] ? '' : 'no') + '">' + (c[1] ? '✔ ' : '✘ ') + esc(c[0]) + '</span>'; }).join('') + '</div>'
            + (res.p < 18 ? '<p><b>Una respuesta que funciona:</b> “' + esc(mejor) + '”</p>' : '<p><b>+' + res.p + ' puntos.</b> Así se responde a esa objeción.</p>')
            + '<button class="btn crema mj-sig" type="button">' + (ult ? 'Ver cómo terminó la reunión' : 'Siguiente objeción') + ' <span class="chev">»</span></button>';
          fb.hidden = false;
          $('.mj-sig', fb).onclick = function () { k++; pregunta(); };
        }, 1100);
      });
    }

    function fin() {
      paraReloj(); bloquear(true); fb.hidden = true; cartas.hidden = true; ctrl.hidden = true;
      var nota = Math.round(pts / (R.length * 25) * 100), salio = interes <= 0;
      var v, frase;
      if (salio) { gesto('vete'); estado('mal'); frase = 'Gracias por venir. Te escribimos.'; v = 'El gerente se levantó antes de terminar. Ninguna marca compra un pedido de ayuda: compra una razón de negocio.'; }
      else if (nota >= 80) { gesto('trato'); estado('bien'); frase = '¿Te parece el jueves a las diez? Trae los números.'; v = 'Saliste con una segunda reunión agendada. Así empiezan los auspicios de verdad.'; }
      else if (nota >= 50) { gesto('duda'); estado('base'); frase = 'Envíame la propuesta por correo y la reviso…'; v = 'Te dijeron “envíame una propuesta y la reviso”. Ya sabes lo que significa.'; }
      else { gesto('mal'); estado('mal'); frase = 'Bueno… cualquier cosa te escribo.'; v = 'La reunión terminó sin un siguiente paso.'; }
      gTu.hidden = true; tipea(gEl, frase);
      setTimeout(function () {
        var d = document.createElement('div'); d.className = 'mj-final';
        d.innerHTML = '<span class="mj-tag">Cercanía al cierre</span><h3>' + nota + '<small>/100</small></h3><p>' + v + '</p>'
          + (faltas.length ? '<p class="falta"><b>La frase que te faltó:</b><br>“' + esc(faltas[0]) + '”</p>' : '')
          + '<div class="btns"><button class="btn crema" type="button" data-otra>Jugar otra vez</button><button class="btn rojo" type="button" data-wa2>Entrenar con Pro Motion <span class="chev">»</span></button></div>';
        escena.appendChild(d);
        $('[data-otra]', d).onclick = function () { d.remove(); ctrl.hidden = false; k = 0; pts = 0; faltas = []; setInteres(30); pregunta(); };
        $('[data-wa2]', d).onclick = function () { abrirWA('Hola Daniel, jugué el simulador de negociación de Pro Academy y saqué ' + nota + '/100. Quiero preparar mi reunión con una marca.'); };
      }, salio ? 2200 : 1800);
    }

    form.onsubmit = function (e) {
      e.preventDefault();
      var t = txt.value.trim();
      if (t.split(/\s+/).filter(Boolean).length < 2) { txt.focus(); txt.placeholder = 'Escribe al menos una frase…'; return; }
      txt.value = ''; cont.textContent = '0/280';
      responder(t);
    };
    txt.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit ? form.requestSubmit() : form.onsubmit(e); } });
    txt.addEventListener('input', function () { cont.textContent = txt.value.length + '/280'; });
    $('.mj-cartas-btn', sim).onclick = function () {
      var r = R[k], o = r.o.slice();
      for (var a = o.length - 1; a > 0; a--) { var j = Math.floor(Math.random() * (a + 1)), x = o[a]; o[a] = o[j]; o[j] = x; }
      cartas.innerHTML = o.map(function (c, i) { return '<button type="button" data-i="' + i + '">' + esc(c[0]) + '</button>'; }).join('');
      cartas.hidden = false;
      $$('button', cartas).forEach(function (b) { b.onclick = function () { responder(null, o[+b.dataset.i]); }; });
    };
    $$('.mj-pj', sim).forEach(function (b) {
      b.onclick = function () {
        pj = b.dataset.pj;
        $$('.mj-pj', sim).forEach(function (x) { x.classList.toggle('on', x === b); });
        $('.sim-empezar', sim).disabled = false;
        ['base', 'idea', 'bien', 'mal'].forEach(function (e) { new Image().src = base + 'mj_' + pj + '_' + e + '.webp?v=1'; });
        estado('base');
      };
    });
    $('.sim-empezar', sim).onclick = function () {
      if (!pj) return; $('.mj-inicio', sim).remove(); ctrl.hidden = false; bloquear(true); setInteres(30); pregunta(); };
  })();

  /* ---------- Academy: plan de contenido en 3 pasos ---------- */
  var plan = $('#plan-form');
  if (plan) (function () {
    var paso = 1, pasos = $$('.dg-paso', plan), sig = $('.dg-sig', plan), atras = $('.dg-atras', plan), aviso = $('.dg-aviso', plan), res = $('.plan-res', plan);
    function v(n) { return new FormData(plan).getAll(n).map(function (x) { return String(x).trim(); }).filter(Boolean); }
    function uno(n) { return v(n)[0] || ''; }
    // [narrativa, temas de cada semana, semana de la pieza estrella, idea concreta de cada semana, gancho de cada semana]
    var M = {
      'Una lesión': ['No es lo que pasó, es lo que hiciste después.', ['El golpe', 'La recuperación', 'El regreso', 'La competencia'], 1,
        ['qué pasó ese día y qué sentiste', 'una sesión de fisioterapia y lo que aprendiste de tu cuerpo', 'tu primer entrenamiento completo después de la lesión', 'llegar a la carrera después de todo lo vivido'],
        ['«Esto no lo había contado…»', '«Lo más difícil no fue el dolor»', '«Hoy volví a sentirme deportista»', '«Llegué. Y no llegué solo»']],
      'Una derrota': ['Perder también es parte del camino.', ['Lo que dolió', 'Lo que aprendí', 'Los ajustes', 'La revancha'], 1,
        ['el momento exacto en que se te escapó el resultado', 'las tres lecciones que te dejó esa carrera', 'qué cambiaste en tu preparación desde entonces', 'la previa de la revancha'],
        ['«No terminó como quería»', '«Lo que aprendí perdiendo»', '«Cambié esto en mi preparación»', '«Esta vez es distinto»']],
      'Una victoria': ['Ganar es el comienzo de la historia, no el final.', ['El momento', 'Detrás del triunfo', 'Quienes lo hicieron posible', 'Lo que viene'], 1,
        ['los segundos más intensos de la victoria, en primera persona', 'los meses de trabajo que nadie vio', 'las personas y marcas que estuvieron detrás', 'tu próximo objetivo y por qué'],
        ['«Así se vivió desde adentro»', '«Esto pasó antes del podio»', '«Nada de esto lo hice solo»', '«Esto recién empieza»']],
      'Cambio de equipo': ['Nuevo capítulo, misma hambre.', ['La despedida', 'La llegada', 'El nuevo equipo', 'El debut'], 2,
        ['lo que te llevas de tu equipo anterior', 'tu primer día en el nuevo equipo', 'quiénes son tus nuevos compañeros y cómo trabajan', 'la previa de tu debut'],
        ['«Gracias por todo»', '«Primer día»', '«Les presento a mi equipo»', '«Debut»']],
      'Nuevo auspiciante': ['Una alianza con sentido, no un logo más.', ['El anuncio', 'Por qué ellos', 'La alianza en acción', 'Juntos en competencia'], 2,
        ['el anuncio de la alianza, contado como historia', 'qué valores compartes con la marca', 'el producto o servicio en tu día a día real', 'la marca presente en tu competencia'],
        ['«Tengo algo que contarles»', '«Por qué elegí trabajar con ellos»', '«Así lo uso de verdad»', '«Juntos en la pista»']],
      'Vuelvo tras una pausa': ['Volver también es ganar.', ['Por qué me fui', 'El regreso a entrenar', 'Lo que cambió', 'De vuelta en competencia'], 1,
        ['por qué te alejaste, con honestidad', 'tu primer entrenamiento de regreso', 'qué haces distinto ahora', 'la previa de tu vuelta a competir'],
        ['«Me alejé un tiempo»', '«Volví a entrenar»', '«Ahora lo hago distinto»', '«Estoy de vuelta»']],
      'Preparación normal': ['La rutina también es historia.', ['Un día conmigo', 'El detalle que nadie ve', 'Mi equipo', 'La competencia'], 1,
        ['un día completo de entrenamiento, de principio a fin', 'el detalle técnico que más te cuesta y cómo lo trabajas', 'las personas que te acompañan en el proceso', 'la previa y la carrera'],
        ['«Un día normal… o no tanto»', '«Lo que nadie ve»', '«Mi equipo»', '«Faltan días. Así llego»']]
    };
    function idea(fmt, ide, comp) {
      return {
        'Hablar a cámara': 'Reel de 30–45 s mirando a cámara: ' + ide + '.',
        'Video sin hablar': 'Reel sin voz, con texto en pantalla y música: ' + ide + '.',
        'Fotos o carrusel': 'Carrusel de 5 láminas: ' + ide + ', con una idea por lámina y una pregunta al final.',
        'Historias del día a día': 'Historias del día: ' + ide + ', con encuesta o caja de preguntas.',
        'En vivo': 'En vivo de 10 minutos: ' + ide + (comp ? ', rumbo a ' + comp : '') + ', respondiendo preguntas.'
      }[fmt];
    }
    var ACTIVO = {
      'Que me conozcan más': ['Visibilidad', 'Identidad', 'Comunidad', 'Visibilidad'],
      'Mostrarle valor a mi auspiciante': ['Credibilidad', 'Integración de marca', 'Evidencia para la marca', 'Visibilidad para la marca'],
      'Conseguir un auspiciante nuevo': ['Narrativa', 'Credibilidad', 'Audiencia demostrable', 'Caso para presentar a marcas'],
      'Conectar con mi comunidad': ['Cercanía', 'Confianza', 'Participación', 'Comunidad en vivo']
    };
    function mostrar() {
      pasos.forEach(function (f) { f.hidden = +f.dataset.p !== paso; });
      $('.dg-paso-t b', plan).textContent = paso; $('.dg-barra i', plan).style.width = (paso / 3 * 100) + '%';
      atras.hidden = paso === 1; aviso.textContent = '';
      sig.innerHTML = paso < 3 ? 'Siguiente <span class="chev">»</span>' : 'Crear mi plan <span class="chev">»</span>';
    }
    function fechaTxt(f) { if (!f) return ''; var d = new Date(f + 'T12:00:00'); return isNaN(d) ? '' : d.toLocaleDateString('es-EC', { day: 'numeric', month: 'long' }); }
    var BANCO = JSON.parse(($('#ideas-data') || { textContent: '[]' }).textContent), semilla = 0;
    var FMT = { 'Hablar a cámara': 'cam', 'Video sin hablar': 'sinvoz', 'Fotos o carrusel': 'carr', 'Historias del día a día': 'hist', 'En vivo': 'vivo' };
    var FMT_N = { cam: 'Reel hablando a cámara', sinvoz: 'Reel sin voz, con texto', carr: 'Carrusel', hist: 'Historias', vivo: 'En vivo' };
    var PROP_N = { alcance: 'Alcance', conexion: 'Conexión', marca: 'Valor para tu marca' };
    var FAM = { motor: /rally|kart|gt|auto|moto|piloto|f4|enduro|circuito|drift/, resistencia: /cicl|bici|run|corr|trail|marat|triat|nata|ironman|marcha|mtb|downhill/, equipo: /fút|fut|básq|basq|vóley|voley|rugby|hockey|handball/, precision: /tenis|pádel|padel|golf|tiro|ajedrez|esgrima|box|judo|taekwon|arquer|bádm|badm/ };
    function rnd(i) { var x = Math.sin((i + 1) * 9301 + semilla * 49297) * 233280; return x - Math.floor(x); }
    function relleno(t, ctx) { return t.replace(/\{(\w+)\}/g, function (_, k) { return ctx[k] || ''; }); }
    function resultado() {
      var mom = uno('momento'), m = M[mom], dep = uno('deporte'), comp = uno('competencia'), desc = uno('paso'), obj = uno('objetivo');
      var fmts = v('formatos').map(function (f) { return FMT[f]; }), n = { '1–2 por semana': 2, '3–4 por semana': 3, '5 o más por semana': 4 }[uno('frec')] || 2;
      var fecha = fechaTxt(uno('fecha')), eq = uno('equipo'), act = ACTIVO[obj] || ACTIVO['Que me conozcan más'];
      var nivelEq = { 'Solo mi celular': 0, 'Alguien que me graba': 1, 'Equipo profesional': 2 }[eq] || 0;
      var sutil = uno('animo') === 'Prefiero algo sutil', empieza = uno('animo') === 'No sé por dónde empezar', estilo = uno('estilo');
      var tieneAus = uno('ausp') === 'Sí' || mom === 'Nuevo auspiciante', marca = uno('marca') || 'mi auspiciante';
      var fam = Object.keys(FAM).filter(function (k) { return FAM[k].test(dep.toLowerCase()); })[0] || 'otros';
      var dias = ''; if (uno('fecha')) { var dd = Math.round((new Date(uno('fecha') + 'T12:00:00') - new Date()) / 864e5); dias = dd > 1 ? dd + ' días' : 'horas'; }
      var ctx = { dep: dep || 'mi deporte', comp: comp || 'mi próxima competencia', dias: dias || 'pocos días', marca: marca, momento: (mom || '').replace(/^Una? /, '').toLowerCase() };
      var PIL = ['reto', 'proceso', 'prueba', 'prueba'];
      var OBJ = { 'Que me conozcan más': 'alcance', 'Mostrarle valor a mi auspiciante': 'marca', 'Conseguir un auspiciante nuevo': 'marca', 'Conectar con mi comunidad': 'conexion' }[obj];
      function puntua(it, w) {
        if (it.aus && !tieneAus) return -1;
        if (it.fam !== '*' && it.fam.indexOf(fam) < 0) return -1;
        var f = it.f.filter(function (x) { return fmts.indexOf(x) > -1; })[0]; if (!f) return -1;
        var sc = 0;
        if (it.w && it.w.indexOf(w) < 0) return -1;
        if (it.m !== '*' && it.m.indexOf(mom) < 0) return -1;
        sc += it.m === '*' ? 1 : 4;
        sc += it.p === PIL[w] ? 3 : 0;
        sc += it.o === OBJ ? 2 : 0;
        if (it.e >= 4 && nivelEq === 0) sc -= 3;
        if (sutil && (f === 'vivo' || f === 'cam')) sc -= 2;
        if (empieza && it.e <= 2) sc += 1.5;
        if (estilo && it.est && it.est.indexOf(estilo) > -1) sc += 1.5;
        if (w === 3 && it.w && it.w.indexOf(3) > -1) sc += 2.5;
        if (w === 3 && comp && /^Cobertura en tiempo real/.test(it.t)) sc += 8;
        return sc + rnd(BANCO.indexOf(it) + w * 37) * 2.2;
      }
      var usadas = {}, ultimoMolde = '';
      var semanas = m[1].map(function (tema, w) {
        var cand = BANCO.map(function (it) { return [it, puntua(it, w)]; }).filter(function (x) { return x[1] >= 0 && !usadas[x[0].t]; }).sort(function (a, b) { return b[1] - a[1]; });
        var piezas = [], alta = false;
        for (var i = 0; i < cand.length && piezas.length < n; i++) {
          var it = cand[i][0];
          if (it.e >= 4 && alta) continue;
          if (it.g[0] === ultimoMolde && cand.length > n + 2) continue;
          var f = it.f.filter(function (x) { return fmts.indexOf(x) > -1; })[0];
          usadas[it.t] = 1; ultimoMolde = it.g[0]; if (it.e >= 4) alta = true;
          piezas.push({ t: relleno(it.t, ctx), f: FMT_N[f], e: it.e, o: PROP_N[it.o], g: relleno(it.g[1], ctx), molde: it.g[0], c: it.c, sc: cand[i][1] });
        }
        return { t: 'Semana ' + (w + 1) + ' · ' + tema + (w === 3 && fecha ? ' (' + fecha + ')' : ''), a: act[w], p: piezas };
      });
      var todas = [].concat.apply([], semanas.map(function (s) { return s.p; })), estrella = todas.slice().sort(function (a, b) { return b.sc - a.sc; })[0];
      var nota = eq === 'Solo mi celular' ? 'Todo se puede grabar con celular: luz natural, cámara a la altura de los ojos y audio cerca.' : eq === 'Equipo profesional' ? 'Con equipo profesional, reserva una jornada para grabar las piezas de dos semanas.' : 'Pídele a quien te graba tomas de proceso, no solo de resultado.';
      var pts = function (e) { return '●●●●●'.slice(0, e) + '○○○○○'.slice(0, 5 - e); };
      var txt = 'Mi narrativa: ' + m[0] + '\n\n' + semanas.map(function (s) { return s.t + ' (activo: ' + s.a + ')\n' + s.p.map(function (p) { return '• ' + p.t + ' — ' + p.f + '. Gancho: «' + p.g + '». ' + p.c; }).join('\n'); }).join('\n\n');
      res.innerHTML = '<div class="dg-res">' +
        '<div class="dg-score pl-narr"><div><span class="lbl">Tu narrativa</span><h3>' + esc(m[0]) + '</h3></div></div>' +
        (estrella ? '<div class="pl-estrella"><span class="lbl">★ Pieza estrella</span><b>' + esc(estrella.t) + '</b><p>' + esc(estrella.f) + ' · Gancho: «' + esc(estrella.g) + '»</p><p>' + esc(estrella.c) + '</p></div>' : '') +
        '<div class="pl-semanas">' + semanas.map(function (s) { return '<div class="pl-sem"><div class="pl-sem-c"><b>' + esc(s.t) + '</b><span>' + esc(s.a) + '</span></div><ul>' + s.p.map(function (p) {
          return '<li><div class="pl-idea"><b>' + esc(p.t) + '</b><span class="pl-meta">' + esc(p.f) + ' · <i title="Esfuerzo de producción">' + pts(p.e) + '</i> · ' + esc(p.o) + '</span></div><p class="pl-g">«' + esc(p.g) + '» <small>' + esc(p.molde) + '</small></p><p class="pl-c">' + esc(p.c) + '</p></li>'; }).join('') + '</ul></div>'; }).join('') + '</div>' +
        '<p class="pl-nota">' + esc(nota) + ' Los puntos (●) indican el esfuerzo de producción: combinamos piezas ligeras con una más elaborada por semana para que sostengas la constancia.</p>' +
        '<div class="pl-acc"><button type="button" class="pt-copiar" data-pl-otra-idea>↻ Generar otras ideas</button><button type="button" class="pt-copiar" data-pl-copiar>Copiar mi plan</button></div>' +
        '<div class="dg-cta"><h4>Esto es un plan preliminar</h4><p>Es una propuesta tentativa. Una estrategia de comunicación continua, pensada para tus objetivos, tu periodo de competencia, tu disciplina, tu personalidad y lo que tu perfil necesita para ti y para tus auspiciantes, se construye en conjunto con el equipo de Pro Motion.</p><button type="button" class="btn rojo lg" data-pl-wa>Desarrollar mi estrategia con Pro Motion <span class="chev">»</span></button><button type="button" class="dg-atras" data-pl-otra>Volver a empezar</button></div></div>';
      $('[data-pl-otra-idea]', res).onclick = function () { semilla++; resultado(); };
      $('[data-pl-copiar]', res).onclick = function (e) { navigator.clipboard && navigator.clipboard.writeText(txt); e.target.textContent = 'Copiado ✓'; };
      $('[data-pl-wa]', res).onclick = function () {
        abrirWA('Hola Daniel, ' + (uno('nombre') ? 'soy ' + uno('nombre') + '. ' : '') + 'Armé un plan preliminar de contenido en Pro Academy y quiero desarrollar mi estrategia de comunicación con ustedes.\n' +
          '\nDisciplina: ' + dep + (comp ? '\nPróxima competencia: ' + comp + (fecha ? ' (' + fecha + ')' : '') : '') + '\nMomento: ' + mom + (desc ? ' — ' + desc : '') +
          (uno('animo') ? '\nCómo me siento: ' + uno('animo') : '') + (estilo ? '\nMi estilo: ' + estilo : '') + (uno('red') ? '\nRed: ' + uno('red') : '') + (uno('frec') ? '\nPuedo publicar: ' + uno('frec') : '') +
          (eq ? '\nCuento con: ' + eq : '') + '\nFormatos: ' + v('formatos').join(', ') + '\nObjetivo: ' + obj + (uno('ausp') ? '\nAuspiciantes hoy: ' + uno('ausp') + (uno('marca') ? ' (' + uno('marca') + ')' : '') : '') + '\n\n' + txt);
      };
      $('[data-pl-otra]', res).onclick = function () { plan.reset(); res.innerHTML = ''; paso = 1; semilla = 0; $('.dg-nav', plan).hidden = false; $('.dg-top', plan).hidden = false; mostrar(); plan.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
      pasos.forEach(function (f) { f.hidden = true; }); $('.dg-nav', plan).hidden = true; $('.dg-top', plan).hidden = true;
      if (!semilla) res.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    sig.addEventListener('click', function () {
      if (paso === 1 && (!uno('deporte') || !uno('momento'))) { aviso.textContent = 'Escribe tu disciplina y elige qué pasó.'; return; }
      if (paso === 2 && !v('formatos').length) { aviso.textContent = 'Elige al menos un formato.'; return; }
      if (paso === 3 && !uno('objetivo')) { aviso.textContent = 'Elige para qué quieres contarlo.'; return; }
      if (paso < 3) { paso++; mostrar(); plan.scrollIntoView({ behavior: 'smooth', block: 'start' }); } else resultado();
    });
    atras.addEventListener('click', function () { if (paso > 1) { paso--; mostrar(); } });
    plan.addEventListener('submit', function (e) { e.preventDefault(); });
    plan.addEventListener('input', function () { aviso.textContent = ''; });
    mostrar();
  })();
})();
/* Audiencia interactiva: dona de género, columnas de edad, mapa de países y ciudades */
(function () {
  'use strict';
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  $$('[data-aud-gen]').forEach(function (g) {
    var v = g.querySelector('[data-dc-v]'), n = g.querySelector('[data-dc-n]'), bs = $$('.aud-ley button', g);
    function sel(k) {
      g.setAttribute('data-sel', k);
      bs.forEach(function (b) { var on = b.dataset.g === k; b.classList.toggle('on', on); if (on) { v.textContent = b.dataset.v; n.textContent = b.dataset.n; } });
    }
    bs.forEach(function (b) { b.addEventListener('click', function () { sel(b.dataset.g); }); });
    $$('.d-seg', g).forEach(function (s) { s.addEventListener('click', function () { sel(s.getAttribute('data-g')); }); });
  });

  $$('[data-aud-edad]').forEach(function (c) {
    var cols = $$('.col', c), modo = 't';
    function pintar() {
      var mx = 0;
      cols.forEach(function (k) { mx = Math.max(mx, parseFloat(k.dataset[modo].replace(',', '.'))); });
      cols.forEach(function (k) {
        var s = k.querySelectorAll('.col-b i'), u = s[0], f = s[1], m = s[2], ht = +k.dataset.ht;
        if (modo === 't') { u.style.height = (ht - k.dataset.hm - k.dataset.hf) + '%'; f.style.height = k.dataset.hf + '%'; m.style.height = k.dataset.hm + '%'; }
        else { var p = parseFloat(k.dataset[modo].replace(',', '.')) / mx * 100; u.style.height = '0%'; (modo === 'm' ? f : m).style.height = '0%'; (modo === 'm' ? m : f).style.height = p + '%'; }
        k.querySelector('.col-v').textContent = k.dataset[modo] + ' %';
        k.classList.toggle('top', parseFloat(k.dataset[modo].replace(',', '.')) === mx);
      });
    }
    $$('.aud-tg button', c).forEach(function (b) {
      b.addEventListener('click', function () { modo = b.dataset.f; $$('.aud-tg button', c).forEach(function (x) { x.classList.toggle('on', x === b); }); pintar(); });
    });
    cols.forEach(function (k) { k.addEventListener('click', function () { cols.forEach(function (x) { x.style.opacity = x === k ? '' : '.55'; }); }); });
    var hecho = false;
    function arrancar() { if (!hecho) { hecho = true; pintar(); } }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { arrancar(); io.disconnect(); } }, { threshold: .3 });
      io.observe(c);
    } else arrancar();
  });

  function bandera(iso) { return iso.replace(/./g, function (ch) { return String.fromCodePoint(127397 + ch.charCodeAt(0)); }); }
  $$('[data-aud-mapa]').forEach(function (c) {
    var mapa = c.querySelector('.mapa'), info = c.querySelector('.mapa-info'), pz = $$('.pz', c), bs = $$('.aud-top button', c);
    function sel(iso) {
      var p = pz.filter(function (x) { return x.getAttribute('data-p') === iso; })[0];
      if (!p) return;
      mapa.classList.add('foco');
      pz.forEach(function (x) { x.classList.toggle('sel', x === p); });
      bs.forEach(function (b) { b.classList.toggle('on', b.dataset.p === iso); });
      info.innerHTML = '<span class="fl">' + bandera(iso) + '</span><b>' + p.getAttribute('data-n') + '</b><em>' + p.getAttribute('data-v') + ' %</em>';
    }
    pz.forEach(function (p) {
      p.addEventListener('click', function () { sel(p.getAttribute('data-p')); });
      p.addEventListener('mouseenter', function () { sel(p.getAttribute('data-p')); });
    });
    bs.forEach(function (b) { b.addEventListener('click', function () { sel(b.dataset.p); }); b.addEventListener('mouseenter', function () { sel(b.dataset.p); }); });
  });

  $$('[data-aud-ciu]').forEach(function (c) {
    var pins = $$('.pin', c), bs = $$('.aud-top button', c);
    function sel(i) {
      pins.forEach(function (p) { p.classList.toggle('on', p.getAttribute('data-c') === i); });
      bs.forEach(function (b) { b.classList.toggle('on', b.dataset.c === i); });
    }
    pins.forEach(function (p) { p.addEventListener('click', function () { sel(p.getAttribute('data-c')); }); p.addEventListener('mouseenter', function () { sel(p.getAttribute('data-c')); }); });
    bs.forEach(function (b) { b.addEventListener('click', function () { sel(b.dataset.c); }); b.addEventListener('mouseenter', function () { sel(b.dataset.c); }); });
  });
})();
/* Burbuja anclada a un punto de la foto (respeta el recorte de object-fit:cover) */
(function () {
  'use strict';
  var b = document.querySelector('.nos-burbuja[data-ancla]');
  if (!b) return;
  var hero = b.parentElement, img = hero.querySelector('img'), a = b.dataset.ancla.split(',').map(Number);
  function ubicar() {
    if (!img.naturalWidth) return;
    var hr = hero.getBoundingClientRect(), ir = img.getBoundingClientRect(), cs = getComputedStyle(img);
    var iw = img.offsetWidth, ih = img.offsetHeight, s = Math.max(iw / img.naturalWidth, ih / img.naturalHeight);
    var pos = cs.objectPosition.split(' ').map(function (v) { return parseFloat(v) / 100; });
    var rw = img.naturalWidth * s, rh = img.naturalHeight * s;
    var x = img.offsetLeft + (iw - rw) * pos[0] + rw * a[0];
    var y = img.offsetTop + (ih - rh) * pos[1] + rh * a[1];
    var izq = Math.max(10, x - 30);
    b.style.setProperty('--bx', izq + 'px');
    b.style.setProperty('--by', y + 'px');
    b.style.setProperty('--cola', Math.max(18, x - izq) + 'px');
  }
  if (img.complete) ubicar(); else img.addEventListener('load', ubicar);
  window.addEventListener('resize', ubicar);
})();
/* Test: ¿qué tipo de deportista eres? */
(function () {
  'use strict';
  var caja = document.querySelector('[data-tdt]'), dataEl = document.getElementById('tdt-data');
  if (!caja || !dataEl) return;
  var D = JSON.parse(dataEl.textContent), T = D.tipos, P = D.test, elenco = document.querySelector('.tdt-elenco');
  var resp = [], i = 0, orden = [];
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function art(n) { return n.replace(/^El /, 'el ').replace(/^La /, 'la '); }
  function mezclar(a) { a = a.slice(); for (var k = a.length - 1; k > 0; k--) { var j = Math.floor(Math.random() * (k + 1)), x = a[k]; a[k] = a[j]; a[j] = x; } return a; }
  function pregunta() {
    var q = P[i], ops = orden[i] || (orden[i] = mezclar(q[1]));
    caja.innerHTML = '<div class="tdt-paso"><div class="tdt-top"><span class="tdt-num">Pregunta ' + (i + 1) + ' de ' + P.length + '</span><span class="tdt-barra"><i style="width:' + (i / P.length * 100) + '%"></i></span></div>' +
      '<h3 class="tdt-q">' + esc(q[0]) + '</h3><div class="tdt-ops">' +
      ops.map(function (o, k) { return '<button type="button" class="tdt-op' + (resp[i] === o[1] ? ' sel' : '') + '" data-t="' + o[1] + '"><b>' + 'ABCDEF'[k] + '</b>' + esc(o[0]) + '</button>'; }).join('') +
      '</div>' + (i ? '<button type="button" class="tdt-atras">‹ Pregunta anterior</button>' : '') + '</div>';
    caja.querySelectorAll('.tdt-op').forEach(function (b) {
      b.addEventListener('click', function () {
        b.classList.add('sel'); resp[i] = b.dataset.t;
        setTimeout(function () { i++; if (i < P.length) pregunta(); else resultado(); }, 280);
      });
    });
    var at = caja.querySelector('.tdt-atras'); if (at) at.addEventListener('click', function () { i--; pregunta(); });
  }
  function resultado() {
    // Hoy: el tipo más votado en las 5 primeras preguntas (en empate, gana la respuesta más reciente)
    var pts = {}; resp.slice(0, P.length - 1).forEach(function (t, k) { pts[t] = (pts[t] || 0) + 1 + k * 0.01; });
    var hoy = Object.keys(pts).sort(function (a, b) { return pts[b] - pts[a]; })[0];
    // Meta: la última pregunta (lo que quieres que digan de ti); si eligió al perezoso, el tipo activo más votado
    var meta = resp[P.length - 1];
    if (meta === 'perezoso') { var activos = Object.keys(pts).filter(function (t) { return t !== 'perezoso'; }).sort(function (a, b) { return pts[b] - pts[a]; }); meta = activos[0] || 'zorro'; }
    var h = T[hoy], m = T[meta], igual = hoy === meta;
    caja.innerHTML = '<div class="tdt-paso tdt-res"><div class="tdt-fig"><img src="' + h.img + '" alt="' + esc(h.n) + '"></div><div>' +
      '<div class="tdt-num">Hoy eres</div><h3>' + esc(h.n) + '</h3><p class="tdt-alias">' + esc(h.a) + '</p><p>' + esc(h.d) + '</p>' +
      '<dl><div><dt>Tu fortaleza</dt><dd>' + esc(h.f) + '</dd></div><div><dt>Tu riesgo</dt><dd>' + esc(h.r) + '</dd></div></dl>' +
      '<div class="tdt-meta"><div class="tdt-meta-tx"><span>' + (igual ? 'Tu meta: potenciarlo' : 'Te quieres convertir en') + '</span><b>' + esc(m.n) + '</b><p>Lo que trabajaríamos contigo: ' + esc(m.t) + '</p></div>' +
      '<div class="tdt-meta-pj"><q class="tdt-globo">' + esc(m.q || '') + '</q><img src="' + m.close + '" alt="' + esc(m.n) + ' te da la bienvenida"></div></div>' +
      '<div class="tdt-form"><div class="campo"><label for="tdt-n">Tu nombre</label><input id="tdt-n" autocomplete="name" placeholder="Ej.: Ana Pérez"></div>' +
      '<div class="campo"><label for="tdt-d">Tu disciplina</label><input id="tdt-d" placeholder="Ej.: ciclismo de ruta"></div></div>' +
      '<div class="tdt-cta"><button type="button" class="btn rojo" data-tdt-wa>Desarrollemos tu perfil paso a paso <span class="chev">»</span></button><button type="button" class="tdt-atras" data-tdt-otra>Repetir el test</button></div>' +
      '</div></div>';
    if (elenco) {
      elenco.classList.add('res'); elenco.classList.remove('foco'); if (info) info.style.display = 'none';
      elenco.querySelectorAll('.tdt-pj').forEach(function (f) { f.classList.toggle('hoy', f.dataset.t === hoy); f.classList.toggle('meta', f.dataset.t === meta); });
    }
    caja.querySelector('[data-tdt-wa]').addEventListener('click', function () {
      var n = caja.querySelector('#tdt-n').value.trim(), d = caja.querySelector('#tdt-d').value.trim();
      var quien = n ? 'soy ' + n + (d ? ', deportista de ' + d : '') + '. ' : (d ? 'soy deportista de ' + d + '. ' : '');
      var msg = 'Hola Daniel, ' + quien + (quien ? 'Hice' : 'hice') + ' el test de Pro Academy y mi resultado fue: hoy soy ' + art(h.n) + ' (' + h.a.toLowerCase() + ')' +
        (igual ? ' y quiero potenciarlo.' : ' y quiero convertirme en ' + art(m.n) + ' (' + m.a.toLowerCase() + ').') +
        ' ¿Qué necesito para llegar ahí? Me interesa desarrollar mi perfil paso a paso con Pro Motion Sport Marketing.';
      window.open(window.PM.waLink(msg), '_blank', 'noopener');
    });
    caja.querySelector('[data-tdt-otra]').addEventListener('click', function () { resp = []; orden = []; i = 0; if (elenco) elenco.classList.remove('res'); if (info) info.style.display = ''; pregunta(); });
    var top = caja.getBoundingClientRect().top + window.scrollY - 90;
    if (Math.abs(window.scrollY - top) > 200) window.scrollTo({ top: top, behavior: 'smooth' });
  }
  caja.querySelector('[data-tdt-ir]').addEventListener('click', function () { i = 0; pregunta(); });
  // Descripción breve de cada personaje (cursor en computadora, toque en celular)
  var info = document.querySelector('.tdt-info');
  if (elenco && info) {
    var figs = elenco.querySelectorAll('.tdt-pj');
    var mostrar = function (f) {
      if (elenco.classList.contains('res')) return;
      figs.forEach(function (x) { x.classList.toggle('tdt-on', x === f); });
      info.querySelectorAll('p').forEach(function (p) { p.classList.toggle('tdt-on', p.dataset.t === f.dataset.t); });
      elenco.classList.add('foco'); info.classList.add('ver');
      var fr = f.getBoundingClientRect(), ir = info.getBoundingClientRect();
      info.style.setProperty('--fl', Math.max(16, Math.min(ir.width - 16, fr.left + fr.width / 2 - ir.left)) + 'px');
    };
    figs.forEach(function (f) {
      f.addEventListener('mouseenter', function () { mostrar(f); });
      f.addEventListener('click', function () { mostrar(f); });
      f.addEventListener('focus', function () { mostrar(f); });
    });
    elenco.addEventListener('mouseleave', function () { elenco.classList.remove('foco'); });
  }
})();
/* Servicios: filtro por público y barra de servicios con la sección activa */
(function () {
  'use strict';
  var q = document.querySelector('.srv-quien');
  if (q) {
    var cards = Array.prototype.slice.call(document.querySelectorAll('#catalogo .cat[data-para]'));
    var cuenta = q.querySelector('.srv-cuenta'), nota = document.querySelector('.srv-marca-nota');
    q.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      q.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); });
      var p = b.dataset.p, n = 0;
      cards.forEach(function (c) { var ver = !p || c.dataset.para.split(' ').indexOf(p) > -1; c.classList.toggle('oculta', !ver); if (ver) n++; });
      cuenta.textContent = p ? n + ' servicios para ti' : '';
      if (nota) nota.hidden = p !== 'm';
    });
  }
  var nav = document.querySelector('.srv-nav');
  if (nav && 'IntersectionObserver' in window) {
    var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
    var secs = links.map(function (a) { return document.querySelector(a.getAttribute('href')); }).filter(Boolean);
    var ALIAS = { '#simple': '#elige', '#completa': '#elige' };
    Object.keys(ALIAS).forEach(function (k) { var el = document.querySelector(k); if (el) secs.push(el); });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = '#' + en.target.id; id = ALIAS[id] || id;
        links.forEach(function (a) { var on = a.getAttribute('href') === id; a.classList.toggle('on', on); if (on && a.scrollIntoView) { var r = nav.querySelector('.srv-nav-in'); r.scrollTo({ left: a.offsetLeft - 40, behavior: 'smooth' }); } });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach(function (s) { io.observe(s); });
  }
})();
/* Galería de la charla: cambia entre video y fotos */
(function () {
  'use strict';
  document.querySelectorAll('[data-charla]').forEach(function (g) {
    var esc = g.querySelector('.charla-esc'), v = esc.querySelector('video');
    g.querySelectorAll('.charla-min button').forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.dataset.k;
        g.querySelectorAll('.charla-min button').forEach(function (x) { x.classList.toggle('on', x === b); });
        esc.querySelectorAll('[data-k]').forEach(function (el) { el.hidden = el.dataset.k !== k; });
        if (k !== '0' && v && !v.paused) v.pause();
      });
    });
  });
})();
/* Menú «Más»: abrir con toque o teclado */
(function () {
  'use strict';
  var m = document.querySelector('.nav-mas'); if (!m) return;
  var b = m.querySelector('button');
  b.addEventListener('click', function (e) { e.stopPropagation(); var a = m.classList.toggle('abierto'); b.setAttribute('aria-expanded', a); });
  document.addEventListener('click', function (e) { if (!m.contains(e.target)) { m.classList.remove('abierto'); b.setAttribute('aria-expanded', 'false'); } });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { m.classList.remove('abierto'); b.setAttribute('aria-expanded', 'false'); } });
})();
/* Servicios · Campañas: pedir propuesta por WhatsApp */
(function () {
  'use strict';
  var f = document.getElementById('cp-pide'); if (!f) return;
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = new FormData(f), para = d.getAll('para'), cuando = String(d.get('cuando') || '').trim();
    var msg = 'Hola Daniel, soy ' + (d.get('quien') === 'Marca' ? 'de una marca' : 'deportista') + ' y quiero una campaña puntual (sin plan mensual).' +
      (para.length ? '\nObjetivo: ' + para.join(', ') + '.' : '') + (cuando ? '\nFechas: ' + cuando + '.' : '') + '\n¿Me envías una propuesta?';
    window.open(window.PM.waLink(msg), '_blank', 'noopener');
  });
})();
/* Academy: pasillo infinito — las puertas se cierran y Espid lanza una herramienta que las mantiene abiertas */
(function () {
  'use strict';
  var box = document.querySelector('[data-pasillo]'); if (!box) return;
  var puertas = [].slice.call(box.querySelectorAll('.pa-puerta')), herr = [].slice.call(box.querySelectorAll('.pa-herr')), esp = box.querySelector('.pa-esp');
  var quieto = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var W, H, D, S, L, base, t0 = null;
  function medir() { W = box.clientWidth; H = box.clientHeight; D = Math.min(W * 0.42, H * 0.6); S = Math.max(W * 0.62, (W + D) / 3.6); L = S * puertas.length; base = H * 0.06 + 4;
    puertas.forEach(function (p) { p.style.width = p.style.height = D + 'px'; }); herr.forEach(function (h) { h.style.height = D * 0.26 + 'px'; }); }
  function clamp(x) { return Math.max(0, Math.min(1, x)); }
  function ease(x) { return x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; }
  function paso(ts) {
    if (t0 === null) t0 = ts;
    var t = (ts - t0) / 1000, v = S / 2.3, lanzando = false;
    puertas.forEach(function (p, i) {
      var u = ((i * S + v * t) % L + L) % L, x = W + D * 0.6 - u;   // centro de la puerta en pantalla
      var cierra = clamp((W * 0.98 - x) / (W * 0.36)) * 0.78;                 // se va cerrando al acercarse
      var vuelo = clamp((W * 0.84 - x) / (W * 0.24));                         // la herramienta vuela
      var abre = clamp((W * 0.60 - x) / (W * 0.16));                          // al caer, la puerta se reabre
      var c = vuelo >= 1 ? cierra * (1 - ease(abre)) + 0.05 : cierra;
      p.style.transform = 'translate(' + (x - D / 2) + 'px,0)';
      p.children[1].style.transform = p.children[2].style.transform = 'scaleY(' + c + ')';
      var h = herr[i], hw = h.offsetWidth || D * 0.3, hh = h.offsetHeight || D * 0.3;
      if (x > W * 0.84 || x < -D) { h.style.opacity = 0; return; }
      var sx = W * 0.12, sy = H * 0.6, tx = x - hw / 2, ty = H - base - hh * 0.92;
      var e = ease(vuelo), px = sx + (tx - sx) * e, py = sy + (ty - sy) * e - Math.sin(Math.PI * vuelo) * H * 0.28;
      h.style.opacity = vuelo > 0 ? 1 : 0;
      h.style.transform = 'translate(' + px + 'px,' + py + 'px) rotate(' + (vuelo < 1 ? 540 * e : 0) + 'deg)';
      if (vuelo > 0 && vuelo < 0.2) lanzando = true;
    });
    esp.classList.toggle('lanza', lanzando);
    requestAnimationFrame(paso);
  }
  medir(); addEventListener('resize', medir);
  if (quieto) { puertas.forEach(function (p, i) { p.style.transform = 'translate(' + (W * 0.62 - D / 2 + i * S) + 'px,0)'; }); return; }
  requestAnimationFrame(paso);
})();
/* Ver video completo en pantalla grande */
(function () {
  'use strict';
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-cine-abre]'); if (!b) return;
    var m = document.createElement('div'); m.className = 'cine-modal'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-label', 'Video');
    m.innerHTML = '<video controls autoplay playsinline poster="' + b.dataset.cinePoster + '"><source src="' + b.dataset.cineAbre + '" type="video/mp4"></video><button type="button" aria-label="Cerrar">✕</button>';
    function cerrar() { m.remove(); document.removeEventListener('keydown', esc); }
    function esc(ev) { if (ev.key === 'Escape') cerrar(); }
    m.addEventListener('click', function (ev) { if (ev.target === m || ev.target.tagName === 'BUTTON') cerrar(); });
    document.addEventListener('keydown', esc); document.body.appendChild(m);
  });
})();
/* Aviso de privacidad bajo cada formulario que envía datos */
(function () {
  'use strict';
  var enl = document.querySelector('.pie a[href$="privacidad/"]'); if (!enl) return;
  ['brief', 'pm-reg', 'cp-pide', 'diagnostico-form', 'pitch-form', 'plan-form'].forEach(function (id) {
    var f = document.getElementById(id); if (!f) return;
    var p = document.createElement('p'); p.className = 'nota-priv';
    p.innerHTML = (id === 'diagnostico-form' ? 'Tu resultado se calcula en tu navegador. Guardamos el puntaje de forma anónima; tu contacto y tus respuestas solo si decides dejarlos al final. ' : 'Tus respuestas se procesan en tu navegador y solo nos llegan si las envías por WhatsApp. ') + '<a href="' + enl.getAttribute('href') + '">Política de privacidad</a>.';
    f.appendChild(p);
  });
})();

// Videos de casos: cargan y se reproducen solo cuando están en pantalla
(function(){
  var vs=document.querySelectorAll('video[data-src]'); if(!vs.length) return;
  var quieto=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!('IntersectionObserver' in window)){vs.forEach(function(v){v.src=v.dataset.src});return}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target;
    if(e.isIntersecting){if(!v.getAttribute('src')){v.src=v.dataset.src}if(!quieto){var p=v.play();if(p&&p.catch)p.catch(function(){})}}
    else if(!v.paused){v.pause()}})},{rootMargin:'120px 0px',threshold:.25});
  vs.forEach(function(v){io.observe(v)});
})();

// Carruseles de casos: flechas, puntos y contador sobre un carril con scroll-snap
(function(){
  document.querySelectorAll('[data-car]').forEach(function(c){
    var p=c.querySelector('.car-pista'),s=p.children,n=s.length,cont=c.querySelector('.car-n'),dots=c.querySelector('.car-dots'),a=c.querySelector('.car-ant'),b=c.querySelector('.car-sig'),i=0;
    if(n<16){for(var k=0;k<n;k++)dots.appendChild(document.createElement('i'))}
    function pinta(){if(!p.clientWidth)return;i=Math.round(p.scrollLeft/p.clientWidth);cont.textContent=(i+1)+' / '+n;a.disabled=i<=0;b.disabled=i>=n-1;
      [].forEach.call(dots.children,function(d,k){d.classList.toggle('on',k===i)});
      var im=s[i+1]&&s[i+1].querySelector('img');if(im)im.loading='eager';var lk=c.querySelector('.car-pie a');if(lk&&s[i]&&s[i].dataset.url)lk.href=s[i].dataset.url}
    function ir(k){p.scrollTo({left:Math.max(0,Math.min(n-1,k))*p.clientWidth,behavior:'smooth'})}
    a.addEventListener('click',function(){ir(i-1)});b.addEventListener('click',function(){ir(i+1)});
    p.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();ir(i+1)}if(e.key==='ArrowLeft'){e.preventDefault();ir(i-1)}});
    var t;p.addEventListener('scroll',function(){clearTimeout(t);t=setTimeout(pinta,60)},{passive:true});pinta();
  });
  // «Ver más del caso»: despliega y repliega el resto del caso
  document.querySelectorAll('.cs-abre').forEach(function(btn){btn.addEventListener('click',function(){
    var m=document.getElementById(btn.getAttribute('aria-controls')),abre=m.hidden;m.hidden=!abre;
    m.closest('.cs').querySelectorAll('.cs-abre').forEach(function(x){x.setAttribute('aria-expanded',abre)});
    var h=m.closest('.cs').querySelector('.cs-hero .cs-abre');h.firstChild.textContent=abre?'Ocultar detalle ':'Ver más del caso ';
    if(abre){m.querySelectorAll('[data-car]').forEach(function(c){c.querySelector('.car-pista').dispatchEvent(new Event('scroll'))})}
    else{m.closest('.cs').scrollIntoView({behavior:'smooth',block:'start'})}
  })});
})();

// Pestañas de eventos dentro de un caso
document.querySelectorAll('.ev-tabs').forEach(function(t){t.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
  t.querySelectorAll('button').forEach(function(x){var on=x===b;x.classList.toggle('on',on);x.setAttribute('aria-selected',on)});
  var caja=t.parentNode;caja.querySelectorAll('.ev-panel').forEach(function(p){p.hidden=p.dataset.p!==b.dataset.t;
    if(!p.hidden)p.querySelectorAll('.car-pista').forEach(function(x){x.dispatchEvent(new Event('scroll'))})})})});

/* ---------- Carrito y pagos (Payphone) ---------- */
(function () {
  'use strict';
  var nodo = document.getElementById('catalogo'); if (!nodo) return;
  var CAT = {}; try { JSON.parse(nodo.textContent).forEach(function (p) { CAT[p.id] = p; }); } catch (e) { return; }
  var WA = '593984678812', KEY = 'pm_carrito';
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function waLink(t) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(t); }
  function leer() { try { return (JSON.parse(localStorage.getItem(KEY)) || []).filter(function (x) { return CAT[x.id]; }); } catch (e) { return []; } }
  function guardar(c) { try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {} pintar(); }
  function usd(n) { return 'USD ' + (Math.round(n * 100) / 100).toLocaleString('es-EC', { minimumFractionDigits: n % 1 ? 2 : 0 }); }
  var caja = document.getElementById('carro'), lista = caja.querySelector('.carro-lista'), pie = caja.querySelector('.carro-pie');

  function agregar(id, abrirlo) {
    var c = leer(), it = c.filter(function (x) { return x.id === id; })[0];
    var unico = /^(guia|curso)/.test(id);
    if (it) { if (!unico) it.q = Math.min(20, it.q + 1); } else c.push({ id: id, q: 1 });
    guardar(c);
    if (abrirlo !== false) abrir();
  }
  function abrir() { caja.hidden = false; requestAnimationFrame(function () { caja.classList.add('on'); }); document.body.classList.add('carro-abierto'); }
  function cerrar() { caja.classList.remove('on'); document.body.classList.remove('carro-abierto'); setTimeout(function () { caja.hidden = true; }, 250); }

  function pintar() {
    var c = leer(), n = c.reduce(function (s, x) { return s + x.q; }, 0);
    document.querySelectorAll('.carro-top').forEach(function (b) { b.hidden = !n; b.querySelector('[data-carro-n]').textContent = n; });
    document.querySelectorAll('[data-carrito]').forEach(function (b) {
      var en = c.some(function (x) { return x.id === b.dataset.carrito; });
      b.classList.toggle('en', en);
    });
    if (!c.length) {
      lista.innerHTML = '<div class="carro-vacio"><p>Tu carrito está vacío.</p><a class="link" href="/academy/cursos/">Ver cursos »</a></div>';
      pie.innerHTML = ''; return;
    }
    var pagar = 0, cotizar = [];
    lista.innerHTML = c.map(function (x) {
      var p = CAT[x.id], fijo = !!p.precio;
      if (fijo) pagar += p.precio * x.q * (p.iva ? 1.15 : 1); else cotizar.push(p);
      var precio = fijo ? usd(p.precio * x.q) + (p.iva ? ' + IVA' : '') + (p.normal ? ' <s>' + usd(p.normal * x.q) + '</s>' : '') : (p.desde ? 'Desde USD ' + p.desde : 'A cotizar');
      var cant = /^(guia|curso)/.test(x.id) ? '' :
        '<div class="carro-q"><button type="button" data-q="-1" data-id="' + x.id + '" aria-label="Quitar uno">−</button><span>' + x.q + '</span><button type="button" data-q="1" data-id="' + x.id + '" aria-label="Agregar uno">+</button></div>';
      return '<div class="carro-it' + (fijo ? '' : ' cot') + '"><div><span class="carro-tipo">' + esc(p.tipo) + (fijo ? '' : ' · se cotiza') + '</span><b>' + esc(p.n) + '</b>' +
        (p.d ? '<small>' + esc(p.d) + '</small>' : '') + cant + '</div><div class="carro-der"><span class="carro-pr">' + precio + '</span><button type="button" class="carro-del" data-del="' + x.id + '">Quitar</button></div></div>';
    }).join('');
    var h = '';
    if (pagar) h += '<div class="carro-total"><span>Total a pagar en línea</span><b>' + usd(pagar) + '</b></div>' +
      '<button type="button" class="btn rojo carro-pagar" data-pagar>Pagar ' + usd(pagar) + ' con tarjeta »</button>' +
      '<p class="carro-seg">Pago seguro con tarjeta de crédito o débito vía Payphone.</p>' +
      '<a class="btn crema" href="#" data-transferencia>Pagar por transferencia »</a>';
    if (cotizar.length) h += '<p class="carro-cot-n">' + (pagar ? 'Los productos marcados “se cotiza” no se cobran ahora: ' : '') + 'te enviamos la cotización por WhatsApp.</p>' +
      '<a class="btn' + (pagar ? ' crema' : ' rojo') + '" href="#" data-cotizar>Cotizar por WhatsApp »</a>';
    h += '<p class="carro-aviso" aria-live="polite"></p>';
    pie.innerHTML = h;
  }

  function mensaje(soloCotizar) {
    var c = leer();
    var lineas = c.filter(function (x) { return !soloCotizar || !CAT[x.id].precio; }).map(function (x) {
      var p = CAT[x.id]; return '• ' + (x.q > 1 ? x.q + 'x ' : '') + p.n + (p.precio ? ' (USD ' + p.precio * x.q + ')' : '');
    });
    return 'Hola Daniel, quiero cotizar esto desde la web de Pro Motion:\n' + lineas.join('\n');
  }

  function msgTransferencia() {
    var c = leer().filter(function (x) { return CAT[x.id].precio; }), tot = 0;
    var l = c.map(function (x) { var p = CAT[x.id]; tot += p.precio * x.q; return '• ' + (x.q > 1 ? x.q + 'x ' : '') + p.n + ' (USD ' + p.precio * x.q + ')'; });
    return 'Hola Daniel, quiero pagar por transferencia mi compra en la web de Pro Motion:\n' + l.join('\n') + '\nTotal: USD ' + tot + '\n¿Me envías los datos para transferir?';
  }

  function pagar(btn) {
    var av = pie.querySelector('.carro-aviso'), c = leer();
    btn.disabled = true; av.textContent = 'Preparando tu pago seguro…';
    fetch('/api/pago/crear', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: c, volver: location.pathname }) })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (x) {
        if (!x.ok || !x.d.url) throw new Error(x.d && x.d.error || 'error');
        try { localStorage.setItem('pm_pedido', JSON.stringify({ txid: x.d.txid, items: x.d.items, total: x.d.total })); } catch (e) {}
        location.href = x.d.url;
      })
      .catch(function () {
        btn.disabled = false;
        av.innerHTML = 'El pago en línea no está disponible en este momento. <a href="' + waLink(mensaje(false)) + '" target="_blank" rel="noopener">Compra por WhatsApp »</a>';
      });
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-carrito],[data-comprar],[data-abrir-carrito],[data-cerrar-carrito],[data-del],[data-q],[data-pagar],[data-cotizar],[data-transferencia]');
    if (!t) return;
    if (t.dataset.carrito) { e.preventDefault(); agregar(t.dataset.carrito); }
    else if (t.dataset.comprar) { e.preventDefault(); agregar(t.dataset.comprar); }
    else if (t.hasAttribute('data-abrir-carrito')) { e.preventDefault(); abrir(); }
    else if (t.hasAttribute('data-cerrar-carrito')) cerrar();
    else if (t.dataset.del) guardar(leer().filter(function (x) { return x.id !== t.dataset.del; }));
    else if (t.dataset.q) {
      var c = leer(); c.forEach(function (x) { if (x.id === t.dataset.id) x.q = Math.max(1, Math.min(20, x.q + +t.dataset.q)); }); guardar(c);
    }
    else if (t.hasAttribute('data-pagar')) pagar(t);
    else if (t.hasAttribute('data-transferencia')) { e.preventDefault(); window.open(waLink(msgTransferencia()), '_blank', 'noopener'); }
    else if (t.hasAttribute('data-cotizar')) { e.preventDefault(); window.open(waLink(mensaje(leer().some(function (x) { return CAT[x.id].precio; }))), '_blank', 'noopener'); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !caja.hidden) cerrar(); });
  window.addEventListener('storage', function (e) { if (e.key === KEY) pintar(); });
  pintar();

  /* ---------- Página de respuesta de Payphone ---------- */
  var res = document.getElementById('pago-res'); if (!res) return;
  var q = new URLSearchParams(location.search), id = q.get('id'), tx = q.get('clientTransactionId');
  var pedido = {}; try { pedido = JSON.parse(localStorage.getItem('pm_pedido')) || {}; } catch (e) {}
  function estado(s) { res.dataset.estado = s; }
  if (!id || !tx) { estado('no'); res.querySelector('.pago-motivo').textContent = 'No recibimos los datos del pago.'; return; }
  fetch('/api/pago/confirmar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: id, clientTransactionId: tx }) })
    .then(function (r) { return r.json(); })
    .then(function (d) {
      if (d.estado !== 'aprobado') { estado('no'); if (d.mensaje) res.querySelector('.pago-motivo').textContent = d.mensaje; return; }
      estado('ok');
      var items = (pedido.txid === tx && pedido.items) || [];
      var ids = items.map(function (x) { return x.id; });
      // limpiar del carrito lo que ya se pagó
      try {
        var c = JSON.parse(localStorage.getItem(KEY)) || [];
        localStorage.setItem(KEY, JSON.stringify(c.filter(function (x) { return !CAT[x.id] || !CAT[x.id].precio; })));
        localStorage.removeItem('pm_pedido');
      } catch (e) {}
      pintar();
      if (d.guia) {
        var g = res.querySelector('.pago-guia'); g.hidden = false;
        var enlace = location.origin + d.guia.url;
        g.querySelector('[data-enlace]').value = enlace;
        g.querySelector('[data-copiar]').onclick = function () {
          var inp = g.querySelector('[data-enlace]'); inp.select();
          (navigator.clipboard ? navigator.clipboard.writeText(enlace) : Promise.reject()).catch(function () { document.execCommand('copy'); });
          this.textContent = '¡Copiado!';
        };
      }
      var otros = ids.filter(function (x) { return x !== 'guia-oferta'; });
      if (otros.length || (!d.guia && !ids.length)) {
        var a = res.querySelector('.pago-agenda'); a.hidden = false;
        var nombres = otros.map(function (x) { return CAT[x] ? CAT[x].n : x; }).join(', ') || (d.referencia || 'mi compra');
        var esCurso = otros.some(function (x) { return /^curso/.test(x); }), esPM = otros.indexOf('promatch-diagnostico') >= 0;
        a.querySelector('.lead').textContent = esPM
          ? 'Siguiente paso: llena tu formulario ProMatch y envíame por WhatsApp las capturas de tu audiencia. En 4 días hábiles desde que los recibo, te entrego tu propuesta personalizada con el diagnóstico y el plan de acción para tu primera etapa.'
          : esCurso
          ? 'Te escribimos para darte acceso a tu curso. Si quieres adelantarte, envíanos tu número de transacción por WhatsApp.'
          : 'Ahora coordinemos tu sesión. Escríbenos por WhatsApp con tu número de transacción y agendamos fecha y hora.';
        var b = a.querySelector('[data-wa-agenda]');
        b.lastChild.nodeValue = esPM ? 'Pedir mi formulario ProMatch' : esCurso ? 'Escribir por WhatsApp' : 'Agendar mi sesión';
        b.href = waLink('Hola Daniel, acabo de pagar en la web: ' + nombres + '. Transacción ' + (d.transaccion || id) + '.');
        b.target = '_blank'; b.rel = 'noopener';
        if (esPM) { b.href = '/promatch/formulario/'; b.removeAttribute('target'); b.lastChild.nodeValue = 'Llenar mi formulario ProMatch'; }
      }
      var filas = [['Monto', 'USD ' + (d.monto || 0).toFixed(2)], ['Transacción', d.transaccion], ['Autorización', d.autorizacion], ['Tarjeta', d.tarjeta],
        ['Fecha', d.fecha ? new Date(d.fecha).toLocaleString('es-EC') : null], ['Detalle', items.length ? items.map(function (x) { return (x.q > 1 ? x.q + 'x ' : '') + x.n; }).join(' + ') : d.referencia]];
      res.querySelector('.pago-recibo').innerHTML = filas.filter(function (f) { return f[1]; }).map(function (f) { return '<dt>' + f[0] + '</dt><dd>' + esc(f[1]) + '</dd>'; }).join('');
    })
    .catch(function () { estado('no'); res.querySelector('.pago-motivo').textContent = 'No pudimos confirmar el pago. Si se debitó, escríbenos y lo revisamos.'; });
})();

/* Marcas: sonido del caso Tissot */
(function () {
  var b = document.querySelector('.tx-son'); if (!b) return;
  var v = b.parentNode.querySelector('video');
  b.addEventListener('click', function () {
    if (!v.getAttribute('src') && v.dataset.src) v.src = v.dataset.src;
    v.muted = !v.muted; if (!v.muted) { v.currentTime = 0; v.play().catch(function () {}); }
    b.textContent = v.muted ? '🔊 Con sonido' : '🔇 Silenciar';
  });
})();

/* Diagnósticos: «No lo sé» y «Ninguna» excluyen al resto; «Otra/Otro» abre un campo para escribir */
(function () {
  var SOLAS = ['No lo sé', 'Ninguna', 'Ninguna en particular'];
  document.addEventListener('change', function (e) {
    var i = e.target;
    if (!i.matches || !i.matches('.b-chips input')) return;
    var grupo = i.closest('.b-chips'), campo = grupo.parentNode;
    if (i.type === 'checkbox' && i.checked) {
      var sola = SOLAS.indexOf(i.value) > -1;
      grupo.querySelectorAll('input[type=checkbox]').forEach(function (x) {
        if (x !== i && (sola || SOLAS.indexOf(x.value) > -1)) x.checked = false;
      });
    }
    var otro = campo.querySelector('.b-otro');
    if (otro) {
      var abierto = [].some.call(grupo.querySelectorAll('input'), function (x) { return x.checked && /^Otr[ao]$/.test(x.value); });
      otro.hidden = !abierto;
      if (abierto && i.checked && /^Otr[ao]$/.test(i.value)) otro.focus();
      if (!abierto) otro.value = '';
    }
  });
})();
