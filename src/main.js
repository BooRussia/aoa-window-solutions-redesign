import { FORM_EMAIL } from "./site-config.js";
import galleryItems from "../scripts/gallery-data.json";
import testimonials from "../scripts/testimonials-data.json";
import serviceArea from "../scripts/service-area.json";
import faqItems from "../scripts/faq-data.json";
import brands from "../scripts/brands-data.json";

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const form = document.getElementById("estimate-form");
const themeToggle = document.querySelector("[data-theme-toggle]");
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const scrollProgress = document.querySelector("[data-scroll-progress]");
const heroParallax = document.querySelector("[data-parallax]");
const slowParallax = document.querySelectorAll("[data-parallax-slow]");
const mobileCta = document.querySelector("[data-mobile-cta]");
const contactSection = document.getElementById("contact");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const DAY_MS = 24 * 60 * 60 * 1000;

/* Paths in the JSON data are relative to the site root; GitHub Pages serves the
   site from a sub-path, so prefix them with Vite's base URL. */
const BASE = (import.meta.env && import.meta.env.BASE_URL) || "/";
const asset = (path) => (/^(https?:)?\/\//.test(path) ? path : BASE + path.replace(/^\//, ""));

const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]
  );

/* ── Theme ── */
function getTheme() {
  return document.documentElement.getAttribute("data-theme") || "dark";
}

function setTheme(theme, persist = true) {
  document.documentElement.setAttribute("data-theme", theme);
  if (persist) {
    try {
      localStorage.setItem("aoa-theme", theme);
    } catch {
      /* storage unavailable (private mode) — theme still applies for this visit */
    }
  }
  themeToggle?.setAttribute(
    "aria-label",
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
  );
  themeColorMeta?.setAttribute("content", theme === "dark" ? "#070809" : "#f6f5f2");
}

setTheme(getTheme(), false);

themeToggle?.addEventListener("click", () => {
  setTheme(getTheme() === "dark" ? "light" : "dark");
});

/* ── Header scroll state ── */
function setHeaderState() {
  header?.classList.toggle("is-scrolled", window.scrollY > 20);
}

function updateMobileCta() {
  if (!mobileCta || !contactSection) return;
  const rect = contactSection.getBoundingClientRect();
  const contactVisible = rect.top < window.innerHeight * 0.85 && rect.bottom > 0;
  mobileCta.classList.toggle("is-hidden", contactVisible);
}

/* ── Scroll progress + parallax ── */
let scrollTicking = false;

function onScroll() {
  scrollTicking = false;
  setHeaderState();
  updateMobileCta();

  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  scrollProgress?.style.setProperty("width", `${progress * 100}%`);

  if (reducedMotion) return;

  const y = window.scrollY;

  if (heroParallax && y < window.innerHeight * 1.2) {
    heroParallax.style.transform = `translate3d(0, ${y * 0.28}px, 0)`;
  }

  slowParallax.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const center = rect.top + rect.height / 2 - window.innerHeight / 2;
    el.style.transform = `translate3d(0, ${center * -0.06}px, 0)`;
  });
}

window.addEventListener(
  "scroll",
  () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(onScroll);
  },
  { passive: true }
);
onScroll();

/* ── Mobile menu ── */
function setMobileMenu(open) {
  if (!menuToggle || !mobileMenu) return;
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  mobileMenu.hidden = !open;
  document.body.classList.toggle("menu-open", open);
}

menuToggle?.addEventListener("click", () => {
  setMobileMenu(menuToggle.getAttribute("aria-expanded") !== "true");
});

mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMobileMenu(false));
});

window.matchMedia("(min-width: 64rem)").addEventListener("change", (e) => {
  if (e.matches) setMobileMenu(false);
});

/* ── Scroll reveal ── */
const revealObserver =
  "IntersectionObserver" in window
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
      )
    : { observe: (el) => el.classList.add("is-visible"), unobserve() {} };

function observeReveals(scope = document) {
  scope
    .querySelectorAll(".scroll-in, .scroll-reveal, .media-frame, .process-step")
    .forEach((el) => revealObserver.observe(el));
}

observeReveals();

requestAnimationFrame(() => {
  document.querySelectorAll(".hero .scroll-in").forEach((el) => {
    el.classList.add("is-visible");
  });
});

/* ── Hero counters ── */
function countUp(el) {
  const target = Number(el.dataset.countTo);
  if (!target || reducedMotion) return;
  const duration = 1400;
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = String(Math.round(target * eased));
    if (t < 1) requestAnimationFrame(tick);
  };
  el.textContent = "0";
  requestAnimationFrame(tick);
}

document.querySelectorAll("[data-count-to]").forEach((el) => {
  setTimeout(() => countUp(el), 500);
});

/* ── Hurricane season ── */
function seasonInfo(now = new Date()) {
  const year = now.getFullYear();
  const start = new Date(year, 5, 1);
  const end = new Date(year, 10, 30, 23, 59, 59);
  const peakStart = new Date(year, 7, 15);
  const peakEnd = new Date(year, 9, 25, 23, 59, 59);

  if (now >= start && now <= end) {
    return {
      active: true,
      peak: now >= peakStart && now <= peakEnd,
      days: Math.ceil((end - now) / DAY_MS),
    };
  }
  const nextStart = now < start ? start : new Date(year + 1, 5, 1);
  return { active: false, peak: false, days: Math.ceil((nextStart - now) / DAY_MS) };
}

function yearFraction(date) {
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  return (date.getMonth() + (date.getDate() - 1) / daysInMonth) / 12;
}

const season = seasonInfo();
const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

const seasonChip = document.querySelector("[data-season-chip]");
const seasonChipText = document.querySelector("[data-season-chip-text]");
if (seasonChip && seasonChipText) {
  seasonChip.classList.toggle("is-active", season.active);
  seasonChipText.textContent = season.active
    ? `${season.peak ? "Peak hurricane season" : "Hurricane season"} · ${plural(season.days, "day")} left`
    : `${plural(season.days, "day")} until hurricane season`;
}

const seasonStatus = document.querySelector("[data-season-status]");
if (seasonStatus) {
  seasonStatus.innerHTML = season.active
    ? `<strong>Season is active — ${plural(season.days, "day")} to go.</strong> ${
        season.peak
          ? "We're in peak activity. If your openings aren't protected, call us for a fast assessment."
          : "Use the stretch before next season to upgrade, so you're protected on June 1."
      }`
    : `<strong>Off-season — ${plural(season.days, "day")} until June 1.</strong> The best time to upgrade is before storms return.`;
}

const seasonToday = document.querySelector("[data-season-today]");
if (seasonToday) {
  seasonToday.style.setProperty("--pos", `${(yearFraction(new Date()) * 100).toFixed(2)}%`);
  seasonToday.hidden = false;
}

/* ── Open-now status (Eastern time) ── */
function isOpenNow() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    hour: "numeric",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const weekday = parts.find((p) => p.type === "weekday")?.value;
  const hour = Number(parts.find((p) => p.type === "hour")?.value);
  return !["Sat", "Sun"].includes(weekday) && hour >= 9 && hour < 17;
}

document.querySelectorAll("[data-open-status]").forEach((el) => {
  const open = isOpenNow();
  el.classList.toggle("is-open", open);
  el.textContent = open
    ? "Open now — call and a founder picks up"
    : "Closed now — send a request and we'll reply next business day";
  el.hidden = false;
});

document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = String(new Date().getFullYear());
});

/* ── Contact form (FormSubmit) ── */
const formWrap = form?.closest(".contact-form-wrap");
const formSuccess = formWrap?.querySelector("[data-form-success]");
const prefillNote = form?.querySelector("[data-prefill-note]");

function showFormMessage(type, message) {
  const existing = form?.querySelector(".form-feedback");
  existing?.remove();
  const el = document.createElement("p");
  el.className = `form-feedback form-feedback--${type}`;
  el.setAttribute("role", type === "error" ? "alert" : "status");
  el.textContent = message;
  form?.querySelector(".form-actions")?.appendChild(el);
}

function setFieldError(input, message) {
  const field = input.closest(".field");
  const id = `${input.id}-error`;
  field?.querySelector(".field-error")?.remove();
  input.removeAttribute("aria-invalid");
  input.removeAttribute("aria-describedby");
  if (!message) return;
  const el = document.createElement("p");
  el.className = "field-error";
  el.id = id;
  el.textContent = message;
  field?.appendChild(el);
  input.setAttribute("aria-invalid", "true");
  input.setAttribute("aria-describedby", id);
}

function validateField(input) {
  const value = input.value.trim();
  if (input.required && !value) {
    setFieldError(input, input.type === "email" ? "Please add your email." : "Please add your name.");
    return false;
  }
  if (input.type === "email" && value && !input.checkValidity()) {
    setFieldError(input, "That email doesn't look quite right.");
    return false;
  }
  setFieldError(input, "");
  return true;
}

form?.querySelectorAll("input[required]").forEach((input) => {
  input.addEventListener("blur", () => validateField(input));
  input.addEventListener("input", () => {
    if (input.getAttribute("aria-invalid") === "true") validateField(input);
  });
});

/* Pre-select project types and optionally a note, then bring the form into view. */
function prefillForm({ projects = [], location = "", message = "", note = "" } = {}) {
  if (!form) return;
  form.querySelectorAll('input[name="project"]').forEach((box) => {
    if (projects.includes(box.value)) box.checked = true;
  });
  const locationInput = form.querySelector("#location");
  if (location && locationInput && !locationInput.value.trim()) locationInput.value = location;
  const messageInput = form.querySelector("#message");
  if (message && messageInput) {
    const current = messageInput.value.trim();
    messageInput.value = current && !current.includes(message) ? `${current}\n\n${message}` : message;
  }
  if (prefillNote && note) {
    prefillNote.textContent = note;
    prefillNote.hidden = false;
  }
  form.classList.remove("is-highlighted");
  void form.offsetWidth;
  form.classList.add("is-highlighted");
}

document.querySelectorAll("[data-prefill]").forEach((link) => {
  link.addEventListener("click", () => {
    prefillForm({ projects: [link.dataset.prefill] });
  });
});

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitBtn = form.querySelector('[type="submit"]');
  const required = [...form.querySelectorAll("input[required]")];
  const invalid = required.filter((input) => !validateField(input));
  if (invalid.length) {
    invalid[0].focus();
    return;
  }

  const value = (selector) => form.querySelector(selector)?.value?.trim() ?? "";
  const name = value("#name");
  const projects = [...form.querySelectorAll('input[name="project"]:checked')].map((b) => b.value);

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending…";
  form.querySelector(".form-feedback")?.remove();

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(FORM_EMAIL)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        name,
        email: value("#email"),
        phone: value("#phone"),
        location: value("#location"),
        project_type: projects.join(", "),
        timeline: value("#timeline"),
        message: value("#message"),
        _honey: value('[name="_honey"]'),
        _subject: `AOA estimate request from ${name}`,
        _template: "table",
        _captcha: "false",
        page: window.location.href,
        submitted_at: new Date().toISOString(),
      }),
    });

    if (!response.ok) throw new Error("Submit failed");

    form.reset();
    if (prefillNote) prefillNote.hidden = true;
    if (formSuccess) {
      const title = formSuccess.querySelector("[data-form-success-title]");
      if (title) title.textContent = `Thanks${name ? `, ${name.split(" ")[0]}` : ""} — we've got it.`;
      form.hidden = true;
      formSuccess.hidden = false;
      formSuccess.focus();
    } else {
      showFormMessage(
        "success",
        `Thanks${name ? `, ${name}` : ""}! Eric or Trey will follow up within 1 business day.`
      );
    }
  } catch {
    showFormMessage(
      "error",
      "Something went wrong. Please call Eric at (813) 528-0895 or Trey at (812) 320-5232."
    );
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Request free estimate";
  }
});

formSuccess?.querySelector("[data-form-reset]")?.addEventListener("click", () => {
  formSuccess.hidden = true;
  form.hidden = false;
  form.querySelector("#name")?.focus();
});

/* ── Gallery ── */
const galleryGrid = document.querySelector("[data-gallery-grid]");
const galleryFilters = document.querySelector("[data-gallery-filters]");
const lightbox = document.querySelector("[data-lightbox]");
let activeFilter = "all";
let visibleGallery = galleryItems;
let lightboxIndex = 0;
let lightboxReturnFocus = null;

function renderGallery() {
  if (!galleryGrid) return;

  visibleGallery =
    activeFilter === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.tags.includes(activeFilter));

  galleryGrid.innerHTML = visibleGallery
    .map(
      (item, i) => `
    <article class="gallery-card scroll-reveal" style="--i: ${i % 4}">
      <button type="button" class="gallery-card-btn" data-gallery-open="${i}" aria-label="View ${escapeHtml(item.title)}, ${escapeHtml(item.location)}">
        <img src="${asset(item.image)}" alt="${escapeHtml(item.alt)}" loading="lazy" width="600" height="450" />
        <span class="gallery-card-overlay">
          <span class="gallery-card-tag">${escapeHtml(item.location)}</span>
          <span class="gallery-card-title">${escapeHtml(item.title)}</span>
        </span>
        <span class="gallery-card-zoom" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
        </span>
      </button>
      <div class="gallery-card-meta">
        <a href="${escapeHtml(item.brandHref)}">${escapeHtml(item.brandLabel)}</a>
      </div>
    </article>`
    )
    .join("");

  observeReveals(galleryGrid);
}

function setupGalleryFilters() {
  if (!galleryFilters) return;
  galleryFilters.querySelectorAll("[data-filter]").forEach((btn) => {
    const key = btn.dataset.filter;
    const count =
      key === "all" ? galleryItems.length : galleryItems.filter((g) => g.tags.includes(key)).length;
    btn.insertAdjacentHTML("beforeend", ` <span class="filter-count">${count}</span>`);
  });
}

galleryFilters?.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-filter]");
  if (!btn) return;
  activeFilter = btn.dataset.filter;
  galleryFilters.querySelectorAll("[data-filter]").forEach((b) => {
    b.classList.toggle("is-active", b === btn);
    b.setAttribute("aria-pressed", String(b === btn));
  });
  renderGallery();
});

galleryGrid?.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-gallery-open]");
  if (btn) openLightbox(Number(btn.dataset.galleryOpen), btn);
});

function showLightboxItem(index) {
  const total = visibleGallery.length;
  lightboxIndex = (index + total) % total;
  const item = visibleGallery[lightboxIndex];
  const img = lightbox.querySelector("[data-lightbox-img]");
  img.src = asset(item.image);
  img.alt = item.alt;
  lightbox.querySelector("[data-lightbox-title]").textContent = item.title;
  lightbox.querySelector("[data-lightbox-location]").textContent = item.location;
  const brandLink = lightbox.querySelector("[data-lightbox-brand]");
  brandLink.href = item.brandHref;
  brandLink.textContent = `${item.brandLabel} →`;
  lightbox.querySelector("[data-lightbox-count]").textContent = `${lightboxIndex + 1} / ${total}`;
}

function openLightbox(index, trigger) {
  if (!lightbox || !visibleGallery.length) return;
  lightboxReturnFocus = trigger || document.activeElement;
  showLightboxItem(index);
  lightbox.hidden = false;
  document.body.classList.add("lightbox-open");
  lightbox.querySelector("[data-lightbox-close]")?.focus();
}

function closeLightbox() {
  if (!lightbox || lightbox.hidden) return;
  lightbox.hidden = true;
  document.body.classList.remove("lightbox-open");
  lightboxReturnFocus?.focus?.();
}

lightbox?.querySelector("[data-lightbox-close]")?.addEventListener("click", closeLightbox);
lightbox?.querySelector("[data-lightbox-prev]")?.addEventListener("click", () => showLightboxItem(lightboxIndex - 1));
lightbox?.querySelector("[data-lightbox-next]")?.addEventListener("click", () => showLightboxItem(lightboxIndex + 1));
lightbox?.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

let touchStartX = null;
lightbox?.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });
lightbox?.addEventListener("touchend", (e) => {
  if (touchStartX === null) return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) showLightboxItem(lightboxIndex + (dx < 0 ? 1 : -1));
  touchStartX = null;
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeLightbox();
    setMobileMenu(false);
    return;
  }
  if (!lightbox || lightbox.hidden) return;
  if (e.key === "ArrowRight") showLightboxItem(lightboxIndex + 1);
  if (e.key === "ArrowLeft") showLightboxItem(lightboxIndex - 1);
  if (e.key === "Tab") {
    const focusables = [...lightbox.querySelectorAll("button, a[href]")];
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});

setupGalleryFilters();
renderGallery();

/* ── Brand grid ── */
const brandGrid = document.querySelector("[data-brand-grid]");
if (brandGrid) {
  brandGrid.innerHTML = brands
    .map(
      (b, i) => `
    <a class="brand-card scroll-reveal" style="--i: ${i % 3}" href="brands/${b.slug}.html">
      <span class="brand-card-logo"><img src="${asset(b.logo)}" alt="" loading="lazy" /></span>
      <span class="brand-card-name">${escapeHtml(b.name)}</span>
      <span class="brand-card-best">${escapeHtml(b.bestFor)}</span>
      <span class="brand-card-meta">Est. ${escapeHtml(b.founded)} · ${escapeHtml(b.headquarters.replace(/ \(.*\)$/, ""))}</span>
      <span class="brand-card-arrow" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M7 17 17 7M8 7h9v9" /></svg>
      </span>
    </a>`
    )
    .join("");
  observeReveals(brandGrid);
}

/* ── Service area + storm-code planner ── */
const serviceAreaGrid = document.querySelector("[data-service-area]");
const planner = document.querySelector("[data-planner]");
const plannerForm = planner?.querySelector("[data-planner-form]");
const plannerCounty = planner?.querySelector("[data-planner-county]");
const plannerResult = planner?.querySelector("[data-planner-result]");
const OTHER_COUNTY = "__other";

const ZONES = {
  hvhz: {
    badge: "HVHZ",
    tone: "storm",
    title: "High Velocity Hurricane Zone",
    text: "The strictest window code in the country. Products need a Miami-Dade Notice of Acceptance (NOA) and must pass large-missile impact testing.",
  },
  coastal: {
    badge: "Wind-borne debris region",
    tone: "brand",
    title: "Impact protection likely required",
    text: "Much of coastal Florida falls in a wind-borne debris region, where openings typically need impact-rated glass or approved shutters.",
  },
  inland: {
    badge: "Inland",
    tone: "neutral",
    title: "Impact may be optional",
    text: "It depends on your exact wind-speed zone. Many inland owners still choose impact glass for security, quiet, and possible wind-mitigation insurance discounts.",
  },
  other: {
    badge: "Statewide",
    tone: "neutral",
    title: "We'll check your code zone",
    text: "We evaluate projects statewide — especially commercial and builder work — and confirm exactly what your county requires.",
  },
};

function zoneFor(county) {
  if (!county || county === OTHER_COUNTY) return "other";
  const zones = serviceArea.codeZones || {};
  if (zones.hvhz?.includes(county)) return "hvhz";
  if (zones.inland?.includes(county)) return "inland";
  return "coastal";
}

function recommendBrands(zone, property, need) {
  const needs = need === "both" ? ["windows", "doors"] : [need];
  return brands
    .filter((b) => zone === "other" || b.fit.includes(zone))
    .map((b, order) => {
      let score = needs.filter((n) => b.fit.includes(n)).length;
      if (property === "business" && b.fit.includes("commercial")) score += 1;
      return { brand: b, score, order };
    })
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .slice(0, 3)
    .map((r) => r.brand);
}

function plannerState() {
  const data = new FormData(plannerForm);
  return {
    county: data.get("county") || "",
    property: data.get("property") || "home",
    need: data.get("need") || "windows",
    openings: Math.min(99, Math.max(1, Number(data.get("openings")) || 1)),
  };
}

function installEstimate({ property, openings }) {
  if (property === "business") return "Scheduled around your GC and site";
  if (openings <= 2) return "Often completed in one day";
  return "Most homes take 1–3 days";
}

function plannerSummary(state) {
  const zone = ZONES[zoneFor(state.county)];
  const where = state.county === OTHER_COUNTY ? "Another Florida county" : `${state.county} County`;
  const need = { windows: "windows", doors: "doors", both: "windows & doors" }[state.need];
  return `Storm-code check: ${where} (${zone.badge}) · ${state.property === "business" ? "Business" : "Home"} · ${need} · about ${plural(state.openings, "opening")}`;
}

function renderPlanner() {
  if (!plannerResult || !plannerForm) return;
  const state = plannerState();

  serviceAreaGrid?.querySelectorAll("[data-county]").forEach((btn) => {
    btn.setAttribute("aria-pressed", String(btn.dataset.county === state.county));
  });

  if (!state.county) {
    plannerResult.innerHTML = `<p class="planner-placeholder">Choose a county to see your code zone and the brands we'd start with.</p>`;
    return;
  }

  const zoneKey = zoneFor(state.county);
  const zone = ZONES[zoneKey];
  const picks = recommendBrands(zoneKey, state.property, state.need);

  plannerResult.innerHTML = `
    <span class="zone-badge zone-badge--${zone.tone}">${zone.badge}</span>
    <h4 class="planner-title">${zone.title}</h4>
    <p class="planner-text">${zone.text}</p>
    <dl class="planner-facts">
      <div><dt>Typical install</dt><dd>${installEstimate(state)}</dd></div>
      <div><dt>Brands we'd start with</dt><dd>${picks
        .map((b) => `<a href="brands/${b.slug}.html">${escapeHtml(b.shortName)}</a>`)
        .join("")}</dd></div>
    </dl>
    <button type="button" class="btn btn-primary btn-full" data-planner-send>
      Send this to Eric &amp; Trey
      <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
    </button>
    <p class="planner-disclaimer">Guidance only — we confirm requirements for your exact address during the free estimate.</p>`;
}

function selectCounty(county) {
  if (!plannerCounty) return;
  plannerCounty.value = county;
  renderPlanner();
  if (window.matchMedia("(max-width: 63.99rem)").matches) {
    planner.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  }
}

if (serviceAreaGrid) {
  serviceAreaGrid.innerHTML = serviceArea.regions
    .map(
      (region, i) => `
    <div class="region-card scroll-reveal" style="--i: ${i}">
      <h3>${escapeHtml(region.name)}</h3>
      <ul>${region.areas
        .map(
          (a) =>
            `<li><button type="button" class="county-chip" data-county="${escapeHtml(a)}" aria-pressed="false">${escapeHtml(a)}</button></li>`
        )
        .join("")}</ul>
    </div>`
    )
    .join("");
  observeReveals(serviceAreaGrid);

  serviceAreaGrid.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-county]");
    if (chip) selectCounty(chip.dataset.county);
  });
}

if (plannerCounty) {
  plannerCounty.insertAdjacentHTML(
    "beforeend",
    serviceArea.regions
      .map(
        (region) =>
          `<optgroup label="${escapeHtml(region.name)}">${region.areas
            .map((a) => `<option value="${escapeHtml(a)}">${escapeHtml(a)}</option>`)
            .join("")}</optgroup>`
      )
      .join("") + `<option value="${OTHER_COUNTY}">Another Florida county</option>`
  );
}

document.querySelector("[data-county-other]")?.addEventListener("click", () => selectCounty(OTHER_COUNTY));

plannerForm?.addEventListener("input", renderPlanner);
plannerForm?.addEventListener("change", renderPlanner);
plannerForm?.addEventListener("submit", (e) => e.preventDefault());

planner?.querySelectorAll("[data-step]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = plannerForm.querySelector('[name="openings"]');
    input.value = String(Math.min(99, Math.max(1, (Number(input.value) || 1) + Number(btn.dataset.step))));
    renderPlanner();
  });
});

plannerResult?.addEventListener("click", (e) => {
  if (!e.target.closest("[data-planner-send]")) return;
  const state = plannerState();
  const zoneKey = zoneFor(state.county);
  const projects = [];
  if (state.need !== "doors") projects.push("Windows");
  if (state.need !== "windows") projects.push("Doors");
  if (zoneKey !== "inland") projects.push("Impact upgrade");
  if (state.property === "business") projects.push("Commercial");

  prefillForm({
    projects,
    location: state.county && state.county !== OTHER_COUNTY ? `${state.county} County, FL` : "",
    message: plannerSummary(state),
    note: "Added your storm-code check — just add your contact details.",
  });
  contactSection?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  setTimeout(() => form?.querySelector("#name")?.focus({ preventScroll: true }), reducedMotion ? 0 : 600);
});

renderPlanner();

const serviceHeadline = document.querySelector("[data-service-headline]");
const serviceSubhead = document.querySelector("[data-service-subhead]");
const serviceNote = document.querySelector("[data-service-note]");
if (serviceHeadline) serviceHeadline.textContent = serviceArea.headline;
if (serviceSubhead) serviceSubhead.textContent = serviceArea.subhead;
if (serviceNote) serviceNote.textContent = serviceArea.note;

/* ── Testimonials ── */
const testimonialTrack = document.querySelector("[data-testimonial-track]");
const testimonialPrev = document.querySelector("[data-testimonial-prev]");
const testimonialNext = document.querySelector("[data-testimonial-next]");
const testimonialDots = document.querySelector("[data-testimonial-dots]");

function testimonialStep() {
  const card = testimonialTrack?.querySelector(".testimonial-card");
  if (!card) return 0;
  return card.offsetWidth + parseFloat(getComputedStyle(testimonialTrack).columnGap || "0");
}

function updateTestimonialControls() {
  if (!testimonialTrack) return;
  const step = testimonialStep();
  const maxScroll = testimonialTrack.scrollWidth - testimonialTrack.clientWidth;
  const index = step ? Math.round(testimonialTrack.scrollLeft / step) : 0;
  if (testimonialPrev) testimonialPrev.disabled = testimonialTrack.scrollLeft <= 4;
  if (testimonialNext) testimonialNext.disabled = testimonialTrack.scrollLeft >= maxScroll - 4;
  testimonialDots?.querySelectorAll("button").forEach((dot, i) => {
    dot.setAttribute("aria-current", String(i === index));
  });
}

function renderTestimonials() {
  if (!testimonialTrack) return;
  testimonialTrack.innerHTML = testimonials
    .map(
      (t) => `
    <blockquote class="testimonial-card">
      <svg class="testimonial-mark" viewBox="0 0 32 24" aria-hidden="true"><path d="M0 24V14C0 6 4.5 1.3 12 0l1.5 3.4C9 4.8 7 7.6 6.8 11H12v13H0Zm18 0V14c0-8 4.5-12.7 12-14l1.5 3.4C27 4.8 25 7.6 24.8 11H30v13H18Z" /></svg>
      ${t.draft ? '<span class="testimonial-draft">Sample review</span>' : ""}
      <p>${escapeHtml(t.quote)}</p>
      <footer>
        <cite>${escapeHtml(t.author)}</cite>
        <span>${escapeHtml(t.location)} · ${escapeHtml(t.project)}</span>
      </footer>
    </blockquote>`
    )
    .join("");

  if (testimonialDots) {
    testimonialDots.innerHTML = testimonials
      .map((_, i) => `<button type="button" aria-label="Show review ${i + 1}" aria-current="${i === 0}"></button>`)
      .join("");
    testimonialDots.querySelectorAll("button").forEach((dot, i) => {
      dot.addEventListener("click", () => {
        testimonialTrack.scrollTo({ left: i * testimonialStep(), behavior: reducedMotion ? "auto" : "smooth" });
      });
    });
  }
  updateTestimonialControls();
}

testimonialPrev?.addEventListener("click", () => {
  testimonialTrack.scrollBy({ left: -testimonialStep(), behavior: reducedMotion ? "auto" : "smooth" });
});

testimonialNext?.addEventListener("click", () => {
  testimonialTrack.scrollBy({ left: testimonialStep(), behavior: reducedMotion ? "auto" : "smooth" });
});

testimonialTrack?.addEventListener("scroll", () => requestAnimationFrame(updateTestimonialControls), {
  passive: true,
});
window.addEventListener("resize", updateTestimonialControls);

renderTestimonials();

/* ── FAQ ── */
const faqList = document.querySelector("[data-faq-list]");
if (faqList) {
  faqList.innerHTML = faqItems
    .map(
      (item, i) => `
    <details class="faq-item scroll-reveal" style="--i: ${i}" ${i === 0 ? "open" : ""}>
      <summary>${escapeHtml(item.question)}<span class="faq-icon" aria-hidden="true"></span></summary>
      <p>${escapeHtml(item.answer)}</p>
    </details>`
    )
    .join("");
  observeReveals(faqList);

  const faqSchema = document.createElement("script");
  faqSchema.type = "application/ld+json";
  faqSchema.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  });
  document.head.appendChild(faqSchema);
}

/* ── Active nav link on scroll ── */
const navLinks = [...document.querySelectorAll(".nav a[href^='#']")];
const navTargets = document.querySelectorAll("main > section[id]");

const sectionObserver =
  "IntersectionObserver" in window &&
  new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
        });
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

if (sectionObserver) navTargets.forEach((section) => sectionObserver.observe(section));
