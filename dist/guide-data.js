const busanGuideData = (() => {
  const verified = "2026-11-22";
  const sources = {
    stations: "https://www.data.go.kr/data/15013205/standard.do",
    railMap: "https://www2.humetro.busan.kr/homepage/manage/page/subLocation.do?menu_no=1001010102",
    touristMap: "https://english.visitkorea.or.kr/public/contents/region/ENG/Busan_TouristMap_ENG.pdf",
    metro: "https://www2.humetro.busan.kr/homepage/manage/page/subLocation.do?menu_no=1001010501",
    transfer: "https://www2.humetro.busan.kr/homepage/manage/page/subLocation.do?menu_no=100101050301",
    lightRail: "https://www.bglrt.com/00163.web",
    bus: "https://www.busan.go.kr/eng/public-transportation",
    express: "https://www.busan.go.kr/bige/news/view?bbsNo=10&dataNo=70065&srchCl=News",
    airport: "https://www.airport.co.kr/gimhaeeng/cms/frCon/index.do?MENU_ID=110",
    airportTaxi: "https://www.airport.co.kr/gimhaeeng/cms/frCon/index.do?CONTENTS_NO=4&MENU_ID=110",
    airportTime: "https://www.maritimekorea2026.or.kr/content.php?conts_sn=11&lang=en&site=week",
    moneyBox: "https://moneybox-exchange.com/locations/",
    port: "https://www.busanpa.com/bpt/index.bpa?menuCd=DOM_000000401011000000",
    visitBusan: "https://www.visitbusan.net/zht/index.do",
    blueLine: "https://www.bluelinepark.com/eng/skyCapsuleTime.do",
  };
  const lines = {
    "1": { label: "地鐵 1 號線", color: "#bf5018", operator: "釜山交通公社" },
    "2": { label: "地鐵 2 號線", color: "#25813c", operator: "釜山交通公社" },
    "3": { label: "地鐵 3 號線", color: "#93672b", operator: "釜山交通公社" },
    "4": { label: "地鐵 4 號線", color: "#1463ac", operator: "釜山交通公社" },
    lrt: { label: "釜山金海輕軌", color: "#8645a8", operator: "釜山金海輕軌" },
    east: { label: "東海線", color: "#227894", operator: "KORAIL" },
  };
  // Transfer station pairs verified against the operator network map.
  const transfers = [
    ["1-119", "2-219"], ["1-123", "3-305"], ["1-125", "4-402"],
    ["1-124", "east-413"], ["2-208", "3-301"], ["2-233", "3-313"],
    ["2-205", "east-419"], ["3-306", "east-412"], ["3-309", "4-401"],
    ["2-227", "lrt-101"], ["3-317", "lrt-107"],
  ];
  const zones = {
    center: "西面／市中心", nampo: "南浦／舊城", west: "甘川／松島",
    coast: "海雲臺／青沙浦", gwangan: "廣安里", east: "機張", airport: "金海機場", port: "釜山港",
  };
  const categories = { food: "美食", sea: "海景", shop: "購物", culture: "文化", family: "親子", relaxed: "輕鬆慢遊" };
  const transitLabels = { rail: "鐵路或地鐵", bus: "公車接駁", walk: "步行" };

  const metro = { card: [1600, 1800], single: [1700, 1900], oneDay: 6000, threeDay: 13000 };
  const rates = {
    bus: 1550, night: 2000, express: 2100, nightExpress: 2500,
    lrt1: 1600, lrt2: 1800, airportWest: 6000, airportEast: 9500,
  };
  const metroRule = "1 區間為行駛 10 公里內，超過為 2 區間。";
  const busRule = "同張交通卡下車刷卡，通常 30 分鐘內轉乘、最多 2 次；依適用路線。";
  const limitPass = "自首次使用起計；只限地鐵 1–4 號線，可不限次數搭乘。";
  const busDate = "2023-10-06";
  const fares = [
    { title: "地鐵 QR 單程票", amount: "₩1,700／₩1,900", detail: metroRule + " 單次乘車；跨工具轉乘另計。", source: sources.metro },
    { title: "地鐵交通卡 · T-money／Cashbee", amount: "₩1,600／₩1,800", detail: metroRule + " 跨工具轉乘依優惠條件。", source: sources.metro },
    { title: "地鐵 1 日票", amount: "₩6,000", detail: "手機票・當日有效。" + limitPass, source: sources.metro },
    { title: "地鐵 3 日票", amount: "₩13,000", detail: "手機票・連續 3 日有效。" + limitPass, source: sources.metro },
    { title: "市區一般公車", amount: "交通卡 ₩1,550／現金 ₩1,700", detail: busRule + " 現金無轉乘優惠。", source: sources.bus, validFrom: busDate },
    { title: "一般夜間公車", amount: "交通卡 ₩2,000／現金 ₩2,100", detail: busRule, source: sources.bus, validFrom: busDate },
    { title: "急行公車（含機場 2029）", amount: "交通卡 ₩2,100／現金 ₩2,200", detail: busRule + " 與機場利木津是不同服務。", source: sources.bus, validFrom: busDate },
    { title: "急行夜間公車", amount: "交通卡 ₩2,500／現金 ₩2,600", detail: busRule, source: sources.bus, validFrom: busDate },
    { title: "釜山金海輕軌", amount: "交通卡 ₩1,600／₩1,800；單次 ₩1,700／₩1,900", detail: "依輕軌分區，地鐵日票不適用。符合轉乘條件時，2025/09/19 起取消廣域轉乘附加費，區間差額仍按規則計收。", source: sources.lightRail },
    { title: "機場利木津巴士", amount: "西面 ₩6,000／海雲臺・機張 ₩9,500", detail: "機場公告可用信用卡；班次和票價以營運方當日資訊為準。地鐵日票不適用。", source: sources.airport },
    { title: "東海線", amount: "依起訖站，尚待確認", detail: "適用範圍與票價請看 KORAIL，地鐵日票不適用。", source: sources.bus },
  ];

  const money = (id, zh, ko, zone, address, latitude, longitude, hours, station) => ({
    id, nameZh: "Money Box " + zh, nameKo: "머니박스 " + ko, nameEn: "Money Box " + id,
    zone, address, latitude, longitude, hours, station, duration: 20,
    currencies: "官方門市列有 TWD 等外幣，現鈔與當日報價以門市為準。",
    source: sources.moneyBox + id + "/", kind: "exchange",
  });
  const exchanges = [
    money("seomyeon", "西面店", "서면점", "center", "56 Seomyeon-ro, Busanjin-gu, Busan", 35.15603, 129.05798, "平日 08:00–20:00；週末 08:00–18:00", "1-119"),
    money("nampo", "南浦店", "남포점", "nampo", "38 Gwangbok-ro, Jung-gu, Busan", 35.09926, 129.02915, "每日 09:00–20:00", "1-110"),
    money("haeundae", "海雲臺店", "해운대점", "coast", "287 Haeundaehaebyeon-ro, Haeundae-gu, Busan", 35.16035, 129.16204, "每日 09:00–19:00", "2-203"),
    money("gimhae-international-airport", "金海機場店", "김해공항점", "airport", "165 Gonghangjinip-ro, Gangseo-gu, Busan（店家公布地址）", 35.17177, 128.94877, "每日 06:00–21:00；先向店家確認樓層及是否可進入", "lrt-104"),
    { id: "bnk-port", nameZh: "釜山港國際客運碼頭 · 釜山銀行", nameKo: "부산항국제여객터미널 부산은행", nameEn: "BNK Busan Bank at International Passenger Terminal", zone: "port", address: "206 Chungjang-daero, Dong-gu, Busan · 國際客運碼頭 2 樓", latitude: 35.11745, longitude: 129.0489, station: "1-113", hours: "每月調整，可電洽 051-462-7706", currencies: "提供換匯；可換幣別尚待確認。", duration: 20, source: sources.port, kind: "exchange" },
  ];

  const kto = id => "https://english.visitkorea.or.kr/svc/contents/contentsView.do?vcontsId=" + id;
  const photo = (filename, author, license = "by-sa/4.0") => ({
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/" + encodeURIComponent(filename) + "?width=600",
    source: "https://commons.wikimedia.org/wiki/File:" + encodeURIComponent(filename),
    author, license: "CC " + license.toUpperCase().replace("/", " "),
    licenseUrl: "https://creativecommons.org/licenses/" + license + "/",
  });
  const attractions = [
    { id:"seomyeon-area", nameZh:"西面商圈", nameKo:"서면", nameEn:"Seomyeon", zone:"center", latitude:35.15774, longitude:129.059084, address:"釜山鎮區西面站商圈（地圖標示西面站）", station:"1-119", transit:"rail", categories:["food","shop"], duration:120, description:"地下街、百貨與餐廳集中，適合抵達後安排逛街吃飯。", hours:"商家各異", ticket:"商圈免費", source:sources.touristMap },
    { id:"nampo-area", nameZh:"南浦洞", nameKo:"남포동", nameEn:"Nampo-dong", zone:"nampo", latitude:35.097953, longitude:129.034869, address:"釜山廣域市中區南浦洞（地圖標示南浦站一帶）", station:"1-111", transit:"rail", categories:["food","shop","culture"], duration:100, description:"舊城購物街區，可串連光復路、市場與港邊。", hours:"各店不同", ticket:"商圈免費", source:sources.touristMap },
    { id:"jagalchi", nameZh:"札嘎其市場", nameKo:"자갈치시장", nameEn:"Jagalchi Market", aliases:["扎嘎其"], zone:"nampo", latitude:35.09661, longitude:129.03058, address:"52 Jagalchihaean-ro, Jung-gu, Busan", station:"1-110", transit:"rail", categories:["food","culture"], duration:90, description:"港邊海鮮市場，可選購鮮魚、乾貨或用餐。", hours:"05:00–22:00，每月第 1、3 個星期二休市；各攤位不同", opens:300, closes:1320, closedTuesdays:[1,3], ticket:"自由入場；餐飲另計", source:kto(69318) },
    { id:"biff", nameZh:"BIFF 廣場", nameKo:"BIFF 광장", nameEn:"BIFF Square", zone:"nampo", latitude:35.09881, longitude:129.02918, address:"BIFF Gwangjang-ro, Jung-gu, Busan", station:"1-110", transit:"walk", categories:["food","culture"], duration:45, description:"以釜山國際電影節聞名的老城街區，周邊有小吃攤與商店。", hours:"室外廣場，攤商各異", ticket:"免費", source:kto(95411) },
    { id:"gamcheon", nameZh:"甘川文化村", nameKo:"감천문화마을", nameEn:"Gamcheon Culture Village", zone:"west", latitude:35.09746, longitude:129.01060, address:"203 Gamnae 2-ro, Saha-gu, Busan", station:"1-109", transit:"bus", categories:["culture","relaxed"], duration:110, description:"沿山坡看彩色民宅與小巷藝術，從土城站轉社區公車。為居民生活區，請保持安靜。", hours:"街區可散步，設施時間請查官方", ticket:"街區免費，體驗另計", source:kto(72894), image:photo("Gamcheon_Cultural_Village,_Busan.jpg","Brit in Seoul") },
    { id:"haeundae-beach", nameZh:"海雲臺海水浴場", nameKo:"해운대해수욕장", nameEn:"Haeundae Beach", aliases:["海雲台"], zone:"coast", latitude:35.15908, longitude:129.16028, address:"264 Haeundaehaebyeon-ro, Haeundae-gu, Busan", station:"2-203", transit:"rail", categories:["sea","family","relaxed"], duration:90, description:"從海雲臺站出發可逛海灘與沿線商圈，適合海邊散步。", hours:"沙灘開放；下水依季節管制", ticket:"免費", source:kto(111053), image:photo("Haeundae_Beach_May_2024.jpg","Brit in Seoul") },
    { id:"gwangalli-beach", nameZh:"廣安里海水浴場", nameKo:"광안리해수욕장", nameEn:"Gwangalli Beach", zone:"gwangan", latitude:35.15377, longitude:129.11852, address:"219 Gwanganhaebyeon-ro, Suyeong-gu, Busan", station:"2-209", transit:"rail", categories:["sea","food","relaxed"], duration:90, description:"從沙灘看廣安大橋，也可沿海濱找晚餐或咖啡店。", hours:"全天開放；活動另看公告", ticket:"免費", source:kto(111074), image:photo("Gwangalli_Beach_in_Busan.jpg","Leeyj0401") },
    { id:"cheongsapo", nameZh:"青沙浦", nameKo:"청사포", nameEn:"Cheongsapo Port", zone:"coast", latitude:35.16040, longitude:129.19219, address:"Jung-dong, Haeundae-gu, Busan", station:"east-421", transit:"bus", categories:["sea","food","relaxed"], duration:75, description:"海邊漁港，可由青沙浦觀光列車站步行探索；東海線松亭站可作為轉乘參考。", hours:"港區與商家營業時間各異", ticket:"港區免費", source:kto(63145) },
    { id:"sky-capsule", nameZh:"海雲臺天空膠囊列車（尾浦站）", nameKo:"해운대블루라인파크 미포정거장", nameEn:"Haeundae Sky Capsule · Mipo Station", zone:"coast", latitude:35.15821, longitude:129.17285, address:"13 Dalmaji-gil 62beon-gil, Haeundae-gu, Busan", station:"2-203", transit:"walk", categories:["sea","family"], duration:75, description:"尾浦與青沙浦間單程搭乘約 30 分鐘，另留報到與候車時間。", hours:"依季節與預約班次", ticket:"需購票，請確認預約時段", reservation:true, source:sources.blueLine },
    { id:"songdo", nameZh:"松島海上纜車（松島灣站）", nameKo:"송도해상케이블카 송도베이스테이션", nameEn:"Busan Air Cruise · Songdo Bay Station", zone:"west", latitude:35.07664, longitude:129.02340, address:"171 Songdohaebyeon-ro, Seo-gu, Busan", station:"1-111", transit:"bus", categories:["sea","family"], duration:100, description:"從松島海灘搭乘跨海纜車前往岩南公園，從南浦站可轉公車前往。", hours:"依營運方與天候", ticket:"需購票", source:"https://en.busanaircruise.co.kr/info/location" },
    { id:"gijang", nameZh:"機張市場", nameKo:"기장시장", nameEn:"Gijang Market", zone:"east", latitude:35.24380, longitude:129.21560, address:"72-3 Daera-ri, Gijang-eup, Gijang-gun, Busan", station:"east-423", transit:"rail", categories:["food","culture"], duration:90, description:"機張市區的傳統市集，適合吃海鮮或採買。", hours:"市場 07:00–22:00；各店不同", opens:420, closes:1320, ticket:"自由入場；餐飲另計", source:kto(86048) },
  ].map(attraction => ({ ...attraction, kind:"spot" }));

  const airportStation = "lrt-104";
  const airportProfiles = {
    "2-219": { title:"西面站", via:["lrt-101", "2-227"], metroZone:1, railTime:"約 40–50 分鐘", limo:"west", taxi:[18000, 45, "西面樂天飯店"] },
    "1-119": { title:"西面站（1 號線）", via:["lrt-101", "2-227", "2-219"], metroZone:1, railTime:"約 40–50 分鐘到西面轉乘站", limo:"west", taxi:[18000, 45, "西面樂天飯店"] },
    "1-111": { title:"南浦站", via:["lrt-101", "2-227", "2-219", "1-119"], metroZone:2, taxi:[20000, 60, "南浦洞札嘎其市場"] },
    "1-113": { title:"釜山站", via:["lrt-101", "2-227", "2-219", "1-119"], metroZone:2 },
    "2-203": { title:"海雲臺站", via:["lrt-101", "2-227"], metroZone:2, railTime:"約 80 分鐘", limo:"east", taxi:[25000, 70, "海雲臺 Paradise Hotel"] },
    "lrt-101": { title:"沙上站", metroZone:0 },
  };
  return { verified, sources, lines, zones, categories, transitLabels, metro, rates, fares, transfers, attractions, exchanges, airportStation, airportProfiles };
})();