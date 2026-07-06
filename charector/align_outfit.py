# align_outfit.py — Auto-align AI-generated outfit to base body
#
# Problem: AI generators don't maintain exact scale/position even with reference.
# Fix: Detect character bounding box in both images, scale outfit to match base.
#
# Usage:
#   python align_outfit.py base_male.png outfit_image.png output_aligned.png
#   python align_outfit.py base_female.png outfit_image.png output_aligned.png
#
# After alignment, run build_outfit.py to extract top/bottom/hair layers.

from PIL import Image
import numpy as np
import sys
import os

def is_magenta(r, g, b):
    return r > 140 and g < 120 and b > 140

def get_char_bbox(img):
    """Find tight bounding box of non-magenta, non-transparent pixels."""
    arr = np.array(img.convert('RGBA'))
    r, g, b, a = arr[:,:,0], arr[:,:,1], arr[:,:,2], arr[:,:,3]
    bg = ((r > 140) & (g < 120) & (b > 140)) | (a < 20)
    char = ~bg
    if not char.any():
        raise ValueError("No character found — is background magenta?")
    rows = np.where(char.any(axis=1))[0]
    cols = np.where(char.any(axis=0))[0]
    return int(cols[0]), int(rows[0]), int(cols[-1]), int(rows[-1])

def align_outfit(base_path, outfit_path, output_path):
    base   = Image.open(base_path).convert('RGBA')
    outfit = Image.open(outfit_path).convert('RGBA')

    print(f"Base size  : {base.size}")
    print(f"Outfit size: {outfit.size}")

    bx1, by1, bx2, by2 = get_char_bbox(base)
    ox1, oy1, ox2, oy2 = get_char_bbox(outfit)

    bw, bh = bx2 - bx1, by2 - by1
    ow, oh = ox2 - ox1, oy2 - oy1

    print(f"Base char  : {bw}x{bh} at ({bx1},{by1})")
    print(f"Outfit char: {ow}x{oh} at ({ox1},{oy1})")

    sx = bw / ow
    sy = bh / oh
    print(f"Scale factors: x={sx:.3f}  y={sy:.3f}")

    # Scale outfit so its character matches base character size
    new_w = int(round(outfit.width  * sx))
    new_h = int(round(outfit.height * sy))
    scaled = outfit.resize((new_w, new_h), Image.NEAREST)

    # Where does the scaled character sit?
    sx1 = int(round(ox1 * sx))
    sy1 = int(round(oy1 * sy))

    # Paste onto a magenta canvas same size as base
    result = Image.new('RGBA', base.size, (255, 0, 255, 255))
    paste_x = bx1 - sx1
    paste_y = by1 - sy1
    result.paste(scaled, (paste_x, paste_y), scaled)

    result.save(output_path)
    print("Saved aligned image: " + output_path)

    # Quick side-by-side preview
    preview_w = base.width * 3 + 20
    preview   = Image.new('RGBA', (preview_w, base.height), (30, 30, 46, 255))
    preview.paste(base,   (0,              0))
    preview.paste(outfit.resize(base.size, Image.NEAREST), (base.width + 10, 0))
    preview.paste(result, (base.width * 2 + 20, 0))
    preview_path = output_path.replace('.png', '_compare.png')
    preview.save(preview_path)
    print("Preview (base | original | aligned): " + preview_path)

if __name__ == '__main__':
    if len(sys.argv) != 4:
        print("Usage: python align_outfit.py <base.png> <outfit.png> <output.png>")
        print()
        print("Examples:")
        print("  python align_outfit.py base_male.png   outfit_m1.png  aligned_m1.png")
        print("  python align_outfit.py base_female.png outfit_f1.png  aligned_f1.png")
        sys.exit(1)
    align_outfit(sys.argv[1], sys.argv[2], sys.argv[3])
