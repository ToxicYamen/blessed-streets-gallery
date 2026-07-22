#!/usr/bin/env bash
#
# Turn the raw campaign shoot (10–15 MB JPEGs straight off the camera) into
# web-ready responsive assets.
#
#   BlessedStreetsResource/IMG_7405.JPG   ~10 MB
#     → public/brand/sage-03-640.webp     ~40 KB
#     → public/brand/sage-03-1080.webp    ~90 KB
#     → public/brand/sage-03-1600.webp   ~170 KB
#     → public/brand/sage-03-blur.jpg     ~0.6 KB   (LQIP placeholder)
#
# Shipping the originals would blow LCP on every page — one hero image alone is
# heavier than the entire JS bundle.
#
# Requires: ffmpeg (already on the box).
# Run from the shop root:  bash scripts/build-brand-assets.sh

set -euo pipefail

SRC="BlessedStreetsResource"
OUT="public/brand"
WIDTHS=(640 1080 1600)
QUALITY=72          # libwebp: visually lossless at this grade, the shoot is soft anyway

mkdir -p "$OUT"

# Original → semantic name. Derived from the contact sheet: the graffiti-wall
# series splits into the black and the sage colourway, the mall series is lifestyle.
declare -A MAP=(
  [IMG_7399]=black-01   # hood up, back to camera
  [IMG_7400]=black-02   # hood up, facing camera
  [IMG_7402]=black-03   # facing camera, hands in pocket
  [IMG_7402-2]=black-04

  [IMG_7401]=sage-01    # hood up, hands raised
  [IMG_7404]=sage-02    # facing camera
  [IMG_7405]=sage-03    # back to camera  ← hero
  [IMG_7406]=sage-04    # full body

  [IMG_7407]=life-01    # mall, descending the stairs
  [IMG_7408]=life-02    # mall, ceiling geometry
  [IMG_7409]=life-03
  [IMG_7410]=life-04
  [IMG_7411]=life-05
  [IMG_7412]=life-06
  [IMG_7413]=life-07
  [IMG_7414]=life-08
  [IMG_7415]=life-09
)

shopt -s nullglob
total_in=0
total_out=0

for src in "$SRC"/*.JPG "$SRC"/*.jpg; do
  base=$(basename "$src"); base="${base%.*}"
  name="${MAP[$base]:-}"
  if [[ -z "$name" ]]; then
    echo "  skip   $base (nicht gemappt)"
    continue
  fi

  in_kb=$(( $(stat -c%s "$src") / 1024 ))
  total_in=$(( total_in + in_kb ))
  out_kb=0

  for w in "${WIDTHS[@]}"; do
    dst="$OUT/${name}-${w}.webp"
    ffmpeg -y -loglevel error -i "$src" \
      -vf "scale=${w}:-2:flags=lanczos" \
      -c:v libwebp -quality "$QUALITY" -compression_level 6 \
      "$dst"
    out_kb=$(( out_kb + $(stat -c%s "$dst") / 1024 ))
  done

  # Tiny blurred placeholder so the layout never jumps while the real image loads.
  ffmpeg -y -loglevel error -i "$src" \
    -vf "scale=24:-2:flags=lanczos" -q:v 8 \
    "$OUT/${name}-blur.jpg"
  out_kb=$(( out_kb + $(stat -c%s "$OUT/${name}-blur.jpg") / 1024 ))

  total_out=$(( total_out + out_kb ))
  printf "  %-10s %5s KB  →  %4s KB\n" "$name" "$in_kb" "$out_kb"
done

echo ""
echo "  ------------------------------------------"
printf "  gesamt     %5s KB  →  %4s KB   (-%s%%)\n" \
  "$total_in" "$total_out" "$(( 100 - (total_out * 100 / total_in) ))"
