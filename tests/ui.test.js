const test = require("node:test");
const assert = require("node:assert/strict");

const {
  normalizeLanguage,
  safeStorageGet,
  safeStorageSet,
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
