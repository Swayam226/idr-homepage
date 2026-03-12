const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function setYear() {
  const el = $("#year");
  if (el) el.textContent = String(new Date().getFullYear());
}

function initMobileNav() {
  const toggle = $(".nav__toggle");
  const links = $("#nav-links");
  if (!toggle || !links) return;

  const setOpen = (open) => {
    links.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    const sr = toggle.querySelector(".sr-only");
    if (sr) sr.textContent = open ? "Close menu" : "Open menu";
  };

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    setOpen(!open);
  });

  $$(".nav__link, .btn", links).forEach((a) => {
    a.addEventListener("click", () => setOpen(false));
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });


  document.addEventListener("click", (e) => {
    if (!links.classList.contains("is-open")) return;
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (links.contains(target) || toggle.contains(target)) return;
    setOpen(false);
  });
}

function initStickyNavStyle() {
  const nav = $(".nav");
  if (!nav) return;
  const onScroll = () => {
    nav.classList.toggle("nav--scrolled", window.scrollY > 6);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function initActiveSectionHighlight() {
  const links = $$(".nav__link");
  const sections = links
    .map((a) => {
      const href = a.getAttribute("href") || "";
      if (!href.startsWith("#")) return null;
      const el = document.getElementById(href.slice(1));
      return el ? { a, el } : null;
    })
    .filter(Boolean);

  if (!sections.length) return;

  const setCurrent = (current) => {
    for (const s of sections) {
      s.a.setAttribute("aria-current", s === current ? "true" : "false");
    }
  };

  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => (a.boundingClientRect.top > b.boundingClientRect.top ? 1 : -1));

      if (!visible.length) return;
      const topEl = visible[0].target;
      const current = sections.find((s) => s.el === topEl);
      if (current) setCurrent(current);
    },
    {
      root: null,
      threshold: [0.2, 0.35, 0.55],
      rootMargin: "-25% 0px -65% 0px",
    },
  );

  sections.forEach((s) => io.observe(s.el));
}

function initContactForm() {
  const form = $("#contact-form");
  const status = $("#form-status");
  if (!form || !status) return;

  const setStatus = (msg, kind) => {
    status.textContent = msg;
    status.classList.remove("form__status--error", "form__status--ok");
    if (kind === "error") status.classList.add("form__status--error");
    if (kind === "ok") status.classList.add("form__status--ok");
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#name")?.value?.trim() ?? "";
    const email = $("#email")?.value?.trim() ?? "";
    const message = $("#message")?.value?.trim() ?? "";

    if (!name || !email || !message) {
      setStatus("Please complete name, email, and message.", "error");
      return;
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      setStatus("Please enter a valid email address.", "error");
      return;
    }

    setStatus("Thanks — your interest has been recorded (demo). We’ll be in touch.", "ok");
    form.reset();
  });
}

function initScrollProgress() {
  const bar = $("#scroll-progress");
  if (!bar) return;

  const update = () => {
    const doc = document.documentElement;
    const max = Math.max(1, doc.scrollHeight - doc.clientHeight);
    const pct = Math.min(1, Math.max(0, window.scrollY / max));
    bar.style.width = `${Math.round(pct * 100)}%`;
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

function initRevealOnScroll() {
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  const groups = $$(".reveal");
  if (!groups.length) return;

  if (reduceMotion) {
    groups.forEach((g) => g.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("is-visible");
        io.unobserve(e.target);
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -10% 0px" },
  );

  groups.forEach((g) => io.observe(g));
}

function initBackToTop() {
  const btn = $("#toTop");
  if (!btn) return;
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

  const update = () => {
    btn.classList.toggle("is-visible", window.scrollY > 600);
  };
  update();
  window.addEventListener("scroll", update, { passive: true });

  // Keep native anchor behavior, but reduce motion if requested.
  btn.addEventListener("click", (e) => {
    if (!reduceMotion) return;
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "auto" });
    location.hash = "#top";
  });
}

function initCardTilt() {
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  if (reduceMotion) return;

  const canHover = window.matchMedia?.("(hover: hover) and (pointer: fine)")?.matches ?? false;
  if (!canHover) return;

  const cards = $$("[data-tilt]");
  if (!cards.length) return;

  for (const card of cards) {
    if (!$(".card__shine", card)) {
      const shine = document.createElement("div");
      shine.className = "card__shine";
      card.appendChild(shine);
    }

    const onMove = (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const rx = (0.5 - py) * 6;
      const ry = (px - 0.5) * 8;

      card.style.setProperty("--mx", `${Math.round(px * 100)}%`);
      card.style.setProperty("--my", `${Math.round(py * 100)}%`);
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
    };

    const onLeave = () => {
      card.style.transform = "";
    };

    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);
  }
}

setYear();
initMobileNav();
initStickyNavStyle();
initActiveSectionHighlight();
initContactForm();
initScrollProgress();
initRevealOnScroll();
initBackToTop();
initCardTilt();
