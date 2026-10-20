#!/usr/bin/env python3
"""Source-only P04B original PDF geometry candidates (never Admission Ready).

Requires: pip install pymupdf
Usage:
 python scripts/review/p12-g04s1-113-original-pdf-native-geometry.py \
   --pdf-dir /path/to/original29-pdfs \
   --out /path/to/unpublished-native-geometry-candidates.json

Original school PDFs remain private/local; only file hashes and source geometry
are exported. No OCR, automatic Science answer or KP/rights decision.
"""
import argparse
import hashlib
import json
import pathlib
import re

try:
    import fitz
except ImportError as exc:
    raise SystemExit("Install pymupdf: python -m pip install pymupdf") from exc

ROOT = pathlib.Path(__file__).resolve().parents[2]
REGISTRY = ROOT / "data/review/p12-g04s1-113-all29-kp48-source-firstpass-v1.json"
NUMBER_BEFORE = re.compile(r"(?P<paren>[（(][ \u3000\t]*[）)])\s*(?P<num>\d{1,2})[.．、]")
NUMBER_AFTER = re.compile(r"(?P<num>\d{1,2})\s*[.．、]\s*(?P<paren>[（(][ \u3000\t]*[）)])")
EMPTY = re.compile(r"[（(][ \u3000\t]*[）)]")
SQUARE = re.compile(r"[□▢☐]")


def extract(pdf, paper_id):
    records = []
    for page_no, page in enumerate(pdf, start=1):
        for block in page.get_text("rawdict").get("blocks", []):
            for line in block.get("lines", []):
                chars = [c for span in line.get("spans", []) for c in span.get("chars", [])]
                if not chars:
                    continue
                text = "".join(c["c"] for c in chars)
                used, matches = set(), []
                for rule, regex in (("number_before", NUMBER_BEFORE), ("number_after", NUMBER_AFTER)):
                    for match in regex.finditer(text):
                        left, right = match.span("paren")
                        if any(i in used for i in range(left, right)):
                            continue
                        used.update(range(left, right))
                        matches.append((left, right, rule, int(match.group("num"))))
                for match in EMPTY.finditer(text):
                    left, right = match.span()
                    if any(i in used for i in range(left, right)):
                        continue
                    used.update(range(left, right))
                    matches.append((left, right, "unbound_empty_bracket", None))
                for match in SQUARE.finditer(text):
                    matches.append((*match.span(), "square_glyph", None))
                for a, b, rule, num in matches:
                    box = [
                        min(c["bbox"][0] for c in chars[a:b]),
                        min(c["bbox"][1] for c in chars[a:b]),
                        max(c["bbox"][2] for c in chars[a:b]),
                        max(c["bbox"][3] for c in chars[a:b]),
                    ]
                    if not (box[0] >= 0 and box[1] >= 0 and box[0] < box[2] <= page.rect.width + 2
                            and box[1] < box[3] <= page.rect.height + 2):
                        continue
                    records.append({"page": page_no, "native_marker_bbox_pt": [round(v, 2) for v in box],
                                    "detection_rule": rule, "printed_number_candidate": num,
                                    "formal_source_slot_id": None, "source_exact": False,
                                    "parent_and_image": "PENDING", "admission_ready": False})
    records.sort(key=lambda x: (x["page"], x["native_marker_bbox_pt"][1], x["native_marker_bbox_pt"][0]))
    for n, row in enumerate(records, start=1):
        row["candidate_region_id"] = paper_id + "|GEOMETRY_CANDIDATE|" + str(n).zfill(4)
    return records


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--pdf-dir", type=pathlib.Path, required=True)
    parser.add_argument("--out", type=pathlib.Path, required=True)
    args = parser.parse_args()
    registered = json.loads(REGISTRY.read_text(encoding="utf-8"))["original_source_records"]
    assert len(registered) == 29, "ALL29 registry must have 29 papers"
    report = []
    for paper in registered:
        source = args.pdf_dir / paper["source_title"]
        if not source.exists():
            raise SystemExit("Missing original PDF: " + paper["source_title"])
        actual_sha = hashlib.sha256(source.read_bytes()).hexdigest()
        if actual_sha != paper["original_pdf_sha256"]:
            raise SystemExit("Original binary SHA mismatch: " + paper["source_id"])
        doc = fitz.open(source)
        if len(doc) != paper["original_pdf_page_count"]:
            raise SystemExit("Original page count mismatch: " + paper["source_id"])
        records = extract(doc, paper["source_id"])
        report.append({"paper_id": paper["source_id"], "original_pdf_sha256": actual_sha,
                       "original_pdf_pages": len(doc), "native_source_marker_candidates": len(records),
                       "source_slots_fully_accepted": 0,
                       "geometry_status": "NATIVE_CANDIDATE_ONLY" if records else "NEEDS_ORIGINAL_IMAGE_VISUAL_ANNOTATION",
                       "records": records})
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps({
        "schema_version": "P12_113_G04S1_P04B_NATIVE_SOURCE_GEOMETRY_CANDIDATES_V1",
        "papers": 29, "full_original_slot_closeout": False,
        "warning": "The marker candidates may overlap already published and previously proven source identities. Never sum into published counts. Native characters do not certify parent graphics or source exact options. Scan-only requires separately accepted raster evidence.",
        "records": report
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("ORIGINAL_SHA_PASS=29; NATIVE_CANDIDATE_PAPERS=" +
          str(sum(bool(x["native_source_marker_candidates"]) for x in report)) +
          "; FULL_PAPER_SOURCE_ACCEPTED=0")


if __name__ == "__main__":
    main()
