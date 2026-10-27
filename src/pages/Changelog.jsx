// "What's new": releases from content/changelog.json, newest first.
// The home page footer shows the stage, latest version and its date.
import changelog from '../../content/changelog.json';

export const RELEASES = changelog.releases;
export const STAGE = changelog.stage;
export const LATEST = RELEASES[0];
export const fmtDate = iso => new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export default function Changelog({ narrow }) {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: narrow ? '76px 28px 140px' : '80px 48px 140px', display: 'flex', flexDirection: 'column', gap: 40 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.16em', color: '#63666A' }}>{STAGE.toUpperCase()} · VERSION {LATEST.version}</span>
        <h1 style={{ margin: 0, fontSize: 40, lineHeight: 1.1, fontWeight: 800, color: '#00638E' }}>What's new</h1>
        <p style={{ margin: 0, fontSize: 18, lineHeight: 1.5, color: '#1A1A1A' }}>Changes to the playbook, newest first.</p>
      </div>
      {RELEASES.map(r => (
        <section key={r.version} style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingTop: 28, borderTop: '1px solid #D8D9DA' }}>
          <h2 style={{ margin: 0, display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '6px 14px' }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#142850' }}>Version {r.version}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#63666A' }}>{fmtDate(r.date)}</span>
          </h2>
          {r.groups.map(g => (
            <div key={g.heading} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <h3 style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#00638E' }}>{g.heading}</h3>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {g.items.map((x, i) => (
                  <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
                    <span aria-hidden="true" style={{ flex: 'none', width: 6, height: 6, borderRadius: 1, background: '#00638E', transform: 'translateY(-3px)' }} />
                    <span style={{ fontSize: 16, lineHeight: 1.55, color: '#1A1A1A', textWrap: 'pretty' }}>{x}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
