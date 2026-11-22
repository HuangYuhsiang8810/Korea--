"""Normalize an exported Korean national station JSON into the Busan guide catalog."""

import argparse
import json
import re
import unicodedata
from pathlib import Path


LINES = {
    "부산도시철도 1호선": "1",
    "부산도시철도 2호선": "2",
    "부산도시철도 3호선": "3",
    "부산도시철도 4호선": "4",
    "부산-김해경전철": "lrt",
    "동해선": "east",
}

# Correct older names and station codes against the operator network map.
CORRECTIONS = {
    ("1", 100): {"nameZh": "東嵋", "latitude": 35.08977, "longitude": 128.97327, "coordinateSource": "https://www.openstreetmap.org/node/5581117238"},
    ("1", 110): {"nameZh": "札嘎其", "aliases": ["扎嘎其", "札葛其"]},
    ("1", 113): {"nameZh": "釜山站", "nameEn": "Busan Station"},
    ("1", 124): {"nameZh": "教大", "nameEn": "Busan National University of Education"},
    ("2", 201): {"nameZh": "萇山"},
    ("2", 2020): {"code": 202},
    ("2", 203): {"aliases": ["海雲台"]},
    ("2", 205): {"nameZh": "BEXCO", "nameKo": "벡스코", "nameEn": "BEXCO", "aliases": ["市立美術館", "시립미술관"]},
    ("4", 412): {"nameZh": "上盤松", "nameKo": "윗반송", "nameEn": "Witbansong", "aliases": ["東釜山大學", "동부산대학"]},
    ("east", 116): {"code": 416, "latitude": 35.19363, "longitude": 129.11416, "coordinateSource": "https://www.openstreetmap.org/node/7461024100"},
    ("east", 411): {"nameZh": "巨堤迎日"},
    ("east", 413): {"nameZh": "教大", "nameEn": "Busan National University of Education", "latitude": 35.19522, "longitude": 129.08003, "coordinateSource": "https://www.openstreetmap.org/node/8724477916"},
    ("east", 418): {"nameZh": "Centum"},
    ("east", 419): {"nameZh": "BEXCO"},
    ("east", 420): {"aliases": ["新海雲台"]},
    ("east", 421): {"latitude": 35.18773, "longitude": 129.20206, "coordinateSource": "https://www.openstreetmap.org/node/5747416901"},
    ("east", 422): {"nameZh": "Osiria"},
    ("lrt", 102): {"nameZh": "掛法 Renecite"},
    ("lrt", 104): {"nameZh": "金海機場", "aliases": ["機場站", "Airport"]},
}


def field(row, key):
    return str(row.get(key) or "").strip()


def chinese_name(value):
    name = unicodedata.normalize("NFKC", value).replace(" ", "")
    return name if re.search(r"[\u3400-\u9fff]", name) and not re.search(r"[\uac00-\ud7a3?]", name) else None


def normalize(rows):
    stations = {}
    for row in rows:
        line = LINES.get(field(row, "ROUTE_NM"))
        if not line or not field(row, "STATN_NO").isdigit():
            continue
        code = int(row["STATN_NO"])
        name_ko = re.sub(r"역(?:\([1-4]호선\))?$", "", field(row, "STATN_NM"))
        try:
            latitude = float(field(row, "LATITUDE"))
            longitude = float(field(row, "LONGITUDE"))
        except ValueError:
            latitude = longitude = None
        if latitude is not None and not (34.9 <= latitude <= 35.65 and 128.7 <= longitude <= 129.5):
            latitude = longitude = None
        station = {
            "code": code,
            "line": line,
            "nameZh": chinese_name(field(row, "STATN_CHCRT")),
            "nameKo": name_ko,
            "nameEn": re.sub(r"'{2,}", "'", field(row, "STATN_ENM")),
            "latitude": latitude,
            "longitude": longitude,
            "address": field(row, "RDNMADR"),
            "dataDate": field(row, "REFERENCE_DATE"),
            **CORRECTIONS.get((line, code), {}),
        }
        station["id"] = f"{line}-{station['code']}"
        previous = stations.get(station["id"])
        if previous is None or station["dataDate"] > previous["dataDate"]:
            stations[station["id"]] = station
    if len(stations) < 140 or {station["line"] for station in stations.values()} != set(LINES.values()):
        raise ValueError("The export is missing one or more Busan lines or has too few stations.")
    by_line = {line: index for index, line in enumerate(LINES.values())}
    return sorted(stations.values(), key=lambda station: (by_line[station["line"]], station["code"]))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    records = json.loads(args.source.read_text(encoding="utf-8-sig"))
    stations = normalize(records)
    lines = [json.dumps(station, ensure_ascii=False, separators=(", ", ": ")) for station in stations]
    output = "// Source: https://www.data.go.kr/data/15013205/standard.do\n"
    output += "const busanGuideStations = [\n  " + ",\n  ".join(lines) + "\n];\n"
    args.output.write_text(output, encoding="utf-8", newline="\n")
    print(f"Normalized {len(stations)} station records.")


if __name__ == "__main__":
    main()