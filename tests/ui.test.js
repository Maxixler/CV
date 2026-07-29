const test = require("node:test");
const assert = require("node:assert/strict");

const {
  normalizeLanguage,
  safeLocalStorage,
  safeStorageGet,
  safeStorageSet,
  getMobileMenuLabels,
  updateCaseLabel,
} = require("../script.js");

test("normalizes language to en or tr", () => {
  assert.equal(normalizeLanguage("tr"), "tr");
  assert.equal(normalizeLanguage("tr-TR"), "tr");
  assert.equal(normalizeLanguage("en-US"), "en");
  assert.equal(normalizeLanguage("de"), "en");
  assert.equal(normalizeLanguage(null), "en");
});

test("storage helpers survive unavailable storage", () => {
  const brokenStorage = {
    getItem() { throw new Error("blocked"); },
    setItem() { throw new Error("blocked"); },
  };
  assert.equal(safeStorageGet(brokenStorage, "portfolio-language"), null);
  assert.equal(safeStorageSet(brokenStorage, "portfolio-language", "tr"), false);
});

test("storage helpers read and write when available", () => {
  const values = new Map();
  const storage = {
    getItem(key) { return values.get(key) ?? null; },
    setItem(key, value) { values.set(key, value); },
  };
  assert.equal(safeStorageSet(storage, "portfolio-language", "tr"), true);
  assert.equal(safeStorageGet(storage, "portfolio-language"), "tr");
});

test("safe local-storage access survives a throwing property getter", () => {
  const privateContext = {};
  Object.defineProperty(privateContext, "localStorage", {
    get() { throw new Error("blocked"); },
  });

  assert.equal(safeLocalStorage(privateContext), null);
});

test("returns Turkish labels for the mobile navigation control", () => {
  assert.deepEqual(getMobileMenuLabels("tr"), {
    button: "Menü",
    open: "Gezinmeyi aç",
    close: "Gezinmeyi kapat",
  });
});

test("updates a case narrative label from its translated content key", () => {
  const label = { tagName: "DT", textContent: "Evidence" };
  const detail = {
    dataset: { i18n: "cases.mergen.evidence" },
    previousElementSibling: label,
  };
  const getText = (language, key) => (
    language === "tr" && key === "cases.label.evidence" ? "Kanıt" : `[${key}]`
  );

  assert.equal(updateCaseLabel(detail, "tr", getText), true);
  assert.equal(label.textContent, "Kanıt");
  assert.equal(
    updateCaseLabel({ dataset: { i18n: "cases.heading" } }, "tr", getText),
    false,
  );
});
