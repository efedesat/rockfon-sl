// Receives "Was this page useful?" feedback from the playbook.
// The final destination is still to be decided. Until then every entry is
// written to the Vercel function log, and, when FEEDBACK_WEBHOOK_URL is set
// (for example a Teams, Slack or Power Automate webhook), forwarded there
// as JSON. Only the page id, the answer, the optional name and the comment are sent.
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
