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

  const opportunities = [
    {
      id: "edge-ai",
      label: "Edge AI",
      impact: 84,
      readiness: 76,
      contexts: ["industrial", "embedded"],
    },
    {
      id: "risc-v",
      label: "RISC-V",
      impact: 88,
      readiness: 62,
      contexts: ["industrial", "embedded"],
    },
    {
      id: "sdr",
      label: "Software-Defined Radio",
      impact: 73,
      readiness: 68,
      contexts: ["telecom", "embedded"],
    },
    {
      id: "private-networks",
      label: "Private Networks",
      impact: 79,
      readiness: 71,
      contexts: ["industrial", "telecom"],
    },
    {
      id: "chiplets",
      label: "Chiplets",
      impact: 82,
      readiness: 53,
      contexts: ["industrial"],
    },
  ];

  const tradeoffDefaults = {
    impact: 80,
    speed: 65,
    risk: 40,
    cost: 50,
  };

  const roadmapDefaults = {
    now: ["Validate need", "Map risks"],
    next: ["Build pilot", "Measure outcomes"],
    later: ["Prepare scaling", "Transfer value"],
  };

  const roadmapStepIds = {
    "Validate need": "validate-need",
    "Map risks": "map-risks",
    "Build pilot": "build-pilot",
    "Measure outcomes": "measure-outcomes",
    "Prepare scaling": "prepare-scaling",
    "Transfer value": "transfer-value",
  };

  const labText = {
    en: {
      "radar.description": "Explore RISC-V, edge AI, software-defined radio, private networks, and chiplets through industrial, telecom, and embedded contexts.",
      "radar.filterLabel": "Filter opportunities by context",
      "radar.filter.all": "All",
      "radar.filter.industrial": "Industrial",
      "radar.filter.telecom": "Telecom",
      "radar.filter.embedded": "Embedded",
      "radar.plotLabel": "Technology opportunity radar: readiness increases from left to right and impact increases from bottom to top",
      "radar.scale": "scale",
      "radar.pilot": "pilot",
      "radar.monitor": "monitor",
      "radar.research": "research",
      "radar.next.scale": "shape a scaling path",
      "radar.next.pilot": "define a focused pilot",
      "radar.next.monitor": "monitor enabling conditions",
      "radar.next.research": "research the key assumptions",
      "tradeoff.description": "This illustrative portfolio demonstration makes the assumptions behind a recommendation visible; it is not a substitute for project discovery.",
      "tradeoff.impact": "Impact",
      "tradeoff.speed": "Speed",
      "tradeoff.risk": "Risk",
      "tradeoff.cost": "Cost",
      "tradeoff.formulaSummary": "How the illustrative score works",
      "tradeoff.formula": "Score = impact × 0.40 + speed × 0.25 + (100 − risk) × 0.20 + (100 − cost) × 0.15.",
      "tradeoff.resultLabel": "Illustrative portfolio demonstration result",
      "tradeoff.prototype": "prototype next",
      "tradeoff.validate": "validate assumptions",
      "tradeoff.monitor": "defer and monitor",
      "roadmap.description": "Sequence discovery before scale: validate the need, map risks, build a pilot, measure outcomes, then prepare scaling and value transfer.",
      "roadmap.now": "Now",
      "roadmap.next": "Next",
      "roadmap.later": "Later",
      "roadmap.move": "Move",
      "roadmap.copy": "Copy summary",
      "roadmap.copied": "Summary copied.",
      "roadmap.selected": "Summary selected. Press Ctrl+C to copy.",
      "roadmap.copyUnavailable": "Copy is unavailable. Select the summary manually.",
    },
    tr: {
      "radar.description": "RISC-V, uç yapay zekâ, yazılım tanımlı radyo, özel ağlar ve yongacıkları endüstriyel, telekom ve gömülü sistem bağlamlarında keşfedin.",
      "radar.filterLabel": "Fırsatları bağlama göre filtreleyin",
      "radar.filter.all": "Tümü",
      "radar.filter.industrial": "Endüstriyel",
      "radar.filter.telecom": "Telekom",
      "radar.filter.embedded": "Gömülü",
      "radar.plotLabel": "Teknoloji fırsat radarı: hazırlık soldan sağa, etki aşağıdan yukarı artar",
      "radar.scale": "ölçekleme",
      "radar.pilot": "pilot",
      "radar.monitor": "izleme",
      "radar.research": "araştırma",
      "radar.next.scale": "bir ölçekleme yolu oluşturun",
      "radar.next.pilot": "odaklı bir pilot tanımlayın",
      "radar.next.monitor": "etkinleştirici koşulları izleyin",
      "radar.next.research": "temel varsayımları araştırın",
      "tradeoff.description": "Bu açıklayıcı portföy gösterimi, önerinin ardındaki varsayımları görünür kılar; proje keşfinin yerini tutmaz.",
      "tradeoff.impact": "Etki",
      "tradeoff.speed": "Hız",
      "tradeoff.risk": "Risk",
      "tradeoff.cost": "Maliyet",
      "tradeoff.formulaSummary": "Açıklayıcı puan nasıl çalışır",
      "tradeoff.formula": "Puan = etki × 0,40 + hız × 0,25 + (100 − risk) × 0,20 + (100 − maliyet) × 0,15.",
      "tradeoff.resultLabel": "Açıklayıcı portföy gösterimi sonucu",
      "tradeoff.prototype": "sonraki adım olarak prototipleyin",
      "tradeoff.validate": "varsayımları doğrulayın",
      "tradeoff.monitor": "erteleyin ve izleyin",
      "roadmap.description": "Ölçeklemeden önce keşfi sıralayın: ihtiyacı doğrulayın, riskleri haritalayın, pilot oluşturun, sonuçları ölçün, ardından ölçekleme ve değer aktarımını hazırlayın.",
      "roadmap.now": "Şimdi",
      "roadmap.next": "Sonraki",
      "roadmap.later": "Daha Sonra",
      "roadmap.move": "Taşı",
      "roadmap.copy": "Özeti kopyala",
      "roadmap.copied": "Özet kopyalandı.",
      "roadmap.selected": "Özet seçildi. Kopyalamak için Ctrl+C tuşlarına basın.",
      "roadmap.copyUnavailable": "Kopyalama kullanılamıyor. Özeti elle seçin.",
    },
  };

  let currentLanguage = "en";
  const languageUpdaters = [];
  let labsInitialized = false;

  function normalizeLabLanguage(language) {
    return String(language || "").toLowerCase().startsWith("tr") ? "tr" : "en";
  }

  function getLabText(key) {
    return labText[currentLanguage][key] || labText.en[key] || key;
  }

  function setOutputText(output, text) {
    if ("value" in output) {
      output.value = text;
      return;
    }
    output.textContent = text;
  }

  function updateStaticLabText() {
    document.querySelectorAll("[data-lab-text]").forEach((element) => {
      element.textContent = getLabText(element.dataset.labText);
    });
    document.querySelectorAll("[data-lab-aria]").forEach((element) => {
      element.setAttribute("aria-label", getLabText(element.dataset.labAria));
    });
  }

  function formatOpportunity(opportunity) {
    const quadrant = classifyOpportunity(opportunity);
    if (currentLanguage === "tr") {
      return `${opportunity.label}: etki ${opportunity.impact}, hazırlık ${opportunity.readiness} — ${getLabText(`radar.${quadrant}`)}. Sonraki adım: ${getLabText(`radar.next.${quadrant}`)}.`;
    }
    return `${opportunity.label}: impact ${opportunity.impact}, readiness ${opportunity.readiness} — ${getLabText(`radar.${quadrant}`)}. Next: ${getLabText(`radar.next.${quadrant}`)}.`;
  }

  function opportunityAriaLabel(opportunity) {
    if (currentLanguage === "tr") {
      return `${opportunity.label}, etki ${opportunity.impact}, hazırlık ${opportunity.readiness}`;
    }
    return `${opportunity.label}, impact ${opportunity.impact}, readiness ${opportunity.readiness}`;
  }

  function initializeOpportunityRadar() {
    const root = document.getElementById("opportunity-radar");
    if (!root) return null;
    const plot = root.querySelector("[data-radar-plot]");
    const output = root.querySelector("[data-radar-result]");
    const filterButtons = Array.from(root.querySelectorAll("[data-radar-context]"));
    const reset = root.querySelector('[data-lab-reset="radar"]');
    if (!plot || !output) return null;

    let selectedId = opportunities[0].id;
    let selectedContext = "all";
    const dots = new Map();

    plot.replaceChildren();
    plot.style.position = "relative";
    plot.style.display = "block";

    function selectOpportunity(opportunity) {
      selectedId = opportunity.id;
      dots.forEach((dot, id) => {
        dot.setAttribute("aria-pressed", String(id === selectedId));
      });
      setOutputText(output, formatOpportunity(opportunity));
    }

    function updateFilter(context) {
      selectedContext = context;
      filterButtons.forEach((button) => {
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.radarContext === selectedContext),
        );
      });

      const visible = opportunities.filter((opportunity) => (
        selectedContext === "all" || opportunity.contexts.includes(selectedContext)
      ));
      opportunities.forEach((opportunity) => {
        dots.get(opportunity.id).hidden = !visible.includes(opportunity);
      });

      if (!visible.some((opportunity) => opportunity.id === selectedId) && visible[0]) {
        selectOpportunity(visible[0]);
      }
    }

    opportunities.forEach((opportunity) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "radar-dot";
      dot.textContent = opportunity.label;
      dot.dataset.opportunityId = opportunity.id;
      dot.style.position = "absolute";
      dot.style.left = `${opportunity.readiness}%`;
      dot.style.bottom = `${opportunity.impact}%`;
      dot.style.transform = "translate(-50%, 50%)";
      dot.setAttribute("aria-pressed", "false");
      dot.addEventListener("click", () => selectOpportunity(opportunity));
      dot.addEventListener("focus", () => selectOpportunity(opportunity));
      dots.set(opportunity.id, dot);
      plot.append(dot);
    });

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => updateFilter(button.dataset.radarContext));
    });
    reset?.addEventListener("click", () => {
      updateFilter("all");
      selectOpportunity(opportunities[0]);
    });

    function updateLanguage() {
      plot.setAttribute("aria-label", getLabText("radar.plotLabel"));
      opportunities.forEach((opportunity) => {
        dots.get(opportunity.id).setAttribute("aria-label", opportunityAriaLabel(opportunity));
      });
      const selected = opportunities.find((opportunity) => opportunity.id === selectedId);
      if (selected) selectOpportunity(selected);
    }

    updateFilter(selectedContext);
    updateLanguage();
    return updateLanguage;
  }

  function readTradeoffValues(root) {
    return Object.fromEntries(
      Object.keys(tradeoffDefaults).map((name) => [
        name,
        root.querySelector(`input[name="${name}"]`)?.value,
      ]),
    );
  }

  function recommendationText(recommendation) {
    return getLabText(`tradeoff.${recommendation}`);
  }

  function initializeTradeoffStudio() {
    const root = document.getElementById("tradeoff-studio");
    if (!root) return null;
    const inputs = Array.from(root.querySelectorAll('input[type="range"]'));
    const output = root.querySelector("[data-tradeoff-result]");
    const reset = root.querySelector('[data-lab-reset="tradeoff"]');
    if (!inputs.length || !output) return null;

    function updateResult() {
      const result = calculateStrategicFit(readTradeoffValues(root));
      setOutputText(output, `${result.score} — ${recommendationText(result.recommendation)}`);
      root.style.setProperty("--strategic-fit", `${result.score}%`);
    }

    inputs.forEach((input) => {
      input.addEventListener("input", updateResult);
    });
    reset?.addEventListener("click", () => {
      inputs.forEach((input) => {
        input.value = tradeoffDefaults[input.name];
      });
      updateResult();
    });

    updateResult();
    return updateResult;
  }

  function cloneRoadmapDefaults() {
    return {
      now: [...roadmapDefaults.now],
      next: [...roadmapDefaults.next],
      later: [...roadmapDefaults.later],
    };
  }

  function initializeRoadmapBuilder() {
    const root = document.getElementById("roadmap-builder");
    if (!root) return null;
    const stageLists = {
      now: root.querySelector('[data-roadmap-stage="now"]'),
      next: root.querySelector('[data-roadmap-stage="next"]'),
      later: root.querySelector('[data-roadmap-stage="later"]'),
    };
    const summary = root.querySelector("[data-roadmap-summary]");
    const copyButton = root.querySelector("[data-roadmap-copy]");
    const copyStatus = root.querySelector("[data-roadmap-copy-status]");
    const reset = root.querySelector('[data-lab-reset="roadmap"]');
    if (Object.values(stageLists).some((list) => !list) || !summary) return null;

    let roadmap = cloneRoadmapDefaults();

    function updateSummary() {
      setOutputText(summary, buildRoadmapSummary(roadmap, currentLanguage));
    }

    function renderRoadmap(focusStepId) {
      Object.entries(stageLists).forEach(([stage, list]) => {
        list.replaceChildren();
        roadmap[stage].forEach((step) => {
          const item = document.createElement("li");
          const label = document.createElement("span");
          const controls = document.createElement("div");
          const stepId = roadmapStepIds[step];
          label.textContent = step;

          Object.keys(stageLists).forEach((target) => {
            const button = document.createElement("button");
            const stageLabel = getLabText(`roadmap.${target}`);
            button.type = "button";
            button.textContent = stageLabel;
            button.dataset.roadmapStep = stepId;
            button.dataset.roadmapTarget = target;
            button.disabled = target === stage;
            button.setAttribute("aria-pressed", String(target === stage));
            button.setAttribute(
              "aria-label",
              `${getLabText("roadmap.move")} ${step}: ${stageLabel}`,
            );
            button.addEventListener("click", () => {
              Object.values(roadmap).forEach((steps) => {
                const index = steps.indexOf(step);
                if (index >= 0) steps.splice(index, 1);
              });
              roadmap[target].push(step);
              renderRoadmap(stepId);
            });
            controls.append(button);
          });

          item.append(label, controls);
          list.append(item);
        });
      });
      updateSummary();

      if (focusStepId) {
        root.querySelector(
          `[data-roadmap-step="${focusStepId}"]:not(:disabled)`,
        )?.focus();
      }
    }

    function selectSummaryFallback() {
      if (!globalObject?.getSelection || typeof document.createRange !== "function") {
        if (copyStatus) copyStatus.textContent = getLabText("roadmap.copyUnavailable");
        return;
      }
      const selection = globalObject.getSelection();
      const range = document.createRange();
      range.selectNodeContents(summary);
      selection.removeAllRanges();
      selection.addRange(range);
      if (copyStatus) copyStatus.textContent = getLabText("roadmap.selected");
    }

    function copySummary() {
      const summaryText = summary.value || summary.textContent;
      try {
        const clipboard = globalObject?.navigator?.clipboard;
        if (!clipboard || typeof clipboard.writeText !== "function") {
          selectSummaryFallback();
          return;
        }
        Promise.resolve(clipboard.writeText(summaryText))
          .then(() => {
            if (copyStatus) copyStatus.textContent = getLabText("roadmap.copied");
          })
          .catch(selectSummaryFallback);
      } catch {
        selectSummaryFallback();
      }
    }

    copyButton?.addEventListener("click", copySummary);
    reset?.addEventListener("click", () => {
      roadmap = cloneRoadmapDefaults();
      renderRoadmap();
      if (copyStatus) copyStatus.textContent = "";
    });

    renderRoadmap();
    return () => {
      renderRoadmap();
      if (copyStatus) copyStatus.textContent = "";
    };
  }

  function updateLabLanguage(language) {
    currentLanguage = normalizeLabLanguage(language);
    updateStaticLabText();
    languageUpdaters.forEach((update) => update());
  }

  function initializeLabs() {
    if (labsInitialized) return;
    labsInitialized = true;
    currentLanguage = normalizeLabLanguage(document.documentElement.lang);
    updateStaticLabText();
    [
      initializeOpportunityRadar(),
      initializeTradeoffStudio(),
      initializeRoadmapBuilder(),
    ].forEach((update) => {
      if (typeof update === "function") languageUpdaters.push(update);
    });
  }

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
      updateLabLanguage(event.detail?.language);
    });
  }
}(typeof window !== "undefined" ? window : globalThis));
