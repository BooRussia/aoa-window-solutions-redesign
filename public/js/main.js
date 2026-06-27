const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const form = document.getElementById("estimate-form");
const themeToggle = document.querySelector("[data-theme-toggle]");
const scrollProgress = document.querySelector("[data-scroll-progress]");
const heroParallax = document.querySelector("[data-parallax]");
const slowParallax = document.querySelectorAll("[data-parallax-slow]");

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

/* ── Scroll progress + parallax ── */
function onScroll() {
  setHeaderState();

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
  .querySelectorAll(".scroll-in, .scroll-reveal, .media-frame")
  .forEach((el) => revealObserver.observe(el));

/* Hero lines animate immediately on load */
requestAnimationFrame(() => {
  document.querySelectorAll(".hero .scroll-in").forEach((el) => {
    el.classList.add("is-visible");
  });
});

/* ── Product rail drag scroll (desktop) ── */
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

/* ── Form ── */
form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = form.querySelector("#name")?.value?.trim();
  alert(
    `Thanks${name ? `, ${name}` : ""}! This is a design preview — we'll connect the form before launch.`
  );
  form.reset();
});

/* ── Active nav link on scroll ── */
const sections = [...document.querySelectorAll("section[id]")];
const navLinks = [...document.querySelectorAll('.nav a[href^="#"], .nav-dropdown-trigger[href^="#"]')];

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
