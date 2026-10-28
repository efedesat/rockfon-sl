# Rockfon Sales Leadership Playbook

An interactive playbook for Rockfon EA sales leaders, built from the design handoff in [`design/`](design/HANDOFF.md). It is a static React site (Vite) hosted on Vercel, with every page behind a shared password.

## Repository layout

| Path | What it is |
|---|---|
| `content/playbook.json` | **All playbook text.** The source of truth. Edit wording here only. |
| `content/site-map.json` | Navigation: chapters, topics, tools, tiers, photos and where each page's text comes from. |
| `content/templates/` | Author templates from the earlier round (for reference). |
| `src/` | The app. No playbook copy is hard-coded in components. |
| `public/assets/` | Logos and photography. |
| `public/fonts/` | Avenir LT Pro (licensed). |
| `middleware.js` | The password gate (Vercel Routing Middleware). |
| `api/feedback.js` | Receives "Was this page useful?" feedback. |
| `design/` | The original handoff: README (`HANDOFF.md`), clickable prototype, offline copy, design-system tokens. Not deployed. |

## Run it locally

```bash
npm install
npm run dev        # http://localhost:5173 (no password gate locally)
npm run build      # production build into dist/
```

To try the password gate locally as well, use the Vercel CLI: `npx vercel dev` with `PLAYBOOK_PASSWORD` set in `.env.local`.

## Deploy to Vercel

1. In Vercel, **Add New → Project** and import this GitHub repository. Vercel detects Vite; the settings in `vercel.json` cover the rest (build `npm run build`, output `dist`).
2. Under **Settings → Environment Variables**, add:
   - `PLAYBOOK_PASSWORD` (required): the shared password.
   - `AUTH_SECRET` (optional): any long random string, mixed into the cookie signature.
   - `FEEDBACK_WEBHOOK_URL` (optional): see "Feedback" below.
3. Deploy. Every push to the production branch redeploys automatically.

**Changing the password:** edit `PLAYBOOK_PASSWORD` in Vercel, then **Deployments → ⋯ → Redeploy** the latest deployment. No code change is needed. Changing the password signs every device out.

If `PLAYBOOK_PASSWORD` is not set, the site stays locked: the password page is shown and nothing is accepted.

## Password gate: what was used and why

The handoff asks for host-level protection rather than a check in browser code. This build uses **Vercel Routing Middleware** (`middleware.js`), which runs on Vercel before any file is served:

- Without a valid session cookie, every URL (pages, scripts, images, API) returns the password page, with status 401. Only `robots.txt` is public.
- The right password sets an HMAC-signed, `HttpOnly`, `Secure` cookie that lasts **30 days**, and returns the user to the page they originally asked for.
- The password page has no logo, no brand name, the neutral title "Sign in", no favicon, and `noindex, nofollow`.
- `robots.txt` disallows everything and every response carries `X-Robots-Tag: noindex, nofollow`.

Vercel's own Password Protection (a paid add-on) would also work and could replace the middleware; it cannot be styled to the handoff's unbranded page.

## Editing content

- Change text in `content/playbook.json`, commit and push. Vercel rebuilds the site.
- Missing content shows as grey placeholder bars. A section with `"placeholder": true` shows a "Placeholder" tag on its tool page.
- Meeting guides are read from sub-section titles: "Format and intended decisions", "Before the meeting", "During the meeting" (agenda table with Minutes / topic / questions), "After the meeting", "What good looks like and red flags". Frequency and duration come from the "The minimum commercial rhythm" table in "Four instances". Keep these titles stable.
- **Cockpit content** (v0.2) is in `playbook.json` → `cockpit[meetingId][agenda topic]` with `purpose`, `data`, `ask`, `run` and `watch`. The agenda topic must match the meeting's During table exactly, otherwise that point shows grey bars. Each point shows its `purpose`; a small "Data to look at →" button switches the same box to the `data` lines. A `data` line that names a dashboard element (for example "Pipeline · Opportunity table, sorted by newest") gets an "Open in the dashboard →" link. `cockpitPhases.before/after` fills the "In the playbook" box on the Before and After steps.
- **Must-Win Opportunity Deep-dive:** dimensions, questions, scale and verdicts are in `site-map.json` → `dealRoom`. It runs inside the 1:1 Pipeline cockpit at the two "selected opportunity" points and on the Must-Win Opportunity Deep-dive tool page. There is no required score.
- **Dashboard guide:** page questions and element texts are in `site-map.json` → `dashboard`. The wireframe's sample layout is not real data. Clicking an element explains it in the side column; cockpit "Data to look at" lines that name an element link to it.
- Extra block types for any section: `statement` (large display lines), `swap` ("Instead of / Coach it" cards), `pair` (two example cards), `levers` (cards with a key, title, text and questions), `formula` (one line of terms and operators) and `runway` (stacked bars per delivery quarter with buttons to switch the breakdown; `open: true` marks the unallocated column).
- The v0.2 design changes are recorded in `design/CHANGES_v0.2.md`; `design/prototype/Playbook Prototype v5.dc.html` is the current reference.
- Structure (chapters, topic order, tiers, photos, tool types) lives in `content/site-map.json`. `keyTools` sets which tools are Key element; `keyToolGroups` sets how they are grouped on the Toolbox page (Bilat meeting guides, Team meeting guides, Coaching methods, CRM guides, Change management guides). For v0.1 the toolbox entries there also carry a few display settings from the prototype: `aka`, `format`, `accordion` and `files`.
- `src/settings.js` → `storyPages: false` shows the story topic as an ordinary article.

## Training cases (roleplays)

The Dashboards tool page has a **Show** row: *Wireframe* (the default) or *Training case: Daniel / Sofia / Jonas*. A case opens its own page (Pipeline, Accounts, Visits & activity) and fills the existing elements with fictional figures, with a gold "Training data" label in the report bar. Deep links open a case directly: `/toolbox/tk-dash?case=daniel`, `?case=sofia`, `?case=jonas`.

All case data lives in `content/training-cases.json`. Totals shown on screen (top line, runway, average value, segment counts, due list, activity summary) are calculated from the rows, so editing a row keeps them consistent. Dates are written relative to `asOf`. Nothing here touches live data or the cockpit.

## Versions and "What's new"

`content/changelog.json` holds the stage (for example "Beta") and the releases, newest first. The home page footer shows the stage, the newest version and its date, and links to `/changelog`, which lists every release. To publish a new version, add an entry at the top of `releases` with `version`, `date` (YYYY-MM-DD) and `groups` of short, reader-facing lines.

## Large screens

The design is sized for laptops and tablets. From 1440px wide the whole layout scales up in proportion (1.04× at 1440, 1.08× at 1600, 1.12× at 1880, 1.2× at 2400), so pages fill more of the screen while line lengths stay readable. The steps are in `src/styles.css` (`--z`).

## Routes

`/` · `/guide` · `/read/{chapterId}` · `/read/{chapterId}/{topicId}` · `/toolbox` · `/toolbox/{toolId}` (meeting guides accept `?view=overview|instructions|cockpit`). Ids are the ones in `site-map.json`, so links shared in Rocksell, Teams or email keep working when titles change.

## Personal data

Notes, self-check answers, checklist ticks, tracker dots, record entries, cockpit notes, asked questions, deep-dive scores, "Meeting with" name and email, and the chosen meeting view are stored in the browser's `localStorage` (keys prefixed `slp:`). They leave the device only when the user chooses to: emailing or copying meeting notes, or sending feedback. "Clear my notes" in the Contents overlay removes them all; "Clear notes for this meeting" on a cockpit's After tab removes one meeting's notes and deep-dive scores.

## Analytics

Vercel Web Analytics (`@vercel/analytics/react` in `src/main.jsx`) counts page views per route, without cookies. Turn it on in Vercel under **Project → Analytics → Enable**; until then the script does nothing. Personal notes and scores are never part of it.

## Phased launch: hiding content

On `/admin/visibility` (same admin password as the feedback page) you can hide any chapter, topic or Toolbox tool, then press **Save**. The list is stored in the same Redis store (`playbook:visibility`) and read by `/api/visibility` when the playbook loads, so leaders see the change the next time they open or reload it. No setup is needed beyond the feedback store.

- Hidden items disappear from the home page, Contents, the guide, chapter pages, the Toolbox, search, "Keep reading" and links inside articles; their URLs show "Page not found".
- Hiding a chapter hides all its topics (each topic keeps its own setting for when the chapter returns). Meeting cards in Routines follow their Toolbox tool.
- Chapters keep their original numbers, so references such as "Chapter 4, Routines" stay valid.
- It is a soft hide for focus, not access control: the text is still in the app and in this repository.

## Feedback

The feedback card posts `{ page, title, answer, name, comment }` to `/api/feedback`. Each entry is written to the Vercel function log, saved in a Redis store when one is connected, and forwarded to `FEEDBACK_WEBHOOK_URL` when that is set.

**Reading feedback:** open `/admin/feedback` on the site (it isn't linked anywhere) and enter the admin password. It lists every entry with filters and a CSV download. One-time setup in Vercel:

1. **Storage → Create Database → Upstash → Redis** (free plan), and connect it to this project. That adds `KV_REST_API_URL` and `KV_REST_API_TOKEN`.
2. **Settings → Environment Variables:** add `ADMIN_PASSWORD`. Use a different password from the site password, which every leader knows.
3. Redeploy.

Only feedback sent after step 1 is stored; earlier entries exist only in the function log.

## Open items (from the handoff)

- Fonts: Avenir LT Pro is in `public/fonts/` (Book, Oblique, Medium, Black), served only behind the password. With those four files the design's weights map 400 → Book, 500–600 → Medium, 700–800 → Black. Adding Avenir LT Pro **Heavy** (85) would match the 700/800 headings more closely. The password page uses Mulish because the fonts sit behind the gate.
- Feedback destination, Rocksell deep links and dashboard screenshots.
- Content placeholders listed in `design/HANDOFF.md` → "Known gaps in v0.1".
- Photo usage rights and high-resolution originals.
