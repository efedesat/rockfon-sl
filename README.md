# Rockfon Sales Leadership Playbook · v0.1

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
- Structure (chapters, topic order, tiers, photos, tool types) lives in `content/site-map.json`. `keyTools` sets which tools are Key element; `keyToolGroups` sets how they are grouped on the Toolbox page (Meeting guides, CRM guides, Change management guides). For v0.1 the toolbox entries there also carry a few display settings from the prototype: `aka`, `format`, `accordion` and `files`.
- `src/settings.js` → `storyPages: false` shows the story topic as an ordinary article.

## Large screens

The design is sized for laptops and tablets. From 1440px wide the whole layout scales up in proportion (1.08× at 1440, 1.15× at 1600, 1.25× at 1880, 1.4× at 2400), so pages fill more of the screen while line lengths stay readable. The steps are in `src/styles.css` (`--z`).

## Routes

`/` · `/guide` · `/read/{chapterId}` · `/read/{chapterId}/{topicId}` · `/toolbox` · `/toolbox/{toolId}` (meeting guides accept `?view=overview|instructions|cockpit`). Ids are the ones in `site-map.json`, so links shared in Rocksell, Teams or email keep working when titles change.

## Personal data

Notes, self-check answers, checklist ticks, tracker dots, worksheet scores, record entries, cockpit notes and the chosen meeting view are stored in the browser's `localStorage` (keys prefixed `slp:`) and never sent anywhere. "Clear my notes" in the Contents overlay removes them.

## Feedback

The feedback card posts `{ page, title, answer, name, comment }` to `/api/feedback`. The destination is still open, so for now each entry is written to the Vercel function log (**Project → Logs**, search for `playbook-feedback`). Set `FEEDBACK_WEBHOOK_URL` to forward entries as JSON to a Teams, Slack or Power Automate webhook.

## Open items (from the handoff)

- Fonts: Avenir LT Pro is in `public/fonts/` (Book, Oblique, Medium, Black), served only behind the password. With those four files the design's weights map 400 → Book, 500–600 → Medium, 700–800 → Black. Adding Avenir LT Pro **Heavy** (85) would match the 700/800 headings more closely. The password page uses Mulish because the fonts sit behind the gate.
- Feedback destination, Rocksell deep links and dashboard screenshots.
- Content placeholders listed in `design/HANDOFF.md` → "Known gaps in v0.1".
- Photo usage rights and high-resolution originals.
