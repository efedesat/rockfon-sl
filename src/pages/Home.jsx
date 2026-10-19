import { Link } from 'react-router-dom';
import { BY, CHAPTERS, isKeyChapter, topicPath } from '../content.js';
import { useStored } from '../store.js';
import { Icon } from '../ui.jsx';

// Tile layout of the "ceiling grid", in chapter order.
const TILES = [
  { span: [2, 2], photo: '/assets/photo-office.jpg', scrim: 'linear-gradient(0deg,rgba(20,40,80,.9) 0%,rgba(20,40,80,.1) 70%)' },
  { span: [2, 1], bg: '#00638E', hover: 'hv-tile-blue' },
  { span: [1, 1], bg: '#00547A', hover: 'hv-tile-blue2' },
  { span: [1, 1], bg: '#1E3A66', hover: 'hv-navytile' },
  { span: [2, 1], photo: '/assets/photo-curved.jpg', scrim: 'linear-gradient(0deg,rgba(20,40,80,.92) 0%,rgba(20,40,80,.3) 100%)' },
];

export function PickUp({ dark }) {
  const [lastRead] = useStored('lastRead', null);
  const last = lastRead && BY[lastRead];
  if (!last || !last.ch) return null;
  return dark ? (
    <Link to={topicPath(last)} className="hv-white08" style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '14px 18px', border: '1px solid rgba(255,255,255,.25)', borderRadius: 4, maxWidth: 320, color: '#fff' }}>
      <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.14em', opacity: 0.7 }}>PICK UP WHERE YOU LEFT OFF</span>
      <span style={{ fontSize: 14, fontWeight: 800 }}>{last.title} →</span>
    </Link>
  ) : (
    <Link to={topicPath(last)} className="hv-bd-blue" style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '12px 16px', border: '1px solid #D8D9DA', borderRadius: 4 }}>
      <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.14em', color: '#63666A' }}>PICK UP WHERE YOU LEFT OFF</span>
      <span style={{ fontSize: 14, fontWeight: 800, color: '#00638E' }}>{last.title} →</span>
    </Link>
  );
}

const tileText = (num, tier, title) => (
  <span style={{ position: 'relative', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 6 }}>
    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', opacity: 0.8, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <span>{num}</span><span style={{ whiteSpace: 'nowrap' }}>{tier}</span>
    </span>
    <span style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.15 }}>{title}</span>
  </span>
);

export default function Home({ narrow }) {
  return (
    <div style={{ minHeight: '100%', background: '#142850', color: '#fff', padding: narrow ? '36px 28px 80px' : '52px 48px 80px', display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div style={{ maxWidth: 1120, width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 24 }}>
          <div style={{ flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.16em', opacity: 0.75 }}>SALES LEADERSHIP PLAYBOOK</span>
            <h1 style={{ margin: 0, fontSize: 40, lineHeight: 1.1, fontWeight: 800 }}>Sales Excellence</h1>
            <p style={{ margin: 0, maxWidth: 520, fontSize: 18, lineHeight: 1.5, color: 'rgba(255,255,255,.88)' }}>Developing people and leading change in Rockfon EA sales.</p>
            <Link to="/guide" className="hv-grey tr" style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderRadius: 3, background: '#fff', color: '#142850', fontSize: 14, fontWeight: 800, minHeight: 44 }}>How to use this playbook →</Link>
          </div>
          <PickUp dark />
        </div>

        <nav aria-label="Chapters" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gridAutoRows: `minmax(${narrow ? 130 : 150}px,auto)`, gap: 4, padding: 4, background: 'rgba(255,255,255,.12)' }}>
          {CHAPTERS.map((ch, i) => {
            const tl = TILES[i] || TILES[3];
            const tier = isKeyChapter(ch) ? 'KEY ELEMENT' : 'FOR INSPIRATION';
            return (
              <Link key={ch.id} to={`/read/${ch.id}`} className={(tl.photo ? 'hv-bright' : tl.hover) + ' tr'}
                style={{ gridColumn: `span ${tl.span[0]}`, gridRow: `span ${tl.span[1]}`, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', color: '#fff', background: tl.photo ? `#142850 url(${tl.photo}) center/cover` : tl.bg }}>
                {tl.scrim && <span className="scrim" style={{ position: 'absolute', inset: 0, background: tl.scrim }} />}
                {tileText(String(ch.n).padStart(2, '0'), tier, ch.title)}
              </Link>
            );
          })}
          <Link to="/toolbox/tk-voices" state={{ from: 'home' }} className="hv-navytile tr" style={{ position: 'relative', background: '#1E3A66', display: 'flex', alignItems: 'center', gap: 18, padding: '0 24px', color: '#fff' }}>
            <span style={{ width: 52, height: 52, flex: 'none', borderRadius: '50%', background: '#00638E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Icon.play()}</span>
            <span style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.15 }}>Leader voices</span>
              <span style={{ fontSize: 12, fontWeight: 600, opacity: 0.75 }}>Rockfon leaders on how they lead</span>
            </span>
          </Link>
          <Link to="/toolbox" className="hv-bright6 tr" style={{ position: 'relative', background: '#D6B874', color: '#142850', display: 'flex', alignItems: 'flex-end' }}>
            <span style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', opacity: 0.8 }}>USE</span>
              <span style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.15 }}>Toolbox</span>
              <span style={{ fontSize: 12, fontWeight: 600, opacity: 0.75 }}>Guides, cards, glossary</span>
            </span>
          </Link>
        </nav>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.16em', opacity: 0.55 }}>ROCKFON EA | PART OF ROCKWOOL GROUP</div>
      </div>
    </div>
  );
}
