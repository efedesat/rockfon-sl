import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { BY, CHAPTERS, minsOf, pathOf, secOf, strip, tierOf, W } from '../content.js';
import { Blocks, Rich, Section, ST } from '../blocks.jsx';
import { SETTINGS } from '../settings.js';
import { useStoredMap } from '../store.js';
import { Bar, Bars, Icon, TierLabel } from '../ui.jsx';
import { CoachIntro, Expect, FourInstances, SelfCheck, Tracker, Wheels } from './modules.jsx';

function TopicEnd({ t }) {
  const [notes, setNote] = useStoredMap('notes');
  const ch = t.ch, nextT = ch.topics[t.idx + 1], nextCh = CHAPTERS[CHAPTERS.indexOf(ch) + 1];
  const team = BY[t.team] || BY['tk-kit'];
  const next = nextT ? { label: 'KEEP READING', title: nextT.title, to: pathOf(nextT), state: nextT.link ? { from: ch.id } : undefined }
    : nextCh ? { label: 'NEXT CHAPTER', title: nextCh.title, to: `/read/${nextCh.id}` }
      : { label: 'WHEN YOU NEED IT', title: 'Toolbox', to: '/toolbox' };
  const note = notes[t.id] || '';
  return (
    <div className="no-print" style={{ maxWidth: 760, margin: '0 auto', padding: '56px 32px 140px', display: 'flex', flexDirection: 'column', gap: 40 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '24px 26px', background: '#F2F3F4', borderRadius: 4 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', color: '#00638E' }}>PAUSE AND REFLECT</span>
        <Bar h={15} bg="#B1B2B4" w="78%" />
        <textarea aria-label="Your notes" value={note} onChange={e => setNote(t.id, e.target.value)} placeholder="Your notes. Only you can see these."
          style={{ minHeight: 96, resize: 'vertical', border: '1px solid #D8D9DA', borderRadius: 3, padding: '12px 14px', fontSize: 14, lineHeight: 1.5, color: '#1A1A1A', outline: 'none', background: '#fff' }} />
        <span style={{ fontSize: 11, color: '#63666A' }}>{note ? 'Saved on this device' : 'Saved automatically on this device'}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 14 }}>
        <Link to={`/toolbox/${team.id}`} className="hv-bd-blue tr" style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 20, border: '1px solid #D8D9DA', borderRadius: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', color: '#63666A' }}>TAKE IT TO YOUR TEAM</span>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#00638E' }}>{team.title} →</span>
        </Link>
        <Link to={next.to} state={next.state} className="hv-bd-blue tr" style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 20, border: '1px solid #D8D9DA', borderRadius: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', color: '#63666A' }}>{next.label}</span>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#00638E' }}>{next.title} →</span>
        </Link>
      </div>
    </div>
  );
}

function Story({ t, sec, narrow, mainRef }) {
  const refs = useRef([]);
  const [idea, setIdea] = useState(0);
  const ps = sec ? sec.intro : null;
  const lede = ps && ps[0] ? strip(ps[0].h) : '';
  const ideas = ps && ps.length > 1 ? ps.slice(1) : [null, null, null];
  useEffect(() => {
    const m = mainRef.current;
    if (!m) return;
    const on = () => {
      const mid = m.getBoundingClientRect().top + m.clientHeight * 0.55;
      let a = 0;
      refs.current.forEach((r, i) => { if (r && r.getBoundingClientRect().top < mid) a = i; });
      setIdea(a);
    };
    m.addEventListener('scroll', on, { passive: true });
    return () => m.removeEventListener('scroll', on);
  }, [mainRef]);
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tier = tierOf(t.ch);
  return (
    <>
      <div style={{ position: 'relative', minHeight: 'calc(100vh - 60px)', background: '#F2F3F4', display: 'flex', alignItems: 'flex-end' }}>
        <div style={{ width: '100%', maxWidth: 960, margin: '0 auto', padding: '96px 32px 64px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <TierLabel tier={tier} />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.16em', color: '#63666A', textTransform: 'uppercase' }}>Chapter {t.ch.n} · {t.ch.title}</span>
          <h1 style={{ margin: 0, fontSize: 22, lineHeight: 1.25, fontWeight: 800, color: '#142850' }}>{t.title}</h1>
          {lede ? <p style={{ margin: 0, padding: '8px 0 10px', maxWidth: 820, fontSize: narrow ? 34 : 40, lineHeight: 1.2, fontWeight: 800, color: '#00638E', textWrap: 'pretty' }}>{lede}</p>
            : <>
              <Bars widths={['94%', '80%', '46%']} h={40} bg="rgba(0,99,142,.22)" gap={16} style={{ padding: '8px 0 10px' }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', color: '#00638E' }}>OPENING QUESTION</span>
            </>}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 700, color: '#63666A', paddingTop: 14 }}>{Icon.down()}Scroll · {minsOf(t)} min</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)' }}>
        <div style={{ position: 'relative' }}>
          <div className="no-print" style={{ position: 'sticky', top: 0, height: 'calc(100vh - 60px)', overflow: 'hidden', background: '#142850' }}>
            {t.imgs.map((src, i) => <div key={i} aria-hidden="true" style={{ position: 'absolute', inset: 0, background: `#D8D9DA url(${src}) center/cover`, opacity: idea % t.imgs.length === i ? 1 : 0, transition: 'opacity 500ms ease' }} />)}
          </div>
        </div>
        <div style={{ padding: `0 ${narrow ? 32 : 64}px`, display: 'flex', flexDirection: 'column' }}>
          {ideas.map((b, i) => (
            <div key={i} ref={el => { refs.current[i] = el; }} style={{ minHeight: '76vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16, opacity: reduced || idea === i ? 1 : 0.28, transition: 'opacity 350ms ease' }}>
              <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: '.12em', color: '#00638E' }}>{String(i + 1).padStart(2, '0')}</span>
              {b ? <Rich as="p" style={{ margin: 0, fontSize: 22, lineHeight: 1.55, color: '#142850', textWrap: 'pretty' }} html={b.h} />
                : <>
                  <Bar h={26} r={3} bg="#D8D9DA" w={W[(i + 1) % W.length]} />
                  <Bars widths={['100%', '94%', '97%', '52%']} h={11} gap={11} style={{ paddingTop: 4 }} />
                  <div style={{ marginTop: 8, padding: '16px 18px', border: '1px solid #00638E', borderRadius: 4, display: 'flex', flexDirection: 'column', gap: 9 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', color: '#00638E' }}>ASK YOURSELF</span>
                    <Bar h={13} bg="#B1B2B4" w="86%" />
                  </div>
                </>}
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: '#142850', color: '#fff' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '56px 32px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.16em', opacity: 0.75 }}>ONE THING TO TRY THIS WEEK</span>
          <Bars widths={['88%', '52%']} h={22} bg="rgba(255,255,255,.5)" gap={14} />
        </div>
      </div>
    </>
  );
}

function Article({ t, sec }) {
  const tier = tierOf(t.ch);
  let intro = null, body;
  if (t.module === 'expect' && sec) body = <Expect sec={sec} />;
  else if (t.module === 'selfcheck' && sec) body = <div style={ST.stack}><Blocks list={sec.intro} lede /></div>;
  else if (t.id === 'sct-1' && sec) body = <CoachIntro sec={sec} />;
  else if (t.contentRef && t.contentRef.sectionId === 'four-instances' && sec) body = <FourInstances sec={sec} chId={t.ch.id} />;
  else {
    if (t.module === 'wheels' && sec) intro = <div style={ST.stack}><Blocks list={sec.intro} lede /></div>;
    body = <Section sec={sec} toc noIntro={t.module === 'wheels'} linkFrom={t.ch.id} />;
  }
  return (
    <>
      <div style={{ position: 'relative', height: 440, background: `#142850 url(${t.imgs[0]}) center/cover`, display: 'flex', alignItems: 'flex-end' }}>
        <div className="scrim" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg,rgba(20,40,80,.94) 0%,rgba(20,40,80,.35) 60%,rgba(20,40,80,.5) 100%)' }} />
        <div style={{ position: 'relative', width: '100%', maxWidth: 760, margin: '0 auto', padding: '0 32px 44px', display: 'flex', flexDirection: 'column', gap: 14, color: '#fff' }}>
          <TierLabel tier={tier} dark />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.16em', opacity: 0.8, textTransform: 'uppercase' }}>Chapter {t.ch.n} · {t.ch.title}</span>
          <h1 style={{ margin: 0, fontSize: 42, lineHeight: 1.1, fontWeight: 800, textWrap: 'pretty' }}>{t.title}</h1>
          <span style={{ fontSize: 12, fontWeight: 700, opacity: 0.75, paddingTop: 6 }}>{minsOf(t)} min read</span>
        </div>
      </div>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 32px 0', display: 'flex', flexDirection: 'column', gap: 40 }}>
        {!sec && <Bars widths={['100%', '88%', '93%', '40%']} h={12} gap={12} />}
        <div style={{ paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 44 }}>
          {intro}
          {t.module === 'wheels' && <Wheels chId={t.ch.id} />}
          {body}
        </div>
        {t.module === 'selfcheck' && <SelfCheck sec={sec} topicId={t.id} />}
        {t.module === 'tracker' && <Tracker />}
        {!sec && <Bars widths={['100%', '95%', '70%']} h={12} gap={12} />}
      </div>
    </>
  );
}

export default function Topic({ t, narrow, mainRef }) {
  const sec = secOf(t);
  const story = t.type === 'story' && SETTINGS.storyPages;
  return (
    <article>
      {story ? <Story t={t} sec={sec} narrow={narrow} mainRef={mainRef} /> : <Article t={t} sec={sec} />}
      <TopicEnd t={t} />
    </article>
  );
}
