import { useEffect, useRef, useState } from 'react';
import { Link, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { BY, CHAPTERS, KEY_TOOLS, TOPICS, TOOLS, pathOf, qbCats, secOf, topicPath } from './content.js';
import { clearMyNotes, useStored } from './store.js';
import { Icon } from './ui.jsx';
import Home from './pages/Home.jsx';
import Guide from './pages/Guide.jsx';
import Chapter from './pages/Chapter.jsx';
import Topic from './pages/Topic.jsx';
import Toolbox from './pages/Toolbox.jsx';
import Tool from './pages/Tool.jsx';

export function useNarrow() {
  const get = () => typeof window !== 'undefined' && window.innerWidth < 1000;
  const [narrow, setNarrow] = useState(get);
  useEffect(() => { const on = () => setNarrow(get()); window.addEventListener('resize', on); return () => window.removeEventListener('resize', on); }, []);
  return narrow;
}

// Works out which page is showing, for the header tabs, back pill and feedback.
function usePage() {
  const { pathname, state } = useLocation();
  const parts = pathname.split('/').filter(Boolean);
  if (!parts.length) return { view: 'home' };
  if (parts[0] === 'guide') return { view: 'guide' };
  if (parts[0] === 'read' && parts[2] && BY[parts[2]] && !BY[parts[2]].isTool) return { view: 'topic', cur: BY[parts[2]] };
  if (parts[0] === 'read' && BY[parts[1]] && BY[parts[1]].isChapter) return { view: 'room', cur: BY[parts[1]] };
  if (parts[0] === 'toolbox' && parts[1] && BY[parts[1]] && BY[parts[1]].isTool) return { view: 'tool', cur: BY[parts[1]], from: state && state.from };
  if (parts[0] === 'toolbox') return { view: 'toolbox' };
  return { view: 'notfound' };
}

function Search({ narrow }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const box = useRef(null);
  useEffect(() => {
    const off = e => { if (box.current && !box.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', off);
    return () => document.removeEventListener('mousedown', off);
  }, []);
  const qq = q.trim().toLowerCase();
  const subTitles = t => { const s = secOf(t); return s ? s.subs.map(x => x.title).join(' ') : ''; };
  const results = qq ? [...TOPICS.filter(p => !p.link), ...TOOLS].filter(p => (p.title + ' ' + (p.ch ? p.ch.title : p.group) + ' ' + (p.kind || '') + ' ' + subTitles(p) + (p.type === 'qbank' ? ' ' + qbCats().map(c => c.title).join(' ') : '')).toLowerCase().includes(qq)).slice(0, 6) : [];
  const go = p => { setQ(''); setOpen(false); navigate(pathOf(p)); };
  return (
    <div ref={box} style={{ position: 'relative', width: narrow ? 170 : 240 }} onKeyDown={e => { if (e.key === 'Escape') { setOpen(false); } }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 38, padding: '0 12px', borderRadius: 4, background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.22)' }}>
        {Icon.search()}
        <input type="search" aria-label="Search" value={q} onChange={e => { setQ(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)}
          onKeyDown={e => { if (e.key === 'Enter' && results[0]) go(results[0]); }}
          placeholder="Search" style={{ flex: 1, minWidth: 0, background: 'transparent', border: 0, outline: 'none', color: '#fff', fontSize: 13, boxShadow: 'none' }} />
      </div>
      {open && qq && (
        <div role="listbox" style={{ position: 'absolute', top: 44, right: 0, width: 340, maxWidth: '90vw', background: '#fff', color: '#1A1A1A', border: '1px solid #D8D9DA', borderRadius: 4, boxShadow: '0 8px 24px rgba(20,40,80,.16)', padding: 6, display: 'flex', flexDirection: 'column', zIndex: 60 }}>
          {results.map(p => (
            <Link key={p.id} to={pathOf(p)} onClick={() => { setQ(''); setOpen(false); }} className="hv-cloud" style={{ padding: '9px 10px', borderRadius: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#63666A' }}>{p.ch ? `Read · ${p.ch.title}` : 'Toolbox'}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#00638E' }}>{p.title}</span>
            </Link>
          ))}
          {!results.length && <div style={{ padding: 10, fontSize: 13, color: '#63666A' }}>Nothing matches this search.</div>}
        </div>
      )}
    </div>
  );
}

function Translate() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button type="button" aria-expanded={open} onClick={() => setOpen(o => !o)} title="Translate this page" className="hv-white12 tap" style={{ display: 'flex', alignItems: 'center', gap: 6, height: 38, padding: '0 10px', borderRadius: 4, fontSize: 13, fontWeight: 700 }}>
        {Icon.globe()}EN
      </button>
      {open && (
        <div role="dialog" aria-label="Read in your language" style={{ position: 'absolute', top: 46, right: 0, zIndex: 60, width: 300, padding: '18px 20px', background: '#fff', color: '#1A1A1A', borderRadius: 4, boxShadow: '0 8px 28px rgba(20,40,80,.22)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: '#142850' }}>Read in your language</span>
            <button type="button" aria-label="Close" onClick={() => setOpen(false)} className="tap" style={{ fontSize: 18, lineHeight: 1, color: '#63666A' }}>×</button>
          </div>
          <span style={{ fontSize: 14, lineHeight: 1.5 }}>The playbook is written in English. Use your browser to translate it.</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13.5, lineHeight: 1.45 }}>
            <div style={{ display: 'flex', gap: 8 }}><span style={{ fontWeight: 800, color: '#00638E' }}>1</span><span>Right-click anywhere on the page.</span></div>
            <div style={{ display: 'flex', gap: 8 }}><span style={{ fontWeight: 800, color: '#00638E' }}>2</span><span>Select <strong>Translate</strong> and choose your language.</span></div>
          </div>
          <span style={{ fontSize: 12, lineHeight: 1.45, color: '#63666A' }}>On a tablet, use the browser menu and look for Translate. Machine translation may not be exact.</span>
        </div>
      )}
    </div>
  );
}

function Header({ readSide, narrow, onContents }) {
  const tab = on => ({ padding: '9px 14px', fontSize: 14, fontWeight: 700, borderBottom: '2px solid ' + (on ? '#fff' : 'transparent'), color: on ? '#fff' : 'rgba(255,255,255,.7)' });
  return (
    <header style={{ flex: 'none', height: 60, background: '#142850', color: '#fff', display: 'flex', alignItems: 'center', gap: narrow ? 10 : 18, padding: '0 20px', position: 'relative', zIndex: 40 }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 16, color: '#fff' }}>
        <img src="/assets/logo-rockfon-white.svg" alt="Rockfon – Home" style={{ height: 22, display: 'block' }} />
        {!narrow && <span style={{ display: 'flex', alignItems: 'center', gap: 16 }}><span style={{ width: 1, height: 24, background: 'rgba(255,255,255,.25)' }} /><span style={{ fontWeight: 700, fontSize: 15, whiteSpace: 'nowrap' }}>Sales Leadership Playbook</span></span>}
      </Link>
      <div style={{ flex: 1 }} />
      <nav aria-label="Main" style={{ display: 'flex', gap: 4 }}>
        <Link to="/" aria-current={readSide ? 'page' : undefined} className="tap" style={tab(readSide)}>Read</Link>
        <Link to="/toolbox" aria-current={!readSide ? 'page' : undefined} className="tap" style={tab(!readSide)}>Toolbox</Link>
      </nav>
      <Search narrow={narrow} />
      <Translate />
      <button type="button" onClick={onContents} className="hv-white12 tap" style={{ display: 'flex', alignItems: 'center', gap: 8, height: 38, padding: '0 12px', borderRadius: 4, fontSize: 13, fontWeight: 700 }}>
        {Icon.menu()}Contents
      </button>
    </header>
  );
}

function Contents({ onClose }) {
  const [cleared, setCleared] = useState(false);
  useEffect(() => { const k = e => { if (e.key === 'Escape') onClose(); }; window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, [onClose]);
  return (
    <div role="dialog" aria-modal="true" aria-label="Contents" style={{ position: 'absolute', inset: 0, zIndex: 35, background: '#142850', color: '#fff', overflowY: 'auto', overflowX: 'hidden' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '36px 40px 60px', display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>Contents</h2>
          <Link to="/guide" onClick={onClose} className="hv-underline" style={{ marginLeft: 24, fontSize: 14, fontWeight: 700, color: '#D6B874' }}>How to use this playbook →</Link>
          <button type="button" autoFocus aria-label="Close contents" onClick={onClose} className="hv-white12" style={{ marginLeft: 'auto', width: 44, height: 44, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Icon.close()}</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 28 }}>
          {CHAPTERS.map(ch => {
            const topics = ch.topics.filter(t => !t.link);
            return (
              <div key={ch.id} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Link to={`/read/${ch.id}`} onClick={onClose} style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,.2)', color: '#fff' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', opacity: 0.65 }}>CHAPTER {ch.n}</span>
                  <span style={{ fontSize: 18, fontWeight: 800 }}>{ch.title}</span>
                </Link>
                {topics.slice(0, 4).map(t => <Link key={t.id} to={topicPath(t)} onClick={onClose} className="hv-op1" style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.35, opacity: 0.85, color: '#fff' }}>{t.title}</Link>)}
                {topics.length > 4 && <Link to={`/read/${ch.id}`} onClick={onClose} className="hv-underline" style={{ fontSize: 13, fontWeight: 700, color: '#45A6DE' }}>All {topics.length} topics →</Link>}
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,.2)' }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#D6B874' }}>Toolbox</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {KEY_TOOLS.map(id => <Link key={id} to={`/toolbox/${id}`} onClick={onClose} className="hv-white20" style={{ padding: '8px 14px', borderRadius: 999, background: 'rgba(255,255,255,.1)', fontSize: 13, fontWeight: 700, color: '#fff' }}>{BY[id].title}</Link>)}
            <Link to="/toolbox" onClick={onClose} className="hv-underline" style={{ padding: '8px 14px', fontSize: 13, fontWeight: 700, color: '#D6B874' }}>See all tools →</Link>
          </div>
        </div>
        <div style={{ paddingTop: 12, borderTop: '1px solid rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', fontSize: 13 }}>
          <button type="button" className="hv-underline" onClick={() => { if (window.confirm('Clear all your notes, answers, ticks and worksheet scores from this device?')) { clearMyNotes(); setCleared(true); } }} style={{ fontWeight: 700, color: 'rgba(255,255,255,.75)' }}>Clear my notes</button>
          {cleared && <span role="status" style={{ color: '#1AB092', fontWeight: 700 }}>Cleared from this device</span>}
        </div>
      </div>
    </div>
  );
}

function Feedback({ page }) {
  const [state, setState] = useState('closed');
  const [val, setVal] = useState(null);
  const [comment, setComment] = useState('');
  const { pathname } = useLocation();
  useEffect(() => { setState(s => (s === 'sent' ? 'closed' : s)); }, [pathname]);
  const send = () => {
    fetch('/api/feedback', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ page: pathname, title: page, answer: val, comment }) }).catch(() => {});
    setState('sent'); setVal(null); setComment('');
  };
  const box = { position: 'absolute', right: 24, bottom: 24, zIndex: 25 };
  if (state === 'sent') return <button type="button" className="no-print" onClick={() => setState('closed')} role="status" style={{ ...box, padding: '11px 16px', background: '#1AB092', color: '#fff', borderRadius: 3, fontSize: 13, fontWeight: 700, boxShadow: '0 4px 12px rgba(20,40,80,.22)' }}>Thanks, your feedback was sent</button>;
  if (state === 'closed') return (
    <button type="button" className="no-print hv-bd-blue tap" onClick={() => setState('open')} style={{ ...box, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#fff', color: '#00638E', border: '1px solid #D8D9DA', borderRadius: 3, fontSize: 13, fontWeight: 700, boxShadow: '0 4px 12px rgba(20,40,80,.14)' }}>{Icon.chat()}Feedback</button>
  );
  const yn = on => ({ flex: 1, padding: '9px 0', textAlign: 'center', border: '2px solid #00638E', borderRadius: 3, fontSize: 13, fontWeight: 700, background: on ? '#00638E' : '#fff', color: on ? '#fff' : '#00638E' });
  return (
    <div role="dialog" aria-label="Was this page useful?" className="no-print" style={{ ...box, width: 300, background: '#fff', border: '1px solid #D8D9DA', borderRadius: 4, boxShadow: '0 8px 24px rgba(20,40,80,.18)', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', fontSize: 14, fontWeight: 800, color: '#142850' }}>Was this page useful?<button type="button" aria-label="Close" onClick={() => { setState('closed'); setVal(null); }} className="tap" style={{ marginLeft: 'auto', color: '#63666A', fontSize: 18, lineHeight: 1 }}>×</button></div>
      <div style={{ fontSize: 12, color: '#63666A' }}>{page}</div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" aria-pressed={val === 'yes'} onClick={() => setVal('yes')} className="tap" style={yn(val === 'yes')}>Yes</button>
        <button type="button" aria-pressed={val === 'no'} onClick={() => setVal('no')} className="tap" style={yn(val === 'no')}>Not really</button>
      </div>
      <textarea aria-label="Comment (optional)" value={comment} onChange={e => setComment(e.target.value)} placeholder="What's missing or unclear? (optional)" style={{ height: 72, resize: 'none', border: '1px solid #B1B2B4', borderRadius: 3, padding: '8px 10px', fontSize: 13, outline: 'none' }} />
      <button type="button" className="btn btn-primary btn-full tap" onClick={send}>Send feedback</button>
    </div>
  );
}

function BackPill({ to, label }) {
  return (
    <div className="no-print" style={{ position: 'sticky', top: 0, height: 0, zIndex: 30 }}>
      <Link to={to} className="hv-blue tr" style={{ position: 'absolute', top: 16, left: 20, display: 'flex', alignItems: 'center', gap: 8, maxWidth: 280, padding: '9px 16px 9px 12px', borderRadius: 999, background: '#fff', boxShadow: '0 2px 10px rgba(20,40,80,.18)', fontSize: 13, fontWeight: 700, color: '#142850', minHeight: 40 }}>
        {Icon.back()}
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
      </Link>
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '80px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h1 style={{ margin: 0, fontSize: 34, fontWeight: 800, color: '#00638E' }}>Page not found</h1>
      <Link to="/" style={{ fontWeight: 800 }}>Sales Excellence →</Link>
    </div>
  );
}

export default function App() {
  const narrow = useNarrow();
  const page = usePage();
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const mainRef = useRef(null);
  const [contents, setContents] = useState(false);
  const [, setLastRead] = useStored('lastRead', null);

  useEffect(() => { if (mainRef.current) mainRef.current.scrollTop = 0; setContents(false); }, [pathname]);
  useEffect(() => { if (page.view === 'topic') setLastRead(page.cur.id); }, [page.view, page.cur, setLastRead]);
  useEffect(() => {
    const t = page.cur ? page.cur.title : page.view === 'toolbox' ? 'Toolbox' : page.view === 'guide' ? 'How to use this playbook' : '';
    document.title = (t ? t + ' · ' : '') + 'Sales Leadership Playbook';
  }, [page]);

  const fromCh = page.view === 'tool' && page.from && BY[page.from] && BY[page.from].isChapter ? BY[page.from] : null;
  const fromHome = page.view === 'tool' && page.from === 'home';
  const readSide = ['home', 'guide', 'room', 'topic'].includes(page.view) || !!fromCh || fromHome;
  const back = page.view === 'room' || page.view === 'guide' ? { to: '/', label: 'All chapters' }
    : page.view === 'topic' ? { to: `/read/${page.cur.ch.id}`, label: page.cur.ch.title }
      : page.view === 'tool' ? (fromCh ? { to: `/read/${fromCh.id}`, label: fromCh.title } : fromHome ? { to: '/', label: 'Home' } : { to: '/toolbox', label: 'Toolbox' })
        : null;
  const fbPage = page.view === 'home' ? 'Home' : page.view === 'toolbox' ? 'Toolbox' : page.view === 'guide' ? 'How to use this playbook' : page.cur ? page.cur.title : '';

  // Links inside playbook text are plain <a> tags; keep internal ones in the app.
  const onMainClick = e => {
    const a = e.target.closest && e.target.closest('a');
    if (!a || a.target || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const url = new URL(a.href, window.location.href);
    if (url.origin !== window.location.origin || url.pathname.startsWith('/api/')) return;
    if (url.pathname + url.search === pathname + search && url.hash) return;
    e.preventDefault();
    navigate(url.pathname + url.search + url.hash);
  };

  return (
    <div className="app-root" style={{ position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#fff', color: '#1A1A1A' }}>
      <Header readSide={readSide} narrow={narrow} onContents={() => setContents(true)} />
      <div style={{ flex: 1, minHeight: 0, position: 'relative', display: 'flex' }}>
        <main ref={mainRef} id="main" className="app-main" onClick={onMainClick} style={{ flex: 1, minWidth: 0, overflowY: 'auto', position: 'relative' }}>
          {back && <BackPill to={back.to} label={back.label} />}
          <Routes>
            <Route path="/" element={<Home narrow={narrow} />} />
            <Route path="/guide" element={<Guide narrow={narrow} />} />
            <Route path="/read/:chapterId" element={<ChapterRoute narrow={narrow} />} />
            <Route path="/read/:chapterId/:topicId" element={<TopicRoute narrow={narrow} mainRef={mainRef} />} />
            <Route path="/toolbox" element={<Toolbox narrow={narrow} />} />
            <Route path="/toolbox/:toolId" element={<ToolRoute narrow={narrow} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        {contents && <Contents onClose={() => setContents(false)} />}
        <Feedback page={fbPage} />
      </div>
    </div>
  );
}

function ChapterRoute(p) { const { chapterId } = useParams(); const ch = BY[chapterId]; return ch && ch.isChapter ? <Chapter key={ch.id} ch={ch} {...p} /> : <NotFound />; }
function TopicRoute(p) { const { topicId } = useParams(); const t = BY[topicId]; return t && t.ch && !t.link ? <Topic key={t.id} t={t} {...p} /> : <NotFound />; }
function ToolRoute(p) { const { toolId } = useParams(); const t = BY[toolId]; return t && t.isTool ? <Tool key={t.id} tool={t} {...p} /> : <NotFound />; }

