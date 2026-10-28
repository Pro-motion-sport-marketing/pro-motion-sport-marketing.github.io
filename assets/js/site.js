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

  /* ---------- Portada: el punto completa el isotipo ---------- */
  var hv = $('.hero-vis'); if (hv) setTimeout(function () { hv.classList.add('listo'); }, 300);

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
  var reg = $('#pm-reg');
  if (reg) (function () {
    function rol() { return reg.querySelector('input[name=quien]:checked').value; }
    function mostrar() { var r = rol(); $$('.pm-campos', reg).forEach(function (f) { f.hidden = f.dataset.para !== r; }); $('.aviso', reg).textContent = ''; }
    $$('input[name=quien]', reg).forEach(function (r) { r.addEventListener('change', mostrar); });
    function v(n) { var e = reg.elements[n]; return e ? e.value.trim() : ''; }
    function linea(k, x) { return x ? '\n' + k + ': ' + x : ''; }
    reg.addEventListener('submit', function (e) {
      e.preventDefault();
      var av = $('.aviso', reg), m = rol() === 'marca';
      if (m ? !(v('m_rep') && v('m_empresa')) : !(v('d_nombre') && v('d_disciplina'))) { av.textContent = m ? 'Completa el nombre del representante y de la empresa.' : 'Completa tu nombre y tu disciplina.'; return; }
      av.textContent = '';
      abrirWA(m
        ? 'Hola Daniel, quiero unirme a la lista de ProMatch como marca.' + linea('Representante', v('m_rep')) + linea('Cargo', v('m_cargo')) + linea('Empresa', v('m_empresa')) + linea('Sector', v('m_sector')) + linea('Ciudad', v('m_ciudad')) + linea('Web/Instagram', v('m_web')) + linea('Busca', v('m_obj'))
        : 'Hola Daniel, quiero unirme a la lista de ProMatch como deportista.' + linea('Nombre', v('d_nombre')) + linea('Disciplina', v('d_disciplina')) + linea('Edad', v('d_edad')) + linea('Ciudad', v('d_ciudad')) + linea('Nivel', v('d_nivel')) + linea('Instagram', v('d_ig')) + linea('Busca', v('d_obj')));
    });
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

  /* ---------- Academy: simulador de reunión (el jabalí reacciona a cada respuesta) ---------- */
  var sim = $('#simulador-panel');
  if (sim) (function () {
    var R = JSON.parse($('#simulador-data').textContent), k = 0, pts = 0, faltas = [];
    var caja = $('.sim-caja', sim), med = $('.medidor i', sim), img = $('.sim-jab img', sim), dice = $('.sim-dice', sim), base = sim.dataset.img;
    var GESTOS = {
      espera: ['boar_crossed', 'te espera de brazos cruzados'],
      bien: ['boar_magnify', 'se inclina con una lupa, interesado'],
      duda: ['boar_confused', 'se toca la barbilla, dudando'],
      mal: ['boar_walk', 'mira el reloj y empieza a irse'],
      trato: ['handshake', 'te da la mano']
    };
    function gesto(g, txt) {
      var G = GESTOS[g];
      img.classList.remove('entra'); void img.offsetWidth;
      img.src = base + G[0] + '.webp?v=1'; img.alt = 'El gerente de marketing ' + G[1];
      img.classList.add('entra');
      sim.setAttribute('data-gesto', g);
      if (txt) { dice.textContent = txt; dice.classList.remove('entra'); void dice.offsetWidth; dice.classList.add('entra'); }
    }
    var REACC = {
      bien: ['Mmm… eso sí me interesa. Sigue.', 'Ok, ahora estás hablando de mi negocio.', 'Interesante. Cuéntame más.'],
      duda: ['Mmm… no me convence del todo.', 'Eso ya lo escuché esta semana.', 'Ajá… ¿y?'],
      mal: ['Tengo otra reunión en cinco minutos…', 'Creo que estamos perdiendo el tiempo.', 'Bueno… cualquier cosa te escribo.']
    };
    function ronda() {
      if (k >= R.length) return fin();
      var r = R[k];
      if (!r.mez) { r.mez = 1; for (var a = r.o.length - 1; a > 0; a--) { var j = Math.floor(Math.random() * (a + 1)), x = r.o[a]; r.o[a] = r.o[j]; r.o[j] = x; } } // la buena no siempre en el medio
      gesto(k ? 'duda' : 'espera', r.q.replace(/[“”]/g, ''));
      caja.innerHTML = '<span class="sim-paso">Objeción ' + (k + 1) + ' de ' + R.length + '</span><div class="sim-op">' + r.o.map(function (o, i) { return '<button type="button" data-i="' + i + '">' + o[0] + '</button>'; }).join('') + '</div><p class="sim-fb" style="margin-top:12px;font-size:16px;min-height:48px"></p>';
      $$('.sim-op button', caja).forEach(function (b) {
        b.onclick = function () {
          var o = r.o[+b.dataset.i]; pts += o[1];
          var tipo = o[1] >= 20 ? 'bien' : o[1] >= 10 ? 'duda' : 'mal';
          b.classList.add(o[1] >= 20 ? 'ok' : 'mal');
          $$('.sim-op button', caja).forEach(function (x) { x.disabled = true; });
          if (o[1] < 20) faltas.push(r.o.filter(function (x) { return x[1] >= 20; })[0][0]);
          gesto(tipo, REACC[tipo][k % 3]);
          $('.sim-fb', caja).innerHTML = '<b>' + (o[1] >= 20 ? 'Bien.' : 'Ahí perdiste puntos.') + '</b> ' + o[2];
          med.style.width = (pts / (R.length * 25) * 100) + '%';
          setTimeout(function () { k++; ronda(); }, 3200);
        };
      });
    }
    function fin() {
      var nota = Math.round(pts / (R.length * 25) * 100);
      var v = nota >= 80 ? 'Saliste con una segunda reunión agendada.' : nota >= 50 ? 'Te dijeron “envíame una propuesta y la reviso”. Sabes lo que significa.' : 'La reunión terminó antes de tiempo.';
      if (nota >= 80) gesto('trato', '¿Te parece el jueves a las diez? Trae los números.');
      else if (nota >= 50) gesto('duda', 'Envíame la propuesta por correo y la reviso…');
      else gesto('mal', 'Gracias por venir. Te escribimos.');
      caja.innerHTML = '<div class="resultado" style="background:rgba(255,231,201,.06)"><span class="lbl">Cercanía al cierre</span><h3 class="epic" style="font-size:64px">' + nota + '<small style="font-size:24px">/100</small></h3><p>' + v + '</p>' + (faltas.length ? '<span class="lbl">La frase que te faltó</span><p>“' + faltas[0] + '”</p>' : '') + '<div class="btns" style="margin-top:16px"><button class="btn crema" type="button" data-otra>Repetir</button><button class="btn rojo" type="button" data-wa2>Entrenar con Pro Motion <span class="chev">»</span></button></div></div>';
      $('[data-otra]', caja).onclick = function () { k = 0; pts = 0; faltas = []; med.style.width = '0'; R.forEach(function (r) { r.mez = 0; }); ronda(); };
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
