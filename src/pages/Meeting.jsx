// Meeting guides: Overview, Instructions and the live Cockpit.
// Parsed from the meeting's section by sub-section title: "Format and intended
// decisions", "Before the meeting", "During the meeting" (agenda table),
// "After the meeting", "What good looks like and red flags". Per-point cockpit
// content (purpose, data, ask, run, watch) comes from playbook.json → cockpit,
// keyed by the agenda topic exactly as written in the During table.
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { COCKPIT, COCKPIT_PHASES, dashMatch, rhythmRow, rhythmTable, secOf, strip, W } from '../content.js';
import { Blocks, Section, ST } from '../blocks.jsx';
import { useMem, useStoredMap } from '../store.js';
import { Bar, Bars, Btn, Icon } from '../ui.jsx';
import DealRoom, { dealRoomLines, dealRoomPlan } from './DealRoom.jsx';

const LBL = { fontSize: 10.5, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#63666A' };
const VIEWS = [['overview', 'Overview', 'What it is and what good looks like'], ['instructions', 'Instructions', 'How the meeting should be run'], ['cockpit', 'Cockpit', 'Run it live']];
const ownerFg = o => (/^Sales leader/.test(o) ? '#0E7C66' : /^Salesperson/.test(o) ? '#00638E' : '#63666A');
const split = h => { const m = /^([^:]{3,40}):\s*([\s\S]*)$/.exec(strip(h)); return m ? { owner: m[1], text: m[2] } : { owner: '', text: strip(h) }; };
const mmss = ms => { const t = Math.max(0, Math.floor(ms / 1000)); return Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0'); };
const pointContent = (id, g) => ((COCKPIT[id] || {})[g.topic]) || {};
// The deal room runs inside the 1:1 Pipeline cockpit at the two selected-opportunity points.
const isDealRoomPoint = (id, g) => id === 'mt-pipe' && /selected opportunity/i.test(g.topic || '');
const inputStyle = { flex: 1, minWidth: 180, height: 40, padding: '0 12px', border: '1px solid #D8D9DA', borderRadius: 3, fontSize: 14, color: '#1A1A1A', background: '#fff', outline: 'none' };

function BulletList({ items, color = '#00638E', size = 16 }) {
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((x, i) => (
        <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
          <span aria-hidden="true" style={{ flex: 'none', width: 6, height: 6, borderRadius: 1, background: color, transform: 'translateY(-3px)' }} />
          <span style={{ fontSize: size, lineHeight: 1.55, color: '#1A1A1A', textWrap: 'pretty' }}>{x}</span>
        </li>
      ))}
    </ul>
  );
}

function parse(tool) {
  const sec = secOf(tool);
  const find = t => (sec ? sec.subs.find(x => x.title === t) : null);
  const fmt = find('Format and intended decisions'), bef = find('Before the meeting'), dur = find('During the meeting'), aft = find('After the meeting'), good = find('What good looks like and red flags');
  const core = [fmt, bef, dur, aft, good];
  const guide = sec ? sec.subs.filter(x => !core.includes(x)) : [];
  const items = sub => (sub ? sub.blocks.filter(b => b.t === 'ul' || b.t === 'ol').flatMap(b => b.items) : null);
  const at = dur ? dur.blocks.find(b => b.t === 'table') : null;
  let acc = 0;
  const segs = at
    ? at.rows.map(r => { const m = /(\d+)\s*(?:to|–|-)\s*(\d+)/.exec(strip(r[0])), a = m ? +m[1] : acc, e = m ? +m[2] : acc + 10; acc = e; return { s: a, e, min: strip(r[0]), topic: strip(r[1]), q: strip(r[2]), ph: false }; })
    : Array.from({ length: 5 }, (_, i) => ({ s: i * 12, e: i * 12 + 12, min: '__', topic: '', q: '', ph: true }));
  return { sec, fmt, good, guide, before: items(bef), after: items(aft), segs, total: segs[segs.length - 1].e, agendaReal: !!at };
}

function useMeetingView(tool) {
  const [params, setParams] = useSearchParams();
  const [stored, setStored] = useStoredMap('meetingView');
  const fromUrl = params.get('view');
  const view = VIEWS.some(v => v[0] === fromUrl) ? fromUrl : VIEWS.some(v => v[0] === stored[tool.id]) ? stored[tool.id] : 'overview';
  const set = v => { setStored(tool.id, v); const p = new URLSearchParams(params); p.set('view', v); setParams(p, { replace: true }); };
  return [view, set];
}

// ── Overview ───────────────────────────────────────────────────────
function Overview({ tool, m, go }) {
  const rh = rhythmTable(), rr = rhythmRow(tool);
  const [copied, setCopied] = useState(false);
  const copyAgenda = () => {
    const txt = tool.title + '\n\n' + m.segs.filter(a => !a.ph).map(a => a.min + ' min · ' + a.topic + '\n' + a.q).join('\n\n');
    try { navigator.clipboard.writeText(txt); } catch { /* clipboard unavailable */ }
    setCopied(true);
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {rr ? (
        <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', border: '1px solid #D8D9DA', borderRadius: 4, overflow: 'hidden' }}>
          {[1, 2, 3].map(c => (
            <div key={c} style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 6, boxShadow: 'inset -1px 0 0 #EEEFF0' }}>
              <dt style={LBL}>{strip(rh.head[c])}</dt>
              <dd style={{ margin: 0, fontSize: 15, lineHeight: 1.4, fontWeight: 800, color: '#142850' }}>{strip(rr[c])}</dd>
            </div>
          ))}
        </dl>
      ) : !m.sec && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', border: '1px solid #D8D9DA', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8, boxShadow: 'inset -1px 0 0 #EEEFF0' }}><span style={LBL}>FORMAT</span><span style={{ fontSize: 15, fontWeight: 800, color: '#142850' }}>{tool.format || <Bar w="60%" h={12} bg="#D8D9DA" />}</span></div>
          {[['FREQUENCY', '70%'], ['DURATION', '50%'], ['PARTICIPANTS', '80%']].map(([l, w]) => (
            <div key={l} style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10, boxShadow: 'inset -1px 0 0 #EEEFF0' }}><span style={LBL}>{l}</span><Bar w={w} h={12} bg="#D8D9DA" /></div>
          ))}
        </div>
      )}
      {m.fmt ? <div style={{ ...ST.stack, gap: 14 }}><Blocks list={m.fmt.blocks} lede /></div> : <Bars widths={['100%', '94%', '61%']} />}
      {m.good ? <Section sec={{ id: 'mg', intro: [], subs: [m.good] }} /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 10 }}>
          <div style={{ padding: '20px 22px', background: '#F2F3F4', borderRadius: 4, display: 'flex', flexDirection: 'column', gap: 12 }}><span style={{ ...LBL, fontSize: 11, letterSpacing: '.14em', color: '#0E7C66' }}>GOOD</span><Bars widths={['100%', '86%', '52%']} bg="#D8D9DA" /></div>
          <div style={{ padding: '20px 22px', border: '1px solid #FF7768', borderRadius: 4, display: 'flex', flexDirection: 'column', gap: 12 }}><span style={{ ...LBL, fontSize: 11, letterSpacing: '.14em', color: '#D20014' }}>RED FLAGS</span><Bars widths={['100%', '78%', '60%']} /></div>
        </div>
      )}
      <div className="no-print" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 10 }}>
        <button type="button" onClick={() => go('instructions')} className="hv-tint tr" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 20px', border: '1px solid #00638E', borderRadius: 4 }}>
          <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}><span style={{ fontSize: 16, fontWeight: 800, color: '#00638E' }}>Read the instructions</span><span style={{ fontSize: 13, lineHeight: 1.45, color: '#63666A' }}>Walk through each part of the meeting before you run it.</span></span>
          <span aria-hidden="true" style={{ fontSize: 18, fontWeight: 700, color: '#00638E' }}>→</span>
        </button>
        <button type="button" onClick={() => go('cockpit')} className="hv-navy tr" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 20px', background: '#142850', borderRadius: 4 }}>
          <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}><span style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>Run the meeting</span><span style={{ fontSize: 13, lineHeight: 1.45, color: 'rgba(255,255,255,.8)' }}>Checklists, the live agenda and a timer.</span></span>
          <span aria-hidden="true" style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>→</span>
        </button>
      </div>
      <div className="no-print" style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        <Btn onClick={() => window.print()}>Print one-pager</Btn>
        <Btn onClick={copyAgenda} disabled={!m.agendaReal}>{copied ? 'Agenda copied' : 'Copy agenda to invite'}</Btn>
        <Link to={`/toolbox/tk-pocket?card=${tool.pocket ?? 0}`} className="btn btn-ghost tap">Open pocket card</Link>
      </div>
    </div>
  );
}

// ── Instructions ───────────────────────────────────────────────────
function Instructions({ tool, m, narrow, go }) {
  const id = tool.id;
  const ph = list => (list ? list.map(h => ({ ...split(h), real: true })) : Array.from({ length: 4 }, (_, i) => ({ owner: '', text: '', real: false, w: W[(i + 2) % W.length] })));
  const nodes = [
    { kind: 'phase', sub: 'Prepare', label: 'Before the meeting', items: ph(m.before) },
    ...m.segs.map((g, i) => ({ kind: 'agenda', sub: g.ph ? '__ min' : g.min + ' min', label: g.ph ? 'Agenda point ' + (i + 1) : g.topic, g })),
    { kind: 'phase', sub: 'Follow up', label: 'After the meeting', items: ph(m.after) },
  ];
  const VIS = narrow ? 4 : 5, maxW = Math.max(0, nodes.length - VIS), clampW = k => Math.max(0, Math.min(maxW, k));
  const [stepMap, setStepMap] = useMem('teachStep', {});
  const [winMap, setWinMap] = useMem('teachWin', {});
  const ts = Math.min(stepMap[id] || 0, nodes.length - 1), tn = nodes[ts];
  const win = clampW(winMap[id] ?? ts - Math.floor(VIS / 2));
  const setT = k => { setStepMap(s => ({ ...s, [id]: k })); setWinMap(s => ({ ...s, [id]: clampW(k - Math.floor(VIS / 2)) })); };
  const shiftW = d => setWinMap(s => ({ ...s, [id]: clampW(win + d) }));
  const arrow = (dir, enabled) => (
    <button type="button" aria-label={dir < 0 ? 'Earlier parts' : 'Later parts'} disabled={!enabled} onClick={() => shiftW(dir)} className="hv-bd-blue tr" style={{ flex: 'none', width: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #D8D9DA', borderRadius: 4, color: '#00638E', opacity: enabled ? 1 : 0.3, cursor: enabled ? 'pointer' : 'default' }}>{dir < 0 ? Icon.chevL() : Icon.chevR()}</button>
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
        <span style={{ ...LBL, fontSize: 11, letterSpacing: '.14em' }}>HOW THE MEETING FLOWS</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#63666A' }}>{nodes.length > VIS ? `${win + 1}–${Math.min(nodes.length, win + VIS)} of ${nodes.length} parts` : ''}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'stretch', gap: 8 }}>
        {arrow(-1, win > 0)}
        <div role="tablist" aria-label="Parts of the meeting" style={{ flex: 1, minWidth: 0, display: 'flex', gap: 6 }}>
          {nodes.map((n, i) => ({ n, i })).slice(win, win + VIS).map(({ n, i }) => {
            const on = i === ts, isPh = n.kind === 'phase';
            return (
              <button key={i} type="button" role="tab" aria-selected={on} onClick={() => setT(i)} className="tr" style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6, padding: '12px 14px', borderRadius: 4, background: on ? '#142850' : isPh ? '#F2F3F4' : '#fff', border: `1px solid ${on ? '#142850' : '#D8D9DA'}` }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: on ? '#45A6DE' : '#00638E' }}>{n.sub}</span>
                <span style={{ fontSize: 13.5, lineHeight: 1.3, fontWeight: 800, color: on ? '#fff' : '#142850' }}>{n.label}</span>
              </button>
            );
          })}
        </div>
        {arrow(1, win < maxW)}
      </div>
      <div role="tabpanel" style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '26px 28px', border: '1px solid #D8D9DA', borderTop: '3px solid #00638E', borderRadius: 4 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#00638E' }}>{tn.kind === 'agenda' ? (tn.g.ph ? 'Agenda point' : 'Minutes ' + tn.g.min) : tn.sub}</span>
          <h2 style={{ margin: 0, fontSize: 24, lineHeight: 1.2, fontWeight: 800, color: '#142850' }}>{tn.label}</h2>
        </div>
        {tn.kind === 'agenda' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={LBL}>Questions and decision</span>
              {tn.g.q ? <span style={{ fontSize: 17, lineHeight: 1.6, color: '#1A1A1A' }}>{tn.g.q}</span> : <Bars widths={['92%', '64%']} />}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={LBL}>How to run this part</span>
              {(pointContent(id, tn.g).run || []).length ? <BulletList items={pointContent(id, tn.g).run} /> : <Bars widths={['100%', '96%', '88%', '45%']} />}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '16px 18px', border: '1px solid #FF7768', borderRadius: 4 }}>
              <span style={{ ...LBL, color: '#D20014' }}>WATCH FOR</span>
              {(pointContent(id, tn.g).watch || []).length ? <BulletList items={pointContent(id, tn.g).watch} color="#FF7768" /> : <Bars widths={['84%', '58%']} />}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {tn.items.map((r, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '12px 0', borderBottom: '1px solid #EEEFF0' }}>
                {r.owner && <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: ownerFg(r.owner) }}>{r.owner}</span>}
                {r.real ? <span style={{ fontSize: 15.5, lineHeight: 1.55, color: '#1A1A1A' }}>{r.text}</span> : <Bar w={r.w} />}
              </div>
            ))}
            {(COCKPIT_PHASES[ts === 0 ? 'before' : 'after'] || []).length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18, padding: '16px 18px', background: '#F2F3F4', borderRadius: 4 }}>
                <span style={LBL}>In the playbook</span>
                <BulletList items={COCKPIT_PHASES[ts === 0 ? 'before' : 'after']} />
              </div>
            )}
          </div>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10, paddingTop: 4 }}>
          {ts > 0 ? <button type="button" onClick={() => setT(ts - 1)} className="hv-blue tap" style={{ padding: '10px 14px', borderRadius: 3, fontSize: 13.5, fontWeight: 700, color: '#63666A' }}>← {nodes[ts - 1].label}</button> : <span />}
          {ts < nodes.length - 1
            ? <button type="button" onClick={() => setT(ts + 1)} className="hv-primary tap" style={{ padding: '10px 16px', borderRadius: 3, fontSize: 13.5, fontWeight: 800, color: '#fff', background: '#00638E' }}>Next: {nodes[ts + 1].label} →</button>
            : <button type="button" onClick={() => go('cockpit')} className="hv-navy tap" style={{ padding: '10px 16px', borderRadius: 3, fontSize: 13.5, fontWeight: 800, color: '#fff', background: '#142850' }}>Open the cockpit →</button>}
        </div>
      </div>
      {m.guide.length > 0 && (
        <div style={{ paddingTop: 24 }}>
          <div style={{ ...ST.stack, gap: 28 }}>
            <h2 style={ST.h3}>More on this meeting</h2>
            <Section sec={{ id: 'mgd', intro: [], subs: m.guide }} toc tocLabel="In this guide" />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Cockpit ────────────────────────────────────────────────────────
function Checklist({ tool, phase, list }) {
  const [checks, setCheck] = useStoredMap('checks');
  const [who, setWho] = useMem('meetWho', 'all');
  const rows = list ? list.map((h, i) => ({ ...split(h), i, real: true })) : Array.from({ length: 4 }, (_, i) => ({ owner: '', text: '', i, real: false, w: W[(i + 2) % W.length] }));
  const owners = list ? [...new Set(rows.map(r => r.owner).filter(Boolean))] : [];
  const w = owners.includes(who) ? who : 'all';
  return (
    <>
      {owners.length > 1 && (
        <div role="group" aria-label="Show tasks for" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#63666A', marginRight: 4 }}>Show tasks for</span>
          {['all', ...owners].map(o => (
            <button key={o} type="button" aria-pressed={w === o} onClick={() => setWho(o)} className="tap tr" style={{ padding: '7px 14px', borderRadius: 999, fontSize: 13, fontWeight: 700, border: '1px solid #00638E', background: w === o ? '#00638E' : '#fff', color: w === o ? '#fff' : '#00638E' }}>{o === 'all' ? 'Everyone' : o}</button>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {rows.filter(r => w === 'all' || r.owner === w).map(r => {
          const key = `${tool.id}:${phase}:${r.i}`, on = !!checks[key];
          return (
            <button key={r.i} type="button" role="checkbox" aria-checked={on} onClick={() => setCheck(key, !on)} className="hv-tint" style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 16px', border: '1px solid #D8D9DA', borderRadius: 4, width: '100%' }}>
              <span style={{ width: 20, height: 20, flex: 'none', marginTop: 2, borderRadius: 3, border: `2px solid ${on ? '#00638E' : '#B1B2B4'}`, background: on ? '#00638E' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>{on && Icon.check()}</span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0, flex: 1 }}>
                {r.owner && <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: ownerFg(r.owner) }}>{r.owner}</span>}
                {r.real ? <span style={{ fontSize: 15, lineHeight: 1.55, color: '#1A1A1A' }}>{r.text}</span> : <Bar w={r.w} style={{ marginTop: 5 }} />}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}

function During({ tool, m, onFinish }) {
  const id = tool.id, segs = m.segs, total = m.total;
  const [clock, setClock] = useMem('clock', null);
  const [follow, setFollow] = useMem('cFollow', true);
  const [selMap, setSelMap] = useMem('cSel', {});
  const [notes, setNote] = useStoredMap('cockpitNotes');
  const [asked, setAsked] = useStoredMap('cockpitAsked');
  const [, tick] = useState(0);
  const ck = clock && clock.id === id ? clock : { id, acc: 0, start: null };
  useEffect(() => { if (!ck.start) return undefined; const t = setInterval(() => tick(x => x + 1), 1000); return () => clearInterval(t); }, [ck.start]);
  // Wall-clock based, so it stays right if the tab sleeps.
  const el = ck.acc + (ck.start ? Date.now() - ck.start : 0), elMin = el / 60000, started = el > 0 || !!ck.start, over = elMin >= total;
  let curI = segs.findIndex(g => elMin < g.e); if (curI < 0) curI = segs.length - 1;
  const sel = follow ? curI : Math.min(selMap[id] || 0, segs.length - 1), g = segs[sel], nk = id + ':' + sel;
  const pick = i => { setFollow(false); setSelMap(s => ({ ...s, [id]: i })); };
  const live = started && sel === curI && !over;
  const toggle = () => { if (ck.start) setClock({ id, acc: ck.acc + Date.now() - ck.start, start: null }); else { setClock({ id, acc: ck.acc, start: Date.now() }); setFollow(true); } };
  const finish = () => { if (ck.start) setClock({ id, acc: ck.acc + Date.now() - ck.start, start: null }); onFinish(); };
  const pc = pointContent(id, g), dr = isDealRoomPoint(id, g);
  const dash = (pc.data || []).map(dashMatch).find(Boolean);
  const ask = pc.ask || [];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px 24px', padding: '18px 22px', background: '#142850', borderRadius: 4, color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span role="timer" aria-live="off" style={{ fontSize: 40, lineHeight: 1, fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: over ? '#FF7768' : '#fff' }}>{mmss(el)}</span>
          <span style={{ fontSize: 13, fontWeight: 600, opacity: 0.75 }}>of {mmss(total * 60000)}</span>
        </div>
        <div style={{ flex: 1, minWidth: 160, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.12em', opacity: 0.75 }}>NOW</span>
          <span style={{ fontSize: 15, fontWeight: 800, lineHeight: 1.3 }}>{!started ? 'Not started' : over ? 'Over time by ' + mmss(el - total * 60000) : segs[curI].topic || 'Agenda point ' + (curI + 1)}</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <button type="button" onClick={toggle} className="hv-grey tap" style={{ whiteSpace: 'nowrap', padding: '10px 18px', borderRadius: 3, fontSize: 14, fontWeight: 800, background: '#fff', color: '#142850' }}>{ck.start ? 'Pause' : started ? 'Resume' : 'Start meeting'}</button>
          <button type="button" onClick={() => { setClock({ id, acc: 0, start: null }); setFollow(true); }} className="hv-bd-white tap" style={{ whiteSpace: 'nowrap', padding: '10px 14px', borderRadius: 3, fontSize: 14, fontWeight: 700, border: '1px solid rgba(255,255,255,.4)', color: '#fff' }}>Reset</button>
          <button type="button" onClick={finish} className="hv-primary tap" style={{ whiteSpace: 'nowrap', padding: '10px 14px', borderRadius: 3, fontSize: 14, fontWeight: 800, background: '#00638E', color: '#fff' }}>Finish and review notes</button>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div role="tablist" aria-label="Agenda" style={{ position: 'relative', display: 'flex', gap: 3, height: 62 }}>
          {segs.map((x, i) => {
            const now = started && i === curI && !over, past = started && x.e <= elMin;
            return (
              <button key={i} type="button" role="tab" aria-selected={i === sel} aria-label={`Point ${i + 1}${x.topic ? ': ' + x.topic : ''}`} onClick={() => pick(i)} style={{ flex: `${x.e - x.s} 1 0`, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2, padding: '0 9px', borderRadius: 3, overflow: 'hidden', background: now ? '#00638E' : past ? '#C9D6E2' : '#F2F3F4', color: now ? '#fff' : '#142850', boxShadow: i === sel ? 'inset 0 0 0 2px #142850' : 'none', transition: 'background 300ms ease' }}>
                <span style={{ fontSize: 14, fontWeight: 800 }}>{i + 1}</span>
                <span style={{ fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', opacity: 0.85 }}>{x.ph ? '__ min' : x.min}</span>
              </button>
            );
          })}
          {started && <div aria-hidden="true" style={{ position: 'absolute', top: -5, bottom: -5, left: Math.min(100, (elMin / total) * 100) + '%', width: 2, background: '#D20014', pointerEvents: 'none', transition: 'left 1s linear' }} />}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, color: '#63666A' }}><span>0 min</span><span>{total} min</span></div>
      </div>
      <div role="tabpanel" style={{ display: 'flex', flexDirection: 'column', gap: 18, padding: '24px 26px', border: '1px solid #D8D9DA', borderRadius: 4 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: '12px 20px' }}>
          <div style={{ flex: 1, minWidth: 220, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', color: '#00638E' }}>POINT {sel + 1} · {g.ph ? '__' : g.e - g.s} MIN</span>
            {g.ph ? <Bar h={20} bg="#D8D9DA" w="55%" /> : <span style={{ fontSize: 22, lineHeight: 1.25, fontWeight: 800, color: '#142850' }}>{g.topic}</span>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <span style={{ padding: '7px 12px', borderRadius: 999, fontSize: 13, fontWeight: 800, fontVariantNumeric: 'tabular-nums', background: live ? '#00638E' : '#F2F3F4', color: live ? '#fff' : '#142850' }}>{live ? mmss(g.e * 60000 - el) + ' left' : (g.ph ? '__' : g.e - g.s) + ' min'}</span>
            {!follow && started && <button type="button" onClick={() => setFollow(true)} className="tap" style={{ fontSize: 12, fontWeight: 700, color: '#00638E' }}>Follow the clock</button>}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '18px 20px', background: '#F2F3F4', borderRadius: 4 }}>
            <span style={LBL}>Purpose</span>
            {pc.purpose ? <span style={{ fontSize: 16, lineHeight: 1.55, color: '#142850', fontWeight: 600, textWrap: 'pretty' }}>{pc.purpose}</span> : <Bars widths={['94%', '70%']} bg="#D8D9DA" />}
          </div>
          {!dr && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '18px 20px', border: '1px solid #D8D9DA', borderRadius: 4 }}>
              <span style={LBL}>Data to look at</span>
              {(pc.data || []).length ? <BulletList items={pc.data} size={14.5} /> : <Bars widths={['80%', '62%', '70%']} />}
              {dash
                ? <Link to={`/toolbox/tk-dash?page=${dash[0]}&el=${dash[1]}`} className="hv-tint" style={{ alignSelf: 'flex-start', padding: '7px 12px', border: '1px solid #00638E', borderRadius: 3, fontSize: 12.5, fontWeight: 700, color: '#00638E' }}>Open in the dashboard →</Link>
                : <span style={{ alignSelf: 'flex-start', padding: '7px 12px', border: '1px dashed #B1B2B4', borderRadius: 3, fontSize: 12.5, fontWeight: 700, color: '#63666A' }}>Open in Rocksell</span>}
            </div>
          )}
        </div>
        {!dr && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: '6px 16px' }}>
              <span style={LBL}>Questions to ask</span>
              {ask.length > 0 && <span style={{ fontSize: 12, color: '#63666A' }}>Tap a question once you have asked it.</span>}
            </div>
            {ask.length ? (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {ask.map((q, i) => {
                  const k = nk + ':' + i, on = !!asked[k];
                  return (
                    <button key={i} type="button" aria-pressed={on} onClick={() => setAsked(k, !on)} className="hv-tint" style={{ display: 'flex', alignItems: 'baseline', gap: 14, padding: '13px 4px', borderTop: '1px solid #EEEFF0', opacity: on ? 0.4 : 1, transition: 'opacity 200ms ease', width: '100%' }}>
                      <span style={{ flex: 'none', width: 22, fontSize: 15, fontWeight: 800, color: '#00638E', fontVariantNumeric: 'tabular-nums' }}>{i + 1}</span>
                      <span style={{ fontSize: 18, lineHeight: 1.45, fontWeight: 600, color: '#142850', textDecoration: on ? 'line-through' : 'none', textWrap: 'pretty' }}>{q}</span>
                    </button>
                  );
                })}
              </div>
            ) : <Bars widths={['100%', '92%', '48%']} />}
          </div>
        )}
        {dr && (
          <DealRoom key={nk} storeKey={nk} eyebrow={'MUST-WIN DEAL ROOM · ' + (/second/i.test(g.topic) ? 'SECOND' : 'FIRST') + ' OPPORTUNITY'}
            plan={{ steps: dealRoomPlan(), live, offset: elMin - g.s }} />
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label htmlFor={'note-' + nk} style={LBL}>Notes for this point</label>
          <textarea id={'note-' + nk} value={notes[nk] || ''} onChange={e => setNote(nk, e.target.value)} placeholder="Saved on this device only" style={{ width: '100%', minHeight: 84, resize: 'vertical', border: '1px solid #D8D9DA', borderRadius: 3, padding: '10px 12px', fontSize: 14, lineHeight: 1.5, color: '#1A1A1A', outline: 'none' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
          {sel > 0 ? <button type="button" onClick={() => pick(sel - 1)} className="hv-blue tap" style={{ padding: '10px 14px', fontSize: 13.5, fontWeight: 700, color: '#63666A' }}>← Previous point</button> : <span />}
          {sel < segs.length - 1 && <button type="button" onClick={() => pick(sel + 1)} className="hv-primary tap" style={{ padding: '10px 16px', borderRadius: 3, fontSize: 13.5, fontWeight: 800, color: '#fff', background: '#00638E' }}>Next point →</button>}
        </div>
      </div>
    </div>
  );
}

// "Meeting with": name and email, stored per meeting, shown on every cockpit tab.
function useMeetingWith(id) {
  const [all, setEntry] = useStoredMap('meetingWith');
  const w = all[id] || {};
  return [w, (k, v) => setEntry(id, cur => ({ ...(cur || {}), [k]: v }))];
}

function MeetingWith({ id }) {
  const [w, set] = useMeetingWith(id);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px 12px', padding: '14px 16px', background: '#F2F3F4', borderRadius: 4 }}>
      <span style={{ ...LBL, marginRight: 4 }}>Meeting with</span>
      <input aria-label="Meeting with: name" value={w.name || ''} onChange={e => set('name', e.target.value)} placeholder="Name" style={inputStyle} />
      <input aria-label="Meeting with: email" type="email" value={w.email || ''} onChange={e => set('email', e.target.value)} placeholder="Email, for the notes" style={inputStyle} />
    </div>
  );
}

// Meeting notes card at the top of the After tab: every point with notes or deal room scores.
function NotesCard({ tool, m }) {
  const id = tool.id;
  const [w, set] = useMeetingWith(id);
  const [notes, , setAllNotes] = useStoredMap('cockpitNotes');
  const [dr, , setAllDr] = useStoredMap('dealRoom');
  const [copied, setCopied] = useState(false);
  const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const items = m.segs.map((g, i) => {
    const note = (notes[id + ':' + i] || '').trim(), d = dr[id + ':' + i] || {};
    const lines = dealRoomLines(d);
    return { n: i + 1, topic: g.topic || 'Agenda point ' + (i + 1), note, drName: d.name || '', lines };
  }).filter(x => x.note || x.drName || x.lines.length);
  const text = tool.title + '\nDate: ' + date + (w.name ? '\nWith: ' + w.name : '') + '\n\n'
    + items.map(x => x.n + '. ' + x.topic + (x.drName ? '\nOpportunity: ' + x.drName : '') + (x.lines.length ? '\n' + x.lines.join('\n') : '') + (x.note ? '\n' + x.note : '')).join('\n\n');
  const mailto = 'mailto:' + encodeURIComponent(w.email || '') + '?subject=' + encodeURIComponent(tool.title + ' · ' + date) + '&body=' + encodeURIComponent(text);
  const copy = () => { try { navigator.clipboard.writeText(text); } catch { /* clipboard unavailable */ } setCopied(true); };
  const clear = () => {
    if (!window.confirm('Clear the notes and deal room scores for this meeting on this device?')) return;
    const drop = o => { const r = { ...o }; Object.keys(r).forEach(k => { if (k.startsWith(id + ':')) delete r[k]; }); return r; };
    setAllNotes(drop); setAllDr(drop); setCopied(false);
  };
  return (
    <section aria-label="Meeting notes" style={{ display: 'flex', flexDirection: 'column', gap: 18, padding: '22px 24px', border: '1px solid #D8D9DA', borderTop: '3px solid #00638E', borderRadius: 4 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={LBL}>Meeting notes</span>
        <span style={{ fontSize: 20, fontWeight: 800, color: '#142850' }}>{tool.title}</span>
        <span style={{ fontSize: 13, color: '#63666A' }}>{date}{w.name ? ' · with ' + w.name : ''}</span>
      </div>
      {items.length ? (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {items.map(x => (
            <div key={x.n} style={{ display: 'grid', gridTemplateColumns: '28px minmax(0,1fr)', gap: '4px 10px', padding: '14px 0', borderTop: '1px solid #EEEFF0' }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#00638E' }}>{x.n}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: '#142850' }}>{x.topic}</span>
                {(x.drName || x.lines.length > 0) && <span style={{ fontSize: 13, lineHeight: 1.5, color: '#63666A' }}>{[x.drName ? 'Opportunity: ' + x.drName : '', ...x.lines].filter(Boolean).join(' · ')}</span>}
                {x.note && <span style={{ fontSize: 15, lineHeight: 1.55, color: '#1A1A1A', whiteSpace: 'pre-wrap' }}>{x.note}</span>}
              </div>
            </div>
          ))}
        </div>
      ) : <span style={{ fontSize: 15, color: '#63666A' }}>No notes yet. Notes you type for each agenda point during the meeting appear here.</span>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <label htmlFor={'send-' + id} style={LBL}>Send to</label>
        <input id={'send-' + id} type="email" value={w.email || ''} onChange={e => set('email', e.target.value)} placeholder="Email address" style={{ ...inputStyle, flex: 'none', width: '100%' }} />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
        <a href={mailto} className="hv-primary" style={{ display: 'inline-flex', alignItems: 'center', height: 42, padding: '0 18px', borderRadius: 3, background: '#00638E', color: '#fff', fontSize: 14, fontWeight: 800 }}>Email the notes</a>
        <button type="button" onClick={copy} className="hv-tint" style={{ display: 'inline-flex', alignItems: 'center', height: 42, padding: '0 16px', borderRadius: 3, border: '1px solid #00638E', color: '#00638E', fontSize: 14, fontWeight: 700 }}>{copied ? 'Notes copied' : 'Copy notes'}</button>
        <button type="button" onClick={clear} className="tap" style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 700, color: '#63666A', textDecoration: 'underline' }}>Clear notes for this meeting</button>
      </div>
      <span style={{ fontSize: 12, lineHeight: 1.5, color: '#63666A' }}>Opens a draft in your email program. Long notes may be cut off by some email programs; use Copy notes and paste instead. Notes stay on this device until you clear them.</span>
    </section>
  );
}

function Cockpit({ tool, m }) {
  const [phaseMap, setPhaseMap] = useMem('phase', {});
  const phase = phaseMap[tool.id] || 'before';
  const setPhase = k => setPhaseMap(s => ({ ...s, [tool.id]: k }));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <MeetingWith id={tool.id} />
      <div role="tablist" aria-label="Meeting phase" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', borderBottom: '2px solid #D8D9DA' }}>
        {['before', 'during', 'after'].map(k => (
          <button key={k} type="button" role="tab" aria-selected={phase === k} onClick={() => setPhase(k)} className="tap" style={{ padding: '12px 8px', marginBottom: -2, textAlign: 'center', fontSize: 14, fontWeight: 800, borderBottom: `2px solid ${phase === k ? '#00638E' : 'transparent'}`, color: phase === k ? '#00638E' : '#63666A' }}>{k[0].toUpperCase() + k.slice(1)}</button>
        ))}
      </div>
      {phase === 'after' && <NotesCard tool={tool} m={m} />}
      {phase === 'during' ? <During tool={tool} m={m} onFinish={() => setPhase('after')} /> : <Checklist key={phase} tool={tool} phase={phase} list={phase === 'after' ? m.after : m.before} />}
    </div>
  );
}

export default function Meeting({ tool, narrow }) {
  const m = parse(tool);
  const [view, setView] = useMeetingView(tool);
  // Deep links from the Dashboard guide: ?view=cockpit&phase=during&point=N.
  const [params, setParams] = useSearchParams();
  const [, setPhaseMap] = useMem('phase', {});
  const [, setFollow] = useMem('cFollow', true);
  const [, setSelMap] = useMem('cSel', {});
  useEffect(() => {
    const phase = params.get('phase'), point = params.get('point');
    if (!phase && point == null) return;
    if (phase) setPhaseMap(s => ({ ...s, [tool.id]: phase }));
    if (point != null && !isNaN(+point)) { setFollow(false); setSelMap(s => ({ ...s, [tool.id]: +point })); }
    const p = new URLSearchParams(params); p.delete('phase'); p.delete('point'); setParams(p, { replace: true });
  }, [params, setParams, setPhaseMap, setFollow, setSelMap, tool.id]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
      <div role="tablist" aria-label="Meeting guide views" className="no-print" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 6, padding: 6, background: '#F2F3F4', borderRadius: 6 }}>
        {VIEWS.map(([k, label, sub]) => {
          const on = view === k;
          return (
            <button key={k} type="button" role="tab" aria-selected={on} onClick={() => setView(k)} className="tr" style={{ display: 'flex', flexDirection: 'column', gap: 3, padding: '12px 16px', borderRadius: 4, background: on ? '#fff' : 'transparent', boxShadow: on ? '0 1px 4px rgba(20,40,80,.14)' : 'none' }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: on ? '#00638E' : '#142850' }}>{label}</span>
              <span style={{ fontSize: 12, lineHeight: 1.35, fontWeight: 600, color: '#63666A' }}>{sub}</span>
            </button>
          );
        })}
      </div>
      {view === 'overview' && <Overview tool={tool} m={m} go={setView} />}
      {view === 'instructions' && <Instructions tool={tool} m={m} narrow={narrow} go={setView} />}
      {view === 'cockpit' && <Cockpit tool={tool} m={m} />}
    </div>
  );
}
