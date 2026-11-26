// Worker de promotionec.com
// - Sirve la web estática (ASSETS).
// - /api/pago/crear      → prepara el cobro en Payphone (los montos salen del catálogo, nunca del navegador).
// - /api/pago/confirmar  → confirma el cobro con Payphone (obligatorio en < 5 min o Payphone lo reversa).
// - /guias/de-deportista-a-oferta-comercial/ → capítulo 1 gratis; capítulo 2 en adelante solo con acceso pagado.
//
// Secretos (Cloudflare → Workers → promotionec → Settings → Variables and Secrets):
//   PAYPHONE_TOKEN    Token de la app "Pro Motion Web" en Payphone Developer
//   PAYPHONE_STORE_ID StoreID de la misma app
//   ADMIN_CLAVE       Contraseña de las páginas privadas /admin/accesos/ y /admin/diagnosticos/
// Correo (binding EMAIL, Cloudflare Email Service): envía el diagnóstico completo desde info@promotionec.com.
// Base de datos D1 (binding DB, "promotion-diagnosticos"): guarda cada diagnóstico terminado.
// - /api/dx/guardar        → registra un diagnóstico (anónimo) y luego el contacto, si la persona lo deja y acepta.
// - /api/admin/diagnosticos → lista para Daniel (pide ADMIN_CLAVE).
// Mientras PAYPHONE_TOKEN no exista, la guía sigue abierta y el carrito cotiza por WhatsApp.

import CATALOGO from '../assets/catalogo.json';

const PP = 'https://pay.payphonetodoesposible.com/api/button';
const GUIA = '/guias/de-deportista-a-oferta-comercial/';
const PRODUCTO_GUIA = 'guia-oferta';
const POR_ID = Object.fromEntries(CATALOGO.map((p) => [p.id, p]));

export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    try {
      if (url.pathname === '/api/pago/crear' && req.method === 'POST') return await crear(req, env, url);
      if (url.pathname === '/api/pago/confirmar' && req.method === 'POST') return await confirmar(req, env);
      if (url.pathname === '/api/admin/acceso' && req.method === 'POST') return await accesoManual(req, env);
      if (url.pathname === '/api/dx/guardar' && req.method === 'POST') return await dxGuardar(req, env);
      if (url.pathname === '/api/admin/diagnosticos' && req.method === 'POST') return await dxLista(req, env);
      if (url.pathname.startsWith('/api/')) return json({ error: 'No encontrado' }, 404);
      if (url.pathname === GUIA || url.pathname === GUIA + 'index.html') return await guia(req, env, url);
    } catch (e) {
      return json({ error: 'Error interno', detalle: String(e && e.message || e) }, 500);
    }
    return env.ASSETS.fetch(req);
  },
};

// ---------- Utilidades ----------
function json(obj, status = 200, headers = {}) {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers } });
}
const enc = new TextEncoder();
function b64url(buf) {
  let s = ''; new Uint8Array(buf).forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
async function firma(env, texto) {
  const clave = env.ACCESO_SECRET || env.PAYPHONE_TOKEN;
  const k = await crypto.subtle.importKey('raw', enc.encode(clave), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return b64url(await crypto.subtle.sign('HMAC', k, enc.encode(texto)));
}
async function crearAcceso(env, txid) {
  const base = 'g1.' + txid;
  return base + '.' + (await firma(env, base));
}
async function accesoValido(env, token) {
  if (!token || typeof token !== 'string') return false;
  const i = token.lastIndexOf('.');
  if (i < 4 || !token.startsWith('g1.')) return false;
  const esperado = await firma(env, token.slice(0, i));
  const dado = token.slice(i + 1);
  if (esperado.length !== dado.length) return false;
  let d = 0; for (let j = 0; j < dado.length; j++) d |= esperado.charCodeAt(j) ^ dado.charCodeAt(j);
  return d === 0;
}
function cookie(req, nombre) {
  const m = (req.headers.get('cookie') || '').match(new RegExp('(?:^|;\\s*)' + nombre + '=([^;]+)'));
  return m ? decodeURIComponent(m[1]) : null;
}
const COOKIE_GUIA = (v) => `pm_guia=${encodeURIComponent(v)}; Path=/; Max-Age=315360000; Secure; HttpOnly; SameSite=Lax`;
const centavos = (usd) => Math.round(usd * 100);
const IVA = 0.15; // Ecuador

// ---------- Crear cobro ----------
async function crear(req, env, url) {
  if (!env.PAYPHONE_TOKEN || !env.PAYPHONE_STORE_ID) return json({ error: 'pagos-no-activos' }, 503);
  let body; try { body = await req.json(); } catch { return json({ error: 'JSON inválido' }, 400); }
  const pedidos = Array.isArray(body.items) ? body.items.slice(0, 30) : [];
  const lineas = [];
  for (const it of pedidos) {
    const p = POR_ID[it && it.id];
    if (!p || !p.precio) continue; // lo que no tiene precio fijo se cotiza aparte
    const q = Math.max(1, Math.min(20, parseInt(it.q, 10) || 1));
    lineas.push({ p, q });
  }
  if (!lineas.length) return json({ error: 'No hay productos con precio fijo en el carrito.' }, 400);

  // Productos marcados con iva: el precio es la base y se suma el 15 %
  const conIva = lineas.filter((l) => l.p.iva).reduce((s, l) => s + centavos(l.p.precio) * l.q, 0);
  const sinIva = lineas.filter((l) => !l.p.iva).reduce((s, l) => s + centavos(l.p.precio) * l.q, 0);
  const impuesto = Math.round(conIva * IVA);
  const total = conIva + sinIva + impuesto;
  const tieneGuia = lineas.some((l) => l.p.id === PRODUCTO_GUIA);
  const rnd = b64url(crypto.getRandomValues(new Uint8Array(6)));
  const txid = (tieneGuia ? 'PMG-' : 'PM-') + Date.now().toString(36) + '-' + rnd;
  const origen = url.origin;
  const volver = typeof body.volver === 'string' && body.volver.startsWith('/') && !body.volver.startsWith('//') ? body.volver : '/';
  const referencia = ('Pro Motion: ' + lineas.map((l) => (l.q > 1 ? l.q + 'x ' : '') + l.p.n).join(' + ')).slice(0, 100);

  const datos = {
    amount: total,
    amountWithoutTax: sinIva,
    ...(conIva ? { amountWithTax: conIva, tax: impuesto } : {}),
    currency: 'USD',
    clientTransactionId: txid,
    storeId: env.PAYPHONE_STORE_ID,
    reference: referencia,
    responseUrl: origen + '/pago/respuesta/',
    cancellationUrl: origen + volver,
    timeZone: -5,
    lang: 'es',
    optionalParameter: lineas.map((l) => l.p.id + (l.q > 1 ? 'x' + l.q : '')).join(',').slice(0, 200),
    order: {
      lineItems: lineas.map((l) => ({
        productName: l.p.n, unitPrice: centavos(l.p.precio), quantity: l.q,
        totalAmount: centavos(l.p.precio) * l.q + (l.p.iva ? Math.round(centavos(l.p.precio) * l.q * IVA) : 0),
        taxAmount: l.p.iva ? Math.round(centavos(l.p.precio) * l.q * IVA) : 0, productDescription: l.p.d || l.p.tipo,
      })),
    },
  };
  const r = await fetch(PP + '/Prepare', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + env.PAYPHONE_TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  const res = await r.json().catch(() => ({}));
  if (!r.ok || !res.payWithCard) return json({ error: 'Payphone no aceptó el cobro.', payphone: res }, 502);
  return json({
    txid, total: total / 100,
    url: res.payWithCard, urlApp: res.payWithPayPhone,
    items: lineas.map((l) => ({ id: l.p.id, n: l.p.n, q: l.q, precio: l.p.precio })),
  });
}

// ---------- Confirmar cobro ----------
async function confirmar(req, env) {
  if (!env.PAYPHONE_TOKEN) return json({ error: 'pagos-no-activos' }, 503);
  let body; try { body = await req.json(); } catch { return json({ error: 'JSON inválido' }, 400); }
  const id = parseInt(body.id, 10), txid = String(body.clientTransactionId || '');
  if (!id || !/^PMG?-[\w-]{4,60}$/.test(txid)) return json({ error: 'Datos de transacción inválidos' }, 400);

  const r = await fetch(PP + '/V2/Confirm', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + env.PAYPHONE_TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, clientTxId: txid }),
  });
  const t = await r.json().catch(() => ({}));
  if (!r.ok || t.clientTransactionId !== txid) return json({ estado: 'error', mensaje: t.message || 'No pudimos confirmar el pago.' }, 502);

  const aprobado = t.statusCode === 3;
  const salida = {
    estado: aprobado ? 'aprobado' : 'cancelado',
    mensaje: t.message || null,
    monto: (t.amount || 0) / 100,
    autorizacion: t.authorizationCode || null,
    transaccion: t.transactionId || null,
    fecha: t.date || null,
    referencia: t.reference || null,
    tarjeta: t.cardBrand ? t.cardBrand + ' ' + (t.lastDigits || '') : null,
    email: t.email || null,
    items: String(t.optionalParameter3 || t.optionalParameter || '').split(',').filter(Boolean),
  };
  const headers = {};
  const precioGuia = centavos((POR_ID[PRODUCTO_GUIA] || {}).precio || 15);
  if (aprobado && txid.startsWith('PMG-') && (t.amount || 0) >= precioGuia) {
    const acceso = await crearAcceso(env, txid);
    salida.guia = { acceso, url: GUIA + '?acceso=' + encodeURIComponent(acceso) };
    headers['set-cookie'] = COOKIE_GUIA(acceso);
  }
  return json(salida, 200, headers);
}

// ---------- Guía con vista previa ----------
async function guia(req, env, url) {
  const res = await env.ASSETS.fetch(new Request(new URL(GUIA, url.origin), req));
  if (!env.PAYPHONE_TOKEN || res.status !== 200) return res; // pagos aún no activos: guía abierta

  const q = url.searchParams.get('acceso');
  if (q && (await accesoValido(env, q))) {
    return new Response(null, { status: 302, headers: { location: GUIA, 'set-cookie': COOKIE_GUIA(q), 'cache-control': 'no-store' } });
  }
  const html = await res.text();
  const h = new Headers(res.headers);
  h.set('cache-control', 'private, no-store');
  h.delete('content-length'); h.delete('etag');
  if (await accesoValido(env, cookie(req, 'pm_guia'))) return new Response(html, { status: 200, headers: h });
  return new Response(vistaPrevia(html), { status: 200, headers: h });
}

// El capítulo 1 es gratis. Lo que va desde la marca "PAGO: INICIO" hasta el pie (capítulos 2+) solo se envía con acceso pagado;
// sin acceso, en su lugar va el muro de pago.
function vistaPrevia(html) {
  const ini = html.indexOf('<!-- PAGO: INICIO');
  const fin = html.indexOf('<footer>');
  if (ini < 0 || fin < 0) return html;
  const muro = html.match(/<template id="muro-pago">([\s\S]*?)<\/template>/);
  return html.slice(0, ini) + (muro ? muro[1] : '') + html.slice(fin);
}

// ---------- Acceso manual (pagos por transferencia) ----------
async function accesoManual(req, env) {
  if (!env.ADMIN_CLAVE || !(env.ACCESO_SECRET || env.PAYPHONE_TOKEN)) return json({ error: 'Falta configurar ADMIN_CLAVE en Cloudflare.' }, 503);
  let body; try { body = await req.json(); } catch { return json({ error: 'JSON inválido' }, 400); }
  if (!(await claveOk(env, body.clave))) { await new Promise((r) => setTimeout(r, 800)); return json({ error: 'Clave incorrecta' }, 401); }
  const nota = String(body.nota || '').normalize('NFD').replace(/[^\w]+/g, '').slice(0, 20) || 'cliente';
  const txid = 'PMG-T-' + nota + '-' + Date.now().toString(36);
  const acceso = await crearAcceso(env, txid);
  return json({ url: GUIA + '?acceso=' + encodeURIComponent(acceso) });
}

// comparación de la clave de administración en tiempo constante
async function claveOk(env, clave) {
  const a = await firma(env, 'admin:' + String(clave || '')), b = await firma(env, 'admin:' + env.ADMIN_CLAVE);
  let d = a.length ^ b.length; for (let i = 0; i < Math.min(a.length, b.length); i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

// ---------- Diagnosticador: registro de resultados ----------
const DX_PERFILES = ['deportista', 'equipo', 'evento', 'marca'];
const txt = (v, n) => String(v == null ? '' : v).replace(/[\u0000-\u0008\u000B-\u001F]/g, ' ').trim().slice(0, n);
function jsonCorto(v, n) { try { const s = JSON.stringify(v == null ? null : v); return s.length <= n ? s : null; } catch { return null; } }

async function dxGuardar(req, env) {
  if (!env.DB) return json({ error: 'Registro no disponible' }, 503);
  const crudo = await req.text();
  if (crudo.length > 24000) return json({ error: 'Demasiado grande' }, 413);
  let b; try { b = JSON.parse(crudo); } catch { return json({ error: 'JSON inválido' }, 400); }
  const perfil = txt(b.perfil, 20);
  if (!DX_PERFILES.includes(perfil)) return json({ error: 'Perfil inválido' }, 400);
  const total = Math.max(0, Math.min(100, Math.round(Number(b.total) || 0)));
  const ahora = new Date().toISOString();
  let id = /^[0-9a-f-]{36}$/.test(String(b.id || '')) ? String(b.id) : '';

  // 1) Sin contacto: solo el resultado, sin datos personales.
  if (!id) {
    id = crypto.randomUUID();
    await env.DB.prepare('INSERT INTO diagnosticos (id, creado, perfil, total, nivel, dims, pais) VALUES (?,?,?,?,?,?,?)')
      .bind(id, ahora, perfil, total, txt(b.nivel, 60), jsonCorto(b.dims, 1500), txt(req.cf && req.cf.country, 4)).run();
  }
  // 2) Con contacto: solo si la persona aceptó que le escribamos.
  if (b.contacto !== undefined) {
    if (b.acepta !== true) return json({ error: 'Falta aceptar el contacto' }, 400);
    const canal = b.canal === 'whatsapp' ? 'whatsapp' : 'correo';
    let contacto = txt(b.contacto, 120);
    if (canal === 'correo') { if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contacto)) return json({ error: 'Correo inválido' }, 400); contacto = contacto.toLowerCase(); }
    else { contacto = contacto.replace(/[^\d+]/g, ''); if (contacto.replace(/\D/g, '').length < 8) return json({ error: 'Número inválido' }, 400); }
    const r = await env.DB.prepare('UPDATE diagnosticos SET actualizado=?, nombre=?, canal=?, contacto=?, acepta=1, proyecto=?, ciudad=?, respuestas=?, resumen=?, total=?, nivel=?, dims=? WHERE id=?')
      .bind(ahora, txt(b.nombre, 80), canal, contacto, txt(b.proyecto, 120), txt(b.ciudad, 80), jsonCorto(b.respuestas, 12000), txt(b.resumen, 4000), total, txt(b.nivel, 60), jsonCorto(b.dims, 1500), id).run();
    if (!r.meta || !r.meta.changes) return json({ error: 'Diagnóstico no encontrado' }, 404);
    const detalle = dxDetalle(b.detalle);
    await env.DB.prepare('UPDATE diagnosticos SET detalle=? WHERE id=?').bind(detalle ? JSON.stringify(detalle) : null, id).run();
    let correo = false;
    if (canal === 'correo') correo = await dxCorreo(env, { id, perfil, total, nivel: txt(b.nivel, 60), dims: b.dims, nombre: txt(b.nombre, 80), contacto, detalle });
    return json({ ok: true, id, correo });
  }
  return json({ ok: true, id });
}

async function dxLista(req, env) {
  if (!env.ADMIN_CLAVE || !(env.ACCESO_SECRET || env.PAYPHONE_TOKEN)) return json({ error: 'Falta configurar ADMIN_CLAVE en Cloudflare.' }, 503);
  if (!env.DB) return json({ error: 'Base de datos no disponible' }, 503);
  let body; try { body = await req.json(); } catch { return json({ error: 'JSON inválido' }, 400); }
  if (!(await claveOk(env, body.clave))) { await new Promise((r) => setTimeout(r, 800)); return json({ error: 'Clave incorrecta' }, 401); }
  const filas = await env.DB.prepare('SELECT id, creado, perfil, total, nivel, dims, proyecto, ciudad, nombre, canal, contacto, acepta, respuestas, resumen, correo_enviado, pais FROM diagnosticos ORDER BY creado DESC LIMIT 2000').all();
  const tot = await env.DB.prepare('SELECT COUNT(*) AS n, SUM(CASE WHEN contacto IS NOT NULL THEN 1 ELSE 0 END) AS c FROM diagnosticos').first();
  return json({ total: tot.n || 0, conContacto: tot.c || 0, filas: filas.results || [] });
}

// ---------- Diagnosticador: correo con el diagnóstico completo ----------
const REMITENTE = { email: 'info@promotionec.com', name: 'Pro Motion Sport Marketing' };
const esc = (t) => String(t == null ? '' : t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const sinHtml = (t, n) => txt(String(t == null ? '' : t).replace(/<[^>]*>/g, ''), n);
// Solo texto plano, con tamaños acotados: lo que llega del navegador nunca se inserta como HTML.
function dxDetalle(d) {
  if (!d || typeof d !== 'object') return null;
  const pares = (a, n) => (Array.isArray(a) ? a : []).slice(0, n).map((x) => (Array.isArray(x) ? x : [x]).slice(0, 3).map((y) => sinHtml(y, 320)));
  return { estado: sinHtml(d.estado, 500), arq: (Array.isArray(d.arq) ? d.arq : []).slice(0, 4).map((y) => sinHtml(y, 400)), ventajas: pares(d.ventajas, 4), riesgos: pares(d.riesgos, 4), prios: pares(d.prios, 4), oferta: pares(d.oferta, 4),
    ec: d.ec === true, lecturas: pares(d.lecturas, 4), voz: (Array.isArray(d.voz) ? d.voz : []).slice(0, 5).map((y) => sinHtml(y, 420)), porque: (Array.isArray(d.porque) ? d.porque : []).slice(0, 2).map((y) => sinHtml(y, 1300)),
    plan: (Array.isArray(d.plan) ? d.plan : []).slice(0, 3).map((x) => (Array.isArray(x) ? x : []).slice(0, 6).map((y) => sinHtml(y, 360))) };
}
function dxDims(dims) {
  const o = {}; if (!dims || typeof dims !== 'object') return o;
  Object.keys(dims).slice(0, 10).forEach((k) => { o[sinHtml(k, 40)] = Math.max(0, Math.min(100, Math.round(Number(dims[k]) || 0))); });
  return o;
}
async function dxCorreo(env, d) {
  if (!env.EMAIL) return false;
  try {
    // Freno contra abuso: un correo por dirección al día y un tope general por hora.
    const dia = new Date(Date.now() - 864e5).toISOString(), hora = new Date(Date.now() - 36e5).toISOString();
    const ya = await env.DB.prepare('SELECT (SELECT COUNT(*) FROM diagnosticos WHERE correo_enviado=1 AND contacto=? AND actualizado>?) AS mismo, (SELECT COUNT(*) FROM diagnosticos WHERE correo_enviado=1 AND actualizado>?) AS todos').bind(d.contacto, dia, hora).first();
    if (ya && (ya.mismo >= 1 || ya.todos >= 60)) return false;
    const m = dxMensaje(d);
    await env.EMAIL.send({ from: REMITENTE, replyTo: REMITENTE.email, to: d.contacto, subject: m.asunto, html: m.html, text: m.texto });
    await env.DB.prepare('UPDATE diagnosticos SET correo_enviado=1 WHERE id=?').bind(d.id).run();
    return true;
  } catch (e) {
    console.log('correo dx', e && e.code, e && e.message);
    return false;
  }
}
const INC = 'Este diagnóstico no toma en cuenta si tu proyecto está aprobado por el Ministerio del Deporte para usar el incentivo tributario. Tenerlo aprobado aumenta las probabilidades de conectar con auspiciantes interesados en deducir impuestos, pero es una oportunidad financiera, no lo que te diferencia: no garantiza que elijan tu proyecto ni que la relación dure. Si una marca tiene delante tres o cuatro proyectos y todos tienen el incentivo, ¿por qué escogería el tuyo? Eso es lo que mide este diagnóstico.';
function dxMensaje(d) {
  const nombre = (d.nombre || '').split(' ')[0], D = d.detalle || {}, dims = dxDims(d.dims);
  const R = '#E61E32', N = '#121212', C = '#FFEEDE', H = '#FFFAF5', A = 'https://promotionec.com/assets/correo/';
  const F = "'Clash Display','Helvetica Neue',Arial,Helvetica,sans-serif";
  const etapa = d.total >= 70 ? 3 : d.total >= 45 ? 2 : 1;
  const lista = (a) => (a || []).filter((x) => x[0]).map((x) => `<li style="margin:0 0 9px"><b>${esc(x[0])}${/[.!?]$/.test(x[0]) ? '' : '.'}</b> ${esc(x[1] || '')}${x[2] ? ` <span style="color:${R};font-weight:700">${esc(x[2])}</span>` : ''}</li>`).join('');
  // Título de sección: la etiqueta roja del manual, como imagen (ancho real / 2 para pantallas nítidas).
  const TAGS = { dimensiones: [535, 'Tus dimensiones'], ventajas: [341, 'Ventajas'], oportunidades: [494, 'Oportunidades'], riesgos: [648, 'Riesgos y conflictos'], prioridades: [513, 'Tus prioridades'], oferta: [523, 'Oferta sugerida'], lectura: [494, 'Lo que leemos'], plan: [604, 'Tu plan paso a paso'], siguiente: [549, 'Tu siguiente paso'], profundizar: [741, '¿Quieres profundizarlo?'] };
  const tag = (k) => `<img src="${A}tag-${k}.png" width="${Math.round(TAGS[k][0] / 2.3)}" alt="${TAGS[k][1]}" style="display:block;border:0;max-width:86%;height:auto;margin:0 0 10px -8px;font:700 15px ${F};color:${R};text-transform:uppercase">`;
  const bloque = (k, cuerpo, nota) => (cuerpo ? `<tr><td style="padding:26px 28px 0">${tag(k)}${nota ? `<p style="margin:0 0 8px;font-size:13px;color:#6f665c">${nota}</p>` : ''}${cuerpo}</td></tr>` : '');
  const ul = (a, ord) => { const l = lista(a); return l ? `<${ord ? 'ol' : 'ul'} style="margin:0;padding-left:20px;font-size:15px;line-height:1.5;color:${N}">${l}</${ord ? 'ol' : 'ul'}>` : ''; };
  const barras = Object.keys(dims).map((k) => `<tr><td style="padding:5px 10px 5px 0;font-size:14px;color:${N};white-space:nowrap">${esc(k)}</td><td width="100%" style="padding:5px 0"><div style="background:#eadfce;height:9px"><div style="background:${R};height:9px;width:${dims[k]}%"></div></div></td><td style="padding:5px 0 5px 10px;font-size:14px;font-weight:700;color:${N}">${dims[k]}</td></tr>`).join('');
  const P = (t, m) => `<p style="margin:${m || '0 0 10px'};font-size:15px;line-height:1.55;color:${N}">${t}</p>`;
  // Riesgos: el tercer dato es cómo se resuelve.
  const riesgosHtml = (() => { const l = (D.riesgos || []).filter((x) => x[0]).map((x) => `<li style="margin:0 0 11px"><b>${esc(x[0])}.</b> ${esc(x[1] || '')}${x[2] ? `<br><span style="font-size:14px;color:#4a433b"><b>Cómo se resuelve:</b> ${esc(x[2])}</span>` : ''}</li>`).join(''); return l ? `<ul style="margin:0;padding-left:20px;font-size:15px;line-height:1.5;color:${N}">${l}</ul>` : ''; })();
  // Plan: cada prioridad con su porqué, tres pasos y la señal de que está hecha.
  const plan = (D.plan || []).filter((x) => x[0]);
  const planHtml = plan.map((x, i) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;border-top:2px solid ${N}"><tr>
<td width="46" valign="top" style="padding:14px 0 0"><div style="width:34px;height:34px;line-height:34px;border-radius:17px;background:${R};color:#ffffff;font-size:17px;font-weight:800;text-align:center">${i + 1}</div></td>
<td valign="top" style="padding:14px 0 0"><p style="margin:0 0 6px;font-size:17px;font-weight:800;line-height:1.25;color:${N}">${esc(x[0])}</p>${P(esc(x[1] || ''), '0 0 8px')}
<ol style="margin:0 0 10px;padding-left:20px;font-size:15px;line-height:1.5;color:${N}">${x.slice(2, 5).filter(Boolean).map((y) => `<li style="margin:0 0 7px">${esc(y)}</li>`).join('')}</ol>
${x[5] ? `<p style="margin:0;background:${C};padding:8px 12px;font-size:14px;line-height:1.45;color:${N}"><b>Listo cuando:</b> ${esc(x[5])}</p>` : ''}</td></tr></table>`).join('');
  const porque = (D.porque || []).filter(Boolean);
  const ofertaHtml = (D.oferta || []).filter((x) => x[0]).map((x, i) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 10px;background:${i || !porque.length ? '#ffffff' : N};border:2px solid ${N}"><tr><td style="padding:14px 16px"><p style="margin:0 0 4px;font-size:16px;font-weight:800;line-height:1.3;color:${i || !porque.length ? N : '#ffffff'}">${esc(x[0])}</p><p style="margin:0 0 6px;font-size:14.5px;line-height:1.5;color:${i || !porque.length ? N : C}">${esc(x[1] || '')}</p>${x[2] ? `<p style="margin:0;font-size:15px;font-weight:800;color:${i || !porque.length ? R : '#ffffff'}">${esc(x[2])}</p>` : ''}</td></tr></table>`).join('');
  const voz = (D.voz || []).filter(Boolean);
  const vozHtml = voz.length ? `<tr><td style="padding:26px 28px 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
<td width="104" valign="bottom" style="padding:0 14px 0 0"><img src="${A}jabali-${etapa}.png" width="104" alt="Jabalí empresario" style="display:block;border:0;width:104px;height:auto"></td>
<td valign="middle" style="background:#ffffff;border:2px solid ${N};border-radius:18px;padding:16px 18px"><p style="margin:0 0 8px;font-size:11px;letter-spacing:2.5px;color:${R};text-transform:uppercase;font-weight:700">Así te vería hoy una marca</p>${voz.map((t, i) => `<p style="margin:0 0 8px;font-size:15px;line-height:1.5;color:${N}${i ? '' : ';font-weight:700'}">${esc(t)}</p>`).join('')}<p style="margin:4px 0 0;font-size:12px;line-height:1.4;color:#6f665c">Lectura simulada a partir de tus respuestas, no la opinión de una marca real.</p></td></tr></table></td></tr>` : '';
  const arq = D.arq || [];
  const arqHtml = arq[0] ? `<p style="margin:0 0 8px;font-size:15px;line-height:1.5;color:${N}"><b>${esc(arq[0])}.</b> ${esc(arq[1] || '')}</p>` + (arq[2] ? `<p style="margin:0 0 8px;font-size:15px;line-height:1.5;color:${N}"><b>Dónde encajas mejor:</b> ${esc(arq[2])}</p>` : '') + (arq[3] ? `<p style="margin:0;font-size:15px;line-height:1.5;color:${N}"><b>Idea de activación:</b> ${esc(arq[3])}</p>` : '') : '';
  const waTxt = encodeURIComponent(`Hola Daniel, soy ${d.nombre || ''}. Recibí mi diagnóstico de Pro Motion (${d.total}/100) y quiero conversar sobre cómo profundizarlo.`);
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><title>Tu diagnóstico Pro Motion</title></head><body style="margin:0;background:#efe6d9;font-family:${F}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${d.total}/100 · ${esc(d.nivel)}. Lo que leemos en tus respuestas, tu plan paso a paso y tu siguiente paso.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#efe6d9"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${H}">
<tr><td style="background:${N};padding:22px 28px"><img src="https://promotionec.com/assets/brand/logo-blanco.png" width="140" alt="Pro Motion Sport Marketing" style="display:block;border:0;color:#fff"></td></tr>
<tr><td style="background:${C};font-size:0;line-height:0"><img src="${A}portada-${etapa}.jpg" width="600" alt="Tu diagnóstico completo" style="display:block;border:0;width:100%;height:auto;font:800 26px ${F};color:${N}"></td></tr>
<tr><td style="padding:26px 28px 0"><p style="margin:0;font-size:16px;line-height:1.5;color:${N}">Hola${nombre ? ' ' + esc(nombre) : ''}, aquí está tu diagnóstico completo, con lo que respondiste en el Diagnosticador.</p></td></tr>
<tr><td style="padding:18px 28px 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${N}"><tr>
<td width="128" valign="middle" align="center" style="background:${R};padding:20px 8px"><span style="font-size:52px;font-weight:800;color:#ffffff;line-height:1">${d.total}</span><br><span style="font-size:13px;color:#ffffff;letter-spacing:1px">DE 100</span></td>
<td valign="middle" style="padding:18px 20px"><p style="margin:0;font-size:11px;letter-spacing:3px;color:${C};text-transform:uppercase">Estado actual</p><p style="margin:4px 0 0;font-size:20px;font-weight:800;color:#ffffff;text-transform:uppercase;line-height:1.15">${esc(d.nivel)}</p></td></tr></table>
${D.estado ? `<p style="margin:14px 0 0;font-size:15px;line-height:1.5;color:${N}">${esc(D.estado)}</p>` : ''}</td></tr>
${bloque('dimensiones', barras ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${barras}</table>` : '')}
${vozHtml}
${bloque('lectura', ul(D.lecturas), 'Lo que vemos al cruzar tus respuestas.')}
${bloque('ventajas', ul(D.ventajas))}
${bloque('oportunidades', arqHtml)}
${bloque('riesgos', riesgosHtml)}
${planHtml ? bloque('plan', planHtml, 'Para los próximos 90 días, en este orden. Cada prioridad con su porqué, tres pasos que puedes dar por tu cuenta y la señal de que ya está hecha.') : bloque('prioridades', ul(D.prios, true), 'Para los próximos 90 días, en este orden.')}
${bloque(porque.length ? 'siguiente' : 'oferta', porque.map((t) => P(esc(t))).join('') + ofertaHtml + `<p style="margin:4px 0 0;font-size:13px;color:#6f665c">Valores referenciales: cada proyecto se cotiza a medida. Con el plan de arriba también puedes avanzar por tu cuenta.</p>`)}
${d.perfil === 'marca' || !D.ec ? '' : `<tr><td style="padding:26px 28px 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:2px dashed ${N}"><tr><td style="padding:14px 16px"><p style="margin:0 0 6px;font-size:11px;letter-spacing:2.5px;color:${R};text-transform:uppercase;font-weight:700">¿Y el incentivo tributario?</p><p style="margin:0 0 6px;font-size:14.5px;line-height:1.5;color:${N}">${INC}</p><p style="margin:0;font-size:14.5px;font-weight:700;color:${N}">El incentivo acelera una decisión. No la reemplaza.</p></td></tr></table></td></tr>`}
<tr><td style="padding:30px 0 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${N}"><tr><td style="padding:26px 28px 28px">
${tag('profundizar')}
<p style="margin:6px 0 18px;font-size:15px;line-height:1.55;color:${C}">Este diagnóstico sale solo de tus respuestas. En la Auditoría ProMatch revisamos tu contenido real, categoría por categoría, y te entregamos un informe con evidencia. El objetivo no es solo que sepas en qué punto está hoy tu proyecto comercial deportivo: es que ganes seguridad y tengas una herramienta para respaldar lo que dices cuando hables con posibles auspiciantes. Y si necesitas ayuda para ponerlo en marcha, conversamos.</p>
<a href="https://wa.me/593984678812?text=${waTxt}" style="display:inline-block;background:${R};color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:13px 20px;margin:0 8px 8px 0">Hablar con un asesor »</a>
<a href="https://promotionec.com/promatch/#como-funciona" style="display:inline-block;background:${C};color:${N};text-decoration:none;font-weight:700;font-size:15px;padding:13px 20px;margin:0 0 8px">Ver la Auditoría ProMatch</a>
<p style="margin:10px 0 0;font-size:14.5px"><a href="https://promotionec.com/deportistas/#fichas" style="color:#ffffff;font-weight:700">Ver casos de deportistas con mejor puntaje »</a></p>
</td></tr></table></td></tr>
<tr><td style="background:${C};font-size:0;line-height:0"><a href="https://promotionec.com/nosotros/"><img src="${A}cierre.jpg" width="600" alt="Lo que creemos: el deporte vale antes de ser rentable." style="display:block;border:0;width:100%;height:auto;font:800 20px ${F};color:${N}"></a></td></tr>
<tr><td style="padding:20px 28px 26px"><p style="margin:0;font-size:12.5px;line-height:1.5;color:#6f665c">Resultado orientativo, calculado solo con tus respuestas. No garantiza auspicios: mide qué tan preparada está tu propuesta comercial, no cuánto vale tu deporte ni tu trayectoria.<br><br>Recibes este correo porque lo pediste al terminar el Diagnosticador en promotionec.com. Si no quieres que te escribamos, responde a este mensaje y te quitamos de la lista. <a href="https://promotionec.com/privacidad/" style="color:#6f665c">Política de privacidad</a>.</p></td></tr>
</table></td></tr></table></body></html>`;
  const tl = (t, a) => { const l = (a || []).filter((x) => x[0]).map((x) => `- ${x[0]}: ${x[1] || ''}${x[2] ? ' (' + x[2] + ')' : ''}`).join('\n'); return l ? `\n\n${t}\n${l}` : ''; };
  const texto = `Hola${nombre ? ' ' + nombre : ''}, aquí está tu diagnóstico completo de Pro Motion.\n\n${d.total}/100 · ${d.nivel}${D.estado ? '\n' + D.estado : ''}` +
    (Object.keys(dims).length ? '\n\nTus dimensiones\n' + Object.keys(dims).map((k) => `- ${k}: ${dims[k]}`).join('\n') : '') +
    (voz.length ? '\n\nAsí te vería hoy una marca\n' + voz.join(' ') : '') + tl('Lo que leemos en tus respuestas', D.lecturas) + tl('Ventajas', D.ventajas) + (arq[0] ? `\n\nOportunidades\n${arq[0]}. ${arq[1] || ''}${arq[2] ? '\nDónde encajas mejor: ' + arq[2] : ''}${arq[3] ? '\nIdea de activación: ' + arq[3] : ''}` : '') +
    tl('Riesgos y conflictos', (D.riesgos || []).map((x) => [x[0], (x[1] || '') + (x[2] ? ' Cómo se resuelve: ' + x[2] : '')])) +
    (plan.length ? '\n\nTu plan, paso a paso' + plan.map((x, i) => `\n\n${i + 1}. ${x[0]}\n${x[1] || ''}\n${x.slice(2, 5).filter(Boolean).map((y) => '   - ' + y).join('\n')}${x[5] ? '\n   Listo cuando: ' + x[5] : ''}`).join('') : tl('Prioridades a 90 días', D.prios)) +
    (porque.length ? '\n\nTu siguiente paso, y por qué\n' + porque.join('\n\n') : '') + tl(porque.length ? 'Opciones' : 'Oferta sugerida', D.oferta) +
    (d.perfil === 'marca' || !D.ec ? '' : '\n\n¿Y el incentivo tributario?\n' + INC) +
    `\n\n¿Quieres profundizarlo? En la Auditoría ProMatch revisamos tu contenido real y te entregamos un informe con evidencia: para que sepas dónde está tu proyecto, ganes seguridad y tengas con qué respaldarte ante posibles auspiciantes.\nEscríbenos: https://wa.me/593984678812\nAuditoría ProMatch: https://promotionec.com/promatch/#como-funciona\nCasos de deportistas con mejor puntaje: https://promotionec.com/deportistas/#fichas\n\nResultado orientativo, calculado solo con tus respuestas. No garantiza auspicios.\nSi no quieres que te escribamos, responde a este mensaje. Privacidad: https://promotionec.com/privacidad/`;
  return { asunto: `Tu diagnóstico Pro Motion: ${d.total}/100 · ${d.nivel}`.slice(0, 140), html, texto };
}
