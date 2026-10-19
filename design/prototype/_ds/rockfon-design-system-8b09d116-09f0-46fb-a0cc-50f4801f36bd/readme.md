# Rockfon Design System

A brand & UI design system reconstructed from the official **Rockfon PowerPoint template** (`uploads/Rockfon PowerPoint template.pptx`). It captures Rockfon's colours, typography, logo lockups, photography style and slide layouts, and packages them as reusable tokens, components, a slide kit and a marketing UI kit.

## Company context

**Rockfon** makes acoustic **stone wool ceilings and wall panels** for buildings — schools, offices, hospitals, retail. It is part of the **ROCKWOOL Group** (a Danish industrial group), and its communications always carry the endorsement line *"Part of ROCKWOOL Group."* The product story is about **sound, light, wellbeing and sustainable, beautiful interiors** — so the brand leans on warm, light-filled architectural photography of real interior spaces, paired with a clean, corporate, ROCKWOOL-family blue.

The brand voice is **professional, calm and confident** — B2B addressed to architects, specifiers, contractors and facility owners.

### Source material
- `uploads/Rockfon PowerPoint template.pptx` — official 16:9 corporate template (extracted to `assets/source/`). Slide size 13.333"×7.5" (1280×720). 41 master layouts: Cover A–C, Agenda A–D, Breaker A–H, Title & Content, Two/Three Content, Picture layouts, Report (8-content), Editorial, Infographic, Quote A/B, Outro, Title Only, Blank.
- Theme face: **Avenir Next LT Pro**. Theme accent1 = **#00638E** (Rockfon Blue).
- No codebase or Figma was provided. The product-website UI kit here is an *informed reconstruction* in the brand's visual language, not a 1:1 copy of rockfon.com.

---

## CONTENT FUNDAMENTALS

How Rockfon writes.

- **Voice:** professional, measured, benefit-led. Speaks to professionals (architects, specifiers, building owners) — the reader is "you", Rockfon is "we". Never slangy or playful.
- **Casing:** Sentence case for body and most headings. **UPPERCASE is reserved** for the small footer tag and eyebrow labels (e.g. `CONFIDENTIAL  |  Department name  |  Part of ROCKWOOL Group`), tracked out with letter-spacing.
- **The endorsement line** *"Part of ROCKWOOL Group"* appears on virtually every slide footer — it is a fixed brand asset, not optional copy.
- **Brand name:** always "Rockfon" (capital R only) with the ® on the logo lockup. The parent is "ROCKWOOL" in full caps.
- **Tone examples (typical of the brand):** "Sound solutions for better learning." · "Beautiful ceilings that protect people from noise." · headlines are short, declarative, outcome-focused.
- **Emoji:** never. **Iconography over emoji.** Numbers/stats are used sparingly and always in service of a real claim (acoustic performance, sustainability) — no decorative data.
- **Vibe:** Scandinavian-corporate. Spacious, orderly, optimistic, quietly premium. Restraint over flourish.

---

## VISUAL FOUNDATIONS

- **Colour:** Anchored by **Rockfon Blue `#00638E`** (primary, used for the slide title colour and the logo) and **deep navy `#142850`** (cover bands, breaker backgrounds, footers). Neutrals are a cool ROCKWOOL grey family (`#63666A`, `#B1B2B4`, `#D8D9DA`) on white. A secondary "expressive" palette — **sand `#D6B874`, sky `#45A6DE`, teal `#1AB092`, coral `#FF7768`, yellow `#EBEA79`, red `#D20014`** — is used sparingly for infographics, data and editorial accents. The overall page is **white-dominant**; colour is applied in confident blocks, not gradients.
- **Type:** **Avenir Next LT Pro** throughout (substituted with **Mulish** here — see Caveats). Geometric-humanist sans, rounded, friendly-but-corporate. Bold weights for the rounded "Rockfon" wordmark feel. Slide titles 28pt in Rockfon Blue; body 18/16/14pt in grey/ink; footer ~8pt.
- **Backgrounds:** Mostly **flat white** or **flat navy** (breakers/covers). **Full-bleed interior photography** is the hero device — warm, naturally-lit real spaces (offices, schools) with wood, soft furniture and Rockfon ceilings visible. No gradients, no textures, no hand-drawn illustration. A dark navy band anchors the logo + footer over photos.
- **Photography vibe:** warm, bright, airy, **natural daylight**; wood tones + soft neutrals + occasional tan/cognac leather. Architectural, aspirational, lived-in but tidy. Never cold or clinical.
- **Layout:** strict, architectural grid. Logo bottom-left or in a navy band; footer tag + page number + date along the bottom edge. Generous margins and whitespace. Content aligns to a clear column structure.
- **Corner radii:** **tight** — squares and crisp rectangles dominate (the logo itself is a hard square). Cards use small radii (0–6px). Pills only for tags/chips.
- **Borders:** thin **1px hairlines** in light grey; a 2px blue accent for emphasis/active states.
- **Shadows:** soft, low, cool-blue-tinted (`rgba(20,40,80,…)`); used subtly on cards and overlays — never heavy drop shadows.
- **Animation:** restrained. Quick, functional fades and slides (120–320ms) on a standard ease. No bounce, no playful spring. Reduced-motion friendly.
- **Hover states:** primary actions darken the blue (`#00547A`); subtle elements lift with a shadow or shift to the cloud tint. **Press:** darker still (`#00466A`), no scale-down gimmicks.
- **Transparency/blur:** used only for photo overlays — a navy scrim or gradient to protect white text over imagery. Not a decorative glassmorphism system.
- **Cards:** white surface, hairline border or soft shadow (rarely both), tight radius, square photography on top.

---

## ICONOGRAPHY

- The PowerPoint template itself ships **no custom icon set** — its "icons" in the user-guide slides were screenshots of PowerPoint's own ribbon (Crop, Layout, etc.), not brand assets, so they are **not** included here.
- Rockfon/ROCKWOOL communications use **simple, single-weight line icons** in Rockfon Blue or grey — geometric, minimal, matching the Avenir feel. There is no proprietary icon font in the source.
- **Substitution:** this system uses **[Lucide](https://lucide.dev)** (via CDN) as the icon set — clean 2px-stroke line icons that match the brand's minimal, geometric character. ⚠ Flagged as a substitution; swap for Rockfon's official icon library if available.
- **Emoji:** never used. **Unicode glyphs** are not used as icons.
- **Logo** is the one fixed brand mark: the blue square with the white twin-peak symbol + the bold "Rockfon®" wordmark. See `assets/`.

---

## VISUAL ASSETS (`assets/`)
- `logo-rockfon-blue.svg` — primary lockup, blue on light backgrounds.
- `logo-rockfon-white.svg` — reversed lockup (blue square mark + white wordmark) for dark/photo backgrounds.
- `logo-rockfon-mark.svg` — the twin-peak symbol alone.
- `photo-office.jpg` — full-bleed warm office interior (hero photography reference).
- `photo-curved.jpg` — sculptural curved acoustic interior.
- `cover-thumbnail.jpeg` — the template's own cover render.
- `source/` — everything extracted verbatim from the .pptx (raw media, including non-brand UI screenshots).

---

## INDEX / MANIFEST

- `styles.css` — global entry (import-only). Consumers link this.
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `fonts.css`.
- `assets/` — logos, photography, source media.
- `components/core/` — reusable UI primitives (Button, Tag, Card, Input, …). See namespace `RockfonDesignSystem_8b09d1`.
- `slides/` — 16:9 sample slide kit (Cover, Agenda, Content, Breaker, Quote, Thank-you).
- `ui_kit_website/` — marketing-website UI kit (informed reconstruction).
- `templates/rockfon-deck/` — copy-and-edit 16:9 presentation template (cover, content, breaker, thank-you).
- Foundation specimen cards (`*.card.html`) populate the **Design System** tab — grouped Type / Colors / Spacing / Brand / Components / Slides.
- `SKILL.md` — Agent-Skill manifest for use in Claude Code.

### Caveats
- **Avenir Next LT Pro is proprietary** and cannot be bundled. Rendered with **Mulish** (Google Fonts) as the nearest match. Upload licensed Avenir Next webfonts to make this exact.
- **Lucide** icons substitute for Rockfon's (unknown) official icon set.
- No codebase/Figma was supplied; the website UI kit reflects the brand language of the template, not a pixel copy of a live product.
