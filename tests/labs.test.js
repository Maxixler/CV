const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  clamp,
  classifyOpportunity,
  calculateStrategicFit,
  buildRoadmapSummary,
  createOpportunityRadarState,
  createRoadmapState,
  moveRoadmapStep,
} = require("../labs.js");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

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

test("radar state keeps every technology addressable when a filter changes selection", () => {
  const radar = createOpportunityRadarState({
    context: "telecom",
    selectedId: "edge-ai",
  });

  assert.equal(radar.items.length, 5);
  assert.deepEqual(
    radar.items.filter((item) => item.visible).map((item) => item.id),
    ["sdr", "private-networks"],
  );
  assert.equal(radar.selectedId, "sdr");
  assert.equal(new Set(radar.items.map((item) => item.id)).size, 5);
  assert.equal(radar.items.find((item) => item.id === "sdr").selected, true);
});

test("no-JavaScript radar fallback exposes the curated decision data", () => {
  assert.match(html, /<table[^>]+data-radar-fallback/);
  assert.match(html, /<[^>]+data-radar-list/);
  for (const row of [
    ["Edge AI", "84", "76", "Scale"],
    ["RISC-V", "88", "62", "Scale"],
    ["Software-Defined Radio", "73", "68", "Scale"],
    ["Private Networks", "79", "71", "Scale"],
    ["Chiplets", "82", "53", "Pilot"],
  ]) {
    const expression = row.map((value) => (
      value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    )).join("[\\s\\S]*?");
    assert.match(html, new RegExp(expression));
  }
  assert.match(html, /define a focused pilot/i);
});

test("roadmap state uses canonical IDs and localizes moved steps without mutation", () => {
  const initial = createRoadmapState();
  const moved = moveRoadmapStep(initial, "validate-need", "later");

  assert.deepEqual(initial.now, ["validate-need", "map-risks"]);
  assert.equal(
    buildRoadmapSummary(initial, "tr"),
    "Şimdi: İhtiyacı doğrula, Riskleri haritala | Sonraki: Pilot oluştur, Sonuçları ölç | Daha Sonra: Ölçeklemeyi hazırla, Değeri aktar",
  );
  assert.deepEqual(moved.now, ["map-risks"]);
  assert.deepEqual(moved.later, [
    "prepare-scaling",
    "transfer-value",
    "validate-need",
  ]);
  assert.match(buildRoadmapSummary(moved, "tr"), /Şimdi: Riskleri haritala/);
  assert.match(
    buildRoadmapSummary(moved, "tr"),
    /Daha Sonra: Ölçeklemeyi hazırla, Değeri aktar, İhtiyacı doğrula/,
  );
});
