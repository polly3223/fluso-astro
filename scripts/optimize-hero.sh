#!/bin/bash
#
# optimize-hero.sh — turn a heavy master hero video into web-ready assets.
#
# Produces, next to the source:
#   <name>-1080.mp4 / .webm   → phones      (1920w, H.264 + VP9)
#   <name>-4k.mp4   / .webm   → desktops    (3840w, H.264 + VP9)
#   <name>-poster.webp        → sharp poster (1600w, used as <video poster>)
#   <name>-poster-lqip.webp   → tiny LQIP   (960w, base64-inlined for instant LCP)
#
# WebM (VP9) is smaller and listed first in the <video>; MP4 (H.264) is the
# universal fallback. Audio is dropped (the hero is muted) and mp4 gets
# +faststart so playback can begin before the full file downloads.
#
# Usage:
#   scripts/optimize-hero.sh assets/video/hero-main.mp4
#   scripts/optimize-hero.sh assets/video/hero-main.mp4 my-hero   # custom output basename
#
# Requires: ffmpeg, cwebp  (brew install ffmpeg webp)

set -euo pipefail

SRC="${1:?usage: optimize-hero.sh <input.mp4> [output-basename]}"
[ -f "$SRC" ] || { echo "error: '$SRC' not found"; exit 1; }

DIR="$(cd "$(dirname "$SRC")" && pwd)"
BASE="${2:-$(basename "${SRC%.*}")}"
OUT="$DIR/$BASE"

echo "→ source: $SRC ($(du -h "$SRC" | cut -f1))"

echo "→ 1080p MP4 (mobile, H.264)"
ffmpeg -y -loglevel error -i "$SRC" -an -vf "scale=1920:-2" \
  -c:v libx264 -profile:v high -preset slow -crf 19 -maxrate 12M -bufsize 24M \
  -pix_fmt yuv420p -movflags +faststart "$OUT-1080.mp4"

echo "→ 1080p WebM (mobile, VP9)"
ffmpeg -y -loglevel error -i "$SRC" -an -vf "scale=1920:-2" \
  -c:v libvpx-vp9 -b:v 0 -crf 24 -row-mt 1 -tile-columns 2 -threads 8 \
  -auto-alt-ref 1 -lag-in-frames 25 -deadline good -cpu-used 2 \
  -pix_fmt yuv420p "$OUT-1080.webm"

echo "→ 4K MP4 (desktop, H.264)"
ffmpeg -y -loglevel error -i "$SRC" -an -vf "scale=3840:-2" \
  -c:v libx264 -profile:v high -preset slow -crf 17 -maxrate 55M -bufsize 90M \
  -pix_fmt yuv420p -movflags +faststart "$OUT-4k.mp4"

echo "→ 4K WebM (desktop, VP9 — the variant browsers actually play, so keep it sharp)"
ffmpeg -y -loglevel error -i "$SRC" -an -vf "scale=3840:-2" \
  -c:v libvpx-vp9 -b:v 0 -crf 20 -row-mt 1 -tile-columns 3 -threads 8 \
  -auto-alt-ref 1 -lag-in-frames 25 -deadline good -cpu-used 2 \
  -pix_fmt yuv420p "$OUT-4k.webm"

# Poster extracted from the ENCODED 4K WebM (not the source) so the still matches
# the video's first decoded frame pixel-for-pixel — no quality jump on handoff.
echo "→ poster: first frame of the 4K WebM → WebP"
TMP_FRAME="$(mktemp -t hero-frame).png"
ffmpeg -y -loglevel error -i "$OUT-4k.webm" -frames:v 1 "$TMP_FRAME"
cwebp -quiet -q 95 -m 6 "$TMP_FRAME" -o "$OUT-poster.webp"                     # full 4K, near-lossless so it matches the video's first frame (no poster→video jump)
cwebp -quiet -q 62 -m 6 -resize 960 0 "$TMP_FRAME" -o "$OUT-poster-lqip.webp"  # tiny, base64-inlined for instant LCP
rm -f "$TMP_FRAME"

echo "✓ done:"
ls -lah "$OUT"-1080.* "$OUT"-4k.* "$OUT"-poster*.webp | awk '{print "  " $5 "\t" $NF}'
