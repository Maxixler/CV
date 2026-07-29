# Strategy & Innovation Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild Eren Kale's static CV website as a bilingual, editorial Strategy & Innovation Engineer portfolio with three accessible interactive innovation labs.

**Architecture:** Preserve the dependency-free static site and Netlify compatibility. Render complete English fallback content in semantic HTML, bind equivalent Turkish copy from a local content module, keep general UI enhancement separate from deterministic lab logic, and test pure behavior plus markup/CSS contracts with Node's built-in test runner.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, Canvas-free CSS visuals, browser `localStorage`, Node.js built-in `node:test`, existing Netlify configuration.

## Global Constraints

- English is the default language; Turkish is available through a persistent EN/TR switch.
- The primary positioning is **Strategy & Innovation Engineer**.
- The primary CTA is **Discuss an opportunity**; the secondary CTA is **Download CV**.
- Preserve the static, dependency-light architecture and Netlify compatibility; do not add a framework or backend.
- Use `EREN_KALE_CV.pdf` and verified existing project links as the factual sources.
- Keep GitHub project links under `github.com/Maxixler`.
- Do not expose the phone number from the CV.
- Do not add analytics, cookies, user accounts, a contact form, external scoring APIs, a CMS, or unverified impact claims.
- Keep the approved palette: paper `#F4E7D3`, ink `#211B17`, cobalt `#2947A9`, vermilion `#D64D30`, and signal yellow `#F0BC3B`.
- Essential profile, case-study, experience, and contact content must remain readable without JavaScript.
- Every interactive control must be keyboard accessible, touch friendly, visibly focusable, and compatible with reduced motion.
- Preserve unrelated working-tree changes to `EREN_KALE_CV.pdf` and `profile_avatar.png`.

## File Structure

- `index.html`: semantic document, English no-JavaScript fallback, lab controls, contact actions, metadata
- `style.css`: approved design tokens, editorial layout, component styles, responsive rules, reduced-motion behavior
- `content.js`: bilingual content dictionary, content lookup, parity validation
- `labs.js`: curated lab data, deterministic calculations, lab state, browser renderers
- `script.js`: navigation, language switching, preference storage, progressive enhancement
- `tests/content.test.js`: translation parity and content contract
- `tests/markup.test.js`: semantic structure, privacy, scripts, links, and accessible control contract
- `tests/labs.test.js`: opportunity classification, score boundaries, roadmap output
- `tests/ui.test.js`: language normalization and storage-failure fallbacks
- `tests/styles.test.js`: palette, breakpoints, focus, and reduced-motion contract
- `README.md`: updated content model and maintenance instructions

---

### Task 1: Bilingual Content Contract

**Files:**
- Create: `content.js`
- Create: `tests/content.test.js`

**Interfaces:**
- Produces: `DEFAULT_LANGUAGE: "en"`
- Produces: `SUPPORTED_LANGUAGES: readonly ["en", "tr"]`
- Produces: `content: Record<"en" | "tr", Record<string, string>>`
- Produces: `getText(language: string, key: string): string`
- Produces: `validateContentParity(): { valid: boolean, missing: Record<string, string[]> }`
- Browser global: `window.PortfolioContent`
- Node export: `module.exports`

- [ ] **Step 1: Write failing translation-contract tests**

Create `tests/content.test.js`:

```js
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
```

- [ ] **Step 2: Run the tests and verify the expected failure**

Run:

```powershell
node --test tests/content.test.js
```

Expected: FAIL because `content.js` does not exist.

- [ ] **Step 3: Implement the bilingual dictionary and lookup helpers**

Create `content.js` as a browser-and-Node compatible module:

```js
(function createPortfolioContent(globalObject) {
  const DEFAULT_LANGUAGE = "en";
  const SUPPORTED_LANGUAGES = ["en", "tr"];

  const content = {
    en: {
      "meta.title": "Eren Kale | Strategy & Innovation Engineer",
      "meta.description": "Engineering depth, business insight, and emerging technologies—turned into decisions, systems, and growth.",
      "nav.profile": "Profile",
      "nav.labs": "Innovation Labs",
      "nav.cases": "Selected Cases",
      "nav.trajectory": "Trajectory",
      "nav.contact": "Contact",
      "hero.role": "Strategy & Innovation Engineer",
      "hero.heading": "Turning emerging technology into decisions, systems, and growth.",
      "hero.body": "I connect engineering depth, business insight, and leadership to move ideas from technical possibility to practical value.",
      "hero.primaryCta": "Discuss an opportunity",
      "hero.secondaryCta": "Download CV",
      "profile.heading": "One profile. Three connected lenses.",
      "profile.engineering.title": "Engineering depth",
      "profile.engineering.body": "RTL, FPGA, RISC-V, embedded systems, RF/SDR, AI, and telecommunications.",
      "profile.business.title": "Business insight",
      "profile.business.body": "Business studies and a focus on value, trade-offs, adoption, and scalable opportunities.",
      "profile.leadership.title": "Leadership",
      "profile.leadership.body": "Led activities for 400+ members, secured sponsorships, and mentored engineering teams.",
      "labs.heading": "Three small tools. One strategic story.",
      "labs.body": "Explore how I frame opportunities, balance trade-offs, and turn ideas into roadmaps.",
      "radar.title": "Technology Opportunity Radar",
      "radar.body": "Compare curated technologies by strategic impact and readiness.",
      "tradeoff.title": "Engineering Trade-off Studio",
      "tradeoff.body": "Balance impact, speed, risk, and cost to reveal a next action.",
      "roadmap.title": "Innovation Roadmap Builder",
      "roadmap.body": "Arrange a technology opportunity into Now, Next, and Later.",
      "labs.reset": "Reset",
      "cases.heading": "Technical work, reframed as strategic evidence.",
      "cases.mergen.title": "Mergen Low-Power Processor",
      "cases.mergen.body": "Balancing performance, verification, power, and industrial relevance.",
      "cases.sdr.title": "SDR-Based LoRaWAN Analysis",
      "cases.sdr.body": "Building a reusable platform for real-time 868 MHz experimentation.",
      "cases.edgeAi.title": "Embedded AI at E3TAM",
      "cases.edgeAi.body": "Moving computer vision from a model toward an operational edge system.",
      "trajectory.heading": "Proof and trajectory",
      "contact.heading": "Let's explore what technology could unlock next.",
      "contact.body": "If you are shaping an R&D, innovation, or technology strategy challenge, I would be glad to compare perspectives.",
      "contact.email": "Start a conversation",
    },
    tr: {
      "meta.title": "Eren Kale | Strateji ve İnovasyon Mühendisi",
      "meta.description": "Mühendislik derinliğini, iş bakışını ve gelişen teknolojileri kararlara, sistemlere ve büyümeye dönüştürür.",
      "nav.profile": "Profil",
      "nav.labs": "İnovasyon Laboratuvarları",
      "nav.cases": "Seçili Vakalar",
      "nav.trajectory": "Gelişim Çizgisi",
      "nav.contact": "İletişim",
      "hero.role": "Strateji ve İnovasyon Mühendisi",
      "hero.heading": "Gelişen teknolojileri kararlara, sistemlere ve büyümeye dönüştürüyorum.",
      "hero.body": "Fikirleri teknik olasılıktan uygulanabilir değere taşımak için mühendislik derinliğini, iş bakışını ve liderliği bir araya getiriyorum.",
      "hero.primaryCta": "Bir fırsatı konuşalım",
      "hero.secondaryCta": "CV'yi indir",
      "profile.heading": "Tek profil. Birbiriyle bağlantılı üç bakış.",
      "profile.engineering.title": "Mühendislik derinliği",
      "profile.engineering.body": "RTL, FPGA, RISC-V, gömülü sistemler, RF/SDR, yapay zekâ ve telekomünikasyon.",
      "profile.business.title": "İş bakışı",
      "profile.business.body": "İşletme eğitimi; değer, ödünleşimler, benimsenme ve ölçeklenebilir fırsat odağı.",
      "profile.leadership.title": "Liderlik",
      "profile.leadership.body": "400+ üyeye yönelik faaliyetleri yönetti, sponsorluklar sağladı ve mühendislik ekiplerine mentorluk yaptı.",
      "labs.heading": "Üç küçük araç. Tek bir stratejik hikâye.",
      "labs.body": "Fırsatları nasıl çerçevelediğimi, ödünleşimleri nasıl dengelediğimi ve fikirleri yol haritasına nasıl dönüştürdüğümü keşfedin.",
      "radar.title": "Teknoloji Fırsat Radarı",
      "radar.body": "Seçili teknolojileri stratejik etki ve hazırlık düzeyine göre karşılaştırın.",
      "tradeoff.title": "Mühendislik Ödünleşim Stüdyosu",
      "tradeoff.body": "Bir sonraki adımı görmek için etki, hız, risk ve maliyeti dengeleyin.",
      "roadmap.title": "İnovasyon Yol Haritası",
      "roadmap.body": "Bir teknoloji fırsatını Şimdi, Sonraki ve Daha Sonra adımlarına ayırın.",
      "labs.reset": "Sıfırla",
      "cases.heading": "Stratejik kanıta dönüşen teknik çalışmalar.",
      "cases.mergen.title": "Mergen Düşük Güçlü İşlemci",
      "cases.mergen.body": "Performans, doğrulama, güç ve endüstriyel uygunluğu dengelemek.",
      "cases.sdr.title": "SDR Tabanlı LoRaWAN Analizi",
      "cases.sdr.body": "Gerçek zamanlı 868 MHz deneyleri için yeniden kullanılabilir bir platform kurmak.",
      "cases.edgeAi.title": "E3TAM'da Gömülü Yapay Zekâ",
      "cases.edgeAi.body": "Bilgisayarlı görü modelini çalışan bir uç sisteme yaklaştırmak.",
      "trajectory.heading": "Kanıtlar ve gelişim çizgisi",
      "contact.heading": "Teknolojinin sırada neyi mümkün kılabileceğini birlikte keşfedelim.",
      "contact.body": "Bir Ar-Ge, inovasyon veya teknoloji stratejisi problemi üzerinde çalışıyorsanız bakış açılarımızı karşılaştırmak isterim.",
      "contact.email": "Görüşme başlat",
    },
  };

  function getText(language, key) {
    const resolvedLanguage = SUPPORTED_LANGUAGES.includes(language)
      ? language
      : DEFAULT_LANGUAGE;
    return content[resolvedLanguage][key] ?? `[${key}]`;
  }

  function validateContentParity() {
    const referenceKeys = Object.keys(content[DEFAULT_LANGUAGE]);
    const missing = {};
    for (const language of SUPPORTED_LANGUAGES) {
      missing[language] = referenceKeys.filter((key) => !(key in content[language]));
    }
    const valid = Object.values(missing).every((keys) => keys.length === 0)
      && SUPPORTED_LANGUAGES.every(
        (language) => Object.keys(content[language]).length === referenceKeys.length,
      );
    return { valid, missing };
  }

  const api = {
    DEFAULT_LANGUAGE,
    SUPPORTED_LANGUAGES,
    content,
    getText,
    validateContentParity,
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (globalObject) globalObject.PortfolioContent = api;
}(typeof window !== "undefined" ? window : globalThis));
```

- [ ] **Step 4: Run the content tests**

Run:

```powershell
node --test tests/content.test.js
```

Expected: 5 tests PASS.

- [ ] **Step 5: Commit the content contract**

```powershell
git add -- content.js tests/content.test.js
git commit -m "feat: add bilingual portfolio content"
```

---

### Task 2: Semantic Portfolio Structure and Metadata

**Files:**
- Modify: `index.html` (full document rebuild)
- Create: `tests/markup.test.js`

**Interfaces:**
- Consumes: `content.js` browser global
- Produces sections: `#hero`, `#profile`, `#labs`, `#cases`, `#trajectory`, `#contact`
- Produces lab roots: `#opportunity-radar`, `#tradeoff-studio`, `#roadmap-builder`
- Produces language control: `#language-toggle`
- Produces translatable nodes: `[data-i18n="<content key>"]`

- [ ] **Step 1: Write failing semantic-markup tests**

Create `tests/markup.test.js`:

```js
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
```

- [ ] **Step 2: Run the markup tests and verify failures**

Run:

```powershell
node --test tests/markup.test.js
```

Expected: FAIL because the current document lacks the approved section and lab contracts.

- [ ] **Step 3: Rebuild the document head**

Replace the current metadata with:

```html
<title>Eren Kale | Strategy &amp; Innovation Engineer</title>
<meta name="description" content="Engineering depth, business insight, and emerging technologies—turned into decisions, systems, and growth.">
<meta name="theme-color" content="#F4E7D3">
<meta property="og:type" content="website">
<meta property="og:title" content="Eren Kale | Strategy &amp; Innovation Engineer">
<meta property="og:description" content="Engineering depth, business insight, and emerging technologies—turned into decisions, systems, and growth.">
<meta property="og:url" content="https://erenkale.dev/">
<meta property="og:locale" content="en_US">
<meta property="og:locale:alternate" content="tr_TR">
<meta name="twitter:card" content="summary_large_image">
```

Keep the existing security metadata and JSON-LD, but update the role,
description, `sameAs` GitHub value, and image reference to the final assets.
Do not reference the deleted `profile_avatar.png`.

- [ ] **Step 4: Build the semantic page shell with complete English fallback**

Use this top-level structure and fill every section with the factual copy from
the approved design and CV:

```html
<body>
  <a class="skip-link" href="#main-content">Skip to content</a>
  <header class="site-header">
    <nav aria-label="Primary navigation">
      <a class="brand" href="#hero">EREN KALE / 2026</a>
      <div class="nav-links"><!-- approved section links --></div>
      <button id="language-toggle" type="button" aria-label="Türkçe diline geç" aria-pressed="false">EN / TR</button>
    </nav>
  </header>
  <main id="main-content">
    <section id="hero"><!-- English hero and CTAs --></section>
    <section id="profile"><!-- three strategic lenses --></section>
    <section id="labs"><!-- three lab articles and fallbacks --></section>
    <section id="cases"><!-- Mergen, SDR, E3TAM --></section>
    <section id="trajectory"><!-- verified education, experience, leadership --></section>
    <section id="contact"><!-- email, LinkedIn, GitHub --></section>
  </main>
  <footer><!-- copyright and concise positioning --></footer>
  <script src="content.js"></script>
  <script src="labs.js"></script>
  <script src="script.js"></script>
</body>
```

Mark translated text with exact keys:

```html
<p class="eyebrow" data-i18n="hero.role">Strategy &amp; Innovation Engineer</p>
<h1 data-i18n="hero.heading">Turning emerging technology into decisions, systems, and growth.</h1>
<a class="button button-primary" href="mailto:ereenkale@gmail.com?subject=Technology%20opportunity" data-i18n="hero.primaryCta">Discuss an opportunity</a>
```

- [ ] **Step 5: Add accessible lab markup and static fallbacks**

Use native inputs and buttons:

```html
<article id="tradeoff-studio" class="lab-card" aria-labelledby="tradeoff-title">
  <h3 id="tradeoff-title" data-i18n="tradeoff.title">Engineering Trade-off Studio</h3>
  <label>Impact <input name="impact" type="range" min="0" max="100" value="80"></label>
  <label>Speed <input name="speed" type="range" min="0" max="100" value="65"></label>
  <label>Risk <input name="risk" type="range" min="0" max="100" value="40"></label>
  <label>Cost <input name="cost" type="range" min="0" max="100" value="50"></label>
  <output data-tradeoff-result aria-live="polite">Strategic fit: 76 — prototype next.</output>
  <button type="button" data-lab-reset="tradeoff" data-i18n="labs.reset">Reset</button>
</article>
```

Include static explanatory text inside each lab so the concept remains clear
when JavaScript is unavailable.

- [ ] **Step 6: Run markup and content tests**

Run:

```powershell
node --test tests/content.test.js tests/markup.test.js
```

Expected: all tests PASS.

- [ ] **Step 7: Commit the semantic structure**

```powershell
git add -- index.html tests/markup.test.js
git commit -m "feat: rebuild strategic portfolio structure"
```

---

### Task 3: Editorial Visual System and Responsive Layout

**Files:**
- Modify: `style.css` (full visual-system rebuild)
- Create: `tests/styles.test.js`

**Interfaces:**
- Consumes semantic classes and section IDs from Task 2
- Produces CSS tokens: `--paper`, `--ink`, `--cobalt`, `--vermilion`, `--signal-yellow`
- Produces component classes: `.site-header`, `.editorial-grid`, `.poster-block`, `.lab-card`, `.case-card`, `.trajectory-item`, `.button`

- [ ] **Step 1: Write failing CSS contract tests**

Create `tests/styles.test.js`:

```js
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
```

- [ ] **Step 2: Run the CSS tests and verify failure**

Run:

```powershell
node --test tests/styles.test.js
```

Expected: FAIL because the current stylesheet uses the old dark glass theme.

- [ ] **Step 3: Replace global tokens and typography**

Start the stylesheet with:

```css
:root {
  --paper: #F4E7D3;
  --paper-light: #FFF8ED;
  --ink: #211B17;
  --cobalt: #2947A9;
  --vermilion: #D64D30;
  --signal-yellow: #F0BC3B;
  --line: rgba(33, 27, 23, 0.28);
  --font-display: "DM Serif Display", Georgia, serif;
  --font-body: "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", Consolas, monospace;
  --max-width: 1200px;
  --focus-ring: 3px solid var(--signal-yellow);
}

html { scroll-behavior: smooth; }
body {
  margin: 0;
  color: var(--ink);
  background: var(--paper);
  font-family: var(--font-body);
  line-height: 1.6;
}
```

Use the existing Google Fonts CSP allowance for the three families, or reduce
the set to locally available fallbacks if the CSP cannot safely support them.

- [ ] **Step 4: Implement the editorial layout and component styles**

Implement:

```css
.editorial-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(18rem, 0.65fr);
  gap: clamp(2rem, 5vw, 6rem);
}

.poster-block {
  background: var(--cobalt);
  color: var(--paper);
  box-shadow: 0.75rem 0.75rem 0 var(--signal-yellow);
  transform: rotate(1.5deg);
}

.lab-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.lab-card:nth-child(1) { background: var(--ink); color: white; }
.lab-card:nth-child(2) { background: var(--cobalt); color: white; }
.lab-card:nth-child(3) { background: var(--vermilion); color: white; }
```

Give every section an index number, clear heading hierarchy, controlled
asymmetry, crisp borders, and whitespace. Keep the portrait prominent but do
not let it obscure the hero text or CTAs.

- [ ] **Step 5: Implement responsive and accessible state styles**

Add:

```css
:focus-visible {
  outline: var(--focus-ring);
  outline-offset: 4px;
}

@media (max-width: 900px) {
  .editorial-grid,
  .lab-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .site-header nav { align-items: flex-start; }
  .nav-links { display: none; }
  .nav-links[data-open="true"] { display: grid; }
  .button { min-height: 44px; }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Ensure sliders, roadmap controls, language controls, and mobile navigation
expose visible hover, active, focus, and disabled states.

- [ ] **Step 6: Run the CSS and markup contracts**

Run:

```powershell
node --test tests/styles.test.js tests/markup.test.js
```

Expected: all tests PASS.

- [ ] **Step 7: Commit the visual system**

```powershell
git add -- style.css tests/styles.test.js
git commit -m "feat: add signal and silicon visual system"
```

---

### Task 4: Language Switching and Progressive Enhancement

**Files:**
- Modify: `script.js`
- Create: `tests/ui.test.js`

**Interfaces:**
- Consumes: `window.PortfolioContent`
- Produces: `normalizeLanguage(value: unknown): "en" | "tr"`
- Produces: `safeStorageGet(storage, key): string | null`
- Produces: `safeStorageSet(storage, key, value): boolean`
- Produces: `applyLanguage(language): void`
- Browser global: `window.PortfolioApp`
- Node export: `module.exports`

- [ ] **Step 1: Write failing language and storage tests**

Create `tests/ui.test.js`:

```js
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
```

- [ ] **Step 2: Run the tests and verify failure**

Run:

```powershell
node --test tests/ui.test.js
```

Expected: FAIL because the current script does not export the required helpers.

- [ ] **Step 3: Replace old effects with focused UI helpers**

Remove particle-canvas, typing-loop, unused counters, and continuous decorative
animation code. Implement:

```js
(function createPortfolioApp(globalObject) {
  const STORAGE_KEY = "portfolio-language";

  function normalizeLanguage(value) {
    return typeof value === "string" && value.toLowerCase().startsWith("tr")
      ? "tr"
      : "en";
  }

  function safeStorageGet(storage, key) {
    try { return storage?.getItem(key) ?? null; } catch { return null; }
  }

  function safeStorageSet(storage, key, value) {
    if (!storage) return false;
    try { storage.setItem(key, value); return true; } catch { return false; }
  }

  function applyLanguage(language) {
    if (typeof document === "undefined" || !globalObject.PortfolioContent) return;
    const resolved = normalizeLanguage(language);
    const { getText } = globalObject.PortfolioContent;
    document.documentElement.lang = resolved;
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      element.textContent = getText(resolved, element.dataset.i18n);
    });
    document.title = getText(resolved, "meta.title");
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute("content", getText(resolved, "meta.description"));
    }
    const toggle = document.getElementById("language-toggle");
    if (toggle) {
      toggle.setAttribute("aria-pressed", String(resolved === "tr"));
      toggle.setAttribute(
        "aria-label",
        resolved === "en" ? "Türkçe diline geç" : "Switch to English",
      );
    }
    document.dispatchEvent(new CustomEvent("portfolio:languagechange", {
      detail: { language: resolved },
    }));
  }
```

Initialize language from storage and otherwise use English. Add language-toggle,
mobile-navigation, current-year, and restrained IntersectionObserver section
enhancement. Do not hide content before it enters the viewport.

- [ ] **Step 4: Export helpers and guard browser initialization**

Finish with:

```js
  const api = { normalizeLanguage, safeStorageGet, safeStorageSet, applyLanguage };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (globalObject) globalObject.PortfolioApp = api;

  if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", () => {
      const stored = safeStorageGet(globalObject.localStorage, STORAGE_KEY);
      const initial = stored ? normalizeLanguage(stored) : "en";
      applyLanguage(initial);
      document.getElementById("language-toggle")?.addEventListener("click", () => {
        const next = document.documentElement.lang === "tr" ? "en" : "tr";
        applyLanguage(next);
        safeStorageSet(globalObject.localStorage, STORAGE_KEY, next);
      });
    });
  }
}(typeof window !== "undefined" ? window : globalThis));
```

- [ ] **Step 5: Run UI, content, and markup tests**

Run:

```powershell
node --test tests/ui.test.js tests/content.test.js tests/markup.test.js
```

Expected: all tests PASS.

- [ ] **Step 6: Commit progressive enhancement**

```powershell
git add -- script.js tests/ui.test.js
git commit -m "feat: add resilient bilingual interface"
```

---

### Task 5: Interactive Innovation Labs

**Files:**
- Create: `labs.js`
- Create: `tests/labs.test.js`
- Modify: `index.html` (bind controls to lab data attributes)

**Interfaces:**
- Produces: `clamp(value, min, max): number`
- Produces: `classifyOpportunity({ impact, readiness }): "scale" | "pilot" | "research" | "monitor"`
- Produces: `calculateStrategicFit({ impact, speed, risk, cost }): { score: number, recommendation: "prototype" | "validate" | "monitor" }`
- Produces: `buildRoadmapSummary({ now, next, later }, language): string`
- Browser global: `window.InnovationLabs`
- Node export: `module.exports`
- Consumes browser event: `portfolio:languagechange`

- [ ] **Step 1: Write failing deterministic lab tests**

Create `tests/labs.test.js`:

```js
const test = require("node:test");
const assert = require("node:assert/strict");

const {
  clamp,
  classifyOpportunity,
  calculateStrategicFit,
  buildRoadmapSummary,
} = require("../labs.js");

test("clamp keeps all controls within zero and one hundred", () => {
  assert.equal(clamp(-1, 0, 100), 0);
  assert.equal(clamp(55, 0, 100), 55);
  assert.equal(clamp(101, 0, 100), 100);
});

test("opportunity quadrants are deterministic", () => {
  assert.equal(classifyOpportunity({ impact: 80, readiness: 80 }), "scale");
  assert.equal(classifyOpportunity({ impact: 80, readiness: 40 }), "pilot");
  assert.equal(classifyOpportunity({ impact: 40, readiness: 80 }), "monitor");
  assert.equal(classifyOpportunity({ impact: 40, readiness: 40 }), "research");
});

test("strategic fit clamps invalid inputs and returns a bounded score", () => {
  const result = calculateStrategicFit({
    impact: 140,
    speed: 80,
    risk: -20,
    cost: 40,
  });
  assert.ok(result.score >= 0 && result.score <= 100);
  assert.equal(result.recommendation, "prototype");
});

test("low evidence or high burden produces validation or monitoring", () => {
  assert.equal(
    calculateStrategicFit({ impact: 55, speed: 50, risk: 55, cost: 55 }).recommendation,
    "validate",
  );
  assert.equal(
    calculateStrategicFit({ impact: 20, speed: 20, risk: 90, cost: 90 }).recommendation,
    "monitor",
  );
});

test("roadmap summary is complete in English and Turkish", () => {
  const roadmap = {
    now: ["Validate need"],
    next: ["Build pilot"],
    later: ["Scale system"],
  };
  assert.match(buildRoadmapSummary(roadmap, "en"), /Now: Validate need/);
  assert.match(buildRoadmapSummary(roadmap, "tr"), /Şimdi: Validate need/);
});

test("empty roadmap columns produce an explicit prompt", () => {
  const roadmap = { now: [], next: [], later: [] };
  assert.match(buildRoadmapSummary(roadmap, "en"), /Add at least one step/);
  assert.match(buildRoadmapSummary(roadmap, "tr"), /En az bir adım ekleyin/);
});
```

- [ ] **Step 2: Run the lab tests and verify failure**

Run:

```powershell
node --test tests/labs.test.js
```

Expected: FAIL because `labs.js` does not exist.

- [ ] **Step 3: Implement pure calculation functions**

Create `labs.js` with:

```js
(function createInnovationLabs(globalObject) {
  function clamp(value, min, max) {
    const numeric = Number(value);
    const safe = Number.isFinite(numeric) ? numeric : min;
    return Math.min(max, Math.max(min, safe));
  }

  function classifyOpportunity({ impact, readiness }) {
    const safeImpact = clamp(impact, 0, 100);
    const safeReadiness = clamp(readiness, 0, 100);
    if (safeImpact >= 60 && safeReadiness >= 60) return "scale";
    if (safeImpact >= 60) return "pilot";
    if (safeReadiness >= 60) return "monitor";
    return "research";
  }

  function calculateStrategicFit({ impact, speed, risk, cost }) {
    const values = {
      impact: clamp(impact, 0, 100),
      speed: clamp(speed, 0, 100),
      risk: clamp(risk, 0, 100),
      cost: clamp(cost, 0, 100),
    };
    const score = Math.round(
      values.impact * 0.4
      + values.speed * 0.25
      + (100 - values.risk) * 0.2
      + (100 - values.cost) * 0.15,
    );
    const recommendation = score >= 70
      ? "prototype"
      : score >= 45
        ? "validate"
        : "monitor";
    return { score, recommendation };
  }

  function buildRoadmapSummary({ now = [], next = [], later = [] }, language = "en") {
    const hasStep = now.length + next.length + later.length > 0;
    if (!hasStep) {
      return language === "tr"
        ? "En az bir adım ekleyin."
        : "Add at least one step.";
    }
    const labels = language === "tr"
      ? { now: "Şimdi", next: "Sonraki", later: "Daha Sonra" }
      : { now: "Now", next: "Next", later: "Later" };
    return [
      `${labels.now}: ${now.join(", ") || "—"}`,
      `${labels.next}: ${next.join(", ") || "—"}`,
      `${labels.later}: ${later.join(", ") || "—"}`,
    ].join(" | ");
  }
```

- [ ] **Step 4: Implement Opportunity Radar browser behavior**

Use curated local data:

```js
  const opportunities = [
    { id: "edge-ai", label: "Edge AI", impact: 84, readiness: 76, contexts: ["industrial", "embedded"] },
    { id: "risc-v", label: "RISC-V", impact: 88, readiness: 62, contexts: ["industrial", "embedded"] },
    { id: "sdr", label: "Software-Defined Radio", impact: 73, readiness: 68, contexts: ["telecom", "embedded"] },
    { id: "private-networks", label: "Private Networks", impact: 79, readiness: 71, contexts: ["industrial", "telecom"] },
    { id: "chiplets", label: "Chiplets", impact: 82, readiness: 53, contexts: ["industrial"] },
  ];
```

Render dots with CSS percentages, update a details panel on click/focus, filter
without deleting keyboard focus, and announce the selected quadrant through an
`aria-live="polite"` output.

- [ ] **Step 5: Implement Trade-off Studio browser behavior**

For each range input:

```js
input.addEventListener("input", () => {
  const result = calculateStrategicFit(readTradeoffValues(root));
  output.value = `${result.score} — ${recommendationText(result.recommendation, currentLanguage)}`;
  root.style.setProperty("--strategic-fit", `${result.score}%`);
});
```

Reset to `{ impact: 80, speed: 65, risk: 40, cost: 50 }`. Show the formula in a
collapsible explanation and label the result as an illustrative portfolio
demonstration.

- [ ] **Step 6: Implement Roadmap Builder behavior**

Use native buttons to move six fixed steps between Now, Next, and Later. Do not
add drag-and-drop; the button controls are the complete keyboard and touch
interaction.

Update `[data-roadmap-summary]` through `buildRoadmapSummary`. Add a copy button
that uses `navigator.clipboard.writeText` when available and falls back to
selecting the visible summary text. Reset restores:

```js
{
  now: ["Validate need", "Map risks"],
  next: ["Build pilot", "Measure outcomes"],
  later: ["Prepare scaling", "Transfer value"],
}
```

- [ ] **Step 7: Initialize labs and respond to language changes**

Export the API and guard browser initialization:

```js
  const api = {
    clamp,
    classifyOpportunity,
    calculateStrategicFit,
    buildRoadmapSummary,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (globalObject) globalObject.InnovationLabs = api;

  if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", initializeLabs);
    document.addEventListener("portfolio:languagechange", (event) => {
      updateLabLanguage(event.detail.language);
    });
  }
}(typeof window !== "undefined" ? window : globalThis));
```

- [ ] **Step 8: Run all behavior and markup tests**

Run:

```powershell
node --test tests/labs.test.js tests/ui.test.js tests/content.test.js tests/markup.test.js
```

Expected: all tests PASS.

- [ ] **Step 9: Commit the innovation labs**

```powershell
git add -- labs.js index.html tests/labs.test.js
git commit -m "feat: add interactive innovation labs"
```

---

### Task 6: Final Content, Accessibility, and Delivery Validation

**Files:**
- Modify: `index.html`
- Modify: `style.css`
- Modify: `content.js`
- Modify: `README.md`
- Modify: `404.html`
- Create: `og.png`
- Test: `tests/*.test.js`

**Interfaces:**
- Consumes every module and DOM contract from Tasks 1-5
- Produces the final static portfolio and maintenance documentation

- [ ] **Step 1: Add an integration contract for factual and delivery details**

Append to `tests/markup.test.js`:

```js
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
```

- [ ] **Step 2: Run the full suite and confirm any remaining failures**

Run:

```powershell
node --test tests/content.test.js tests/markup.test.js tests/labs.test.js tests/ui.test.js tests/styles.test.js
```

Expected: any failure identifies missing final evidence, metadata, or style
contract. Do not weaken assertions to make incomplete work pass.

- [ ] **Step 3: Complete factual case and trajectory copy**

Check each claim against `EREN_KALE_CV.pdf`. Use:

```text
Mergen:
Opportunity — Explore a low-power processor for industrial applications.
Decision — Prioritize a verifiable RISC-V architecture and disciplined RTL design.
Execution — Contribute to processor design and verification in the HexaChipsters team.
Evidence — TÜBİTAK 2209-A support and 7th place nationwide at Teknofest.
Strategic insight — Technical performance creates value only when verification, power, and application fit advance together.
```

Write equivalent Turkish content in `content.js`. Repeat the same five-part
structure for SDR-Based LoRaWAN Analysis and Embedded AI at E3TAM without adding
unsupported metrics.

- [ ] **Step 4: Generate and wire the social preview**

Generate exactly one cohesive landscape social card using this brief:

```text
Create a 1200×630 social preview card for Eren Kale's portfolio.
Use a warm paper background (#F4E7D3), ink (#211B17), cobalt (#2947A9),
vermilion (#D64D30), and signal yellow (#F0BC3B). Use a bold technical
editorial-poster composition with crisp borders, index numbers, abstract
signal traces, chip-grid geometry, and intentional asymmetry. Include only
this exact text: "EREN KALE", "STRATEGY & INNOVATION ENGINEER", and
"SIGNAL × SILICON × INTELLIGENCE". Keep every word large and legible in a
link preview. Do not add logos, portraits, extra claims, or invented text.
```

Inspect the result for incorrect or invented text. Retry once only if the card
is unusable. Save an approved card as `og.png` and add:

```html
<meta property="og:image" content="https://erenkale.dev/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:image" content="https://erenkale.dev/og.png">
```

- [ ] **Step 5: Complete accessibility and fallback checks in code**

Ensure:

```html
<noscript>
  <p class="noscript-note">Interactive labs are shown as static examples because JavaScript is unavailable. All portfolio and contact content remains accessible.</p>
</noscript>
```

Add meaningful portrait alt text, decorative-image empty alt attributes,
`aria-live` outputs, keyboard-reachable controls, `aria-expanded` for mobile
navigation, and labels for every range/filter/roadmap control.

- [ ] **Step 6: Align the 404 page and maintenance documentation**

Restyle `404.html` with the approved palette and include a clear link to `/`.

Update `README.md` to document:

```markdown
## Content maintenance

- Edit bilingual copy in `content.js`; both language dictionaries must keep identical keys.
- Edit deterministic mini-app logic and curated radar data in `labs.js`.
- Keep verified CV facts aligned with `EREN_KALE_CV.pdf`.
- Run `node --test tests/content.test.js tests/markup.test.js tests/labs.test.js tests/ui.test.js tests/styles.test.js` before publishing.

## Local preview

Open the site through a local static server so PDF downloads and browser modules use normal HTTP behavior.
```

Remove obsolete descriptions of the dark glass theme, particle background,
glitch animation, orbiting icons, and deleted profile asset.

- [ ] **Step 7: Run automated validation**

Run:

```powershell
node --test tests/content.test.js tests/markup.test.js tests/labs.test.js tests/ui.test.js tests/styles.test.js
git diff --check
```

Expected: all tests PASS and `git diff --check` reports no whitespace errors.

- [ ] **Step 8: Verify local static delivery**

Start the existing static preview:

```powershell
python -m http.server 8080
```

Verify through direct requests:

```powershell
Invoke-WebRequest http://127.0.0.1:8080/ -UseBasicParsing | Select-Object StatusCode
Invoke-WebRequest http://127.0.0.1:8080/style.css -UseBasicParsing | Select-Object StatusCode
Invoke-WebRequest http://127.0.0.1:8080/content.js -UseBasicParsing | Select-Object StatusCode
Invoke-WebRequest http://127.0.0.1:8080/labs.js -UseBasicParsing | Select-Object StatusCode
Invoke-WebRequest http://127.0.0.1:8080/og.png -UseBasicParsing | Select-Object StatusCode
Invoke-WebRequest http://127.0.0.1:8080/EREN_KALE_CV.pdf -UseBasicParsing | Select-Object StatusCode
```

Expected: every request returns `200`. Do not perform screenshots, DOM
inspection, clicking, or resizing unless the user separately requests browser
testing.

- [ ] **Step 9: Inspect final repository status**

Run:

```powershell
git status --short
git diff --stat
```

Expected: implementation files are modified or added; the user's pre-existing
CV modification and profile-avatar deletion remain untouched.

- [ ] **Step 10: Commit final integration**

```powershell
git add -- index.html style.css content.js labs.js script.js README.md 404.html og.png tests
git commit -m "feat: complete strategy innovation portfolio"
```
