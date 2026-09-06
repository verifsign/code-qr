#!/usr/bin/env python3
"""Convertit les grandes images PNG en WebP 1600px, objectif < 300 Ko."""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent / "assets" / "images"
TARGETS = [
    "magasin-devanture.png",
    "magasin/interieur-accueil.png",
    "magasin/catalogue-overview.png",
    "equipements/mobilite.png",
    "equipements/chambre.png",
    "equipements/diagnostic.png",
]
MAX_WIDTH = 1600
MAX_BYTES = 300 * 1024

for rel in TARGETS:
    src = ROOT / rel
    if not src.exists():
        print(f"SKIP missing: {rel}")
        continue
    dst = src.with_suffix(".webp")
    img = Image.open(src)
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")
    w, h = img.size
    if w > MAX_WIDTH:
        h = int(h * MAX_WIDTH / w)
        w = MAX_WIDTH
        img = img.resize((w, h), Image.LANCZOS)
    quality = 82
    while quality >= 50:
        img.save(dst, "WEBP", quality=quality, method=6)
        size = dst.stat().st_size
        if size <= MAX_BYTES:
            break
        quality -= 5
    print(f"OK {rel} → {dst.name} ({size // 1024} Ko, q={quality})")
