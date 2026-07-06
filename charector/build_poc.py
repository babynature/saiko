# build_poc.py — slice the 3 generated images into game-size paper-doll layers
# Output: charector/poc/layers/*.png  (tile 64x96)  + preview.png
from PIL import Image
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT  = os.path.join(HERE, 'poc', 'layers')
os.makedirs(OUT, exist_ok=True)

BASE_P    = os.path.join(HERE, 'ChatGPT Image 6 ก.ค. 2569 11_41_11.png')  # base body
CLOTHED_P = os.path.join(HERE, 'ChatGPT Image 6 ก.ค. 2569 11_44_20.png')  # red shirt + jeans + hair
FACE_P    = os.path.join(HERE, 'ChatGPT Image 6 ก.ค. 2569 11_43_37.png')  # face strip (9)

base    = Image.open(BASE_P).convert('RGBA')
clothed = Image.open(CLOTHED_P).convert('RGBA')
faces   = Image.open(FACE_P).convert('RGBA')

# ── shared transform (from bbox analysis) ──
TILE_W, TILE_H = 64, 96
CHAR_CX   = 511.5        # both images centered here
FEET_SRCY = 1326.0       # body feet line (shoes extend a bit below)
HEAD_SRCY = 183.0        # head top (hair extends a bit above)
SCALE     = 80.0 / (FEET_SRCY - HEAD_SRCY)   # body occupies ~80px in tile
FEET_TY   = 92

def is_magenta(r, g, b):
    # broadened to catch anti-aliased pink fringe (but not skin/red/blue)
    return r > 150 and g < 120 and b > 150

def sample(img, sx, sy):
    if 0 <= sx < img.width and 0 <= sy < img.height:
        return img.getpixel((int(sx), int(sy)))
    return (0, 0, 0, 0)

def inv(tx, ty):
    sx = (tx - TILE_W / 2) / SCALE + CHAR_CX
    sy = (ty - FEET_TY) / SCALE + FEET_SRCY
    return sx, sy

# ── layer canvases ──
L = {k: Image.new('RGBA', (TILE_W, TILE_H), (0, 0, 0, 0)) for k in ('base', 'top', 'bottom', 'hair')}

for ty in range(TILE_H):
    for tx in range(TILE_W):
        sx, sy = inv(tx, ty)

        # BASE body (skin/underwear)
        r, g, b, a = sample(base, sx, sy)
        if a > 20 and not is_magenta(r, g, b):
            L['base'].putpixel((tx, ty), (r, g, b, 255))

        # CLOTHED → classify into garment layers
        r, g, b, a = sample(clothed, sx, sy)
        if a <= 20 or is_magenta(r, g, b):
            continue
        dark  = r < 80 and g < 80 and b < 80
        red   = r > 110 and g < 100 and b < 100
        blue  = b > 85 and r < 100 and g < 135 and b >= g - 15
        white = r > 175 and g > 175 and b > 175

        # chibi head is big (~top 48px), so hair spans whole head region
        if dark and ty <= 48:                              # hair (covers big head)
            L['hair'].putpixel((tx, ty), (r, g, b, 255))
        elif red or (dark and 49 <= ty <= 64):             # shirt + its outline only
            L['top'].putpixel((tx, ty), (r, g, b, 255))
        elif blue or white or (dark and ty >= 65):         # jeans + shoes + outline
            L['bottom'].putpixel((tx, ty), (r, g, b, 255))

for k, im in L.items():
    im.save(os.path.join(OUT, k + '.png'))

# ── shadow ellipse ──
from PIL import ImageDraw
sh = Image.new('RGBA', (TILE_W, TILE_H), (0, 0, 0, 0))
d = ImageDraw.Draw(sh)
d.ellipse([18, 88, 46, 94], fill=(0, 0, 0, 90))
sh.save(os.path.join(OUT, 'shadow.png'))

# ── face strip → 9 faces, autocropped ──
face_ranges = [(19,143),(194,340),(379,507),(542,674),(704,838),
               (866,1010),(1042,1174),(1214,1359),(1393,1517)]
FW, FH = faces.size
def nonbg(px):
    r, g, b, a = px
    return a > 20 and not (r > 235 and g > 235 and b > 235)

for i, (x0, x1) in enumerate(face_ranges):
    crop = faces.crop((x0, 0, x1, FH))
    # autocrop to content
    minx, miny, maxx, maxy = crop.width, crop.height, 0, 0
    found = False
    for y in range(crop.height):
        for x in range(crop.width):
            if nonbg(crop.getpixel((x, y))):
                found = True
                minx, miny = min(minx, x), min(miny, y)
                maxx, maxy = max(maxx, x), max(maxy, y)
    if found:
        crop = crop.crop((minx, miny, maxx + 1, maxy + 1))
    # scale to ~ head width (26px)
    tw = 26
    th = max(1, round(crop.height * tw / crop.width))
    crop = crop.resize((tw, th), Image.NEAREST)
    crop.save(os.path.join(OUT, f'face_{i}.png'))

print('scale =', round(SCALE, 5), '| layers done')

# ── preview: base+bottom+top+hair+face0, scaled x4 ──
prev = Image.new('RGBA', (TILE_W, TILE_H), (30, 30, 46, 255))
for k in ('shadow', 'base', 'bottom', 'top', 'hair'):
    prev.alpha_composite(Image.open(os.path.join(OUT, k + '.png')))
f0 = Image.open(os.path.join(OUT, 'face_0.png'))
prev.alpha_composite(f0, (TILE_W // 2 - f0.width // 2, 20))
prev.resize((TILE_W * 4, TILE_H * 4), Image.NEAREST).save(os.path.join(HERE, 'poc', 'preview.png'))
print('preview done')
