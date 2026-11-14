"""
Génère les favicons « C&J » (Bebas Neue, beige sur fond vert olive).
Les lettres sont converties en tracés : aucune police n'est nécessaire
pour afficher l'icône.

Utilisation (une seule fois, déjà fait) :
    pip install fonttools brotli
    python3 tools/make-favicon.py
puis, pour les versions PNG/ICO (ImageMagick + librsvg ou Inkscape) :
    voir README.md
"""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen

ROOT = Path(__file__).resolve().parent.parent
font = TTFont(ROOT / "site/assets/fonts/bebas-neue-400.woff2")
glyphs = font.getGlyphSet()
cmap = font.getBestCmap()
text = "C&J"
tracking = 30  # léger interlettrage (unités de la police)

paths, x = [], 0
for ch in text:
    name = cmap[ord(ch)]
    pen = SVGPathPen(glyphs)
    glyphs[name].draw(pen)
    paths.append((x, pen.getCommands()))
    x += glyphs[name].width + tracking
x -= tracking

bp = BoundsPen(glyphs)
for ch in text:
    glyphs[cmap[ord(ch)]].draw(bp)
cap = font["OS/2"].sCapHeight or 1400

# Mise à l'échelle : le texte occupe ~72 % de la largeur d'un carré de 64
size = 64
scale = size * 0.72 / x
tx = (size - x * scale) / 2
ty = (size + cap * scale) / 2  # centrage vertical sur la hauteur des capitales
groups = "".join(
    f'<path transform="translate({dx} 0)" d="{d}"/>' for dx, d in paths
)
svg = (
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}">'
    f'<rect width="{size}" height="{size}" fill="#626C4A"/>'
    f'<g fill="#F2ECE3" transform="translate({tx:.2f} {ty:.2f}) scale({scale:.5f} {-scale:.5f})">{groups}</g>'
    "</svg>\n"
)
(ROOT / "site/favicon.svg").write_text(svg)
print("site/favicon.svg écrit")
