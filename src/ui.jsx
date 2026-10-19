import { Link } from 'react-router-dom';

export const LBL = { fontSize: 10.5, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#63666A' };
export const EYEBROW = { fontSize: 11, fontWeight: 700, letterSpacing: '.14em', color: '#63666A' };

const svg = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
export const Icon = {
  search: (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" {...svg}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>,
  globe: (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" {...svg}><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>,
  menu: (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" {...svg}><path d="M4 6h16M4 12h16M4 18h10" /></svg>,
  back: (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" {...svg} strokeWidth="2.2" style={{ flex: 'none' }}><path d="M19 12H5M11 18l-6-6 6-6" /></svg>,
  arrow: (s = 20, c = '#00638E') => <svg width={s} height={s} viewBox="0 0 24 24" {...svg} stroke={c}><path d="M5 12h14M13 6l6 6-6 6" /></svg>,
  down: (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" {...svg}><path d="M12 5v14M6 13l6 6 6-6" /></svg>,
  close: (s = 22) => <svg width={s} height={s} viewBox="0 0 24 24" {...svg}><path d="M6 6l12 12M18 6 6 18" /></svg>,
  chevL: (s = 18, w = 2.4) => <svg width={s} height={s} viewBox="0 0 24 24" {...svg} strokeWidth={w}><path d="M15 18l-6-6 6-6" /></svg>,
  chevR: (s = 18, w = 2.4) => <svg width={s} height={s} viewBox="0 0 24 24" {...svg} strokeWidth={w}><path d="M9 18l6-6-6-6" /></svg>,
  check: (s = 12) => <svg width={s} height={s} viewBox="0 0 24 24" {...svg} strokeWidth="3.5"><path d="M20 6 9 17l-5-5" /></svg>,
  chat: (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" {...svg}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
  play: (s = 20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>,
};

// Tier label: pill + hint. Clicking opens "How to use this playbook".
export function TierLabel({ tier, dark }) {
  if (!tier) return null;
  return (
    <Link to="/guide" title="How to use this playbook" style={{ alignSelf: 'flex-start', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px 10px' }}>
      <span style={{ flex: 'none', whiteSpace: 'nowrap', padding: '4px 10px', borderRadius: 999, fontSize: 10.5, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', background: tier.bg, color: tier.fg }}>{tier.label}</span>
      <span style={{ flex: 'none', whiteSpace: 'nowrap', fontSize: 12.5, fontWeight: 700, color: dark ? 'rgba(255,255,255,.9)' : '#63666A' }}>{tier.hint}</span>
    </Link>
  );
}

// Grey placeholder bars for content not supplied yet.
export function Bar({ w = '100%', h = 10, bg = '#E4E5E6', r = 2, style }) {
  return <div aria-hidden="true" style={{ height: h, borderRadius: r, background: bg, width: w, ...style }} />;
}
export function Bars({ widths, h = 10, bg = '#E4E5E6', gap = 9, style }) {
  return <div aria-hidden="true" style={{ display: 'flex', flexDirection: 'column', gap, ...style }}>{widths.map((w, i) => <Bar key={i} w={w} h={h} bg={bg} />)}</div>;
}

export function Tag({ children, tone = 'neutral' }) {
  const p = { neutral: ['#63666A', 'rgba(99,102,106,0.12)'], sand: ['#7A5F1E', 'rgba(214,184,116,0.22)'] }[tone];
  return <span style={{ display: 'inline-flex', alignItems: 'center', fontWeight: 600, letterSpacing: '.02em', lineHeight: 1.4, borderRadius: 999, whiteSpace: 'nowrap', padding: '4px 11px', fontSize: '.75rem', background: p[1], color: p[0] }}>{children}</span>;
}

export function Btn({ variant = 'secondary', children, full, ...rest }) {
  return <button type="button" className={`btn btn-${variant}${full ? ' btn-full' : ''} tap`} {...rest}>{children}</button>;
}

export function PillToggle({ on, onClick, children, style }) {
  return (
    <button type="button" aria-pressed={on} onClick={onClick} className="tap tr" style={{ padding: '9px 16px', borderRadius: 999, fontSize: 13, fontWeight: 700, border: '1px solid #00638E', background: on ? '#00638E' : '#fff', color: on ? '#fff' : '#00638E', ...style }}>{children}</button>
  );
}

// "{kind} in the Toolbox" link card used inside articles.
export function ToolLinkCard({ tool, from }) {
  return (
    <Link to={`/toolbox/${tool.id}`} state={from ? { from } : undefined} className="hv-tint tr" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', border: '1px solid #00638E', borderRadius: 4, background: '#fff' }}>
      <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span style={LBL}>{tool.kind} in the Toolbox</span>
        <span style={{ fontSize: 15, fontWeight: 800, color: '#00638E' }}>{tool.title}</span>
      </span>
      <span aria-hidden="true" style={{ fontSize: 18, fontWeight: 700, color: '#00638E' }}>→</span>
    </Link>
  );
}

export function Textarea({ value, onChange, placeholder, label, style }) {
  return (
    <textarea aria-label={label || placeholder} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ width: '100%', minHeight: 64, resize: 'vertical', border: '1px solid #D8D9DA', borderRadius: 3, padding: '10px 12px', fontSize: 14, lineHeight: 1.5, color: '#1A1A1A', outline: 'none', background: '#fff', ...style }} />
  );
}
