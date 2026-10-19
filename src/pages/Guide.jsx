import { Link } from 'react-router-dom';
import { BY, CHAPTERS, KEY_TOOLS, isKeyChapter } from '../content.js';

function Column({ pill, pillBg, pillFg, top, title, text, items }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 24, border: '1px solid #D8D9DA', borderTop: `4px solid ${top}`, borderRadius: 4 }}>
      <span style={{ alignSelf: 'flex-start', whiteSpace: 'nowrap', padding: '4px 10px', borderRadius: 999, fontSize: 10.5, fontWeight: 800, letterSpacing: '.12em', background: pillBg, color: pillFg }}>{pill}</span>
      <h2 style={{ margin: 0, fontSize: 22, lineHeight: 1.2, fontWeight: 800, color: '#142850' }}>{title}</h2>
      <span style={{ fontSize: 14.5, lineHeight: 1.55, color: '#1A1A1A' }}>{text}</span>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {items.map((gi, i) => (
          <Link key={i} to={gi.to} className="hv-tint" style={{ display: 'flex', alignItems: 'baseline', gap: 10, padding: '10px 0', borderTop: '1px solid #EEEFF0', minHeight: 44 }}>
            <span style={{ flex: 'none', minWidth: 22, fontSize: 12, fontWeight: 800, color: '#63666A' }}>{gi.n}</span>
            <span style={{ flex: 1, fontSize: 15, fontWeight: 800, lineHeight: 1.35, color: '#142850' }}>{gi.title}</span>
            <span aria-hidden="true" style={{ fontSize: 14, fontWeight: 700, color: '#00638E' }}>→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Guide({ narrow }) {
  const read = CHAPTERS.filter(isKeyChapter).map(c => ({ n: String(c.n), title: c.title, to: `/read/${c.id}` }));
  const use = KEY_TOOLS.map(id => ({ n: '', title: BY[id].title, to: `/toolbox/${id}` }));
  const insp = [...CHAPTERS.filter(c => !isKeyChapter(c)).map(c => ({ n: String(c.n), title: c.title, to: `/read/${c.id}` })), { n: '', title: 'The rest of the Toolbox', to: '/toolbox?more=1' }];
  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: narrow ? '76px 28px 140px' : '80px 48px 140px', display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 680 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.16em', color: '#63666A' }}>START HERE</span>
        <h1 style={{ margin: 0, fontSize: 40, lineHeight: 1.1, fontWeight: 800, color: '#00638E' }}>How to use this playbook</h1>
        <p style={{ margin: 0, fontSize: 19, lineHeight: 1.5, color: '#1A1A1A', textWrap: 'pretty' }}>You don't need to read everything. Some parts you read once and know well, some you use every week, and the rest is there when you need it. Every page is labelled so you can tell which is which.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 14 }}>
        <Column pill="KEY ELEMENT" pillBg="#00638E" pillFg="#fff" top="#00638E" title="Read and know" text="Start here. These chapters set out your role, the model and the routines you are expected to run." items={read} />
        <Column pill="KEY ELEMENT" pillBg="#142850" pillFg="#fff" top="#142850" title="Use every week" text="Open these before and during your meetings and visits. Each one guides you through the meeting as you run it." items={use} />
        <Column pill="FOR INSPIRATION" pillBg="#D6B874" pillFg="#142850" top="#D6B874" title="Dip in when useful" text="Come back to these when you want to build a coaching skill, lead a change or find a template." items={insp} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '22px 24px', background: '#F2F3F4', borderRadius: 4 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', color: '#63666A' }}>A GOOD FIRST WEEK</span>
        <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '12px 24px' }}>
          {['Read The role.', 'Read the Sales management model and Routines.', 'Open the cockpit for your next 1:1 and run it from the playbook.'].map((s, i) => (
            <li key={i} style={{ display: 'flex', gap: 10 }}><span aria-hidden="true" style={{ fontSize: 20, fontWeight: 800, color: '#00638E' }}>{i + 1}</span><span style={{ fontSize: 14.5, lineHeight: 1.5, color: '#1A1A1A' }}>{s}</span></li>
          ))}
        </ol>
      </div>
    </div>
  );
}
