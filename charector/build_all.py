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
FACE_GRID  = 'Gemini_Generated_Image_vgfy42vgfy42vgfy.png'  # 9-face 2-row features-only

FACE_SIZE  = 28   # output PNG size (square px) — at SCALE=2 renders 56×56 on canvas

# Blob selection: override default first-9 order when some blobs are extras.
# None = use first 9 detected blobs; list = explicit blob indices for face_0..face_8.
# blob_7 in this image is 'worried/sweat' (not in our emotion set) — skip it.
FACE_BLOB_SELECT = [0, 1, 2, 3, 4, 5, 6, 8, 9]

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
    # face_0 overlay — y=6 tile coords matches avatarModule face y position
    f0 = os.path.join(OUT, 'face_0.png')
    if os.path.exists(f0):
        f = Image.open(f0)
        prev.alpha_composite(f, (TILE_W // 2 - f.width // 2, 6))
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

# ── 2. Face grid (2-row × 5+4 layout on magenta bg) ───────────────────────────
def process_faces(src_file):
    """Slice 9 chibi faces from a grid image on magenta background.
    Uses connected-component detection so layout can be 2 rows or 1 row.
    Feature-only filter keeps eyes/outlines/blush, discards skin oval."""
    print(f"\n[FACES] {src_file}")

    src_path = os.path.join(HERE, src_file)
    if not os.path.exists(src_path):
        print(f"  ERROR: file not found — {src_path}")
        _proc_faces_fallback()
        return

    img = Image.open(src_path).convert('RGBA')
    ia  = np.array(img)
    r4, g4, b4, a4 = ia[:,:,0], ia[:,:,1], ia[:,:,2], ia[:,:,3]

    # Key magenta: R high, G low, B high
    is_mag = (r4.astype(int) > 150) & (g4.astype(int) < 100) & (b4.astype(int) > 150)
    mask   = (~is_mag) & (a4 > 20)

    # Connected-component detection via row/col projection per horizontal band
    blobs = _find_face_blobs(mask, img.width, img.height)

    if len(blobs) < 9:
        print(f"  WARNING: only {len(blobs)} blobs found — using procedural for missing")

    # Apply blob selection (allows skipping extras / reordering)
    if FACE_BLOB_SELECT is not None:
        selected = [blobs[i] for i in FACE_BLOB_SELECT if i < len(blobs)]
    else:
        selected = blobs[:9]

    PAD = 5
    for idx in range(9):
        emotion = FACE_EMOTION_ORDER[idx]
        if idx < len(selected):
            b = selected[idx]
            y0 = max(0, b['y0'] - PAD)
            y1 = min(img.height - 1, b['y1'] + PAD)
            x0 = max(0, b['x0'] - PAD)
            x1 = min(img.width  - 1, b['x1'] + PAD)

            crop = img.crop((x0, y0, x1 + 1, y1 + 1)).convert('RGBA')

            # Remove any remaining magenta fringe
            ca = np.array(crop)
            cm = (ca[:,:,0].astype(int) > 150) & (ca[:,:,1].astype(int) < 100) & (ca[:,:,2].astype(int) > 150)
            ca[cm] = [0, 0, 0, 0]
            crop = Image.fromarray(ca, 'RGBA')

            # Pad to square so resize doesn't squish
            cw, ch = crop.size
            side = max(cw, ch)
            sq = Image.new('RGBA', (side, side))
            sq.paste(crop, ((side - cw) // 2, (side - ch) // 2))

            # Resize — NEAREST keeps pixel-art crispness
            face_out = sq.resize((FACE_SIZE, FACE_SIZE), Image.NEAREST)

            # Feature-only filter: keep outlines/eyes/blush, discard face skin.
            # Pixel-art skin is clean peach (~230,185,155) so thresholds are reliable.
            fa = np.array(face_out)
            fr, fg, fb, falpha = fa[:,:,0], fa[:,:,1], fa[:,:,2], fa[:,:,3]
            is_dark  = (fr < 100) & (fg < 85)  & (fb < 85)          # outlines, pupils, eyebrows
            is_white = (fr > 210) & (fg > 205) & (fb > 200)          # eye whites / highlight dots
            is_pink  = (fr > 180) & (fg < 150) & (fb < 150)          # blush, lips, tongue, mouth
            is_tear  = (fb.astype(int) > fr.astype(int) + 40) & (fb > 150)  # tear drop (sad face)
            keep = is_dark | is_white | is_pink | is_tear
            fa[~keep | (falpha < 20)] = [0, 0, 0, 0]
            face_out = Image.fromarray(fa, 'RGBA')
            label = f"blob ({x0},{y0})-({x1},{y1})"
        else:
            face_out = _make_proc_face(emotion)
            label = "procedural fallback"

        path = os.path.join(OUT, f'face_{idx}.png')
        face_out.save(path)
        print(f"  face_{idx} ({emotion:<10s}): {label} -> {FACE_SIZE}x{FACE_SIZE}")

    _preview_faces()


def _find_face_blobs(mask, img_w, img_h):
    """Find face bounding boxes using dilation to merge disconnected features.
    Works for both full-face and features-only (eyes/mouth separate blobs) images.
    Returns list of {'y0','y1','x0','x1','cy','cx','row'} sorted top→bottom, left→right."""

    # Dilation radii: bridge small gaps between disconnected features within one face.
    # Keep DC small so inter-face gaps (~15% of image width) are never bridged.
    DR = max(8,  img_h // 30)   # vertical dilation
    DC = max(10, img_w // 80)   # horizontal dilation — ~1.25% of width

    def dilate_1d(arr, radius):
        out = np.zeros_like(arr, dtype=bool)
        for shift in range(-radius, radius + 1):
            shifted = np.roll(arr.astype(bool), shift)
            if shift > 0:  shifted[:shift] = False
            elif shift < 0: shifted[shift:] = False
            out |= shifted
        return out

    # Row projection → dilate → find horizontal bands
    row_has = mask.sum(axis=1) > (img_w // 100)
    row_dil = dilate_1d(row_has, DR)
    in_band, bands = False, []
    for y in range(img_h):
        if row_dil[y] and not in_band:   band_start = y; in_band = True
        elif not row_dil[y] and in_band: bands.append((band_start, y - 1)); in_band = False
    if in_band: bands.append((band_start, img_h - 1))

    blobs = []
    for (by0, by1) in bands:
        band_mask = mask[by0:by1 + 1, :]
        col_has = band_mask.sum(axis=0) > 0
        col_dil = dilate_1d(col_has, DC)     # merge intra-face horizontal gaps

        in_face = False
        for x in range(img_w):
            if col_dil[x] and not in_face:
                fx0 = x; in_face = True
            elif not col_dil[x] and in_face:
                fx1 = x - 1
                sl = mask[by0:by1 + 1, fx0:fx1 + 1]
                rws = np.where(sl.any(axis=1))[0]
                cws = np.where(sl.any(axis=0))[0]
                if len(rws) and len(cws):
                    ry0 = by0 + int(rws[0]); ry1 = by0 + int(rws[-1])
                    rx0 = fx0 + int(cws[0]); rx1 = fx0 + int(cws[-1])
                    blobs.append({'y0':ry0,'y1':ry1,'x0':rx0,'x1':rx1,
                                  'cy':(ry0+ry1)//2,'cx':(rx0+rx1)//2})
                in_face = False
        if in_face:
            sl = mask[by0:by1 + 1, fx0:]
            rws = np.where(sl.any(axis=1))[0]
            cws = np.where(sl.any(axis=0))[0]
            if len(rws) and len(cws):
                ry0 = by0 + int(rws[0]); ry1 = by0 + int(rws[-1])
                rx0 = fx0 + int(cws[0]); rx1 = fx0 + len(sl[0]) - 1
                blobs.append({'y0':ry0,'y1':ry1,'x0':rx0,'x1':rx1,
                              'cy':(ry0+ry1)//2,'cx':(rx0+rx1)//2})

    # Filter blobs much smaller than median width (noise)
    if blobs:
        widths = sorted([b['x1'] - b['x0'] for b in blobs])
        med_w = widths[len(widths) // 2]
        blobs = [b for b in blobs if (b['x1'] - b['x0']) > med_w * 0.35]

    # Sort top→bottom, then left→right within each row
    if blobs:
        blobs.sort(key=lambda b: b['cy'])
        med_h = sorted([b['y1'] - b['y0'] for b in blobs])[len(blobs) // 2]
        row_thresh = max(med_h * 0.8, DR * 2)
        row_id = 0; prev_cy = blobs[0]['cy']
        for b in blobs:
            if b['cy'] - prev_cy > row_thresh: row_id += 1
            b['row'] = row_id; prev_cy = b['cy']
        blobs.sort(key=lambda b: (b['row'], b['cx']))

    print(f"  Detected {len(blobs)} face blobs across {len(bands)} row-bands")
    return blobs


def _proc_faces_fallback():
    for i, em in enumerate(FACE_EMOTION_ORDER):
        _make_proc_face(em).save(os.path.join(OUT, f'face_{i}.png'))


def _preview_faces():
    """Save poc/face_on_white.png + face_on_dark.png showing all 9 faces."""
    FS = FACE_SIZE
    imgs = []
    for i in range(9):
        p = os.path.join(OUT, f'face_{i}.png')
        if os.path.exists(p):
            imgs.append(Image.open(p).convert('RGBA'))
    if not imgs:
        return
    W = len(imgs) * (FS + 2) + 2
    H = FS + 4
    for bg, fname in [((255,255,255,255), 'face_on_white'), ((30,30,46,255), 'face_on_dark')]:
        c = Image.new('RGBA', (W, H), bg)
        for i, f in enumerate(imgs):
            c.alpha_composite(f, (2 + i * (FS + 2), 2))
        c.save(os.path.join(PREV, f'{fname}.png'))
        print(f"  Preview: {fname}.png")

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

    # Face grid (9-face 2-row pixel art)
    process_faces(FACE_GRID)

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
