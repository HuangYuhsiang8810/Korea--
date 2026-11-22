# 釜山自由行智慧攻略開發報告

## 現況與實作計畫

正式網站是 GitHub Pages 上的靜態 HTML、CSS、JavaScript，沒有後端、套件管理或建置流程。既有主頁提供五日行程、NAVER Map 外部連結和瀏覽器本機儲存。攻略使用獨立頁面及獨立儲存鍵，沿用主頁版型及外部地圖連結模式。

| 檔案 | 變更 |
| --- | --- |
| `dist/index.html` | 新增首頁入口 |
| `dist/guide.html`、`dist/guide.css` | 攻略介面和響應式版面 |
| `dist/guide-data.js`、`dist/guide-stations.js` | 可獨立更新的雙語交通、票價、換匯和景點資料 |
| `dist/guide-planning.js` | 試算、規則式分配和排序邏輯 |
| `dist/guide.js` | 地圖、列表、表單和本機保存 |
| `tools/update-guide-stations.py` | 可重跑的車站資料整理工具 |
| `tests/guide.test.cjs` | 資料與計算驗收 |

## 範圍

Phase 1 提供地圖和交通、機場、票價、換匯、景點查詢。為涵蓋指定驗收流程，另外提供基本交通費試算、手動匯率、收藏、每日行程生成和調序。其他 Phase 2 和 Phase 3 功能列在驗證後的交付紀錄。

## 已交付

- 交通地圖載入 150 筆車站，涵蓋 1–4 號線、金海輕軌，以及東海線釜田至日光段。支援名稱搜尋、路線切換、站點標記、轉乘資訊和完整官方網路圖。
- 機場頁提供西面、南浦、釜山站、海雲臺、沙上，以及各線已收錄車站。主要目的地附核對過的輕軌轉乘、票價條件，以及有官方資料的巴士或計程車方案。
- 費用頁比較成人交通卡、QR 單程票和地鐵 1／3 日票，依每天的 1／2 區間搭乘次數試算。公車、輕軌、機場巴士和已知的跨工具轉乘總額分開計入。沒有可靠票價時保留待查狀態。
- 換匯地圖收錄 4 間 Money Box 和釜山港的釜山銀行。可開啟地圖、加入規劃清單及雙向手動換算。
- 景點目錄收錄 11 個景點，支援地區、類型和建議交通篩選。照片僅使用已確認授權的來源，並附作者、授權及來源。
- 行程支援日期、天數、住宿區域、風格、大型行李和預算。每天可拖曳或按鈕調序，重新估算時間與已知車資。會提示部分景點未排入、已知休市日與可能趕不上使用者填入的天空膠囊時段。
- 首頁增加攻略連結、暫時隱藏行李清單的新增表單，並說明住宿欄用來帶入 NAVER Map 搜尋。既有行李項目仍可勾選。

## 資料、授權與更新

- 車站取自[韓國國家鐵道公團開放資料](https://www.data.go.kr/data/15013205/standard.do)，頁面標示重用無限制。以[釜山交通公社路線圖](https://www2.humetro.busan.kr/homepage/manage/page/subLocation.do?menu_no=1001010102)和[韓國觀光公社旅遊圖](https://english.visitkorea.or.kr/public/contents/region/ENG/Busan_TouristMap_ENG.pdf)核對轉乘、舊站名及代碼。少數原始位置缺失或與行政區明顯不符，以對應的 OpenStreetMap 站點補正並附連結。站點顯示原始資料日期。
- 地圖用固定版本 [Leaflet 1.9.4](https://leafletjs.com/download.html) 和 [OpenStreetMap 標準圖磚](https://operations.osmfoundation.org/policies/tiles/)，保留署名，只載入正常互動所需圖磚。底圖中斷時，站點清單、詳細資料和外部地圖仍可使用。地圖只呈現站點和景點，完整線路幾何由營運方官方路線圖提供。
- 票價、門市與景點核對日為 **2026-11-22**，各筆附營運方或觀光機關來源。機場交通區分營運方票價、官方估價、交通指引用時及系統試算。規劃只用可核對的轉乘關係做草案，未確認的費用或時間保留待查。
- 更新車站時，從官方入口選 JSON 下載。下載若含 `records` 包裝，可先取出該陣列，再執行 `python tools/update-guide-stations.py station-export.json dist/guide-stations.js`。更新後需重查變更的站名、站號、首末站和轉乘。票價與景點目前在 `dist/guide-data.js` 維護。日後可用同一結構接資料服務。
- 舊頁使用裝置本機儲存。攻略有自己的儲存鍵，收藏與規劃資料只保存在當前瀏覽器。匯率由使用者輸入，沒有預填行情。

## 驗證

- `node --check` 檢查所有網站指令碼。
- 隔離的 Chrome 寬版與窄版驗證了 Leaflet 標記、路線和景點篩選、往返機場、試算、調序、儲存及水平溢位。瀏覽器自動化停用 OSM 底圖請求。
- `node --test tests/guide.test.cjs` 測試資料完整性、機場轉乘、日票範圍、匯率、行程調序和首頁入口。
- `git diff --check` 通過。專案沒有既有 build 或 lint 指令，靜態檔可由瀏覽器執行。

## 後續

- **Phase 2** 可擴充完整東海線、營運日時表和可驗證的站到站步行距離，加入跨日移動、依實際預約自動避開衝突、整日景點開放時間資料及票券和餐飲明細。
- **Phase 3** 待確認資料授權、費用與 API 額度後，整合即時交通及匯率，增加路線最佳化、分享、PDF 和 PWA。AI 行程說明可另加，車資與路線要繼續使用可驗證的資料。

## 五日行程內嵌版

- `#schedule-guide` 開啟五日行程內的攻略。保留交通地圖、機場交通、交通費用、換匯地圖、景點探索五個入口，原先的自訂行程規劃子功能已下架。攻略仍可獨立開啟 `guide.html`。
- 交通地圖附可下載的全站 PNG。圖以站序與換乘關係呈現，含東海線日光以北至太和江的站點。互動地圖的東海線位置標記維持釜田至日光。
- `python tools/render-busan-rail-map.py` 可在有 Pillow 和 Windows 微軟正黑體、Malgun Gothic、Segoe UI 的環境重製 PNG。站別以[釜山交通公社](https://data.humetro.busan.kr/homepage/cyberstation/map.do)、[釜山金海輕軌](https://www.bglrt.com/00162.web)與 [KORAIL](https://dev2.letskorail.com/images/subway_map.pdf) 核對。釜田與樂民至東萊的站外步行參考[韓國鐵道產業資訊中心](https://www.kric.go.kr/jsp/board/portal/sub05/res/themeEssayDetail.jsp?board_seq=2479)。
