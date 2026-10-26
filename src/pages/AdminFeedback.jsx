// /admin/feedback and /admin/visibility: the playbook owner's pages.
// Not linked from anywhere. Protected by ADMIN_PASSWORD on the server; the
// password is kept only for this browser tab.
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ALL_CHAPTERS, ALL_TOOL_GROUPS } from '../content.js';
import { Btn } from '../ui.jsx';

const LBL = { fontSize: 10.5, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#63666A' };
const ERR = { margin: 0, fontSize: 13, fontWeight: 600, color: '#D20014' };
const TAB_KEY = 'slp-admin';

function readPw() { try { return sessionStorage.getItem(TAB_KEY) || ''; } catch { return ''; } }
function savePw(v) { try { if (v) sessionStorage.setItem(TAB_KEY, v); else sessionStorage.removeItem(TAB_KEY); } catch { /* storage unavailable */ } }

const fmt = iso => new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
const csvCell = v => '"' + String(v ?? '').replace(/"/g, '""') + '"';

export default function Admin({ narrow, section = 'feedback' }) {
  const [pw, setPw] = useState(readPw);
  const [entries, setEntries] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // Loading the feedback also checks the password.
  const load = async password => {
    setBusy(true); setError('');
    try {
      const res = await fetch('/api/feedback', { headers: { authorization: 'Bearer ' + password }, cache: 'no-store' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setError(data.error || 'Something went wrong.'); if (res.status === 401) savePw(''); return; }
      savePw(password); setEntries(data.entries || []);
    } catch { setError('Could not reach the server.'); } finally { setBusy(false); }
  };
  useEffect(() => { if (pw && !entries) load(pw); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const pad = narrow ? '76px 28px 140px' : '80px 48px 140px';
  if (!entries) return (
    <div style={{ maxWidth: 420, margin: '0 auto', padding: pad }}>
      <form onSubmit={e => { e.preventDefault(); if (pw) load(pw); }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#00638E' }}>Admin</h1>
        <label htmlFor="admin-pw" style={{ fontSize: 13, fontWeight: 700, color: '#63666A' }}>Admin password</label>
        <input id="admin-pw" type="password" autoComplete="current-password" autoFocus value={pw} onChange={e => setPw(e.target.value)} style={{ height: 44, padding: '0 12px', border: '1px solid #D8D9DA', borderRadius: 3, fontSize: 15, outline: 'none' }} />
        {error && <p role="alert" style={ERR}>{error}</p>}
        <button type="submit" disabled={busy || !pw} className="btn btn-primary btn-full tap" style={{ height: 44 }}>{busy ? 'Loading…' : 'Sign in'}</button>
      </form>
    </div>
  );

  const tab = (k, label) => (
    <Link key={k} to={`/admin/${k}`} aria-current={section === k ? 'page' : undefined} className="tap" style={{ padding: '10px 4px', marginBottom: -2, fontSize: 15, fontWeight: 800, borderBottom: `2px solid ${section === k ? '#00638E' : 'transparent'}`, color: section === k ? '#00638E' : '#63666A' }}>{label}</Link>
  );
  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: pad, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <nav aria-label="Admin" style={{ display: 'flex', gap: 24, borderBottom: '2px solid #D8D9DA' }}>{tab('feedback', 'Feedback')}{tab('visibility', 'Visibility')}</nav>
        <Btn variant="ghost" onClick={() => { savePw(''); setPw(''); setEntries(null); }}>Sign out</Btn>
      </div>
      {section === 'visibility'
        ? <Visibility pw={pw} narrow={narrow} />
        : <Feedback entries={entries} busy={busy} error={error} reload={() => load(pw)} narrow={narrow} />}
      <span style={LBL}>Only you can see these pages with the admin password. They are not linked from the playbook.</span>
    </div>
  );
}

function Feedback({ entries, busy, error, reload, narrow }) {
  const [filter, setFilter] = useState('all');
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
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <h1 style={{ margin: 0, fontSize: 34, fontWeight: 800, color: '#00638E' }}>Feedback</h1>
          <span style={{ fontSize: 15, color: '#63666A' }}>{entries.length} entries · {yes} yes · {no} not really · {entries.filter(e => e.comment).length} with a comment</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <Btn onClick={reload} disabled={busy}>{busy ? 'Loading…' : 'Refresh'}</Btn>
          <Btn onClick={csv} disabled={!entries.length}>Download CSV</Btn>
        </div>
      </div>
      <div role="group" aria-label="Show" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {chip('all', 'All')}{chip('comments', 'With a comment')}{chip('yes', 'Yes')}{chip('no', 'Not really')}
      </div>
      {error && <p role="alert" style={ERR}>{error}</p>}
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
    </>
  );
}

// ── Visibility: hide chapters, topics and tools for a phased launch ───
function Switch({ on, onChange, label, disabled }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} disabled={disabled} onClick={() => onChange(!on)} className="tap"
      style={{ flex: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12.5, fontWeight: 700, color: on ? '#0E7C66' : '#63666A', cursor: disabled ? 'default' : 'pointer' }}>
      <span aria-hidden="true" style={{ position: 'relative', width: 38, height: 22, borderRadius: 999, background: on ? '#1AB092' : '#B1B2B4', transition: 'background 160ms ease' }}>
        <span style={{ position: 'absolute', top: 3, left: on ? 19 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 160ms ease' }} />
      </span>
      <span style={{ width: 48 }}>{on ? 'Shown' : 'Hidden'}</span>
    </button>
  );
}

function Row({ title, sub, on, onChange, indent, dim, strong }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: indent ? '10px 20px 10px 44px' : '14px 20px', borderTop: '1px solid #EEEFF0', opacity: dim ? 0.45 : 1, background: strong ? '#F7F8F8' : '#fff' }}>
      <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontSize: strong ? 16 : 14.5, fontWeight: strong ? 800 : 600, color: '#142850' }}>{title}</span>
        {sub && <span style={{ fontSize: 12, color: '#63666A' }}>{sub}</span>}
      </span>
      <Switch on={on} onChange={onChange} label={title} disabled={dim} />
    </div>
  );
}

function Visibility({ pw }) {
  const [saved, setSaved] = useState(null);
  const [hidden, setHidden] = useState(new Set());
  const [status, setStatus] = useState({ busy: false, msg: '', err: '' });
  useEffect(() => {
    fetch('/api/visibility', { cache: 'no-store' }).then(r => r.json()).then(d => { const h = d.hidden || []; setSaved(h); setHidden(new Set(h)); })
      .catch(() => setStatus(s => ({ ...s, err: 'Could not load the current settings.' })));
  }, []);
  const set = (id, show) => { setHidden(h => { const n = new Set(h); if (show) n.delete(id); else n.add(id); return n; }); setStatus({ busy: false, msg: '', err: '' }); };
  const dirty = useMemo(() => saved && (saved.length !== hidden.size || saved.some(id => !hidden.has(id))), [saved, hidden]);
  const save = async () => {
    setStatus({ busy: true, msg: '', err: '' });
    try {
      const res = await fetch('/api/visibility', { method: 'PUT', headers: { authorization: 'Bearer ' + pw, 'content-type': 'application/json' }, body: JSON.stringify({ hidden: [...hidden] }) });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) { setStatus({ busy: false, msg: '', err: d.error || 'Could not save.' }); return; }
      setSaved(d.hidden); setHidden(new Set(d.hidden));
      setStatus({ busy: false, msg: 'Saved. Leaders see the change the next time they open or reload the playbook.', err: '' });
    } catch { setStatus({ busy: false, msg: '', err: 'Could not reach the server.' }); }
  };
  if (!saved) return status.err ? <p role="alert" style={ERR}>{status.err}</p> : <p style={{ margin: 0, color: '#63666A' }}>Loading…</p>;

  const box = { border: '1px solid #D8D9DA', borderRadius: 4, overflow: 'hidden' };
  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 620 }}>
          <h1 style={{ margin: 0, fontSize: 34, fontWeight: 800, color: '#00638E' }}>Visibility</h1>
          <span style={{ fontSize: 15, lineHeight: 1.5, color: '#63666A' }}>Choose what leaders see, for a phased launch. Hidden items disappear from navigation, search and links, and their pages show "Page not found". Hiding a chapter hides all its topics.</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#63666A' }}>{hidden.size} hidden</span>
          <Btn onClick={() => { setHidden(new Set(saved)); setStatus({ busy: false, msg: '', err: '' }); }} disabled={!dirty || status.busy}>Undo changes</Btn>
          <Btn variant="primary" onClick={save} disabled={!dirty || status.busy}>{status.busy ? 'Saving…' : 'Save'}</Btn>
        </div>
      </div>
      {status.err && <p role="alert" style={ERR}>{status.err}</p>}
      {status.msg && <p role="status" style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: '#0E7C66' }}>{status.msg}</p>}

      <h2 style={{ ...LBL, margin: 0, fontSize: 11 }}>Read: chapters and topics</h2>
      <div style={box}>
        {ALL_CHAPTERS.map(({ ch, topics }) => {
          const chOn = !hidden.has(ch.id);
          return (
            <div key={ch.id}>
              <Row strong title={`Chapter ${ch.n} · ${ch.title}`} on={chOn} onChange={v => set(ch.id, v)} />
              {topics.filter(t => !t.link).map(t => (
                <Row key={t.id} indent dim={!chOn} title={t.title} sub={t.group || ''} on={!hidden.has(t.id)} onChange={v => set(t.id, v)} />
              ))}
            </div>
          );
        })}
      </div>

      <h2 style={{ ...LBL, margin: 0, fontSize: 11 }}>Toolbox</h2>
      <div style={box}>
        {ALL_TOOL_GROUPS.map(g => (
          <div key={g.label}>
            <div style={{ padding: '10px 20px', background: '#F2F3F4', borderTop: '1px solid #EEEFF0', ...LBL }}>{g.label}</div>
            {g.items.map(t => <Row key={t.id} title={t.title} sub={t.kind} on={!hidden.has(t.id)} onChange={v => set(t.id, v)} />)}
          </div>
        ))}
      </div>
      <span style={{ fontSize: 12.5, lineHeight: 1.5, color: '#63666A' }}>Hiding is for focus, not security: the text is still part of the app that leaders' browsers download. Meeting cards in the Routines chapter follow their Toolbox tool.</span>
    </>
  );
}
