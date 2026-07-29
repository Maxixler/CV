const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const css = fs.readFileSync(path.join(__dirname, "..", "style.css"), "utf8");

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
