// Renders playbook.json blocks ({t: 'p'|'ul'|'ol'|'table'|'quote'|'statement'|'swap'|'pair'|
// 'runway'|'formula'|'levers'}) exactly as written. Layout only: the wording comes from the content file.
import { useState } from 'react';
import { strip, TOOLS } from './content.js';
import { ToolLinkCard } from './ui.jsx';

export const ST = {
  lede: { fontSize: 20, lineHeight: 1.55, fontWeight: 500, color: '#142850', margin: 0, textWrap: 'pretty' },
  quote: { margin: 0, padding: '6px 0 6px 22px', borderLeft: '3px solid #00638E', fontSize: 18, lineHeight: 1.55, fontWeight: 600, color: '#142850' },
  p: { fontSize: 17, lineHeight: 1.65, color: '#1A1A1A', margin: 0, textWrap: 'pretty' },
  ul: { margin: 0, paddingLeft: 22, display: 'flex', flexDirection: 'column', gap: 10 },
  li: { fontSize: 17, lineHeight: 1.6, color: '#1A1A1A', paddingLeft: 4 },
  olRow: { display: 'grid', gridTemplateColumns: '36px minmax(0,1fr)', gap: 8, padding: '14px 0', borderBottom: '1px solid #EEEFF0' },
  olNum: { fontSize: 20, fontWeight: 800, color: '#00638E', lineHeight: 1.3 },
  h3: { fontSize: 22, lineHeight: 1.25, fontWeight: 800, color: '#142850', margin: 0, textWrap: 'pretty' },
  eyebrow: { fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#00638E' },
  stack: { display: 'flex', flexDirection: 'column', gap: 18 },
  th: { textAlign: 'left', padding: '12px 14px', background: '#F2F3F4', fontSize: 12.5, lineHeight: 1.35, fontWeight: 800, color: '#142850', verticalAlign: 'bottom' },
  td: { padding: '13px 14px', fontSize: 14.5, lineHeight: 1.5, color: '#1A1A1A', borderTop: '1px solid #EEEFF0', verticalAlign: 'top' },
  card: { display: 'flex', flexDirection: 'column', gap: 14, padding: '20px 22px', border: '1px solid #D8D9DA', borderRadius: 4, background: '#fff' },
  fieldLabel: { fontSize: 10.5, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#63666A' },
  fieldVal: { fontSize: 15, lineHeight: 1.5, color: '#1A1A1A', margin: 0 },
  scenario: { display: 'flex', flexDirection: 'column', gap: 8, padding: '20px 22px', background: '#F2F3F4', borderRadius: 4 },
  tocItem: { display: 'block', width: '100%', textAlign: 'left', padding: '12px 0', borderBottom: '1px solid #EEEFF0', fontSize: 15, fontWeight: 700, lineHeight: 1.35, color: '#00638E' },
};
const LBL = ST.fieldLabel;

export const Rich = ({ as: Tag = 'span', style, html }) => <Tag style={style} dangerouslySetInnerHTML={{ __html: html }} />;

export function jumpTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
}

function TableBlock({ b }) {
  if (b.head.length >= 4) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 12 }}>
        {b.rows.map((r, j) => (
          <div key={j} style={ST.card}>
            <Rich style={{ fontSize: 16, fontWeight: 800, lineHeight: 1.3, color: '#00638E' }} html={r[0]} />
            {r.slice(1).map((c, ci) => (
              <div key={ci} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Rich style={ST.fieldLabel} html={b.head[ci + 1]} />
                <Rich as="p" style={ST.fieldVal} html={c} />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
  return (
    <div style={{ overflowX: 'auto', border: '1px solid #D8D9DA', borderRadius: 4 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr>{b.head.map((h, j) => <Rich as="th" key={j} style={ST.th} html={h} />)}</tr></thead>
        <tbody>{b.rows.map((r, j) => <tr key={j}>{r.map((h, c) => <Rich as="td" key={c} style={c === 0 ? { ...ST.td, fontWeight: 700, color: '#142850' } : ST.td} html={h} />)}</tr>)}</tbody>
      </table>
    </div>
  );
}

function AgendaBlock({ b }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {b.rows.map((r, j) => (
        <div key={j} style={{ display: 'grid', gridTemplateColumns: '84px minmax(0,1fr)', gap: 16, padding: '14px 16px', border: '1px solid #D8D9DA', borderRadius: 4, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '8px 4px', borderRadius: 3, background: '#F2F3F4' }}>
            <Rich style={{ fontSize: 13, fontWeight: 800, color: '#00638E', whiteSpace: 'nowrap' }} html={r[0]} />
            <span style={{ ...LBL, fontSize: 9.5 }}>{strip(b.head[0])}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Rich style={{ fontSize: 15, fontWeight: 800, lineHeight: 1.35, color: '#142850' }} html={r[1]} />
            <Rich style={{ fontSize: 14.5, lineHeight: 1.55, color: '#1A1A1A' }} html={r[2]} />
          </div>
        </div>
      ))}
    </div>
  );
}

// Series colours for the runway chart, in fixed order (checked for colour-blind separation).
const SERIES = ['#142850', '#00638E', '#45A6DE', '#D6B874'];

// Stacked bars of expected value per delivery quarter, with buttons to switch the breakdown.
// bars: [{label, h (0–100), open}], views: [{button, title, legend, segs: per bar, bottom to top}].
function RunwayBlock({ b }) {
  const [v, setV] = useState(0);
  const view = b.views[Math.min(v, b.views.length - 1)];
  return (
    <figure style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 18, padding: '22px 24px', border: '1px solid #D8D9DA', borderRadius: 4, background: '#fff' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '12px 20px' }}>
        <div style={{ flex: '1 1 260px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {b.eyebrow && <span style={ST.eyebrow}>{b.eyebrow}</span>}
          <span style={{ fontSize: 17, lineHeight: 1.35, fontWeight: 800, color: '#142850', textWrap: 'pretty' }}>{view.title}</span>
        </div>
        {b.views.length > 1 && (
          <div style={{ display: 'flex', gap: 4, padding: 4, background: '#F2F3F4', borderRadius: 4 }}>
            {b.views.map((w, i) => (
              <button key={i} type="button" aria-pressed={i === v} onClick={() => setV(i)} className={i === v ? '' : 'hv-grey'}
                style={{ padding: '7px 12px', borderRadius: 3, fontSize: 12.5, fontWeight: 700, background: i === v ? '#fff' : 'transparent', color: i === v ? '#142850' : '#63666A', boxShadow: i === v ? '0 1px 3px rgba(20,40,80,.15)' : 'none' }}>{w.button}</button>
            ))}
          </div>
        )}
      </div>
      <div role="img" aria-label={view.title + '. ' + b.bars.map((bar, i) => bar.label + ': ' + view.legend.map((l, k) => l + ' ' + view.segs[i][k] + '%').join(', ')).join('; ')}
        style={{ display: 'grid', gridTemplateColumns: `repeat(${b.bars.length},minmax(0,1fr))`, gap: 12, alignItems: 'end', height: 220, borderBottom: '1px solid #B1B2B4' }}>
        {b.bars.map((bar, i) => {
          const segs = view.segs[i] || [], sum = segs.reduce((a, x) => a + x, 0) || 1;
          return (
            <div key={i} style={{ height: bar.h + '%', width: '100%', maxWidth: 76, justifySelf: 'center', display: 'flex', flexDirection: 'column-reverse', gap: 2, padding: bar.open ? 2 : 0, border: bar.open ? '1.5px dashed #8A8D91' : 'none', borderBottom: 'none', borderRadius: '6px 6px 0 0' }}>
              {segs.map((x, k) => (
                <div key={k} title={`${bar.label} · ${view.legend[k]}: ${x}%`}
                  style={{ flex: `${x / sum} 1 0`, minHeight: 0, background: SERIES[k % SERIES.length], opacity: bar.open ? 0.45 : 1, borderRadius: k === segs.length - 1 ? '4px 4px 0 0' : 0 }} />
              ))}
            </div>
          );
        })}
      </div>
      <div aria-hidden="true" style={{ display: 'grid', gridTemplateColumns: `repeat(${b.bars.length},minmax(0,1fr))`, gap: 12, marginTop: -10 }}>
        {b.bars.map((bar, i) => <span key={i} style={{ textAlign: 'center', fontSize: 12.5, fontWeight: 700, color: bar.open ? '#63666A' : '#142850' }}>{bar.label}</span>)}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 18px' }}>
        {view.legend.map((l, k) => (
          <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#1A1A1A' }}>
            <span aria-hidden="true" style={{ width: 12, height: 12, borderRadius: 2, background: SERIES[k % SERIES.length] }} />{l}
          </span>
        ))}
      </div>
      {b.caption && <figcaption style={{ fontSize: 12.5, lineHeight: 1.5, color: '#63666A' }}>{b.caption}</figcaption>}
    </figure>
  );
}

const OPS = ['=', '×', '+', '−', '-', '÷'];

export function Block({ b, lede, dark }) {
  if (b.t === 'p') {
    if (lede) return <Rich as="p" style={ST.lede} html={b.h} />;
    const il = /^(Illustrative[^:<]{0,60}):\s*([\s\S]*)$/.exec(b.h);
    if (il && !dark) return il[2]
      ? <div style={ST.scenario}><span style={{ ...ST.eyebrow, color: '#63666A' }}>{il[1]}</span><Rich as="p" style={ST.p} html={il[2]} /></div>
      : <span style={{ ...ST.eyebrow, color: '#63666A' }}>{il[1]}</span>;
    if (/^\[Placeholder/.test(strip(b.h))) return <div style={{ border: '1px dashed #B1B2B4', borderRadius: 4, padding: '18px 20px', background: '#F7F8F8', fontSize: 14, lineHeight: 1.55, color: '#63666A' }}>{strip(b.h)}</div>;
    const gr = /^(Good|Red flags):\s*([\s\S]*)$/.exec(b.h);
    if (gr && !dark) return (
      <div style={gr[1] === 'Good' ? { display: 'flex', flexDirection: 'column', gap: 8, padding: '20px 22px', background: '#F2F3F4', borderRadius: 4 } : { display: 'flex', flexDirection: 'column', gap: 8, padding: '20px 22px', border: '1px solid #FF7768', borderRadius: 4 }}>
        <span style={{ ...ST.eyebrow, color: gr[1] === 'Good' ? '#0E7C66' : '#D20014' }}>{gr[1]}</span>
        <Rich as="p" style={ST.p} html={gr[2]} />
      </div>
    );
    const ph = /^(Before|During|After):\s*([\s\S]*)$/.exec(b.h);
    if (ph && !dark) return ph[2]
      ? <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><span style={ST.eyebrow}>{ph[1]}</span><Rich as="p" style={ST.p} html={ph[2]} /></div>
      : <span style={{ ...ST.eyebrow, marginTop: 6 }}>{ph[1]}</span>;
    const wwh = /^Why: ([\s\S]+?) What: ([\s\S]+?) How: ([\s\S]+)$/.exec(b.h);
    if (wwh && !dark) return (
      <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid #D8D9DA', borderRadius: 4 }}>
        {['Why', 'What', 'How'].map((l, j) => (
          <div key={j} style={{ display: 'grid', gridTemplateColumns: '64px minmax(0,1fr)', gap: 12, padding: '14px 18px', borderTop: j ? '1px solid #EEEFF0' : 'none' }}>
            <span style={{ ...ST.eyebrow, paddingTop: 4 }}>{l}</span>
            <Rich as="p" style={{ ...ST.p, fontSize: 16 }} html={wwh[j + 1]} />
          </div>
        ))}
      </div>
    );
    const m = /^([A-ZÆØÅ][a-zæøåé]+) - (.+?\.)\s(.+)$/.exec(b.h);
    if (m && !dark) return <div style={ST.scenario}><Rich style={{ fontSize: 16, fontWeight: 800, lineHeight: 1.35, color: '#142850' }} html={m[1] + ' - ' + m[2]} /><Rich as="p" style={ST.p} html={m[3]} /></div>;
    return <Rich as="p" style={dark ? { ...ST.p, color: '#fff' } : ST.p} html={b.h} />;
  }
  if (b.t === 'quote') return <Rich as="blockquote" style={ST.quote} html={b.h} />;
  if (b.t === 'statement') return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '30px 0', borderTop: '3px solid #142850', borderBottom: '1px solid #D8D9DA' }}>
      {b.items.map((h, j) => <Rich key={j} style={{ fontSize: 34, lineHeight: 1.15, fontWeight: 800, letterSpacing: '-.01em', color: j ? '#00638E' : '#142850', textWrap: 'balance' }} html={h} />)}
    </div>
  );
  if (b.t === 'swap') return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {b.items.map((it, j) => (
        <div key={j} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', border: '1px solid #D8D9DA', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ padding: '20px 22px', background: '#F2F3F4', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ ...ST.eyebrow, color: '#63666A' }}>Instead of</span>
            <Rich style={{ fontSize: 16, lineHeight: 1.5, color: '#63666A', textWrap: 'pretty' }} html={it.instead} />
          </div>
          <div style={{ padding: '20px 22px', background: '#fff', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={ST.eyebrow}>Coach it</span>
            <Rich style={{ fontSize: 17.5, lineHeight: 1.5, fontWeight: 700, color: '#142850', textWrap: 'pretty' }} html={it.coach} />
          </div>
        </div>
      ))}
    </div>
  );
  if (b.t === 'pair') return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
      {b.items.map((it, j) => (
        <div key={j} style={{ padding: '22px 24px', border: '1px solid #D8D9DA', borderTop: '3px solid ' + (j ? '#00638E' : '#142850'), borderRadius: 4, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ ...ST.eyebrow, color: j ? '#00638E' : '#142850' }}>{it.k}</span>
          <span style={{ fontSize: 20, lineHeight: 1.25, fontWeight: 800, color: '#142850' }}>{it.title}</span>
          <Rich style={{ fontSize: 16, lineHeight: 1.6, color: '#1A1A1A', textWrap: 'pretty' }} html={it.h} />
        </div>
      ))}
    </div>
  );
  if (b.t === 'runway') return <RunwayBlock b={b} />;
  // One line of terms and operators, e.g. Forecast = sqm × average price × win probability.
  if (b.t === 'formula') return (
    <div role="math" aria-label={b.items.join(' ')} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px 12px', padding: '22px 24px', background: '#F2F3F4', borderRadius: 4 }}>
      {b.items.map((x, j) => OPS.includes(x)
        ? <span key={j} aria-hidden="true" style={{ fontSize: 24, fontWeight: 500, color: '#63666A' }}>{x}</span>
        : <span key={j} style={{ padding: '8px 14px', borderRadius: 3, fontSize: 18, fontWeight: 800, lineHeight: 1.2, background: j === 0 ? '#142850' : '#fff', color: j === 0 ? '#fff' : '#142850', border: j === 0 ? 'none' : '1px solid #D8D9DA' }}>{x}</span>)}
    </div>
  );
  // Cards with a key label, a title, a short text and the questions to ask.
  if (b.t === 'levers') return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16 }}>
      {b.items.map((it, j) => (
        <div key={j} style={{ padding: '22px 22px 20px', border: '1px solid #D8D9DA', borderRadius: 4, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={ST.eyebrow}>{it.k}</span>
          <span style={{ fontSize: 19, lineHeight: 1.25, fontWeight: 800, color: '#142850' }}>{it.title}</span>
          <Rich style={{ fontSize: 15.5, lineHeight: 1.55, color: '#1A1A1A', textWrap: 'pretty' }} html={it.h} />
          {(it.ask || []).length > 0 && (
            <ul style={{ listStyle: 'none', margin: '6px 0 0', padding: '12px 0 0', borderTop: '1px solid #EEEFF0', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {it.ask.map((q, k) => (
                <li key={k} style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                  <span aria-hidden="true" style={{ flex: 'none', width: 6, height: 6, borderRadius: 1, background: '#00638E', transform: 'translateY(-3px)' }} />
                  <Rich style={{ fontSize: 14.5, lineHeight: 1.5, color: '#142850', fontWeight: 600 }} html={q} />
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
  if (b.t === 'ul') return <ul style={ST.ul}>{b.items.map((h, j) => <Rich as="li" key={j} style={dark ? { ...ST.li, color: '#fff' } : ST.li} html={h} />)}</ul>;
  if (b.t === 'ol') {
    const line = '1px solid ' + (dark ? 'rgba(255,255,255,.2)' : '#EEEFF0');
    return (
      <ol style={{ display: 'flex', flexDirection: 'column', borderTop: line, listStyle: 'none', margin: 0, padding: 0 }}>
        {b.items.map((h, j) => (
          <li key={j} style={{ ...ST.olRow, borderBottom: line }}>
            <span aria-hidden="true" style={{ ...ST.olNum, color: dark ? '#D6B874' : '#00638E' }}>{j + 1}</span>
            <Rich as="div" style={dark ? { ...ST.li, paddingLeft: 0, color: '#fff' } : { ...ST.li, paddingLeft: 0 }} html={h} />
          </li>
        ))}
      </ol>
    );
  }
  if (b.t === 'table') return strip(b.head[0]) === 'Minutes' ? <AgendaBlock b={b} /> : <TableBlock b={b} />;
  return null;
}

export const Blocks = ({ list, lede, dark }) => list.map((b, i) => <Block key={i} b={b} lede={lede && i === 0 && b.t === 'p'} dark={dark} />);

// Inline links to tools: a sub-section whose title names a tool becomes a link card.
export function toolForTitle(title, exceptId) {
  return TOOLS.find(x => (x.title === title || x.aka === title) && x.id !== exceptId) || null;
}

// extraToc: [{ id, title }] adds entries for parts rendered after the section.
export function Section({ sec, toc, tocLabel = 'In this topic', noIntro, linkFrom, exceptTool, extraToc = [] }) {
  if (!sec) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 52 }}>
      {sec.intro.length > 0 && !noIntro && <div style={ST.stack}><Blocks list={sec.intro} lede /></div>}
      {toc && sec.subs.length >= 3 && (
        <nav aria-label={tocLabel} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ ...ST.eyebrow, color: '#63666A' }}>{tocLabel}</span>
          <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid #D8D9DA' }}>
            {sec.subs.map((s, i) => <button key={i} type="button" className="hv-underline" onClick={() => jumpTo(sec.id + '--' + i)} style={ST.tocItem}>{s.title}</button>)}
            {extraToc.map(x => <button key={x.id} type="button" className="hv-underline" onClick={() => jumpTo(x.id)} style={ST.tocItem}>{x.title}</button>)}
          </div>
        </nav>
      )}
      {sec.subs.map((s, i) => {
        const week = /^What to do differently this week/.test(s.title);
        const tl = linkFrom !== undefined ? toolForTitle(s.title, exceptTool) : null;
        return (
          <section key={i} id={sec.id + '--' + i} style={{ scrollMarginTop: 72, ...(week ? { display: 'flex', flexDirection: 'column', gap: 18, padding: '32px 32px 28px', background: '#142850', borderRadius: 4 } : ST.stack) }}>
            {week ? <h2 style={{ ...ST.eyebrow, color: '#fff', opacity: 0.8, margin: 0 }}>{s.title}</h2> : <h2 style={ST.h3}>{s.title}</h2>}
            <Blocks list={s.blocks} dark={week} />
            {tl && <ToolLinkCard tool={tl} from={linkFrom || undefined} />}
          </section>
        );
      })}
    </div>
  );
}
