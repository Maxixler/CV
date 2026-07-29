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
