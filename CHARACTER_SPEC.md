# Character / Avatar System — Spec + Architecture (v1, locked contract)

เอกสารนี้คือ **"สัญญากลาง (contract)"** เดียวที่ทั้งฝั่งวาดภาพ (Aseprite / generate) และฝั่งเขียนโค้ด (`avatarModule` + `characterModule`) ยึดร่วมกัน
ถ้าค่าตรงนี้ถูก lock แล้ว ทั้งสองฝั่งเดินขนานกันได้ทันที — ภาพเสร็จเมื่อไหร่แค่วางไฟล์ตามชื่อ ระบบก็ใช้ได้เลย

> รวมรีวิว/ข้อเสนอทั้งหมดแล้ว (shadow+effect layer, hair แยกหน้า/หลัง, acc แยก 4 slot, offsetX/Y, BMI body, blink, snapshot, API เต็ม)

---

## 1. Tile & Scale

| หัวข้อ | ค่า |
|--------|-----|
| ขนาด tile ต่อเฟรม | **64 × 96 px** (portrait, chibi หัวโต) |
| Scale แสดงผล | **×2 = 128 × 192** (ใกล้ของเดิม 120×200) |
| Anchor | เท้าชิดขอบล่าง, จัดกึ่งกลางแนวนอน, เว้นขอบ 1–2px |
| Render | `image-rendering: pixelated` / `imageSmoothingEnabled = false` |

**ห้ามลดเป็น 64×64** — ช่วงขาจะไม่พอ เสื้อผ้า/ท่าทางจะอึดอัด

---

## 2. Layer Stack (z-order ล่าง → บน) — ฉบับสมบูรณ์

| z | เลเยอร์ | เนื้อหา | หมายเหตุ |
|---|---------|---------|----------|
| 0 | `shadow` | วงรีใต้เท้า | **ไม่ขยับตามตัว** — อยู่กับพื้น, ย่อ/จางเมื่อตัวลอย |
| 1 | `back` | ปีก / cape / กระเป๋าเป้ | อยู่หลังตัว |
| 2 | `hair_back` | ผมด้านหลัง (ผมยาว) | ต้องอยู่หลังลำตัว |
| 3 | `body` | ผิว + หัว (ไม่มีตา/ปาก) | 1 ไฟล์ต่อ เพศ×รูปร่าง |
| 4 | `bottom` | กางเกง / กระโปรง | |
| 5 | `top` | เสื้อ | ต้องคลุม silhouette ลำตัวทุกเฟรม |
| 6 | `face` | ตา + ปาก (อารมณ์) | **runtime** — สลับตาม mood, ไม่ใช่ equipment |
| 7 | `faceAcc` | แว่น / หน้ากาก | วาดทับหน้า |
| 8 | `hair_front` | ผมกรอบหน้า / หน้าม้า | **เว้นโซนตาให้โปร่ง** |
| 9 | `head` | หมวก / มงกุฎ | บนสุดของหัว |
| 10 | `hand` | ของถือ (ไม้เบสบอล ฯลฯ) | อยู่หน้าตัว |
| 11 | `effect` | sparkle / aura / weather | overlay บนสุด |

---

## 3. Slots & Equipment Object

**Equipment** เก็บใน `characterModule.data.cosmetics` (บันทึกผ่าน `toJSON()` เดิม):

```jsonc
{
  "body":    "body_f_medium",  // เพศ×รูปร่าง (ดู §4)
  "hair":    "hair05",         // 1 id → วาด hair_back/hair05 + hair_front/hair05
  "top":     "sport01",
  "bottom":  "jeans01",
  "head":    "cap03",          // slot: head
  "faceAcc": "glasses01",      // slot: faceAcc  (ไม่ชนกับ face อารมณ์)
  "back":    "wing01",         // slot: back
  "hand":    null,             // slot: hand
  "effect":  "sparkle01"
}
```

> - `face` (อารมณ์) **ไม่อยู่ใน equipment** — เป็น runtime state ที่ mood เป็นคนสั่ง
> - `hair` เป็น 1 slot แต่ resolve เป็น 2 เลเยอร์ (back+front) โดยใช้ **id เดียวกัน**
> - ของที่ "ซื้อแล้ว" ยังเก็บใน `xpModule.inventory` เดิม — ไม่สร้างระบบ inventory ใหม่

---

## 4. Body Variants (เผื่อ BMI)

6 ไฟล์: `body_{m|f}_{small|medium|large}.png`

**map จาก BMI → body id** (คำนวณจาก `bmiModule.getCategoryId()`):

| BMI category | size |
|--------------|------|
| underweight | small |
| normal | medium |
| overweight / obese | large |

### ⚠️ กติกาบังคับสำหรับคนวาด (กัน wardrobe บาน)
> **ทุก body variant ต้องใช้กรอบไหล่/สะโพก (clothing anchor box) เท่ากัน** ต่างกันแค่เฉดเงา/สัดส่วนหน้า/รายละเอียด
> → เสื้อผ้า 1 ชิ้นจะพอดีทุกไซซ์ ไม่ต้องวาดเสื้อ ×3
> ถ้าเลือกให้รูปร่างต่างกันจริงๆ = ต้องวาดเสื้อผ้าแยกต่อไซซ์ (ต้นทุนภาพ ×3) — ไม่แนะนำช่วงแรก

---

## 5. Face Strip (อารมณ์) — 10 ช่อง

ไฟล์เดียว `face/face.png` วาดเฉพาะโซนตา/ปากตรงตำแหน่งหัว body นอกนั้นโปร่งใส เรียงตาม col:

| idx | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|-----|---|---|---|---|---|---|---|---|---|---|
| อารมณ์ | neutral | happy | hungry | tired | stressed | yum | sad | sleep | blink | angry |

**map จาก `getCharacterMood()` เดิม:** idle→neutral, happy→happy, hungry→hungry, tired→tired, stressed→stressed, eat→yum, (เพิ่ม) exhausted→sleep, starving→sad, event โกรธ→angry

**Blink:** สุ่มทุก **3–5 วินาที** → สลับเป็น `blink` ~120ms แล้ว **กลับไปอารมณ์ปัจจุบัน** (ไม่ override ถาวร) — ไม่ต้องมี animation, แค่เปลี่ยนหน้า ตัวละครจะดูมีชีวิตขึ้นมาก

---

## 6. Animation Table (เตรียม API ให้ครบตั้งแต่แรก แม้ frames = 1)

grid ในแต่ละ sheet: **คอลัมน์ = เฟรม, แถว = ท่าทาง** (ทุกเลเยอร์ใช้ grid เดียวกัน เฟรม align เป๊ะ)

| row | anim | frames (เริ่ม) | fps | loop | หมายเหตุ |
|-----|------|----------------|-----|------|----------|
| 0 | `idle` | 1 | 4 | ✓ | motion จาก transform |
| 1 | `eat` | 1 | 8 | ✗ | playOnce แล้วกลับ idle |
| 2 | `sleep` | 1 | 2 | ✓ | + Zzz effect |
| 3 | `cheer` | 1 | 8 | ✓ | เด้งดีใจ |
| 4 | `walk` | 1 | 8 | ✓ | future |
| 5 | `run` | 1 | 10 | ✓ | future |
| 6 | `cry` | 1 | 6 | ✓ | future |
| 7 | `sit` | 1 | 2 | ✓ | future |
| 8 | `work` | 1 | 6 | ✓ | future (เรียน/ทำงาน) |
| 9 | `exercise` | 1 | 10 | ✓ | future |
| 10 | `dead` | 1 | 1 | ✗ | future (KO) |

> เริ่มที่ 1 เฟรม/ท่า → "การขยับ" มาจาก transform (§7). ค่อยเติมคอลัมน์ทีหลังโดยไม่แตะ API/โครงสร้าง

---

## 7. Motion (Canvas Transform — ประหยัดภาพ + กิน CPU น้อย)

motion ทำที่ระดับ composite (ขยับทั้ง stack) ยกเว้น `shadow` ที่อยู่กับพื้น:

```
idle:    y = sin(t) * 2
cheer:   y = -3 ; scaleY = 0.95→1 (bounce)
hungry:  rotate = ±2°  (สั่นซ้ายขวา)
stressed:jitter = ±1.5px (ถี่)
sleep:   rotate เอียงเบา + Zzz effect ลอย
eat:     scale bounce 1→1.13→0.95→1 (playOnce)
```

**Shadow behavior:** เมื่อตัวลอย (`y < 0`) → `shadowScale = 1 - (|y|/maxJump)*k`, `shadowOpacity` ลดลง → ได้มิติเวลา bounce/jump/sleep

---

## 8. Manifest Schema (`character/manifest.json`)

```jsonc
{
  "tile": { "w": 64, "h": 96, "scale": 2 },
  "layerOrder": ["shadow","back","hair_back","body","bottom","top",
                 "face","faceAcc","hair_front","head","hand","effect"],

  "anims": {
    "idle":  { "row": 0,  "frames": 1, "fps": 4,  "loop": true  },
    "eat":   { "row": 1,  "frames": 1, "fps": 8,  "loop": false },
    "sleep": { "row": 2,  "frames": 1, "fps": 2,  "loop": true  },
    "cheer": { "row": 3,  "frames": 1, "fps": 8,  "loop": true  },
    "walk":  { "row": 4,  "frames": 1, "fps": 8,  "loop": true  },
    "run":   { "row": 5,  "frames": 1, "fps": 10, "loop": true  },
    "cry":   { "row": 6,  "frames": 1, "fps": 6,  "loop": true  },
    "sit":   { "row": 7,  "frames": 1, "fps": 2,  "loop": true  },
    "work":  { "row": 8,  "frames": 1, "fps": 6,  "loop": true  },
    "exercise": { "row": 9, "frames": 1, "fps": 10, "loop": true },
    "dead":  { "row": 10, "frames": 1, "fps": 1,  "loop": false }
  },

  "faces": ["neutral","happy","hungry","tired","stressed",
            "yum","sad","sleep","blink","angry"],

  "items": [
    { "id":"tshirt01", "slot":"top",     "sheet":"top/tshirt.png",     "offsetX":0, "offsetY":0, "cost":0,   "unlock":1 },
    { "id":"sport01",  "slot":"top",     "sheet":"top/sport.png",      "offsetX":0, "offsetY":0, "cost":80,  "unlock":3 },
    { "id":"jeans01",  "slot":"bottom",  "sheet":"bottom/jeans.png",   "offsetX":0, "offsetY":0, "cost":0,   "unlock":1 },
    { "id":"hair05",   "slot":"hair",    "sheet":"hair05",             "offsetX":0, "offsetY":0, "cost":50,  "unlock":1 },
    { "id":"cap03",    "slot":"head",    "sheet":"head/cap.png",       "offsetX":0, "offsetY":-1,"cost":60,  "unlock":2 },
    { "id":"glasses01","slot":"faceAcc", "sheet":"face_acc/glasses.png","offsetX":0,"offsetY":0, "cost":40,  "unlock":1 },
    { "id":"wing01",   "slot":"back",    "sheet":"back/wing.png",      "offsetX":0, "offsetY":0, "cost":150, "unlock":10 }
  ]
}
```

> - **`offsetX/offsetY`** ต่อไอเทม → หมวก/ผมบางทรงเลื่อน 1–2px ได้โดยไม่ต้องแก้ภาพ
> - `hair` slot: `sheet` เป็น **id** ที่ resolve เป็น `hair_back/<id>.png` + `hair_front/<id>.png`

---

## 9. Asset Folder

```
character/
  manifest.json
  body/       body_m_small.png  body_m_medium.png  body_m_large.png
              body_f_small.png  body_f_medium.png  body_f_large.png
  face/       face.png                 (strip 10 ช่อง)
  hair_back/  hair01.png  hair05.png ...
  hair_front/ hair01.png  hair05.png ...   (id ตรงกับ hair_back)
  top/        tshirt.png  hoodie.png  sport.png ...
  bottom/     jeans.png   shorts.png ...
  head/       cap.png     crown.png ...
  face_acc/   glasses.png mask.png ...
  back/       wing.png    cape.png ...
  hand/       bat.png ...
  shadow/     default.png
  effects/    sparkle.png aura.png ...
```

---

## 10. `avatarModule` API

```js
// lifecycle
avatarModule.init(manifest)      // โหลด manifest
avatarModule.preload()           // preload ภาพทั้งหมด (Promise)
avatarModule.mount(canvasEl)     // ผูก <canvas> + เริ่ม render loop
avatarModule.destroy()           // หยุด loop + คืน memory

// equip (เปลี่ยนชุด)
avatarModule.setBody(id)
avatarModule.setHair(id)         // โหลด hair_back + hair_front
avatarModule.setTop(id)
avatarModule.setBottom(id)
avatarModule.setAccessory(slot, id)  // slot: head|faceAcc|back|hand
avatarModule.equip(slot, id)         // generic
avatarModule.getEquipment()          // → object §3
avatarModule.setEquipment(obj)       // โหลดทีเดียว (ตอน loadGame)

// emotion + animation
avatarModule.setEmotion(name)    // neutral|happy|hungry|...  (blink คืนค่านี้)
avatarModule.setAnim(name)       // idle|eat|...
avatarModule.play() / .stop()    // คุม render loop
avatarModule.playOnce(name, cb)  // เล่นครั้งเดียว → callback → กลับ idle

// utility
avatarModule.snapshot(type)      // 'png'|'webp' → dataURL (§12)
avatarModule.randomize()         // สุ่มชุด (onboarding/gacha)
```

**ภายใน:** canvas 1 ตัว + `requestAnimationFrame` loop เดียว วาดตาม `layerOrder`, เลือกเฟรมจาก `currentAnim/frame` (accumulator ตาม fps), apply transform ตาม §7, blink timer แยก

---

## 11. จุดต่อกับโค้ดเดิม (แก้น้อยมาก)

| ของเดิม | ต่อยังไง |
|---------|----------|
| `index.html` | เพิ่ม `<canvas id="char-canvas">` แทน `#char-sprite` + `<script src="modules/avatarModule.js">` |
| `renderCharacter()` | ครั้งแรก `avatarModule.mount()`, จากนั้น `setEquipment(cosmetics)` |
| `getCharacterMood()` (มีแล้ว) | map → `avatarModule.setEmotion()` + `setAnim()` |
| `playCharEatReaction()` (มีแล้ว) | → `avatarModule.playOnce('eat')` + `setEmotion('yum')` |
| `loadGame()` | `avatarModule.setEquipment(cosmetics)` |
| shop / wardrobe | item slot ใหม่ (top/bottom/hair/head/faceAcc/back/hand) → ซื้อลง `xpModule.inventory` → ใส่เรียก `equip()` + `saveGame()` |
| character picker เดิม | กลายเป็นเลือก `body` preset / `randomize()` |
| `sw.js` | bump cache + เพิ่มไฟล์ภาพใหม่ใน asset list |

---

## 12. Snapshot (ข้อดีของ Canvas)

`avatarModule.snapshot()` → dataURL ใช้ต่อได้ทันทีกับ:
Health Card (share), Achievement Card, Profile Card, Discord/Facebook share — โดยไม่ต้อง composite ภาพเอง (รวมกับ `shareModule.js` เดิม)

---

## 13. Build Phases

- **Phase A** — lock contract + `avatarModule` render (1 เฟรม + transform motion + face swap) ด้วยภาพ placeholder → ระบบเดินได้ก่อนภาพจริง
- **Phase B** — เสื้อผ้า + wardrobe + shop (กดเปลี่ยนชุดได้จริง)
- **Phase C** — เติมเฟรมจริง (idle/eat) โดยไม่แตะโครงสร้าง

---

## 14. รองรับอนาคตโดยไม่ต้องรื้อ

อุปกรณ์หลายชิ้น · รูปร่างหลายแบบ (BMI/body type) · อาชีพ (เชฟ/นักกีฬา/นักเรียน = เปลี่ยนชุด) · pet & effect (aura/sparkle/weather) · แอนิเมชันเพิ่ม (walk/run/exercise/work/sit) — ทั้งหมดเพิ่มได้ผ่าน manifest + folder เดิม ไม่แตะ core
