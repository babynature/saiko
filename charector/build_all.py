# build_all.py — Batch-process all Gemini images into game-ready layer PNGs
#
# Run once:  python build_all.py
#
# Outputs (all in poc/layers/):
#   base_m.png, base_f.png
#   face_0.png .. face_8.png
#   top_m_school.png, bottom_m_school.png, top_m_sports.png ... (5 male outfits)
#   top_f_school.png, bottom_f_school.png ... (5 female outfits)
#   hair_m_short.png, hair_m_spiky.png ... (5 male hair)
#   hair_f_bob.png, hair_f_twintails.png ... (5 female hair)
#
# + poc/preview_*.png preview for every item

from PIL import Image
import numpy as np
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT  = os.path.join(HERE, 'poc', 'layers')
PREV = os.path.join(HERE, 'poc')
os.makedirs(OUT, exist_ok=True)

TILE_W, TILE_H = 64, 96
PREV_SCALE     = 4

# Emotion order that the AI face strip actually uses (determined by inspection)
# neutral happy yum hungry stressed tired sad sleep angry
FACE_EMOTION_ORDER = ['neutral','happy','yum','hungry','stressed','tired','sad','sleep','angry']

# Procedural face generator (fallback when strip segment is missing/corrupt)
from PIL import ImageDraw as _IDraw
def _make_proc_face(kind):
    FW, FH = 40, 28
    EYE   = (45, 40, 52, 255)
    MOUTH = (150, 70, 80, 255)
    TONGUE= (235, 130, 140, 255)
    BLUSH = (255, 150, 150, 110)
    # Eye centres at 35% height, mouth at 78% height — symmetric about x=FW/2
    LX, RX, EY = 12, 27, 10
    MY = 22   # mouth y
    im = Image.new('RGBA', (FW, FH))
    d  = _IDraw.Draw(im)
    def eye_dot(cx):  d.rectangle([cx-2, EY-1, cx+2, EY+3], fill=EYE)
    def eye_up(cx):   d.arc([cx-4, EY-1, cx+4, EY+7], 180, 360, fill=EYE, width=2)
    def eye_line(cx): d.line([cx-3, EY+2, cx+3, EY+2], fill=EYE, width=2)
    def blush():
        d.ellipse([3, EY+4, 9, EY+8], fill=BLUSH)
        d.ellipse([FW-10, EY+4, FW-4, EY+8], fill=BLUSH)
    if kind == 'neutral':
        eye_dot(LX); eye_dot(RX); d.line([17, MY, 23, MY], fill=MOUTH, width=2)
    elif kind == 'happy':
        eye_up(LX); eye_up(RX); d.arc([14,MY-3,26,MY+5], 0, 180, fill=MOUTH, width=2); blush()
    elif kind == 'yum':
        eye_up(LX); eye_up(RX); d.ellipse([15,MY-2,25,MY+6], fill=MOUTH)
        d.ellipse([17,MY+1,23,MY+6], fill=TONGUE); blush()
    elif kind == 'hungry':
        eye_dot(LX); eye_dot(RX)
        d.line([15,MY,18,MY+2],fill=MOUTH,width=2); d.line([18,MY+2,21,MY],fill=MOUTH,width=2); d.line([21,MY,24,MY+2],fill=MOUTH,width=2)
    elif kind == 'stressed':
        eye_dot(LX); eye_dot(RX)
        for x in range(16,25,3): d.line([x,MY-1,x,MY+2], fill=MOUTH, width=2)
    elif kind == 'tired':
        eye_line(LX); eye_line(RX); d.line([17, MY, 23, MY], fill=MOUTH, width=2)
    elif kind == 'sad':
        d.rectangle([LX-2,EY,LX+2,EY+4],fill=EYE); d.rectangle([RX-2,EY,RX+2,EY+4],fill=EYE)
        d.arc([14,MY+2,26,MY+10], 180, 360, fill=MOUTH, width=2)
    elif kind == 'sleep':
        d.arc([LX-4,EY-2,LX+4,EY+6], 0,180,fill=EYE,width=2)
        d.arc([RX-4,EY-2,RX+4,EY+6], 0,180,fill=EYE,width=2)
        d.ellipse([17,MY-1,23,MY+5], fill=MOUTH)
    elif kind == 'angry':
        d.line([LX-4,EY-2,LX+2,EY+1], fill=EYE, width=2)
        d.line([RX-2,EY+1,RX+4,EY-2], fill=EYE, width=2)
        d.rectangle([LX-2,EY+2,LX+2,EY+5],fill=EYE); d.rectangle([RX-2,EY+2,RX+2,EY+5],fill=EYE)
        d.arc([14,MY+2,26,MY+10], 180, 360, fill=MOUTH, width=2)
    return im

# ── File map ──────────────────────────────────────────────────────────────────
BASE_M     = 'Gemini_Generated_Image_jt0zepjt0zepjt0z.png'
BASE_F     = 'Gemini_Generated_Image_2yo4i52yo4i52yo4.png'
FACE_STRIP = 'Gemini_Generated_Image_wt4gztwt4gztwt4g.png'

MALE_OUTFITS = [
    ('Gemini_Generated_Image_u17b0lu17b0lu17b.png', 'm_school'),
    ('Gemini_Generated_Image_hsngohhsngohhsng.png', 'm_sports'),
    ('Gemini_Generated_Image_z0g28tz0g28tz0g2.png', 'm_hoodie'),
    ('Gemini_Generated_Image_ldxwjvldxwjvldxw.png', 'm_office'),
    ('Gemini_Generated_Image_fi0y53fi0y53fi0y.png',  'm_ninja'),
]

FEMALE_OUTFITS = [
    ('Gemini_Generated_Image_at8fkjat8fkjat8f.png',  'f_school'),
    ('Gemini_Generated_Image_au9ou6au9ou6au9o.png',   'f_sports'),
    ('Gemini_Generated_Image_hdfz3fhdfz3fhdfz.png',   'f_casual'),
    ('Gemini_Generated_Image_mvy1lamvy1lamvy1.png',   'f_office'),
    ('Gemini_Generated_Image_ajdiveajdiveajdi.png',   'f_princess'),
]

MALE_HAIR = [
    ('Gemini_Generated_Image_g1qrv5g1qrv5g1qr.png', 'm_short'),
    ('Gemini_Generated_Image_8tfcat8tfcat8tfc.png',  'm_medium'),
    ('Gemini_Generated_Image_v9f9mxv9f9mxv9f9.png',  'm_spiky'),
    ('Gemini_Generated_Image_drqxdmdrqxdmdrqx.png',  'm_afro'),
    ('Gemini_Generated_Image_vrn420vrn420vrn4.png',   'm_bun'),
]

FEMALE_HAIR = [
    ('Gemini_Generated_Image_qt8dlgqt8dlgqt8d.png', 'f_bob'),
    ('Gemini_Generated_Image_iblkr5iblkr5iblk.png', 'f_twintails'),
    ('Gemini_Generated_Image_9rb7a9rb7a9rb7a9.png',  'f_bun'),
    ('Gemini_Generated_Image_w3gq3lw3gq3lw3gq.png',  'f_long_black'),
    ('Gemini_Generated_Image_eb7jx8eb7jx8eb7j.png',  'f_long_brown'),
]

# ── Helpers ────────────────────────────────────────────────────────────────────
def is_magenta(r, g, b):
    return int(r) > 140 and int(g) < 120 and int(b) > 140

def is_skin(r, g, b):
    return (int(r) > 150 and int(g) > 100 and int(b) > 70
            and int(r) > int(g) and int(r) > int(b)
            and (int(r) - int(b)) < 120)

def arr(img):
    return np.array(img.convert('RGBA'))

def get_bbox(img, top_pct=1.0):
    """Bounding box of non-magenta pixels, optionally only top_pct of image height."""
    a = arr(img)
    r, g, b, al = a[:,:,0], a[:,:,1], a[:,:,2], a[:,:,3]
    bg = ((r > 140) & (g < 120) & (b > 140)) | (al < 20)
    ch = ~bg
    if top_pct < 1.0:
        cutoff = int(img.height * top_pct)
        ch[cutoff:, :] = False
    if not ch.any():
        raise ValueError("No character found — check magenta background")
    rows = np.where(ch.any(axis=1))[0]
    cols = np.where(ch.any(axis=0))[0]
    return int(cols[0]), int(rows[0]), int(cols[-1]), int(rows[-1])

def align(base, outfit, use_head=False):
    """Scale+shift outfit so its character aligns with base."""
    top_pct = 0.45 if use_head else 1.0
    bx1, by1, bx2, by2 = get_bbox(base, top_pct)
    ox1, oy1, ox2, oy2 = get_bbox(outfit, top_pct)
    bw, bh = bx2 - bx1, by2 - by1
    ow, oh = ox2 - ox1, oy2 - oy1
    sx = bw / ow
    sy = bh / oh
    nw = int(round(outfit.width  * sx))
    nh = int(round(outfit.height * sy))
    scaled = outfit.resize((nw, nh), Image.NEAREST)
    result = Image.new('RGBA', base.size, (255, 0, 255, 255))
    px = bx1 - int(round(ox1 * sx))
    py = by1 - int(round(oy1 * sy))
    result.paste(scaled, (px, py), scaled)
    return result

def tile_mapper(base):
    """Returns a function: (tile_tx, tile_ty) -> (src_x, src_y) in base image."""
    bx1, by1, bx2, by2 = get_bbox(base)
    cw = bx2 - bx1
    ch = by2 - by1
    sx = cw / TILE_W
    sy = ch / TILE_H
    def to_src(tx, ty):
        return int(bx1 + tx * sx), int(by1 + ty * sy)
    return to_src

def save_layer(canvas, name):
    path = os.path.join(OUT, name + '.png')
    canvas.save(path)
    npx = sum(1 for x in range(TILE_W) for y in range(TILE_H)
               if canvas.getpixel((x, y))[3] > 0)
    print(f"  {name:<28s} {npx:4d}px  -> {os.path.basename(path)}")
    return path

def make_preview(layers_order, name, bg=(30, 30, 46)):
    prev = Image.new('RGBA', (TILE_W, TILE_H), bg + (255,))
    for lname in layers_order:
        p = os.path.join(OUT, lname + '.png')
        if os.path.exists(p):
            prev.alpha_composite(Image.open(p))
    # face_0 overlay
    f0 = os.path.join(OUT, 'face_0.png')
    if os.path.exists(f0):
        f = Image.open(f0)
        prev.alpha_composite(f, (TILE_W // 2 - f.width // 2, 28))
    out = os.path.join(PREV, f'preview_{name}.png')
    prev.resize((TILE_W * PREV_SCALE, TILE_H * PREV_SCALE), Image.NEAREST).save(out)

SKIN_FILL = (242, 188, 157, 255)   # average skin tone from base_f rows 28-36

def patch_base_f_chest(layer):
    """Remove bra outline pixels from base_f chest zone (rows 36-48).
    The princess dress has a scoop neckline; dark bra pixels bleed through.
    Replace any non-skin, non-transparent pixel in that zone with skin color."""
    la = np.array(layer)
    for ty in range(36, 49):
        for tx in range(TILE_W):
            r, g, b, a = la[ty, tx]
            if a < 20:
                continue
            if is_skin(int(r), int(g), int(b)):
                continue
            la[ty, tx] = SKIN_FILL
    return Image.fromarray(la, 'RGBA')

# ── 1. Base body ───────────────────────────────────────────────────────────────
def process_base(src_file, out_name):
    print(f"\n[BASE] {out_name}")
    src = Image.open(os.path.join(HERE, src_file)).convert('RGBA')
    to_src = tile_mapper(src)
    sa = arr(src)
    layer = Image.new('RGBA', (TILE_W, TILE_H))
    for ty in range(TILE_H):
        for tx in range(TILE_W):
            sx, sy = to_src(tx, ty)
            if not (0 <= sx < src.width and 0 <= sy < src.height):
                continue
            r, g, b, a = sa[sy, sx]
            if a < 20 or is_magenta(r, g, b):
                continue
            layer.putpixel((tx, ty), (int(r), int(g), int(b), 255))
    if out_name == 'base_f':
        layer = patch_base_f_chest(layer)
    save_layer(layer, out_name)

# ── 2. Face strip ──────────────────────────────────────────────────────────────
def process_faces(src_file):
    print(f"\n[FACES] {src_file}")
    src = Image.open(os.path.join(HERE, src_file)).convert('RGBA')
    sa = arr(src)
    r, g, b, a = sa[:,:,0], sa[:,:,1], sa[:,:,2], sa[:,:,3]
    bg = ((r > 140) & (g < 120) & (b > 140)) | (a < 20)
    char = ~bg

    # Find vertical bands (columns that have any non-bg pixel)
    col_has = char.any(axis=0)
    # Group consecutive non-empty columns into face segments
    faces = []
    in_face = False
    start = 0
    for x in range(len(col_has)):
        if col_has[x] and not in_face:
            start = x
            in_face = True
        elif not col_has[x] and in_face:
            faces.append((start, x - 1))
            in_face = False
    if in_face:
        faces.append((start, len(col_has) - 1))

    print(f"  Detected {len(faces)} face segments")

    FACE_W, FACE_H = 40, 28  # larger tile: more pixels → better symmetry + breathing room
    MIN_FACE_WIDTH = 130   # skip narrow artifacts

    valid_faces = [(x1, x2) for (x1, x2) in faces if (x2 - x1) >= MIN_FACE_WIDTH]
    print(f"  Valid face segments (width>={MIN_FACE_WIDTH}): {len(valid_faces)}")

    for i, emotion in enumerate(FACE_EMOTION_ORDER):
        if i < len(valid_faces):
            fx1, fx2 = valid_faces[i]
            # Per-face bounding box: tighter crop avoids empty-space squishing
            seg = np.array(src)[: , fx1:fx2+1]
            seg_r,seg_g,seg_b,seg_a = seg[:,:,0],seg[:,:,1],seg[:,:,2],seg[:,:,3]
            seg_bg = ((seg_r>140)&(seg_g<120)&(seg_b>140))|(seg_a<20)
            seg_char = ~seg_bg
            if seg_char.any():
                fy_rows = np.where(seg_char.any(axis=1))[0]
                fy1_i, fy2_i = int(fy_rows[0]), int(fy_rows[-1])
            else:
                fy1_i, fy2_i = 0, src.height - 1
            face_crop = src.crop((fx1, fy1_i, fx2 + 1, fy2_i + 1))
            face_tile  = face_crop.resize((FACE_W, FACE_H), Image.NEAREST)
            fa = np.array(face_tile.convert('RGBA'))
            r4,g4,b4,a4 = fa[:,:,0],fa[:,:,1],fa[:,:,2],fa[:,:,3]
            # Remove magenta (any pixel with magenta hue: r and b high, g low)
            is_mag = (r4.astype(int) - g4.astype(int) > 50) & (b4.astype(int) - g4.astype(int) > 50)
            # Keep only expression features; discard face-skin (warm mid-tones)
            # Dark outline/pupils (very dark), highlights (very bright), or vivid color
            is_dark      = (r4 < 80) & (g4 < 80) & (b4 < 80)
            is_highlight = (r4 > 200) & (g4 > 160) & (b4 > 150)   # eye shine
            is_lip       = (r4 > 150) & (g4 < 120) & (b4 < 120)    # lips/blush
            is_tongue    = (r4 > 180) & (g4 > 90) & (g4 < 160) & (b4 < 130)  # salmon/pink tongue
            is_feature = is_dark | is_highlight | is_lip | is_tongue
            # Anything that is not a feature OR is magenta → transparent
            discard = ~is_feature | is_mag | (a4 < 20)
            fa[discard] = [0, 0, 0, 0]
            face_tile = Image.fromarray(fa, 'RGBA')
            src_label = f"strip cols {fx1}-{fx2}"
        else:
            # Fallback: procedural face
            face_tile = _make_proc_face(emotion)
            src_label = "procedural fallback"

        path = os.path.join(OUT, f'face_{i}.png')
        face_tile.save(path)
        print(f"  face_{i} ({emotion:<10s}): {src_label}")

# ── 3. Outfit (top + bottom layers) ───────────────────────────────────────────
HAIR_MAX_TY_M = 36   # male: head zone rows 0-35
HAIR_MAX_TY_F = 30   # female: chest is higher, top layer must start at row 30
TOP_MAX_TY    = 66   # top/bottom split

def process_outfit(base_img, base_arr_, src_file, name, to_src):
    src = Image.open(os.path.join(HERE, src_file)).convert('RGBA')
    src = align(base_img, src, use_head=False)
    sa  = arr(src)

    is_female = name.startswith('f')
    layers = {k: Image.new('RGBA', (TILE_W, TILE_H)) for k in ('top', 'bottom')}

    for ty in range(TILE_H):
        for tx in range(TILE_W):
            sx, sy = to_src(tx, ty)
            if not (0 <= sx < src.width and 0 <= sy < src.height):
                continue
            or_, og, ob, oa = [int(v) for v in sa[sy, sx]]
            if oa < 20 or is_magenta(or_, og, ob):
                continue
            if is_skin(or_, og, ob):
                continue
            px = (or_, og, ob, 255)
            # No head-zone skip: dress bodice (e.g. princess) starts above row 30.
            # Hair layer renders on top anyway, so head-zone outfit pixels are fine.
            if ty < TOP_MAX_TY:
                layers['top'].putpixel((tx, ty), px)
            else:
                layers['bottom'].putpixel((tx, ty), px)

    for k in ('top', 'bottom'):
        save_layer(layers[k], f'{k}_{name}')
    make_preview([f'base_{"f" if is_female else "m"}',
                  f'bottom_{name}', f'top_{name}'], name)

# ── 4. Hair (head zone only) ──────────────────────────────────────────────────
def process_hair(base_img, base_arr_, src_file, name, to_src):
    src = Image.open(os.path.join(HERE, src_file)).convert('RGBA')
    # For hair: align by head only (ignores wide dress/outfit extending bbox)
    src = align(base_img, src, use_head=True)
    sa  = arr(src)

    layer = Image.new('RGBA', (TILE_W, TILE_H))

    is_female = name.startswith('f')
    hair_limit = (HAIR_MAX_TY_F if is_female else HAIR_MAX_TY_M) + 4

    for ty in range(hair_limit):   # small buffer below chin
        for tx in range(TILE_W):
            sx, sy = to_src(tx, ty)
            if not (0 <= sx < src.width and 0 <= sy < src.height):
                continue
            hr, hg, hb, ha = [int(v) for v in sa[sy, sx]]
            if ha < 20 or is_magenta(hr, hg, hb):
                continue
            if is_skin(hr, hg, hb):
                continue
            layer.putpixel((tx, ty), (hr, hg, hb, 255))

    save_layer(layer, f'hair_{name}')
    gender = 'f' if name.startswith('f') else 'm'
    make_preview([f'base_{gender}', f'hair_{name}'], f'hair_{name}')

# ── MAIN ───────────────────────────────────────────────────────────────────────
def main():
    print("=" * 60)
    print("build_all.py — Processing all assets")
    print("=" * 60)

    # Base bodies
    process_base(BASE_M, 'base_m')
    process_base(BASE_F, 'base_f')

    # Face strip
    process_faces(FACE_STRIP)

    # Male: load base once
    print("\n[MALE OUTFITS]")
    base_m = Image.open(os.path.join(HERE, BASE_M)).convert('RGBA')
    ba_m   = arr(base_m)
    ts_m   = tile_mapper(base_m)
    for f, name in MALE_OUTFITS:
        print(f"  outfit {name}")
        process_outfit(base_m, ba_m, f, name, ts_m)

    print("\n[MALE HAIR]")
    for f, name in MALE_HAIR:
        print(f"  hair {name}")
        process_hair(base_m, ba_m, f, name, ts_m)

    # Female: load base once
    print("\n[FEMALE OUTFITS]")
    base_f = Image.open(os.path.join(HERE, BASE_F)).convert('RGBA')
    ba_f   = arr(base_f)
    ts_f   = tile_mapper(base_f)
    for f, name in FEMALE_OUTFITS:
        print(f"  outfit {name}")
        process_outfit(base_f, ba_f, f, name, ts_f)

    print("\n[FEMALE HAIR]")
    for f, name in FEMALE_HAIR:
        print(f"  hair {name}")
        process_hair(base_f, ba_f, f, name, ts_f)

    print("\n" + "=" * 60)
    print("Done! Check poc/layers/ and poc/preview_*.png")
    print("=" * 60)

if __name__ == '__main__':
    main()
