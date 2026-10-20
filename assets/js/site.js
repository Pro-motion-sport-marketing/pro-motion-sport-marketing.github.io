/* Pro Motion Sport Marketing — interacciones del sitio */
(function () {
  'use strict';
  var WA = '593984678812';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  function waLink(t) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(t); }
  window.PM = { waLink: waLink };
  function abrirWA(t) { window.open(waLink(t), '_blank', 'noopener'); }
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
        if (d === 0 && v) { if (visible) { v.currentTime = 0; v.play().catch(function () {}); } }
        else if (v) v.pause();
      });
      var it = items[act];
      if (tit) { tit.textContent = it.dataset.tit; }
      if (sub) { sub.textContent = it.dataset.sub; }
      if (num) { contar(num, +it.dataset.vistas); }
      $$('.vc-dots button').forEach(function (b, i) { b.classList.toggle('on', i === act); });
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
      it.addEventListener('click', function () { if (i !== act) ir(i); });
      if (v) {
        v.addEventListener('timeupdate', function () { if (i === act && barra && v.duration) { barra.style.transition = 'width .25s linear'; barra.style.width = (v.currentTime / v.duration * 100) + '%'; } });
        v.addEventListener('ended', function () { if (i === act) ir(act + 1); });
      }
    });
    $('.vc-prev') && $('.vc-prev').addEventListener('click', function () { ir(act - 1); });
    $('.vc-next') && $('.vc-next').addEventListener('click', function () { ir(act + 1); });
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
      if (visible) { if (!v.src) v.src = v.dataset.src; v.play().catch(function () {}); } else v.pause();
    }, { threshold: 0.35 }).observe(vc);
    // respaldo: si un video no puede reproducirse, avanzar cada 7 s
    timer = setInterval(function () { var v = $('video', items[act]); if (visible && (!v || v.paused && v.readyState < 2)) ir(act + 1); }, 7000);
    pintar();
  })();

  /* ---------- Problema: la cuadrícula de solicitudes ---------- */
  var grid = $('.puntos-grid');
  if (grid) (function () {
    var msg = $('.puntos-msg'), frases = ['“Necesito apoyo para mi temporada.”', '“Te envío mi currículum deportivo.”', '“Tengo muchos seguidores, ¿me auspicias?”', '“Soy campeón nacional, ¿me ayudas?”', '“Busco patrocinio para mi sueño.”'];
    $$('.pt', grid).forEach(function (p, i) {
      p.addEventListener('click', function () {
        if (p.classList.contains('tu')) msg.innerHTML = '<b>Esta es la tuya:</b> una propuesta con narrativa, calendario, activaciones y cómo se mide. La marca no tiene que adivinar qué gana.';
        else msg.innerHTML = 'Solicitud ' + (i + 1) + ': ' + frases[i % frases.length] + ' <b>Igual a las demás.</b>';
      });
      p.addEventListener('mouseenter', function () { p.click(); });
    });
  })();

  /* ---------- Metodología: escalera ---------- */
  var esc_ = $('.escalera');
  if (esc_) (function () {
    var D = JSON.parse($('#metodo-data').textContent), pel = $$('.peldano', esc_), fig = $('.sube', esc_), txt = $('.metodo-txt');
    function ver(i) {
      pel.forEach(function (p, k) { p.classList.toggle('on', k === i); p.setAttribute('aria-pressed', k === i); });
      var p = pel[i], r = p.getBoundingClientRect(), rr = esc_.getBoundingClientRect();
      fig.style.left = (r.left - rr.left + r.width / 2 - fig.offsetWidth / 2) + 'px';
      fig.style.bottom = r.height + 'px';
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
  var score = $('.score');
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
  if (brief) brief.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = new FormData(brief), faltan = [];
    ['objetivo', 'audiencia', 'territorio'].forEach(function (k) { if (!String(d.get(k) || '').trim()) faltan.push(k); });
    var av = $('.brief-aviso');
    if (faltan.length) { av.textContent = 'Completa: ' + faltan.join(', ') + '.'; return; }
    av.textContent = '';
    abrirWA('Hola Daniel, soy de una marca y quiero diseñar una activación deportiva.\n\nEmpresa: ' + d.get('empresa') + '\nObjetivo: ' + d.get('objetivo') + '\nAudiencia: ' + d.get('audiencia') + '\nTerritorio: ' + d.get('territorio') + '\nDuración: ' + d.get('duracion') + '\nInversión: ' + d.get('inversion') + '\nValores de marca: ' + d.get('valores'));
  });

  /* ---------- Academy: diagnóstico de arquetipo ---------- */
  var diag = $('#diagnostico-form');
  if (diag) diag.addEventListener('submit', function (e) {
    e.preventDefault();
    var T = JSON.parse($('#arquetipos-data').textContent), dep = (diag.deporte.value || '').toLowerCase().trim();
    if (!dep) { $('.diag-res').innerHTML = '<p>Escribe tu disciplina para empezar.</p>'; return; }
    var a = T.filter(function (t) { return t.k.some(function (k) { return dep.indexOf(k) > -1; }); })[0] || T[T.length - 1];
    var r = $('.diag-res');
    r.innerHTML = '<div class="resultado"><span class="lbl">Tu arquetipo · ' + esc(diag.etapa.value) + '</span><h3 class="epic">' + a.a + '</h3><p>' + a.v + '</p><span class="lbl">Fortalezas que una marca compra</span><p>' + a.f + '</p><span class="lbl">Industrias compatibles</span><p>' + a.o + '</p><span class="lbl">Idea de activación (no es poner un logo)</span><p>' + a.act + '</p><div class="btns" style="margin-top:18px"><button class="btn rojo" type="button">Revisar mi diagnóstico con Pro Motion <span class="chev">»</span></button></div></div>';
    $('button', r).onclick = function () { abrirWA('Hola Daniel, hice el diagnóstico de Pro Academy.\n\nDisciplina: ' + diag.deporte.value + '\nEtapa: ' + diag.etapa.value + '\nAudiencia: ' + diag.audiencia.value + '\nArquetipo: ' + a.a + '\n\nQuiero revisarlo contigo.'); };
  });

  /* ---------- Academy: constructor de pitch ---------- */
  var pitch = $('#pitch-form');
  if (pitch) pitch.addEventListener('submit', function (e) {
    e.preventDefault();
    var g = function (n) { return (pitch[n].value || '').trim(); };
    var prohib = /\b(apoyo|ayuda|ayúdame|sueño|sueños)\b/i, todo = [g('logro'), g('valor')].join(' ');
    var aviso = prohib.test(todo) ? '<p style="color:var(--rojo-vivo)">Ojo: tu texto usa “apoyo”, “ayuda” o “sueño”. Cámbialo por lo que la marca gana.</p>' : '';
    var t = 'Hola, soy ' + (g('nombre') || '[tu nombre]') + ', ' + (g('deporte') || '[tu disciplina]') + '.\n\n' +
      'En los últimos meses ' + (g('logro') || '[tu logro más reciente]') + '. Pero lo que puedo aportarle a ' + (g('industria') || '[industria]') + ' no es solo un resultado: ' + (g('valor') || '[qué te hace distinto]') + '.\n\n' +
      'Les propongo una alianza con tres piezas: (1) presencia en mi calendario de competencia, (2) una activación con mi comunidad que la marca pueda contar, y (3) entregables medibles al cierre de cada mes.\n\n' +
      '¿Qué objetivo comercial tiene su marca este trimestre en el que yo pueda ser la solución?';
    var r = $('.pitch-res');
    r.innerHTML = '<div class="resultado"><span class="lbl">Tu pitch de socio comercial</span>' + aviso + '<pre>' + esc(t) + '</pre><div class="btns" style="margin-top:14px"><button class="btn crema" type="button" data-copiar>Copiar</button><button class="btn rojo" type="button" data-enviar>Que Pro Motion lo revise <span class="chev">»</span></button></div></div>';
    $('[data-copiar]', r).onclick = function (ev) { navigator.clipboard && navigator.clipboard.writeText(t); ev.target.textContent = 'Copiado ✓'; };
    $('[data-enviar]', r).onclick = function () { abrirWA('Hola Daniel, armé mi pitch en Pro Academy. ¿Me ayudas a revisarlo?\n\n' + t); };
  });

  /* ---------- Academy: simulador de reunión ---------- */
  var sim = $('#simulador-panel');
  if (sim) (function () {
    var R = JSON.parse($('#simulador-data').textContent), k = 0, pts = 0, faltas = [];
    var caja = $('.sim-caja', sim), med = $('.medidor i', sim);
    function ronda() {
      if (k >= R.length) return fin();
      var r = R[k];
      caja.innerHTML = '<div class="sim-boca"><img src="' + sim.dataset.jabali + '" alt=""><span class="globo crema">' + r.q + '</span></div><div class="sim-op">' + r.o.map(function (o, i) { return '<button type="button" data-i="' + i + '">' + o[0] + '</button>'; }).join('') + '</div><p class="sim-fb" style="margin-top:12px;font-size:16px;min-height:48px"></p>';
      $$('.sim-op button', caja).forEach(function (b) {
        b.onclick = function () {
          var o = r.o[+b.dataset.i]; pts += o[1];
          b.classList.add(o[1] >= 20 ? 'ok' : 'mal');
          $$('.sim-op button', caja).forEach(function (x) { x.disabled = true; });
          if (o[1] < 20) faltas.push(r.o.filter(function (x) { return x[1] >= 20; })[0][0]);
          $('.sim-fb', caja).innerHTML = '<b>' + (o[1] >= 20 ? 'Bien.' : 'Ahí perdiste puntos.') + '</b> ' + o[2];
          med.style.width = (pts / (R.length * 25) * 100) + '%';
          setTimeout(function () { k++; ronda(); }, 2600);
        };
      });
    }
    function fin() {
      var nota = Math.round(pts / (R.length * 25) * 100);
      var v = nota >= 80 ? 'Saliste con una segunda reunión agendada.' : nota >= 50 ? 'Te dijeron “envíame una propuesta y la reviso”. Sabes lo que significa.' : 'La reunión terminó antes de tiempo.';
      caja.innerHTML = '<div class="resultado" style="background:rgba(255,231,201,.06)"><span class="lbl">Cercanía al cierre</span><h3 class="epic" style="font-size:64px">' + nota + '<small style="font-size:24px">/100</small></h3><p>' + v + '</p>' + (faltas.length ? '<span class="lbl">La frase que te faltó</span><p>“' + faltas[0] + '”</p>' : '') + '<div class="btns" style="margin-top:16px"><button class="btn crema" type="button" data-otra>Repetir</button><button class="btn rojo" type="button" data-wa2>Entrenar con Pro Motion <span class="chev">»</span></button></div></div>';
      $('[data-otra]', caja).onclick = function () { k = 0; pts = 0; faltas = []; med.style.width = '0'; ronda(); };
      $('[data-wa2]', caja).onclick = function () { abrirWA('Hola Daniel, hice el simulador de negociación de Pro Academy y saqué ' + nota + '/100. Quiero preparar mi reunión con una marca.'); };
    }
    $('.sim-empezar', sim).onclick = ronda;
  })();

  /* ---------- Academy: plan editorial ---------- */
  var plan = $('#plan-form');
  if (plan) plan.addEventListener('submit', function (e) {
    e.preventDefault();
    var paso = (plan.paso.value || '').trim(), comp = (plan.competencia.value || '').trim() || 'tu próxima competencia', dep = (plan.deporte.value || '').trim() || 'tu disciplina';
    if (!paso) { $('.plan-res').innerHTML = '<p>Cuéntanos qué pasó para encontrar el ángulo.</p>'; return; }
    var S = [
      ['Semana 1 · Antes', 'El contexto', 'Reel de 30–45 s: “Esto pasó: ' + paso + '”. Sin filtro, contado por ti, mirando a cámara.', 'Demuestra autenticidad: la marca ve que tu historia es real.'],
      ['Semana 2 · Proceso', 'La decisión', 'Carrusel de 5 láminas: qué cambiaste en tu preparación de ' + dep + ' después de lo que pasó.', 'Demuestra método: constancia y disciplina transferibles a una marca.'],
      ['Semana 3 · Comunidad', 'La gente', 'Video con alguien de tu entorno (entrenador, familia, club) hablando de tu proceso rumbo a ' + comp + '.', 'Demuestra vínculo comunitario: lo que una marca más valora.'],
      ['Semana 4 · Competencia', 'El momento', 'Cobertura en vivo de ' + comp + ' (stories) + reel de cierre: resultado y lo que aprendiste.', 'Demuestra visibilidad en tu pico mediático: el espacio que se vende.']
    ];
    var r = $('.plan-res');
    r.innerHTML = '<div class="resultado"><span class="lbl">El ángulo real de tu historia</span><h3 class="epic">No es lo que pasó. Es lo que hiciste después.</h3>' + S.map(function (s) { return '<span class="lbl">' + s[0] + ' · ' + s[1] + '</span><p>' + esc(s[2]) + '</p><p style="opacity:.75;font-size:14px">Activo comercial: ' + s[3] + '</p>'; }).join('') + '<div class="btns" style="margin-top:16px"><button class="btn rojo" type="button">Que Pro Motion lo produzca <span class="chev">»</span></button></div></div>';
    $('button', r).onclick = function () { abrirWA('Hola Daniel, armé mi plan editorial en Pro Academy (' + dep + ', rumbo a ' + comp + '). Quiero ayuda para producirlo.'); };
  });
})();
