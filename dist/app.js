const defaultHotelQuery = "스테이가온 부산 중구 중앙대로 24";
const hotel = ["Stay Gaon", defaultHotelQuery];
const airport = ["金海機場國際航廈", "김해국제공항 국제선터미널"];
const porkSoup = ["1953 Brothers 豬肉湯飯中央店", "1953형제돼지국밥 중앙점"];
const gamcheon = ["甘川洞文化村", "감천문화마을", 35.09750, 129.00917];
const cableCar = ["松島海上纜車・松島灣站", "송도해상케이블카 송도베이스테이션", 35.07664, 129.02340];
const beach = ["海雲台海水浴場", "해운대해수욕장", 35.15855, 129.16053];
const haeundaeMarket = ["海雲台傳統市場", "해운대전통시장"];
const trailhead = ["蓬萊山・福泉寺登山口候選", "영도 복천사"];
const summit = ["蓬萊山山頂", "부산 영도 봉래산 정상"];
const temple = ["海東龍宮寺", "해동용궁사"];
const ofWon = ["Of Won", "해운대 오브원 달맞이길62번길 19"];
const bagel = ["London Bagel Museum 西面店", "런던베이글뮤지엄 서면점"];
const mansion = ["老宅邸 Old Mansion 西面田浦店", "올드맨션 서면전포점 전포대로209번길 17-6"];
const jeonpo = ["田浦咖啡街", "전포카페거리"];
const clinicBuilding = ["Centum Core 大樓", "부산 해운대구 센텀2로 19"];
const centumFood = ["Centum City 午餐", "센텀시티역 맛집"];
const gwangalli = ["廣安里海水浴場", "광안리해수욕장", 35.15417, 129.12056];
const mipo = ["藍線公園・尾浦站", "해운대블루라인파크 미포정거장"];
const cheongsapo = ["藍線公園・青沙浦站", "해운대블루라인파크 청사포정거장"];
const mipoFood = ["尾浦附近午餐", "해운대 미포 맛집"];

const trip = [
  {
    date: "11/28", weekday: "六", iso: "2026-11-28",
    title: "抵達釜山・南浦洞",
    photos: [{ day: 1, label: "南浦洞夜市", y: 193, height: 440 }],
    events: [
      ["16:50–20:05", "IT606 桃園 → 釜山", "航班", "16:50 為台灣出發時間，20:05 為韓國抵達時間。", [["桃園機場", "台灣 桃園國際機場"], airport]],
      ["20:05", "抵達金海機場", "", "辦理入境、領取行李。", [airport]],
      ["約 21:30–22:00", "前往 Stay Gaon、辦理入住", "計程車", "搭車時間依入境與領行李進度。Stay Gaon 位於釜山中區中央大路 24 號 7 樓。", [hotel]],
      ["入住後", "南浦洞簡單晚餐、便利商店補給", "備選", "晚到先查 Subok Center 或附近 BHC 是否還能點餐，1953 Brothers 中央店也保留為備選。", [
        ["Subok Center 魚板", "수복센타 부산 중구 남포길 25-3"], ["附近 BHC Chicken", "부산 남포동 BHC 치킨"], porkSoup,
        ["南浦洞便利商店", "남포역 편의점"]]],
    ],
  },
  {
    date: "11/29", weekday: "日", iso: "2026-11-29",
    title: "甘川洞文化村・松島・南浦洞",
    photos: [{ day: 2, label: "甘川文化村", y: 156, height: 770 }, { day: 2, label: "松島海上纜車", y: 506, height: 770 }],
    events: [
      ["08:00", "起床、早餐", "", "餐後從南浦洞前往甘川文化村。", [hotel, gamcheon]],
      ["09:00–11:00", "甘川洞文化村", "", "彩色山城、巷弄拍照、小王子與狐狸雕像，逛小店與紀念品。", [gamcheon, ["小王子與狐狸雕像", "감천문화마을 어린왕자와 여우 동상"]]],
      ["11:00–12:00", "午餐・牛腿骨牛頭肉湯", "", "先列甘川沿線的老店「옛날국수집」供比對。", [["옛날국수집 牛頭肉湯候選", "부산 서구 옛날국수집 소머리곰탕"]]],
      ["12:00–12:30", "從甘川前往松島", "計程車", "請以松島灣下站為目的地。", [cableCar]],
      ["12:30–15:00", "松島海上纜車、天空步道", "", "搭乘纜車、拍海岸景色，再到松島天空步道與海邊散步。", [cableCar, ["松島天空步道", "송도구름산책로"], ["松島海水浴場", "부산 송도해수욕장"]]],
      ["15:00–15:30", "從松島返回南浦洞", "公車／計程車", "可從札嘎其市場開始逛。", [["札嘎其市場", "자갈치시장", 35.09665, 129.02966]]],
      ["15:30–18:00", "南浦洞商圈", "", "依序逛札嘎其市場、BIFF 廣場、富平罐頭市場、光復路與 Olive Young，穿插小吃和小店。", [
        ["札嘎其市場", "자갈치시장"], ["BIFF 廣場", "부산 비프광장"], ["富平罐頭市場", "부평깡통시장"], ["光復路商圈", "부산 광복로 패션거리"], ["附近 Olive Young", "올리브영 부산 남포동"]]],
      ["18:00–19:30", "南浦洞晚餐", "備選", "優先查看 1969 刀削麵或 1953 Brothers。Ijaemo Pizza 南浦本店通常週日休息，當天若有公告營業再考慮。", [
        ["1969 刀削麵南浦本店", "1969부원동칼국수 부산본점"], porkSoup, ["Ijaemo Pizza 南浦本店", "이재모피자 본점"]]],
    ],
  },
  {
    date: "11/30", weekday: "一", iso: "2026-11-30",
    title: "蓬萊山日出・海東龍宮寺・海雲台・田浦",
    photos: [{ day: 4, label: "海東龍宮寺", y: 148, height: 754 }, { day: 3, label: "海雲台海水浴場", y: 163, height: 832 }],
    events: [
      ["04:50–05:10", "起床、準備出發", "", "備頭燈、保暖層與防滑鞋，三人結伴。", [hotel]],
      ["05:20", "從住宿搭車前往蓬萊山登山口", "計程車", "暫列影島福泉寺一側為登山口候選，出發前確認起登點與下山接車點。", [trailhead]],
      ["下車後–07:30", "登蓬萊山、看日出", "重點行程", "11/30 釜山市區預估約 07:12 日出。循已確認的登山步道上山，山頂拍照後開始下山。", [trailhead, summit]],
      ["07:30–08:30", "下山、早餐", "", "早餐後直接前往海東龍宮寺。", [["影島早餐", "부산 영도 아침 식사"]]],
      ["約 08:30", "從影島前往海東龍宮寺", "計程車", "路程受下山時間與車況影響。若無法 09:00 到，就縮短寺廟停留，或順延海雲台午餐。", [temple]],
      ["09:00–10:30", "海東龍宮寺", "", "欣賞海岸寺廟，參觀主要區域、散步與拍照。依實際抵達時間調整。", [temple]],
      ["10:30–11:30", "從龍宮寺前往海雲台", "公車／計程車", "", [beach, haeundaeMarket]],
      ["11:30–12:30", "海雲台午餐", "", "", [["海雲台午餐", "해운대역 점심 맛집"]]],
      ["12:30–15:30", "海雲台海灘、傳統市場", "", "逛周邊特色店。有意喝 Of Won 的話先查當天營業，店家一般週一公休。", [beach, haeundaeMarket, ofWon]],
      ["15:30–17:00", "海雲台彈性時段", "", "咖啡廳、逛街或海邊拍照。", [["海雲台咖啡廳", "해운대해수욕장 카페"], beach]],
      ["17:00–18:00", "前往田浦／西面", "地鐵／計程車", "London Bagel Museum 釜山店在西面樂天百貨 B1，時間充裕才順路去；18:00 燒肉優先。", [mansion, bagel]],
      ["18:00–19:30", "晚餐・老宅邸 Old Mansion", "重點行程", "本趟主要燒肉。三人可先點肉品套餐，再視食量加點。", [mansion]],
      ["19:30–20:30", "田浦咖啡街", "", "飯後散步、咖啡、甜點或逛特色小店。", [jeonpo]],
    ],
  },
  {
    date: "12/1", weekday: "二", iso: "2026-12-01",
    title: "醫美診所・Centum City・廣安里",
    photos: [{ day: 4, label: "廣安大橋夜景", y: 484, height: 754 }],
    events: [
      ["09:00–09:30", "前往 Centum Core", "地鐵／計程車", "釜山海雲台區 Centum 2-ro 19，Centum Core 2 樓。地圖先定位大樓，報到時以預約資訊上的診所名稱與樓層為準。", [clinicBuilding]],
      ["10:00", "三人醫美療程", "重點行程", "報到、諮詢、確認並進行各自預約的項目。結束時間依現場安排。", [clinicBuilding]],
      ["療程後", "Centum City 午餐", "", "依療程進度及診所交代，在診所附近用餐。", [centumFood]],
      ["下午", "Museum 1 藝術館", "備選", "只有診所確認可參觀、且三人狀況都好時才安排。", [["Museum 1", "뮤지엄원 센텀서로 20"]]],
      ["晚上", "廣安里海灘、廣安大橋夜景", "備選", "依療程後狀況決定。晚餐可選 83Haechi，也可到 La Poeyu 吃甜點。", [gwangalli, ["83Haechi 廣安里店", "83해치 광안리점"], ["La Poeyu 廣安店（라푀유）", "라푀유 광안점"]]],
    ],
  },
  {
    date: "12/2", weekday: "三", iso: "2026-12-02",
    title: "海雲台・天空膠囊・青沙浦・返台",
    photos: [{ day: 3, label: "海雲台天空膠囊", y: 544, height: 832 }],
    events: [
      ["08:30–09:30", "早餐、整理行李、退房", "", "行李寄放在 Stay Gaon。", [hotel]],
      ["10:00–11:30", "從南浦洞前往海雲台尾浦", "地鐵／計程車", "", [mipo]],
      ["11:30–12:30", "尾浦或海雲台午餐", "", "簡單用餐，把時間留給膠囊列車報到。", [mipoFood]],
      ["12:30–13:20", "尾浦周邊・天空膠囊報到", "重點行程", "已購票，請在 13:10–13:20 左右抵達尾浦站，核對車票、搭乘方向及排隊位置。", [mipo]],
      ["13:30–14:00", "天空膠囊・尾浦 → 青沙浦", "重點行程", "單程約 30 分鐘，搭乘及抵達時間依現場排隊狀況。", [mipo, cheongsapo]],
      ["14:00–15:30", "青沙浦雙胞胎燈塔、海岸", "", "踏石天空步道視營業與剩餘時間再去。咖啡廳有空才排，15:30 準備回南浦。", [
        ["青沙浦紅燈塔", "청사포 빨간등대"], ["青沙浦踏石天空步道", "청사포 다릿돌전망대"], ["青沙浦咖啡廳", "청사포 오션뷰 카페"]]],
      ["15:30–16:30", "青沙浦返回南浦洞", "計程車", "", [hotel]],
      ["16:30–17:00", "回 Stay Gaon 領行李", "", "", [hotel]],
      ["約 17:00", "從南浦洞前往金海機場", "計程車", "直接前往國際航廈。", [airport]],
      ["約 18:00", "抵達機場、報到及托運", "", "", [airport]],
      ["20:50–22:30", "IT607 釜山 → 桃園", "航班", "20:50 為韓國出發時間，22:30 為台灣抵達時間。", [airport, ["桃園機場", "台灣 桃園國際機場"]]],
    ],
  },
];

const progressKey = "busan-trip-2026-progress-v2";
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
let hotelQuery = typeof savedHotel === "string" && savedHotel.trim() ? savedHotel : defaultHotelQuery;

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

function makePhoto(photo, decorative = false) {
  const frame = element("div", "photo");
  const image = element("img");
  image.src = "photos/day-" + photo.day + ".jpg";
  image.alt = decorative ? "" : photo.label;
  image.style.setProperty("--offset", (-100 * photo.y / photo.height) + "%");
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
  const [name, placeQuery, latitude, longitude] = destination;
  const query = destination === hotel ? hotelQuery : placeQuery;
  const label = destination === hotel && query !== defaultHotelQuery ? "自訂住宿" : name;
  const row = element("div", "route");

  const webUrl = "https://map.naver.com/p/search/" + encodeURIComponent(query);
  const hasCoordinates = Number.isFinite(latitude) && Number.isFinite(longitude);
  const params = new URLSearchParams({ appname: window.location.href.split("#")[0] });
  if (hasCoordinates) {
    params.set("dlat", latitude);
    params.set("dlng", longitude);
    params.set("dname", query);
  } else {
    params.set("query", query);
  }

  const links = element("span", "route-links");
  const guide = element("a", "route-guide", label);
  guide.href = mobileDevice ? "nmap://" + (hasCoordinates ? "route/" + mode : "search") + "?" + params : webUrl;
  guide.setAttribute("aria-label", "NAVER Map" + (hasCoordinates && mobileDevice ? " 路線" : " 地圖搜尋") + "，" + label);
  if (!mobileDevice) {
    guide.target = "_blank";
    guide.rel = "noopener noreferrer";
  }
  links.append(guide);

  if (mobileDevice) {
    const web = element("a", "route-secondary", "網頁");
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
  const [time, title, tag, note, destinations = []] = event;
  const item = element("li", "event");

  const body = element("div", "event-body");
  if (index === state.current) body.setAttribute("aria-current", "step");
  if (state.finished[index]) body.classList.add("event-completed");
  const timeOfDay = time.match(/\d{2}:\d{2}/)?.[0];
  const eventTime = element(timeOfDay ? "time" : "span", "event-time", time);
  if (timeOfDay) eventTime.dateTime = timeOfDay;
  const details = element("div");
  details.append(element("span", "event-title", title));
  if (note) details.append(element("p", "event-note", note));
  if (tag) details.append(element("span", tag === "重點行程" ? "tag highlight" : "tag", tag));
  if (state.finished[index]) details.append(element("span", "event-status", "已完成"));
  body.append(eventTime, details);
  item.append(body);
  if (destinations.length) {
    const mode = /公車|地鐵/.test(tag) ? "public" : tag === "計程車" ? "car" : "walk";
    const directions = element("div", "event-maps");
    directions.setAttribute("aria-label", title + "的地圖");
    directions.append(...destinations.map(place => makeNavigation(place, mode)));
    item.append(directions);
  }
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
  gallery.replaceChildren(...day.photos.map(photo => {
    const figure = element("figure");
    figure.append(makePhoto(photo), element("figcaption", "", photo.label));
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
  hotelQuery = hotelInput.value.trim() || defaultHotelQuery;
  hotelInput.value = hotelQuery;
  saveStorage(hotelKey, hotelQuery);
  const status = byId("hotel-status");
  status.textContent = hotelQuery === defaultHotelQuery ? "使用預設住宿 Stay Gaon" : "已儲存自訂導航地點";
  status.hidden = false;
  showSteps();
});

const arrival = Date.parse("2026-11-28T20:05:00+09:00");
const returnArrival = Date.parse("2026-12-02T22:30:00+08:00");
const countdown = byId("countdown");
const tripState = byId("trip-state");
let countdownInterval;

function updateCountdown() {
  const now = Date.now();
  if (now >= arrival) {
    countdown.hidden = true;
    tripState.hidden = false;
    const status = now < returnArrival ? "釜山旅程進行中" : "釜山旅程已結束";
    if (tripState.textContent !== status) tripState.textContent = status;
    if (now >= returnArrival) clearInterval(countdownInterval);
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
byId("hero-beach").append(makePhoto(trip[2].photos[1], true));
byId("hero-train").append(makePhoto(trip[4].photos[0], true));
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
