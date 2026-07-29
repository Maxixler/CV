const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const netlify = fs.readFileSync(path.join(root, "netlify.toml"), "utf8");
const staticHeaders = fs.readFileSync(path.join(root, "_headers"), "utf8");

function netlifyCacheControl(assetPattern) {
  const blocks = netlify.split("[[headers]]").slice(1);
  const block = blocks.find((candidate) => (
    candidate.match(/\bfor\s*=\s*"([^"]+)"/)?.[1] === assetPattern
  ));
  return block?.match(/\bCache-Control\s*=\s*"([^"]+)"/)?.[1] ?? null;
}

function staticCacheControl(assetPattern) {
  const escapedPattern = assetPattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return staticHeaders.match(
    new RegExp(`(?:^|\\n)${escapedPattern}\\r?\\n\\s+Cache-Control:\\s*([^\\r\\n]+)`),
  )?.[1] ?? null;
}

test("stable CSS and JavaScript filenames always revalidate in both header configs", () => {
  for (const assetPattern of ["/*.css", "/*.js"]) {
    assert.equal(
      netlifyCacheControl(assetPattern),
      "public, max-age=0, must-revalidate",
      `Unsafe Netlify cache policy for ${assetPattern}`,
    );
    assert.equal(
      staticCacheControl(assetPattern),
      "public, max-age=0, must-revalidate",
      `Unsafe static header policy for ${assetPattern}`,
    );
  }
});
