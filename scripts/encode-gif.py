"""Encode the deterministic Canvas frames at 20 FPS (50ms) with one shared GIF palette."""
from pathlib import Path
from PIL import Image

TOTAL_FRAMES = 120
FRAME_DURATION_MS = 50  # 20 FPS reales (fluido en todos los navegadores)
SIZE = (960, 330)

root = Path(__file__).resolve().parents[1]
paths = sorted((root / ".preview" / "frames").glob("*.png"))
if len(paths) != TOTAL_FRAMES:
    raise SystemExit(f"Run node scripts/render-assets.cjs first ({TOTAL_FRAMES} frames expected, found {len(paths)}).")

with Image.open(paths[0]) as first:
    palette = first.convert("RGB").quantize(colors=64, method=Image.Quantize.MEDIANCUT)
frames = []
for path in paths:
    with Image.open(path) as image:
        frames.append(image.convert("RGB").quantize(palette=palette, dither=Image.Dither.NONE))

output = root / "assets" / "profile.gif"
frames[0].save(output, save_all=True, append_images=frames[1:], duration=FRAME_DURATION_MS,
               loop=0, optimize=True, disposal=1)
with Image.open(output) as check:
    assert check.n_frames == TOTAL_FRAMES and check.size == SIZE
    assert check.info.get("loop") == 0
    duration = 0
    for frame in range(check.n_frames):
        check.seek(frame)
        duration += check.info["duration"]
    assert duration == TOTAL_FRAMES * FRAME_DURATION_MS
print(f"Verified: {output.name}, {TOTAL_FRAMES} frames @ 20 FPS ({duration / 1000:.1f}s), {output.stat().st_size / 1024:.0f} KiB")
