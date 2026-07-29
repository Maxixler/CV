(function createPortfolioApp(globalObject) {
  const STORAGE_KEY = "portfolio-language";

  function normalizeLanguage(value) {
    return typeof value === "string" && value.toLowerCase().startsWith("tr")
      ? "tr"
      : "en";
  }

  function safeLocalStorage(context) {
    try {
      return context?.localStorage ?? null;
    } catch {
      return null;
    }
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

  function getMobileMenuLabels(language) {
    return normalizeLanguage(language) === "tr"
      ? { button: "Men\u00fc", open: "Gezinmeyi a\u00e7", close: "Gezinmeyi kapat" }
      : { button: "Menu", open: "Open navigation", close: "Close navigation" };
  }

  function updateMobileMenuToggle(toggle, language) {
    const labels = getMobileMenuLabels(language);
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.textContent = labels.button;
    toggle.setAttribute("aria-label", expanded ? labels.close : labels.open);
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

    document.querySelectorAll("[data-menu-toggle]").forEach((menuToggle) => {
      updateMobileMenuToggle(menuToggle, resolved);
    });

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
      safeStorageSet(safeLocalStorage(globalObject), STORAGE_KEY, next);
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
    toggle.setAttribute("aria-controls", links.id);
    toggle.setAttribute("aria-expanded", "false");
    updateMobileMenuToggle(toggle, document.documentElement.lang);

    const closeMenu = () => {
      toggle.setAttribute("aria-expanded", "false");
      updateMobileMenuToggle(toggle, document.documentElement.lang);
      links.dataset.open = "false";
    };
    const openMenu = () => {
      toggle.setAttribute("aria-expanded", "true");
      updateMobileMenuToggle(toggle, document.documentElement.lang);
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

  const api = {
    normalizeLanguage,
    safeLocalStorage,
    safeStorageGet,
    safeStorageSet,
    getMobileMenuLabels,
    applyLanguage,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (globalObject) globalObject.PortfolioApp = api;

  if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", () => {
      const stored = safeStorageGet(safeLocalStorage(globalObject), STORAGE_KEY);
      const initial = stored ? normalizeLanguage(stored) : "en";
      applyLanguage(initial);
      initializeLanguageToggle();
      initializeMobileNavigation();
      initializeCurrentYear();
      initializeSectionEnhancement();
    });
  }
}(typeof window !== "undefined" ? window : globalThis));
