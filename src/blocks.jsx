// Renders playbook.json blocks ({t: 'p'|'ul'|'ol'|'table'|'quote'}) exactly as
// written. Layout only: the wording comes from the content file.
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

export function Section({ sec, toc, tocLabel = 'In this topic', noIntro, linkFrom, exceptTool }) {
  if (!sec) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 52 }}>
      {sec.intro.length > 0 && !noIntro && <div style={ST.stack}><Blocks list={sec.intro} lede /></div>}
      {toc && sec.subs.length >= 3 && (
        <nav aria-label={tocLabel} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ ...ST.eyebrow, color: '#63666A' }}>{tocLabel}</span>
          <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid #D8D9DA' }}>
            {sec.subs.map((s, i) => <button key={i} type="button" className="hv-underline" onClick={() => jumpTo(sec.id + '--' + i)} style={ST.tocItem}>{s.title}</button>)}
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
