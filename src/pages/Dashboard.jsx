// Dashboard guide: a wireframe of the three report pages until the report is ready.
// Page questions and element texts come from site-map.json → dashboard. The sample
// layout data below only draws the wireframe; it is not real.
// Training cases (content/training-cases.json) fill the same elements with fictional
// figures for the roleplays. Totals are calculated from the case rows.
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DASHBOARD } from '../content.js';
import { useMem } from '../store.js';
import { PillToggle } from '../ui.jsx';
import TRAINING from '../../content/training-cases.json';

const LBL = { fontSize: 10.5, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#63666A' };
const NOTE = { fontSize: 11.5, lineHeight: 1.45, color: '#63666A' };
const TH = { padding: '8px 10px' };
const TONE = { act: { bg: '#fff', fg: '#00638E', bd: '#00638E' }, over: { bg: '#D20014', fg: '#fff', bd: '#D20014' }, unk: { bg: '#F2F3F4', fg: '#63666A', bd: '#D8D9DA' }, type: { bg: '#fff', fg: '#142850', bd: '#B1B2B4' } };
const GOLD = '#D6B874';

const bar = (w, tag) => ({ w, tag });
const chip = (label, tone) => ({ label, tone });
const txt = (text, extra) => ({ text, ...extra });
const NONE = {};

// Training-case formatting.
const AS_OF = TRAINING.asOf;
const CASES = TRAINING.cases;
const eur = v => (v == null ? null : v >= 1e6 ? '€' + (v / 1e6).toFixed(2).replace(/\.?0+$/, '') + 'm' : '€' + Math.round(v / 1000) + 'k');
// Day and month; the year too when it differs from the case's reference date.
const day = iso => new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: iso.slice(0, 4) === AS_OF.slice(0, 4) ? undefined : 'numeric', timeZone: 'UTC' });
const pageOf = c => DASHBOARD.findIndex(d => d.page === c.page);
const FLAG = { overdue: chip('Overdue', 'over'), missing: chip('Missing', 'act'), gap: chip('Gap', 'act'), due: chip('Due', 'act'), unknown: chip('unknown', 'unk') };
// A {text, flag} field: the text, plus a chip for the flag (unknown shows only the chip).
const field = f => (f.flag === 'unknown' ? FLAG.unknown : f.flag ? txt(f.text, FLAG[f.flag]) : txt(f.text));

function Cell({ c }) {
  return (
    <div style={{ minWidth: 0, display: 'flex', flexWrap: c.text ? 'wrap' : 'nowrap', alignItems: 'center', gap: 6, padding: '9px 10px' }}>
      {c.w && <div style={{ flex: '0 1 auto', height: 8, borderRadius: 2, background: '#D8D9DA', width: c.w }} />}
      {c.text && <span style={{ minWidth: 0, fontSize: 12, lineHeight: 1.35, fontWeight: c.strong ? 700 : 400, color: '#1A1A1A' }}>{c.text}{c.sub && <span style={{ display: 'block', fontSize: 11, fontWeight: 400, color: '#63666A' }}>{c.sub}</span>}</span>}
      {c.label && <span style={{ flex: 'none', padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', border: `1px solid ${TONE[c.tone].bd}`, background: TONE[c.tone].bg, color: TONE[c.tone].fg }}>{c.label}</span>}
      {c.tag && <span style={{ flex: 'none', fontSize: 9.5, fontWeight: 800, letterSpacing: '.1em', color: '#00638E' }}>{c.tag}</span>}
    </div>
  );
}

function Table({ cols, head, rows, minWidth, maxHeight }) {
  return (
    <div style={{ overflowX: 'auto', overflowY: 'hidden' }}>
      <div style={{ minWidth, border: '1px solid #EEEFF0', borderRadius: 3 }}>
        <div style={{ display: 'grid', gridTemplateColumns: cols, background: '#F2F3F4', fontSize: 11, fontWeight: 800, color: '#142850' }}>{head.map(h => <div key={h} style={TH}>{h}</div>)}</div>
        <div style={maxHeight ? { maxHeight, overflowY: 'auto' } : null}>
          {rows.map((r, i) => <div key={i} style={{ display: 'grid', gridTemplateColumns: cols, borderTop: '1px solid #EEEFF0', fontSize: 12 }}>{r.map((c, j) => <Cell key={j} c={c} />)}</div>)}
        </div>
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

// A grey placeholder bar in the wireframe, or the figure in a training case.
const Fig = ({ v, w, h = 16 }) => (v != null
  ? <span style={{ fontSize: h >= 16 ? 22 : 18, lineHeight: 1.1, fontWeight: 800, color: '#142850' }}>{v}</span>
  : <div style={{ height: h, width: w, background: '#D8D9DA', borderRadius: 2 }} />);

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
const QS = ['Q1', 'Q2', 'Q3', 'Q4', 'Unallocated'];

// Runway, top line and velocity figures for a training case, calculated from its rows.
function pipelineFigures(pl) {
  const known = pl.open.filter(o => o.value != null);
  const total = known.reduce((s, o) => s + o.value, 0);
  const byQ = QS.map(q => {
    const v = pl.verticals.map(vt => known.filter(o => o.vertical === vt).reduce((s, o) => s + (o.alloc[q] || 0), 0));
    return { q, total: v.reduce((s, x) => s + x, 0), verticals: v };
  });
  const avg = known.length ? total / known.length : 0;
  return { known, total, byQ, max: Math.max(...byQ.map(b => b.total)), avg, unknown: pl.open.length - known.length };
}

function PipelinePage({ els, sel, onSel, tc }) {
  const [split, setSplit] = useMem('dashSplit', 'v');
  const [sort, setSort] = useMem('dashSort', 'upd');
  const [stat, setStat] = useMem('dashStat', 'open');
  const VC = ['#142850', '#00638E', '#45A6DE', '#D6B874'], PC = ['#142850', '#00638E', '#45A6DE'];
  const pl = tc && tc.pipeline, F = pl && pipelineFigures(pl);
  let runway, legend, topVals = [null, null, null], velVals = [null, null, null, null], openRows, closedRows;
  if (pl) {
    const mix = pl.productMix;
    runway = F.byQ.map((b, i) => ({ label: b.q, value: eur(b.total), h: Math.round((b.total / F.max) * 88) + '%', last: i === 4,
      segs: (split === 'v' ? b.verticals.map(v => v / (b.total || 1)) : mix.byQuarter[b.q].map(p => p / 100)).map((f, j) => ({ f, bg: (split === 'v' ? VC : PC)[j] })) }));
    legend = split === 'v' ? pl.verticals.map((l, i) => [VC[i], l]) : mix.legend.map((l, i) => [PC[i], l]);
    const v = pl.velocity;
    topVals = [String(pl.open.length), eur(F.total), String(F.unknown)];
    velVals = [[pl.open.length, v.open.last], [eur(F.avg), eur(v.averageValue.last)], [v.winRate.now + '%', v.winRate.last + '%'], [v.cycleMonths.now + ' months', String(v.cycleMonths.last)]];
    const key = o => (sort === 'upd' ? o.updated : sort === 'new' ? o.created : String(o.value == null ? -1 : o.value).padStart(12, '0'));
    openRows = pl.open.slice().sort((a, b) => (b.pin ? 1 : 0) - (a.pin ? 1 : 0) || (key(a) < key(b) ? 1 : key(a) > key(b) ? -1 : 0)).map(o => [
      txt(o.name, { strong: true, sub: o.detail, tag: o.pin ? 'COACHING' : '' }), txt(tc.name), o.value == null ? chip('unknown', 'unk') : txt(eur(o.value)), txt(day(o.created)),
      o.flag ? txt(day(o.updated), chip(o.flag, 'act')) : txt(day(o.updated)), o.next ? txt(o.next) : chip('No next step', 'act'),
      !o.due ? NONE : o.due < AS_OF ? txt(day(o.due), chip('Overdue', 'over')) : txt(day(o.due))]);
    closedRows = (stat === 'won' ? pl.won : pl.lost).map(o => [txt(o.name, { strong: true }), txt(tc.name), o.value == null ? chip('unknown', 'unk') : txt(eur(o.value)), txt(day(o.created)), txt(day(o.closed)), txt(o.reason)]);
  } else {
    const shares = split === 'v' ? [[.35, .25, .25, .15], [.3, .3, .2, .2], [.4, .2, .25, .15], [.25, .35, .2, .2], [.3, .2, .3, .2]] : [[.5, .2, .3], [.45, .25, .3], [.55, .15, .3], [.4, .3, .3], [.5, .2, .3]];
    runway = QS.map((label, i) => ({ label, h: [62, 84, 56, 40, 34][i] + '%', last: i === 4, segs: shares[i].map((f, j) => ({ f, bg: (split === 'v' ? VC : PC)[j] })) }));
    legend = split === 'v' ? VC.map((bg, i) => [bg, 'Vertical ' + (i + 1)]) : ['Tile-only', 'Grid-only', 'Tile-and-grid'].map((l, i) => [PC[i], l]);
    const OPP = [{ id: 0, pin: 1, u: 2, c: 40, v: 7, n: 1, d: 0 }, { id: 1, pin: 1, u: 5, c: 65, v: 9, n: 1, d: 0 }, { id: 2, u: 34, c: 90, v: 5, n: 1, d: 2 }, { id: 3, u: 1, c: 3, v: null, n: 0, d: 0 }, { id: 4, u: 12, c: 20, v: 3, n: 1, d: 0 }, { id: 5, u: 27, c: 120, v: 8, n: 0, d: 0 }, { id: 6, u: 8, c: 30, v: 6, n: 1, d: 2 }];
    const key = o => (sort === 'upd' ? o.u : sort === 'new' ? o.c : -(o.v == null ? -1 : o.v));
    openRows = OPP.slice().sort((a, b) => (b.pin || 0) - (a.pin || 0) || key(a) - key(b)).map(o => [bar((50 + o.id * 6) + '%', o.pin ? 'COACHING' : ''), bar('62%'), o.v == null ? chip('unknown', 'unk') : bar(o.v * 10 + '%'), bar('54%'), o.u > 21 ? chip('Stalled', 'act') : bar('40%'), o.n ? bar((60 + o.id * 4) + '%') : chip('No next step', 'act'), o.d === 2 ? chip('Overdue', 'over') : o.n ? bar('52%') : NONE]);
    closedRows = [0, 1, 2, 3].map(i => [bar((52 + i * 8) + '%'), bar('60%'), i === 2 ? chip('unknown', 'unk') : bar((40 + i * 12) + '%'), bar('54%'), bar('50%'), bar((70 + i * 5) + '%')]);
  }
  const vel = [['Open opportunities', 'creating'], ['Average value', 'solution fit and scope'], ['Win rate', 'qualifying and closing'], ['Cycle length', 'access and momentum']];
  return (
    <div style={stack}>
      <El i={0} sel={sel} onSel={onSel} title={els[0].title}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 8 }}>
          {['Open opportunities', 'Known open Rockfon value', 'Opportunities with unknown value'].map((l, i) => (
            <div key={l} style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '10px 12px', background: '#F7F8F8', borderRadius: 3 }}><span style={{ fontSize: 11.5, fontWeight: 600, color: '#63666A' }}>{l}</span><Fig v={topVals[i]} w="46%" /></div>
          ))}
        </div>
      </El>
      <div style={grid2}>
        <El i={1} sel={sel} onSel={onSel} title={els[1].title} right={<Pills options={[['v', 'Vertical'], ['p', 'Product mix']]} value={split} onChange={setSplit} />}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 160, borderBottom: '1px solid #D8D9DA' }}>
              {runway.map(b => (
                <div key={b.label} style={{ flex: 1, minWidth: 0, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 5 }}>
                  {b.value ? <span style={{ alignSelf: 'center', fontSize: 11, fontWeight: 800, color: '#142850', whiteSpace: 'nowrap' }}>{b.value}</span> : <div style={{ height: 6, width: '56%', alignSelf: 'center', background: '#E4E5E6', borderRadius: 2 }} />}
                  <div style={{ display: 'flex', flexDirection: 'column-reverse', height: b.h, outline: b.last ? '1.5px dashed #B1B2B4' : 'none', outlineOffset: 2, opacity: b.last ? 0.6 : 1 }}>
                    {b.segs.map((g, j) => <div key={j} title={legend[j] && Math.round(g.f * 100) + '% ' + legend[j][1]} style={{ flex: g.f, background: g.bg, borderTop: '1px solid #fff' }} />)}
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
            {vel.map(([label, hint], i) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 7, padding: '10px 12px', background: '#F7F8F8', borderRadius: 3 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: '#142850' }}>{label}</span>
                <Fig v={velVals[i] && velVals[i][0]} w="50%" h={14} />
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#63666A' }}>vs last period {velVals[i] ? <strong style={{ color: '#142850' }}>{velVals[i][1]}</strong> : <span style={{ height: 7, width: 28, background: '#E4E5E6', borderRadius: 2 }} />}</span>
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
          ? <Table minWidth={pl ? 900 : 680} maxHeight={pl ? 420 : null} cols="minmax(0,1.9fr) minmax(0,.9fr) minmax(0,1fr) minmax(0,.8fr) minmax(0,.9fr) minmax(0,1.4fr) minmax(0,.8fr)" head={['Opportunity', 'Owner', 'Rockfon value', 'Created', 'Last update', 'Next action', 'Due']} rows={openRows} />
          : <Table minWidth={pl ? 800 : 640} cols="minmax(0,1.9fr) minmax(0,.9fr) minmax(0,1fr) minmax(0,.8fr) minmax(0,.8fr) minmax(0,1.8fr)" head={['Opportunity', 'Owner', 'Rockfon value', 'Created', 'Closed', 'Reason']} rows={closedRows} />}
        <span style={NOTE}>{pl && stat === 'open' ? `${pl.open.length} open opportunities. ` : ''}Pinned rows are the two opportunities chosen for coaching. Must-win opportunities open the deep-dive in the 1:1 cockpit.</span>
      </El>
    </div>
  );
}

function AccountsPage({ els, sel, onSel, tc }) {
  const [scope, setScope] = useMem('dashScope', 'a');
  const [seg, setSeg] = useState(null);
  const ac = tc && tc.accounts;
  const AC = ['#142850', '#00638E', '#45A6DE'];
  const effCols = 'minmax(74px,.7fr) minmax(0,2.2fr) minmax(0,.8fr) minmax(0,.8fr)';
  const due = [['Missing plans', '#00638E'], ['Unreviewed classifications', '#00638E'], ['Stakeholder gaps', '#00638E'], ['Overdue engagement', '#D20014']];
  let covRows, eff, effLegend, dueVals = [null, null, null, null], countLine = null;
  if (ac) {
    const rows = scope === 'all' ? ac.rows : ac.rows.filter(r => r.inScope);
    const total = Object.values(ac.counts).reduce((s, n) => s + n, 0);
    covRows = rows.map(r => [txt(r.name, { strong: true, sub: r.note ? r.type + ' · ' + r.note : r.type }), r.proposed ? txt(r.segment, chip('Proposed: ' + r.proposed, 'act')) : chip(r.segment, r.segment === 'Unclassified' ? 'unk' : 'type'),
      field(r.planReview), field(r.stakeholders), field(r.lastEngagement), field(r.nextRequired),
      r.business == null ? chip('unknown', 'unk') : txt(eur(r.business)), r.pipeline == null ? chip('unknown', 'unk') : txt(eur(r.pipeline), { sub: r.pipelineNote })]);
    if (scope === 'all' && total > rows.length) {
      const more = Object.entries(ac.counts).map(([s, n]) => [s, n - ac.rows.filter(r => r.segment === s).length]).filter(([, n]) => n > 0);
      covRows = covRows.concat([[txt(`…and ${total - rows.length} more accounts`, { sub: more.map(([s, n]) => `${n} ${s}`).join(' · ') }), NONE, NONE, NONE, NONE, NONE, NONE, NONE]]);
    }
    countLine = `${total} accounts · ` + Object.entries(ac.counts).map(([s, n]) => `${n} ${s}`).join(' · ');
    const hours = ac.effort.segments.map(s => s.hours.reduce((a, b) => a + b, 0)), maxH = Math.max(...hours), sumH = hours.reduce((a, b) => a + b, 0);
    eff = ac.effort.segments.map((s, i) => ({ seg: s.segment, widths: s.hours.map(h => (h / maxH) * 78), label: `${hours[i]} h · ${Math.round((hours[i] / sumH) * 100)}%`, business: s.business == null ? chip('n/a', 'unk') : txt(eur(s.business)), pipeline: s.pipeline == null ? chip('n/a', 'unk') : txt(eur(s.pipeline)), top: s.top }));
    effLegend = ac.effort.types.map((t, i) => [AC[i], t]);
    dueVals = [
      { n: ac.rows.filter(r => r.planReview.flag === 'missing').length, who: ac.rows.filter(r => r.planReview.flag === 'missing').map(r => r.name) },
      { n: ac.counts.Unclassified, who: [] },
      { n: ac.rows.filter(r => r.stakeholders.flag === 'gap').length, who: ac.rows.filter(r => r.stakeholders.flag === 'gap').map(r => r.name) },
      { n: ac.rows.filter(r => r.nextRequired.flag === 'overdue').length, who: ac.rows.filter(r => r.nextRequired.flag === 'overdue').map(r => r.name) }];
  } else {
    const COV = [['A', 'b', 'b', 'b', 'due', 6, 4], ['A', 'over', 'gap', 'b', 'over', 8, 7], ['A', 'b', 'b', 'unk', 'b', 5, 0.5], ['A', 'miss', 'unk', 'b', 'due', 3, 6], ['B', 'b', 'gap', 'b', 'b', 4, null]]
      .concat(scope === 'all' ? [['B', 'b', 'b', 'b', 'b', 3, 2], ['C', 'b', 'unk', 'unk', 'b', 1, null], ['C', 'miss', 'b', 'b', 'b', 2, 1], ['Unclassified', 'miss', 'unk', 'unk', 'unk', null, null]] : []);
    const cc = (v, w) => (v === 'b' ? bar(w) : v === 'due' ? chip('Due', 'act') : v === 'over' ? chip('Overdue', 'over') : v === 'unk' ? chip('unknown', 'unk') : v === 'gap' ? chip('Gap', 'act') : chip('Missing', 'act'));
    const nb = v => (v == null ? chip('unknown', 'unk') : bar(Math.max(8, v * 10) + '%'));
    covRows = COV.map((r, i) => [bar((55 + (i % 4) * 8) + '%'), r[0] === 'Unclassified' ? chip('Unclassified', 'unk') : chip(r[0], 'type'), cc(r[1], '50%'), cc(r[2], '46%'), cc(r[3], '52%'), cc(r[4], '48%'), nb(r[5]), nb(r[6])]);
    eff = [['A', [30, 18, 10], 8, 7], ['B', [22, 14, 8], 6, 5], ['C', [10, 8, 6], 3, 2], ['Unclassified', [8, 4, 3], 1, 1], ['Unlinked', [6, 3, 2], 'x', 'x']]
      .map(r => ({ seg: r[0], widths: r[1], business: r[2] === 'x' ? chip('n/a', 'unk') : bar(r[2] * 11 + '%'), pipeline: r[3] === 'x' ? chip('n/a', 'unk') : bar(r[3] * 11 + '%') }));
    effLegend = AC.map((bg, i) => [bg, 'Activity type ' + (i + 1)]);
  }
  return (
    <div style={stack}>
      <El i={0} sel={sel} onSel={onSel} title={els[0].title} right={<Pills options={[['a', 'A and in-scope'], ['all', 'Complete portfolio']]} value={scope} onChange={setScope} />}>
        {countLine && <span style={{ fontSize: 12, fontWeight: 700, color: '#142850' }}>{countLine}</span>}
        <Table minWidth={ac ? 1000 : 720} maxHeight={ac ? 460 : null} cols="minmax(0,1.5fr) minmax(0,.9fr) repeat(4,minmax(0,1fr)) minmax(0,.9fr) minmax(0,.9fr)" head={['Account', 'Segment', 'Plan review', 'Stakeholders', 'Last engagement', 'Next required', 'Business', 'Open pipeline']} rows={covRows} />
        <span style={NOTE}>Business and open pipeline are labelled separately. An opportunity linked to several accounts counts once in any total.</span>
      </El>
      <div style={grid2}>
        <El i={1} sel={sel} onSel={onSel} title={els[1].title}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'grid', gridTemplateColumns: effCols, gap: 10, fontSize: 11, fontWeight: 800, color: '#142850', paddingBottom: 6 }}><span>Segment</span><span>Activity hours</span><span>Business</span><span>Pipeline</span></div>
            {eff.map(r => (
              <div key={r.seg} style={{ borderTop: '1px solid #EEEFF0' }}>
                <div onClick={r.top ? () => setSeg(seg === r.seg ? null : r.seg) : undefined} style={{ display: 'grid', gridTemplateColumns: effCols, gap: 10, alignItems: 'center', padding: '7px 0' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: r.seg.startsWith('Un') ? '#63666A' : '#142850' }}>{r.seg}{r.top && <span style={{ color: '#00638E' }}> {seg === r.seg ? '▾' : '▸'}</span>}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                    <div style={{ display: 'flex', height: 12, flex: r.label ? '1 1 auto' : 'none', width: r.label ? undefined : '100%' }}>{r.widths.map((w, j) => <div key={j} style={{ width: w + '%', background: AC[j], borderRight: '1px solid #fff' }} />)}</div>
                    {r.label && <span style={{ flex: 'none', fontSize: 11, fontWeight: 700, color: '#142850', whiteSpace: 'nowrap' }}>{r.label}</span>}
                  </div>
                  {[r.business, r.pipeline].map((v, j) => <div key={j} style={{ minWidth: 0 }}><Cell c={v} /></div>)}
                </div>
                {r.top && seg === r.seg && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '4px 0 10px 12px' }}>
                    {r.top.map(t => <span key={t.account} style={{ fontSize: 11.5, color: '#1A1A1A' }}><strong style={{ color: '#142850' }}>{t.account}</strong> · {t.hours} h · {t.detail}</span>)}
                  </div>
                )}
              </div>
            ))}
          </div>
          <Legend items={effLegend} />
          <span style={NOTE}>Click a segment to see its accounts.</span>
        </El>
        <El i={2} sel={sel} onSel={onSel} title={els[2].title}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {due.map(([label, dot], i) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 3, padding: '10px 0', borderTop: '1px solid #EEEFF0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ flex: 'none', width: 8, height: 8, borderRadius: '50%', background: dot }} /><span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: '#142850' }}>{label}</span>
                  {dueVals[i] ? <span style={{ flex: 'none', fontSize: 15, fontWeight: 800, color: '#142850' }}>{dueVals[i].n}</span> : <span style={{ flex: 'none', height: 8, width: 28, background: '#D8D9DA', borderRadius: 2 }} />}
                </div>
                {dueVals[i] && dueVals[i].who.length > 0 && <span style={{ paddingLeft: 18, fontSize: 11.5, color: '#63666A' }}>{dueVals[i].who.join(' · ')}</span>}
              </div>
            ))}
          </div>
        </El>
      </div>
    </div>
  );
}

function VisitsPage({ els, sel, onSel, tc }) {
  const [mw, setMw] = useMem('dashWeek', 'both');
  const vs = tc && tc.visits;
  const DAY = ['Mo', 'Tu', 'We', 'Th', 'Fr'];
  let weeks, calendar, cdRows, caRows, pins, office = null, caSummary = null;
  if (vs) {
    const all = vs.weeks.held.concat(vs.weeks.booked), max = Math.max(...all, 1);
    weeks = all.map((v, i) => ({ v, h: Math.max(2, (v / max) * 88) + '%', held: i < 4, gap: i === 4 ? 14 : 0, label: i < 4 ? '−' + (4 - i) : '+' + (i - 3) }));
    calendar = vs.calendar;
    cdRows = vs.coverage.map(r => [chip(r.what, 'type'), txt(r.name, { strong: true, sub: r.note }), txt(r.last), field(r.due)]);
    caRows = vs.completed.map(a => [txt(a.purpose, { tag: a.customerInitiated ? 'CUSTOMER' : '' }), txt(a.contact), txt(a.outcome), txt(a.minutes + ' min'), a.next ? txt(a.next) : chip('No next step', 'act')]);
    const n = vs.completed.length, cust = vs.completed.filter(a => a.customerInitiated).length, nn = vs.completed.filter(a => !a.next).length;
    caSummary = `${n} activities · ${cust} customer-initiated (${Math.round((cust / n) * 100)}%) · ${nn} with no next action`;
    pins = vs.map.pins.map(p => [p.x, p.y, p.day, p.week === 2, p.label]);
    office = vs.map.office;
  } else {
    weeks = [6, 8, 5, 7, 7, 4, 3, 1].map((v, i) => ({ h: v * 11 + '%', held: i < 4, gap: i === 4 ? 14 : 0, label: i < 4 ? '−' + (4 - i) : '+' + (i - 3) }));
    const cc = v => (v === 'b' ? bar('50%') : v === 'due' ? chip('Due', 'act') : v === 'over' ? chip('Overdue', 'over') : chip('unknown', 'unk'));
    cdRows = [['Priority account', 'b', 'due'], ['Large opportunity', 'b', 'over'], ['Target group', 'unk', 'due'], ['Stakeholder role', 'b', 'due']].map(r => [chip(r[0], 'type'), bar('64%'), cc(r[1]), cc(r[2])]);
    caRows = [0, 1, 2, 3].map(i => [bar((58 + i * 8) + '%'), bar('60%'), bar((50 + i * 10) + '%'), bar('40%'), i === 2 ? chip('No next step', 'act') : bar('62%')]);
    pins = [[18, 30, 1, 0], [24, 38, 1, 0], [30, 34, 2, 0], [62, 22, 3, 0], [68, 30, 3, 0], [44, 66, 4, 0], [80, 72, 5, 0], [22, 44, 6, 1], [28, 28, 6, 1], [52, 58, 7, 1], [58, 64, 7, 1], [84, 40, 9, 1], [74, 78, 10, 1]].map(([x, y, n, nx]) => [x, y, DAY[(n - 1) % 5], !!nx]);
  }
  const CAL = [[[16, 10], [22], [12, 12, 8], [18], []], [[14], [20, 8], [], [10, 10], [16]]];
  const shown = pins.filter(p => mw === 'both' || (mw === 'this' ? !p[3] : p[3]));
  return (
    <div style={stack}>
      <div style={grid2}>
        <El i={0} sel={sel} onSel={onSel} title={els[0].title}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120, borderBottom: '1px solid #D8D9DA' }}>
              {weeks.map((w, i) => (
                <div key={i} style={{ flex: 1, minWidth: 0, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 3, marginLeft: w.gap }}>
                  {w.v != null && <span style={{ alignSelf: 'center', fontSize: 11, fontWeight: 800, color: '#142850' }}>{w.v}</span>}
                  <div style={{ height: w.h, background: w.held ? '#142850' : '#fff', border: w.held ? 'none' : '1.5px dashed #00638E' }} />
                </div>
              ))}
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
            {(calendar || CAL).map((wk, wi) => (
              <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: '#63666A' }}>{wi ? 'Next week' : 'This week'}</span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,minmax(0,1fr))', gap: 4 }}>
                  {wk.map((b, i) => (
                    <div key={i} style={{ minHeight: 58, background: '#F7F8F8', borderRadius: 2, padding: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <span style={{ fontSize: 9.5, fontWeight: 700, color: '#63666A' }}>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][i]}</span>
                      {calendar
                        ? b.map((e, j) => (
                          <div key={j} style={{ padding: '3px 4px', borderRadius: 2, background: '#fff', borderLeft: `3px solid ${e.customer ? '#00638E' : '#B1B2B4'}`, fontSize: 9.5, lineHeight: 1.3, color: '#1A1A1A' }}>
                            <strong style={{ color: '#142850' }}>{e.time}</strong> {e.text}<span style={{ display: 'block', color: '#63666A' }}>{e.where}</span>
                          </div>
                        ))
                        : b.map((h, j) => <div key={j} style={{ height: h, background: j % 2 ? '#D8D9DA' : '#00638E', borderRadius: 1 }} />)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {calendar && <Legend items={[['#00638E', 'Customer'], ['#B1B2B4', 'Internal']]} />}
          <span style={NOTE}>The actual calendar, with location or area for route discussions.</span>
        </El>
      </div>
      <El i={2} sel={sel} onSel={onSel} title={els[2].title}>
        <Table minWidth={vs ? 560 : 380} cols="minmax(0,1.2fr) minmax(0,1.2fr) minmax(0,1fr) minmax(0,.8fr)" head={['What', 'Name', 'Last engagement', 'Due']} rows={cdRows} />
      </El>
      <El i={3} sel={sel} onSel={onSel} title={els[3].title}>
        {caSummary && <span style={{ fontSize: 12, fontWeight: 700, color: '#142850' }}>{caSummary}</span>}
        <Table minWidth={vs ? 720 : 420} maxHeight={vs ? 360 : null} cols="minmax(0,1.1fr) minmax(0,1fr) minmax(0,1.1fr) minmax(0,.7fr) minmax(0,1.1fr)" head={['Purpose', 'Contact', 'Outcome', 'Duration', 'Next action']} rows={caRows} />
        <span style={NOTE}>A click opens the record.</span>
      </El>
      <El i={4} sel={sel} onSel={onSel} title={els[4].title} right={<Pills options={[['both', 'Both weeks'], ['this', 'This week'], ['next', 'Next week']]} value={mw} onChange={setMw} />}>
        <div aria-hidden="true" style={{ position: 'relative', height: 280, borderRadius: 3, overflow: 'hidden', backgroundColor: '#EEF1F3', backgroundImage: 'linear-gradient(#E2E6E9 1px,transparent 1px),linear-gradient(90deg,#E2E6E9 1px,transparent 1px)', backgroundSize: '56px 56px' }}>
          <span style={{ position: 'absolute', left: 12, top: 10, fontSize: 11, fontWeight: 700, color: '#63666A' }}>Map of the sales area</span>
          {office && (
            <>
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 100 100" preserveAspectRatio="none">
                {shown.map(([x, y], i) => <line key={i} x1={office.x} y1={office.y} x2={x} y2={y} stroke="#8A8D91" strokeWidth="1.5" strokeDasharray="4 3" vectorEffect="non-scaling-stroke" />)}
              </svg>
              <div style={{ position: 'absolute', left: office.x + '%', top: office.y + '%', margin: '-11px 0 0 -11px', width: 22, height: 22, borderRadius: 3, background: GOLD, color: '#142850', fontSize: 8.5, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>HQ</div>
            </>
          )}
          {shown.map(([x, y, d, nx, label], i) => (
            <div key={i} title={label} style={{ position: 'absolute', left: x + '%', top: y + '%', width: 24, height: 24, margin: '-12px 0 0 -12px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, background: nx ? '#fff' : '#142850', color: nx ? '#00638E' : '#fff', border: nx ? '1.5px solid #00638E' : 'none', boxShadow: '0 1px 3px rgba(20,40,80,.25)' }}>{d}</div>
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px', fontSize: 11.5, color: '#1A1A1A' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: '#142850' }} />This week</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: '50%', border: '1.5px solid #00638E', background: '#fff' }} />Next week</span>
          {office && <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: GOLD }} />{office.label}</span>}
          <span style={{ color: '#63666A' }}>Labels show the day. Each pin opens the booking.</span>
        </div>
        {vs && vs.map.note && <span style={{ fontSize: 12, fontWeight: 700, color: '#142850' }}>{vs.map.note}</span>}
        <span style={NOTE}>Clusters and long hops show whether the routes make sense. Needs a location on each booking.</span>
      </El>
    </div>
  );
}

const PAGES = [PipelinePage, AccountsPage, VisitsPage];

// Wireframe or one of the training cases. Picking a case opens its page.
function CasePicker({ current, onPick }) {
  return (
    <div role="group" aria-label="Data shown" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6 }}>
      <span style={{ ...LBL, marginRight: 4 }}>Show</span>
      <button type="button" aria-pressed={!current} onClick={() => onPick(null)} className="tr"
        style={{ padding: '5px 11px', borderRadius: 999, fontSize: 12, fontWeight: 700, border: '1px dashed #8A8D91', background: !current ? '#63666A' : '#fff', color: !current ? '#fff' : '#63666A' }}>Wireframe</button>
      {CASES.map(c => {
        const on = current === c.id;
        return <button key={c.id} type="button" aria-pressed={on} onClick={() => onPick(c)} className="tr"
          style={{ padding: '5px 11px', borderRadius: 999, fontSize: 12, fontWeight: 700, border: `1px solid ${GOLD}`, background: on ? GOLD : '#fff', color: '#142850' }}>Training case: {c.name}</button>;
      })}
    </div>
  );
}

export default function Dashboard({ narrow }) {
  const [params, setParams] = useSearchParams();
  const [tab, setTab] = useMem('dashTab', 0);
  const [selMap, setSelMap] = useMem('dashSel', {});
  // Loaded training case per page: {pageIndex: caseId}.
  const [caseMap, setCaseMap] = useMem('dashCase', {});
  // Deep links: ?page=P&el=E from a cockpit point, ?case=daniel for a roleplay.
  useEffect(() => {
    const p = params.get('page'), e = params.get('el'), cs = CASES.find(c => c.id === params.get('case'));
    if (p == null && !cs) return;
    if (cs) {
      const P = pageOf(cs);
      setTab(P);
      setCaseMap(m => ({ ...m, [P]: cs.id }));
    } else {
      const P = Math.max(0, Math.min(DASHBOARD.length - 1, +p || 0));
      setTab(P);
      if (e != null) setSelMap(s => ({ ...s, [P]: +e || 0 }));
    }
    setParams({}, { replace: true });
  }, [params, setParams, setTab, setSelMap, setCaseMap]);
  const P = Math.min(tab, DASHBOARD.length - 1), pg = DASHBOARD[P];
  if (!pg) return null;
  const tc = CASES.find(c => c.id === caseMap[P] && pageOf(c) === P) || null;
  const pick = c => {
    if (!c) { setCaseMap(m => { const o = { ...m }; delete o[P]; return o; }); return; }
    const CP = pageOf(c);
    setCaseMap(m => ({ ...m, [CP]: c.id }));
    setTab(CP);
  };
  const sel = Math.min(selMap[P] ?? (P === 0 ? 1 : 0), pg.elements.length - 1), el = pg.elements[sel];
  const onSel = i => setSelMap(s => ({ ...s, [P]: i }));
  const Page = PAGES[P];
  const filters = tc ? [['Owner or team', tc.name], ['Market', 'Training'], ['Period', tc.period], ['Currency', TRAINING.currency], ['Refreshed', 'Training data']] : ['Owner or team', 'Market', 'Period', 'Currency', 'Refreshed'].map(x => [x, null]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <div role="tablist" aria-label="Dashboard pages" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {DASHBOARD.map((d, i) => <PillToggle key={d.page} on={P === i} onClick={() => setTab(i)}>{d.page}</PillToggle>)}
        </div>
        {tc
          ? <span style={{ padding: '4px 10px', border: `1px solid ${GOLD}`, background: GOLD, borderRadius: 3, fontSize: 11.5, fontWeight: 800, color: '#142850' }}>Training data · fictional</span>
          : <span style={{ padding: '4px 10px', border: '1px dashed #B1B2B4', borderRadius: 3, fontSize: 11.5, fontWeight: 700, color: '#63666A' }}>Wireframe until the report is ready</span>}
      </div>
      <CasePicker current={tc && tc.id} onPick={pick} />
      <div style={{ display: 'grid', gridTemplateColumns: narrow ? 'minmax(0,1fr)' : 'minmax(0,1fr) 280px', gap: narrow ? 24 : 36, alignItems: 'start' }}>
        {/* The wireframe, framed as a screen so it reads as "the dashboard", not as page content. */}
        <figure aria-label={(tc ? 'Training case ' + tc.name + ' on the ' : 'Wireframe of the ') + pg.page + ' dashboard page'} style={{ margin: 0, border: `1px solid ${tc ? GOLD : '#B1B2B4'}`, borderRadius: 6, overflow: 'hidden', boxShadow: '0 6px 20px rgba(20,40,80,.10)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 34, padding: '0 14px', background: '#142850', color: '#fff' }}>
            <span aria-hidden="true" style={{ display: 'flex', gap: 5 }}>{[0, 1, 2].map(i => <span key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,.35)' }} />)}</span>
            <span style={{ fontSize: 12, fontWeight: 700, opacity: 0.85 }}>Report · {pg.page}</span>
            {tc && <span style={{ marginLeft: 'auto', padding: '3px 10px', borderRadius: 3, background: GOLD, color: '#142850', fontSize: 11, fontWeight: 800, letterSpacing: '.08em' }}>TRAINING DATA · {tc.name.toUpperCase()}</span>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 18, background: '#F2F3F4' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={LBL}>{pg.page}</span>
                <span style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.2, color: '#142850' }}>{pg.question}</span>
                {tc && <span style={{ fontSize: 12, color: '#63666A' }}>{tc.name}: {tc.profile}</span>}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {filters.map(([x, v]) => (
                  <div key={x} style={{ display: 'flex', flexDirection: 'column', gap: 5, padding: '6px 10px', background: '#fff', border: '1px solid #D8D9DA', borderRadius: 3, minWidth: 74 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#63666A' }}>{x}</span>{v ? <span style={{ fontSize: 11.5, fontWeight: 700, color: '#142850' }}>{v}</span> : <span style={{ height: 7, width: '70%', background: '#E4E5E6', borderRadius: 2 }} />}
                  </div>
                ))}
              </div>
            </div>
            <Page key={tc ? tc.id : 'wire'} els={pg.elements} sel={sel} onSel={onSel} tc={tc} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', fontSize: 11.5, color: '#1A1A1A' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: '50%', border: '1.5px solid #00638E' }} />Needs a decision</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: '#D20014' }} />Overdue</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: '#D8D9DA' }} />Unknown data</span>
              <span style={{ color: '#63666A' }}>{tc ? 'All names, companies and figures are fictional.' : 'Every bar, segment and row opens the records behind it.'}</span>
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
