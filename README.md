# BuildResearch — Website

A complete, professional, mobile-first marketing website for **BuildResearch** —
an international strategic research consultancy and think tank.

Design direction: **"The Institute"** — structured authority, navy + gold on a
white background. Typography: *Source Serif 4* (headings) and *Public Sans* (body).

---

## What's here

```
BuildResearch Website/
├── index.html          # Home
├── think-tank.html     # The Think Tank
├── services.html       # Services (Research & Thought Leadership / Consulting / Coaching)
├── portfolio.html      # Portfolio
├── about.html          # About — our story, values & the collective
├── contact.html        # Contact — enquiry form + "what happens next"
├── insight-article.html# Insights ARTICLE TEMPLATE — clone this per article
├── css/
│   └── styles.css      # Full design system (tokens, components, responsive)
├── js/
│   └── main.js         # Mobile menu, scroll animations, parallax, count-up, hero canvas, form
├── assets/
│   ├── favicon.svg     # Brand mark (bar-chart motif)
│   ├── logo.svg        # Full lockup logo
│   └── images/         # Themed photography (Unsplash License — free, self-hosted)
├── README.md
└── IMPROVEMENTS.md     # Competitor benchmarking + prioritised roadmap
```

No build step, no dependencies, no framework — it's standards-based HTML5, modern
CSS and a small amount of vanilla JavaScript. This keeps an enterprise marketing
site fast, secure, cheap to host, accessible and easy for anyone to maintain.

---

## Viewing it locally

**Easiest:** double-click `index.html` — it opens straight in your browser.

**Recommended (so fonts/paths behave exactly like production):** run a tiny local
server from inside the folder.

```bash
cd "~/Documents/BuildResearch Website"
python3 -m http.server 8000
# then open http://localhost:8000
```

---

## Features

- **Fully responsive** — mobile-first, with a slide-in hamburger menu under 860px.
- **White background** throughout, with intentional navy and gold feature bands.
- **Real, self-hosted photography** with an on-brand navy duotone treatment and
  hover zoom — no fragile hotlinks.
- **Living hero background** — a lightweight animated "constellation" canvas
  (data/connections motif) instead of a heavy video, so it stays fast on mobile.
  A ready-to-use `<video>` slot is documented in `index.html` if you'd rather drop
  in a real clip.
- **Rich motion** — scroll-reveal (IntersectionObserver), staggered hero entrance,
  subtle parallax, animated count-up statistics, a scroll-progress bar, animated
  nav underlines and a morphing hamburger. All respect `prefers-reduced-motion`.
- **Accessible (WCAG 2.2 AA)** — text contrast tuned to ≥ 4.5:1, `:focus-visible`
  rings, semantic landmarks, skip link, ARIA on the menu and form, keyboard support
  (Esc closes the menu), and full reduced-motion fallbacks.
- **Performance-minded** — preloaded hero image, lazy-loaded photography,
  `aspect-ratio` boxes to prevent layout shift, no framework or build step.
- **SEO-ready** — per-page titles/descriptions, Open Graph tags + image, SVG favicon.
- **Contact form** with inline validation and a friendly confirmation.

See **`IMPROVEMENTS.md`** for how this site benchmarks against the best research /
think-tank sites in the world (JRF, IFS, Chatham House, CSIS, McKinsey…) and a
prioritised roadmap to stay ahead.

---

## Going live

### 1. Make the contact form send real emails
The form currently validates and shows a confirmation message client-side (no data
leaves the browser). To receive submissions, use a no-backend form service such as
[Formspree](https://formspree.io):

1. Create a form at formspree.io and copy your form ID.
2. In `contact.html`, replace `your-form-id` in
   `action="https://formspree.io/f/your-form-id"` with your real ID.
3. In `js/main.js`, in the contact-form submit handler, remove the
   `e.preventDefault();` line (and the "show success / hide form" block) so the
   browser posts to Formspree — or keep the JS and switch to a `fetch()` POST if
   you'd prefer to stay on the page.

### Publishing an insight / article
`insight-article.html` is a ready-made long-form template (drop cap, subheads,
pull quotes, key-takeaways callout, author card, tags, related insights). To add
an article: copy the file, rename it (e.g. `insights/your-slug.html`), and edit
the title, hero, image and body. Point the insight cards on the home page at it.

### 2. Update the details
- Email address (`hello@buildresearch.co.uk`) — used on the contact page & footer.
- Social links — `LinkedIn` / `Instagram` currently point to the platforms' home
  pages; swap in your real profile URLs.
- Replace the placeholder portfolio cards (`[ add a project ]`) with real case
  studies and images. Project image slots use a 4:3 ratio.

### 3. Deploy
Drag the folder onto **Netlify Drop**, push to **GitHub Pages**, or upload to any
static host / your existing `buildresearch.co.uk` hosting. No server runtime needed.

---

## Brand reference

| Token            | Value     | Use                              |
|------------------|-----------|----------------------------------|
| Navy 900         | `#14223B` | Headings, footer                 |
| Navy 800         | `#16243F` | Header, feature bands, buttons   |
| Gold 500         | `#C8924A` | Accents, CTAs, underlines        |
| Gold 600         | `#B07F39` | Eyebrow labels                   |
| Background       | `#FFFFFF` | Page background (white)          |

Content and the three design directions were imported from the
"Buildresearch website redesign" project on claude.ai/design.

© 2026 buildresearch.co.uk
