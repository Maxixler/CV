(function createPortfolioApp(globalObject) {
  const STORAGE_KEY = "portfolio-language";

  function normalizeLanguage(value) {
    return typeof value === "string" && value.toLowerCase().startsWith("tr")
      ? "tr"
      : "en";
  }

  function safeStorageGet(storage, key) {
    try {
      return storage?.getItem(key) ?? null;
    } catch {
      return null;
    }
  }

  function safeStorageSet(storage, key, value) {
    if (!storage) return false;
    try {
      storage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  }

  function applyLanguage(language) {
    if (typeof document === "undefined" || !globalObject?.PortfolioContent) return;

    const resolved = normalizeLanguage(language);
    const { getText } = globalObject.PortfolioContent;
    if (typeof getText !== "function") return;

    document.documentElement.lang = resolved;
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      element.textContent = getText(resolved, element.dataset.i18n);
    });
    document.title = getText(resolved, "meta.title");

    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute("content", getText(resolved, "meta.description"));
    }

    const toggle = document.getElementById("language-toggle");
    if (toggle) {
      toggle.setAttribute("aria-pressed", String(resolved === "tr"));
      toggle.setAttribute(
        "aria-label",
        resolved === "en" ? "T\u00fcrk\u00e7e diline ge\u00e7" : "Switch to English",
      );
    }

    if (typeof CustomEvent === "function") {
      document.dispatchEvent(new CustomEvent("portfolio:languagechange", {
        detail: { language: resolved },
      }));
    }
  }

  function initializeLanguageToggle() {
    const toggle = document.getElementById("language-toggle");
    if (!toggle) return;

    toggle.addEventListener("click", () => {
      const next = document.documentElement.lang === "tr" ? "en" : "tr";
      applyLanguage(next);
      safeStorageSet(globalObject.localStorage, STORAGE_KEY, next);
    });
  }

  function initializeMobileNavigation() {
    const header = document.querySelector(".site-header");
    const links = header?.querySelector(".nav-links");
    if (!header || !links) return;

    links.id ||= "primary-navigation";
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.dataset.menuToggle = "true";
    toggle.textContent = "Menu";
    toggle.setAttribute("aria-controls", links.id);
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");

    const closeMenu = () => {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
      links.dataset.open = "false";
    };
    const openMenu = () => {
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close navigation");
      links.dataset.open = "true";
    };

    toggle.addEventListener("click", () => {
      if (toggle.getAttribute("aria-expanded") === "true") closeMenu();
      else openMenu();
    });
    links.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

    header.querySelector("nav")?.append(toggle);
    header.dataset.menuEnhanced = "true";
  }

  function initializeCurrentYear() {
    const currentYear = String(new Date().getFullYear());
    document.querySelectorAll("[data-current-year]").forEach((element) => {
      element.textContent = currentYear;
    });
  }

  function initializeSectionEnhancement() {
    if (typeof IntersectionObserver !== "function") return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.dataset.inView = "true";
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll("main > section").forEach((section) => observer.observe(section));
  }

  const api = { normalizeLanguage, safeStorageGet, safeStorageSet, applyLanguage };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (globalObject) globalObject.PortfolioApp = api;

  if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", () => {
      const stored = safeStorageGet(globalObject.localStorage, STORAGE_KEY);
      const initial = stored ? normalizeLanguage(stored) : "en";
      applyLanguage(initial);
      initializeLanguageToggle();
      initializeMobileNavigation();
      initializeCurrentYear();
      initializeSectionEnhancement();
    });
  }
}(typeof window !== "undefined" ? window : globalThis));
