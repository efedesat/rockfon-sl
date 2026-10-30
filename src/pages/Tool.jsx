import { useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { isShown, LIB, POCKETS, qbCats, secOf, strip, tierOf, W } from '../content.js';
import { Blocks, jumpTo, Rich, Section, ST } from '../blocks.jsx';
import { useStoredMap } from '../store.js';
import { Bar, Bars, Btn, Icon, PillToggle, Tag, TierLabel } from '../ui.jsx';
import Meeting from './Meeting.jsx';
import DealRoom from './DealRoom.jsx';
import Dashboard from './Dashboard.jsx';
import Terms from './Terms.jsx';

const LBL = { fontSize: 11, fontWeight: 700, letterSpacing: '.12em', color: '#63666A' };

// ── Document tools (Personal development meetings, Must-Win Opportunity Deep-dive) ──
function Doc({ tool, from }) {
  const sec = secOf(tool);
  const [params, setParams] = useSearchParams();
  const body = <Section sec={sec} toc linkFrom={from || null} exceptTool={tool.id} />;
  if (!(sec && /must-win opportunity deep-dive/i.test(sec.title))) return body;
  // The deep-dive page has two tabs: the guide text and the tool itself (?view=tool).
  const view = params.get('view') === 'tool' ? 'tool' : 'description';
  const setView = v => setParams(v === 'tool' ? { view: 'tool' } : {}, { replace: true });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
      <div role="tablist" aria-label="Deep-dive views" className="no-print" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 6, padding: 6, background: '#F2F3F4', borderRadius: 6 }}>
        {[['description', 'Description'], ['tool', 'Tool']].map(([k, label]) => {
          const on = view === k;
          return (
            <button key={k} type="button" role="tab" aria-selected={on} onClick={() => setView(k)} className="tr tap" style={{ padding: '12px 16px', borderRadius: 4, background: on ? '#fff' : 'transparent', boxShadow: on ? '0 1px 4px rgba(20,40,80,.14)' : 'none', fontSize: 15, fontWeight: 800, color: on ? '#00638E' : '#142850' }}>{label}</button>
          );
        })}
      </div>
      <div role="tabpanel">{view === 'tool' ? <DealRoom storeKey={tool.id} eyebrow="MUST-WIN OPPORTUNITY DEEP-DIVE" /> : body}</div>
    </div>
  );
}

// ── Records: fillable tables, saved on the device ─────────────────────
function Record({ tool }) {
  const sec = secOf(tool);
  const [rec, setRec, setAll] = useStoredMap('records');
  const clear = () => setAll(r => { const o = { ...r }; Object.keys(o).forEach(x => { if (x.startsWith(tool.id + ':')) delete o[x]; }); return o; });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {(sec ? sec.intro : []).map((b, i) => {
        if (b.t !== 'table') return <Blocks key={i} list={[b]} lede={i === 0} />;
        const cols = b.head.length, grid = cols >= 3 ? 'minmax(0,1.1fr) ' + 'minmax(0,1fr) '.repeat(cols - 1) : 'minmax(0,1fr) minmax(0,1.7fr)';
        return (
          <div key={i} style={{ border: '1px solid #D8D9DA', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: grid, background: '#F2F3F4' }}>{b.head.map((h, j) => <Rich key={j} as="div" style={{ padding: '12px 16px', fontSize: 12.5, fontWeight: 800, color: '#142850' }} html={h} />)}</div>
            {b.rows.map((r, j) => (
              <div key={j} style={{ display: 'grid', gridTemplateColumns: grid, borderTop: '1px solid #EEEFF0', alignItems: 'start' }}>
                <Rich as="div" style={{ padding: '14px 16px', fontSize: 14, fontWeight: 700, lineHeight: 1.4, color: '#142850' }} html={r[0]} />
                {Array.from({ length: cols - 1 }, (_, c) => {
                  const key = `${tool.id}:${i}:${j}:${c}`;
                  return <div key={c} style={{ padding: '8px 10px 8px 0' }}><textarea aria-label={strip(r[0]) + (cols > 2 ? ' – ' + strip(b.head[c + 1]) : '')} value={rec[key] || ''} onChange={e => setRec(key, e.target.value)} style={{ width: '100%', minHeight: 64, resize: 'vertical', border: '1px solid #D8D9DA', borderRadius: 3, padding: '10px 12px', fontSize: 14, lineHeight: 1.5, color: '#1A1A1A', outline: 'none', background: '#fff' }} /></div>;
                })}
              </div>
            ))}
          </div>
        );
      })}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', fontSize: 12.5, color: '#63666A' }}>
        <span>Your entries are saved on this device only.</span>
        <button type="button" onClick={clear} style={{ fontWeight: 700, color: '#00638E' }}>Clear this record</button>
      </div>
    </div>
  );
}

// ── Question bank ────────────────────────────────────────────────────
function QBank({ narrow }) {
  const tb = LIB['shared-toolbox'], cats = qbCats();
  const [cat, setCat] = useState(0);
  const [qq, setQ] = useState('');
  const q = qq.trim().toLowerCase();
  const textOf = c => c.blocks.map(b => [b.h, ...(b.items || [])].join(' ')).join(' ');
  const idx = cats.map((_, i) => i).filter(i => !q || strip(cats[i].title + ' ' + textOf(cats[i])).toLowerCase().includes(q));
  let n = 0;
  const groups = q ? idx.map(i => { const hits = cats[i].blocks.flatMap(b => b.items || []).filter(h => strip(h).toLowerCase().includes(q)); n += hits.length; return { i, hits }; }).filter(g => g.hits.length) : [];
  const c = cats[cat] || cats[0];
  const choose = i => { setCat(i); setQ(''); setTimeout(() => jumpTo('qb-top'), 30); };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div style={ST.stack}><Blocks list={tb.intro.concat(tb.sections[1].intro)} lede /></div>
      <div id="qb-top" style={{ display: 'grid', gridTemplateColumns: narrow ? '220px minmax(0,1fr)' : '270px minmax(0,1fr)', border: '1px solid #D8D9DA', borderRadius: 4, overflow: 'hidden', scrollMarginTop: 72 }}>
        <div style={{ background: '#F2F3F4', borderRight: '1px solid #D8D9DA', padding: 14, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 12px', marginBottom: 10, background: '#fff', border: '1px solid #B1B2B4', borderRadius: 3, color: '#63666A' }}>
            {Icon.search(14)}
            <input type="search" aria-label="Search all questions" value={qq} onChange={e => setQ(e.target.value)} placeholder="Search all questions" style={{ flex: 1, minWidth: 0, border: 0, outline: 'none', fontSize: 13, background: 'transparent', color: '#1A1A1A', boxShadow: 'none' }} />
          </div>
          {idx.map(i => { const on = !q && i === cat; return <button key={i} type="button" aria-pressed={on} onClick={() => choose(i)} className={on ? '' : 'hv-tint'} style={{ padding: '9px 12px', borderRadius: 3, fontSize: 13, fontWeight: 700, lineHeight: 1.35, background: on ? '#00638E' : 'transparent', color: on ? '#fff' : '#1A1A1A', minHeight: 40 }}>{cats[i].title}</button>; })}
        </div>
        <div aria-live="polite" style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
          {q ? (
            <>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#63666A' }}>{n + (n === 1 ? ' question' : ' questions') + ' match "' + qq.trim() + '"'}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                {n ? groups.map(g => (
                  <div key={g.i} style={{ ...ST.stack, gap: 12 }}>
                    <button type="button" onClick={() => choose(g.i)} style={{ ...ST.eyebrow, alignSelf: 'flex-start' }}>{cats[g.i].title}</button>
                    <ul style={ST.ul}>{g.hits.map((h, j) => <Rich key={j} as="li" style={ST.li} html={h} />)}</ul>
                  </div>
                )) : <p style={ST.p}>No questions match this search.</p>}
              </div>
            </>
          ) : (
            <div style={ST.stack}><h2 style={ST.h3}>{c.title}</h2><Blocks list={c.blocks} /></div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Placeholder tool types (content to come) ─────────────────────────
function Visit({ tool }) {
  const card = (n, title, ws) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '20px 22px', border: '1px solid #D8D9DA', borderTop: '3px solid #00638E', borderRadius: 4 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}><span style={{ fontSize: 13, fontWeight: 800, color: '#00638E' }}>{n}</span><span style={{ fontSize: 17, fontWeight: 800, color: '#142850' }}>{title}</span></div>
      <PhBullets widths={ws} />
    </div>
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: 8 }}>
        {['How often', 'How long', 'Who'].map(l => (
          <div key={l} style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '16px 18px', background: '#F2F3F4', borderRadius: 4 }}>
            <span style={{ ...LBL, fontSize: 10.5, textTransform: 'uppercase' }}>{l}</span><Bar h={14} w="55%" bg="#D8D9DA" />
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 14 }}>
        {card(1, 'Before the visit', ['86%', '70%', '78%'])}
        {card(2, 'During the visit', ['80%', '92%', '64%'])}
        {card(3, 'After the visit', ['74%', '84%', '58%'])}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '18px 20px', background: '#F2F3F4', borderRadius: 4 }}><span style={{ ...LBL, fontSize: 10.5, textTransform: 'uppercase', color: '#0E7C66' }}>Good</span><PhBullets widths={['88%', '66%']} /></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '18px 20px', border: '1px solid #FF7768', borderRadius: 4 }}><span style={{ ...LBL, fontSize: 10.5, textTransform: 'uppercase', color: '#D20014' }}>Red flags</span><PhBullets widths={['82%', '60%']} /></div>
      </div>
      {isShown('tk-pocket') && <div style={{ display: 'flex' }}><Link to={`/toolbox/tk-pocket?card=${tool.id}`} className="btn btn-secondary tap">Open pocket card</Link></div>}
    </div>
  );
}

function PhBullets({ widths }) {
  return (
    <div aria-hidden="true" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {widths.map((w, i) => <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}><span style={{ flex: 'none', width: 6, height: 6, borderRadius: 1, background: '#00638E' }} /><Bar w={w} /></div>)}
    </div>
  );
}

function Accordion({ tool }) {
  const a = tool.accordion || { item: 'Item', count: 4, mark: '#00638E', label1: '', label2: '' };
  const [open, setOpen] = useState(0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {Array.from({ length: a.count }, (_, i) => {
        const on = open === i;
        return (
          <div key={i} style={{ border: '1px solid #D8D9DA', borderRadius: 4, overflow: 'hidden' }}>
            <button type="button" aria-expanded={on} aria-controls={`acc-${i}`} onClick={() => setOpen(on ? -1 : i)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', background: on ? '#F2F3F4' : '#fff' }}>
              <span style={{ width: 10, height: 10, flex: 'none', transform: 'rotate(45deg)', background: a.mark }} />
              <span style={{ fontSize: 14, fontWeight: 800, color: '#142850', whiteSpace: 'nowrap' }}>{a.item} {i + 1}</span>
              <Bar w={['46%', '38%', '52%', '30%', '42%'][i % 5]} bg="#D8D9DA" />
              <span aria-hidden="true" style={{ marginLeft: 'auto', fontSize: 20, fontWeight: 600, color: '#00638E', width: 20, textAlign: 'center' }}>{on ? '−' : '+'}</span>
            </button>
            {on && (
              <div id={`acc-${i}`} style={{ padding: '8px 18px 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 18 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={LBL}>{a.label1}</span><Bars widths={['96%', '70%']} gap={8} /></div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={LBL}>{a.label2}</span><Bars widths={['90%', '78%']} gap={8} /></div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '18px 20px', background: '#F2F3F4', borderRadius: 4 }}><span style={{ ...LBL, color: '#00638E' }}>SAY THIS</span><Bars widths={['88%', '52%']} h={14} bg="#D8D9DA" gap={10} /></div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Pocket() {
  const [params, setParams] = useSearchParams();
  // ?card= is the tool id of the card (positions shift when tools are hidden).
  const i = Math.max(0, POCKETS.findIndex(x => x.tool === params.get('card')));
  const set = k => setParams({ card: POCKETS[(k + POCKETS.length) % POCKETS.length].tool }, { replace: true });
  const p = POCKETS[i];
  if (!p) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{POCKETS.map((x, j) => <PillToggle key={x.tool} on={i === j} onClick={() => set(j)}>{x.name}</PillToggle>)}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'flex-start' }}>
        <div style={{ width: 340, maxWidth: '100%', borderRadius: 12, overflow: 'hidden', border: '1px solid #D8D9DA', boxShadow: '0 6px 20px rgba(20,40,80,.12)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ background: '#142850', color: '#fff', padding: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.14em', opacity: 0.8 }}>POCKET CARD {i + 1} OF {POCKETS.length}</span>
            <span style={{ fontSize: 19, fontWeight: 800, lineHeight: 1.2 }}>{p.name}</span>
          </div>
          <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {['80%', '66%', '74%'].map((w, j) => <div key={j} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 12, background: '#F2F3F4', borderRadius: 4 }}><span style={{ fontSize: 15, fontWeight: 800, color: '#00638E' }}>{j + 1}</span><Bar w={w} bg="#D8D9DA" /></div>)}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8 }}>
              <button type="button" aria-label="Previous card" onClick={() => set(i - 1)} style={{ width: 44, height: 44, border: '2px solid #00638E', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00638E' }}>{Icon.chevL(18, 2.5)}</button>
              <div aria-hidden="true" style={{ display: 'flex', gap: 6 }}>{POCKETS.map((_, j) => <span key={j} style={{ width: 8, height: 8, borderRadius: '50%', background: j === i ? '#00638E' : '#D8D9DA' }} />)}</div>
              <button type="button" aria-label="Next card" onClick={() => set(i + 1)} className="hv-primary" style={{ width: 44, height: 44, background: '#00638E', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>{Icon.chevR(18, 2.5)}</button>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 220, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontSize: 14, lineHeight: 1.55, color: '#63666A' }}>One card per meeting and visit, sized for a phone or tablet.</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <Link to={`/toolbox/${p.tool}`} className="btn btn-secondary tap">Open full guide</Link>
            <Btn variant="ghost" onClick={() => window.print()}>Print all cards</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

function Downloads({ tool }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {(tool.files || []).map(([type, action], i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px', border: '1px solid #D8D9DA', borderRadius: 4 }}>
          <span style={{ flex: 'none', width: 48, padding: '5px 0', textAlign: 'center', borderRadius: 2, fontSize: 10.5, fontWeight: 800, letterSpacing: '.06em', background: type === 'PPTX' ? '#D6B874' : '#E4E5E6', color: '#142850' }}>{type}</span>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}><Bar w={W[i]} h={11} bg="#D8D9DA" /><Bar w="40%" h={9} /></div>
          <Btn disabled>{action}</Btn>
        </div>
      ))}
    </div>
  );
}

function Voices() {
  const [tab, setTab] = useState(0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{['All', 'Topic 1', 'Topic 2', 'Topic 3'].map((n, i) => <PillToggle key={n} on={tab === i} onClick={() => setTab(i)}>{n}</PillToggle>)}</div>
      <div style={{ position: 'relative', height: 380, borderRadius: 4, overflow: 'hidden', background: '#142850 url(/assets/photos/image52.jpeg) center/cover', display: 'flex', alignItems: 'flex-end' }}>
        <div className="scrim" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg,rgba(20,40,80,.9) 0%,rgba(20,40,80,.2) 60%)' }} />
        <span aria-hidden="true" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 68, height: 68, borderRadius: '50%', background: '#00638E', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,.25)' }}>{Icon.play(24)}</span>
        <div style={{ position: 'relative', padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}><Bar h={14} bg="rgba(255,255,255,.6)" w="46%" /><Bar h={10} bg="rgba(255,255,255,.3)" w="28%" /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 14 }}>
        {[['96%', '70%'], ['90%', '58%']].map((ws, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 9, padding: 20, borderLeft: '3px solid #00638E', background: '#F7F8F8' }}>
            <Bars widths={ws} h={13} bg="#D8D9DA" /><span style={{ fontSize: 11, fontWeight: 700, color: '#63666A', marginTop: 6 }}>Leader name · Country</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Glossary() {
  const [term, setTerm] = useState(0);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '200px minmax(0,1fr)', border: '1px solid #D8D9DA', borderRadius: 4, overflow: 'hidden', minHeight: 420 }}>
      <div style={{ background: '#F2F3F4', borderRight: '1px solid #D8D9DA', padding: 14, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 36, padding: '0 10px', marginBottom: 8, background: '#fff', border: '1px solid #B1B2B4', borderRadius: 3, fontSize: 13, color: '#63666A' }}>Find a term</div>
        {Array.from({ length: 8 }, (_, i) => <button key={i} type="button" aria-pressed={term === i} onClick={() => setTerm(i)} style={{ padding: '10px 12px', borderRadius: 3, fontSize: 13, fontWeight: 700, background: term === i ? '#00638E' : 'transparent', color: term === i ? '#fff' : '#1A1A1A' }}>Term {i + 1}</button>)}
      </div>
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: '#00638E' }}>Term {term + 1}</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={LBL}>DEFINITION</span><Bars widths={['100%', '76%']} gap={8} /></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={LBL}>DATA REQUIREMENTS</span>
          <div style={{ border: '1px solid #D8D9DA', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', background: '#F2F3F4', fontSize: 12, fontWeight: 800, color: '#142850' }}><div style={{ padding: '10px 12px' }}>Field in Rocksell</div><div style={{ padding: '10px 12px' }}>Who enters it</div><div style={{ padding: '10px 12px' }}>When</div></div>
            {W.slice(0, 4).map((w, i) => <div key={i} style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', borderTop: '1px solid #EEEFF0' }}><div style={{ padding: '13px 12px' }}><Bar h={9} bg="#D8D9DA" w={w} /></div><div style={{ padding: '13px 12px' }}><Bar h={9} w="50%" /></div><div style={{ padding: '13px 12px' }}><Bar h={9} w="64%" /></div></div>)}
          </div>
        </div>
      </div>
    </div>
  );
}

const BODY = { doc: Doc, record: Record, qbank: QBank, meeting: Meeting, visit: Visit, dashboard: Dashboard, accordion: Accordion, pocket: Pocket, downloads: Downloads, voices: Voices, glossary: Glossary, terms: Terms };

export default function Tool({ tool, narrow }) {
  const Body = BODY[tool.type];
  const hasContent = !!secOf(tool) || tool.type === 'qbank' || tool.type === 'meeting' || tool.type === 'terms';
  const { state } = useLocation();
  const from = state && state.from;
  return (
    <div className="tool-page" style={{ maxWidth: tool.type === 'dashboard' ? 1240 : 900, margin: '0 auto', padding: narrow ? '76px 28px 140px' : '80px 48px 140px', display: 'flex', flexDirection: 'column', gap: 30 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <TierLabel tier={tierOf(tool)} hint={false} />
        <h1 style={{ margin: 0, fontSize: 34, lineHeight: 1.15, fontWeight: 800, color: '#00638E', textWrap: 'pretty' }}>{tool.title}</h1>
        {tool.note && <div style={{ display: 'flex' }}><Tag tone="sand">{tool.note}</Tag></div>}
        {!hasContent && <Bars widths={['100%', '68%']} h={11} style={{ maxWidth: 640, paddingTop: 4 }} />}
      </div>
      {Body && <Body tool={tool} narrow={narrow} from={from} />}
    </div>
  );
}
