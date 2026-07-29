const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const css = fs.readFileSync(path.join(__dirname, "..", "style.css"), "utf8");

function ruleFor(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`));
  assert.ok(match, `Expected a CSS rule for ${selector}`);
  return match[1];
}

function colorValue(token) {
  const match = css.match(new RegExp(`${token}:\\s*(#[0-9A-F]{6})`, "i"));
  assert.ok(match, `Expected ${token} to be a six-digit hex color`);
  return match[1];
}

function contrastRatio(hexA, hexB) {
  const luminance = (hex) => {
    const channels = hex.slice(1).match(/.{2}/g).map((value) => parseInt(value, 16) / 255);
    const linear = channels.map((value) => (
      value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
    ));
    return (0.2126 * linear[0]) + (0.7152 * linear[1]) + (0.0722 * linear[2]);
  };

  const a = luminance(hexA);
  const b = luminance(hexB);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

test("defines the approved palette", () => {
  for (const value of ["#F4E7D3", "#211B17", "#2947A9", "#D64D30", "#F0BC3B"]) {
    assert.ok(css.toUpperCase().includes(value));
  }
});

test("contains responsive, focus, and reduced-motion rules", () => {
  assert.match(css, /@media\s*\(max-width:\s*900px\)/);
  assert.match(css, /@media\s*\(max-width:\s*640px\)/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});

test("does not retain the previous particle or glass-card system", () => {
  assert.doesNotMatch(css, /particles-canvas/);
  assert.doesNotMatch(css, /\.glass-card/);
});

test("keeps mobile navigation visible until menu enhancement is active", () => {
  const mobile = css.slice(css.indexOf("@media (max-width: 640px)"));
  assert.match(mobile, /\.nav-links\s*\{[^}]*display:\s*grid;/s);
  assert.match(
    mobile,
    /\.site-header\[data-menu-enhanced="true"\]:has\(\[data-menu-toggle\]\[aria-controls\]\[aria-expanded\]\)\s+\.nav-links:not\(\[data-open="true"\]\)\s*\{[^}]*display:\s*none;/s,
  );
});

test("uses a two-color focus indicator that contrasts on light and dark surfaces", () => {
  assert.match(css, /--focus-ring:\s*3px solid var\(--ink\);/);
  assert.match(
    ruleFor(":focus-visible"),
    /box-shadow:\s*0 0 0 6px var\(--signal-yellow\)\s*!important;/,
  );
});

test("gives language and range controls 44px touch targets", () => {
  assert.match(ruleFor("#language-toggle"), /min-height:\s*44px;/);
  assert.match(ruleFor("#language-toggle"), /min-width:\s*44px;/);
  assert.match(ruleFor('.lab-card input[type="range"]'), /min-height:\s*44px;/);
});

test("uses an accessible vermilion surface for small light text", () => {
  const foreground = colorValue("--paper-light");
  const background = colorValue("--vermilion-deep");
  assert.ok(contrastRatio(foreground, background) >= 4.5);
  assert.match(ruleFor(".lab-card:nth-child(3)"), /background:\s*var\(--vermilion-deep\);/);
});

test("separates compact radar markers from full-size selection controls", () => {
  const marker = ruleFor(".radar-marker");
  assert.match(marker, /width:\s*0\.5rem;/);
  assert.match(marker, /height:\s*0\.5rem;/);
  assert.match(marker, /pointer-events:\s*none;/);

  const listButton = ruleFor("[data-radar-list] button");
  assert.match(listButton, /width:\s*100%;/);
  assert.match(listButton, /min-height:\s*44px;/);
  assert.doesNotMatch(css, /\[data-radar-plot\]\s+button/);
});

test("styles the no-JavaScript availability notice", () => {
  const notice = ruleFor(".noscript-note");
  assert.match(notice, /border:/);
  assert.match(notice, /background:/);
  assert.match(notice, /color:/);
});
