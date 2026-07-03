# PROMPT — Character Visual Design (AI Image Generation)

ใช้ prompt ด้านล่างนี้เจนรูปตัวละครด้วย Midjourney / DALL-E / Stable Diffusion  
เลือก **Option** ที่ต้องการแล้วแทนค่าใน `[SLOT]`

---

## Base Prompt (English — ใช้กับทุก AI)

```
Pixel art character, [GENDER] student, [AGE_LOOK] years old appearance,
[BODY_SHAPE] body type, wearing [UNIFORM_COLOR] school uniform
(white shirt, [PANTS_COLOR] pants/skirt),
[HAIR_STYLE] [HAIR_COLOR] hair, [SKIN_TONE] skin,
[FACE_EXPRESSION] expression,
chibi style, large head, 64x64 pixel art,
transparent background, clean pixel outlines,
game sprite sheet style, RPG character, front view,
no shading gradient — flat color only, 8-color palette
```

---

## Slots — เลือกแล้วแทนค่า

### [GENDER]
| ตัวเลือก | ใส่ใน prompt |
|---------|------------|
| ผู้ชาย | `male` |
| ผู้หญิง | `female` |
| กลาง | `gender-neutral` |

---

### [AGE_LOOK]
| ตัวเลือก | ใส่ใน prompt |
|---------|------------|
| มัธยม | `14-16` |
| มหา'ลัย | `18-22` |
| วัยทำงาน | `25-28` |

---

### [BODY_SHAPE] — 5 BMI States

| State | BMI | ใส่ใน prompt |
|-------|-----|------------|
| ผอมเกิน (Weak) | <18.5 | `very thin, hunched shoulders, frail arms` |
| ปกติ (Normal) | 18.5–22.9 | `slim healthy build, upright posture, chest out` |
| ท้วม (Chubby) | 23–24.9 | `slightly chubby, round cheeks, small belly` |
| อ้วน (Heavy) | 25+ | `overweight, wide body, uniform looks tight, feet apart` |
| ฟิต (Buff) ★ | special | `athletic muscular build, V-shape broad shoulders, golden glow aura` |

> เจนแยกทีละ state แล้วเอามาใส่โค้ดแยกกัน

---

### [UNIFORM_COLOR] — สีชุดนักเรียน
| ตัวเลือก | ใส่ใน prompt |
|---------|------------|
| ขาว-น้ำเงิน (default) | `white shirt, navy blue pants` |
| ขาว-ดำ | `white shirt, black pants` |
| ขาว-เทา | `white shirt, gray pants` |
| ชุด PE (พละ) | `yellow sport shirt, black shorts` |

---

### [HAIR_STYLE] + [HAIR_COLOR]

**ทรงผม:**
| ตัวเลือก | ใส่ใน prompt |
|---------|------------|
| สั้นเรียบ | `short straight` |
| ทรงนักเรียนหญิง | `twin ponytails` / `bob cut` |
| ผมยาว | `long straight` |
| หนวก / ขยุ้ม | `spiky` |
| ไถข้าง | `undercut` |

**สีผม:**
| ตัวเลือก | ใส่ใน prompt |
|---------|------------|
| ดำ | `black` |
| น้ำตาลเข้ม | `dark brown` |
| น้ำตาลอ่อน | `light brown` |
| ทอง/บลอนด์ | `blonde` |
| อื่นๆ | `[สีที่ต้องการ]` |

---

### [SKIN_TONE]
| ตัวเลือก | ใส่ใน prompt |
|---------|------------|
| ขาว | `fair skin` |
| เหลือง/ไทย | `light tan asian skin` |
| แทน | `warm tan skin` |
| เข้ม | `dark brown skin` |

---

### [FACE_EXPRESSION] — 5 Hunger States

| Hunger% | State | ใส่ใน prompt |
|---------|-------|------------|
| 90–100% | Happy | `happy sparkling eyes, big smile, sparkle effect` |
| 60–89%  | Normal | `neutral smile, round eyes, calm` |
| 30–59%  | Worried | `worried face, drooped eyebrows, flat mouth, small sweat drop` |
| 10–29%  | Distressed | `distressed, pale face, swirly dizzy eyes, hand on stomach` |
| 0–9%    | Starving | `collapsed exhausted, red flash effect, hollow eyes` |

> เจน 5 expression แยกกัน โดยใช้ร่างกายเดียวกัน แค่เปลี่ยนหน้า

---

## ตัวอย่าง Prompt สมบูรณ์

### ตัวอย่าง 1 — ผู้หญิง ปกติ Happy
```
Pixel art character, female student, 16 years old appearance,
slim healthy build, upright posture, chest out, wearing white shirt,
navy blue skirt, bob cut black hair, light tan asian skin,
happy sparkling eyes big smile, sparkle effect,
chibi style, large head, 64x64 pixel art,
transparent background, clean pixel outlines,
game sprite sheet style, RPG character, front view,
no shading gradient flat color only, 8-color palette
--ar 1:1 --style raw --v 6
```

### ตัวอย่าง 2 — ผู้ชาย ท้วม Worried
```
Pixel art character, male student, 16 years old appearance,
slightly chubby round cheeks small belly, wearing white shirt,
navy blue pants, short straight dark brown hair, light tan asian skin,
worried face drooped eyebrows flat mouth small sweat drop,
chibi style, large head, 64x64 pixel art,
transparent background, clean pixel outlines,
game sprite sheet style, RPG character, front view,
no shading gradient flat color only, 8-color palette
--ar 1:1 --style raw --v 6
```

### ตัวอย่าง 3 — Buff ฟิต (Athletic)
```
Pixel art character, male student, athletic muscular build,
V-shape broad shoulders, golden glow aura around body,
white shirt navy blue pants, spiky black hair, light tan asian skin,
confident smile eyes gleaming,
chibi style, large head, 64x64 pixel art,
transparent background, clean pixel outlines,
game sprite sheet style, RPG character, front view,
no shading gradient flat color only, 8-color palette
--ar 1:1 --style raw --v 6
```

---

## Action Prop Variants (เจนเพิ่ม)

เจนตัวละคร Normal state แล้วถือ prop ต่างๆ:

| Action | เพิ่มใน prompt |
|--------|--------------|
| ออกกำลังกาย | `holding a badminton racket raised up` / `holding dumbbells` |
| กินข้าว | `holding a bowl of rice, heart emoji floating from head` |
| นอน | `eyes closed, ZZZ bubble above head, sleeping pose` |
| อ่านหนังสือ | `wearing round glasses, holding open book` |
| เลเวลอัพ | `surrounded by 4 yellow star burst effects` |

---

## Tips สำหรับแต่ละ AI

### Midjourney
- เพิ่ม `--ar 1:1 --style raw --v 6` ท้าย prompt
- ใช้ `/imagine` แล้ว paste prompt
- ถ้าต้องการหลาย variant พร้อมกัน เพิ่ม `--chaos 20`

### DALL-E (ChatGPT)
- ลบ `--ar --style --v` ออก
- เพิ่มหน้า prompt ว่า: `"Create a pixel art game sprite:"`

### Stable Diffusion
- เพิ่ม negative prompt: `realistic, 3d, blurry, gradient shading, photo`
- ใช้ model: `dreamshaper` หรือ `anything-v5`
- Sampler: `DPM++ 2M Karras`, Steps: 20, CFG: 7

---

## หลังเจนได้รูปแล้ว → ใช้ใน code

1. Save รูปเป็น PNG (transparent background)
2. ใส่ที่ `assets/char-[state]-[expression].png`  
   เช่น `assets/char-normal-happy.png`
3. ใน `pixelCharacterModule.js` ใช้ `drawImage()` แทน `fillRect()`  
   หรือถ้าวาดเองด้วย pixel array ก็ใช้รูปนี้เป็น reference

---

## Checklist รูปที่ต้องเจน (ครบเซต)

```
Body shapes (5):
[ ] weak-normal     ← ผอม หน้าปกติ
[ ] normal-happy    ← ปกติ หน้าดีใจ
[ ] normal-normal   ← ปกติ หน้าปกติ
[ ] normal-worried  ← ปกติ หน้าเป็นห่วง
[ ] chubby-normal   ← ท้วม หน้าปกติ
[ ] heavy-normal    ← อ้วน หน้าปกติ
[ ] buff-happy      ← ฟิต หน้าดีใจ

Hunger expressions (ใช้ normal body):
[ ] normal-happy     (100%)
[ ] normal-smile     (70%)
[ ] normal-worried   (40%)
[ ] normal-distress  (20%)
[ ] normal-starving  (0%)

Action props (ใช้ normal body + happy face):
[ ] exercise (racket / dumbbell)
[ ] eat (bowl + heart)
[ ] sleep (ZZZ)
[ ] study (glasses + book)
[ ] levelup (star burst)
```
