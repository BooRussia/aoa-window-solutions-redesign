import { FORM_EMAIL } from "./site-config.js";
import galleryItems from "../scripts/gallery-data.json";
import testimonials from "../scripts/testimonials-data.json";
import serviceArea from "../scripts/service-area.json";
import faqItems from "../scripts/faq-data.json";

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const form = document.getElementById("estimate-form");
const themeToggle = document.querySelector("[data-theme-toggle]");
const scrollProgress = document.querySelector("[data-scroll-progress]");
const heroParallax = document.querySelector("[data-parallax]");
const slowParallax = document.querySelectorAll("[data-parallax-slow]");
const mobileCta = document.querySelector("[data-mobile-cta]");
const contactSection = document.getElementById("contact");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ── Theme ── */
function getTheme() {
  return document.documentElement.getAttribute("data-theme") || "dark";
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("aoa-theme", theme);
  themeToggle?.setAttribute(
    "aria-label",
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
  );
}

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
  const contactVisible = rect.top < window.innerHeight * 0.85;
  mobileCta.classList.toggle("is-hidden", contactVisible);
}

/* ── Scroll progress + parallax ── */
function onScroll() {
  setHeaderState();
  updateMobileCta();

  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  document.documentElement.style.setProperty("--scroll", progress.toFixed(4));
  scrollProgress?.style.setProperty("width", `${progress * 100}%`);

  if (reducedMotion) return;

  const y = window.scrollY;

  if (heroParallax) {
    heroParallax.style.transform = `translate3d(0, ${y * 0.28}px, 0)`;
  }

  slowParallax.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const center = rect.top + rect.height / 2 - window.innerHeight / 2;
    el.style.transform = `translate3d(0, ${center * -0.06}px, 0)`;
  });
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ── Mobile menu ── */
function closeMobileMenu() {
  if (!menuToggle || !mobileMenu) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
  mobileMenu.hidden = true;
}

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
  mobileMenu.hidden = isOpen;
});

mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

/* ── Scroll reveal ── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
);

document
  .querySelectorAll(".scroll-in, .scroll-reveal, .media-frame, .process-step")
  .forEach((el) => revealObserver.observe(el));

requestAnimationFrame(() => {
  document.querySelectorAll(".hero .scroll-in").forEach((el) => {
    el.classList.add("is-visible");
  });
});

/* ── Product rail drag scroll ── */
const productRail = document.querySelector("[data-product-rail]");
if (productRail && !reducedMotion) {
  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;

  productRail.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.pageX - productRail.offsetLeft;
    scrollLeft = productRail.scrollLeft;
    productRail.style.cursor = "grabbing";
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
    productRail.style.cursor = "";
  });

  productRail.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - productRail.offsetLeft;
    productRail.scrollLeft = scrollLeft - (x - startX) * 1.2;
  });
}

/* ── Contact form (FormSubmit) ── */
function showFormMessage(type, message) {
  const existing = form?.querySelector(".form-feedback");
  existing?.remove();
  const el = document.createElement("p");
  el.className = `form-feedback form-feedback--${type}`;
  el.setAttribute("role", type === "error" ? "alert" : "status");
  el.textContent = message;
  form?.querySelector(".form-actions")?.appendChild(el);
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitBtn = form.querySelector('[type="submit"]');
  const name = form.querySelector("#name")?.value?.trim();
  const email = form.querySelector("#email")?.value?.trim();
  const message = form.querySelector("#message")?.value?.trim();

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending…";
  form.querySelector(".form-feedback")?.remove();

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(FORM_EMAIL)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        name,
        email,
        message,
        _subject: `AOA estimate request from ${name}`,
        _template: "table",
        _captcha: "false",
        page: window.location.href,
        submitted_at: new Date().toISOString(),
      }),
    });

    if (!response.ok) throw new Error("Submit failed");

    form.reset();
    form.classList.add("is-success");
    showFormMessage(
      "success",
      `Thanks${name ? `, ${name}` : ""}! Eric or Trey will follow up within 1 business day.`
    );
  } catch {
    showFormMessage(
      "error",
      "Something went wrong. Please call Eric at (813) 528-0895 or Trey at (812) 320-5232."
    );
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Send message";
  }
});

/* ── Gallery ── */
const galleryGrid = document.querySelector("[data-gallery-grid]");
const galleryFilters = document.querySelector("[data-gallery-filters]");
const lightbox = document.querySelector("[data-lightbox]");
let activeFilter = "all";

function renderGallery() {
  if (!galleryGrid) return;

  const filtered =
    activeFilter === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.tags.includes(activeFilter));

  galleryGrid.innerHTML = filtered
    .map(
      (item) => `
    <article class="gallery-card scroll-reveal" data-gallery-id="${item.id}">
      <button type="button" class="gallery-card-btn" data-gallery-open="${item.id}">
        <img src="${item.image}" alt="${item.alt}" loading="lazy" width="600" height="450" />
        <span class="gallery-card-overlay">
          <span class="gallery-card-tag">${item.location}</span>
          <span class="gallery-card-title">${item.title}</span>
        </span>
      </button>
      <div class="gallery-card-meta">
        <a href="${item.brandHref}">${item.brandLabel}</a>
      </div>
    </article>`
    )
    .join("");

  galleryGrid.querySelectorAll(".gallery-card").forEach((el) => revealObserver.observe(el));
  galleryGrid.querySelectorAll("[data-gallery-open]").forEach((btn) => {
    btn.addEventListener("click", () => openLightbox(btn.dataset.galleryOpen));
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

function openLightbox(id) {
  const item = galleryItems.find((g) => g.id === id);
  if (!item || !lightbox) return;
  lightbox.hidden = false;
  document.body.classList.add("lightbox-open");
  lightbox.querySelector("[data-lightbox-img]").src = item.image;
  lightbox.querySelector("[data-lightbox-img]").alt = item.alt;
  lightbox.querySelector("[data-lightbox-title]").textContent = item.title;
  lightbox.querySelector("[data-lightbox-location]").textContent = item.location;
  lightbox.querySelector("[data-lightbox-brand]").href = item.brandHref;
  lightbox.querySelector("[data-lightbox-brand]").textContent = item.brandLabel;
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.hidden = true;
  document.body.classList.remove("lightbox-open");
}

lightbox?.querySelector("[data-lightbox-close]")?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

renderGallery();

/* ── Service area ── */
const serviceAreaGrid = document.querySelector("[data-service-area]");
if (serviceAreaGrid) {
  serviceAreaGrid.innerHTML = serviceArea.regions
    .map(
      (region) => `
    <div class="region-card scroll-reveal">
      <h3>${region.name}</h3>
      <ul>${region.areas.map((a) => `<li>${a}</li>`).join("")}</ul>
    </div>`
    )
    .join("");
  serviceAreaGrid.querySelectorAll(".region-card").forEach((el) => revealObserver.observe(el));
}

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
let testimonialIndex = 0;

function renderTestimonials() {
  if (!testimonialTrack) return;
  testimonialTrack.innerHTML = testimonials
    .map(
      (t) => `
    <blockquote class="testimonial-card">
      ${t.draft ? '<span class="testimonial-draft">Sample review — replace with client quote</span>' : ""}
      <p>"${t.quote}"</p>
      <footer>
        <cite>${t.author}</cite>
        <span>${t.location}</span>
        <span class="testimonial-project">${t.project}</span>
      </footer>
    </blockquote>`
    )
    .join("");
  updateTestimonialPosition();
}

function updateTestimonialPosition() {
  if (!testimonialTrack) return;
  const card = testimonialTrack.querySelector(".testimonial-card");
  if (!card) return;
  const gap = 16;
  const offset = testimonialIndex * (card.offsetWidth + gap);
  testimonialTrack.style.transform = `translate3d(${-offset}px, 0, 0)`;
}

testimonialPrev?.addEventListener("click", () => {
  testimonialIndex = Math.max(0, testimonialIndex - 1);
  updateTestimonialPosition();
});

testimonialNext?.addEventListener("click", () => {
  testimonialIndex = Math.min(testimonials.length - 1, testimonialIndex + 1);
  updateTestimonialPosition();
});

renderTestimonials();
window.addEventListener("resize", updateTestimonialPosition);

/* ── FAQ ── */
const faqList = document.querySelector("[data-faq-list]");
if (faqList) {
  faqList.innerHTML = faqItems
    .map(
      (item, i) => `
    <details class="faq-item scroll-reveal" ${i === 0 ? "open" : ""}>
      <summary>${item.question}</summary>
      <p>${item.answer}</p>
    </details>`
    )
    .join("");
  faqList.querySelectorAll(".faq-item").forEach((el) => revealObserver.observe(el));
}

/* ── Active nav link on scroll ── */
const sections = [...document.querySelectorAll("section[id]")];
const navLinks = [
  ...document.querySelectorAll('.nav a[href^="#"], .nav-dropdown-trigger[href^="#"]'),
];

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach((link) => {
        link.style.color =
          link.getAttribute("href") === `#${id}` ? "var(--text)" : "";
      });
    });
  },
  { threshold: 0.35, rootMargin: "-20% 0px -55% 0px" }
);

sections.forEach((section) => sectionObserver.observe(section));
