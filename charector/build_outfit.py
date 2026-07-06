# build_outfit.py — Slice an aligned outfit image into top/bottom/hair layers
#
# Input:  base_m.png (or base_f.png) + aligned outfit PNG (magenta background)
# Output: layers/<name>_top.png, layers/<name>_bottom.png, layers/<name>_hair.png
#         + preview PNG
#
# Usage:
#   python build_outfit.py base_male.png aligned_m1.png school_m
#   python build_outfit.py base_female.png aligned_f1.png school_f
#
# The script uses y-position to separate hair / top / bottom automatically.
# Anything that differs from the base body skin = clothing pixel.

from PIL import Image, ImageDraw
import numpy as np
import os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
OUT  = os.path.join(HERE, 'poc', 'layers')
os.makedirs(OUT, exist_ok=True)

TILE_W, TILE_H = 64, 96   # output tile size (matches avatarModule)

def is_magenta(r, g, b):
    return r > 140 and g < 120 and b > 140

def is_skin(r, g, b, tol=35):
    # Approximate skin tone (works for both the male and female base bodies)
    return (r > 180 and g > 130 and b > 100 and
            r > g and r > b and
            abs(int(r) - int(g)) < 80)

def get_char_bbox(img):
    arr = np.array(img.convert('RGBA'))
    r, g, b, a = arr[:,:,0], arr[:,:,1], arr[:,:,2], arr[:,:,3]
    bg = ((r > 140) & (g < 120) & (b > 140)) | (a < 20)
    char = ~bg
    if not char.any():
        raise ValueError("No character pixels found")
    rows = np.where(char.any(axis=1))[0]
    cols = np.where(char.any(axis=0))[0]
    return int(cols[0]), int(rows[0]), int(cols[-1]), int(rows[-1])

def build_outfit(base_path, outfit_path, name):
    base   = Image.open(base_path).convert('RGBA')
    outfit = Image.open(outfit_path).convert('RGBA')

    if base.size != outfit.size:
        print(f"Size mismatch ({base.size} vs {outfit.size}) — run align_outfit.py first!")
        sys.exit(1)

    # Character region in source image
    bx1, by1, bx2, by2 = get_char_bbox(base)
    char_h = by2 - by1
    char_w = bx2 - bx1

    # Scale factor: source → tile
    sx = TILE_W / char_w
    sy = TILE_H / char_h

    # Layer canvases (tile size)
    layers = {k: Image.new('RGBA', (TILE_W, TILE_H)) for k in ('hair', 'top', 'bottom')}

    base_arr   = np.array(base)
    outfit_arr = np.array(outfit)

    for ty in range(TILE_H):
        for tx in range(TILE_W):
            # Map tile pixel → source pixel
            src_x = int(bx1 + tx / sx)
            src_y = int(by1 + ty / sy)
            if not (0 <= src_x < base.width and 0 <= src_y < base.height):
                continue

            or_, og, ob, oa = outfit_arr[src_y, src_x]
            if oa < 20 or is_magenta(or_, og, ob):
                continue   # background → skip

            br, bg_, bb, ba = base_arr[src_y, src_x]

            # Pixel exists in outfit but not in base = new clothing pixel
            base_has = ba > 20 and not is_magenta(br, bg_, bb)

            # Clothing pixel: outfit has something here that base doesn't (or base is skin)
            if not base_has or is_skin(br, bg_, bb):
                # Skip if outfit pixel is also skin-tone (bare skin showing through)
                if is_skin(or_, og, ob):
                    continue
                # Skip background-ish
                if is_magenta(or_, og, ob):
                    continue

                pixel = (or_, og, ob, 255)

                # Classify by y-position in tile
                if ty <= 35:
                    layers['hair'].putpixel((tx, ty), pixel)
                elif ty <= 68:
                    layers['top'].putpixel((tx, ty), pixel)
                else:
                    layers['bottom'].putpixel((tx, ty), pixel)

    # Save layers
    saved = []
    for k, im in layers.items():
        path = os.path.join(OUT, f'{name}_{k}.png')
        im.save(path)
        px_count = sum(1 for x in range(TILE_W) for y in range(TILE_H) if im.getpixel((x,y))[3] > 0)
        print(f"  {k:8s}: {px_count:4d} pixels: {path}")
        saved.append(path)

    # Preview: composite all layers on dark background, scaled x4
    PREV_SCALE = 4
    prev = Image.new('RGBA', (TILE_W, TILE_H), (30, 30, 46, 255))

    # Load existing base layer if available
    base_layer_path = os.path.join(OUT, 'base.png')
    if os.path.exists(base_layer_path):
        prev.alpha_composite(Image.open(base_layer_path))
    for k in ('bottom', 'top', 'hair'):
        prev.alpha_composite(layers[k])

    # Add procedural face_0 if available
    face0_path = os.path.join(OUT, 'face_0.png')
    if os.path.exists(face0_path):
        f0 = Image.open(face0_path)
        prev.alpha_composite(f0, (TILE_W // 2 - f0.width // 2, 28))

    preview_path = os.path.join(HERE, 'poc', f'preview_{name}.png')
    prev.resize((TILE_W * PREV_SCALE, TILE_H * PREV_SCALE), Image.NEAREST).save(preview_path)
    print("Preview: " + preview_path)
    return saved

if __name__ == '__main__':
    if len(sys.argv) != 4:
        print("Usage: python build_outfit.py <base.png> <aligned_outfit.png> <name>")
        print()
        print("Examples:")
        print("  python build_outfit.py base_male.png   aligned_m1.png  school_m")
        print("  python build_outfit.py base_female.png aligned_f1.png  school_f")
        sys.exit(1)
    build_outfit(sys.argv[1], sys.argv[2], sys.argv[3])
