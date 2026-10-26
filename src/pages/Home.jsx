import { Link } from 'react-router-dom';
import { BY, CHAPTERS, isKeyChapter, isShown, topicPath } from '../content.js';
import { Icon } from '../ui.jsx';

// Tile looks of the "ceiling grid", in chapter order.
const TILES = [
  { photo: '/assets/photo-office.jpg', scrim: 'linear-gradient(0deg,rgba(20,40,80,.9) 0%,rgba(20,40,80,.1) 70%)' },
  { bg: '#00638E', hover: 'hv-tile-blue' },
  { bg: '#00547A', hover: 'hv-tile-blue2' },
  { bg: '#1E3A66', hover: 'hv-navytile' },
  { photo: '/assets/photo-curved.jpg', scrim: 'linear-gradient(0deg,rgba(20,40,80,.92) 0%,rgba(20,40,80,.3) 100%)' },
];

// Tile sizes [columns, rows] on the 4-column grid, by how many tiles are shown
// (visible chapters, Leader voices, Toolbox). Each layout fills a full rectangle,
// so hiding a chapter or Leader voices never leaves a gap.
const SPANS = {
  1: [[4, 2]],
  2: [[2, 2], [2, 2]],
  3: [[2, 2], [2, 1], [2, 1]],
  4: [[2, 2], [2, 1], [1, 1], [1, 1]],
  5: [[2, 2], [1, 1], [1, 1], [1, 1], [1, 1]],
  6: [[2, 2], [2, 1], [1, 1], [1, 1], [2, 1], [2, 1]],
  7: [[2, 2], [2, 1], [1, 1], [1, 1], [2, 1], [1, 1], [1, 1]],
};
const spanStyle = ([c, r]) => ({ gridColumn: `span ${c}`, gridRow: `span ${r}` });

const tileText = (num, tier, title) => (
  <span style={{ position: 'relative', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 6 }}>
    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', opacity: 0.8, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <span>{num}</span><span style={{ whiteSpace: 'nowrap' }}>{tier}</span>
    </span>
    <span style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.15 }}>{title}</span>
  </span>
);

export default function Home({ narrow }) {
  const voices = isShown('tk-voices');
  const spans = SPANS[CHAPTERS.length + (voices ? 1 : 0) + 1] || SPANS[7];
  return (
    <div style={{ minHeight: '100%', background: '#142850', color: '#fff', padding: narrow ? '36px 28px 80px' : '52px 48px 80px', display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div style={{ maxWidth: 1120, width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 24 }}>
          <div style={{ flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h1 style={{ margin: 0, fontSize: 40, lineHeight: 1.1, fontWeight: 800 }}>Sales Excellence</h1>
            <p style={{ margin: 0, maxWidth: 520, fontSize: 18, lineHeight: 1.5, color: 'rgba(255,255,255,.88)' }}>Developing people and leading change in Rockfon EA sales.</p>
            <Link to="/guide" className="hv-grey tr" style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderRadius: 3, background: '#fff', color: '#142850', fontSize: 14, fontWeight: 800, minHeight: 44 }}>How to use this playbook →</Link>
          </div>
        </div>

        <nav aria-label="Chapters" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gridAutoRows: `minmax(${narrow ? 130 : 150}px,auto)`, gap: 4, padding: 4, background: 'rgba(255,255,255,.12)' }}>
          {CHAPTERS.map((ch, i) => {
            const tl = TILES[i] || TILES[3], sp = spans[i] || [1, 1];
            const tier = isKeyChapter(ch) ? 'KEY ELEMENT' : 'FOR INSPIRATION';
            return (
              <Link key={ch.id} to={`/read/${ch.id}`} className={(tl.photo ? 'hv-bright' : tl.hover) + ' tr'}
                style={{ ...spanStyle(sp), position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', color: '#fff', background: tl.photo ? `#142850 url(${tl.photo}) center/cover` : tl.bg }}>
                {tl.scrim && <span className="scrim" style={{ position: 'absolute', inset: 0, background: tl.scrim }} />}
                {tileText(String(ch.n).padStart(2, '0'), tier, ch.title)}
              </Link>
            );
          })}
          {voices && (
          <Link to="/toolbox/tk-voices" state={{ from: 'home' }} className="hv-navytile tr" style={{ ...spanStyle(spans[CHAPTERS.length]), position: 'relative', background: '#1E3A66', display: 'flex', alignItems: 'center', gap: 18, padding: '0 24px', color: '#fff' }}>
            <span style={{ width: 52, height: 52, flex: 'none', borderRadius: '50%', background: '#00638E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Icon.play()}</span>
            <span style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.15 }}>Leader voices</span>
              <span style={{ fontSize: 12, fontWeight: 600, opacity: 0.75 }}>Rockfon leaders on how they lead</span>
            </span>
          </Link>
          )}
          <Link to="/toolbox" className="hv-bright6 tr" style={{ ...spanStyle(spans[spans.length - 1]), position: 'relative', background: '#D6B874', color: '#142850', display: 'flex', alignItems: 'flex-end' }}>
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
