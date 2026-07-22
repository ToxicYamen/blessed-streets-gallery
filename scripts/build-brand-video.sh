#!/usr/bin/env bash
#
# Web-ready hero loops from the raw campaign footage.
#
# The source clips are 1080p50 straight off the camera (23–176 MB). Shipping one
# as a hero background would cost more than the whole rest of the page.
#
# Each output is: silent, 30 fps, height-capped, CRF-encoded H.264 with
# +faststart (moov atom up front so the browser can start playing before the
# whole file lands). A poster frame is emitted next to it so nothing pops in.
#
# Run from the shop root:  bash scripts/build-brand-video.sh

set -euo pipefail

SRC="BlessedStreetsResource"
OUT="public/brand"
mkdir -p "$OUT"

# clip → name : start : duration.  The footage is shot vertically (rotation lives
# in the metadata), so we let ffmpeg apply the display matrix and cap the height.
#
# We take a short window, not the whole take: a hero loop only needs to be long
# enough that the cut is not obvious. The full 24 s clip encodes to 5.6 MB —
# heavier than everything else on the page put together.
CLIPS=(
  "MVI_1080:hero:6:8"    # full body, graffiti wall, red tag — most movement
  "MVI_1085:logo:0:3"    # close on the chest embroidery
)

for entry in "${CLIPS[@]}"; do
  IFS=':' read -r src_name out_name start dur <<< "$entry"
  src="$SRC/${src_name}.mp4"
  [[ -f "$src" ]] || { echo "  fehlt: $src"; continue; }

  in_kb=$(( $(stat -c%s "$src") / 1024 ))

  ffmpeg -y -loglevel error -ss "$start" -t "$dur" -i "$src" \
    -an \
    -vf "scale=-2:1080:flags=lanczos,fps=25" \
    -c:v libx264 -preset veryslow -crf 34 -profile:v high -pix_fmt yuv420p \
    -movflags +faststart \
    "$OUT/${out_name}.mp4"

  # Poster = the loop's own first frame, so <video poster> shows instantly and
  # matches what plays (a poster from a different frame flashes on load).
  ffmpeg -y -loglevel error -ss "$start" -i "$src" \
    -vframes 1 -vf "scale=-2:1080:flags=lanczos" \
    -c:v libwebp -quality 70 \
    "$OUT/${out_name}-poster.webp"

  out_kb=$(( $(stat -c%s "$OUT/${out_name}.mp4") / 1024 ))
  poster_kb=$(( $(stat -c%s "$OUT/${out_name}-poster.webp") / 1024 ))

  printf "  %-6s %6s KB  →  %4s KB video + %s KB poster\n" \
    "$out_name" "$in_kb" "$out_kb" "$poster_kb"
done
