"""Encode the deterministic Canvas frames with one shared GIF palette."""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
paths = sorted((root / ".preview" / "frames").glob("*.png"))
if len(paths) != 80:
    raise SystemExit("Run node scripts/render-assets.cjs first (80 frames expected).")

with Image.open(paths[0]) as first:
    palette = first.convert("RGB").quantize(colors=128)
frames = []
for path in paths:
    with Image.open(path) as image:
        frames.append(image.convert("RGB").quantize(palette=palette, dither=Image.Dither.NONE))

output = root / "assets" / "profile.gif"
frames[0].save(output, save_all=True, append_images=frames[1:], duration=100,
               loop=0, optimize=True, disposal=1)
with Image.open(output) as check:
    assert check.n_frames == 80 and check.size == (1280, 440)
    assert check.info.get("loop") == 0
    duration = 0
    for frame in range(check.n_frames):
        check.seek(frame)
        duration += check.info["duration"]
    assert duration == 8000
print(f"Verified: {output.name}, 80 frames, 8 seconds, {output.stat().st_size / 1024:.0f} KiB")
