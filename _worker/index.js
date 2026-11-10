// Worker de promotionec.com
// - Sirve la web estática (ASSETS).
// - /api/pago/crear      → prepara el cobro en Payphone (los montos salen del catálogo, nunca del navegador).
// - /api/pago/confirmar  → confirma el cobro con Payphone (obligatorio en < 5 min o Payphone lo reversa).
// - /guias/de-deportista-a-oferta-comercial/ → capítulo 1 gratis; capítulo 2 en adelante solo con acceso pagado.
//
// Secretos (Cloudflare → Workers → promotionec → Settings → Variables and Secrets):
//   PAYPHONE_TOKEN    Token de la app "Pro Motion Web" en Payphone Developer
//   PAYPHONE_STORE_ID StoreID de la misma app
// Mientras PAYPHONE_TOKEN no exista, la guía sigue abierta y el carrito cotiza por WhatsApp.

import CATALOGO from '../assets/catalogo.json';

const PP = 'https://pay.payphonetodoesposible.com/api/button';
const GUIA = '/guias/de-deportista-a-oferta-comercial/';
const PRODUCTO_GUIA = 'guia-oferta';
const POR_ID = Object.fromEntries(CATALOGO.map((p) => [p.id, p]));

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    try {
      if (url.pathname === '/api/pago/crear' && req.method === 'POST') return await crear(req, env, url);
      if (url.pathname === '/api/pago/confirmar' && req.method === 'POST') return await confirmar(req, env);
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

  const total = lineas.reduce((s, l) => s + centavos(l.p.precio) * l.q, 0);
  const tieneGuia = lineas.some((l) => l.p.id === PRODUCTO_GUIA);
  const rnd = b64url(crypto.getRandomValues(new Uint8Array(6)));
  const txid = (tieneGuia ? 'PMG-' : 'PM-') + Date.now().toString(36) + '-' + rnd;
  const origen = url.origin;
  const volver = typeof body.volver === 'string' && body.volver.startsWith('/') && !body.volver.startsWith('//') ? body.volver : '/';
  const referencia = ('Pro Motion: ' + lineas.map((l) => (l.q > 1 ? l.q + 'x ' : '') + l.p.n).join(' + ')).slice(0, 100);

  const datos = {
    amount: total,
    amountWithoutTax: total,
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
        totalAmount: centavos(l.p.precio) * l.q, taxAmount: 0, productDescription: l.p.d || l.p.tipo,
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
