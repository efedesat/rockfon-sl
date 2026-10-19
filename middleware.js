// Password gate for the whole site, enforced by Vercel Routing Middleware.
// It runs on Vercel before any file is served, so the playbook cannot be
// reached without the password (unlike a check in browser code).
//
// Settings (Vercel → Project → Settings → Environment Variables):
//   PLAYBOOK_PASSWORD  the shared password (required). After changing it,
//                      redeploy (Deployments → … → Redeploy); no code change
//                      or rebuild of the content is needed. Changing it also
//                      signs every device out.
//   AUTH_SECRET        optional extra signing secret for the cookie.
//
// The password page deliberately carries no brand: no logo, no company name,
// a neutral title and no favicon.
import { next } from '@vercel/functions';

export const config = {
  // Everything except robots.txt goes through the gate.
  matcher: '/((?!robots\\.txt).*)',
};

const COOKIE = 'slp_session';
const MAX_AGE = 60 * 60 * 24 * 30; // remember the device for 30 days
const LOGIN_PATH = '/__signin';

const enc = new TextEncoder();

async function hmac(keyText, msg) {
  const key = await crypto.subtle.importKey('raw', enc.encode(keyText), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(msg));
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function signingKey(password) {
  return (process.env.AUTH_SECRET || '') + '\u0000' + password;
}

// Constant-time comparison of two strings via their HMACs.
async function safeEqual(a, b) {
  const k = 'compare';
  const [x, y] = await Promise.all([hmac(k, a), hmac(k, b)]);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.min(x.length, y.length); i++) diff |= x.charCodeAt(i) ^ y.charCodeAt(i);
  return diff === 0;
}

async function validSession(cookieHeader, password) {
  const m = new RegExp('(?:^|;\\s*)' + COOKIE + '=([^;]+)').exec(cookieHeader || '');
  if (!m) return false;
  const [exp, sig] = decodeURIComponent(m[1]).split('.');
  if (!exp || !sig || !(Number(exp) > Date.now() / 1000)) return false;
  return safeEqual(sig, await hmac(signingKey(password), exp));
}

function safeNext(value) {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') && !value.startsWith('/\\') ? value : '/';
}

const esc = s => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function gatePage(nextPath, error) {
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Sign in</title>
<link rel="icon" href="data:,">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Mulish:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box}
html,body{margin:0;height:100%}
body{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;background:#142850;font-family:'Avenir Next LT Pro',Mulish,system-ui,sans-serif;color:#1A1A1A}
form{width:100%;max-width:380px;background:#fff;border-radius:4px;padding:32px;box-shadow:0 8px 28px rgba(0,0,0,.25);display:flex;flex-direction:column;gap:14px}
h1{margin:0 0 4px;font-size:24px;line-height:1.2;font-weight:800;color:#142850}
label{font-size:13px;font-weight:700;color:#63666A}
input{height:44px;width:100%;padding:0 12px;border:1px solid #D8D9DA;border-radius:3px;font:inherit;font-size:15px;color:#1A1A1A;outline:none}
input:focus{border-color:#45A6DE;box-shadow:0 0 0 3px rgba(69,166,222,.35)}
button{height:44px;width:100%;border:0;border-radius:3px;background:#00638E;color:#fff;font:inherit;font-size:15px;font-weight:700;cursor:pointer;transition:background 160ms ease}
button:hover{background:#00547A}
button:active{background:#00466A}
button:focus-visible{outline:3px solid #45A6DE;outline-offset:2px}
.err{margin:-4px 0 0;font-size:13px;font-weight:600;color:#D20014}
</style>
</head>
<body>
<form method="post" action="${LOGIN_PATH}">
<h1>Enter password</h1>
<label for="pw">Password</label>
<input id="pw" name="password" type="password" autocomplete="current-password" autofocus required${error ? ' aria-invalid="true" aria-describedby="err"' : ''}>
${error ? '<p class="err" id="err" role="alert">That password isn\'t right. Try again.</p>' : ''}
<input type="hidden" name="next" value="${esc(nextPath)}">
<button type="submit">Continue</button>
</form>
</body>
</html>`;
  return new Response(html, {
    status: 401,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'x-robots-tag': 'noindex, nofollow',
    },
  });
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const password = process.env.PLAYBOOK_PASSWORD || '';

  if (url.pathname === LOGIN_PATH && request.method === 'POST') {
    let form;
    try { form = await request.formData(); } catch { form = new FormData(); }
    const given = String(form.get('password') || '');
    const dest = safeNext(String(form.get('next') || '/'));
    if (!password || !(await safeEqual(given, password))) return gatePage(dest, true);
    const exp = String(Math.floor(Date.now() / 1000) + MAX_AGE);
    const value = exp + '.' + (await hmac(signingKey(password), exp));
    return new Response(null, {
      status: 303,
      headers: {
        location: dest,
        'cache-control': 'no-store',
        'set-cookie': `${COOKIE}=${encodeURIComponent(value)}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Lax`,
      },
    });
  }

  if (password && (await validSession(request.headers.get('cookie'), password))) {
    if (url.pathname === LOGIN_PATH) return Response.redirect(new URL('/', url), 303);
    return next();
  }

  if (!password) console.error('PLAYBOOK_PASSWORD is not set; nobody can sign in.');
  const wanted = url.pathname === LOGIN_PATH ? '/' : url.pathname + url.search;
  return gatePage(safeNext(wanted), false);
}
