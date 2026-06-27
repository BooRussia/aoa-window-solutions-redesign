# AOA Window Solutions — Website Redesign Draft

Rough draft concept for client review meeting. Built from content on [aoawindowsolutionsllc.com](https://aoawindowsolutionsllc.com/).

## Preview locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## What's included

- Modern single-page layout with hero, about, products, brand partners, and contact
- **9 SEO brand profile pages** with company history, manufacturing, taglines, and Florida relevance
- **Brands dropdown** in navigation (hover on desktop, expandable on mobile)
- Clickable partner logos in the scrolling marquee
- All original company info: founders, phone numbers, hours, vision statement
- Downloaded logo, hero imagery, and partner brand logos from the current site
- Mobile-responsive navigation and layout
- Light/dark theme toggle
- Contact form UI (not wired to backend yet — noted on the form)

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

To regenerate brand pages after editing content, update `scripts/brands-data.json` and run:

```bash
npm run brands
```

## Notes for the meeting

This is a **directional draft**, not final copy or branding. Use it to discuss:

- Overall look and feel (dark premium vs. lighter coastal)
- Section order and content emphasis
- Product categories to expand or simplify
- Whether to add gallery, testimonials, service area map, etc.
