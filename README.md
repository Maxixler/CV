# Eren Kale — Strategy & Innovation Portfolio

A dependency-free, bilingual static portfolio that connects engineering depth,
business insight, leadership, and emerging technology. The site uses semantic
HTML, CSS, and vanilla JavaScript and remains readable without JavaScript.

## Project structure

- `index.html` — semantic English fallback, metadata, portfolio sections, and accessible lab controls
- `style.css` — editorial visual system, responsive layout, focus states, and reduced-motion rules
- `content.js` — equivalent English and Turkish portfolio copy
- `labs.js` — deterministic Opportunity Radar, Trade-off Studio, and Roadmap Builder logic
- `script.js` — language preference, mobile navigation, and progressive enhancement
- `EREN_KALE_CV.pdf` — factual source for public experience, project, and education claims
- `vesikalik_optimized.jpg` — optimized portrait
- `og.png` — 1200×630 social preview
- `404.html` — static not-found page aligned with the portfolio design
- `tests/` — Node test-runner contracts for content, markup, labs, UI, and styles

## Content maintenance

- Edit bilingual copy in `content.js`; both language dictionaries must keep identical keys.
- Edit deterministic mini-app logic and curated radar data in `labs.js`.
- Keep verified CV facts aligned with `EREN_KALE_CV.pdf`.
- Run `node --test tests/content.test.js tests/headers.test.js tests/language.integration.test.js tests/markup.test.js tests/labs.test.js tests/labs.browser.test.js tests/ui.test.js tests/styles.test.js` before publishing.

Keep public GitHub project links under `github.com/Maxixler`, do not expose the
phone number from the CV, and avoid unsupported metrics or impact claims.

## Local preview

Open the site through a local static server so PDF downloads and browser modules use normal HTTP behavior.

```powershell
python -m http.server 8080
```

Then open `http://127.0.0.1:8080/`.

## Publishing

The repository remains compatible with static hosting and the existing Netlify
configuration. No build step, backend, external scoring API, analytics, cookies,
or account system is required.
