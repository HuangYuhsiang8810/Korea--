const trip = [
  {
    date: "11/28", weekday: "六", iso: "2026-11-28",
    title: "抵達釜山・南浦洞宵夜",
    photos: [{ label: "南浦洞夜市", y: 193 }],
    imageHeight: 440,
    events: [
      ["20:05", "抵達金海機場", "航班"],
      ["20:05–21:15", "入境、領行李"],
      ["21:15–22:15", "前往住宿", "計程車"],
      ["22:30–23:45", "南浦洞吃宵夜"],
      ["00:00", "回飯店休息", "", "隔日凌晨"],
    ],
  },
  {
    date: "11/29", weekday: "日", iso: "2026-11-29",
    title: "甘川文化村・松島・南浦洞",
    photos: [{ label: "甘川文化村", y: 156 }, { label: "松島海上纜車", y: 506 }],
    imageHeight: 770,
    events: [
      ["08:30", "早餐"],
      ["09:15", "前往甘川文化村", "計程車"],
      ["09:45–12:00", "彩色山城、小王子、巷弄拍照"],
      ["12:00–13:00", "午餐"],
      ["13:00–16:00", "松島海水浴場、天空步道、海上纜車"],
      ["16:30–18:30", "札嘎其市場吃海鮮"],
      ["18:30–21:00", "BIFF 廣場、國際市場、光復路"],
      ["21:00", "回住宿"],
    ],
  },
  {
    date: "11/30", weekday: "一", iso: "2026-11-30",
    title: "海雲台・天空膠囊・青沙浦",
    photos: [{ label: "海雲台海水浴場", y: 163 }, { label: "天空膠囊", y: 544 }],
    imageHeight: 832,
    events: [
      ["08:00", "早餐"],
      ["08:45", "前往海雲台", "計程車"],
      ["10:00–11:00", "海雲台海水浴場"],
      ["11:00–11:40", "冬柏島"],
      ["12:00–13:00", "豬肉湯飯"],
      ["13:30–14:00", "天空膠囊", "重點行程", "尾浦 → 青沙浦"],
      ["14:00–16:00", "青沙浦燈塔、海岸拍照"],
      ["16:00–17:00", "海景咖啡廳"],
      ["17:30–19:30", "海雲台市場、晚餐"],
      ["20:30", "返回住宿", "計程車"],
    ],
  },
  {
    date: "12/1", weekday: "二", iso: "2026-12-01",
    title: "海東龍宮寺・機張・廣安里",
    photos: [{ label: "海東龍宮寺", y: 148 }, { label: "廣安大橋夜景", y: 484 }],
    imageHeight: 754,
    events: [
      ["08:00", "早餐"],
      ["09:00", "前往海東龍宮寺", "計程車"],
      ["10:00–11:30", "海邊寺廟、拍照"],
      ["11:30–13:00", "前往機張、海鮮午餐", "計程車"],
      ["13:00–15:00", "機張海景咖啡廳"],
      ["15:00–17:00", "前往廣安里", "計程車"],
      ["17:00–18:00", "廣安里海灘拍照"],
      ["18:00–20:00", "廣安大橋夜景、海鮮晚餐"],
      ["20:00–21:30", "回住宿", "計程車"],
    ],
  },
  {
    date: "12/2", weekday: "三", iso: "2026-12-02",
    title: "太宗台・白淺文化村・返台",
    photos: [{ label: "太宗台", y: 199 }, { label: "白淺文化村", y: 606 }],
    imageHeight: 884,
    events: [
      ["08:00", "早餐"],
      ["09:30", "退房、寄放行李"],
      ["09:45", "前往太宗台", "計程車"],
      ["10:15–12:00", "太宗台、園區循環車", "", "園區循環車視營運情況搭乘"],
      ["12:00–12:30", "前往白淺文化村", "計程車"],
      ["12:30–14:30", "白淺文化村、海邊巷弄"],
      ["14:30–15:30", "影島海景咖啡廳"],
      ["15:30–16:00", "回住宿拿行李", "計程車"],
      ["16:00–17:00", "南浦最後一餐"],
      ["約 17:15", "前往金海機場", "計程車"],
      ["20:50", "起飛返台", "航班"],
    ],
  },
];

const airport = ["金海機場國際航廈", "김해국제공항 국제선터미널"];
const haeundae = ["海雲台海水浴場", "해운대해수욕장", 35.15855, 129.16053];
const gwangalli = ["廣安里海灘", "광안리해수욕장", 35.15417, 129.12056];
const village = ["白淺文化村", "흰여울문화마을", 35.07828, 129.04532];
const hotel = ["住宿地點"];

const destinationsByDay = [
  {
    2: hotel,
    3: ["南浦洞宵夜", "부산 남포동 야식"],
    4: hotel,
  },
  {
    1: ["甘川文化村", "감천문화마을", 35.09750, 129.00917],
    3: ["甘川文化村附近午餐", "감천문화마을 맛집"],
    4: ["松島海水浴場", "부산 송도해수욕장", 35.07619, 129.01803],
    5: ["札嘎其市場", "자갈치시장", 35.09665, 129.02966],
    6: ["BIFF 廣場", "부산 비프광장"],
    7: hotel,
  },
  {
    1: haeundae,
    3: ["冬柏島", "부산 동백섬"],
    4: ["海雲台豬肉湯飯", "해운대 돼지국밥"],
    5: ["天空膠囊尾浦站", "해운대블루라인파크 미포정거장", 35.15821, 129.17285],
    6: ["青沙浦燈塔", "청사포 빨간등대"],
    7: ["青沙浦海景咖啡廳", "청사포 오션뷰 카페"],
    8: ["海雲台傳統市場", "해운대전통시장"],
    9: hotel,
  },
  {
    1: ["海東龍宮寺", "해동용궁사", 35.18833, 129.22333],
    3: ["機張海鮮餐廳", "기장 해산물 맛집"],
    4: ["機張海景咖啡廳", "기장 오션뷰 카페"],
    5: gwangalli,
    7: ["廣安里海鮮晚餐", "광안리 해산물 맛집"],
    8: hotel,
  },
  {
    2: ["太宗台園區入口", "태종대유원지 입구"],
    4: village,
    6: ["影島海景咖啡廳", "부산 영도 오션뷰 카페"],
    7: hotel,
    8: ["南浦洞餐廳", "부산 남포동 맛집"],
    9: airport,
  },
];

const progressKey = "busan-trip-2026-progress-v1";
const packingKey = "busan-trip-2026-packing-v1";
const hotelKey = "busan-trip-2026-hotel-v1";
const defaultPacking = [
  "護照", "機票與住宿確認資料", "天空膠囊訂位資料", "韓元、信用卡",
  "手機與旅遊 eSIM／SIM 卡", "充電線、充電器、行動電源", "轉接插頭",
  "保暖外套、圍巾", "好走的鞋", "個人常用藥品",
].map(label => ({ label, packed: false }));

function readStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function saveStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Keep changes available for this open page if browser storage is blocked.
  }
}

const savedProgress = readStorage(progressKey, {});
const completed = typeof savedProgress === "object" && !Array.isArray(savedProgress) ? savedProgress : {};
const savedPacking = readStorage(packingKey, defaultPacking);
const packing = Array.isArray(savedPacking)
  ? savedPacking.filter(item => typeof item?.label === "string")
  : defaultPacking;
const savedHotel = readStorage(hotelKey, "");
let hotelQuery = typeof savedHotel === "string" ? savedHotel : "";

const byId = id => document.getElementById(id);
const dayNav = byId("days");
const panel = byId("day-panel");
const timeline = byId("timeline");
const gallery = byId("gallery");
const progressLabel = byId("progress-label");
const progressBar = byId("progress-bar");
const previousStep = byId("previous-step");
const nextStep = byId("next-step");
const homeView = byId("home-view");
const scheduleView = byId("schedule-view");
const packingList = byId("packing-list");
const packingInput = byId("packing-input");
const hotelInput = byId("hotel-input");
const mobileDevice = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
  || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
let dayIndex = 0;

function element(tagName, className, label) {
  const node = document.createElement(tagName);
  if (className) node.className = className;
  if (label !== undefined) node.textContent = label;
  return node;
}

function makePhoto(dayIndex, photoIndex, decorative = false) {
  const day = trip[dayIndex];
  const photo = day.photos[photoIndex];
  const frame = element("div", "photo");
  const image = element("img");
  image.src = "photos/day-" + (dayIndex + 1) + ".jpg";
  image.alt = decorative ? "" : photo.label;
  image.style.setProperty("--offset", (-100 * photo.y / day.imageHeight) + "%");
  frame.append(image);
  return frame;
}

function eventKey(day, index) {
  return day.iso + "/" + index;
}

function stepState(day) {
  const finished = day.events.map((_, index) => completed[eventKey(day, index)] === true);
  const current = finished.indexOf(false);
  const previous = finished.lastIndexOf(true, current === -1 ? finished.length - 1 : current - 1);
  return {
    finished, current,
    previous: current === 0 ? -1 : previous,
    count: finished.filter(Boolean).length,
  };
}

function makeNavigation(destination, mode) {
  const [label, placeQuery, latitude, longitude] = destination;
  const query = destination === hotel ? hotelQuery : placeQuery;
  const row = element("div", "route");
  row.append(element("span", "route-label", "前往 " + label));
  if (!query) {
    const setup = element("a", "route-secondary", "設定住宿");
    setup.href = "#hotel-heading";
    row.append(setup);
    return row;
  }

  const webUrl = "https://map.naver.com/p/search/" + encodeURIComponent(query);
  const hasCoordinates = Number.isFinite(latitude) && Number.isFinite(longitude);
  const params = new URLSearchParams({ appname: window.location.origin });
  if (hasCoordinates) {
    params.set("dlat", latitude);
    params.set("dlng", longitude);
    params.set("dname", query);
  } else {
    params.set("query", query);
  }

  const links = element("span", "route-links");
  const guide = element("a", "route-guide", hasCoordinates && mobileDevice ? "NAVER Map 導航" : "NAVER Map 搜尋");
  guide.href = mobileDevice ? "nmap://" + (hasCoordinates ? "route/" + mode : "search") + "?" + params : webUrl;
  guide.setAttribute("aria-label", guide.textContent + "，" + label);
  if (!mobileDevice) {
    guide.target = "_blank";
    guide.rel = "noopener noreferrer";
  }
  links.append(guide);

  if (mobileDevice) {
    const web = element("a", "route-secondary", "網頁地圖");
    web.href = webUrl;
    web.target = "_blank";
    web.rel = "noopener noreferrer";
    web.setAttribute("aria-label", "網頁地圖，" + label);
    links.append(web);
  }
  row.append(links);
  return row;
}

function makeEvent(event, index, state) {
  const [time, title, tag, note] = event;
  const item = element("li", "event");
  const destination = destinationsByDay[dayIndex][index];
  if (destination) item.append(makeNavigation(destination, tag === "計程車" ? "car" : "walk"));

  const body = element("div", "event-body");
  if (index === state.current) body.setAttribute("aria-current", "step");
  if (state.finished[index]) body.classList.add("event-completed");
  const eventTime = element("time", "", time);
  eventTime.dateTime = time.match(/\d{2}:\d{2}/)[0];
  const details = element("div");
  details.append(element("span", "event-title", title));
  if (note) details.append(element("p", "event-note", note));
  if (tag) details.append(element("span", tag === "重點行程" ? "tag highlight" : "tag", tag));
  if (state.finished[index]) details.append(element("span", "event-status", "已完成"));
  body.append(eventTime, details);
  item.append(body);
  return item;
}

function showSteps() {
  const day = trip[dayIndex];
  const state = stepState(day);
  timeline.replaceChildren(...day.events.map((event, index) => makeEvent(event, index, state)));
  const active = day.events[state.current];
  byId("step-label").textContent = active ? "目前行程" : "今日行程";
  byId("step-title").textContent = active ? active[0] + " " + active[1] : "今日行程已完成";
  progressLabel.textContent = "已完成 " + state.count + " / " + day.events.length;
  progressBar.max = day.events.length;
  progressBar.value = state.count;
  previousStep.disabled = state.previous === -1;
  nextStep.disabled = !active && dayIndex === trip.length - 1;
  nextStep.textContent = active ? "下一步" : dayIndex === trip.length - 1 ? "已完成" : "下一天";
}

function showDay(index) {
  dayIndex = index;
  const day = trip[index];
  dayNav.querySelectorAll("button").forEach((button, buttonIndex) => {
    const selected = buttonIndex === index;
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  panel.setAttribute("aria-labelledby", "day-tab-" + index);
  byId("day-date").textContent = "DAY " + (index + 1) + " · " + day.date + "（" + day.weekday + "）";
  byId("day-title").textContent = day.title;
  gallery.replaceChildren(...day.photos.map((photo, photoIndex) => {
    const figure = element("figure");
    figure.append(makePhoto(index, photoIndex), element("figcaption", "", photo.label));
    return figure;
  }));
  showSteps();
}

function revealActiveStep() {
  const step = timeline.querySelector('[aria-current="step"]');
  if (!step) return;
  const row = step.parentElement;
  const rect = row.getBoundingClientRect();
  const controlsBottom = nextStep.closest(".step-flow").getBoundingClientRect().bottom;
  if (rect.top < controlsBottom || rect.bottom > window.innerHeight) {
    row.scrollIntoView({ block: "center" });
  }
}

nextStep.addEventListener("click", () => {
  const day = trip[dayIndex];
  const state = stepState(day);
  if (state.current !== -1) {
    completed[eventKey(day, state.current)] = true;
    saveStorage(progressKey, completed);
    showSteps();
    revealActiveStep();
  } else if (dayIndex < trip.length - 1) {
    showDay(dayIndex + 1);
    dayNav.scrollIntoView({ block: "start" });
  }
});

previousStep.addEventListener("click", () => {
  const day = trip[dayIndex];
  const state = stepState(day);
  if (state.previous === -1) return;
  delete completed[eventKey(day, state.previous)];
  saveStorage(progressKey, completed);
  showSteps();
  revealActiveStep();
});

trip.forEach((day, index) => {
  const button = element("button");
  button.type = "button";
  button.id = "day-tab-" + index;
  button.setAttribute("role", "tab");
  button.setAttribute("aria-controls", "day-panel");
  const date = element("time", "", day.date + " " + day.weekday);
  date.dateTime = day.iso;
  button.append(element("span", "day-number", "DAY " + (index + 1)), date);
  button.addEventListener("click", () => showDay(index));
  button.addEventListener("keydown", event => {
    const tabs = {
      ArrowLeft: (index + trip.length - 1) % trip.length,
      ArrowRight: (index + 1) % trip.length,
      Home: 0,
      End: trip.length - 1,
    };
    if (!Object.hasOwn(tabs, event.key)) return;
    event.preventDefault();
    const target = tabs[event.key];
    showDay(target);
    byId("day-tab-" + target).focus();
  });
  dayNav.append(button);
});

const scheduleGuide = byId("schedule-guide");
const guideFrame = byId("schedule-guide-frame");

function loadScheduleGuide() {
  if (scheduleGuide.open && !guideFrame.hasAttribute("src")) guideFrame.src = guideFrame.dataset.src;
}

scheduleGuide.addEventListener("toggle", loadScheduleGuide);
document.querySelector(".schedule-tools a").addEventListener("click", () => {
  if (window.location.hash === "#schedule-guide") showView();
});
window.addEventListener("message", event => {
  const origin = location.protocol === "file:" ? "null" : location.origin;
  if (event.source !== guideFrame.contentWindow || event.origin !== origin) return;
  const { type, height } = event.data ?? {};
  if (type === "busan-guide-resize" && Number.isFinite(height) && height > 0) {
    guideFrame.style.height = Math.min(height, 10000) + "px";
  }
});

function showView() {
  const guide = window.location.hash === "#schedule-guide";
  const schedule = guide || window.location.hash === "#schedule";
  homeView.hidden = schedule;
  scheduleView.hidden = !schedule;
  byId("home-nav").setAttribute("aria-current", schedule ? "false" : "page");
  byId("schedule-nav").setAttribute("aria-current", schedule ? "page" : "false");
  if (guide) {
    scheduleGuide.open = true;
    loadScheduleGuide();
    scheduleGuide.scrollIntoView();
  }
}

function updatePackingCount() {
  const count = packing.filter(item => item.packed).length;
  byId("packing-progress").textContent = "已打包 " + count + " / " + packing.length;
}

function makePackingItem(item) {
  const row = element("li", "packing-item");
  const label = element("label");
  const check = element("input");
  check.type = "checkbox";
  check.checked = item.packed === true;
  check.addEventListener("change", () => {
    item.packed = check.checked;
    saveStorage(packingKey, packing);
    updatePackingCount();
  });
  label.append(check, element("span", "", item.label));
  row.append(label);
  return row;
}

byId("packing-form").addEventListener("submit", event => {
  event.preventDefault();
  const label = packingInput.value.trim();
  if (!label) return;
  const item = { label, packed: false };
  packing.push(item);
  packingList.append(makePackingItem(item));
  saveStorage(packingKey, packing);
  updatePackingCount();
  packingInput.value = "";
  packingInput.focus();
});

byId("hotel-form").addEventListener("submit", event => {
  event.preventDefault();
  hotelQuery = hotelInput.value.trim();
  hotelInput.value = hotelQuery;
  saveStorage(hotelKey, hotelQuery);
  const status = byId("hotel-status");
  status.textContent = hotelQuery ? "已儲存住宿地點" : "已清除住宿地點";
  status.hidden = false;
  showSteps();
});

const arrival = Date.parse("2026-11-28T20:05:00+09:00");
const returnFlight = Date.parse("2026-12-02T20:50:00+09:00");
const countdown = byId("countdown");
const tripState = byId("trip-state");
let countdownInterval;

function updateCountdown() {
  const now = Date.now();
  if (now >= arrival) {
    countdown.hidden = true;
    tripState.hidden = false;
    const status = now < returnFlight ? "釜山旅程進行中" : "釜山旅程已結束";
    if (tripState.textContent !== status) tripState.textContent = status;
    if (now >= returnFlight) clearInterval(countdownInterval);
    return;
  }
  const total = Math.ceil((arrival - now) / 1000);
  for (const [id, value] of [
    ["days-left", Math.floor(total / 86400)],
    ["hours-left", Math.floor(total / 3600) % 24],
    ["minutes-left", Math.floor(total / 60) % 60],
    ["seconds-left", total % 60],
  ]) {
    byId(id).textContent = String(value).padStart(2, "0");
  }
}

if (mobileDevice) {
  const oliveNearby = byId("olive-nearby");
  const params = new URLSearchParams({ query: "올리브영", appname: window.location.origin });
  oliveNearby.href = "nmap://search?" + params;
  oliveNearby.removeAttribute("target");
  byId("olive-web").hidden = false;
}

const phraseDialog = byId("ses-phrase-dialog");
const phraseStatus = byId("ses-phrase-status");
byId("show-ses-phrase").addEventListener("click", () => {
  phraseStatus.textContent = "";
  phraseDialog.showModal();
});
byId("copy-ses-phrase").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(byId("ses-phrase").textContent);
    phraseStatus.textContent = "已複製韓文";
  } catch {
    phraseStatus.textContent = "請長按韓文文字並選擇複製";
  }
});

packingList.replaceChildren(...packing.map(makePackingItem));
updatePackingCount();
hotelInput.value = hotelQuery;
byId("hero-beach").append(makePhoto(2, 0, true));
byId("hero-train").append(makePhoto(2, 1, true));
const seoulDate = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul", dateStyle: "short" }).format(new Date());
const today = trip.findIndex(day => day.iso === seoulDate);
showDay(Math.max(0, today));
window.addEventListener("hashchange", () => {
  showView();
  if (window.location.hash === "#hotel-heading") {
    hotelInput.focus();
  } else if (window.location.hash === "#entry-guide") {
    byId("entry-guide").scrollIntoView();
  } else if (window.location.hash !== "#schedule-guide") {
    window.scrollTo(0, 0);
  }
});
showView();
countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown();
