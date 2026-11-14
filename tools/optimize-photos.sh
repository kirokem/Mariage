#!/usr/bin/env bash
# ==========================================================================
#  Conversion des photos de couple en WebP, en plusieurs tailles.
#
#  1. Déposez vos photos originales dans le dossier photos/ (à la racine).
#  2. Lancez :  tools/optimize-photos.sh
#  3. Les fichiers sont créés dans site/assets/photos/ sous la forme
#     nom-480.webp, nom-960.webp, nom-1600.webp, nom-2400.webp
#  4. Indiquez le « nom » (sans tiret ni taille) dans site/content.php > photos.
#
#  Aucune photo n'est recadrée : seule la largeur est réduite, les
#  proportions d'origine sont conservées. Les tailles plus grandes que
#  l'original ne sont pas créées. Les données EXIF (GPS…) sont supprimées.
#
#  Nécessite ImageMagick (macOS : brew install imagemagick ;
#  Debian/Ubuntu : sudo apt install imagemagick).
# ==========================================================================
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/photos"
DEST="$ROOT/site/assets/photos"
WIDTHS=(480 960 1600 2400)
QUALITY=78

if command -v magick >/dev/null 2>&1; then IM=(magick); elif command -v convert >/dev/null 2>&1; then IM=(convert); else
  echo "ImageMagick est introuvable : installez-le d'abord (voir l'en-tête de ce script)." >&2; exit 1
fi
IDENTIFY=(identify); [ "${IM[0]}" = magick ] && IDENTIFY=(magick identify)

mkdir -p "$DEST"
shopt -s nullglob nocaseglob
count=0
for file in "$SRC"/*.{jpg,jpeg,png,webp,tif,tiff,heic}; do
  base="$(basename "${file%.*}")"
  # Nom de fichier simplifié : minuscules, sans accents ni espaces
  name="$(printf '%s' "$base" | iconv -f utf-8 -t ascii//TRANSLIT 2>/dev/null || printf '%s' "$base")"
  name="$(printf '%s' "$name" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+|-+$//g')"
  # Largeur réelle après rotation EXIF
  width="$("${IM[@]}" "$file" -auto-orient -format '%w' info:)"
  echo "→ $base  ($width px)  →  $name"
  rm -f "$DEST/$name"-*.webp
  made=0
  for w in "${WIDTHS[@]}"; do
    if [ "$w" -le "$width" ] || [ "$made" -eq 0 -a "$w" -eq "${WIDTHS[0]}" ]; then
      target=$(( w < width ? w : width ))
      "${IM[@]}" "$file" -auto-orient -strip -resize "${target}x" -quality "$QUALITY" \
        -define webp:method=6 "$DEST/$name-$target.webp"
      echo "   $name-$target.webp"
      made=1
    fi
  done
  # Toujours proposer la taille d'origine si elle se situe entre deux paliers
  last="${WIDTHS[-1]}"
  if [ "$width" -lt "$last" ] && [ ! -f "$DEST/$name-$width.webp" ] && [ "$width" -gt "${WIDTHS[0]}" ]; then
    "${IM[@]}" "$file" -auto-orient -strip -quality "$QUALITY" -define webp:method=6 "$DEST/$name-$width.webp"
    echo "   $name-$width.webp"
  fi
  count=$((count + 1))
done

if [ "$count" -eq 0 ]; then
  echo "Aucune photo trouvée dans $SRC"
else
  echo "Terminé : $count photo(s) convertie(s) dans site/assets/photos/"
fi
