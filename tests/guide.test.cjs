const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");

const root = path.resolve(__dirname, "../dist");
const scripts = ["guide-data.js", "guide-stations.js", "guide-planning.js"];
const rulesSource = scripts.map(file => fs.readFileSync(path.join(root, file), "utf8")).join("\n");
const { busanGuideData: data, busanGuideStations: stations, busanGuidePlanning: rules } =
  vm.runInNewContext(rulesSource + "\n({ busanGuideData, busanGuideStations, busanGuidePlanning })");
const toLocal = value => JSON.parse(JSON.stringify(value));
const day = changes => ({
  metro1: 0, metro2: 0, transfers: 0,
  ...Object.fromEntries(Object.keys(data.rates).map(key => [key, 0])),
  ...changes,
});
const config = {
  days: 2, base: "nampo", style: "culture", transit: true, luggage: false,
  arrival: "", departure: "", budget: 30000,
};
const catalog = new Map([...data.attractions, ...data.exchanges].map(place => [place.id, place]));
const toRoute = target => toLocal(rules.railLegs(rules.airportPath(target, false))).map(leg => [leg.line, leg.from.id, leg.to.id]);

test("catalogs include all six lines, the required attractions and verified exchange candidates", () => {
  assert.equal(stations.length, 150);
  assert.equal(new Set(stations.map(station => station.id)).size, stations.length);
  assert.deepEqual([...new Set(stations.map(station => station.line))].sort(), ["1", "2", "3", "4", "east", "lrt"]);
  assert.equal(data.attractions.length, 11);
  assert.equal(data.exchanges.length, 5);
  for (const place of catalog.values()) {
    assert.ok(rules.located(place), place.id);
    assert.ok(rules.stations.has(place.station), place.id);
    assert.equal(new URL(place.source).protocol, "https:");
  }
  for (const pair of data.transfers) {
    assert.ok(pair.every(id => rules.stations.has(id)), pair.join("/"));
  }
});

test("airport rail routing follows verified Sasang and Seomyeon transfers", () => {
  assert.deepEqual(toRoute("2-219"), [["lrt", "lrt-104", "lrt-101"], ["2", "2-227", "2-219"]]);
  assert.deepEqual(toRoute("1-111"), [
    ["lrt", "lrt-104", "lrt-101"], ["2", "2-227", "2-219"], ["1", "1-119", "1-111"],
  ]);
  const returnPath = toLocal(rules.airportPath("2-219", true));
  assert.equal(returnPath[0], "2-219");
  assert.equal(returnPath.at(-1), "lrt-104");
  assert.equal(rules.airportPath("missing", false), null);
});

test("fare calculation compares passes without rebating buses, light rail, or transfers", () => {
  const result = rules.calculateFares([day({ metro1: 5, bus: 1, lrt1: 1, airportWest: 1, transfers: 1800 })], "card");
  assert.equal(result.other, 10950);
  assert.equal(result.standard, 18950);
  assert.equal(result.optimized, 16950);
  assert.equal(result.savings, 2000);
  assert.equal(rules.calculateFares(Array.from({ length: 3 }, () => day({ metro2: 5 })), "single").optimized, 13000);
  assert.equal(rules.calculateFares([day({ metro1: -1 })], "card"), null);
  assert.equal(rules.calculateFares([day({ metro2: 1.1 })], "card"), null);
});

test("two-way currency conversion requires an explicit positive rate", () => {
  assert.equal(rules.convertCurrency(100, 42.3, "twd"), 4230);
  assert.equal(rules.convertCurrency(4230, 42.3, "krw"), 100);
  assert.equal(rules.convertCurrency(100, 0, "twd"), null);
});

test("a plan groups places, handles late arrival, recalculates after editing, and flags a missed reservation", () => {
  const choices = ["biff", "jagalchi", "gamcheon", "songdo", "haeundae-beach", "sky-capsule"].map(id => catalog.get(id));
  const result = rules.makePlan(choices, config);
  assert.equal(result.itinerary.length, 2);
  assert.equal(new Set([...result.itinerary.flat(), ...result.unassigned]).size, choices.length);
  const shortened = rules.makePlan(choices, { ...config, arrival: "2026-11-28T20:05" });
  assert.ok(shortened.itinerary[0].length <= 1);
  const mixed = ["biff", "haeundae-beach", "sky-capsule"];
  const straight = rules.summarizeDay(mixed, config, catalog, 0);
  const reordered = rules.summarizeDay([...mixed].reverse(), config, catalog, 0);
  assert.notEqual(straight.stops[0].place.id, reordered.stops[0].place.id);
  assert.notEqual(straight.stops[1].arrival, reordered.stops[1].arrival);
  const ticket = rules.summarizeDay(["sky-capsule"], { ...config, reservations: { "sky-capsule": "09:00" } }, catalog, 0);
  assert.equal(ticket.stops[0].reservationConflict, true);
});

test("the homepage links to the guide and hides the packing input", () => {
  const home = fs.readFileSync(path.join(root, "index.html"), "utf8");
  assert.match(home, /href="guide\.html">釜山自由行智慧攻略/);
  assert.match(home, /id="packing-form" hidden/);
  assert.match(home, /資料只存於目前的瀏覽器/);
  const guide = fs.readFileSync(path.join(root, "guide.html"), "utf8");
  assert.match(guide, /href="index\.html#home"/);
  assert.match(guide, /id="guide-map"/);
  for (const file of [...scripts, "guide.js", "guide.css"]) assert.ok(guide.includes(file) && fs.existsSync(path.join(root, file)));
});