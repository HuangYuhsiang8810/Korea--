const busanGuidePlanning = (() => {
  const { metro, rates, transfers } = busanGuideData;
  const stations = new Map(busanGuideStations.map(station => [station.id, station]));
  const graph = new Map([...stations.keys()].map(id => [id, []]));
  const located = place => Number.isFinite(place?.latitude) && Number.isFinite(place?.longitude);

  function connect(from, to) {
    if (!graph.has(from) || !graph.has(to)) return;
    graph.get(from).push(to);
    graph.get(to).push(from);
  }
  for (const line of Object.keys(busanGuideData.lines)) {
    const stops = busanGuideStations.filter(station => station.line === line);
    for (let i = 1; i < stops.length; i++) {
      if (stops[i].code === stops[i - 1].code + 1) connect(stops[i - 1].id, stops[i].id);
    }
  }
  transfers.forEach(([from, to]) => connect(from, to));

  function transferStations(id) {
    const station = stations.get(id);
    return (graph.get(id) ?? []).filter(next => stations.get(next).line !== station.line).map(next => stations.get(next));
  }

  function railPath(from, to) {
    if (!graph.has(from) || !graph.has(to)) return null;
    const costs = new Map([[from, 0]]);
    const previous = new Map();
    const queue = new Set([from]);
    while (queue.size) {
      const id = [...queue].reduce((best, current) => costs.get(current) < costs.get(best) ? current : best);
      queue.delete(id);
      if (id === to) break;
      for (const next of graph.get(id)) {
        const transfer = stations.get(id).line !== stations.get(next).line;
        const cost = costs.get(id) + (transfer ? 8 : 1);
        if (cost >= (costs.get(next) ?? Infinity)) continue;
        costs.set(next, cost);
        previous.set(next, id);
        queue.add(next);
      }
    }
    if (!costs.has(to)) return null;
    const result = [to];
    while (result[0] !== from) result.unshift(previous.get(result[0]));
    return result;
  }

  function railLegs(path) {
    if (!path?.length) return [];
    const first = stations.get(path[0]);
    const legs = [{ line: first.line, from: first, to: first, stops: 0 }];
    for (const id of path.slice(1)) {
      const stop = stations.get(id);
      const leg = legs.at(-1);
      if (leg.line === stop.line) {
        leg.to = stop;
        leg.stops++;
      } else {
        legs.push({ line: stop.line, from: stop, to: stop, stops: 0 });
      }
    }
    return legs;
  }

  function airportPath(target, reverse) {
    const origin = busanGuideData.airportStation;
    const profile = busanGuideData.airportProfiles[target];
    const stops = [origin, ...(profile?.via ?? []), target];
    const path = [origin];
    for (let i = 1; i < stops.length; i++) {
      const section = railPath(stops[i - 1], stops[i]);
      if (!section) return null;
      path.push(...section.slice(1));
    }
    return reverse ? path.reverse() : path;
  }

  function calculateFares(days, payment) {
    if (!["card", "single"].includes(payment) || !days.length) return null;
    const fields = ["metro1", "metro2", ...Object.keys(rates), "transfers"];
    if (days.some(day => fields.some(key => !Number.isSafeInteger(day[key]) || day[key] < 0))) return null;
    const metroCosts = days.map(day => day.metro1 * metro[payment][0] + day.metro2 * metro[payment][1]);
    const other = days.reduce((sum, day) => sum + day.transfers
      + Object.entries(rates).reduce((subtotal, [key, amount]) => subtotal + day[key] * amount, 0), 0);
    const count = days.length;
    const best = Array(count + 1).fill(0);
    const choices = [];
    for (let i = count - 1; i >= 0; i--) {
      const afterPass = Math.min(i + 3, count);
      const options = [
        { label: "單次付費", cost: metroCosts[i], next: i + 1 },
        { label: "1 日票", cost: metro.oneDay, next: i + 1 },
        { label: "3 日票", cost: metro.threeDay, next: afterPass },
      ];
      const bestChoice = options.reduce((a, b) => a.cost + best[a.next] <= b.cost + best[b.next] ? a : b);
      best[i] = bestChoice.cost + best[bestChoice.next];
      choices[i] = bestChoice;
    }
    const tickets = [];
    for (let i = 0; i < count; i = choices[i].next) {
      const { label, cost, next } = choices[i];
      if (cost) tickets.push({ from: i + 1, to: next, label, cost });
    }
    const metroTotal = metroCosts.reduce((a, b) => a + b, 0);
    return { standard: metroTotal + other, optimized: best[0] + other, savings: metroTotal - best[0], other, tickets };
  }

  function convertCurrency(amount, rate, from) {
    if (!Number.isFinite(amount) || amount < 0 || !Number.isFinite(rate) || rate <= 0) return null;
    const result = from === "twd" ? amount * rate : amount / rate;
    return Number.isFinite(result) ? result : null;
  }

  return { stations, located, transferStations, railPath, railLegs, airportPath, calculateFares, convertCurrency };
})();