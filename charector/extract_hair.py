# extract_hair.py — Extract ONLY the hair layer from an AI image that includes clothing.
#
# How it works:
#   1. Auto-align the AI image scale to match the base body
#   2. Find the character's HEAD region using the base body's bounding box
#   3. Capture ONLY pixels inside the head zone (top 40% of character height)
#   4. Anything below the neck is ignored, even if clothing came along
#
# Usage:
#   python extract_hair.py base_male.png   hair_ai_image.png  hair_m1
#   python extract_hair.py base_female.png hair_ai_image.png  hair_f1
#
# Output: poc/layers/hair_m1.png  +  poc/preview_hair_m1.png

from PIL import Image
import numpy as np
import os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
OUT  = os.path.join(HERE, 'poc', 'layers')
os.makedirs(OUT, exist_ok=True)

TILE_W, TILE_H = 64, 96

# How far down the tile (0-96) to allow hair pixels.
# 38 = roughly bottom of chin on a chibi head (top 40% of body).
# Raise to 44 if the character has long side-bangs reaching the chin.
HAIR_TY_MAX = 38

def is_magenta(r, g, b):
    return r > 140 and g < 120 and b > 140

def is_skin(r, g, b):
    # Broad skin-tone check (light peach to medium brown)
    return (r > 155 and g > 105 and b > 75
            and r > g and r > b
            and (int(r) - int(b)) < 110)

def get_char_bbox(img):
    arr = np.array(img.convert('RGBA'))
    r, g, b, a = arr[:,:,0], arr[:,:,1], arr[:,:,2], arr[:,:,3]
    bg = ((r > 140) & (g < 120) & (b > 140)) | (a < 20)
    char = ~bg
    if not char.any():
        raise ValueError("No character pixels found — background must be magenta")
    rows = np.where(char.any(axis=1))[0]
    cols = np.where(char.any(axis=0))[0]
    return int(cols[0]), int(rows[0]), int(cols[-1]), int(rows[-1])

def align_to_base(base, outfit):
    """Scale outfit so its character matches base character size/position."""
    if base.size == outfit.size:
        bx1, by1, bx2, by2 = get_char_bbox(base)
        ox1, oy1, ox2, oy2 = get_char_bbox(outfit)
        bw, bh = bx2 - bx1, by2 - by1
        ow, oh = ox2 - ox1, oy2 - oy1
        sx, sy = bw / ow, bh / oh

        if abs(sx - 1.0) < 0.02 and abs(sy - 1.0) < 0.02:
            return outfit  # already aligned

        nw = int(round(outfit.width  * sx))
        nh = int(round(outfit.height * sy))
        scaled = outfit.resize((nw, nh), Image.NEAREST)

        result = Image.new('RGBA', base.size, (255, 0, 255, 255))
        px = bx1 - int(round(ox1 * sx))
        py = by1 - int(round(oy1 * sy))
        result.paste(scaled, (px, py), scaled)
        return result
    else:
        print(f"WARNING: sizes differ ({base.size} vs {outfit.size}), stretching outfit to base size")
        return outfit.resize(base.size, Image.NEAREST)

def extract_hair(base_path, hair_path, name):
    base  = Image.open(base_path).convert('RGBA')
    hair_img = Image.open(hair_path).convert('RGBA')

    print(f"Base : {base.size}  |  Hair image: {hair_img.size}")

    # Step 1: align
    hair_img = align_to_base(base, hair_img)
    print("Alignment done.")

    # Step 2: find character bbox in base → defines tile mapping
    bx1, by1, bx2, by2 = get_char_bbox(base)
    char_w = bx2 - bx1
    char_h = by2 - by1
    src_sx  = char_w / TILE_W   # source pixels per tile pixel
    src_sy  = char_h / TILE_H

    base_arr = np.array(base)
    hair_arr = np.array(hair_img)

    layer = Image.new('RGBA', (TILE_W, TILE_H))
    captured = 0

    for ty in range(HAIR_TY_MAX):          # ONLY the head zone
        for tx in range(TILE_W):
            src_x = int(bx1 + tx * src_sx)
            src_y = int(by1 + ty * src_sy)
            if not (0 <= src_x < hair_img.width and 0 <= src_y < hair_img.height):
                continue

            hr, hg, hb, ha = hair_arr[src_y, src_x]
            if ha < 20 or is_magenta(hr, hg, hb):
                continue              # background
            if is_skin(hr, hg, hb):
                continue              # bare skin, not hair

            br, bg, bb, ba = base_arr[src_y, src_x]
            base_is_dark = ba > 20 and not is_magenta(br, bg, bb) and br < 90 and bg < 90 and bb < 90

            # Accept: dark/colored pixels that are NOT just the base outline
            is_dark  = hr < 100 and hg < 100 and hb < 100
            is_color = not is_dark and not is_skin(hr, hg, hb)

            if is_dark or is_color:
                layer.putpixel((tx, ty), (hr, hg, hb, 255))
                captured += 1

    print(f"Hair pixels captured: {captured}")

    out_path = os.path.join(OUT, name + '.png')
    layer.save(out_path)
    print("Saved: " + out_path)

    # Preview: composite on base + face_0
    PSCALE = 4
    base_layer = os.path.join(OUT, 'base.png')
    prev = Image.new('RGBA', (TILE_W, TILE_H), (30, 30, 46, 255))
    if os.path.exists(base_layer):
        prev.alpha_composite(Image.open(base_layer))
    prev.alpha_composite(layer)
    face0 = os.path.join(OUT, 'face_0.png')
    if os.path.exists(face0):
        f = Image.open(face0)
        prev.alpha_composite(f, (TILE_W // 2 - f.width // 2, 28))

    prev_path = os.path.join(HERE, 'poc', f'preview_{name}.png')
    prev.resize((TILE_W * PSCALE, TILE_H * PSCALE), Image.NEAREST).save(prev_path)
    print("Preview: " + prev_path)

if __name__ == '__main__':
    if len(sys.argv) != 4:
        print("Usage: python extract_hair.py <base.png> <hair_ai.png> <output_name>")
        print()
        print("Output name becomes the filename (no extension):")
        print("  hair_m1  ->  poc/layers/hair_m1.png")
        print("  hair_f2  ->  poc/layers/hair_f2.png")
        sys.exit(1)
    extract_hair(sys.argv[1], sys.argv[2], sys.argv[3])
