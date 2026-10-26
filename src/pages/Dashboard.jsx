// Dashboard guide: a wireframe of the three report pages until the report is ready.
// Page questions and element texts come from site-map.json → dashboard. The sample
// layout data below only draws the wireframe; it is not real.
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DASHBOARD } from '../content.js';
import { useMem } from '../store.js';
import { PillToggle } from '../ui.jsx';

const LBL = { fontSize: 10.5, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#63666A' };
const NOTE = { fontSize: 11.5, lineHeight: 1.45, color: '#63666A' };
const TH = { padding: '8px 10px' };
const TONE = { act: { bg: '#fff', fg: '#00638E', bd: '#00638E' }, over: { bg: '#D20014', fg: '#fff', bd: '#D20014' }, unk: { bg: '#F2F3F4', fg: '#63666A', bd: '#D8D9DA' }, type: { bg: '#fff', fg: '#142850', bd: '#B1B2B4' } };

const bar = (w, tag) => ({ w, tag });
const chip = (label, tone) => ({ label, tone });
const NONE = {};

function Cell({ c }) {
  return (
    <div style={{ minWidth: 0, display: 'flex', alignItems: 'center', gap: 6, padding: '9px 10px' }}>
      {c.w && <div style={{ flex: '0 1 auto', height: 8, borderRadius: 2, background: '#D8D9DA', width: c.w }} />}
      {c.label && <span style={{ flex: 'none', padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', border: `1px solid ${TONE[c.tone].bd}`, background: TONE[c.tone].bg, color: TONE[c.tone].fg }}>{c.label}</span>}
      {c.tag && <span style={{ flex: 'none', fontSize: 9.5, fontWeight: 800, letterSpacing: '.1em', color: '#00638E' }}>{c.tag}</span>}
    </div>
  );
}

function Table({ cols, head, rows, minWidth }) {
  return (
    <div style={{ overflowX: 'auto', overflowY: 'hidden' }}>
      <div style={{ minWidth, border: '1px solid #EEEFF0', borderRadius: 3 }}>
        <div style={{ display: 'grid', gridTemplateColumns: cols, background: '#F2F3F4', fontSize: 11, fontWeight: 800, color: '#142850' }}>{head.map(h => <div key={h} style={TH}>{h}</div>)}</div>
        {rows.map((r, i) => <div key={i} style={{ display: 'grid', gridTemplateColumns: cols, borderTop: '1px solid #EEEFF0', fontSize: 12 }}>{r.map((c, j) => <Cell key={j} c={c} />)}</div>)}
      </div>
    </div>
  );
}

function Pills({ options, value, onChange, small = true }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {options.map(([k, name]) => (
        <button key={k} type="button" aria-pressed={value === k} onClick={() => onChange(k)} className="tr"
          style={{ padding: small ? '4px 10px' : '9px 16px', borderRadius: 999, fontSize: small ? 11.5 : 13, fontWeight: 700, border: '1px solid #00638E', background: value === k ? '#00638E' : '#fff', color: value === k ? '#fff' : '#00638E' }}>{name}</button>
      ))}
    </div>
  );
}

function Legend({ items, round }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px' }}>
      {items.map(([bg, label]) => <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: '#1A1A1A' }}><span style={{ width: 10, height: 10, background: bg, borderRadius: round ? '50%' : 0 }} />{label}</span>)}
    </div>
  );
}

// One numbered wireframe element. Clicking anywhere on it selects it.
function El({ i, sel, onSel, title, right, children }) {
  const on = sel === i;
  return (
    <div role="button" tabIndex={0} aria-pressed={on} aria-label={`${i + 1}. ${title}`} onClick={() => onSel(i)} onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget) { e.preventDefault(); onSel(i); } }}
      style={{ minWidth: 0, background: '#fff', border: '1px solid #D8D9DA', borderRadius: 4, padding: '14px 16px 16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 12, boxShadow: on ? '0 0 0 2px #00638E' : 'none', transition: 'box-shadow 160ms ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ flex: 'none', width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11.5, fontWeight: 800, border: '1.5px solid #00638E', background: on ? '#00638E' : '#fff', color: on ? '#fff' : '#00638E' }}>{i + 1}</span>
        <span style={{ fontSize: 13.5, fontWeight: 800, color: '#142850' }}>{title}</span>
        {right && <div style={{ marginLeft: 'auto' }}>{right}</div>}
      </div>
      {children}
    </div>
  );
}

const grid2 = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 12, alignItems: 'stretch' };
const stack = { display: 'flex', flexDirection: 'column', gap: 12 };

function PipelinePage({ els, sel, onSel }) {
  const [split, setSplit] = useMem('dashSplit', 'v');
  const [sort, setSort] = useMem('dashSort', 'upd');
  const [stat, setStat] = useMem('dashStat', 'open');
  const VC = ['#142850', '#00638E', '#45A6DE', '#D6B874'], PC = ['#142850', '#00638E', '#45A6DE'];
  const shares = split === 'v' ? [[.35, .25, .25, .15], [.3, .3, .2, .2], [.4, .2, .25, .15], [.25, .35, .2, .2], [.3, .2, .3, .2]] : [[.5, .2, .3], [.45, .25, .3], [.55, .15, .3], [.4, .3, .3], [.5, .2, .3]];
  const runway = ['Q1', 'Q2', 'Q3', 'Q4', 'Unallocated'].map((label, i) => ({ label, h: [62, 84, 56, 40, 34][i] + '%', last: i === 4, segs: shares[i].map((f, j) => ({ f, bg: (split === 'v' ? VC : PC)[j] })) }));
  const legend = split === 'v' ? VC.map((bg, i) => [bg, 'Vertical ' + (i + 1)]) : ['Tile-only', 'Grid-only', 'Tile-and-grid'].map((l, i) => [PC[i], l]);
  const OPP = [{ id: 0, pin: 1, u: 2, c: 40, v: 7, n: 1, d: 0 }, { id: 1, pin: 1, u: 5, c: 65, v: 9, n: 1, d: 0 }, { id: 2, u: 34, c: 90, v: 5, n: 1, d: 2 }, { id: 3, u: 1, c: 3, v: null, n: 0, d: 0 }, { id: 4, u: 12, c: 20, v: 3, n: 1, d: 0 }, { id: 5, u: 27, c: 120, v: 8, n: 0, d: 0 }, { id: 6, u: 8, c: 30, v: 6, n: 1, d: 2 }];
  const key = o => (sort === 'upd' ? o.u : sort === 'new' ? o.c : -(o.v == null ? -1 : o.v));
  const openRows = OPP.slice().sort((a, b) => (b.pin || 0) - (a.pin || 0) || key(a) - key(b)).map(o => [bar((50 + o.id * 6) + '%', o.pin ? 'COACHING' : ''), bar('62%'), o.v == null ? chip('unknown', 'unk') : bar(o.v * 10 + '%'), bar('54%'), o.u > 21 ? chip('Stalled', 'act') : bar('40%'), o.n ? bar((60 + o.id * 4) + '%') : chip('No next step', 'act'), o.d === 2 ? chip('Overdue', 'over') : o.n ? bar('52%') : NONE]);
  const closedRows = [0, 1, 2, 3].map(i => [bar((52 + i * 8) + '%'), bar('60%'), i === 2 ? chip('unknown', 'unk') : bar((40 + i * 12) + '%'), bar('54%'), bar('50%'), bar((70 + i * 5) + '%')]);
  const vel = [['Open opportunities', 'creating'], ['Average value', 'solution fit and scope'], ['Win rate', 'qualifying and closing'], ['Cycle length', 'access and momentum']];
  return (
    <div style={stack}>
      <El i={0} sel={sel} onSel={onSel} title={els[0].title}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 8 }}>
          {['Open opportunities', 'Known open Rockfon value', 'Opportunities with unknown value'].map(l => (
            <div key={l} style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '10px 12px', background: '#F7F8F8', borderRadius: 3 }}><span style={{ fontSize: 11.5, fontWeight: 600, color: '#63666A' }}>{l}</span><div style={{ height: 16, width: '46%', background: '#D8D9DA', borderRadius: 2 }} /></div>
          ))}
        </div>
      </El>
      <div style={grid2}>
        <El i={1} sel={sel} onSel={onSel} title={els[1].title} right={<Pills options={[['v', 'Vertical'], ['p', 'Product mix']]} value={split} onChange={setSplit} />}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 160, borderBottom: '1px solid #D8D9DA' }}>
              {runway.map(b => (
                <div key={b.label} style={{ flex: 1, minWidth: 0, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 5 }}>
                  <div style={{ height: 6, width: '56%', alignSelf: 'center', background: '#E4E5E6', borderRadius: 2 }} />
                  <div style={{ display: 'flex', flexDirection: 'column-reverse', height: b.h, outline: b.last ? '1.5px dashed #B1B2B4' : 'none', outlineOffset: 2, opacity: b.last ? 0.6 : 1 }}>
                    {b.segs.map((g, j) => <div key={j} style={{ flex: g.f, background: g.bg, borderTop: '1px solid #fff' }} />)}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>{runway.map(b => <span key={b.label} style={{ flex: 1, minWidth: 0, textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#142850', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.label}</span>)}</div>
          </div>
          <Legend items={legend} />
          <span style={NOTE}>Expected Rockfon value per delivery quarter. Click a segment to open the opportunities behind it.</span>
        </El>
        <El i={2} sel={sel} onSel={onSel} title={els[2].title}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 8 }}>
            {vel.map(([label, hint]) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 7, padding: '10px 12px', background: '#F7F8F8', borderRadius: 3 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: '#142850' }}>{label}</span>
                <div style={{ height: 14, width: '50%', background: '#D8D9DA', borderRadius: 2 }} />
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#63666A' }}>vs last period <span style={{ height: 7, width: 28, background: '#E4E5E6', borderRadius: 2 }} /></span>
                <span style={{ fontSize: 11, lineHeight: 1.35, color: '#63666A' }}>Watch: {hint}</span>
              </div>
            ))}
          </div>
          <span style={NOTE}>The input that moved most shows where the pipeline is stuck.</span>
        </El>
      </div>
      <El i={3} sel={sel} onSel={onSel} title={els[3].title}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '8px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={LBL}>Sort</span><Pills options={[['upd', 'Last updated'], ['new', 'Newest'], ['big', 'Biggest']]} value={sort} onChange={setSort} /></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={LBL}>Show</span><Pills options={[['open', 'Open'], ['won', 'Won'], ['lost', 'Lost']]} value={stat} onChange={setStat} /></div>
        </div>
        {stat === 'open'
          ? <Table minWidth={680} cols="minmax(0,1.9fr) minmax(0,.9fr) minmax(0,1fr) minmax(0,.8fr) minmax(0,.9fr) minmax(0,1.4fr) minmax(0,.8fr)" head={['Opportunity', 'Owner', 'Rockfon value', 'Created', 'Last update', 'Next action', 'Due']} rows={openRows} />
          : <Table minWidth={640} cols="minmax(0,1.9fr) minmax(0,.9fr) minmax(0,1fr) minmax(0,.8fr) minmax(0,.8fr) minmax(0,1.8fr)" head={['Opportunity', 'Owner', 'Rockfon value', 'Created', 'Closed', 'Reason']} rows={closedRows} />}
        <span style={NOTE}>Pinned rows are the two opportunities chosen for coaching. Must-win opportunities open the deep-dive in the 1:1 cockpit.</span>
      </El>
    </div>
  );
}

function AccountsPage({ els, sel, onSel }) {
  const [scope, setScope] = useMem('dashScope', 'a');
  const COV = [['A', 'b', 'b', 'b', 'due', 6, 4], ['A', 'over', 'gap', 'b', 'over', 8, 7], ['A', 'b', 'b', 'unk', 'b', 5, 0.5], ['A', 'miss', 'unk', 'b', 'due', 3, 6], ['B', 'b', 'gap', 'b', 'b', 4, null]]
    .concat(scope === 'all' ? [['B', 'b', 'b', 'b', 'b', 3, 2], ['C', 'b', 'unk', 'unk', 'b', 1, null], ['C', 'miss', 'b', 'b', 'b', 2, 1], ['Unclassified', 'miss', 'unk', 'unk', 'unk', null, null]] : []);
  const cc = (v, w) => (v === 'b' ? bar(w) : v === 'due' ? chip('Due', 'act') : v === 'over' ? chip('Overdue', 'over') : v === 'unk' ? chip('unknown', 'unk') : v === 'gap' ? chip('Gap', 'act') : chip('Missing', 'act'));
  const nb = v => (v == null ? chip('unknown', 'unk') : bar(Math.max(8, v * 10) + '%'));
  const covRows = COV.map((r, i) => [bar((55 + (i % 4) * 8) + '%'), r[0] === 'Unclassified' ? chip('Unclassified', 'unk') : chip(r[0], 'type'), cc(r[1], '50%'), cc(r[2], '46%'), cc(r[3], '52%'), cc(r[4], '48%'), nb(r[5]), nb(r[6])]);
  const AC = ['#142850', '#00638E', '#45A6DE'];
  const eff = [['A', [30, 18, 10], 8, 7], ['B', [22, 14, 8], 6, 5], ['C', [10, 8, 6], 3, 2], ['Unclassified', [8, 4, 3], 1, 1], ['Unlinked', [6, 3, 2], 'x', 'x']];
  const effCols = 'minmax(74px,.7fr) minmax(0,2.2fr) minmax(0,.8fr) minmax(0,.8fr)';
  const due = [['Missing plans', '#00638E'], ['Unreviewed classifications', '#00638E'], ['Stakeholder gaps', '#00638E'], ['Overdue engagement', '#D20014']];
  return (
    <div style={stack}>
      <El i={0} sel={sel} onSel={onSel} title={els[0].title} right={<Pills options={[['a', 'A and in-scope'], ['all', 'Complete portfolio']]} value={scope} onChange={setScope} />}>
        <Table minWidth={720} cols="minmax(0,1.5fr) minmax(0,.9fr) repeat(4,minmax(0,1fr)) minmax(0,.9fr) minmax(0,.9fr)" head={['Account', 'Segment', 'Plan review', 'Stakeholders', 'Last engagement', 'Next required', 'Business', 'Open pipeline']} rows={covRows} />
        <span style={NOTE}>Business and open pipeline are labelled separately. An opportunity linked to several accounts counts once in any total.</span>
      </El>
      <div style={grid2}>
        <El i={1} sel={sel} onSel={onSel} title={els[1].title}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'grid', gridTemplateColumns: effCols, gap: 10, fontSize: 11, fontWeight: 800, color: '#142850', paddingBottom: 6 }}><span>Segment</span><span>Activity hours</span><span>Business</span><span>Pipeline</span></div>
            {eff.map(r => (
              <div key={r[0]} style={{ display: 'grid', gridTemplateColumns: effCols, gap: 10, alignItems: 'center', padding: '7px 0', borderTop: '1px solid #EEEFF0' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: r[0].startsWith('Un') ? '#63666A' : '#142850' }}>{r[0]}</span>
                <div style={{ display: 'flex', height: 12 }}>{r[1].map((w, j) => <div key={j} style={{ width: w + '%', background: AC[j], borderRight: '1px solid #fff' }} />)}</div>
                {[r[2], r[3]].map((v, j) => <div key={j} style={{ minWidth: 0 }}><Cell c={v === 'x' ? chip('n/a', 'unk') : bar(v * 11 + '%')} /></div>)}
              </div>
            ))}
          </div>
          <Legend items={AC.map((bg, i) => [bg, 'Activity type ' + (i + 1)])} />
          <span style={NOTE}>Click a segment to see its accounts.</span>
        </El>
        <El i={2} sel={sel} onSel={onSel} title={els[2].title}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {due.map(([label, dot]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderTop: '1px solid #EEEFF0' }}>
                <span style={{ flex: 'none', width: 8, height: 8, borderRadius: '50%', background: dot }} /><span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: '#142850' }}>{label}</span><span style={{ flex: 'none', height: 8, width: 28, background: '#D8D9DA', borderRadius: 2 }} />
              </div>
            ))}
          </div>
        </El>
      </div>
    </div>
  );
}

function VisitsPage({ els, sel, onSel }) {
  const [mw, setMw] = useMem('dashWeek', 'both');
  const weeks = [6, 8, 5, 7, 7, 4, 3, 1].map((v, i) => ({ h: v * 11 + '%', held: i < 4, gap: i === 4 ? 14 : 0, label: i < 4 ? '−' + (4 - i) : '+' + (i - 3) }));
  const CAL = [[[16, 10], [22], [12, 12, 8], [18], []], [[14], [20, 8], [], [10, 10], [16]]];
  const PINS = [[18, 30, 1, 0], [24, 38, 1, 0], [30, 34, 2, 0], [62, 22, 3, 0], [68, 30, 3, 0], [44, 66, 4, 0], [80, 72, 5, 0], [22, 44, 6, 1], [28, 28, 6, 1], [52, 58, 7, 1], [58, 64, 7, 1], [84, 40, 9, 1], [74, 78, 10, 1]];
  const DAY = ['Mo', 'Tu', 'We', 'Th', 'Fr'];
  const cc = v => (v === 'b' ? bar('50%') : v === 'due' ? chip('Due', 'act') : v === 'over' ? chip('Overdue', 'over') : chip('unknown', 'unk'));
  const cdRows = [['Priority account', 'b', 'due'], ['Large opportunity', 'b', 'over'], ['Target group', 'unk', 'due'], ['Stakeholder role', 'b', 'due']].map(r => [chip(r[0], 'type'), bar('64%'), cc(r[1]), cc(r[2])]);
  const caRows = [0, 1, 2, 3].map(i => [bar((58 + i * 8) + '%'), bar('60%'), bar((50 + i * 10) + '%'), bar('40%'), i === 2 ? chip('No next step', 'act') : bar('62%')]);
  return (
    <div style={stack}>
      <div style={grid2}>
        <El i={0} sel={sel} onSel={onSel} title={els[0].title}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120, borderBottom: '1px solid #D8D9DA' }}>
              {weeks.map((w, i) => <div key={i} style={{ flex: 1, minWidth: 0, height: w.h, background: w.held ? '#142850' : '#fff', border: w.held ? 'none' : '1.5px dashed #00638E', marginLeft: w.gap }} />)}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>{weeks.map((w, i) => <span key={i} style={{ flex: 1, minWidth: 0, textAlign: 'center', fontSize: 10.5, fontWeight: 700, color: '#63666A', marginLeft: w.gap }}>{w.label}</span>)}</div>
          </div>
          <div style={{ display: 'flex', gap: 14, fontSize: 11.5, color: '#1A1A1A' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, background: '#142850' }} />Held</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, border: '1.5px dashed #00638E' }} />Booked</span>
          </div>
          <span style={NOTE}>Last four weeks and next four. Ask how much was proactive and how much reactive.</span>
        </El>
        <El i={1} sel={sel} onSel={onSel} title={els[1].title}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {CAL.map((wk, wi) => (
              <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: '#63666A' }}>{wi ? 'Next week' : 'This week'}</span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,minmax(0,1fr))', gap: 4 }}>
                  {wk.map((b, i) => (
                    <div key={i} style={{ height: 58, background: '#F7F8F8', borderRadius: 2, padding: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <span style={{ fontSize: 9.5, fontWeight: 700, color: '#63666A' }}>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][i]}</span>
                      {b.map((h, j) => <div key={j} style={{ height: h, background: j % 2 ? '#D8D9DA' : '#00638E', borderRadius: 1 }} />)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <span style={NOTE}>The actual calendar, with location or area for route discussions.</span>
        </El>
      </div>
      <El i={2} sel={sel} onSel={onSel} title={els[2].title}>
        <Table minWidth={380} cols="minmax(0,1.2fr) minmax(0,1.2fr) minmax(0,1fr) minmax(0,.8fr)" head={['What', 'Name', 'Last engagement', 'Due']} rows={cdRows} />
      </El>
      <El i={3} sel={sel} onSel={onSel} title={els[3].title}>
        <Table minWidth={420} cols="minmax(0,1.1fr) minmax(0,1fr) minmax(0,1.1fr) minmax(0,.7fr) minmax(0,1.1fr)" head={['Purpose', 'Contact', 'Outcome', 'Duration', 'Next action']} rows={caRows} />
        <span style={NOTE}>A click opens the record.</span>
      </El>
      <El i={4} sel={sel} onSel={onSel} title={els[4].title} right={<Pills options={[['both', 'Both weeks'], ['this', 'This week'], ['next', 'Next week']]} value={mw} onChange={setMw} />}>
        <div aria-hidden="true" style={{ position: 'relative', height: 280, borderRadius: 3, overflow: 'hidden', backgroundColor: '#EEF1F3', backgroundImage: 'linear-gradient(#E2E6E9 1px,transparent 1px),linear-gradient(90deg,#E2E6E9 1px,transparent 1px)', backgroundSize: '56px 56px' }}>
          <span style={{ position: 'absolute', left: 12, top: 10, fontSize: 11, fontWeight: 700, color: '#63666A' }}>Map of the sales area</span>
          {PINS.filter(p => mw === 'both' || (mw === 'this' ? !p[3] : p[3])).map(([x, y, n, nx], i) => (
            <div key={i} style={{ position: 'absolute', left: x + '%', top: y + '%', width: 24, height: 24, margin: '-12px 0 0 -12px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, background: nx ? '#fff' : '#142850', color: nx ? '#00638E' : '#fff', border: nx ? '1.5px solid #00638E' : 'none', boxShadow: '0 1px 3px rgba(20,40,80,.25)' }}>{DAY[(n - 1) % 5]}</div>
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px', fontSize: 11.5, color: '#1A1A1A' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: '#142850' }} />This week</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: '50%', border: '1.5px solid #00638E', background: '#fff' }} />Next week</span>
          <span style={{ color: '#63666A' }}>Labels show the day. Each pin opens the booking.</span>
        </div>
        <span style={NOTE}>Clusters and long hops show whether the routes make sense. Needs a location on each booking.</span>
      </El>
    </div>
  );
}

const PAGES = [PipelinePage, AccountsPage, VisitsPage];

export default function Dashboard({ narrow }) {
  const [params, setParams] = useSearchParams();
  const [tab, setTab] = useMem('dashTab', 0);
  const [selMap, setSelMap] = useMem('dashSel', {});
  // Deep link from a cockpit point: ?page=P&el=E.
  useEffect(() => {
    const p = params.get('page'), e = params.get('el');
    if (p == null) return;
    const P = Math.max(0, Math.min(DASHBOARD.length - 1, +p || 0));
    setTab(P);
    if (e != null) setSelMap(s => ({ ...s, [P]: +e || 0 }));
    setParams({}, { replace: true });
  }, [params, setParams, setTab, setSelMap]);
  const P = Math.min(tab, DASHBOARD.length - 1), pg = DASHBOARD[P];
  if (!pg) return null;
  const sel = Math.min(selMap[P] ?? (P === 0 ? 1 : 0), pg.elements.length - 1), el = pg.elements[sel];
  const onSel = i => setSelMap(s => ({ ...s, [P]: i }));
  const Page = PAGES[P];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <div role="tablist" aria-label="Dashboard pages" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {DASHBOARD.map((d, i) => <PillToggle key={d.page} on={P === i} onClick={() => setTab(i)}>{d.page}</PillToggle>)}
        </div>
        <span style={{ padding: '4px 10px', border: '1px dashed #B1B2B4', borderRadius: 3, fontSize: 11.5, fontWeight: 700, color: '#63666A' }}>Wireframe until the report is ready</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: narrow ? 'minmax(0,1fr)' : 'minmax(0,1fr) 280px', gap: narrow ? 24 : 36, alignItems: 'start' }}>
        {/* The wireframe, framed as a screen so it reads as "the dashboard", not as page content. */}
        <figure aria-label={'Wireframe of the ' + pg.page + ' dashboard page'} style={{ margin: 0, border: '1px solid #B1B2B4', borderRadius: 6, overflow: 'hidden', boxShadow: '0 6px 20px rgba(20,40,80,.10)' }}>
          <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', gap: 10, height: 34, padding: '0 14px', background: '#142850', color: '#fff' }}>
            <span style={{ display: 'flex', gap: 5 }}>{[0, 1, 2].map(i => <span key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,.35)' }} />)}</span>
            <span style={{ fontSize: 12, fontWeight: 700, opacity: 0.85 }}>Report · {pg.page}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 18, background: '#F2F3F4' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={LBL}>{pg.page}</span>
                <span style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.2, color: '#142850' }}>{pg.question}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {['Owner or team', 'Market', 'Period', 'Currency', 'Refreshed'].map(x => (
                  <div key={x} style={{ display: 'flex', flexDirection: 'column', gap: 5, padding: '6px 10px', background: '#fff', border: '1px solid #D8D9DA', borderRadius: 3, minWidth: 74 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#63666A' }}>{x}</span><span style={{ height: 7, width: '70%', background: '#E4E5E6', borderRadius: 2 }} />
                  </div>
                ))}
              </div>
            </div>
            <Page els={pg.elements} sel={sel} onSel={onSel} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', fontSize: 11.5, color: '#1A1A1A' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: '50%', border: '1.5px solid #00638E' }} />Needs a decision</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: '#D20014' }} />Overdue</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: '#D8D9DA' }} />Unknown data</span>
              <span style={{ color: '#63666A' }}>Every bar, segment and row opens the records behind it.</span>
            </div>
          </div>
        </figure>
        {/* The explanation: plain text beside the screen, following the selected element. */}
        <aside aria-live="polite" style={{ position: narrow ? 'static' : 'sticky', top: 80, display: 'flex', flexDirection: 'column', gap: 12, paddingLeft: narrow ? 0 : 20, borderLeft: narrow ? 'none' : '3px solid #00638E' }}>
          <span style={LBL}>Element {sel + 1} of {pg.elements.length}</span>
          <h2 style={{ margin: 0, fontSize: 22, lineHeight: 1.2, fontWeight: 800, color: '#00638E' }}>{el.title}</h2>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: '#1A1A1A', textWrap: 'pretty' }}>{el.shows}</p>
          <span style={{ fontSize: 12.5, lineHeight: 1.5, color: '#63666A' }}>Click a numbered element to read what it shows.</span>
        </aside>
      </div>
    </div>
  );
}
