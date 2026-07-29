const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const notFoundHtml = fs.readFileSync(path.join(__dirname, "..", "404.html"), "utf8");
const sitemap = fs.readFileSync(path.join(__dirname, "..", "sitemap.xml"), "utf8");

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
    /<button[^>]+id=["']language-toggle["'][^>]+aria-label=["']Switch to Turkish["']/,
  );
  const toggle = html.match(/<button[^>]+id=["']language-toggle["'][^>]*>/)?.[0] || "";
  assert.doesNotMatch(toggle, /aria-pressed=/);
});

test("the CV action honestly describes opening the document", () => {
  assert.match(
    html,
    /<a[^>]+href=["']EREN_KALE_CV\.pdf["'][^>]+data-i18n=["']hero\.secondaryCta["'][^>]*>View CV<\/a>/,
  );
});

test("the sitemap identifies the current portfolio release", () => {
  assert.match(sitemap, /<lastmod>2026-07-29<\/lastmod>/);
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

test("contains verified strategic evidence", () => {
  for (const evidence of [
    "Teknofest",
    "7th",
    "USRP E310",
    "PROFEN",
    "Turkcell",
    "E3TAM",
    "400+",
  ]) {
    assert.ok(html.includes(evidence), `Missing evidence: ${evidence}`);
  }
});

test("uses optimized portrait and complete metadata", () => {
  assert.match(html, /vesikalik_optimized\.jpg/);
  assert.match(html, /<meta[^>]+property=["']og:title["']/);
  assert.match(html, /<meta[^>]+property=["']og:image["'][^>]+og\.png/);
  assert.match(html, /<meta[^>]+name=["']twitter:card["']/);
  assert.match(html, /<html[^>]+lang=["']en["']/);
  assert.equal(fs.existsSync(path.join(__dirname, "..", "og.png")), true);
});

test("the social preview is a 1200 by 630 PNG", () => {
  const socialCard = fs.readFileSync(path.join(__dirname, "..", "og.png"));
  assert.deepEqual(
    [...socialCard.subarray(0, 8)],
    [137, 80, 78, 71, 13, 10, 26, 10],
  );
  assert.equal(socialCard.readUInt32BE(16), 1200);
  assert.equal(socialCard.readUInt32BE(20), 630);
});

test("keeps fallback content and lab results accessible", () => {
  assert.match(
    html,
    /<noscript>\s*<p class=["']noscript-note["']>Interactive labs are shown as static examples because JavaScript is unavailable\. All portfolio and contact content remains accessible\.<\/p>\s*<\/noscript>/,
  );
  assert.match(
    html,
    /<img[^>]+src=["']vesikalik_optimized\.jpg["'][^>]+alt=["']Portrait of Eren Kale, Strategy &amp; Innovation Engineer["']/,
  );
  for (const output of html.matchAll(/<output\b[^>]*>/g)) {
    assert.match(output[0], /aria-live=["']polite["']/);
  }
  assert.equal((html.match(/<input[^>]+type=["']range["']/g) || []).length, 4);
  assert.equal(
    (html.match(/<label>[\s\S]*?<input[^>]+type=["']range["'][^>]*>[\s\S]*?<\/label>/g) || []).length,
    4,
  );
  assert.match(
    html,
    /data-radar-filters[^>]+role=["']group["'][^>]+aria-label=["'][^"']+["']/,
  );
  for (const stage of ["now", "next", "later"]) {
    assert.match(
      html,
      new RegExp(`<section[^>]+aria-labelledby=["']roadmap-${stage}["']`),
    );
  }
});

test("the 404 page uses the approved palette and offers a home link", () => {
  for (const value of ["#F4E7D3", "#211B17", "#2947A9", "#D64D30", "#F0BC3B"]) {
    assert.ok(notFoundHtml.toUpperCase().includes(value));
  }
  assert.match(notFoundHtml, /<a[^>]+href=["']\/["'][^>]*>/);
  assert.doesNotMatch(notFoundHtml, /#0a0a0f|#00d4ff|#7c3aed/i);
});
