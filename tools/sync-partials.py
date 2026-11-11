#!/usr/bin/env python3
"""Copy the shared nav and footer into every page.

Edit partials/nav.html or partials/footer.html, then run from the repo root:

    python3 tools/sync-partials.py

Each page marks where the partials go with comment markers:

    <!-- partial:nav -->  ...  <!-- /partial:nav -->
    <!-- partial:footer -->  ...  <!-- /partial:footer -->

The nav link for the current page gets class="active" and aria-current="page".
Service pages (listed in SERVICE_PAGES) highlight the "Services" link.
404.html is skipped because it uses absolute /ServiCell/ paths.
Line endings of each page are preserved.
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SKIP = {"404.html"}
SERVICE_PAGES = {
    "screen-repair.html",
    "battery-replacement.html",
    "back-glass-repair.html",
    "carrier-unlocking.html",
    "software-repair.html",
}


def read_partial(name):
    return (ROOT / "partials" / f"{name}.html").read_text(encoding="utf-8").rstrip("\n")


def nav_for(page, nav):
    target = 'href="index.html#services"' if page in SERVICE_PAGES else f'href="{page}"'

    def mark(m):
        tag = m.group(0)
        if target in tag:
            tag = tag.replace('class="nav-btn"', 'class="nav-btn active" aria-current="page"')
        return tag

    return re.sub(r'<a href="[^"]*" class="nav-btn"[^>]*>', mark, nav)


def replace_block(text, name, content, page):
    pattern = re.compile(rf"(<!-- partial:{name} -->)(.*?)(<!-- /partial:{name} -->)", re.S)
    if not pattern.search(text):
        sys.exit(f"{page}: missing <!-- partial:{name} --> markers")
    return pattern.sub(lambda m: f"{m.group(1)}\n    {content}\n    {m.group(3)}", text, count=1)


def main():
    nav, footer = read_partial("nav"), read_partial("footer")
    changed = 0
    for path in sorted(ROOT.glob("*.html")):
        if path.name in SKIP:
            continue
        raw = path.read_bytes().decode("utf-8")
        crlf = "\r\n" in raw
        text = raw.replace("\r\n", "\n")
        new = replace_block(text, "nav", nav_for(path.name, nav), path.name)
        new = replace_block(new, "footer", footer, path.name)
        if new != text:
            out = new.replace("\n", "\r\n") if crlf else new
            path.write_bytes(out.encode("utf-8"))
            changed += 1
            print(f"updated {path.name}")
    print(f"{changed} page(s) updated")


if __name__ == "__main__":
    main()
