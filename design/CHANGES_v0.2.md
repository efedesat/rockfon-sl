# Rockfon Sales Leadership Playbook: changes in v0.2

This package records what changed in the design prototype after the v0.1 handoff. The live build is in `efedesat/rockfon-sl`. The v0.1 README is included as `README_v0.1.md`. Everything it says still holds unless this file says otherwise.

## In this package
- **Prototype:** `prototype/Playbook Prototype v5.dc.html` is the clickable v0.2 reference, which superseded v4. All inline styles in it are the visual spec. It loads `prototype/content/playbook.js`.
- **Offline copy:** `prototype/offline/Rockfon Sales Leadership Playbook v0.2.html`, the same prototype as a single file.
- **Content:** `content/playbook.json`, the complete v0.2 text. Several parts are new; they are listed under "Content model" below.
- **Site map:** `content/site-map.json`, regenerated from v5. It also includes the deal room dimensions with their verdicts, and the dashboard pages with their elements.

All copy in `playbook.json` was written or approved by the playbook owner. Editorial changes made during this round are noted below.

---

## 1. Meeting cockpit
This applies to the four meetings: 1:1 Pipeline and Opportunity, 1:1 Account, 1:1 Visit and Activity, and Team Pipeline and Opportunity.

**Each agenda point** in the "During" view now has three parts:
- **Purpose:** one statement of what the point is for.
- **Data to look at:** 1–5 items, each naming a dashboard view such as "Pipeline · Opportunity table, sorted by newest". When an item matches a dashboard element, an "Open in the dashboard →" link opens the Dashboard guide on that element.
- **Questions to ask:** short questions, one per line, in large type. Tapping a question marks it as asked by dimming it.

The existing timer, the agenda timeline and the notes for each point are unchanged.

**Meeting with:** a bar at the top of the cockpit, on every tab, with name and email fields. Both are optional and stored per meeting.

**Finish and review notes:** a button in the clock bar that pauses the clock and opens the After tab.

**Meeting notes card**, at the top of the After tab:
- The meeting title, date and who the meeting was with.
- Every agenda point that has notes. Deal room points also show the opportunity name and the scored dimensions.
- A "Send to" email field.
- **Email the notes:** a `mailto:` link with subject "{meeting} · {date}" and the notes as plain text in the body.
- **Copy notes.**
- **Clear notes for this meeting:** asks for confirmation, then removes that meeting's notes and deal room scores.

Follow-up in the content now runs through these emailed notes. The leader sends them straight after the meeting, and the salesperson replies with corrections by the next working day. This replaced "draft action list / confirm the action record" in every Before/After list and in the shared operating rules.

## 2. Instructions tab
Every agenda point now has real content for "How to run this part" (2–4 steps) and "Watch for" (1–2 pitfalls). The steps refer to the cockpit, the dashboard views and the deal room as they now work.

The Before and After steps gain an "In the playbook" box with three steps on using the cockpit. Its text lives in `cockpitPhases`.

## 3. Must-Win Deal Room
The deal room now runs inside the 1:1 Pipeline and Opportunity cockpit, at the agenda points "First selected opportunity" and "Second selected opportunity". At those points the panel shows the deal room instead of the data box. Scores are stored per meeting and agenda point. The standalone tool page (`tk-winroom`) shows the same deal room under its guide text.

**How it works:**
- **Dimensions:** five, which are final: Need or pain, Right solution, Access to power, Decision process and Momentum.
- **One question per dimension:** "Do we know the pain or need, like fire, light or access to the plenum?", "Do we have a solution that fits the need well at a competitive price?", and so on.
- **Score:** a current score from 1 to 4 on the scale Unknown / Partly supported / Confirmed / Tested through action.
- **Verdict:** choosing a score shows a short verdict for that score. The verdict text is in `site-map.json` → `dealRoom`.
- **Radar chart:** builds as the dimensions are scored, with a focus line naming the one or two weakest dimensions.

**The required position is removed entirely,** from the user interface and from all content. Nothing in the playbook refers to a "required", "target" or "needed" score. In the content, "evidence profile" in meeting steps became "deal room scores". In the deal room's 20-minute plan, the step is now called "Scores and verdicts".

## 4. Dashboard guide (Toolbox → Dashboards)
This replaces the old screenshot-and-hotspot placeholder with a wireframe of the three dashboard pages. It exists because Power BI will not be ready at launch. The page carries the tag "Wireframe until Power BI is ready".

**Every page shows:**
- The page question.
- A context strip: owner or team, market, period, currency and refresh time.
- Numbered elements. Clicking one selects it and fills an explanation panel below with what the element shows and **every meeting agenda point that uses it**. That list is worked out from the "Data to look at" items, and each entry opens the cockpit at that point.
- A colour key: blue outline means needs a decision, red means overdue, grey means unknown data.

**Pipeline: "Where should we intervene?"**
1. **Top line:** open opportunities, known open Rockfon value, and opportunities with unknown value.
2. **Quarter runway:** expected Rockfon value per delivery quarter plus Unallocated. The split switches between vertical and product mix (tile-only, grid-only, tile-and-grid).
3. **Velocity:** four tiles against last period (open opportunities, average value, win rate, cycle length), each with a "Watch:" hint.
4. **Opportunity table:** one table, which replaced the separate "Act now" tabs and the "Since last review" strip in the original spec.
   - **Sort:** last updated, newest or biggest.
   - **Show:** open, won or lost. Won and lost show the reason.
   - **Pinned rows:** the two coaching opportunities stay at the top.
   - **Flags in the row:** "No next step", "Stalled" and "Overdue".

**Accounts: "Where should we change our attention?"**
1. **Portfolio coverage grid:** with a switch between A and in-scope accounts and the complete portfolio.
2. **Effort by segment:** shown at segment level first, with business and pipeline per segment beside it. Unclassified and unlinked time stay visible.
3. **Due list.**

**Visits & activity: "Is the next fortnight workable?"**
1. **Meetings per week:** the last four weeks held (solid) and the next four booked (dashed).
2. **Two-week calendar.**
3. **Coverage due.**
4. **Completed activity.**
5. **Visit map:** the next two weeks' bookings by location, with a filter for both weeks, this week or next week.

The visit map replaced the fortnight capacity bar from the spec, which depends on data Rocksell and Outlook do not hold.

**Gaps against the original Power BI spec, as discussed with the owner:**
- Won and lost reasons need a field in Rocksell. Win rate and cycle length need won and lost dates.
- The visit map needs a location on every booking.
- Effort by segment needs segment totals in which each opportunity is counted once.
- A split of meetings into proactive and reactive is optional. If it doesn't exist, the leader asks about it in the meeting.

The sample layout data, and the placeholder names "Vertical 1–4" and "Activity type 1–3", are not real.

## 5. Joint visit guide
Its type changed from `meeting` to `visit`. It is now a single short page with no Overview, Instructions or Cockpit tabs:
- A cadence strip: How often, How long, Who.
- Three steps: Before, During and After the visit.
- Good and Red flags.
- "Open pocket card".

All of it is still placeholder content.

## 6. Chapter 1, The role
**New last topic:** "Driving change through coaching" (`role-change`, `the-role` section index 3). "What it will require from you" moved to section index 2. The chapter intro was updated to match the new order.

**The article** is a motivating piece on using the meeting cadence to govern change. Its key line is "Cadence creates accountability. Questions create ownership." It closes with a short section on why the playbook exists: a base of agreed fundamentals that supports each leader's own style.

**Three new content block types** were added for it, and can be used in any section:
- `{ "t": "statement", "items": ["line", "line"] }`: large display lines between rules.
- `{ "t": "swap", "items": [{ "instead": "…", "coach": "…" }] }`: two-part cards, "Instead of" on grey and "Coach it" on white.
- `{ "t": "pair", "items": [{ "k": "eyebrow", "title": "…", "h": "…" }] }`: two example cards side by side.

## 7. Content edits across meeting guides
- **Format and intended decisions:** each meeting now names its dashboard page and "the notes from the previous meeting".
- **1:1 Pipeline and Opportunity:**
  - The diagnosis text mentions the velocity tiles.
  - The Before list says to check the quarter runway in the dashboard.
- **1:1 Account:** the indicators text starts at segment level.
- **1:1 Visit and Activity:**
  - The routes text points to the visit map.
  - The Before list asks for a location on each customer booking.
- **Team Pipeline and Opportunity:** the inputs and the deep-dive steps refer to the opportunity table and the deal room scores.
- **1:1 Pipeline and Opportunity "Pipeline overview" and Team "Quarter profile":** the Purpose and questions now frame quarter profile commercially, as how much Rockfon value is expected to deliver per quarter, to which building segments and in which product mix.

## Content model additions (`playbook.json`)
```
cockpit: {
  "<meetingId>": {                      // mt-pipe, mt-acc, mt-act, mt-team
    "<agenda topic, exactly as in the meeting's During table>": {
      purpose: string,
      data:    string[],                 // dashboard references; matched to elements by name
      ask:     string[],                 // questions to ask, one per line
      run:     string[],                 // Instructions: how to run this part
      watch:   string[]                  // Instructions: watch for
    }
  }
}
cockpitPhases: { before: string[], after: string[] }   // "In the playbook" box
parts["the-role"].sections[3]                          // new article
```
Deal room dimensions, questions and verdicts are currently constants in the prototype (`DR_DIMS`, `DR_SCALE`). They are mirrored in `site-map.json` → `dealRoom`. The dashboard element definitions are the `DASH` constant, mirrored in `site-map.json` → `dashboard`.

## Device storage added in v0.2
The keys added on top of v0.1:
- `cNotes{meetingId:pointIndex}`
- `cAsk{meetingId:pointIndex:questionIndex}`
- `dr{meetingId:pointIndex}`, holding `{ name, sc{dimensionIndex: 1–4} }`
- `mWith{meetingId}`, holding `{ name, email }`
- `mview{meetingId}`, `tab{meetingId}`, `cSel`, `cFollow` and `clock`
- the dashboard view state: `dashTab`, `dSel`, `rSplit`, `oSort`, `oStat`, `cScope` and `mWeek`

## Discussed for a later version (v2, not part of v0.2)
- **Commitments in the app:** the owner sees the app eventually keeping a record of meeting commitments and sending follow-ups.
- **Logins and storage:** that would need individual sign-in, such as Microsoft single sign-on, and server-side storage.
- **Account and annual plans:** raised as candidates for the app too. Keeping them in Rocksell was suggested, to avoid two sources of truth; this is not decided.

## Remaining placeholders
- Governing and following up on change (the article text).
- Joint visit guide.
- CRM glossary and data requirements.
- The Dashboards intro text.
- Landmines.
- Communication guides.
- Pocket cards.
- Team kit.
- Templates and checklists.
- Leader voices.
