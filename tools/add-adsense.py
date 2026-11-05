#!/usr/bin/env python3
"""Insert your Google AdSense code into every page of the site.

Usage:   python3 add-adsense.py ca-pub-1234567890123456 [path-to-site-folder]

Run it once, AFTER you get your publisher ID from Google AdSense.
It replaces the <!-- ADSENSE_SNIPPET ... --> marker in every .html file and
writes the matching line into ads.txt. It is safe to run again.
"""
import re, sys, pathlib

if len(sys.argv) < 2 or not re.fullmatch(r"ca-pub-\d{16}", sys.argv[1]):
    sys.exit("Please give your AdSense publisher ID, for example: ca-pub-1234567890123456")
cid = sys.argv[1]
root = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else "prayertim-site")
if not root.is_dir():
    sys.exit(f"Folder not found: {root}")
tag = f'<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={cid}" crossorigin="anonymous"></script>'
marker = re.compile(r"<!-- ADSENSE_SNIPPET[^>]*-->")
done = skipped = 0
for f in root.rglob("*.html"):
    s = f.read_text(encoding="utf-8")
    if "adsbygoogle.js" in s:
        skipped += 1
        continue
    n, c = marker.subn(tag, s, count=1)
    if c:
        f.write_text(n, encoding="utf-8")
        done += 1
(root / "ads.txt").write_text(f"google.com, {cid.replace('ca-', '')}, DIRECT, f08c47fec0942fa0\n", encoding="utf-8")
print(f"Updated {done} pages ({skipped} already had the code). ads.txt written.")
