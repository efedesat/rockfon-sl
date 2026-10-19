# Handoff: Rockfon Sales Leadership Playbook · v0.1

## Overview
An interactive playbook for Rockfon EA sales leaders, used on laptop and tablet. It has two halves:

- **Read**: five chapters of leadership content, written to be read and reflected on.
- **Toolbox**: what leaders use during the week. The core is the meeting guides, which leaders run their meetings from (the "cockpit").

English only, with a pointer to the browser's own translate function. Hosting is not decided yet, so the build must work as a static site. **Access must be protected by a password gate** (see "Password gate").

This is **v0.1**: the structure, navigation, page types and the content supplied so far are final for this version. Placeholders that remain are listed under "Known gaps in v0.1".

## Read this first: who writes the text
**The builder must not write, rewrite, shorten or "improve" any playbook copy.** All content is written by the Rockfon playbook team.

- All playbook text lives in `content/playbook.json`. Render it as it is. Do not hard-code it in components.
- Where content is missing, render the grey placeholder bars from the prototype. Never generate filler text.
- Interface labels (buttons, eyebrows, navigation) are listed under "Fixed UI copy". Use them exactly as written.
- The content team should be able to change text by editing content files, without touching code. If you move the content to Markdown, keep a one-to-one mapping with `playbook.json` and do not change any wording.

## About the design files
`prototype/Playbook Prototype v4.dc.html` is the **design reference**, built in HTML. Open it in a browser and click through everything. It is not production code; recreate it in a suitable stack. A static-site generator (Astro, Next.js static export, Eleventy or similar) fits well.

- **Exact values:** every element in the prototype is styled inline, so the source is the spec for sizes, colours and spacing. This README gives the structure, the behaviour and the rules. Where the two disagree, the prototype wins on looks and this README wins on behaviour.
- **Offline copy:** `prototype/offline/Rockfon Sales Leadership Playbook.html` is a single self-contained copy of the same prototype, for reviewers without a server.
- **Rationale:** `prototype/Playbook UX Wireframes.dc.html` records why the playbook is clickable rather than a PDF, and why it avoids LMS patterns.

## Fidelity
**High fidelity for layout, colour, type, spacing and interaction.** Content is real wherever the playbook team has supplied it, and grey placeholder bars elsewhere. Components must handle any text length.

## Design principles (do not break these)
1. **No LMS patterns.** No progress bars, completion percentages, ticks in navigation, "Mark as complete", chapter counters, topic counts or completion pop-ups. The playbook supports learning and doing, not finishing.
2. **Clear about what matters.** Every chapter, topic and tool carries a tier label: *Key element* or *For inspiration*. Leaders should always know what to focus on.
3. **Any key tool within two clicks** from anywhere (header → Toolbox → tool).
4. **The playbook is the place where meetings are run.** Meeting guides have a live cockpit with checklists, an agenda timeline and a timer.
5. **Interactive only where it saves time:** tabs, expand/collapse, checklists, worksheets, a timer. No gamification.
6. **Nothing to install.** Personal data (notes, self-check answers, checklist ticks, worksheet scores) stays in the browser (`localStorage`) and is never sent anywhere.

---

## Password gate (required)
Every page sits behind a password. **The password page must not contain the Rockfon logo, the name "Rockfon", "ROCKWOOL" or any other brand reference**, including the page `<title>`, favicon, meta tags and image alt text. Someone who lands on it should not be able to tell whose site it is. Use only the familiar colours and font.

- **Look:**
  - Full-viewport navy `#142850` background.
  - A centred white card, max 380px wide, radius 4px, padding 32px, soft shadow `0 8px 28px rgba(0,0,0,.25)`.
  - Font: the same as the playbook (Avenir Next LT Pro, or the Mulish stand-in).
  - Heading "Enter password" (24px/800, `#142850`).
  - One password field (height 44px, 1px `#D8D9DA` border, radius 3px, focus ring `#45A6DE`).
  - A full-width primary button "Continue" (`#00638E`, hover `#00547A`, height 44px).
  - Error text under the field in `#D20014`: "That password isn't right. Try again."
  - Nothing else on the page.
- **Page metadata:** neutral `<title>` "Sign in"; no favicon (or a plain navy square); `<meta name="robots" content="noindex, nofollow">`.
- **Behaviour:**
  - Enter submits.
  - After the right password, go to the page the user originally asked for and remember the device for 30 days, so leaders don't retype it before every meeting. Show the password page again only after expiry.
  - Use one shared password that the playbook owner can change without a rebuild, through an environment variable or host setting.
- **Security:** a password check written only in browser code is easy to bypass. Prefer protection at the host (Azure Static Web Apps or Netlify password protection, Cloudflare Access, SharePoint permissions, or a serverless check that sets a signed cookie). If only a static host is available, compare a salted hash and accept the limitation. Record which option was used.
- **Robots:** also serve `robots.txt` with `Disallow: /` and `noindex` on every page.

---

## Information architecture
The full map, with ids, page types, tiers, content references and photos, is in `content/site-map.json`. Build navigation from that file.

```
Password gate
Home
├── How to use this playbook                    (guide page)
├── 01 The role                                 KEY ELEMENT · Read and know
├── 02 Coaching fundamentals                    FOR INSPIRATION · Dip in when useful
├── 03 Sales management model                   KEY ELEMENT · Read and know
│     groups: Commercial priorities and routines · Personal development wheel · Sales coaching program
├── 04 Routines                                 KEY ELEMENT · Read and know
│     Start here (4 topics, incl. the interactive two-wheel diagram)
│     Meeting cards, grouped by Sales development wheel / Personal development wheel
├── 05 Leading change                           FOR INSPIRATION · Dip in when useful
├── Leader voices
└── Toolbox
      KEY ELEMENT · Use every week (7):
        1:1 Pipeline and Opportunity meeting · Must-Win Deal Room · 1:1 Account meeting ·
        1:1 Visit and Activity meeting · Team Pipeline and Opportunity meeting ·
        Personal development meetings · Joint visit guide
      FOR INSPIRATION (folded under "More tools"):
        Coaching questions · Records (4) · CRM glossary and data requirements · Dashboards ·
        Landmines · Communication guides · Pocket cards · Team kit · Templates and checklists · Leader voices
```

**Naming rules:**
- The two wheels are always the **Personal development wheel** and the **Sales development wheel**. Never "commercial wheel", "sales wheel" or "development wheel".
- The CRM is always called **Rocksell**.
- Chapter titles are in sentence case.

---

## Global layout
- **Frame:** a full-viewport app with a fixed **60px header** and a scrolling `main` below it.
- **Breakpoint:** narrow below 1000px (tablet).
- **Max widths:** articles 760px, tool pages 900px, Toolbox and guide 1080px, home grid 1120px.

### Header (all screens)
- Navy `#142850` with white text. Left: the Rockfon white logo, which goes to Home.
- Right, in this order:
  - **Tabs:** "Read" and "Toolbox". Read is active on Home, the guide, chapter and topic pages; Toolbox is active on the Toolbox and tool pages.
  - **Search:** results show "Read · {chapter}" or "Toolbox" above the title. Empty state: "Nothing matches this search."
  - **Translate button:** a globe icon with "EN". It opens a 300px white popover:
    - Title "Read in your language".
    - "The playbook is written in English. Use your browser to translate it."
    - Two numbered steps: "Right-click anywhere on the page." and "Select **Translate** and choose your language."
    - A footnote: "On a tablet, use the browser menu and look for Translate. Machine translation may not be exact."
  - **Contents:** a menu icon with "Contents".

### Sticky back button
A white pill (radius 999px, soft shadow) with an arrow and the destination name, sticky at the top-left of `main` (16px/20px insets) so it stays visible while scrolling.
- Chapter and guide pages → "All chapters".
- Topic → "{chapter}".
- Tool → "Toolbox", or the chapter it was opened from.

Pages leave about 80px of top padding so the pill never covers a heading.

### Tier label
Shown at the top of every chapter, topic and tool page, above the eyebrow. Clicking it opens "How to use this playbook".
- Pill (10.5px/800, uppercase, letter-spacing .12em, `white-space: nowrap`): **Key element** = `#00638E` with white text; **For inspiration** = `#D6B874` with navy text.
- Hint text beside the pill (12.5px/700): "Read and know" (key chapters), "Use every week" (key tools) or "Dip in when useful" (everything else).
- Topics inherit their chapter's tier. The mapping is in `site-map.json`.

### Contents overlay
- **Header:** title "Contents" and a "How to use this playbook →" link (sand `#D6B874`).
- **Chapters:** a column per chapter with "CHAPTER n" and the title. Each lists its **first 4 topics** only, then "All {n} topics →", which opens the chapter page.
- **Toolbox:** only the 7 key tools as pills, then "See all tools →".

### Feedback (all screens)
- **Button:** fixed bottom-right, a white "Feedback" button.
- **Card:** "Was this page useful?", the page name, "Yes" / "Not really", an optional comment and "Send feedback".
- **Confirmation:** "Thanks, your feedback was sent" in teal `#1AB092`.
- **Destination:** to be decided. Send the page id, the answer and the comment.

---

## Screens

### 1. Home
Full-height navy area.
- **Top:** eyebrow "SALES LEADERSHIP PLAYBOOK", H1 "Sales Excellence", intro "Developing people and leading change in Rockfon EA sales." and a white button "How to use this playbook →". On the right, only if the user has read a topic before, a "Pick up where you left off" card.
- **Tile grid ("ceiling grid"):** 4 columns. Rows are `minmax(150px, auto)` (130px narrow), so tall titles can grow the row instead of overflowing. Gap 4px over `rgba(255,255,255,.12)`.
  - 01 The role: 2×2, photo with scrim.
  - 02 Coaching fundamentals: 2×1, `#00638E`.
  - 03 Sales management model: 1×1, `#00547A`.
  - 04 Routines: 1×1, `#1E3A66`.
  - 05 Leading change: 2×1, photo with scrim.
  - Leader voices: 1×1, `#1E3A66`, with a play circle.
  - Toolbox: 1×1, sand `#D6B874`, eyebrow "USE", subtitle "Guides, cards, glossary".
- **Tile text:** every chapter tile has a two-digit number ("01"), the tier on its own line ("KEY ELEMENT" / "FOR INSPIRATION"), then the title at **22px/800/1.15**. All tiles use the same title size and padding (20px 24px). There are no topic counts and no word "Chapter" on tiles.
- **Footer:** "ROCKFON EA | PART OF ROCKWOOL GROUP".

### 2. How to use this playbook (guide)
- **Header:** eyebrow "START HERE", H1 and an intro paragraph.
- **Three columns**, each with a tier pill, a title, one line of explanation and links to its items:
  - **Read and know** (Key element, top border `#00638E`): chapters 1, 3 and 4.
  - **Use every week** (Key element, top border `#142850`): the 7 key tools.
  - **Dip in when useful** (For inspiration, top border `#D6B874`): chapters 2 and 5, plus "The rest of the Toolbox", which opens the Toolbox with "More tools" expanded.
- **"A GOOD FIRST WEEK":** three numbered steps on `#F2F3F4`.

The intro, column explanations and steps were drafted by the designer for v0.1, and the playbook team may reword them.

### 3. Chapter page
- **Layout:** two columns `5fr / 7fr`. The chapter photo on the left is sticky and full height.
- **Header:** tier label, "CHAPTER n", H1 and a one-sentence intro.
- **Topic rows:** number, title, "{n} min read" and an arrow, grouped under the group headings from `site-map.json`.
- **Related tools:** pills under "RELATED IN THE TOOLBOX".
- **Routines** (chapter 4) has a special layout:
  - "START HERE": the 4 numbered starter topics.
  - Meeting cards in two groups, "Sales development wheel" and "Personal development wheel". Each card shows the meeting's title, frequency and duration from the minimum-rhythm table, and opens the tool.
  - "GO DEEPER" appears only when the chapter has further topics.

### 4. Topic page
- **Article (default):** a 440px photo cover with scrim, the tier label, eyebrow "CHAPTER n · {chapter}", H1 and reading time. The body renders the section from `playbook.json`:
  - Block types `p`, `ul`, `ol`, `table` and `quote`.
  - Sub-sections become H2s with an "In this topic" jump list.
  - Inline links to tools become link cards.
- **Story:** used for "What it means to be a sales leader at Rockfon".
  - Opener: the title and opening statement at display size.
  - Body: numbered ideas that come into focus as the reader scrolls, beside a sticky image panel that cross-fades.
  - Respect `prefers-reduced-motion`.
  - A site setting, `storyPages: false`, renders it as an Article instead.
- **Modules** embedded in specific topics:
  - **wheels** ("Run connected personal development and sales development wheels"): an interactive two-wheel diagram with three segments per wheel, labelled "Personal development wheel" and "Sales development wheel". Choosing a segment shows its detail panel. Prompt: "SELECT A PART OF EITHER WHEEL".
  - **four instances** ("Four instances"): meeting tabs with each meeting's rhythm and a year view of the minimum commercial rhythm, plus a link card to the tool.
  - **expect** (Expectations): two cards, for sales leaders and for sales reps.
  - **selfcheck** (What it will require from you): statements, each rated with 1–5 buttons. Answers stay on the device.
  - **tracker** (Governing and following up on change): a team × measure grid of status dots that cycle green → sand → red.
- **Topic end:** "PAUSE AND REFLECT" notes saved on the device, a "TAKE IT TO YOUR TEAM" link to the related tool, and "KEEP READING" (next topic, then "NEXT CHAPTER", then "WHEN YOU NEED IT" → Toolbox). There is no completion button.

### 5. Toolbox
- **Header:** H1 "Toolbox", "Guides and tools for your week. Open one before a meeting or visit." and the "Pick up" card.
- **Key tools:** the label row "KEY ELEMENT · Use every week: meetings and visits", then **7 cards** in a grid of `auto-fill, minmax(260px,1fr)`, at least 120px tall.
  - Each card has a 3px top bar: blue for commercial meetings, navy for the Must-Win Deal Room, teal `#1AB092` for Personal development meetings, sand for the Joint visit guide.
  - It shows the title, plus the frequency and duration (or the subtitle).
- **More tools:** a toggle, "For inspiration: records, CRM, change guides, downloads ↓" / "Fewer tools ↑", reveals the remaining tools as a compact link list grouped by type.

### 6. Tool pages
- **Shared header:** tier label, H1, a type tag and an optional note tag (for example "Placeholder"). The intro, or grey bars where there is none.
- **Meeting guides** (the 4 commercial meetings and the Joint visit guide) have **three views**, switched by a segmented control at the top:
  1. **Overview:** "What it is and what good looks like".
     - Facts strip: frequency, minimum duration and core participants.
     - The "Format and intended decisions" text.
     - GOOD and RED FLAGS boxes.
     - Two cards: "Read the instructions" → Instructions, and "Run the meeting" → Cockpit.
     - Buttons: "Print one-pager", "Copy agenda to invite" and "Open pocket card".
  2. **Instructions:** "How the meeting should be run".
     - "HOW THE MEETING FLOWS": a row of steps from "Before the meeting", through each agenda point, to "After the meeting". It shows 5 steps at a time (4 on narrow screens) with **arrow buttons on both sides**, not a scrollbar, and a counter such as "1–5 of 9 parts".
     - A detail card for the chosen step, with Previous/Next. Agenda steps show the questions and decision plus placeholders for "How to run this part" and "Watch for". Before/After steps list the tasks with their owner.
     - On the last step: "Open the cockpit →".
     - "More on this meeting" (the remaining guide text) sits below.
  3. **Cockpit:** "Run it live".
     - Tabs: Before / During / After.
     - Before and After are checklists with an Everyone / Salesperson / Sales leader filter.
     - During:
       - **Clock bar** (navy): elapsed time "of {total}", the current point, "Start meeting" / "Pause" / "Resume" and "Reset". The time turns coral when over.
       - **Horizontal agenda timeline:** segments sized by their share of the meeting. Past, current and future points are shaded differently, with a red "now" line.
       - **Point panel:** "POINT n · {min} MIN", the topic, time left, "Questions to ask", "Data to look at" (with an "Open in Rocksell" placeholder), "Deep dive" (placeholder) and per-point notes saved on the device.
       - The panel follows the clock. Choosing another point stops it following; "Follow the clock" brings it back.
- **Personal development meetings:** shown as a document for now (see "Known gaps").
- **Must-Win Deal Room:** a worksheet with an opportunity name and, for each dimension, a current and a required score from 1 to 4 with the gap shown. Saved on the device.
- **Other tool types** (as in the prototype):
  - Question bank, glossary ("Field in Rocksell | Who enters it | When"), dashboard guide (hotspots on a Rocksell dashboard screenshot, "Open in Rocksell"), accordions (Landmines, Communication guides), pocket cards, downloads and Leader voices.
  - The four Records are placeholders.

---

## Interactions & behaviour
- **Routes:** one URL per screen, so pages can be linked from Rocksell, Teams and email. Scroll to the top on navigation.
  - Suggested routes: `/`, `/guide`, `/read/{chapter}`, `/read/{chapter}/{topic}`, `/toolbox`, `/toolbox/{tool}`.
  - Add `?view=overview|instructions|cockpit` for meeting guides.
- **Motion:** transitions of 120–350ms on a standard ease, with no bounce. Primary hover `#00547A`, pressed `#00466A`.
- **Timer:** based on wall-clock time, so it stays correct if the tab sleeps, and it keeps running across view changes.
- **Print:** tool pages print as clean one-pagers, without the header, feedback button or scrims.
- **Accessibility:** real links and buttons with a focus ring in `#45A6DE`, contrast of at least 4.5:1, tab roles on tab sets and `aria-expanded` on accordions.
- **Tablet:** touch targets of at least 44px.

## State
- **Persisted (`localStorage`), and nothing else:**
  - `lastRead`
  - `notes{topicId}`
  - `selfCheck{statement}`
  - `checks{tool:phase:item}`
  - `tracker{team:measure}`
  - `worksheet{dimension}`
  - `cockpitNotes{tool:point}`
  - the meeting view per tool
  - the password-gate expiry
- **Add** a "Clear my notes" link to the Contents overlay.

---

## Content
- `content/playbook.json` is the **source of truth for all playbook text**.
  - Shape: `parts{partId: {title, intro, sections[{id, title, intro[blocks], subs[{title, blocks}]}]}}`.
  - Blocks are `{t: 'p'|'ul'|'ol'|'table'|'quote', …}` with light inline HTML (`<strong>`, `<em>`, links).
  - Parts: `the-role`, `sales-coaching-training`, `sales-coaching-program`, `commercial-wheel` (the sales development wheel and its meetings), `leading-people-through-change` and `shared-toolbox`.
- `content/site-map.json` sets which section appears where. A topic's `contentRef` points at a part and a section, by index or id.
- **Meeting-guide parsing:** meeting guides are read from their sections by sub-section title: "Format and intended decisions", "Before the meeting", "During the meeting" (an agenda table of minutes / topic / questions and decision), "After the meeting", "What good looks like" and "Red flags".
  - The minimum-rhythm table (in "Four instances") supplies frequency and duration.
  - Keep these titles stable, or move to explicit fields.
- `content/templates/*.md`: author templates from the earlier round. Update them to match `playbook.json` if you move to Markdown.

---

## Design tokens
**Colours** (Rockfon design system)
- **Brand:** Blue `#00638E` · hover `#00547A` · pressed `#00466A` · Navy `#142850` · navy tiles `#1E3A66` (hover `#264777`).
- **Neutrals:** Ink `#1A1A1A` · Grey `#63666A` · Mid grey `#B1B2B4` · Hairline `#D8D9DA` · Placeholder `#E4E5E6` · Row divider `#EEEFF0` · Cloud `#F2F3F4` · Hover tint `#F7F8F8`.
- **Accents:** Sand `#D6B874` · Teal `#1AB092` (text `#0E7C66`) · Coral `#FF7768` · Red `#D20014` · Sky `#45A6DE` (focus ring).
- **Scrims:** `rgba(20,40,80,.9–.94)` at the text edge.

**Typography:** **Avenir Next LT Pro** (licensed; get the webfonts from Rockfon). The prototype uses **Mulish** as a stand-in. Weights 600, 700 and 800.
- **Sizes:** Display 40–44/800 · Tool H1 34/800 · H2 24/800 · Tile title 22/800 · Card title 15–18/800 · Body 16–18/400/1.55 · Eyebrows 10.5–11/700, uppercase, letter-spacing .12–.16em.
- **Case:** sentence case everywhere except eyebrows, tier pills and the footer line.

**Shape:** radius 2–4px on cards and inputs, 999px on pills. Shadows: card hover `0 4px 14px rgba(20,40,80,.12)`; popovers `0 8px 28px rgba(20,40,80,.22)`. Spacing uses a 4px base. Icons are Lucide line icons with a 2px stroke.

## Fixed UI copy
Read · Toolbox · Search · Contents · Feedback · EN · Read in your language · Was this page useful? · Yes · Not really · Send feedback · Thanks, your feedback was sent · Nothing matches this search. · SALES LEADERSHIP PLAYBOOK · Sales Excellence · How to use this playbook → · PICK UP WHERE YOU LEFT OFF · KEY ELEMENT · FOR INSPIRATION · Read and know · Use every week · Dip in when useful · START HERE · A GOOD FIRST WEEK · All chapters · All {n} topics → · See all tools → · RELATED IN THE TOOLBOX · GO DEEPER · Sales development wheel · Personal development wheel · SELECT A PART OF EITHER WHEEL · {n} min read · In this topic · PAUSE AND REFLECT · TAKE IT TO YOUR TEAM · KEEP READING · NEXT CHAPTER · WHEN YOU NEED IT · Guides and tools for your week. Open one before a meeting or visit. · For inspiration: records, CRM, change guides, downloads ↓ · Fewer tools ↑ · Overview · Instructions · Cockpit · What it is and what good looks like · How the meeting should be run · Run it live · GOOD · RED FLAGS · Read the instructions · Run the meeting · HOW THE MEETING FLOWS · Open the cockpit → · More on this meeting · Before · During · After · Everyone · Salesperson · Sales leader · Start meeting · Pause · Resume · Reset · Not started · Follow the clock · Questions to ask · Data to look at · Open in Rocksell · Deep dive · Notes for this point · Print one-pager · Copy agenda to invite · Open pocket card · Field in Rocksell · ROCKFON EA | PART OF ROCKWOOL GROUP · **Password page:** Sign in · Enter password · Password · Continue · That password isn't right. Try again.

## Known gaps in v0.1 (content, not build)
- Placeholders: 14 tools and modules, including the four Records, plus the per-agenda-point cockpit content (how to run it, watch for, data to look at, deep dive).
- Personal development meetings doesn't have the three-view guide yet, because its source is written as an article. When the team supplies an agenda table in the same format as the commercial meetings, give it the same three views.
- Rocksell dashboard screenshots and deep-link URLs.

## Assets
- `prototype/assets/`: logos (use the official SVGs in production), `photo-office.jpg` and `photo-curved.jpg` (home tiles) and `photos/` (client-supplied interior photography; the assignments are in `site-map.json`). Check usage rights and get high-resolution originals before launch.

## Files
- `prototype/Playbook Prototype v4.dc.html`: the clickable reference for v0.1. It loads `prototype/content/playbook.js`.
- `prototype/offline/Rockfon Sales Leadership Playbook.html`: a single-file offline copy.
- `prototype/Playbook UX Wireframes.dc.html`: rationale.
- `prototype/_ds/…`: Rockfon design-system tokens and components.
- `content/playbook.json`, `content/site-map.json`, `content/templates/`.

## Open decisions
- Hosting, and therefore how the password gate is enforced.
- Feedback destination.
- Rocksell deep links and screenshots.
- Licensed Avenir Next webfonts.
- Content ownership after launch.
