import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const brands = JSON.parse(readFileSync(join(__dirname, "brands-data.json"), "utf8"));

const brandLinks = brands
  .map(
    (b) =>
      `              <a href="${b.slug}.html" role="menuitem">${b.name}</a>`
  )
  .join("\n");

const mobileBrandLinks = brands
  .map((b) => `              <a href="${b.slug}.html">${b.shortName}</a>`)
  .join("\n");

const footerBrandLinks = brands
  .map((b) => `          <a href="${b.slug}.html">${b.shortName}</a>`)
  .join("\n");

const SITE_URL = "https://boorussia.github.io/aoa-window-solutions-redesign";
const PHONE_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>`;

/* Shared header + footer for pages one level below the site root. */
function navHtml() {
  const home = "../";

  return `    <header class="site-header" data-header>
      <div class="container header-inner">
        <a class="brand" href="${home}" aria-label="AOA Window Solutions home">
          <img src="/assets/logo.svg" alt="" width="36" height="36" class="brand-icon" data-logo />
          <span class="brand-text"><strong>AOA</strong><small>Window Solutions</small></span>
        </a>

        <nav class="nav" aria-label="Primary">
          <a href="${home}#about">About</a>
          <a href="${home}#services">Services</a>
          <a href="${home}#projects">Projects</a>
          <a href="${home}#storm-ready">Storm-ready</a>
          <div class="nav-dropdown">
            <a href="${home}#brands" class="nav-dropdown-trigger is-active" aria-haspopup="true">
              Brands
              <svg class="nav-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
            </a>
            <div class="nav-dropdown-menu" role="menu">
${brandLinks}
            </div>
          </div>
          <a href="${home}#faq">FAQ</a>
        </nav>

        <div class="header-actions">
          <a class="header-phone" href="tel:8135280895">
            ${PHONE_ICON}
            (813) 528-0895
          </a>
          <button class="theme-toggle" type="button" aria-label="Switch to light mode" data-theme-toggle>
            <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
            <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>
          <a class="btn btn-primary btn-sm header-cta" href="${home}#contact">Free Estimate</a>
          <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu">
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      <div class="mobile-menu" id="mobile-menu" hidden>
        <nav aria-label="Mobile">
          <a href="${home}#about">About</a>
          <a href="${home}#services">Services</a>
          <a href="${home}#projects">Projects</a>
          <a href="${home}#storm-ready">Storm-ready</a>
          <details class="mobile-brands" open>
            <summary>Brands</summary>
            <div class="mobile-brands-list">
              <a href="${home}#brands">All brands</a>
${mobileBrandLinks}
            </div>
          </details>
          <a href="${home}#faq">FAQ</a>
          <a href="${home}#contact">Contact</a>
        </nav>
        <div class="mobile-menu-calls">
          <a class="btn btn-outline" href="tel:8135280895">Call Eric</a>
          <a class="btn btn-outline" href="tel:8123205232">Call Trey</a>
        </div>
      </div>
    </header>`;
}

function footerHtml(note) {
  const home = "../";

  return `    <footer class="site-footer">
      <div class="container footer-grid">
        <div class="footer-brand">
          <a class="brand" href="${home}" aria-label="AOA Window Solutions home">
            <img src="/assets/logo.svg" alt="" width="36" height="36" class="brand-icon" data-logo loading="lazy" />
            <span class="brand-text"><strong>AOA</strong><small>Window Solutions</small></span>
          </a>
          <p>Premium windows and doors for Florida homes and businesses — founder-led from estimate to install.</p>
          <a class="btn btn-primary btn-sm" href="${home}#contact">Free estimate</a>
        </div>
        <nav class="footer-col" aria-label="Footer">
          <p class="footer-heading">Explore</p>
          <a href="${home}#about">About</a>
          <a href="${home}#services">Services</a>
          <a href="${home}#projects">Projects</a>
          <a href="${home}#storm-ready">Storm-ready</a>
          <a href="${home}#faq">FAQ</a>
          <a href="${home}hurricane-impact-windows.html">Impact windows guide</a>
        </nav>
        <nav class="footer-col" aria-label="Brands">
          <p class="footer-heading">Brands</p>
${footerBrandLinks}
        </nav>
        <div class="footer-col">
          <p class="footer-heading">Talk to a founder</p>
          <a href="tel:8135280895">Eric Butler · (813) 528-0895</a>
          <a href="tel:8123205232">Trey Orbik · (812) 320-5232</a>
          <p>Mon–Fri · 9 AM – 5 PM ET</p>
          <p>Serving homeowners, builders &amp; commercial clients across Florida</p>
        </div>
      </div>
      <div class="container footer-bottom">
        <p>&copy; <span data-year>2026</span> AOA Window Solutions LLC</p>
        <p class="footer-note">${note}</p>
        <a class="footer-top" href="#main">
          Back to top
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6" /></svg>
        </a>
      </div>
    </footer>`;
}

function brandPage(brand) {
  const metaDesc = `${brand.name} — founded ${brand.founded}. ${brand.specialty} Available through AOA Window Solutions in Florida. ${brand.tagline}.`;
  const pageUrl = `${SITE_URL}/brands/${brand.slug}.html`;
  const ogImage = brand.logo.startsWith("/") ? `${SITE_URL}${brand.logo}` : `${SITE_URL}/${brand.logo}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Brand",
    name: brand.name,
    slogan: brand.tagline,
    description: brand.specialty,
    foundingDate: brand.founded,
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Brands", item: `${SITE_URL}/#brands` },
      { "@type": "ListItem", position: 3, name: brand.name, item: pageUrl },
    ],
  };

  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${metaDesc.replace(/"/g, "&quot;")}" />
    <title>${brand.name} | AOA Window Solutions — Florida Dealer</title>
    <link rel="icon" href="/assets/logo.svg" type="image/svg+xml" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${brand.name} | AOA Window Solutions — Florida Dealer" />
    <meta property="og:description" content="${metaDesc.replace(/"/g, "&quot;")}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:url" content="${pageUrl}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${brand.name} | AOA Window Solutions" />
    <meta name="twitter:description" content="${brand.specialty.replace(/"/g, "&quot;")}" />
    <meta name="theme-color" content="#070809" />
    <link rel="canonical" href="${pageUrl}" />
    <script>
      (function () {
        var root = document.documentElement;
        var stored = null;
        try {
          stored = localStorage.getItem("aoa-theme");
        } catch (e) {}
        var theme = stored || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
        root.setAttribute("data-theme", theme);
        root.classList.add("js");
      })();
    </script>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="/src/styles.css" />
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
    <script type="application/ld+json">${JSON.stringify(breadcrumbLd)}</script>
  </head>
  <body class="brand-page">
    <div class="scroll-progress" aria-hidden="true"><span data-scroll-progress></span></div>
    <a class="skip-link" href="#main">Skip to content</a>

${navHtml()}

    <main id="main">
      <article class="brand-article">
        <div class="container">
          <nav class="breadcrumb" aria-label="Breadcrumb">
            <a href="../">Home</a>
            <span aria-hidden="true">/</span>
            <a href="../#brands">Brands</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">${brand.shortName}</span>
          </nav>

          <header class="brand-hero scroll-reveal">
            <div class="brand-hero-logo">
              <img src="${brand.logo}" alt="${brand.logoAlt}" width="200" height="80" />
            </div>
            <div class="brand-hero-copy">
              <p class="label">Partner brand</p>
              <h1>${brand.name}</h1>
              <p class="brand-tagline">${brand.tagline}</p>
            </div>
          </header>

          <div class="brand-facts scroll-reveal">
            <div class="fact-card">
              <span class="fact-label">Founded</span>
              <span class="fact-value">${brand.founded}</span>
            </div>
            <div class="fact-card">
              <span class="fact-label">Headquarters</span>
              <span class="fact-value">${brand.headquarters}</span>
            </div>
            <div class="fact-card">
              <span class="fact-label">Parent company</span>
              <span class="fact-value">${brand.parentCompany}</span>
            </div>
            ${brand.founders ? `<div class="fact-card">
              <span class="fact-label">Founders</span>
              <span class="fact-value">${brand.founders}</span>
            </div>` : ""}
          </div>

          <div class="brand-content">
            <section class="brand-section scroll-reveal">
              <h2>Overview</h2>
              ${brand.paragraphs.map((p) => `<p>${p}</p>`).join("\n              ")}
            </section>

            <section class="brand-section scroll-reveal">
              <h2>Manufacturing &amp; operations</h2>
              <p>${brand.manufacturing}</p>
            </section>

            <section class="brand-section scroll-reveal">
              <h2>Florida &amp; coastal performance</h2>
              <p>${brand.floridaRelevance}</p>
            </section>

            <section class="brand-section scroll-reveal">
              <h2>Key highlights</h2>
              <ul class="check-list">
                ${brand.highlights.map((h) => `<li>${h}</li>`).join("\n                ")}
              </ul>
            </section>

            <section class="brand-section scroll-reveal">
              <h2>Why AOA carries ${brand.shortName}</h2>
              <p>
                AOA Window Solutions partners with ${brand.name} because Florida projects demand
                proven performance — not just a logo on a truck. ${brand.shortName} products meet the
                impact, energy, and durability standards our clients expect, and we stand behind every
                installation with direct founder access and free estimates.
              </p>
              <p>
                Ready to specify ${brand.shortName} on your project?
                <a href="../#contact">Contact AOA Window Solutions</a> for a consultation.
              </p>
            </section>
          </div>

          <aside class="brand-cta scroll-reveal">
            <p class="label">Get a quote</p>
            <h2>Interested in ${brand.shortName}?</h2>
            <p>Talk to Eric or Trey about windows and doors for your Florida project.</p>
            <div class="brand-cta-actions">
              <a class="btn btn-primary" href="../#contact">Free estimate</a>
              <a class="btn btn-outline" href="tel:8135280895">(813) 528-0895</a>
            </div>
            ${brand.website ? `<a class="brand-external" href="${brand.website}" target="_blank" rel="noopener noreferrer">Visit ${brand.shortName} official site ↗</a>` : ""}
          </aside>

          <nav class="brand-nav-siblings scroll-reveal" aria-label="Other brands">
            <p class="label">Explore other brands</p>
            <div class="brand-sibling-links">
              ${brands
                .filter((b) => b.slug !== brand.slug)
                .map(
                  (b) =>
                    `<a href="${b.slug}.html"><img src="${b.logo}" alt="${b.shortName}" loading="lazy" /><span>${b.shortName}</span></a>`
                )
                .join("\n              ")}
            </div>
          </nav>
        </div>
      </article>
    </main>

${footerHtml("Brand information compiled for client review. Verify specifications with manufacturer.")}

    <script type="module" src="/src/main.js"></script>
  </body>
</html>`;
}

const brandsDir = join(root, "brands");
mkdirSync(brandsDir, { recursive: true });

for (const brand of brands) {
  writeFileSync(join(brandsDir, `${brand.slug}.html`), brandPage(brand));
}

console.log(`Generated ${brands.length} brand pages in brands/`);
