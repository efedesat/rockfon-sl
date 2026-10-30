// Playbook glossary: words used in the playbook, from content/glossary.json.
// Search and group filters; ?term=<slug> scrolls to one term (used by the header search).
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BY, GLOSSARY, isShown, pathOf, termSlug } from '../content.js';

const sortKey = t => t.term.replace(/^1:1\s*/, '').toLowerCase();

export default function Terms({ narrow }) {
  const [params] = useSearchParams();
  const [q, setQ] = useState('');
  const [group, setGroup] = useState('');
  const focus = params.get('term');
  const groups = [...new Set(GLOSSARY.map(t => t.group))];
  const qq = q.trim().toLowerCase();
  const list = GLOSSARY.filter(t => (!group || t.group === group) && (!qq || (t.term + ' ' + t.definition).toLowerCase().includes(qq)))
    .slice().sort((a, b) => sortKey(a).localeCompare(sortKey(b)));
  useEffect(() => {
    if (!focus) return;
    const el = document.getElementById('term-' + focus);
    if (el) el.scrollIntoView({ block: 'center' });
  }, [focus]);
  let letter = '';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <p style={{ margin: 0, fontSize: 17, lineHeight: 1.55, color: '#1A1A1A' }}>Words used in the playbook, in plain language. For Rocksell fields and data definitions, see the CRM glossary.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input type="search" aria-label="Find a term" value={q} onChange={e => setQ(e.target.value)} placeholder="Find a term"
          style={{ height: 44, padding: '0 14px', border: '1px solid #B1B2B4', borderRadius: 3, fontSize: 15, color: '#1A1A1A', background: '#fff', outline: 'none' }} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {['', ...groups].map(g => (
            <button key={g || 'all'} type="button" aria-pressed={group === g} onClick={() => setGroup(g)} className="tr"
              style={{ padding: '6px 12px', borderRadius: 999, fontSize: 12.5, fontWeight: 700, border: '1px solid #00638E', background: group === g ? '#00638E' : '#fff', color: group === g ? '#fff' : '#00638E' }}>{g || 'All'}</button>
          ))}
        </div>
      </div>
      <dl style={{ margin: 0, display: 'flex', flexDirection: 'column' }}>
        {list.map(t => {
          const L = sortKey(t)[0].toUpperCase(), head = L !== letter ? (letter = L) : null;
          const see = t.see && BY[t.see] && isShown(t.see) ? BY[t.see] : null, slug = termSlug(t.term), on = focus === slug;
          return (
            <div key={t.term}>
              {head && !qq && <div aria-hidden="true" style={{ padding: '18px 0 6px', fontSize: 13, fontWeight: 800, color: '#00638E', borderBottom: '2px solid #00638E' }}>{head}</div>}
              <div id={'term-' + slug} style={{ scrollMarginTop: 80, display: 'grid', gridTemplateColumns: narrow ? 'minmax(0,1fr)' : 'minmax(160px,.8fr) minmax(0,2fr)', gap: '6px 24px', padding: '14px 10px', borderBottom: '1px solid #EEEFF0', background: on ? '#FBF6EA' : 'transparent' }}>
                <dt style={{ fontSize: 15.5, fontWeight: 800, lineHeight: 1.35, color: '#142850' }}>{t.term}</dt>
                <dd style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: 15, lineHeight: 1.55, color: '#1A1A1A' }}>{t.definition}</span>
                  {see && <Link to={pathOf(see)} className="hv-underline" style={{ alignSelf: 'flex-start', fontSize: 13, fontWeight: 700, color: '#00638E' }}>Read more: {see.title} →</Link>}
                </dd>
              </div>
            </div>
          );
        })}
      </dl>
      {!list.length && <span style={{ fontSize: 14, color: '#63666A' }}>No term matches this search.</span>}
    </div>
  );
}
