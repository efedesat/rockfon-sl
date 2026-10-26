// Must-Win Opportunity Deep-dive: score five dimensions 1–4, read the verdict, see the radar.
// Dimensions, questions, scale and verdicts come from site-map.json → dealRoom.
// There is deliberately no "required" score.
import { DEAL_ROOM, LIB, strip } from '../content.js';
import { useStoredMap } from '../store.js';

const COL = { 1: { dot: '#D20014', bg: '#FBE6E8', fg: '#B00011' }, 2: { dot: '#D6B874', bg: '#F6EEDC', fg: '#6B5418' }, 3: { dot: '#00638E', bg: '#E2EEF4', fg: '#00638E' }, 4: { dot: '#1AB092', bg: '#DFF3EE', fg: '#0E7C66' } };
const GEO = { cx: 210, cy: 142, r: 100 };
const LBL = { fontSize: 10.5, fontWeight: 700, letterSpacing: '.12em', color: '#63666A' };

const pt = (i, val) => { const a = (-90 + 72 * i) * Math.PI / 180, r = GEO.r * val / 4; return [GEO.cx + r * Math.cos(a), GEO.cy + r * Math.sin(a)]; };
const ring = v => [0, 1, 2, 3, 4].map(i => pt(i, v).map(x => x.toFixed(1)).join(',')).join(' ');
const LABELS = [[210, 26, 'middle'], [318.4, 110.8, 'start'], [277, 244.2, 'start'], [143, 244.2, 'end'], [101.6, 110.8, 'end']];

// Legend wording from the deep-dive's "Score / Evidence position" table, if present.
function scaleLegend() {
  const cw = LIB['commercial-wheel'];
  const sec = cw && cw.sections.find(x => /must-win opportunity deep-dive/i.test(x.title));
  const t = sec && sec.subs.map(x => x.blocks.find(b => b.t === 'table' && strip(b.head[0]) === 'Score')).find(Boolean);
  return t ? t.rows.map(r => strip(r[1])) : DEAL_ROOM.scale;
}

export function dealRoomLines(v) {
  const sc = (v && v.sc) || {};
  return DEAL_ROOM.dimensions.map((d, j) => (sc[j] ? d.name + ': ' + sc[j] + ' · ' + DEAL_ROOM.scale[sc[j] - 1] : null)).filter(Boolean);
}

export default function DealRoom({ storeKey, eyebrow }) {
  const [all, setEntry, setAll] = useStoredMap('dealRoom');
  const v = all[storeKey] || {}, sc = v.sc || {};
  const dims = DEAL_ROOM.dimensions;
  const update = patch => setEntry(storeKey, cur => ({ ...(cur || {}), ...patch(cur || {}) }));
  const score = (i, k) => update(c => { const o = { ...(c.sc || {}) }; if (o[i] === k) delete o[i]; else o[i] = k; return { sc: o }; });
  const clear = () => setAll(a => { const o = { ...a }; delete o[storeKey]; return o; });

  const poly = dims.map((d, i) => pt(i, sc[i] || 0).map(x => x.toFixed(1)).join(',')).join(' ');

  return (
    <div style={{ border: '1px solid #D8D9DA', borderRadius: 4, overflow: 'hidden', background: '#fff' }}>
      <div style={{ background: '#142850', color: '#fff', padding: '18px 22px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px 20px' }}>
        <span style={{ flex: 1, minWidth: 220, fontSize: 11, fontWeight: 700, letterSpacing: '.14em', opacity: 0.8 }}>{eyebrow}</span>
        <input aria-label="Opportunity name" value={v.name || ''} onChange={e => { const t = e.target.value; update(() => ({ name: t })); }} placeholder="Opportunity name"
          style={{ flex: 1, minWidth: 200, height: 44, padding: '0 12px', borderRadius: 3, border: '1px solid rgba(255,255,255,.3)', background: 'rgba(255,255,255,.1)', color: '#fff', fontSize: 14, outline: 'none' }} />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 420px', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          {dims.map((d, i) => {
            const n = sc[i], C = COL[n];
            return (
              <div key={i} role="group" aria-label={d.name} style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '16px 22px', borderBottom: '1px solid #EEEFF0' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px 16px' }}>
                  <div style={{ flex: 1, minWidth: 220, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#00638E' }}>{d.name}</span>
                    <span style={{ fontSize: 16, lineHeight: 1.4, fontWeight: 600, color: '#142850', textWrap: 'pretty' }}>{d.question}</span>
                  </div>
                  <div role="radiogroup" aria-label={d.name} style={{ display: 'flex', gap: 6 }}>
                    {[1, 2, 3, 4].map(k => {
                      const on = n === k;
                      return <button key={k} type="button" role="radio" aria-checked={on} aria-label={`${k} · ${DEAL_ROOM.scale[k - 1]}`} onClick={() => score(i, k)} className="hv-bd-blue tr"
                        style={{ width: 44, height: 44, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, border: `1px solid ${on ? COL[k].dot : '#B1B2B4'}`, background: on ? COL[k].dot : '#fff', color: on ? (k === 2 ? '#142850' : '#fff') : '#63666A' }}>{k}</button>;
                    })}
                  </div>
                </div>
                {n && (
                  <div aria-live="polite" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '6px 12px', padding: '10px 14px', borderRadius: 3, background: C.bg }}>
                    <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', whiteSpace: 'nowrap', color: C.fg }}>{n} · {DEAL_ROOM.scale[n - 1]}</span>
                    <span style={{ flex: 1, minWidth: 200, fontSize: 14, lineHeight: 1.5, color: '#1A1A1A' }}>{d.verdicts[n - 1]}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ flex: '1 1 300px', maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: 16, padding: '20px 22px', background: '#F7F8F8', borderLeft: '1px solid #EEEFF0' }}>
          <span style={LBL}>EVIDENCE PROFILE</span>
          <svg viewBox="0 0 420 290" role="img" aria-label={'Evidence profile: ' + (dealRoomLines(v).join('; ') || 'not scored yet')} style={{ width: '100%', height: 'auto', display: 'block', fontFamily: 'inherit' }}>
            {[4, 3, 2, 1].map(k => <polygon key={k} points={ring(k)} fill={k === 4 ? '#fff' : 'none'} stroke="#D8D9DA" strokeWidth="1" />)}
            {[0, 1, 2, 3, 4].map(i => { const [x, y] = pt(i, 4); return <line key={i} x1={GEO.cx} y1={GEO.cy} x2={x.toFixed(1)} y2={y.toFixed(1)} stroke="#D8D9DA" strokeWidth="1" />; })}
            <polygon points={poly} fill="rgba(0,99,142,.16)" stroke="#00638E" strokeWidth="2" strokeLinejoin="round" style={{ transition: 'all 250ms ease' }} />
            {dims.map((d, i) => { if (!sc[i]) return null; const [x, y] = pt(i, sc[i]); return <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r="6" fill={COL[sc[i]].dot} stroke="#fff" strokeWidth="2" />; })}
            {dims.map((d, i) => <text key={i} x={LABELS[i][0]} y={LABELS[i][1]} textAnchor={LABELS[i][2]} style={{ fontSize: 13, fontWeight: 800, fill: '#142850' }}>{d.name}</text>)}
            {[1, 2, 3, 4].map(k => <text key={k} x="215" y={GEO.cy - 25 * k + 4} style={{ fontSize: 10, fontWeight: 700, fill: '#8A8D91' }}>{k}</text>)}
          </svg>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px 10px', alignItems: 'center', fontSize: 12.5, color: '#63666A' }}>
            {scaleLegend().map((s, j) => [
              <span key={'c' + j} style={{ width: 14, height: 14, borderRadius: 2, background: COL[j + 1].dot }} />,
              <span key={'l' + j}><strong style={{ color: '#142850' }}>{j + 1}</strong> {s}</span>,
            ])}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', padding: '12px 22px', borderTop: '1px solid #D8D9DA', fontSize: 12.5, color: '#63666A' }}>
        <span>Saved on this device only. Don't average the scores; one weak dimension can block the deal.</span>
        <button type="button" onClick={clear} style={{ fontWeight: 700, color: '#00638E' }}>Clear scores</button>
      </div>
    </div>
  );
}
