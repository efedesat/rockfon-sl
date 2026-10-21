// /admin/feedback: the playbook owner's view of "Was this page useful?" entries.
// Not linked from anywhere. Protected by ADMIN_PASSWORD on the server; the
// password is kept only for this browser tab.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Btn } from '../ui.jsx';

const LBL = { fontSize: 10.5, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#63666A' };
const TAB_KEY = 'slp-admin';

function readPw() { try { return sessionStorage.getItem(TAB_KEY) || ''; } catch { return ''; } }
function savePw(v) { try { if (v) sessionStorage.setItem(TAB_KEY, v); else sessionStorage.removeItem(TAB_KEY); } catch { /* storage unavailable */ } }

const fmt = iso => new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
const csvCell = v => '"' + String(v ?? '').replace(/"/g, '""') + '"';

export default function AdminFeedback({ narrow }) {
  const [pw, setPw] = useState(readPw);
  const [entries, setEntries] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState('all');

  const load = async password => {
    setBusy(true); setError('');
    try {
      const res = await fetch('/api/feedback', { headers: { authorization: 'Bearer ' + password }, cache: 'no-store' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setError(data.error || 'Something went wrong.'); if (res.status === 401) savePw(''); return; }
      savePw(password); setEntries(data.entries || []);
    } catch { setError('Could not reach the server.'); } finally { setBusy(false); }
  };

  const pad = narrow ? '76px 28px 140px' : '80px 48px 140px';
  if (!entries) return (
    <div style={{ maxWidth: 420, margin: '0 auto', padding: pad }}>
      <form onSubmit={e => { e.preventDefault(); if (pw) load(pw); }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#00638E' }}>Feedback</h1>
        <label htmlFor="admin-pw" style={{ fontSize: 13, fontWeight: 700, color: '#63666A' }}>Admin password</label>
        <input id="admin-pw" type="password" autoComplete="current-password" autoFocus value={pw} onChange={e => setPw(e.target.value)} style={{ height: 44, padding: '0 12px', border: '1px solid #D8D9DA', borderRadius: 3, fontSize: 15, outline: 'none' }} />
        {error && <p role="alert" style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#D20014' }}>{error}</p>}
        <button type="submit" disabled={busy || !pw} className="btn btn-primary btn-full tap" style={{ height: 44 }}>{busy ? 'Loading…' : 'Show feedback'}</button>
      </form>
    </div>
  );

  const yes = entries.filter(e => e.answer === 'yes').length, no = entries.filter(e => e.answer === 'no').length;
  const shown = entries.filter(e => filter === 'all' || (filter === 'comments' ? e.comment : e.answer === filter));
  const csv = () => {
    const rows = [['Date', 'Page', 'Path', 'Answer', 'Name', 'Comment'], ...entries.map(e => [e.at, e.title, e.page, e.answer === 'yes' ? 'Yes' : e.answer === 'no' ? 'Not really' : '', e.name, e.comment])];
    const url = URL.createObjectURL(new Blob([rows.map(r => r.map(csvCell).join(',')).join('\n')], { type: 'text/csv' }));
    const a = document.createElement('a'); a.href = url; a.download = 'playbook-feedback.csv'; a.click(); URL.revokeObjectURL(url);
  };
  const chip = (k, label) => (
    <button key={k} type="button" aria-pressed={filter === k} onClick={() => setFilter(k)} className="tap tr" style={{ padding: '7px 14px', borderRadius: 999, fontSize: 13, fontWeight: 700, border: '1px solid #00638E', background: filter === k ? '#00638E' : '#fff', color: filter === k ? '#fff' : '#00638E' }}>{label}</button>
  );

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: pad, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <h1 style={{ margin: 0, fontSize: 34, fontWeight: 800, color: '#00638E' }}>Feedback</h1>
          <span style={{ fontSize: 15, color: '#63666A' }}>{entries.length} entries · {yes} yes · {no} not really · {entries.filter(e => e.comment).length} with a comment</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <Btn onClick={() => load(pw)} disabled={busy}>{busy ? 'Loading…' : 'Refresh'}</Btn>
          <Btn onClick={csv} disabled={!entries.length}>Download CSV</Btn>
          <Btn variant="ghost" onClick={() => { savePw(''); setPw(''); setEntries(null); }}>Sign out</Btn>
        </div>
      </div>
      <div role="group" aria-label="Show" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {chip('all', 'All')}{chip('comments', 'With a comment')}{chip('yes', 'Yes')}{chip('no', 'Not really')}
      </div>
      {error && <p role="alert" style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#D20014' }}>{error}</p>}
      {shown.length ? (
        <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid #D8D9DA', borderRadius: 4 }}>
          {shown.map((e, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: narrow ? 'minmax(0,1fr)' : '170px minmax(0,1fr) 120px', gap: '6px 20px', padding: '16px 20px', borderTop: i ? '1px solid #EEEFF0' : 'none' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#142850' }}>{fmt(e.at)}</span>
                <span style={{ fontSize: 13, color: '#63666A' }}>{e.name || 'No name'}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
                {e.page ? <Link to={e.page} style={{ fontSize: 15, fontWeight: 800 }}>{e.title || e.page}</Link> : <span style={{ fontSize: 15, fontWeight: 800 }}>{e.title || 'Unknown page'}</span>}
                {e.comment ? <span style={{ fontSize: 15, lineHeight: 1.55, color: '#1A1A1A', whiteSpace: 'pre-wrap' }}>{e.comment}</span> : <span style={{ fontSize: 13, color: '#8A8D91' }}>No comment</span>}
              </div>
              <div>
                {e.answer && <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 999, fontSize: 12, fontWeight: 800, background: e.answer === 'yes' ? '#DFF3EE' : '#FBE6E8', color: e.answer === 'yes' ? '#0E7C66' : '#B00011' }}>{e.answer === 'yes' ? 'Yes' : 'Not really'}</span>}
              </div>
            </div>
          ))}
        </div>
      ) : <p style={{ margin: 0, fontSize: 15, color: '#63666A' }}>{entries.length ? 'Nothing matches this filter.' : 'No feedback yet.'}</p>}
      <span style={LBL}>Only you can see this page with the admin password. It is not linked from the playbook.</span>
    </div>
  );
}
