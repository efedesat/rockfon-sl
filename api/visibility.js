// Which chapters, topics and tools are hidden from the playbook (phased launch).
// GET: the list of hidden ids, for every signed-in visitor. Empty when nothing
//      is stored, so by default everything shows.
// PUT: { hidden: [...] } replaces the list. Requires the admin password.
import { hasStore, json, redis, requireAdmin } from './_lib.js';

const KEY = 'playbook:visibility';

export async function GET() {
  if (!hasStore()) return json({ hidden: [] });
  try {
    const raw = await redis('GET', KEY);
    const v = raw ? JSON.parse(raw) : {};
    return json({ hidden: Array.isArray(v.hidden) ? v.hidden : [] });
  } catch (e) {
    console.error('visibility read failed', e);
    return json({ hidden: [] });
  }
}

export async function PUT(request) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  if (!hasStore()) return json({ error: 'No store is connected. Connect an Upstash Redis store to this project in Vercel.' }, 503);
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Bad request.' }, 400); }
  const hidden = Array.isArray(body.hidden) ? [...new Set(body.hidden.filter(x => typeof x === 'string' && x.length <= 120))].slice(0, 500) : null;
  if (!hidden) return json({ error: 'Bad request.' }, 400);
  await redis('SET', KEY, JSON.stringify({ hidden, at: new Date().toISOString() }));
  return json({ hidden });
}
