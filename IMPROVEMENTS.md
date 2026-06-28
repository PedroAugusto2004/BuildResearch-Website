# BuildResearch — Benchmarking & Improvement Roadmap

A working document comparing this site to the best research, consultancy and
think-tank websites in the world — and a prioritised plan to stay ahead of them.

Research date: June 2026. Sources are listed at the end.

---

## 1. Who we benchmarked against

| Organisation | What they're known for online |
|---|---|
| **Joseph Rowntree Foundation (JRF)** | Judged the most accessible charity site in the UK; pared-back, 3-item nav, topic hubs |
| **Institute for Fiscal Studies (IFS)** | Featured-content banner, **interactive tools & calculators**, animated stat counters |
| **Chatham House** | Animated impact statistics ("counting effect"), authoritative editorial |
| **CSIS** | News-led, agenda-setting; rich multimedia — vertical video, infographics, quizzes |
| **Center for American Progress (CAP)** | Topic **hub pages** with summary + key stats + expert profiles + next-step CTAs |
| **Tony Blair Institute** | Photography used for warmth/optimism; subtle scroll & hover animation |
| **McKinsey / BCG** | "Insights" engine front-and-centre; restrained, type-led, premium |

**The pattern across all of them:** the *content and ideas are the star*. They win
on clarity, credibility and accessibility — not visual theatrics. Heavy hero video
and decoration are deliberately avoided because they hurt load speed and Core Web
Vitals. This is the bar we designed to.

---

## 2. How BuildResearch already matches or beats them

| Best-practice pattern (who) | Status here |
|---|---|
| Single, clear above-the-fold focal point (IPS) | ✅ Hero with one headline + one promise |
| Subtle scroll + hover animation (Tony Blair Inst.) | ✅ IntersectionObserver reveals, hover zoom, animated underlines |
| Animated impact statistics (Chatham House, IFS) | ✅ Count-up stats on Portfolio |
| Strategic, warm photography (Tony Blair Inst.) | ✅ Real themed imagery with on-brand navy duotone |
| Insights / thought-leadership engine (McKinsey) | ✅ "From our desk" insights section on the home page |
| Clear next-step CTAs on every section (CAP) | ✅ Gold CTA bands + contextual links throughout |
| Restraint over heavy hero video (2026 perf trend) | ✅ Lightweight animated canvas instead of a multi-MB video |
| **Accessibility as a priority (JRF's edge)** | ✅ WCAG 2.2 AA contrast, visible focus, skip link, keyboard menu, reduced-motion |
| Enterprise design system / tokens | ✅ Full token set (colour, type, spacing, motion) in `styles.css` |

### Accessibility — where we go one better
JRF's reputation is built on accessibility. We've matched the intent and made it
measurable:
- Body, label and muted text colours tuned to **≥ 4.5:1 contrast** on white (WCAG 2.2 AA).
- Bronze accent darkened to `#9A6B2F` so even small uppercase labels pass AA.
- `:focus-visible` rings on every interactive element; Escape closes the mobile menu.
- `prefers-reduced-motion` fully honoured (animations, parallax and the canvas all stop).
- Semantic landmarks, a skip link, ARIA on the nav toggle and form, persistent labels.

---

## 3. Roadmap — to become the most impressive site in the field

Prioritised by impact ÷ effort. ✅ = done in this build.

### Quick wins (hours)
- ✅ Fix header layout; add imagery; animated background; count-up stats; AA contrast.
- ⬜ **Swap in real photography** of the team, clients and work (replace the stock set).
- ⬜ **Real social + email links** and a monitored inbox.
- ⬜ Add `apple-touch-icon` PNG and a `site.webmanifest` for polished mobile bookmarking.
- ⬜ Generate `.webp`/`.avif` image variants (≈30–50% smaller) with `<picture>` fallbacks.

### Differentiators (a few days)
- ✅ **Insights/article template built** (`insight-article.html`) — long-form layout
  with drop cap, pull quotes, key-takeaways, author card, tags and related posts.
  ⬜ Still to do: write 4–6 real articles and a proper insights index page.
- ⬜ **Topic hub pages** (CAP/JRF model): a page per theme — Economics, Finance,
  Society, The Professions — each gathering related research, stats and a CTA.
- ⬜ **Genuine case studies** with the setting → challenge → approach → outcome
  structure already scaffolded on the Portfolio page, plus a measurable result.
- ⬜ **An interactive element** (IFS's signature) — e.g. a short "What kind of research
  help do you need?" guided selector that routes to the right service.
- ✅ **Team/collective scaffold built** (Home + About) with monogram tiles.
  ⬜ Replace with real names, photos and credentials — think tanks live on the
  authority of their people.

### Platform & scale (1–2 weeks)
- ⬜ **Headless CMS** (e.g. Sanity, Storyblok, or WordPress headless) so the team can
  publish insights without touching code. This is what makes the "engine" sustainable.
- ⬜ **Search** across insights and research.
- ⬜ **Newsletter capture** + a simple email programme (turn readers into a pipeline).
- ⬜ **Analytics + consent** (privacy-friendly, e.g. Plausible or Fathom) to learn what
  resonates, plus a lightweight cookie/consent banner if you add tracking.
- ⬜ **Performance budget & monitoring** — keep Largest Contentful Paint < 2.5s; run
  Lighthouse/PageSpeed in CI.

### Authority & trust signals
- ⬜ Client/partner logos (with permission), testimonials with real attribution,
  press mentions, and any rankings or memberships.
- ⬜ Downloadable flagship report (gated or open) as a lead magnet.
- ⬜ Structured data (JSON-LD `Organization`, `Article`) for richer search results.

---

## 4. Honest current limitations

- **Imagery is licensed stock** (Unsplash). Authentic photography of the real team and
  work will lift credibility more than any other single change.
- **Insights, case studies and team profiles are scaffolding/illustrative**, not real
  content yet — they show the structure that should be filled.
- **The contact form is front-end only** until wired to Formspree or a backend
  (2-minute change, documented in `README.md`).
- **No CMS yet** — fine for launch, essential once publishing cadence picks up.

---

## 5. Sources

- [Numiko — Best think tank websites 2026](https://numiko.com/insights/best-think-tank-websites-2026)
- [Figma — Top Web Design Trends for 2026](https://www.figma.com/resource-library/web-design-trends/)
- [Veza Digital — Enterprise Website Design Trends 2026](https://www.vezadigital.com/post/enterprise-website-design-trends-2026)
- [Envato — UX/UI design trends for 2026: calm interfaces, the end of visual theatrics](https://elements.envato.com/learn/ux-ui-design-trends)
- [Sitebuilder Report — Consultant Websites: inspiring examples (2026)](https://www.sitebuilderreport.com/inspiration/consulting-websites)
- [McKinsey — Explore our insights](https://www.mckinsey.com/featured-insights)
