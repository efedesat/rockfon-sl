import { Link, useSearchParams } from 'react-router-dom';
import { BY, KEY_TOOL_GROUPS, KEY_TOOLS, TOOL_GROUPS, toolMeta } from '../content.js';

// Tool card: title and "Monthly · 90 minutes" (or kind). Also used for the meeting cards on chapter pages.
export function ToolCard({ id, state }) {
  const t = BY[id];
  return (
    <Link to={`/toolbox/${id}`} state={state} className="hv-shadow tr" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 16, minHeight: 120, padding: 20, border: '1px solid #D8D9DA', borderRadius: 4 }}>
      <span style={{ fontSize: 17, fontWeight: 800, lineHeight: 1.3, color: '#142850' }}>{t.title}</span>
      <span style={{ fontSize: 12.5, fontWeight: 600, lineHeight: 1.4, color: '#63666A' }}>{toolMeta(t)}</span>
    </Link>
  );
}

export default function Toolbox({ narrow }) {
  const [params, setParams] = useSearchParams();
  const more = params.get('more') === '1';
  const moreGroups = TOOL_GROUPS.map(g => ({ label: g.label, items: g.items.filter(t => !KEY_TOOLS.includes(t.id)) })).filter(g => g.items.length);
  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: narrow ? '76px 28px 140px' : '80px 48px 140px', display: 'flex', flexDirection: 'column', gap: 36 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 20 }}>
        <div style={{ flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h1 style={{ margin: 0, fontSize: 36, lineHeight: 1.1, fontWeight: 800, color: '#00638E' }}>Toolbox</h1>
          <span style={{ fontSize: 16, lineHeight: 1.5, color: '#63666A' }}>Guides and tools for your week. Open one before a meeting or visit.</span>
        </div>
      </div>
      <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {KEY_TOOL_GROUPS.map(g => (
          <div key={g.label} style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 8 }}>
            {g.label && <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#142850' }}>{g.label}</h3>}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 12 }}>
          {g.tools.map(id => <ToolCard key={id} id={id} />)}
            </div>
          </div>
        ))}
      </section>
      <section style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 8, borderTop: '1px solid #D8D9DA' }}>
        <button type="button" aria-expanded={more} aria-controls="more-tools" onClick={() => setParams(more ? {} : { more: '1' }, { replace: true })} className="tap" style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', fontSize: 14, fontWeight: 800, color: '#00638E' }}>
          {more ? 'Fewer tools ↑' : 'For inspiration: coaching questions, records, downloads ↓'}
        </button>
        {more && (
          <div id="more-tools" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '28px 32px' }}>
            {moreGroups.map(g => (
              <div key={g.label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <h3 style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: '.14em', color: '#63666A', paddingBottom: 6 }}>{g.label}</h3>
                {g.items.map(t => <Link key={t.id} to={`/toolbox/${t.id}`} className="hv-underline" style={{ padding: '6px 0', fontSize: 14.5, fontWeight: 700, lineHeight: 1.35, color: '#00638E' }}>{t.title}</Link>)}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
