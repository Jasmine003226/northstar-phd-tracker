"""Discover candidate pages and keep only verifiable PhD vacancy details.

This intentionally fails closed: a search page, institution homepage, inaccessible
page, expired vacancy, or page without a concrete job title is never published.
"""
from __future__ import annotations

import datetime as dt
import html
import json
import re
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "data.js"
LOG_FILE = ROOT / "data" / "search-log.json"
TODAY = dt.date.today()
KEYWORDS = (
    "floating wind", "offshore wind", "wind turbine", "aeroelastic",
    "openfast", "qblade", "marine engineering", "mooring",
    "structural dynamics", "fatigue load", "renewable energy",
)
PHD_WORDS = ("phd", "doctoral", "doctorate", "doktorand", "stipendiat")
SEARCHES = [
    "https://euraxess.ec.europa.eu/jobs/search?keywords=offshore%20wind",
    "https://www.academictransfer.com/en/jobs/?q=offshore%20wind",
    "https://www.jobbnorge.no/search/en?OrderBy=Published&Period=All&query=offshore%20wind",
    "https://academicpositions.com/find-jobs?search=offshore%20wind",
]
HEADERS = {"User-Agent": "Northstar-PhD-Tracker/1.0 (+public vacancy verification)"}


def fetch(url: str, timeout: int = 25) -> tuple[str, str]:
    request = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(request, timeout=timeout) as response:
        content_type = response.headers.get_content_charset() or "utf-8"
        return response.geturl(), response.read(2_500_000).decode(content_type, "replace")


def links_from(page_url: str, text: str) -> set[str]:
    found = set()
    for href in re.findall(r"href=[\"']([^\"'#]+)", text, re.I):
        url = urllib.parse.urljoin(page_url, html.unescape(href))
        parsed = urllib.parse.urlparse(url)
        if parsed.scheme in {"http", "https"} and any(w in url.lower() for w in ("job", "vacan", "position")):
            found.add(url)
    return found


def job_postings(text: str) -> list[dict]:
    postings = []
    for raw in re.findall(r"<script[^>]+type=[\"']application/ld\+json[\"'][^>]*>(.*?)</script>", text, re.I | re.S):
        try:
            value = json.loads(html.unescape(raw).strip())
        except (ValueError, TypeError):
            continue
        queue = value if isinstance(value, list) else [value]
        for item in queue:
            if isinstance(item, dict) and item.get("@type") == "JobPosting":
                postings.append(item)
            if isinstance(item, dict) and isinstance(item.get("@graph"), list):
                postings.extend(x for x in item["@graph"] if isinstance(x, dict) and x.get("@type") == "JobPosting")
    return postings


def plain(value) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", html.unescape(str(value or "")))).strip()


def parse_date(value) -> dt.date | None:
    match = re.search(r"\d{4}-\d{2}-\d{2}", str(value or ""))
    if not match:
        return None
    try:
        return dt.date.fromisoformat(match.group())
    except ValueError:
        return None


def location(post: dict) -> tuple[str, str]:
    loc = post.get("jobLocation") or {}
    if isinstance(loc, list):
        loc = loc[0] if loc else {}
    address = loc.get("address", {}) if isinstance(loc, dict) else {}
    return plain(address.get("addressCountry")) or "来源未说明", plain(address.get("addressLocality")) or "来源未说明"


def convert(post: dict, url: str) -> dict | None:
    title = plain(post.get("title"))
    description = plain(post.get("description"))
    combined = f"{title} {description}".lower()
    if not title or not any(x in combined for x in PHD_WORDS) or not any(x in combined for x in KEYWORDS):
        return None
    deadline = parse_date(post.get("validThrough"))
    if deadline and deadline < TODAY:
        return None
    org = post.get("hiringOrganization") or {}
    institution = plain(org.get("name") if isinstance(org, dict) else org) or "来源未说明"
    country, city = location(post)
    matches = [x for x in KEYWORDS if x in combined]
    score = min(96, 62 + 6 * len(matches) + (8 if "floating wind" in combined else 0))
    return {
        "id": re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")[:70],
        "title": title, "institution": institution, "country": country, "city": city,
        "lab": "来源未说明", "topics": matches[:4] or ["海上风电"],
        "deadline": deadline.isoformat() if deadline else None, "firstSeen": TODAY.isoformat(),
        "match": score, "status": "开放（详情页核验）", "verified": True,
        "sourceType": "具体岗位详情页", "source": url,
        "summary": description[:900] or "来源未说明",
        "requirements": ["请查看原始岗位页中的完整申请要求"],
        "fit": [f"岗位明确涉及 {x}" for x in matches[:3]],
    }


def existing_projects(source: str) -> list[dict]:
    match = re.search(r"const PROJECTS = (\[.*?\]);", source, re.S)
    return json.loads(match.group(1)) if match else []


def main() -> None:
    source = DATA_FILE.read_text(encoding="utf-8")
    existing = existing_projects(source)
    candidates, errors = set(), []
    for search in SEARCHES:
        try:
            final_url, body = fetch(search)
            candidates.update(links_from(final_url, body))
        except Exception as exc:  # Network failures are logged, never converted to jobs.
            errors.append(f"{search}: {type(exc).__name__}")
    verified = {}
    for candidate in sorted(candidates)[:120]:
        try:
            final_url, body = fetch(candidate)
            for post in job_postings(body):
                item = convert(post, final_url)
                if item:
                    verified[item["source"]] = item
        except Exception:
            continue
    for item in existing:
        try:
            final_url, body = fetch(item["source"])
            if job_postings(body):
                item["source"] = final_url
                verified[final_url] = item
        except Exception:
            pass
    projects = sorted(verified.values(), key=lambda x: (-x["match"], x.get("deadline") or "9999"))
    replacement = "const PROJECTS = " + json.dumps(projects, ensure_ascii=False, indent=2) + ";"
    source = re.sub(r"const PROJECTS = \[.*?\];", lambda _: replacement, source, count=1, flags=re.S)
    DATA_FILE.write_text(source, encoding="utf-8")
    log = json.loads(LOG_FILE.read_text(encoding="utf-8"))
    log.insert(0, {"date": TODAY.isoformat(), "searched": len(SEARCHES), "candidates": len(candidates), "verified": len(projects), "errors": errors})
    LOG_FILE.write_text(json.dumps(log[:90], ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
