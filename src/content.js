// Builds the navigation model from content/site-map.json and resolves text
// from content/playbook.json. No playbook copy lives in code.
import siteMap from '../content/site-map.json';
import playbook from '../content/playbook.json';

export const LIB = playbook.parts;
// Cockpit content per meeting and agenda topic: purpose, data, ask, run, watch.
export const COCKPIT = playbook.cockpit || {};
export const COCKPIT_PHASES = playbook.cockpitPhases || {};
export const DEAL_ROOM = siteMap.dealRoom;
export const DASHBOARD = siteMap.dashboard || [];
// Finds the dashboard element a "Data to look at" line refers to: [page, element].
export function dashMatch(str) {
  const l = (str || '').toLowerCase();
  for (let p = 0; p < DASHBOARD.length; p++) for (let i = 0; i < DASHBOARD[p].elements.length; i++) if (l.includes(DASHBOARD[p].elements[i].id.toLowerCase())) return [p, i];
  return null;
}
export const strip = h => (h || '').replace(/<[^>]+>/g, '');
// Site-map asset paths are relative to the site root.
const asset = p => (p && !/^(\/|https?:)/.test(p) ? '/' + p : p);

export const BY = {};
export const TOPICS = [];
export const TOOLS = [];

export const CHAPTERS = siteMap.chapters.map(c => {
  const ch = { ...c, n: c.number, img: asset(c.photo), tools: c.relatedTools || [], isChapter: true };
  ch.topics = c.topics.map((t, idx) => {
    // Cards on the Routines chapter that open a tool: meetings, and methods used inside them.
    const isCard = t.kind === 'meeting-card' || t.kind === 'method-card';
    const topic = {
      ...t,
      ch,
      idx,
      link: isCard ? t.opensTool : null,
      type: t.pageType,
      imgs: (t.photos || []).map(asset),
      team: t.relatedTool,
    };
    BY[topic.id] = topic;
    TOPICS.push(topic);
    return topic;
  });
  BY[ch.id] = ch;
  return ch;
});

export const KEY_TOOLS = siteMap.keyTools;
// Key tools grouped by type for the Toolbox page.
export const KEY_TOOL_GROUPS = siteMap.keyToolGroups || [{ label: '', tools: KEY_TOOLS }];

export const TOOL_GROUPS = siteMap.toolbox.map(g => ({
  label: g.group,
  items: g.tools.map(t => {
    const tool = { ...t, group: g.group, isTool: true, sub: t.subtitle, rhythm: t.rhythmRow, pocket: t.pocketCard };
    BY[tool.id] = tool;
    TOOLS.push(tool);
    return tool;
  }),
}));

// Placeholder sections are flagged in playbook.json.
TOOLS.forEach(t => { const s = secOf(t); if (s && s.placeholder) t.note = 'Placeholder'; });

export function secOf(t) {
  const ref = t && t.contentRef;
  if (!ref || !ref.part || !LIB[ref.part]) return null;
  const secs = LIB[ref.part].sections;
  if (ref.sectionId) return secs.find(x => x.id === ref.sectionId) || null;
  if (ref.sectionIndex != null) return secs[ref.sectionIndex] || null;
  return null;
}

export const isKeyChapter = ch => /^key/.test(ch.tier);
export const isKeyTool = t => KEY_TOOLS.includes(t.id) || /^key/.test(t.tier);

export function tierOf(item) {
  if (!item) return null;
  const tool = !!item.isTool;
  const key = tool ? isKeyTool(item) : isKeyChapter(item);
  return key
    ? { label: 'Key element', hint: tool ? 'Use every week' : 'Read and know', bg: '#00638E', fg: '#fff' }
    : { label: 'For inspiration', hint: 'Draw on when needed', bg: '#D6B874', fg: '#142850' };
}

const wordsOf = sec => sec ? strip([sec.title, ...[sec.intro, ...sec.subs.map(s => s.blocks)].flat().map(b => [b.h, ...(b.items || []).map(x => typeof x === 'string' ? x : Object.values(x).join(' ')), ...(b.rows || []).flat()].join(' ')), ...sec.subs.map(s => s.title)].join(' ')).split(/\s+/).length : 0;
export const minsOf = t => { const sec = secOf(t); return sec ? Math.max(2, Math.round(wordsOf(sec) / 220)) : 5; };

export function rhythmTable() {
  const cw = LIB['commercial-wheel'];
  const sec = cw && cw.sections.find(x => x.id === 'four-instances');
  const sub = sec && sec.subs.find(x => x.title === 'The minimum commercial rhythm');
  return sub ? sub.blocks.find(b => b.t === 'table') : null;
}
export function rhythmRow(tool) {
  const rt = rhythmTable();
  return rt && tool.rhythm ? rt.rows.find(x => strip(x[0]) === tool.rhythm) || null : null;
}
// "Monthly · 90 minutes", or the subtitle, or the kind.
export function toolMeta(t) {
  const r = rhythmRow(t);
  return r ? strip(r[1]).split(';')[0] + ' · ' + strip(r[2]) : t.sub || t.kind;
}

export function qbCats() {
  const tb = LIB['shared-toolbox'];
  if (!tb) return [];
  const s = tb.sections;
  return [{ title: s[0].title, blocks: s[0].intro.concat(...s[0].subs.map(x => x.blocks)) }, ...s[1].subs];
}

// Routes
export const chapterPath = ch => `/read/${ch.id}`;
export const topicPath = t => `/read/${t.ch.id}/${t.id}`;
export const toolPath = (t, view) => `/toolbox/${t.id || t}` + (view ? `?view=${view}` : '');
export const pathOf = item => item.isTool ? toolPath(item) : item.isChapter ? chapterPath(item) : item.link ? toolPath(item.link) : topicPath(item);

export const W = ['92%', '74%', '86%', '62%', '80%', '68%', '88%', '56%'];

// Pocket cards: one per tool with a pocketCard index.
export const POCKETS = TOOLS.filter(t => t.pocket != null).sort((a, b) => a.pocket - b.pocket).map(t => ({ name: t.title.replace(/ (meeting|guide)$/, ''), tool: t.id }));
