const test = require("node:test");
const assert = require("node:assert/strict");

const {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  content,
  getText,
  validateContentParity,
} = require("../content.js");

test("English is the default and both languages are supported", () => {
  assert.equal(DEFAULT_LANGUAGE, "en");
  assert.deepEqual(SUPPORTED_LANGUAGES, ["en", "tr"]);
});

test("English and Turkish dictionaries have identical keys", () => {
  const result = validateContentParity();
  assert.equal(result.valid, true, JSON.stringify(result.missing));
  assert.deepEqual(Object.keys(content.en).sort(), Object.keys(content.tr).sort());
});

test("required positioning and CTA copy is present in both languages", () => {
  for (const language of SUPPORTED_LANGUAGES) {
    assert.ok(getText(language, "meta.title"));
    assert.ok(getText(language, "hero.role").includes(language === "en" ? "Strategy" : "Strateji"));
    assert.ok(getText(language, "hero.primaryCta"));
    assert.ok(getText(language, "contact.heading"));
  }
});

test("unknown language falls back to English and unknown key is visible", () => {
  assert.equal(getText("de", "hero.role"), content.en["hero.role"]);
  assert.equal(getText("en", "missing.key"), "[missing.key]");
});

test("public content does not contain the CV phone number", () => {
  const allCopy = JSON.stringify(content);
  assert.doesNotMatch(allCopy, /507\s*906\s*0730/);
});
