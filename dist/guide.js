(() => {
  const data = busanGuideData;
  const rules = busanGuidePlanning;
  const byId = id => document.getElementById(id);
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const button = (text, handler, css = "action") => {
    const node = el("button", css, text);
    node.type = "button";
    node.addEventListener("click", handler);
    return node;
  };
  const external = (text, url, css = "guide-link") => {
    const anchor = el("a", css, text);
    anchor.href = url;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    return anchor;
  };
  const option = (value, label) => Object.assign(el("option", "", label), { value });
  const fill = (select, choices) => select.replaceChildren(...choices.map(([value, label]) => option(value, label)));
  const won = value => "₩" + value.toLocaleString("zh-TW");
  const range = amounts => amounts[0] === amounts[1] ? won(amounts[0]) : amounts.map(won).join("–");
  const name = place => place.nameZh || place.nameEn || place.nameKo;
  const meta = text => el("p", "secondary", text);
  const mobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
    || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const favoritesKey = "busan-guide-favorites-v1";
  function read(key) {
    try { return JSON.parse(localStorage.getItem(key)); }
    catch { return null; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch { return false; }
  }

  const catalog = new Map([...data.attractions, ...data.exchanges].map(place => [place.id, place]));
  const storedFavorites = read(favoritesKey);
  const favorites = new Set(Array.isArray(storedFavorites) ? storedFavorites.filter(id => catalog.has(id)) : []);
  const selected = new Map();
  const listViews = new Set();
  const explorers = {
    rail: { title:"交通地圖", intro:"依路線或三種語言的站名查詢車站、轉乘與附近景點。", filter:"路線",
      options:Object.entries(data.lines).map(([id, line]) => [id, line.label]), places:busanGuideStations,
      source:["釜山交通公社官方路線圖", data.sources.railMap] },
    exchange: { title:"換匯地圖", intro:"查門市、營業時間和附近車站。匯率依店家當日報價。", filter:"地區",
      options:Object.entries(data.zones), places:data.exchanges, source:["Money Box 官方門市", data.sources.moneyBox] },
    spots: { title:"景點探索", intro:"查看交通與入場資訊，並收藏想去的景點。", filter:"地區",
      options:Object.entries(data.zones), places:data.attractions, source:["Visit Busan 官方旅遊資訊", data.sources.visitBusan] },
  };
  const panels = { airport:"guide-airport", fares:"guide-fares" };
  const mapNode = byId("guide-map");
  let panel = "";
  let map;
  let markers;
  let visible = [];
  let searchTimer;

  function searchLink(place) {
    const query = place.line ? "부산 " + place.nameKo.replace(/역$/, "") + "역" : place.nameKo;
    const url = "https://map.naver.com/p/search/" + encodeURIComponent(query);
    const row = el("div", "guide-action-row");
    if (mobile) {
      const app = el("a", "action primary", "開啟 NAVER Map");
      const params = new URLSearchParams({ query, appname:window.location.href.split("#")[0] });
      app.href = "nmap://search?" + params;
      row.append(app, external("網頁地圖", url));
    } else {
      row.append(external("在 NAVER Map 查地點", url, "action"));
    }
    return row;
  }

  function directions(from, to, mode, label = "查這段路線") {
    if (!rules.located(from) || !rules.located(to)) return el("span", "secondary", "路線座標尚待確認");
    if (mobile) {
      const anchor = el("a", "guide-link", label);
      const params = new URLSearchParams({
        slat:from.latitude, slng:from.longitude, sname:from.nameKo, dlat:to.latitude, dlng:to.longitude, dname:to.nameKo,
        appname:window.location.href.split("#")[0],
      });
      anchor.href = "nmap://route/" + ({ transit:"public", walking:"walk", driving:"car" })[mode] + "?" + params;
      return anchor;
    }
    const params = new URLSearchParams({
      api:"1", origin:from.latitude + "," + from.longitude,
      destination:to.latitude + "," + to.longitude, travelmode:mode,
    });
    return external(label, "https://www.google.com/maps/dir/?" + params);
  }

  function mapNotice(message) {
    const status = byId("map-failure");
    status.textContent = message;
    status.hidden = !message;
  }

  function drawMap() {
    if (mapNode.hidden) return;
    const L = window.L;
    if (!L) {
      mapNotice("地圖元件未能載入，請使用清單或外部地圖。");
      return;
    }
    if (!map) {
      map = L.map(mapNode, { scrollWheelZoom:false }).setView([35.151, 129.075], 11);
      const layer = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom:19,
      }).addTo(map);
      layer.on("tileerror", () => mapNotice("底圖部分無法載入，仍可查看地點標記與清單。"));
      layer.on("load", () => { if (mapNode.querySelector(".leaflet-tile-loaded")) mapNotice(""); });
      markers = L.layerGroup().addTo(map);
    }
    markers.clearLayers();
    const points = [];
    for (const place of visible.filter(rules.located)) {
      const point = [place.latitude, place.longitude];
      const dot = el("span");
      dot.style.setProperty("--marker", place.line ? data.lines[place.line].color : place.kind === "exchange" ? "#087752" : "#ba552b");
      const icon = L.divIcon({ className:"guide-marker", html:dot, iconSize:[18, 18] });
      const marker = L.marker(point, { icon, title:name(place), alt:name(place) });
      marker.bindTooltip(el("span", "", name(place)), { direction:"top" });
      marker.on("click", () => selectPlace(place));
      markers.addLayer(marker);
      points.push(point);
    }
    map.invalidateSize();
    if (points.length) map.fitBounds(points, { padding:[24, 24], maxZoom:15, animate:false });
  }

  function badge(line) {
    const item = el("span", "guide-route-badge", data.lines[line].label);
    item.style.setProperty("--line-color", data.lines[line].color);
    return item;
  }

  function selectPlace(place, center = false) {
    selected.set(panel, place.id);
    for (const item of byId("place-list").querySelectorAll("button")) {
      item.setAttribute("aria-current", String(item.dataset.id === place.id));
    }
    renderPlace(place);
    if (center && map && !mapNode.hidden && rules.located(place)) {
      map.setView([place.latitude, place.longitude], Math.max(map.getZoom(), 14));
    }
  }

  function renderStation(place, box) {
    const connections = rules.transferStations(place.id);
    const tags = el("div", "guide-action-row");
    tags.append(badge(place.line), ...connections.map(stop => badge(stop.line)));
    const nearby = data.attractions.filter(spot => spot.station === place.id || connections.some(stop => stop.id === spot.station));
    box.append(tags, meta("站號 " + place.code + " · " + data.lines[place.line].operator));
    if (place.address) box.append(meta(place.address));
    box.append(meta(connections.length ? "轉乘 · " + connections.map(stop => data.lines[stop.line].label + " " + name(stop)).join("、") : "此站無已核對的跨線轉乘。"));
    box.append(meta(nearby.length ? "附近或接駁景點 · " + nearby.map(name).join("、") : "目前景點目錄沒有對應項目。"));
    box.append(meta("原始資料日期 " + (place.dataDate || "未列") + " · 缺少繁中站名時以英文顯示"),
      external("國家鐵道公團資料", data.sources.stations));
    if (place.coordinateSource) box.append(external("站點座標 · OpenStreetMap", place.coordinateSource));
  }

  function renderDestination(place, box) {
    const station = rules.stations.get(place.station);
    if (place.description) box.append(el("p", "", place.description));
    box.append(meta(place.address || "地址尚待確認"),
      meta(station ? "交通參考 · " + name(station) + " · " + data.lines[station.line].label : "附近車站尚待確認"),
      meta("開放時間 · " + (place.hours || "尚待確認")));
    if (place.kind === "spot") {
      box.append(meta("入場 · " + place.ticket), meta("建議停留 " + place.duration + " 分鐘 · 步行距離尚待核對"));
      if (place.image) {
        const figure = el("figure", "ses-photo");
        const image = Object.assign(el("img"), { src:place.image.src, alt:name(place), loading:"lazy" });
        image.addEventListener("error", () => { image.hidden = true; });
        const credit = el("figcaption");
        credit.append(external(place.image.author + " · Wikimedia Commons", place.image.source), " · ",
          external(place.image.license, place.image.licenseUrl));
        figure.append(image, credit);
        box.append(figure);
      }
    } else {
      box.append(meta(place.currencies));
    }
    const actions = el("div", "guide-action-row");
    const saved = favorites.has(place.id);
    const text = place.kind === "spot" ? (saved ? "取消收藏" : "收藏景點") : (saved ? "取消收藏" : "收藏換匯點");
    actions.append(button(text, () => {
      if (saved) favorites.delete(place.id);
      else favorites.add(place.id);
      const persisted = save(favoritesKey, [...favorites]);
      if (panel === "spots" && byId("saved-spots").checked) updateExplorer();
      else renderPlace(place);
      if (!persisted) byId("place-detail").append(meta("瀏覽器儲存受限，本次開啟仍可使用。"));
    }), external("官方資料", place.source));
    box.append(actions, meta("資料核對 " + data.verified));
  }

  function renderPlace(place) {
    const box = byId("place-detail");
    box.replaceChildren();
    if (!place) {
      box.append(meta("選擇地圖或清單上的地點查看詳細資訊。"));
      return;
    }
    box.append(el("h3", "", name(place)), el("p", "place-langs", [place.nameKo, place.nameEn].filter(Boolean).join(" · ")));
    if (place.line) renderStation(place, box);
    else renderDestination(place, box);
    box.append(searchLink(place));
  }

  function updateExplorer() {
    const search = byId("place-search").value.trim().toLocaleLowerCase().normalize("NFKC");
    const filter = byId("place-filter").value;
    const category = byId("spot-category").value;
    const transit = byId("spot-transit").value;
    visible = explorers[panel].places.filter(place => {
      const terms = [place.nameZh, place.nameKo, place.nameEn, place.address, place.code, ...(place.aliases ?? [])];
      const text = terms.filter(Boolean).join(" ").toLocaleLowerCase().normalize("NFKC");
      return (!search || search.split(/\s+/).every(part => text.includes(part)))
        && (!filter || filter === (place.line ?? place.zone))
        && (panel !== "spots" || ((!category || place.categories.includes(category))
          && (!transit || transit === place.transit) && (!byId("saved-spots").checked || favorites.has(place.id))));
    });
    const active = visible.find(place => place.id === selected.get(panel)) ?? visible[0];
    selected.set(panel, active?.id);
    const rows = visible.map(place => {
      const item = el("li");
      const control = button("", () => selectPlace(place, true), "");
      control.dataset.id = place.id;
      control.setAttribute("aria-current", String(place === active));
      control.append(el("strong", "", name(place)), place.line ? badge(place.line) : el("span", "secondary", data.zones[place.zone]));
      item.append(control);
      return item;
    });
    byId("place-list").replaceChildren(...(rows.length ? rows : [el("li", "empty", "找不到符合條件的地點。")]));
    const missing = visible.filter(place => !rules.located(place)).length;
    byId("place-count").textContent = visible.length + " 筆" + (missing ? " · " + missing + " 筆座標待確認" : "");
    renderPlace(active);
    drawMap();
  }

  function applyMapView() {
    const list = listViews.has(panel);
    mapNode.hidden = list;
    for (const control of byId("map-toggle").querySelectorAll("button")) {
      control.setAttribute("aria-pressed", String(control.dataset.view === (list ? "list" : "map")));
    }
    if (list) mapNotice("");
  }

  function prepareExplorer() {
    const mode = explorers[panel];
    byId("explorer-title").textContent = mode.title;
    byId("explorer-intro").textContent = mode.intro;
    byId("primary-filter-label").textContent = mode.filter;
    byId("place-search").value = "";
    fill(byId("place-filter"), [["", "全部"], ...mode.options]);
    for (const id of ["spot-category-field", "spot-transit-field", "saved-spots-field"]) byId(id).hidden = panel !== "spots";
    byId("explorer-source").textContent = mode.source[0];
    byId("explorer-source").href = mode.source[1];
    byId("exchange-calculator").hidden = panel !== "exchange";
    byId("explorer-meta").textContent = (panel === "rail"
      ? "路線請對照官方圖。東海線地圖標記目前涵蓋釜田至日光。"
      : "門市與景點營運可能調整。") + " 核對 " + data.verified;
    applyMapView();
    updateExplorer();
  }

  byId("place-search").addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { if (Object.hasOwn(explorers, panel)) updateExplorer(); }, 140);
  });
  for (const id of ["place-filter", "spot-category", "spot-transit", "saved-spots"]) byId(id).addEventListener("change", updateExplorer);
  for (const control of byId("map-toggle").querySelectorAll("button")) {
    control.addEventListener("click", () => {
      if (control.dataset.view === "list") listViews.add(panel);
      else listViews.delete(panel);
      applyMapView();
      drawMap();
    });
  }
  fill(byId("spot-category"), [["", "不限類型"], ...Object.entries(data.categories)]);
  fill(byId("spot-transit"), [["", "不限交通"], ...Object.entries(data.transitLabels)]);

  let exchangeDirection = "twd";
  const exchangeRate = byId("exchange-rate");
  const exchangeSaved = byId("exchange-saved");
  const exchangeKey = "busan-guide-exchange-rate-v1";
  const exchangeDate = new Intl.DateTimeFormat("zh-TW", { dateStyle:"short", timeStyle:"short", timeZone:"Asia/Taipei" });
  const lastRate = read(exchangeKey);
  if (Number.isFinite(lastRate?.rate) && lastRate.rate > 0 && Number.isFinite(Date.parse(lastRate.savedAt))) {
    exchangeRate.value = lastRate.rate;
    exchangeSaved.textContent = "上次手動輸入於 " + exchangeDate.format(new Date(lastRate.savedAt)) + "（台灣時間）。";
  }

  function updateExchange() {
    const amount = byId("exchange-" + exchangeDirection);
    const other = byId("exchange-" + (exchangeDirection === "twd" ? "krw" : "twd"));
    const result = rules.convertCurrency(amount.valueAsNumber, exchangeRate.valueAsNumber, exchangeDirection);
    other.value = result === null ? "" : result.toFixed(exchangeDirection === "twd" ? 0 : 2);
    byId("exchange-result").textContent = result === null ? "輸入正數匯率和任一金額。" : "依你輸入的匯率換算。";
  }
  for (const currency of ["twd", "krw"]) {
    byId("exchange-" + currency).addEventListener("input", () => { exchangeDirection = currency; updateExchange(); });
  }
  exchangeRate.addEventListener("input", () => {
    exchangeSaved.textContent = "";
    updateExchange();
  });
  exchangeRate.addEventListener("change", () => {
    const rate = exchangeRate.valueAsNumber;
    const savedAt = new Date();
    if (Number.isFinite(rate) && rate > 0) {
      exchangeSaved.textContent = save(exchangeKey, { rate, savedAt:savedAt.toISOString() })
        ? "已儲存手動匯率 · " + exchangeDate.format(savedAt) + "（台灣時間）"
        : "此瀏覽器目前無法儲存匯率。";
    } else {
      save(exchangeKey, null);
      exchangeSaved.textContent = "";
    }
  });
  function describeLegs(legs) {
    return legs.filter(leg => leg.stops > 0)
      .map(leg => name(leg.from) + " ⟶ " + name(leg.to) + "（" + data.lines[leg.line].label + "）").join(" · ");
  }

  function airportTaxi(profile, reverse) {
    const [fare, minutes, endpoint] = profile.taxi;
    const card = el("article", "guide-info-card");
    card.append(el("h3", "", "計程車"),
      el("p", "", reverse ? endpoint + " → 金海機場" : "金海機場 → " + endpoint),
      meta(won(fare) + " · 約 " + minutes + " 分鐘 · 機場官方估算，依路況及加成"),
      meta("轉乘 0 次 · 步行視上下車點 · 大件行李可詢問大型計程車"),
      external("金海機場計程車估價", data.sources.airportTaxi));
    return card;
  }

  function airportBus(profile, reverse) {
    const west = profile.limo === "west";
    const stop = west ? "西面樂天飯店／百貨" : "海雲臺海水浴場";
    const card = el("article", "guide-info-card");
    card.append(el("h3", "", "機場利木津巴士"),
      el("p", "", reverse ? stop + " → 金海機場" : "金海機場國際線 1 樓 3 號乘車處 → " + stop),
      meta(won(west ? data.rates.airportWest : data.rates.airportEast) + " · 機場公告票價，信用卡付款"),
      meta("轉乘 0 次 · 車程與步行時間尚待確認 · 大件行李請確認行李艙空間"));
    if (reverse) card.append(meta("往機場的乘車點和班次請向營運方確認。"));
    card.append(external("金海機場巴士資訊", data.sources.airport));
    return card;
  }

  const airportSelect = byId("airport-target");
  function renderAirport() {
    const id = airportSelect.value;
    const target = rules.stations.get(id);
    if (!target) return;
    const reverse = byId("airport-direction").value === "in";
    const profile = data.airportProfiles[id];
    const origin = rules.stations.get(data.airportStation);
    const path = rules.airportPath(id, reverse);
    const legs = rules.railLegs(path);
    const card = el("article", "guide-info-card");
    card.append(el("h3", "", legs.length > 1 ? "金海輕軌＋鐵路" : "金海輕軌"));
    if (path) {
      card.append(el("p", "", describeLegs(legs)),
        meta("轉乘 " + (legs.length - 1) + " 次 · 步行與等候時間尚待確認"),
        meta("大型行李請預留進出站與換乘時間。"));
    } else {
      card.append(meta("此站的完整路線尚待確認，請用外部路線查詢。"));
    }
    const knownZone = profile?.metroZone !== undefined;
    const fare = profile?.metroZone === 2 ? data.metro.card[1] : data.metro.card[0];
    card.append(meta(knownZone ? "交通卡 " + won(fare) + " · 依官方區間與符合轉乘條件的試算"
      : "依實際搭乘區間及轉乘條件計費，金額尚待確認。"));
    if (profile?.railTime && !reverse) {
      card.append(meta(profile.railTime + " · Korea Maritime Week 交通指引估算"), external("交通時間參考", data.sources.airportTime));
    } else {
      card.append(meta("全程時間尚待確認。"));
    }
    const links = el("div", "guide-action-row");
    links.append(external("官方轉乘費率", data.sources.transfer), external("官方路線圖", data.sources.railMap),
      directions(reverse ? target : origin, reverse ? origin : target, "transit", "查即時大眾運輸路線"));
    card.append(links);
    const routes = [card];
    if (profile?.limo) routes.push(airportBus(profile, reverse));
    if (profile?.taxi) routes.push(airportTaxi(profile, reverse));
    byId("airport-routes").replaceChildren(...routes);
    byId("airport-updated").textContent = "資料核對 " + data.verified + "。班次、費率和末班車請依營運方當日資訊。";
  }

  const mainAirports = ["2-219", "1-111", "1-113", "2-203", "lrt-101"];
  fill(airportSelect, mainAirports.map(id => [id, data.airportProfiles[id].title]));
  for (const [line, info] of Object.entries(data.lines)) {
    const group = el("optgroup");
    group.label = "其他車站 · " + info.label;
    group.append(...busanGuideStations.filter(station => station.line === line
      && station.id !== data.airportStation && !mainAirports.includes(station.id)).map(station => option(station.id, name(station))));
    airportSelect.append(group);
  }
  airportSelect.addEventListener("change", renderAirport);
  byId("airport-direction").addEventListener("change", renderAirport);

  const fareFields = {
    metro1:"地鐵 1 區間", metro2:"地鐵 2 區間", bus:"一般公車", night:"一般夜間公車",
    express:"急行公車", nightExpress:"急行夜間公車", lrt1:"金海輕軌 1 區間", lrt2:"金海輕軌 2 區間",
    airportWest:"西面機場巴士", airportEast:"海雲臺機場巴士", transfers:"已知轉乘或其他車資（韓元）",
  };
  for (const fare of data.fares) {
    const card = el("article", "guide-info-card");
    card.append(el("h3", "", fare.title), el("strong", "", fare.amount), meta(fare.detail),
      meta((fare.validFrom ? "生效 " + fare.validFrom + " · " : "") + "核對 " + data.verified), external("官方票價資料", fare.source));
    byId("fare-list").append(card);
  }
  const fareDays = [];
  function renderFareTotal() {
    const count = byId("fare-days").valueAsNumber;
    const output = byId("fare-result");
    if (!Number.isInteger(count) || count < 1 || count > 14) {
      output.textContent = "請輸入 1–14 天。";
      return;
    }
    const result = rules.calculateFares(fareDays.slice(0, count), byId("fare-payment").value);
    if (!result) {
      output.textContent = "請確認搭乘次數及已知金額為非負整數。";
      return;
    }
    output.replaceChildren(el("strong", "", "最低試算 " + won(result.optimized)),
      meta("全程按次 " + won(result.standard) + " · 日票組合可省 " + won(result.savings)
        + " · 非日票適用車資 " + won(result.other)));
    if (result.tickets.length) {
      output.append(meta(result.tickets.map(ticket => "第 " + ticket.from + (ticket.to === ticket.from ? "" : "–" + ticket.to)
        + " 天 " + ticket.label + " " + won(ticket.cost)).join(" · ")));
    }
  }

  function renderFareInputs() {
    const count = byId("fare-days").valueAsNumber;
    if (!Number.isInteger(count) || count < 1 || count > 14) {
      renderFareTotal();
      return;
    }
    while (fareDays.length < count) fareDays.push(Object.fromEntries(Object.keys(fareFields).map(key => [key, 0])));
    const days = fareDays.slice(0, count).map((day, index) => {
      const card = el("details", "guide-info-card guide-fare-day");
      card.open = index === 0;
      card.append(el("summary", "", "第 " + (index + 1) + " 天"));
      const grid = el("div", "guide-fields");
      for (const [id, label] of Object.entries(fareFields)) {
        const wrapper = el("label", "", label);
        const input = Object.assign(el("input"), {
          type:"number", min:0, max:id === "transfers" ? 10000000 : 99, step:1, inputMode:"numeric", value:day[id],
        });
        input.addEventListener("input", () => {
          day[id] = input.validity.valid ? (input.valueAsNumber || 0) : NaN;
          renderFareTotal();
        });
        wrapper.append(input);
        grid.append(wrapper);
      }
      card.append(grid);
      return card;
    });
    byId("fare-day-fields").replaceChildren(...days);
    renderFareTotal();
  }
  byId("fare-days").addEventListener("change", renderFareInputs);
  byId("fare-payment").addEventListener("change", renderFareTotal);
  byId("fare-form").addEventListener("submit", event => { event.preventDefault(); renderFareTotal(); });
  renderFareInputs();
  function showPanel() {
    const requested = window.location.hash.slice(1);
    const next = Object.hasOwn(explorers, requested) || Object.hasOwn(panels, requested) ? requested : "rail";
    if (panel === next) return;
    panel = next;
    const isExplorer = Object.hasOwn(explorers, next);
    byId("guide-explorer").hidden = !isExplorer;
    byId("guide-rail-network").hidden = next !== "rail";
    for (const [key, id] of Object.entries(panels)) byId(id).hidden = key !== next;
    for (const link of byId("guide-nav").querySelectorAll("a")) link.setAttribute("aria-current", link.dataset.panel === next ? "page" : "false");
    if (isExplorer) prepareExplorer();
    if (next === "airport") renderAirport();
  }

  if (window.parent !== window && new URLSearchParams(window.location.search).get("embedded") === "1") {
    document.body.classList.add("guide-embedded");
    const main = document.querySelector(".guide-main");
    const parentOrigin = location.protocol === "file:" ? "*" : location.origin;
    new ResizeObserver(() => {
      window.parent.postMessage({ type:"busan-guide-resize", height:Math.ceil(main.offsetHeight) }, parentOrigin);
    }).observe(main);
    byId("guide-nav").addEventListener("click", event => {
      const link = event.target.closest("[data-panel]");
      if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      history.replaceState(null, "", link.hash);
      showPanel();
    });
  }

  window.addEventListener("hashchange", showPanel);
  showPanel();
})();
