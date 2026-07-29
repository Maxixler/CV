const test = require("node:test");
const assert = require("node:assert/strict");

const { createLabsDocument } = require("./support/dom-fixture.js");

function loadBrowserLabs() {
  const modulePath = require.resolve("../labs.js");
  const document = createLabsDocument();
  const window = {
    document,
    navigator: {},
  };
  global.document = document;
  global.window = window;
  delete require.cache[modulePath];
  const labs = require(modulePath);
  return {
    document,
    labs,
    cleanup() {
      delete require.cache[modulePath];
      delete global.document;
      delete global.window;
    },
  };
}

test("radar initializer handles filtering, keyboard focus, and localization", (t) => {
  const browser = loadBrowserLabs();
  t.after(browser.cleanup);

  const fallback = browser.document.querySelector("[data-radar-fallback]");
  assert.equal(typeof browser.labs.initializeLabs, "function");
  browser.labs.initializeLabs();

  const list = browser.document.querySelector("[data-radar-list]");
  const result = browser.document.querySelector("[data-radar-result]");
  assert.equal(list.hidden, false);
  assert.equal(fallback.hidden, true);
  assert.equal(list.children.length, 5);
  assert.match(result.value, /^Edge AI: impact 84, readiness 76/);

  browser.document.querySelector('[data-radar-context="telecom"]').click();
  assert.deepEqual(
    list.children
      .filter((item) => !item.hidden)
      .map((item) => item.children[0].dataset.opportunitySelect),
    ["sdr", "private-networks"],
  );
  assert.match(result.value, /^Software-Defined Radio:/);

  const privateNetworks = browser.document.querySelector(
    '[data-opportunity-select="private-networks"]',
  );
  privateNetworks.focus();
  assert.equal(browser.document.activeElement, privateNetworks);
  assert.equal(privateNetworks.getAttribute("aria-pressed"), "true");
  assert.match(result.value, /^Private Networks:/);

  browser.document.dispatchEvent({
    type: "portfolio:languagechange",
    detail: { language: "tr" },
  });
  assert.equal(
    browser.document.querySelector('[data-radar-context="all"]').textContent,
    "Tümü",
  );
  assert.match(result.value, /etki 79, hazırlık 71/);
  assert.match(privateNetworks.getAttribute("aria-label"), /etki 79/);
});

test("roadmap initializer moves state, restores keyboard focus, and localizes rerenders", (t) => {
  const browser = loadBrowserLabs();
  t.after(browser.cleanup);

  assert.equal(typeof browser.labs.initializeLabs, "function");
  browser.labs.initializeLabs();

  const summary = browser.document.querySelector("[data-roadmap-summary]");
  assert.equal(
    summary.value,
    "Now: Validate need, Map risks | Next: Build pilot, Measure outcomes | Later: Prepare scaling, Transfer value",
  );

  browser.document.querySelector(
    '[data-roadmap-step="validate-need"][data-roadmap-target="later"]',
  ).click();
  assert.equal(
    summary.value,
    "Now: Map risks | Next: Build pilot, Measure outcomes | Later: Prepare scaling, Transfer value, Validate need",
  );
  assert.equal(browser.document.activeElement.dataset.roadmapStep, "validate-need");
  assert.equal(browser.document.activeElement.disabled, false);

  browser.document.dispatchEvent({
    type: "portfolio:languagechange",
    detail: { language: "tr" },
  });
  assert.equal(
    summary.value,
    "Şimdi: Riskleri haritala | Sonraki: Pilot oluştur, Sonuçları ölç | Daha Sonra: Ölçeklemeyi hazırla, Değeri aktar, İhtiyacı doğrula",
  );
  assert.match(
    browser.document.querySelector(
      '[data-roadmap-step="validate-need"][data-roadmap-target="now"]',
    ).getAttribute("aria-label"),
    /^Taşı İhtiyacı doğrula: Şimdi$/,
  );

  browser.document.querySelector('[data-lab-reset="roadmap"]').click();
  assert.match(summary.value, /^Şimdi: İhtiyacı doğrula, Riskleri haritala/);
  assert.match(summary.value, /Daha Sonra: Ölçeklemeyi hazırla, Değeri aktar$/);
});
