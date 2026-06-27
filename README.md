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

- Hero, about, products, brand partners marquee, and contact
- **How we work** — 4-step founder-led process timeline
- **Project gallery** — filterable grid with lightbox (placeholder Florida imagery)
- **Hurricane & impact authority** — Florida storm-code guidance + standalone SEO guide
- **Service area** — regions and counties with `LocalBusiness` JSON-LD schema
- **Testimonials** — carousel with draft placeholders (swap when client provides reviews)
- **FAQ** — accordion for common Florida window buyer questions
- **Working contact form** via [FormSubmit](https://formsubmit.co/) with inline success/error states
- **Sticky mobile CTA** — Call + Free Estimate bar (hides near contact section)
- Light/dark theme toggle, scroll progress, parallax hero

### Brand & SEO pages

- **9 SEO brand profile pages** with company history, manufacturing, taglines, and Florida relevance
- **Hurricane impact windows guide** at `/hurricane-impact-windows.html`
- Open Graph + Twitter meta on homepage and brand pages
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
| Testimonials | `scripts/testimonials-data.json` |
| Service regions | `scripts/service-area.json` |
| FAQ | `scripts/faq-data.json` |
| Brand profiles | `scripts/brands-data.json` → run `npm run brands` |

Gallery images live in `public/assets/gallery/`. Update paths in `gallery-data.json` when replacing placeholders.

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
5. Roadmap — quote calculator, live Google reviews, custom domain

Ask Eric/Trey to confirm: service area counties, form inbox email, and which projects to feature first.
