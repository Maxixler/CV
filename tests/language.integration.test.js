const test = require("node:test");
const assert = require("node:assert/strict");

const { createPortfolioDocument } = require("./support/dom-fixture.js");

function loadPortfolioBrowser() {
  const modulePaths = [
    require.resolve("../content.js"),
    require.resolve("../labs.js"),
    require.resolve("../script.js"),
  ];
  const document = createPortfolioDocument();
  const window = { document, navigator: {} };

  global.document = document;
  global.window = window;
  global.CustomEvent = class CustomEvent {
    constructor(type, init = {}) {
      this.type = type;
      this.detail = init.detail;
    }
  };
  modulePaths.forEach((modulePath) => delete require.cache[modulePath]);

  const content = require("../content.js");
  const labs = require("../labs.js");
  const app = require("../script.js");
  return {
    app,
    content,
    document,
    labs,
    cleanup() {
      modulePaths.forEach((modulePath) => delete require.cache[modulePath]);
      delete global.CustomEvent;
      delete global.document;
      delete global.window;
    },
  };
}

test("switching to Turkish updates visible chrome, accessible names, and radar labels", (t) => {
  const browser = loadPortfolioBrowser();
  t.after(browser.cleanup);
  browser.labs.initializeLabs();

  browser.document.querySelector('[data-radar-context="telecom"]').click();
  browser.document.querySelector(
    '[data-opportunity-select="private-networks"]',
  ).focus();
  browser.app.applyLanguage("tr");

  assert.equal(browser.document.documentElement.lang, "tr");
  assert.equal(
    browser.document.querySelector("nav").getAttribute("aria-label"),
    "Ana gezinme",
  );
  assert.equal(
    browser.document.querySelector('[data-i18n="a11y.skipToContent"]').textContent,
    "İçeriğe geç",
  );
  assert.equal(
    browser.document.querySelector("img").getAttribute("alt"),
    "Eren Kale portresi, Strateji ve İnovasyon Mühendisi",
  );
  assert.equal(
    browser.document.querySelector("figcaption").textContent,
    "Mühendislik × iş dünyası × liderlik",
  );
  assert.equal(
    browser.document.getElementById("supporting-evidence-heading").textContent,
    "Destekleyici kanıtlar / proje dizini",
  );
  assert.equal(
    browser.document.querySelector('[data-i18n="supporting.industry.profen"]').textContent,
    "PROFEN — dijital tasarım",
  );
  assert.equal(
    browser.document.querySelector('[data-i18n="supporting.github.sdr"]').textContent,
    "SDR tabanlı sinyal analizi",
  );
  assert.equal(
    browser.document.querySelector('[data-i18n="footer.copy"]').textContent,
    "© 2026 Eren Kale. Mühendislik temelli strateji ve inovasyon.",
  );
  assert.equal(
    browser.document.querySelector('[data-i18n="hero.secondaryCta"]').textContent,
    "CV'yi görüntüle",
  );

  const toggle = browser.document.getElementById("language-toggle");
  assert.equal(toggle.getAttribute("aria-pressed"), null);
  assert.equal(toggle.getAttribute("aria-label"), "İngilizce diline geç");

  const privateNetworks = browser.document.querySelector(
    '[data-opportunity-select="private-networks"]',
  );
  assert.match(privateNetworks.textContent, /^Özel Ağlar · 79\/71$/);
  assert.match(privateNetworks.getAttribute("aria-label"), /^Özel Ağlar, etki 79/);
  assert.match(
    browser.document.querySelector("[data-radar-result]").value,
    /^Özel Ağlar: etki 79, hazırlık 71/,
  );
});

test("the CV action describes its navigation behavior in both languages", () => {
  assert.equal(require("../content.js").getText("en", "hero.secondaryCta"), "View CV");
  assert.equal(
    require("../content.js").getText("tr", "hero.secondaryCta"),
    "CV'yi görüntüle",
  );
});
