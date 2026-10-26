// "Was this page useful?" feedback from the playbook.
//
// POST stores an entry: page id, page title, answer, optional name and comment.
// Every entry is written to the function log, saved in Redis when a store is
// connected, and forwarded to FEEDBACK_WEBHOOK_URL when that is set.
// GET returns the saved entries for the /admin/feedback page. It requires
// "Authorization: Bearer <ADMIN_PASSWORD>".
//
// Settings (Vercel → Project → Settings → Environment Variables):
//   ADMIN_PASSWORD        password for /admin/feedback (keep it different from
//                         the site password, which every leader knows)
//   KV_REST_API_URL /     added automatically when an Upstash Redis store is
//   KV_REST_API_TOKEN     connected (Storage → Marketplace → Upstash → Redis);
//                         UPSTASH_REDIS_REST_URL / _TOKEN work too
//   FEEDBACK_WEBHOOK_URL  optional: Teams, Slack or Power Automate webhook
import { hasStore, json, redis, requireAdmin } from './_lib.js';

const KEY = 'playbook:feedback';
const KEEP = 5000;

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return new Response('Bad request', { status: 400 }); }
  const entry = {
    page: String(body.page || '').slice(0, 200),
    title: String(body.title || '').slice(0, 300),
    answer: body.answer === 'yes' || body.answer === 'no' ? body.answer : null,
    name: String(body.name || '').slice(0, 200),
    comment: String(body.comment || '').slice(0, 4000),
    at: new Date().toISOString(),
  };
  console.log('playbook-feedback', JSON.stringify(entry));
  if (hasStore()) {
    try {
      await redis('LPUSH', KEY, JSON.stringify(entry));
      await redis('LTRIM', KEY, 0, KEEP - 1);
    } catch (e) {
      console.error('feedback store failed', e);
    }
  }
  const hook = process.env.FEEDBACK_WEBHOOK_URL;
  if (hook) {
    try {
      await fetch(hook, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(entry) });
    } catch (e) {
      console.error('feedback webhook failed', e);
    }
  }
  return new Response(null, { status: 204 });
}

export async function GET(request) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  if (!hasStore()) return json({ error: 'No feedback store is connected yet. Connect an Upstash Redis store to this project in Vercel.' }, 503);
  try {
    const rows = await redis('LRANGE', KEY, 0, KEEP - 1);
    const entries = (rows || []).map(r => { try { return JSON.parse(r); } catch { return null; } }).filter(Boolean);
    return json({ entries });
  } catch (e) {
    console.error('feedback read failed', e);
    return json({ error: 'Could not read the feedback store.' }, 502);
  }
}
