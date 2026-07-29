# Strategy & Innovation Portfolio Redesign

**Date:** 2026-07-29
**Status:** Approved design
**Project:** Eren Kale personal CV and portfolio website

## 1. Purpose

Redesign the existing portfolio into a professional, colorful, and memorable
English-first website that positions Eren Kale as a **Strategy & Innovation
Engineer**.

The site must show that Eren can connect engineering depth, business insight,
leadership, and emerging technology to identify opportunities and turn them into
practical systems. Its primary audience is strategy, innovation, and R&D
leaders at technology companies. Its primary conversion goal is to start a
conversation about a role, project, or technology opportunity.

## 2. Positioning

### Primary title

**Strategy & Innovation Engineer**

### Supporting statement

**Bridging engineering depth, business insight, and emerging technologies.**

### Hero proposition

**Turning emerging technology into decisions, systems, and growth.**

The positioning is supported by these three connected lenses:

1. **Engineering:** RTL, FPGA, RISC-V, embedded systems, RF/SDR, AI, and
   telecommunications.
2. **Business:** Business Administration studies and an explicit focus on
   strategic value, trade-offs, and scalable opportunities.
3. **Leadership:** Leadership of a 400+ member engineering club, sponsorship
   work, mentoring, and cross-functional project experience.

The site must not claim formal strategy-management experience that is absent
from the CV. It will demonstrate strategic potential by reframing verified
engineering, leadership, and business evidence.

## 3. Approved Creative Direction

The approved direction is a hybrid of:

- **Signal & Silicon Editorial:** a distinctive technical-journal and research
  poster aesthetic;
- **Digital Innovation Lab:** playful, useful interactive tools; and
- **Executive Innovation Casebook:** structured, outcome-oriented project
  narratives.

The result should feel energetic and experimental without resembling a game,
generic developer dashboard, or glassmorphism template.

### Visual system

- Warm paper background: `#F4E7D3`
- Ink: `#211B17`
- Cobalt blue: `#2947A9`
- Vermilion: `#D64D30`
- Signal yellow: `#F0BC3B`
- Editorial serif for major headlines
- Highly readable sans-serif for body copy
- Monospace for technical labels, data, and interaction controls
- Crisp borders, poster blocks, indexing numbers, diagrams, and intentional
  asymmetry
- No generic neon gradients, permanent particle fields, or excessive glass
  effects

Motion must respond to user actions. Appropriate motion includes radar scans,
slider feedback, card placement, section reveals, and restrained hover states.
Continuous decorative motion must be avoided. The design must respect reduced
motion preferences.

## 4. Information Architecture

The site remains a focused single-page portfolio with anchored navigation.

### 4.1 Hero

- Strategy & Innovation Engineer title
- Primary value proposition
- Short proof statement connecting silicon, signals, intelligent systems, and
  business value
- Primary CTA: **Discuss an opportunity**
- Secondary CTA: **Download CV**
- Visible EN/TR language switch
- Portrait presented as part of the editorial composition

### 4.2 Strategic Profile

Three concise lenses establish credibility:

- Engineering depth
- Business insight
- Leadership and development

Each lens uses evidence from the CV rather than generic personal claims.

### 4.3 Interactive Innovation Labs

Three browser-based mini applications let visitors experience Eren's decision
style. Each lab must be understandable within 30-60 seconds and connect to a
real case study.

#### Lab 01: Technology Opportunity Radar

Visitors compare curated technologies across **strategic impact** and
**readiness**. Initial technologies include RISC-V, edge AI, SDR, industrial
automation, and private/next-generation networks. Filters may include
industrial, telecom, and embedded contexts.

The result explains why a technology belongs in a particular quadrant and
suggests a next validation step. The tool is educational and illustrative; it
does not claim to be an objective market forecast.

#### Lab 02: Engineering Trade-off Studio

Visitors adjust impact, speed, risk, and cost controls. The interface derives a
simple strategic-fit score and a plain-language recommendation such as
**prototype next**, **validate assumptions**, or **defer and monitor**.

The scoring model must be transparent, deterministic, and clearly labeled as a
portfolio demonstration rather than professional investment advice.

#### Lab 03: Innovation Roadmap Builder

Visitors arrange a small set of steps into **Now**, **Next**, and **Later**:

- validate the need;
- map risks;
- build a pilot;
- measure outcomes;
- prepare scaling; and
- transfer value.

The completed roadmap produces a concise, copyable summary. It demonstrates a
structured path from technology exploration to practical delivery.

### 4.4 Selected Case Studies

Projects use the narrative:

**Opportunity -> Decision -> Execution -> Evidence -> Strategic insight**

Primary cases:

1. **Mergen low-power processor / HexaChipsters**
   - TÜBİTAK 2209-A supported work
   - processor design and verification
   - 7th place nationwide in the Teknofest Chip Design Competition
   - strategic theme: balancing performance, verification, power, and
     industrial relevance
2. **SDR-Based LoRaWAN Analysis**
   - USRP E310, GNU Radio, UHD drivers, Arch Linux, and 868 MHz analysis
   - strategic theme: turning a technical research setup into a reusable
     experimentation platform
3. **Embedded AI at E3TAM**
   - OpenCV, TensorFlow, Raspberry Pi 5, and embedded Linux
   - strategic theme: moving an AI concept toward an operational edge system

Supporting evidence from PROFEN, Turkcell, T3 Foundation, and other GitHub work
appears in a compact experience or project index instead of competing with the
primary cases.

### 4.5 Proof and Trajectory

A visually concise trajectory connects:

- Marmara University Electrical and Electronics Engineering;
- Atatürk University Business Administration;
- Erasmus+ at Technische Universität Ilmenau;
- PROFEN digital design;
- Turkcell mobile network planning;
- E3TAM industrial AI;
- T3 Foundation project development;
- the RISC-V/FPGA publication; and
- engineering-club leadership.

### 4.6 Contact

The closing message is:

**Let's explore what technology could unlock next.**

The section exposes email, LinkedIn, and GitHub actions and repeats the primary
conversation CTA. The public site will not display the phone number from the CV.
No contact form or personal-data collection is required.

## 5. Language and Content Rules

- English is the default language.
- Turkish is available through a persistent EN/TR switch.
- Both languages must contain equivalent information and calls to action.
- The selected language is stored locally on the visitor's device.
- If storage is unavailable, the current page language still changes and the
  next visit falls back to English.
- Content is based on `EREN_KALE_CV.pdf` plus verified links and project details
  already present in the website.
- Existing working project links under `github.com/Maxixler` remain the source
  for GitHub actions because the PDF's `github.com/erenkale` text conflicts with
  the current repository links.
- Dates, organization names, awards, and publication claims must not be
  embellished.

## 6. Technical Architecture

Preserve the static, dependency-light architecture and Netlify compatibility.
Do not introduce a framework or backend.

Suggested responsibility boundaries:

- `index.html`: semantic page structure and non-JavaScript fallback content
- `style.css`: design tokens, layout, components, motion, and responsive rules
- `content.js`: EN/TR content dictionary and content binding
- `labs.js`: radar, trade-off, and roadmap state and interactions
- `script.js`: navigation, language preference, general UI behavior, and
  progressive enhancement

All lab data is curated local data. No external API, account, analytics, cookie
banner, database, or server-side processing is required.

## 7. Interaction and Data Flow

1. The page renders complete English content without waiting for JavaScript.
2. JavaScript enhances the page with language switching, navigation, and labs.
3. The language switch replaces text from the local content dictionary and
   updates the document language.
4. The selected language is stored in local browser storage.
5. Each lab owns isolated in-memory state and exposes a reset action.
6. Lab inputs produce immediate deterministic visual and textual output.
7. Navigating away or refreshing restores safe default lab values.
8. Contact actions use direct `mailto:`, LinkedIn, and GitHub links.

## 8. Failure and Fallback Behavior

- Without JavaScript, all essential profile, case-study, experience, and contact
  content remains readable.
- Without JavaScript, labs appear as static explanatory illustrations.
- A local-storage failure never blocks language switching or navigation.
- Invalid lab values are clamped to documented ranges before calculation.
- Empty roadmap columns are allowed and produce a helpful prompt rather than an
  error.
- External links open safely and are labeled clearly.
- Decorative assets may fail without obscuring text or actions.

## 9. Accessibility, Responsiveness, and Performance

- Responsive behavior for phone, tablet, laptop, and wide desktop widths
- Full keyboard access for navigation, language controls, sliders, filters, and
  roadmap controls
- Touch targets suitable for mobile use
- Visible focus states
- Semantic headings, regions, buttons, and descriptive labels
- Sufficient color contrast across every palette combination
- Screen-reader announcements for derived lab results
- Reduced-motion behavior
- Optimized portrait and restrained asset use
- No blocking application dependency or unnecessary network request

## 10. Validation

Before completion:

1. Verify that the static site loads and all required files resolve.
2. Check EN/TR content parity and document-language updates.
3. Test lab defaults, boundary values, reset behavior, and deterministic
   results.
4. Check navigation and interactions with keyboard and touch-sized controls.
5. Validate reduced-motion and no-JavaScript fallbacks.
6. Check responsive layouts at representative mobile, tablet, and desktop
   widths.
7. Check title, description, social metadata, CV download, email, LinkedIn,
   GitHub, publication, and project links.
8. Confirm no phone number or unintended personal data is exposed.
9. Confirm that content matches the CV and approved positioning without
   unsupported claims.

## 11. Out of Scope

- Backend services or databases
- User accounts or authentication
- Contact-form data collection
- Live market data or external technology-scoring APIs
- CMS integration
- Blog or multi-page publishing system
- Unverified quantitative impact claims

## 12. Success Criteria

The redesign succeeds when:

- a technology strategy, innovation, or R&D leader understands the positioning
  within the first viewport;
- the site demonstrates both technical credibility and strategic thinking;
- the labs are engaging but do not overshadow the CV evidence;
- visitors can move from interest to a conversation in one clear action;
- English and Turkish experiences are complete and consistent; and
- the site remains fast, accessible, responsive, and easy to maintain.
