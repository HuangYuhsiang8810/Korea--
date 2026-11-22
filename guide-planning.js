const busanGuidePlanning = (() => {
  const { metro, rates, transfers } = busanGuideData;
  const stations = new Map(busanGuideStations.map(station => [station.id, station]));
  const graph = new Map([...stations.keys()].map(id => [id, []]));
  const walking = (from, to) => 111.195 * Math.hypot(
    to.latitude - from.latitude,
    (to.longitude - from.longitude) * Math.cos((from.latitude + to.latitude) * Math.PI / 360),
  );
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

  function toStationStop(station) {
    return { ...station, station: station.id, nameZh: station.nameZh || station.nameEn || station.nameKo, transit: "rail" };
  }

  const baseStations = { center: "1-119", nampo: "1-111", coast: "2-203", gwangan: "2-209", east: "east-423", port: "1-113" };
  const basePlace = zone => toStationStop(stations.get(baseStations[zone] ?? baseStations.center));

  function makePlan(places, config) {
    const { days, base, style, arrival, departure } = config;
    if (!Number.isSafeInteger(days) || days < 1 || days > 14 || !places.length) return null;
    const capacity = style === "relaxed" || config.luggage ? 3 : 4;
    const bed = basePlace(base);
    const matching = place => place.categories?.includes(style) ? 0 : 1;
    const groups = new Map();
    for (const place of places) {
      if (!groups.has(place.zone)) groups.set(place.zone, []);
      groups.get(place.zone).push(place);
    }
    const order = [...groups.values()].sort((first, second) => {
      return Math.min(...first.map(matching)) - Math.min(...second.map(matching))
        || Number(second[0].zone === base) - Number(first[0].zone === base)
        || walking(bed, first[0]) - walking(bed, second[0]);
    });
    const remaining = order.flatMap(group => {
      const pending = [...group];
      const sequence = [];
      let previous = bed;
      while (pending.length) {
        pending.sort((a, b) => walking(previous, a) - walking(previous, b));
        previous = pending.shift();
        sequence.push(previous);
      }
      return sequence;
    });

    const itinerary = Array.from({ length: days }, () => []);
    for (let i = 0; i < days && remaining.length; i++) {
      const available = Math.min(capacity, Math.ceil(remaining.length / (days - i)));
      const isShortDay = (i === 0 && arrival && minutesOfDay(arrival) >= 16 * 60)
        || (i === days - 1 && departure && minutesOfDay(departure) < 14 * 60);
      const stopLimit = isShortDay && days > 1 ? Math.min(1, available) : available;
      const groupLength = remaining.findIndex(place => place.zone !== remaining[0].zone);
      const keepGroup = groupLength > 0 && groupLength <= capacity && days - i > 1 && !isShortDay;
      const count = keepGroup && remaining.length - groupLength <= (days - i - 1) * capacity
        ? groupLength : stopLimit;
      itinerary[i].push(...remaining.splice(0, count).map(place => place.id));
    }
    return { itinerary, unassigned: remaining.map(place => place.id) };
  }

  function minutesOfDay(dateTime) {
    const match = /T(\d\d):(\d\d)/.exec(dateTime);
    return match ? Number(match[1]) * 60 + Number(match[2]) : null;
  }

  function stopConnection(from, to, config) {
    if (!located(from) || !located(to)) return { mode: "尚待確認", minutes: null, fare: null, legs: [] };
    const km = walking(from, to);
    if (km <= (config.luggage ? 0.55 : 0.85)) {
      return { mode: "步行", minutes: Math.max(1, Math.ceil(km * 20)), fare: [0, 0], legs: [] };
    }
    if (!config.transit) return { mode: "查計程車路線", minutes: null, fare: null, legs: [] };
    const legs = railLegs(railPath(from.station, to.station));
    const pureMetro = legs.length && legs.every(leg => /^[1-4]$/.test(leg.line));
    const segments = legs.reduce((sum, leg) => sum + leg.stops, 0);
    const bus = from.transit === "bus" || to.transit === "bus";
    if (!segments || bus) {
      return { mode: "查公車或步行接駁", minutes: null, fare: null, legs: [] };
    }
    const minutes = 15 + Math.ceil(segments * 2.5) + (legs.length - 1) * 8;
    return { mode: "地鐵或鐵路", minutes, fare: pureMetro ? [...metro.card] : null, legs };
  }

  function summarizeDay(ids, config, catalog, day) {
    const home = basePlace(config.base);
    let from = home;
    const first = day === 0;
    const last = day === config.days - 1;
    let clock = first && config.arrival ? Math.max(600, minutesOfDay(config.arrival) + 120) : 600;
    const end = last && config.departure ? minutesOfDay(config.departure) - 180 : 21 * 60;
    const start = config.arrival ? Date.parse(config.arrival.slice(0, 10))
      : config.departure ? Date.parse(config.departure.slice(0, 10)) - (config.days - 1) * 86400000 : NaN;
    const date = new Date(start + day * 86400000);
    let knownTime = 0;
    let range = [0, 0];
    let missing = 0;
    let uncertainTime = 0;
    const count = route => {
      if (route.minutes === null) uncertainTime++;
      knownTime += route.minutes ?? 0;
      if (!route.fare) missing++;
      range = range.map((total, i) => total + (route.fare?.[i] ?? 0));
    };
    const stops = ids.map(id => catalog.get(id)).filter(Boolean).map(place => {
      const route = stopConnection(from, place, config);
      const previous = from;
      from = place;
      count(route);
      const earliest = Math.max(clock + (route.minutes ?? 30), place.opens ?? 0);
      const reservation = config.reservations?.[place.id];
      const booked = /^([01]\d|2[0-3]):[0-5]\d$/.test(reservation) ? minutesOfDay("T" + reservation) : null;
      const arrival = Math.max(earliest, booked ?? 0);
      clock = arrival + place.duration;
      const closed = date.getUTCDay() === 2 && place.closedTuesdays?.includes(Math.ceil(date.getUTCDate() / 7));
      return { place, from: previous, route, arrival, closed, reservationConflict: booked !== null && booked < earliest, outsideHours: clock > Math.min(end, place.closes ?? Infinity) };
    });
    const back = stops.length ? stopConnection(from, home, config) : null;
    if (back) count(back);
    const lateReturn = stops.length > 0 && clock + (back.minutes ?? 30) > end;
    return { stops, back, home, range, missing, uncertainTime, knownTime, lateReturn };
  }

  return { stations, located, transferStations, railPath, railLegs, airportPath, calculateFares, convertCurrency, makePlan, summarizeDay, baseStations };
})();