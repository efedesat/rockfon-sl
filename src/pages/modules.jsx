// Interactive modules embedded in specific topics.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BY, LIB, TOOLS, isShown, rhythmTable, strip, toolMeta } from '../content.js';
import { Blocks, Rich, ST } from '../blocks.jsx';
import { useStoredMap } from '../store.js';
import { Btn, ToolLinkCard } from '../ui.jsx';

const EYE = { fontSize: 11, fontWeight: 700, letterSpacing: '.14em', color: '#63666A' };

// ── Two-wheel diagram ───────────────────────────────────────────────
const SEGS = {
  d0: { d: 'M194.2 43.1A162 162 0 0 1 332.4 282.3L248.0 236.5A66 66 0 0 0 191.7 139.0Z', x: 290.5, y: 147, lines: ['Annual', 'planning'] },
  d1: { d: 'M328.1 289.6A162 162 0 0 1 51.9 289.6L133.7 239.5A66 66 0 0 0 246.3 239.5Z', x: 190, y: 321, lines: ['Quarterly', 'follow-up'] },
  d2: { d: 'M47.6 282.3A162 162 0 0 1 185.8 43.1L188.3 139.0A66 66 0 0 0 132.0 236.5Z', x: 89.5, y: 147, lines: ['Ad-hoc', 'coaching'] },
  c0: { d: 'M574.2 43.1A162 162 0 0 1 712.4 282.3L628.0 236.5A66 66 0 0 0 571.7 139.0Z', x: 670.5, y: 147, lines: ['Pipeline and', 'Opportunity'] },
  c1: { d: 'M708.1 289.6A162 162 0 0 1 431.9 289.6L513.7 239.5A66 66 0 0 0 626.3 239.5Z', x: 570, y: 321, lines: ['Account'] },
  c2: { d: 'M427.6 282.3A162 162 0 0 1 565.8 43.1L568.3 139.0A66 66 0 0 0 512.0 236.5Z', x: 469.5, y: 147, lines: ['Visit and', 'Activity'] },
};
const COM = [['mt-pipe', 'mt-team', 'tk-winroom'], ['mt-acc', 'tk-seg'], ['mt-act', 'tk-plan']];
const DEV = [['tk-devmeet', 'tk-pdp'], ['tk-devmeet', 'tk-qdr'], ['tk-devmeet', 'tk-qbank']];

export function Wheels({ chId }) {
  const [sel, setSel] = useState('c0');
  const cw = LIB['commercial-wheel'];
  const secBy = id => (cw ? cw.sections.find(x => x.id === id) : null);
  const disc = secBy('three-commercial-management-disciplines'), dt = disc ? disc.intro.find(b => b.t === 'table') : null;
  const dev = secBy('personal-development-meeting-rhythm');
  const k = sel[0], i = +sel[1];
  let wheel;
  if (k === 'c') {
    const r = dt ? dt.rows[i] : null;
    wheel = { eyebrow: 'Sales development wheel · discipline', title: r ? strip(r[0]) : '', fields: r ? [1, 2].map(c => ({ label: strip(dt.head[c]), text: strip(r[c]) })) : [], links: COM[i] };
  } else {
    const sub = dev ? dev.subs[i] : null, p = sub ? sub.blocks.find(b => b.t === 'p') : null, m = p ? /^([^:]{3,30}):\s*([\s\S]*)$/.exec(strip(p.h)) : null;
    wheel = { eyebrow: 'Personal development wheel · meeting', title: sub ? sub.title : '', fields: p ? [m ? { label: m[1], text: m[2] } : { label: '', text: strip(p.h) }] : [], links: DEV[i] };
  }
  const seg = key => {
    const s = SEGS[key], on = sel === key, base = key[0] === 'd' ? '#1E3A66' : '#142850';
    return (
      <g key={key}>
        <path d={s.d} role="button" tabIndex={0} aria-pressed={on} aria-label={s.lines.join(' ')} onClick={() => setSel(key)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSel(key); } }}
          className="hv-op9" style={{ fill: on ? '#00638E' : base, cursor: 'pointer', transition: 'fill 200ms ease' }} />
        <text x={s.x} y={s.y} style={{ fill: '#fff', fontSize: 12, fontWeight: 800, textAnchor: 'middle', pointerEvents: 'none' }}>
          {s.lines.length === 1 ? <tspan x={s.x} dy="4">{s.lines[0]}</tspan> : s.lines.map((l, j) => <tspan key={j} x={s.x} dy={j ? 15 : -3}>{l}</tspan>)}
        </text>
      </g>
    );
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <span style={EYE}>SELECT A PART OF EITHER WHEEL</span>
      <svg viewBox="0 0 760 420" style={{ width: '100%', height: 'auto', display: 'block', fontFamily: 'inherit' }}>
        <defs><marker id="wh-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style={{ fill: '#00638E' }} /></marker></defs>
        <text x="380" y="22" style={{ fill: '#63666A', fontSize: 13, fontWeight: 700, textAnchor: 'middle' }}>Development priorities shape commercial effort</text>
        <path d="M316 86 C 350 34, 410 34, 444 86" style={{ fill: 'none', stroke: '#00638E', strokeWidth: 2 }} markerEnd="url(#wh-arrow)" />
        <path d="M444 324 C 410 376, 350 376, 316 324" style={{ fill: 'none', stroke: '#00638E', strokeWidth: 2 }} markerEnd="url(#wh-arrow)" />
        <text x="380" y="410" style={{ fill: '#63666A', fontSize: 13, fontWeight: 700, textAnchor: 'middle' }}>Commercial reviews reveal coaching needs</text>
        {['d0', 'd1', 'd2'].map(seg)}
        <text x="190" y="205" style={{ fill: '#142850', fontSize: 15, fontWeight: 800, textAnchor: 'middle' }}><tspan x="190" dy="-12">Personal</tspan><tspan x="190" dy="18">development</tspan><tspan x="190" dy="18">wheel</tspan></text>
        {['c0', 'c1', 'c2'].map(seg)}
        <text x="570" y="205" style={{ fill: '#142850', fontSize: 15, fontWeight: 800, textAnchor: 'middle' }}><tspan x="570" dy="-12">Sales</tspan><tspan x="570" dy="18">development</tspan><tspan x="570" dy="18">wheel</tspan></text>
      </svg>
      <div aria-live="polite" style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '24px 26px', border: '1px solid #D8D9DA', borderTop: '3px solid #00638E', borderRadius: 4 }}>
        <span style={{ ...EYE, textTransform: 'uppercase' }}>{wheel.eyebrow}</span>
        <span style={{ fontSize: 24, lineHeight: 1.2, fontWeight: 800, color: '#00638E' }}>{wheel.title}</span>
        {wheel.fields.map((f, j) => (
          <div key={j} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {f.label && <span style={ST.fieldLabel}>{f.label}</span>}
            <span style={{ fontSize: 16, lineHeight: 1.55, color: '#1A1A1A' }}>{f.text}</span>
          </div>
        ))}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 10, paddingTop: 4 }}>
          {wheel.links.filter(isShown).map(id => (
            <Link key={id} to={`/toolbox/${id}`} state={{ from: chId }} className="hv-bd-blue tr" style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '14px 16px', border: '1px solid #D8D9DA', borderRadius: 4 }}>
              <span style={ST.fieldLabel}>{BY[id].kind}</span>
              <span style={{ fontSize: 14, lineHeight: 1.3, fontWeight: 800, color: '#00638E' }}>{BY[id].title}</span>
              <span style={{ fontSize: 12, lineHeight: 1.4, color: '#63666A' }}>{BY[id].rhythm ? toolMeta(BY[id]) : BY[id].kind}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Four instances ──────────────────────────────────────────────────
export function FourInstances({ sec, chId }) {
  const [fi, setFi] = useState(0);
  const rhSub = sec.subs.find(x => x.title === 'The commercial rhythm'), rt = rhSub && rhSub.blocks.find(b => b.t === 'table');
  const meets = sec.subs.filter(x => x !== rhSub), i = Math.min(fi, meets.length - 1), mt = meets[i];
  const tl = mt ? TOOLS.find(x => x.title === mt.title) : null;
  const M = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'], cols = 'minmax(150px,1.6fr) repeat(12,minmax(0,1fr))';
  const MN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const per = (fq, m) => (/two weeks/i.test(fq) ? 2 : /quarter/i.test(fq) ? (m % 3 === 0 ? 1 : 0) : /month/i.test(fq) ? 1 : 0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      <div style={ST.stack}><Blocks list={sec.intro} lede /></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <span style={EYE}>Select a meeting</span>
        <div role="tablist" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 6 }}>
          {meets.map((x, j) => (
            <button key={j} type="button" role="tab" aria-selected={j === i} onClick={() => setFi(j)} className="tr tap" style={{ padding: '12px 14px', borderRadius: 4, fontSize: 14, fontWeight: 800, lineHeight: 1.3, border: '1px solid ' + (j === i ? '#00638E' : '#D8D9DA'), background: j === i ? '#00638E' : '#fff', color: j === i ? '#fff' : '#142850' }}>{x.title.replace(/ meeting$/, '')}</button>
          ))}
        </div>
        <div role="tabpanel" style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 6 }}>
          {mt && mt.blocks.map((b, j) => {
            const g = /^(Good looks like[\s\S]*?)\s(Red flags[\s\S]*)$/.exec(b.h || '');
            if (g) return (
              <div key={j} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 10 }}>
                <div style={{ padding: '18px 20px', background: '#F2F3F4', borderRadius: 4, display: 'flex', flexDirection: 'column', gap: 8 }}><span style={{ ...ST.eyebrow, color: '#0E7C66' }}>Good</span><Rich as="p" style={{ ...ST.p, fontSize: 15.5 }} html={g[1]} /></div>
                <div style={{ padding: '18px 20px', border: '1px solid #FF7768', borderRadius: 4, display: 'flex', flexDirection: 'column', gap: 8 }}><span style={{ ...ST.eyebrow, color: '#D20014' }}>Red flags</span><Rich as="p" style={{ ...ST.p, fontSize: 15.5 }} html={g[2]} /></div>
              </div>
            );
            return <Blocks key={j} list={[b]} />;
          })}
          {tl && <ToolLinkCard tool={tl} from={chId} />}
        </div>
      </div>
      {rhSub && (
        <div style={{ ...ST.stack, paddingTop: 12 }}>
          <h2 style={ST.h3}>{rhSub.title}</h2>
          {rt && (
            <div style={{ border: '1px solid #D8D9DA', borderRadius: 4, overflowX: 'auto' }}>
              <div style={{ minWidth: 560 }}>
                <div style={{ display: 'grid', gridTemplateColumns: cols, background: '#F2F3F4', padding: '10px 16px', fontSize: 11, fontWeight: 800, color: '#63666A' }}>
                  <span>MEETING</span>{M.map((x, k) => <span key={k} title={MN[k]} style={{ textAlign: 'center' }}>{x}</span>)}
                </div>
                {rt.rows.map((r, j) => {
                  const fq = strip(r[1]), tt = TOOLS.find(x => x.rhythm === strip(r[0]));
                  return (
                    <div key={j} style={{ display: 'grid', gridTemplateColumns: cols, alignItems: 'center', padding: '14px 16px', borderTop: '1px solid #EEEFF0' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, paddingRight: 12 }}>
                        {tt ? <Link to={`/toolbox/${tt.id}`} state={{ from: chId }} className="hv-underline" style={{ fontSize: 14, fontWeight: 800, lineHeight: 1.3, color: '#00638E' }}>{tt.title.replace(/ meeting$/, '')}</Link>
                          : <span style={{ fontSize: 14, fontWeight: 800, lineHeight: 1.3, color: '#142850' }}>{strip(r[0])}</span>}
                        <span style={{ fontSize: 12, lineHeight: 1.4, color: '#63666A' }}>{fq.charAt(0).toUpperCase() + fq.slice(1) + ' · ' + strip(r[2])}</span>
                      </div>
                      {M.map((x, k) => (
                        <div key={k} aria-hidden="true" style={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
                          {Array.from({ length: per(fq, k) }, (_, q) => <span key={q} style={{ width: 8, height: 8, borderRadius: 999, background: /^Team/.test(strip(r[0])) ? '#142850' : '#00638E' }} />)}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {rhSub.blocks.filter(b => b.t !== 'table').map((b, j) => <Rich key={j} as="p" style={ST.p} html={b.h} />)}
          {rt && <p style={{ fontSize: 13, lineHeight: 1.5, color: '#63666A', margin: 0 }}>{strip(rt.head[3]) + ': ' + [...new Set(rt.rows.map(r => strip(r[3])))].join('; ') + '.'}</p>}
        </div>
      )}
    </div>
  );
}

// ── Coaching in Rockfon sales (sct-1) ───────────────────────────────
export function CoachIntro({ sec }) {
  const ib = sec.intro;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {ib.map((b, i) => {
        if (b.t !== 'p') return <Blocks key={i} list={[b]} />;
        const tx = strip(b.h), src = /^(.*?difficulty):\s*(.+?), such as (.+?); (.+?), such as (.+?); and (.+?), such as (.+?)\.\s*([\s\S]*)$/.exec(tx);
        if (i === 0) return <Rich key={i} as="p" style={ST.lede} html={b.h} />;
        if (/^Coaching is a structured conversation/.test(tx)) return (
          <div key={i} style={{ background: '#142850', color: '#fff', padding: '28px 30px', borderRadius: 4, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span style={{ ...ST.eyebrow, color: '#45A6DE' }}>What coaching is</span>
            <Rich as="p" style={{ fontSize: 19, lineHeight: 1.6, margin: 0, fontWeight: 500, textWrap: 'pretty' }} html={b.h} />
          </div>
        );
                if (src) return (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p style={ST.p}>{src[1]}:</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 10 }}>
              {[[src[2], src[3]], [src[4], src[5]], [src[6], src[7]]].map(([a, c], j) => (
                <div key={j} style={{ padding: '18px 20px', border: '1px solid #D8D9DA', borderTop: '3px solid #00638E', borderRadius: 4, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: '#00638E' }}>{a[0].toUpperCase() + a.slice(1)}</span>
                  <span style={{ fontSize: 15, lineHeight: 1.5, color: '#1A1A1A' }}>Such as {c}</span>
                </div>
              ))}
            </div>
            {src[8] && <p style={ST.p}>{src[8]}</p>}
          </div>
        );
        if (i === ib.length - 1) return <Rich key={i} as="p" style={ST.quote} html={b.h} />;
        return <Rich key={i} as="p" style={ST.p} html={b.h} />;
      })}
      {sec.subs.map((sub, si) => (
        <div key={si} style={{ ...ST.stack, paddingTop: 24 }}>
          <h2 style={ST.h3}>{sub.title}</h2>
          {sub.blocks.map((b, j) => {
            if (b.t === 'ol') return (
              <ol key={j} style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 10 }}>
                {b.items.map((h, k) => {
                  const t = strip(h), d = t.indexOf('. ');
                  return (
                    <li key={k} style={{ padding: '18px 20px', background: '#F2F3F4', borderRadius: 4, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <span aria-hidden="true" style={{ fontSize: 13, fontWeight: 800, color: '#00638E' }}>{String(k + 1).padStart(2, '0')}</span>
                      <span style={{ fontSize: 17, fontWeight: 800, lineHeight: 1.3, color: '#142850' }}>{d > 0 ? t.slice(0, d) : t}</span>
                      {d > 0 && <span style={{ fontSize: 15, lineHeight: 1.5, color: '#1A1A1A' }}>{t.slice(d + 2)}</span>}
                    </li>
                  );
                })}
              </ol>
            );
            if (b.t === 'p' && /^Accountability means/.test(strip(b.h))) return <div key={j} style={{ padding: '22px 24px', border: '1px solid #00638E', borderRadius: 4 }}><Rich as="p" style={ST.p} html={b.h} /></div>;
            return <Blocks key={j} list={[b]} />;
          })}
        </div>
      ))}
    </div>
  );
}

// ── Expectations (two cards) ───────────────────────────────────────
export function Expect({ sec }) {
  const ib = sec.intro;
  const lead = ib.filter(b => b.t === 'p'), lists = ib.filter(b => b.t === 'ul');
  const card = (l, list, bg) => (
    <div style={{ border: '1px solid #D8D9DA', borderRadius: 4, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: bg, color: '#fff', padding: '18px 22px' }}><Rich style={{ fontSize: 17, lineHeight: 1.35, fontWeight: 800 }} html={l.h} /></div>
      <ul style={{ ...ST.ul, padding: '18px 22px 20px 40px', margin: 0 }}>{list.items.map((h, j) => <Rich key={j} as="li" style={{ ...ST.li, fontSize: 15.5 }} html={h} />)}</ul>
    </div>
  );
  if (lead.length < 2 || lists.length < 2) return <div style={ST.stack}><Blocks list={ib} lede /></div>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>{card(lead[0], lists[0], '#142850')}{card(lead[1], lists[1], '#00638E')}</div>
      {lead.slice(2).map((b, i) => <div key={i} style={{ padding: '22px 24px', background: '#F2F3F4', borderRadius: 4 }}><Rich as="p" style={{ ...ST.p, margin: 0 }} html={b.h} /></div>)}
    </div>
  );
}

// ── Self-check: rate each statement 1–5 ────────────────────────────
export function SelfCheck({ sec, topicId }) {
  const [sc, setSc] = useStoredMap('selfCheck');
  const labels = sec ? sec.intro.map(b => (/^<strong>([^<]+?)\.?<\/strong>\s+\S/.exec(b.h) || [])[1]).filter(Boolean) : [];
  const rows = labels.length ? labels : Array.from({ length: 5 }, () => null);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontSize: 15, fontWeight: 800, color: '#142850' }}>How true is this for you today? <span style={{ fontWeight: 600, color: '#63666A' }}>1 = not at all · 5 = fully</span></div>
      <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid #D8D9DA', borderRadius: 4 }}>
        {rows.map((label, i) => {
          const key = topicId + ':' + (label || i);
          return (
            <div key={i} role="group" aria-label={label || `Statement ${i + 1}`} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16, padding: '16px 20px', borderBottom: i < rows.length - 1 ? '1px solid #EEEFF0' : 0 }}>
              <div style={{ flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', gap: 7 }}>
                {label ? <span style={{ fontSize: 16, fontWeight: 800, color: '#142850' }}>{label}</span>
                  : <><div style={{ height: 11, borderRadius: 2, background: '#D8D9DA', width: '70%' }} /><div style={{ height: 9, borderRadius: 2, background: '#E4E5E6', width: '46%' }} /></>}
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[1, 2, 3, 4, 5].map(n => {
                  const on = sc[key] === n;
                  return <button key={n} type="button" aria-pressed={on} aria-label={`${n} of 5`} onClick={() => setSc(key, n)} className="tr" style={{ width: 44, height: 44, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, border: `1px solid ${on ? '#00638E' : '#B1B2B4'}`, background: on ? '#00638E' : '#fff', color: on ? '#fff' : '#63666A' }}>{n}</button>;
                })}
              </div>
            </div>
          );
        })}
      </div>
      <span style={{ fontSize: 12, color: '#63666A' }}>Your answers stay on this device. Nobody else sees them.</span>
    </div>
  );
}

// ── Change tracker: team × measure status dots ─────────────────────
const TRACK_DEF = [0, 0, 1, 0, 1, 2, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1];
const DOT = ['#1AB092', '#D6B874', '#D20014'];
const DOT_NAME = ['On track', 'Needs attention', 'Off track'];
export function Tracker() {
  const [tracker, setTracker] = useStoredMap('tracker');
  const grid = 'minmax(0,1.4fr) repeat(4,minmax(0,1fr))';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'center', fontSize: 12, fontWeight: 700, color: '#63666A' }}>
        {DOT_NAME.map((n, i) => <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: '50%', background: DOT[i] }} />{n}</span>)}
        <span style={{ marginLeft: 'auto', fontWeight: 600 }}>Click a dot to change it</span>
      </div>
      <div style={{ border: '1px solid #D8D9DA', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: grid, background: '#F2F3F4', fontSize: 10.5, fontWeight: 700, letterSpacing: '.12em', color: '#63666A' }}>
          <div style={{ padding: '12px 16px' }}>TEAM</div>{[1, 2, 3, 4].map(m => <div key={m} style={{ padding: '12px 8px', textAlign: 'center' }}>MEASURE {m}</div>)}
        </div>
        {[1, 2, 3, 4].map(r => (
          <div key={r} style={{ display: 'grid', gridTemplateColumns: grid, alignItems: 'center', borderTop: '1px solid #EEEFF0' }}>
            <div style={{ padding: '14px 16px', fontSize: 14, fontWeight: 800, color: '#142850' }}>Team {r}</div>
            {[0, 1, 2, 3].map(c => {
              const k = `${r - 1}:${c}`, val = tracker[k] ?? TRACK_DEF[(r - 1) * 4 + c];
              return (
                <div key={c} style={{ padding: 8, display: 'flex', justifyContent: 'center' }}>
                  <button type="button" aria-label={`Team ${r}, measure ${c + 1}: ${DOT_NAME[val]}`} onClick={() => setTracker(k, (val + 1) % 3)} style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ width: 28, height: 28, borderRadius: '50%', background: DOT[val], transition: 'background 160ms ease' }} />
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex' }}><Btn variant="secondary">Download template</Btn></div>
    </div>
  );
}
