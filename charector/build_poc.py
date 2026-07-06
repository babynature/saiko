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

        # BASE body (skin/underwear) — also remember if base is dark (its own outline)
        br, bg, bb, ba = sample(base, sx, sy)
        base_has = ba > 20 and not is_magenta(br, bg, bb)
        base_dark = base_has and br < 80 and bg < 80 and bb < 80
        if base_has:
            L['base'].putpixel((tx, ty), (br, bg, bb, 255))

        # CLOTHED → classify into garment layers
        r, g, b, a = sample(clothed, sx, sy)
        if a <= 20 or is_magenta(r, g, b):
            continue
        dark  = r < 80 and g < 80 and b < 80
        red   = r > 110 and g < 100 and b < 100
        blue  = b > 85 and r < 100 and g < 135 and b >= g - 15
        white = r > 175 and g > 175 and b > 175

        # HAIR = top hair cap only (ty<=32). Below that, dark pixels are the
        # head outline (chin/jaw ring) — dropped here since base.png already
        # draws the head outline, so hair no longer looks like a 2nd layer.
        if dark and not base_dark and ty <= 32:
            L['hair'].putpixel((tx, ty), (r, g, b, 255))
        elif red or (dark and 47 <= ty <= 64):             # shirt + its outline only
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

# ── procedural pixel faces (clean + full 9 emotions) ──
# AI face art gets muddy when downscaled, so draw faces from primitives.
# Order must match avatarModule FACE map: neutral,happy,hungry,tired,
# stressed,yum,sad,sleep,angry
FW, FH = 24, 16
EYE    = (45, 40, 52, 255)
MOUTH  = (150, 70, 80, 255)
TONGUE = (235, 130, 140, 255)
BLUSH  = (255, 150, 150, 110)
LX, RX, EY = 6, 17, 7

def make_face(kind):
    im = Image.new('RGBA', (FW, FH), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    def eye_dot(cx):   d.rectangle([cx-1, EY-1, cx+1, EY+2], fill=EYE)
    def eye_up(cx):    d.arc([cx-3, EY-1, cx+3, EY+5], 180, 360, fill=EYE, width=2)   # ^
    def eye_line(cx):  d.line([cx-2, EY+1, cx+2, EY+1], fill=EYE, width=2)            # tired
    def eye_closed(cx):d.arc([cx-3, EY-2, cx+3, EY+3], 0, 180, fill=EYE, width=2)     # u (sleep)
    def blush():
        d.ellipse([2, EY+2, 6, EY+5], fill=BLUSH)
        d.ellipse([FW-7, EY+2, FW-3, EY+5], fill=BLUSH)

    if kind == 'neutral':
        eye_dot(LX); eye_dot(RX); d.line([10, 13, 15, 13], fill=MOUTH, width=1)
    elif kind == 'happy':
        eye_up(LX); eye_up(RX); d.arc([8, 9, 16, 15], 0, 180, fill=MOUTH, width=2); blush()
    elif kind == 'hungry':
        eye_dot(LX); eye_dot(RX)
        d.line([9, 13, 11, 14], fill=MOUTH); d.line([11, 14, 13, 13], fill=MOUTH)
        d.line([13, 13, 15, 14], fill=MOUTH)                                          # wavy
    elif kind == 'tired':
        eye_line(LX); eye_line(RX); d.line([10, 13, 15, 13], fill=MOUTH, width=1)
    elif kind == 'stressed':
        eye_dot(LX); eye_dot(RX)
        for x in range(10, 16, 2): d.line([x, 12, x, 14], fill=MOUTH)                 # gritted
    elif kind == 'yum':
        eye_up(LX); eye_up(RX); d.ellipse([9, 11, 15, 15], fill=MOUTH)
        d.ellipse([10, 13, 14, 15], fill=TONGUE); blush()
    elif kind == 'sad':
        d.rectangle([LX-1, EY, LX+1, EY+3], fill=EYE); d.rectangle([RX-1, EY, RX+1, EY+3], fill=EYE)
        d.arc([8, 13, 16, 18], 180, 360, fill=MOUTH, width=2)                          # frown
    elif kind == 'sleep':
        eye_closed(LX); eye_closed(RX); d.ellipse([11, 12, 14, 15], fill=MOUTH)
    elif kind == 'angry':
        d.line([LX-3, EY-2, LX+2, EY], fill=EYE, width=2)                              # \  brow
        d.line([RX-2, EY, RX+3, EY-2], fill=EYE, width=2)                              #  / brow
        d.rectangle([LX-1, EY+1, LX+1, EY+3], fill=EYE); d.rectangle([RX-1, EY+1, RX+1, EY+3], fill=EYE)
        d.arc([8, 13, 16, 18], 180, 360, fill=MOUTH, width=2)
    return im

FACE_NAMES = ['neutral','happy','hungry','tired','stressed','yum','sad','sleep','angry']
for i, n in enumerate(FACE_NAMES):
    make_face(n).save(os.path.join(OUT, f'face_{i}.png'))

print('scale =', round(SCALE, 5), '| layers done')

# ── preview: base+bottom+top+hair+face0, scaled x4 ──
prev = Image.new('RGBA', (TILE_W, TILE_H), (30, 30, 46, 255))
for k in ('shadow', 'base', 'bottom', 'top', 'hair'):
    prev.alpha_composite(Image.open(os.path.join(OUT, k + '.png')))
f0 = Image.open(os.path.join(OUT, 'face_0.png'))
prev.alpha_composite(f0, (TILE_W // 2 - f0.width // 2, 28))
prev.resize((TILE_W * 4, TILE_H * 4), Image.NEAREST).save(os.path.join(HERE, 'poc', 'preview.png'))
print('preview done')
