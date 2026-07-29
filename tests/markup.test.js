const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

test("contains the approved information architecture", () => {
  for (const id of ["hero", "profile", "labs", "cases", "trajectory", "contact"]) {
    assert.match(html, new RegExp(`<section[^>]+id=["']${id}["']`));
  }
});

test("contains all three lab roots and reset controls", () => {
  for (const id of ["opportunity-radar", "tradeoff-studio", "roadmap-builder"]) {
    assert.match(html, new RegExp(`id=["']${id}["']`));
  }
  assert.equal((html.match(/data-lab-reset/g) || []).length, 3);
});

test("loads local scripts in dependency order", () => {
  const contentPosition = html.indexOf('src="content.js"');
  const labsPosition = html.indexOf('src="labs.js"');
  const appPosition = html.indexOf('src="script.js"');
  assert.ok(contentPosition > -1);
  assert.ok(labsPosition > contentPosition);
  assert.ok(appPosition > labsPosition);
});

test("exposes no phone number and includes approved contact actions", () => {
  assert.doesNotMatch(html, /507\s*906\s*0730/);
  assert.match(html, /mailto:ereenkale@gmail\.com/);
  assert.match(html, /linkedin\.com\/in\/eren-kale/);
  assert.match(html, /github\.com\/Maxixler/);
  assert.match(html, /EREN_KALE_CV\.pdf/);
});

test("external links are safe and controls are real buttons", () => {
  assert.doesNotMatch(html, /<div[^>]+role=["']button["']/);
  for (const match of html.matchAll(/<a[^>]+target=["']_blank["'][^>]*>/g)) {
    assert.match(match[0], /rel=["'][^"']*noopener[^"']*["']/);
  }
  assert.match(html, /<button[^>]+id=["']language-toggle["']/);
});

test("the English fallback announces Turkish as the language-toggle destination", () => {
  assert.match(
    html,
    /<button[^>]+id=["']language-toggle["'][^>]+aria-label=["']Türkçe diline geç["']/,
  );
});

test("gives every selected case the approved five-part narrative", () => {
  for (const title of [
    "Mergen Low-Power Processor",
    "SDR-Based LoRaWAN Analysis",
    "Embedded AI at E3TAM",
  ]) {
    const caseArticle = html.match(
      new RegExp(`<article class=["']case-card["'][\\s\\S]*?<h3[^>]*>${title}</h3>([\\s\\S]*?)</article>`),
    );
    assert.ok(caseArticle, `Missing case article: ${title}`);
    assert.match(
      caseArticle[1],
      /<dt>Opportunity<\/dt>[\s\S]*?<dt>Decision<\/dt>[\s\S]*?<dt>Execution<\/dt>[\s\S]*?<dt>Evidence<\/dt>[\s\S]*?<dt>Strategic insight<\/dt>/,
      `Incomplete narrative for ${title}`,
    );
  }
});

test("keeps compact supporting evidence, publication, and verified project links", () => {
  assert.match(html, /id=["']supporting-evidence["']/);
  for (const evidence of ["PROFEN", "Turkcell", "E3TAM", "T3 Foundation", "400+"]) {
    assert.match(html, new RegExp(evidence));
  }
  for (const url of [
    "github.com/Maxixler/BitirmeProjesi",
    "github.com/Maxixler/LowLevel-CNN",
    "github.com/Maxixler/ComputerVision",
    "github.com/Maxixler/EmbeddedProjects",
    "github.com/Maxixler/DeneyapProjeler",
    "dergipark.org.tr/tr/pub/pajes/article/1815680",
  ]) {
    assert.match(html, new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});
