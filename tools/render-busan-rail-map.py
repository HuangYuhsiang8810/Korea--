"""Render the Busan metro station-order diagram from the guide's rail data."""

import json
import os
import re
from collections import defaultdict
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, PngImagePlugin


ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
FONTS = Path(os.environ.get("WINDIR", "C:/Windows")) / "Fonts"
OUTPUT = DIST / "photos/busan-rail-network.png"
VERIFIED = "2026-11-22"
METRO_SOURCE = "https://data.humetro.busan.kr/homepage/cyberstation/map.do"
LRT_SOURCE = "https://www.bglrt.com/00162.web"
KORAIL_SOURCE = "https://dev2.letskorail.com/images/subway_map.pdf"

# KORAIL's second section follows Ilgwang (east-424) in the published station order.
EAST_EXTENSION = (
    ("佐川", "좌천"), ("月內", "월내"), ("西生", "서생"), ("南倉", "남창"),
    ("望陽", "망양"), ("德下", "덕하"), ("Gaeunpo", "개운포"), ("太和江", "태화강"),
)
# Street-level connections confirmed by the Korea Railway Industry Information Center.
WALK_SOURCE = "https://www.kric.go.kr/jsp/board/portal/sub05/res/themeEssayDetail.jsp?board_seq=2479"
OUTDOOR_TRANSFERS = (("1-120", "east-410"), ("4-404", "east-414"))
SIGN_NAMES = {
    "1-113": "부산역", "2-205": "벡스코(시립미술관)", "2-212": "경성대·부경대",
    "2-217": "국제금융센터·부산은행", "lrt-102": "괘법 르네스떼", "lrt-103": "서부산 유통지구",
}
LINE_BADGES = {"1": "1", "2": "2", "3": "3", "4": "4", "lrt": "L", "east": "D"}
EXPECTED_COUNTS = {"1": 40, "2": 43, "3": 17, "4": 14, "lrt": 21, "east": 23}
INK, MUTED, PAPER = "#102c43", "#445d6d", "#f0f5f7"
ROW_HEIGHT = 46
CARD_WIDTH = 552
WIDTH, HEIGHT = 2400, 2750


def load_network():
    station_script = (DIST / "guide-stations.js").read_text(encoding="utf-8")
    data_script = (DIST / "guide-data.js").read_text(encoding="utf-8")
    stations = json.loads(station_script[station_script.index("["):station_script.rindex("]") + 1])
    stations.extend({"id": f"east-{code}", "code": code, "line": "east", "nameZh": zh, "nameKo": ko}
                    for code, (zh, ko) in enumerate(EAST_EXTENSION, 425))
    lines = dict((line, (label, color)) for line, label, color in re.findall(
        r'^\s*"?(\w+)"?: \{ label: "([^"]+)", color: "(#[0-9a-f]{6})"', data_script, re.M
    ))
    by_line = defaultdict(list)
    for station in sorted(stations, key=lambda stop: stop["code"]):
        by_line[station["line"]].append(station)
    assert {line: len(stops) for line, stops in by_line.items()} == EXPECTED_COUNTS
    assert set(lines) == set(EXPECTED_COUNTS)
    assert len({station["id"] for station in stations}) == len(stations)
    for stops in by_line.values():
        assert all(a["code"] + 1 == b["code"] for a, b in zip(stops, stops[1:]))
    pairs = re.search(r"const transfers = \[(.*?)\n  \];", data_script, re.S)[1]
    indoor = re.findall(r'\["([\w-]+)", "([\w-]+)"\]', pairs)
    assert len(indoor) == 11
    transfers = defaultdict(list)
    identifiers = {station["id"]: station["line"] for station in stations}
    for a, b in [*indoor, *OUTDOOR_TRANSFERS]:
        outdoor = (a, b) in OUTDOOR_TRANSFERS
        transfers[a].append((identifiers[b], outdoor))
        transfers[b].append((identifiers[a], outdoor))
    return lines, by_line, transfers


def render():
    lines, by_line, transfers = load_network()
    image = Image.new("RGB", (WIDTH, HEIGHT), PAPER)
    draw = ImageDraw.Draw(image)
    title = ImageFont.truetype(FONTS / "msjhbd.ttc", 77)
    heading = ImageFont.truetype(FONTS / "msjhbd.ttc", 34)
    body = ImageFont.truetype(FONTS / "msjh.ttc", 30)
    name_zh = ImageFont.truetype(FONTS / "msjhbd.ttc", 23)
    name_ko = ImageFont.truetype(FONTS / "malgun.ttf", 20)
    badge_font = ImageFont.truetype(FONTS / "segoeuib.ttf", 22)

    def badge(x, y, line, outdoor=False):
        color = lines[line][1]
        draw.rounded_rectangle((x, y, x + 33, y + 31), radius=7,
                               fill="white" if outdoor else color, outline=color, width=3)
        draw.text((x + 16, y + 15), LINE_BADGES[line], font=badge_font,
                  fill=color if outdoor else "white", anchor="mm")

    def line_card(x, y, line):
        label, color = lines[line]
        stops = by_line[line]
        first_y = y + 89
        last_y = first_y + (len(stops) - 1) * ROW_HEIGHT
        bottom = last_y + 30
        draw.rounded_rectangle((x, y, x + CARD_WIDTH, bottom), radius=22, fill="white", outline="#ccdce2", width=2)
        badge(x + 21, y + 16, line)
        draw.text((x + 68, y + 31), label, font=heading, fill=INK, anchor="lm")
        draw.text((x + CARD_WIDTH - 23, y + 31), f"{len(stops)} 站", font=name_zh, fill=MUTED, anchor="rm")
        draw.line((x + 21, y + 59, x + CARD_WIDTH - 21, y + 59), fill="#dce7ea", width=2)
        draw.line((x + 35, first_y, x + 35, last_y), fill=color, width=7)
        for index, stop in enumerate(stops):
            cy = first_y + index * ROW_HEIGHT
            links = transfers[stop["id"]]
            radius = 10 if links or index in (0, len(stops) - 1) else 7
            draw.ellipse((x + 35 - radius, cy - radius, x + 35 + radius, cy + radius),
                         fill="white", outline=color, width=4)
            draw.text((x + 60, cy - 10), stop.get("nameZh") or stop["nameEn"], font=name_zh, fill=INK, anchor="lm")
            draw.text((x + 60, cy + 12), SIGN_NAMES.get(stop["id"], stop["nameKo"]),
                      font=name_ko, fill=MUTED, anchor="lm")
            for offset, (target, outdoor) in enumerate(links):
                badge(x + CARD_WIDTH - 55 - 40 * offset, cy - 15, target, outdoor)
        return bottom

    draw.rectangle((0, 0, WIDTH, 271), fill=INK)
    draw.rectangle((56, 54, 66, 208), fill="#65c9bd")
    draw.text((95, 59), "釜山地鐵與輕軌全站圖", font=title, fill="white")
    draw.text((98, 169), "BUSAN METROPOLITAN RAIL", font=heading, fill="#bce9e4")
    draw.text((WIDTH - 58, 65), "6 條營運路線", font=heading, fill="white", anchor="ra")
    draw.text((WIDTH - 58, 123), "資料核對 " + VERIFIED, font=body, fill="#c6dae1", anchor="ra")
    draw.text((WIDTH - 58, 172), "站序示意・非地理比例", font=body, fill="#c6dae1", anchor="ra")

    badge(57, 302, "2")
    draw.text((103, 318), "可轉乘的路線", font=body, fill=INK, anchor="lm")
    badge(378, 302, "east", True)
    draw.text((424, 318), "站外步行轉乘", font=body, fill=INK, anchor="lm")
    draw.text((WIDTH - 58, 318), "同一轉乘點的站名在各線重複列出", font=body, fill=MUTED, anchor="rm")

    y = 367
    line_card(55, y, "1")
    line_card(634, y, "2")
    line_card(1213, line_card(1213, y, "3") + 24, "4")
    bottom = line_card(1792, line_card(1792, y, "lrt") + 24, "east")

    footer = bottom + 40
    draw.line((55, footer, WIDTH - 55, footer), fill="#afc5ce", width=2)
    draw.text((55, footer + 22), "資料來源　釜山交通公社・釜山金海輕軌・韓國鐵道公社 KORAIL", font=body, fill=INK)
    draw.text((55, footer + 67), "站外步行轉乘　釜田（1 號線與東海線）・樂民（4 號線）至東萊（東海線）", font=name_zh, fill=MUTED)
    metadata = PngImagePlugin.PngInfo()
    metadata.add_text("Sources", "\n".join((METRO_SOURCE, LRT_SOURCE, KORAIL_SOURCE, WALK_SOURCE)))
    metadata.add_text("Verified", VERIFIED)
    image.save(OUTPUT, pnginfo=metadata, optimize=True)


if __name__ == "__main__":
    render()
