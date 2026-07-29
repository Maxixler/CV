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

test("selected cases keep complete equivalent narratives in both languages", () => {
  const narrativeParts = ["opportunity", "decision", "execution", "evidence", "insight"];
  for (const language of SUPPORTED_LANGUAGES) {
    for (const label of narrativeParts) {
      const key = `cases.label.${label}`;
      assert.notEqual(getText(language, key), `[${key}]`, `Missing ${language} key: ${key}`);
    }
    for (const caseId of ["mergen", "sdr", "edgeAi"]) {
      for (const part of narrativeParts) {
        const key = `cases.${caseId}.${part}`;
        assert.notEqual(
          getText(language, key),
          `[${key}]`,
          `Missing ${language} key: ${key}`,
        );
      }
    }
  }

  assert.match(getText("en", "cases.mergen.evidence"), /TÜBİTAK 2209-A.*7th.*Teknofest/);
  assert.match(getText("tr", "cases.mergen.evidence"), /TÜBİTAK 2209-A.*Teknofest.*7\./);
  assert.match(getText("en", "cases.sdr.evidence"), /USRP E310.*GNU Radio.*868 MHz/);
  assert.match(getText("tr", "cases.sdr.evidence"), /USRP E310.*GNU Radio.*868 MHz/);
  assert.match(getText("en", "cases.edgeAi.evidence"), /OpenCV.*TensorFlow.*Raspberry Pi 5/);
  assert.match(getText("tr", "cases.edgeAi.evidence"), /OpenCV.*TensorFlow.*Raspberry Pi 5/);
});

test("trajectory copy is bilingual and limited to verified CV evidence", () => {
  for (const language of SUPPORTED_LANGUAGES) {
    for (const item of [
      "marmara",
      "ataturk",
      "ilmenau",
      "industry",
      "publicationLeadership",
    ]) {
      for (const field of ["title", "body"]) {
        const key = `trajectory.${item}.${field}`;
        assert.notEqual(getText(language, key), `[${key}]`, `Missing ${language} key: ${key}`);
      }
    }
  }

  const englishTrajectory = Object.entries(content.en)
    .filter(([key]) => key.startsWith("trajectory."))
    .map(([, value]) => value)
    .join(" ");
  assert.doesNotMatch(englishTrajectory, /microelectronics/i);
  assert.match(englishTrajectory, /PROFEN.*Turkcell.*E3TAM.*T3 Foundation/s);
  assert.match(englishTrajectory, /400\+.*Teknofest/s);
});
