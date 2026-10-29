# AOA Window Solutions — Website Redesign Draft

Client-ready redesign draft for Eric Butler and Trey Orbik. Built from content on [aoawindowsolutionsllc.com](https://aoawindowsolutionsllc.com/).

## Preview locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Live site

**https://boorussia.github.io/aoa-window-solutions-redesign/**

Deployed automatically to GitHub Pages on every push to `main`.

## What's included

### Homepage

- **Hero** with a live hurricane-season chip (days left / days until June 1), trust points, and count-up metrics
- **Brand logo strip** right under the hero, linking to each brand profile
- **About** with one-tap founder call cards
- **Services** — four product cards; each "Estimate my…" link pre-selects that project type in the form
- **How we work** — connected 4-step founder-led timeline
- **Project gallery** — filterable grid (with counts) and a lightbox with prev/next, arrow keys, and swipe
- **Storm-ready** — hurricane-season tracker (season band, peak window, "today" marker) plus code guidance
- **Brand grid** — every manufacturer with "best for", founding year, and HQ
- **Testimonials** — swipeable carousel with dots (draft placeholders until real reviews arrive)
- **FAQ** — accordion, with `FAQPage` structured data for search
- **Service area + storm-code check** — tap a county to see its code zone (HVHZ / wind-borne debris / inland), install-time guidance, and suggested brands; "Send this to Eric & Trey" pre-fills the form
- **Estimate form** via [FormSubmit](https://formsubmit.co/) — name, phone, email, city/ZIP, project-type chips, timeline, inline validation, spam honeypot, and a success state
- **Open-now status** (Mon–Fri 9–5 Eastern) next to the hours
- **Sticky mobile CTA** — Call + Free Estimate bar (hides near the contact section)
- Teal accent on the light/dark themes, scroll progress, parallax hero, reduced-motion support

### Brand & SEO pages

- **9 SEO brand profile pages** with company history, manufacturing, taglines, and Florida relevance
- **Hurricane impact windows guide** at `/hurricane-impact-windows.html`
- Shared header, mobile menu, and footer across every page
- Open Graph + Twitter meta and canonical URLs on all pages; `BreadcrumbList` schema on brand pages
- `sitemap.xml` and `robots.txt` in `public/`
- SVG favicon / header icon (`public/assets/logo.svg`)

## Contact form setup

Leads are sent through FormSubmit to the address in `src/site-config.js` (`FORM_EMAIL`).

1. Update `FORM_EMAIL` to Eric/Trey's preferred inbox before the meeting.
2. Submit a test form once — FormSubmit sends a verification email to that address on first use.
3. After verification, submissions appear inline on the site with no redirect.

## Swapping client content

| Content | File |
|---------|------|
| Gallery projects | `scripts/gallery-data.json` |
| Testimonials | `scripts/testimonials-data.json` (set `"draft": false` on real reviews) |
| Service regions + storm-code zones | `scripts/service-area.json` (`codeZones` lists HVHZ and inland counties; every other county is treated as coastal) |
| FAQ | `scripts/faq-data.json` |
| Brand profiles | `scripts/brands-data.json` → run `npm run brands` |

Gallery images live in `public/assets/gallery/`. Paths in `gallery-data.json` are relative (`assets/gallery/…`) so they work under the GitHub Pages sub-path.

Each brand in `brands-data.json` has a `bestFor` line (shown on the brand grid) and a `fit` list (`hvhz`, `coastal`, `inland`, `windows`, `doors`, `commercial`) that the storm-code check uses to suggest brands.

## Brand pages

Individual profiles live at `/brands/[slug].html`:

| Brand | URL |
|-------|-----|
| PGT | `/brands/pgt.html` |
| ES Windows | `/brands/es-windows.html` |
| CGI | `/brands/cgi.html` |
| JELD-WEN | `/brands/jeld-wen.html` |
| Viwinco | `/brands/viwinco.html` |
| Origin | `/brands/origin.html` |
| WinDoor | `/brands/windoor.html` |
| CWS | `/brands/cws.html` |
| Euro-Wall | `/brands/euro-wall.html` |

To regenerate brand pages after editing content:

```bash
npm run brands
```

## Build

```bash
npm run build   # outputs to dist/ for GitHub Pages
```

## Notes for the meeting

Walk through in this order:

1. First impression — hero, theme toggle, scroll feel
2. Trust — founders, process, gallery (placeholders → their photos)
3. Expertise — brand dropdown, hurricane section, one brand page
4. Action — working form, click-to-call, mobile CTA
5. Storm-code check — tap a county, then "Send this to Eric & Trey"
6. Roadmap — real project photos and reviews, live Google reviews, custom domain

Ask Eric/Trey to confirm: service area counties, form inbox email, and which projects to feature first.
