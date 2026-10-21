import { Link } from 'react-router-dom';
import { BY, LIB, minsOf, rhythmRow, strip, tierOf, topicPath } from '../content.js';
import { Icon, TierLabel } from '../ui.jsx';

const H = { fontSize: 11, fontWeight: 700, letterSpacing: '.14em', color: '#63666A' };

function meetingCard(t, ch) {
  const tl = BY[t.link], r = rhythmRow(tl);
  const devSec = LIB['commercial-wheel'] && LIB['commercial-wheel'].sections.find(x => x.id === 'personal-development-meeting-rhythm');
  const freq = r ? strip(r[1]).split(';')[0] : tl.sub ? tl.kind : 'Development';
  const meta = r ? strip(r[2]) + ' · ' + strip(r[3]) : tl.sub ? tl.sub : devSec ? devSec.subs.map(x => x.title).join(' · ') : '';
  return (
    <Link key={t.id} to={`/toolbox/${tl.id}`} state={{ from: ch.id }} className="hv-shadow hv-bd-blue tr" style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 128, padding: 18, border: '1px solid #D8D9DA', borderRadius: 4 }}>
      <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#00638E' }}>{freq}</span>
      <span style={{ fontSize: 16, fontWeight: 800, lineHeight: 1.3, color: '#142850' }}>{tl.title}</span>
      <span style={{ fontSize: 12.5, lineHeight: 1.45, color: '#63666A', marginTop: 'auto' }}>{meta}</span>
    </Link>
  );
}

export default function Chapter({ ch, narrow }) {
  const methods = ch.topics.filter(t => t.kind === 'method-card');
  const cards = ch.topics.filter(t => t.link && t.kind !== 'method-card');
  const start = ch.topics.filter(t => t.startHere && !t.link);
  const doors = ch.topics.filter(t => !t.startHere && !t.link);
  const rhythm = cards.length > 0 || methods.length > 0 || start.length > 0;
  const groups = [];
  cards.forEach(t => { let g = groups.find(x => x.label === t.group); if (!g) groups.push(g = { label: t.group, items: [] }); g.items.push(t); });
  // Sales development wheel first, then Personal development wheel.
  groups.sort((a, b) => (a.label === 'Personal development wheel') - (b.label === 'Personal development wheel'));

  let lastGroup;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,5fr) minmax(0,7fr)', minHeight: '100%' }}>
      <div style={{ position: 'relative' }}>
        <div role="img" aria-label="" style={{ position: 'sticky', top: 0, height: 'calc(100vh / var(--z) - 60px)', background: `#D8D9DA url(${ch.img}) center/cover` }} />
      </div>
      <div style={{ padding: narrow ? '76px 28px 120px' : '80px 56px 120px', display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 640 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <TierLabel tier={tierOf(ch)} />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.16em', color: '#63666A' }}>CHAPTER {ch.n}</span>
          <h1 style={{ margin: 0, fontSize: 40, lineHeight: 1.1, fontWeight: 800, color: '#00638E' }}>{ch.title}</h1>
          <p style={{ margin: 0, maxWidth: 640, fontSize: 19, lineHeight: 1.5, color: '#1A1A1A', textWrap: 'pretty' }}>{ch.intro}</p>
        </div>

        {rhythm && (
          <>
            {start.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <h2 style={{ ...H, margin: 0 }}>START HERE</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: 10 }}>
                  {start.map((t, i) => (
                    <Link key={t.id} to={topicPath(t)} className="hv-navy tr" style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 150, padding: '18px 18px 16px', background: '#142850', color: '#fff', borderRadius: 4 }}>
                      <span style={{ fontSize: 22, fontWeight: 800, color: '#45A6DE' }}>{String(i + 1).padStart(2, '0')}</span>
                      <span style={{ fontSize: 15, fontWeight: 800, lineHeight: 1.3, textWrap: 'pretty' }}>{t.title}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, opacity: 0.75, marginTop: 'auto' }}>{minsOf(t)} min read</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {groups.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                <h2 style={{ ...H, margin: 0 }}>THE MEETINGS</h2>
                {groups.map(g => (
                  <div key={g.label} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#142850' }}>{g.label}</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 10 }}>{g.items.map(t => meetingCard(t, ch))}</div>
                  </div>
                ))}
              </div>
            )}
            {methods.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <h2 style={{ ...H, margin: 0 }}>USED INSIDE THE MEETINGS</h2>
                {methods.map(t => {
                  const tl = BY[t.link];
                  return (
                    <Link key={t.id} to={`/toolbox/${tl.id}`} state={{ from: ch.id }} className="hv-tint tr" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', border: '1px solid #D8D9DA', borderRadius: 4 }}>
                      <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <span style={{ fontSize: 15, fontWeight: 800, color: '#142850' }}>{tl.title}</span>
                        {tl.sub && <span style={{ fontSize: 12.5, color: '#63666A' }}>{tl.sub}</span>}
                      </span>
                      {Icon.arrow(18)}
                    </Link>
                  );
                })}
              </div>
            )}
            {doors.length > 0 && <h2 style={{ ...H, margin: '0 0 -24px' }}>GO DEEPER</h2>}
          </>
        )}

        {doors.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid #D8D9DA' }}>
            {doors.map((t, i) => {
              const head = t.group && t.group !== lastGroup ? t.group : null;
              lastGroup = t.group;
              return (
                <div key={t.id}>
                  {head && <h2 style={{ margin: 0, padding: '28px 4px 10px', fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#63666A', borderBottom: '1px solid #D8D9DA' }}>{head}</h2>}
                  <Link to={topicPath(t)} className="hv-tint" style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '22px 4px', borderBottom: '1px solid #D8D9DA' }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#737679', width: 24 }}>{String(i + 1).padStart(2, '0')}</span>
                    <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <span style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.25, color: '#142850' }}>{t.title}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#63666A' }}>{minsOf(t)} min read</span>
                    </span>
                    {Icon.arrow()}
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {ch.tools.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <h2 style={{ ...H, margin: 0 }}>RELATED IN THE TOOLBOX</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {ch.tools.map(id => <Link key={id} to={`/toolbox/${id}`} className="hv-pill tr" style={{ padding: '8px 14px', borderRadius: 999, background: 'rgba(0,99,142,.08)', color: '#00638E', fontSize: 13, fontWeight: 700, minHeight: 36, display: 'inline-flex', alignItems: 'center' }}>{BY[id].title}</Link>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
