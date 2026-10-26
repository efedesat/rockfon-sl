// Shared helpers for the API functions. The leading underscore keeps Vercel
// from treating this file as an endpoint.
import { createHash, timingSafeEqual } from 'node:crypto';

const redisUrl = () => process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const redisToken = () => process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
export const hasStore = () => !!(redisUrl() && redisToken());

// One Redis command over Upstash's REST API.
export async function redis(...command) {
  const res = await fetch(redisUrl(), {
    method: 'POST',
    headers: { authorization: `Bearer ${redisToken()}`, 'content-type': 'application/json' },
    body: JSON.stringify(command),
  });
  if (!res.ok) throw new Error(`Redis ${command[0]} failed: ${res.status}`);
  return (await res.json()).result;
}

function samePassword(given, expected) {
  const h = s => createHash('sha256').update(String(s)).digest();
  return timingSafeEqual(h(given), h(expected));
}

export const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });

// Returns an error Response unless the request carries "Authorization: Bearer <ADMIN_PASSWORD>".
export function requireAdmin(request) {
  const admin = process.env.ADMIN_PASSWORD;
  if (!admin) return json({ error: 'ADMIN_PASSWORD is not set in Vercel.' }, 503);
  const given = (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  if (!given || !samePassword(given, admin)) return json({ error: 'Wrong password.' }, 401);
  return null;
}
