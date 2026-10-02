(() => {
  "use strict";

  /* ===== CONFIGURAÇÃO ===== */
  // Número com DDI + DDD, só dígitos. Ex.: "5563999999999"
  const WHATSAPP_NUMBER = "INSERIR_NUMERO";
  const WHATSAPP_MESSAGE = "Olá! Vim pelo site da MasterClim e gostaria de agendar uma avaliação.";
  const INSTAGRAM_URL = ""; // inserir URL do Instagram

  /* ===== TRACKING =====
     Envia para dataLayer (GTM), gtag (GA4) e fbq (Meta Pixel), se existirem.
     Os IDs ficam nos snippets colados no <head> do index.html. */
  const track = (name, params = {}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: name, ...params });
    if (typeof window.gtag === "function") window.gtag("event", name, params);
    if (typeof window.fbq === "function") window.fbq("trackCustom", name, params);
  };

  /* ===== WHATSAPP (todos os CTAs usam esta função) ===== */
  const openWhatsApp = (eventName) => {
    track(eventName || "click_whatsapp", { location: "cta" });
    if (!/^\d{10,15}$/.test(WHATSAPP_NUMBER)) {
      console.warn("Defina WHATSAPP_NUMBER em js/script.js (somente dígitos, com DDI).");
      return;
    }
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
    window.open(url, "_blank", "noopener");
  };
  document.querySelectorAll("[data-cta]").forEach((el) =>
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openWhatsApp(el.dataset.event);
    })
  );

  const ig = document.getElementById("ig");
  if (ig && INSTAGRAM_URL) { ig.href = INSTAGRAM_URL; ig.target = "_blank"; }

  /* ===== MENU MOBILE ===== */
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");
  const setMenu = (open) => {
    nav.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  };
  burger.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

  /* ===== FAQ (accordion) ===== */
  document.querySelectorAll(".acc button").forEach((btn) =>
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      document.getElementById(btn.getAttribute("aria-controls")).hidden = open;
    })
  );

  /* ===== REVEAL ON SCROLL ===== */
  const items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    items.forEach((el) => io.observe(el));
  } else items.forEach((el) => el.classList.add("in"));

  /* ===== EVENTOS: view_services, scroll_50, scroll_90 ===== */
  const services = document.getElementById("servicos");
  if (services && "IntersectionObserver" in window) {
    const so = new IntersectionObserver(([en]) => {
      if (en.isIntersecting) { track("view_services"); so.disconnect(); }
    }, { threshold: 0.3 });
    so.observe(services);
  }
  const fired = {};
  window.addEventListener("scroll", () => {
    const h = document.documentElement;
    const pct = ((h.scrollTop + window.innerHeight) / h.scrollHeight) * 100;
    [50, 90].forEach((m) => {
      if (pct >= m && !fired[m]) { fired[m] = true; track("scroll_" + m); }
    });
  }, { passive: true });
})();
