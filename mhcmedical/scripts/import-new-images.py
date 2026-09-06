#!/usr/bin/env python3
"""Importe, recadre, convertit et range les nouvelles images PNG en WebP."""
from pathlib import Path
from PIL import Image

SRC = Path("/home/ubuntu/.cursor/projects/workspace/assets")
ROOT = Path(__file__).resolve().parent.parent / "assets" / "images"
MAX_WIDTH = 1600
MAX_BYTES = 300 * 1024

DIRECT = {
    "6111f373-b647-4d04-af97-868b8c0e5393.png": "devanture-jour.webp",
    "3ca8f542-41fe-49e3-b40a-e74615d508b5.png": "magasin/rayon-mobilite.webp",
    "6eb0c89b-72de-476a-b629-8667832452c1.png": "magasin/rayon-parapharmacie.webp",
    "c9ab05da-ee8e-42fd-b493-1e34212516d8.png": "magasin/rayon-orthopedie.webp",
    "2af18669-c49b-4800-ba4c-19ca8d0c5946.png": "magasin/rayon-chaussures.webp",
    "fe8c7ac7-2a63-4453-9cdd-bbeadd86fcb4.png": "magasin/rayon-diagnostic.webp",
    "260ea00a-15f2-4ec6-89d1-8d47646fc67d.png": "magasin/rayon-uniformes.webp",
}


def save_webp(img: Image.Image, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")
    w, h = img.size
    if w > MAX_WIDTH:
        h = int(h * MAX_WIDTH / w)
        w = MAX_WIDTH
        img = img.resize((w, h), Image.LANCZOS)
    quality = 82
    while quality >= 50:
        img.save(dest, "WEBP", quality=quality, method=6)
        if dest.stat().st_size <= MAX_BYTES:
            break
        quality -= 5
    print(f"OK {dest.relative_to(ROOT)} ({dest.stat().st_size // 1024} Ko, q={quality})")


def crop_grid(img: Image.Image, col: int, row: int, cols: int, rows: int, top=0.14, bottom=0.04) -> Image.Image:
    w, h = img.size
    y0 = int(h * top)
    y1 = int(h * (1 - bottom))
    cell_w = w // cols
    cell_h = (y1 - y0) // rows
    x0 = col * cell_w
    y_start = y0 + row * cell_h
    return img.crop((x0, y_start, x0 + cell_w, y_start + cell_h))


def crop_rect(img: Image.Image, left: float, top: float, right: float, bottom: float) -> Image.Image:
    w, h = img.size
    return img.crop((int(w * left), int(h * top), int(w * right), int(h * bottom)))


def main() -> None:
    # Fichiers directs
    for src_name, rel in DIRECT.items():
        src = SRC / src_name
        if not src.exists():
            print(f"SKIP missing {src_name}")
            continue
        save_webp(Image.open(src), ROOT / rel)

    # Devanture verticale (recadrage portrait de la devanture)
    dev = SRC / "6111f373-b647-4d04-af97-868b8c0e5393.png"
    if dev.exists():
        img = Image.open(dev)
        w, h = img.size
        crop_w = int(h * 0.72)
        x0 = (w - crop_w) // 2
        save_webp(img.crop((x0, 0, x0 + crop_w, h)), ROOT / "devanture-verticale.webp")

    # Catalogue 4×3 — chambre, salle de bain, vie quotidienne (flyer principal)
    flyer = SRC / "d3cdabf4-5688-428f-bc81-f513b9c48229.png"
    if flyer.exists():
        img = Image.open(flyer)
        save_webp(crop_grid(img, 0, 0, 5, 2, top=0.17, bottom=0.36), ROOT / "magasin/rayon-chambre.webp")
        save_webp(crop_grid(img, 3, 0, 5, 2, top=0.17, bottom=0.36), ROOT / "magasin/rayon-salle-de-bain.webp")
        save_webp(crop_grid(img, 3, 1, 5, 2, top=0.17, bottom=0.36), ROOT / "magasin/rayon-vie-quotidienne.webp")
        save_webp(crop_rect(img, 0.52, 0.72, 0.98, 0.96), ROOT / "services/conseil-domicile.webp")
        save_webp(crop_rect(img, 0.02, 0.72, 0.48, 0.96), ROOT / "services/livraison-camion.webp")

    # Domicile — lits et installation
    beds = SRC / "67883bff-295a-47bd-a841-e55fcbc7f4ee.png"
    if beds.exists():
        img = Image.open(beds)
        save_webp(crop_grid(img, 1, 0, 3, 3, top=0.10, bottom=0.22), ROOT / "domicile/lit-medicalise-domicile.webp")
        save_webp(crop_grid(img, 1, 1, 3, 3, top=0.10, bottom=0.22), ROOT / "domicile/matelas-anti-escarres.webp")
        save_webp(crop_grid(img, 1, 2, 3, 3, top=0.10, bottom=0.22), ROOT / "domicile/installation-lit-domicile.webp")

    # Partenariat soignants — équipe du flyer uniformes
    uni = SRC / "260ea00a-15f2-4ec6-89d1-8d47646fc67d.png"
    if uni.exists():
        img = Image.open(uni)
        save_webp(crop_rect(img, 0.22, 0.10, 0.88, 0.46), ROOT / "services/partenariat-soignants.webp")

    # Parcours — recadrages du comptoir (intérieur réel) et du rayon diagnostic
    accueil = ROOT / "magasin/interieur-accueil.webp"
    if accueil.exists():
        img = Image.open(accueil)
        w, h = img.size
        save_webp(img.crop((0, int(h * 0.15), w, int(h * 0.85))), ROOT / "parcours/etape-1-ordonnance.webp")
        save_webp(img.crop((int(w * 0.1), int(h * 0.2), int(w * 0.9), h)), ROOT / "parcours/etape-2-remise-ordonnance.webp")
        save_webp(img.crop((int(w * 0.55), int(h * 0.1), w, int(h * 0.75))), ROOT / "parcours/etape-4-remise-materiel.webp")

    diag = ROOT / "magasin/rayon-diagnostic.webp"
    if diag.exists():
        img = Image.open(diag)
        w, h = img.size
        save_webp(img.crop((0, 0, int(w * 0.45), int(h * 0.42))), ROOT / "parcours/etape-3-carte-vitale.webp")

    # Nettoyage anciennes images converties
    old = [
        "equipements/mobilite.webp", "equipements/chambre.webp", "equipements/diagnostic.webp",
        "equipements/mobilite.png", "equipements/chambre.png", "equipements/diagnostic.png",
        "magasin/catalogue-overview.webp", "magasin/catalogue-overview.png",
    ]
    for rel in old:
        p = ROOT / rel
        if p.exists():
            p.unlink()
            print(f"DEL {rel}")


if __name__ == "__main__":
    main()
