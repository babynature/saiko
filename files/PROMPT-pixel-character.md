# PROMPT — Pixel Art Character Module

## Context (อ่านก่อน)

นี่คือเกม Student Health Game — SPA Vanilla JS ไม่มี framework  
ตัวละครปัจจุบันเป็น CSS div + emoji face ธรรมดา  
Session นี้จะแทนที่ด้วย Canvas-based pixel art ที่เปลี่ยนรูปร่างตาม BMI และแสดงอารมณ์ตามความหิว

**ไฟล์หลักที่เกี่ยวข้อง:**
- `modules/characterModule.js` — เก็บ state ตัวละคร (BMI, level, stats, cosmetics)
- `modules/hungerModule.js` — `getHungerPct()` คืน 0–100
- `index.html` — มี `<div class="char-avatar" id="char-avatar">` ที่จะแทนที่
- `app.js` — เรียก `doLogExercise()`, `logCustomFood()`, `confirmLogSleep()`, `renderAll()`

**กฎ coding ของโปรเจกต์นี้:**
- ห้ามใช้ `type="module"` — ทุก function ต้องเป็น global via `window.*`
- ไฟล์ใหม่ต้องเพิ่ม `<script src="...">` ใน `index.html` ก่อน `</body>`
- ถ้าไฟล์เกิน 600 บรรทัด ให้แตกเป็น `-b.js`

---

## งานที่ต้องทำ

### 1. สร้างไฟล์ใหม่ `modules/pixelCharacterModule.js`

สร้าง class `PixelCharacterModule` ที่ draw ลง Canvas ด้วย `ctx.fillRect` ล้วนๆ (ไม่ใช้ sprite sheet)

```
window.pixelCharModule = new PixelCharacterModule();
```

### 2. แทนที่ HTML ใน `index.html`

แทนที่ `<div class="char-avatar" id="char-avatar">` ด้วย:
```html
<canvas id="char-canvas" width="64" height="64"
  style="image-rendering:pixelated; image-rendering:crisp-edges; width:128px; height:128px;">
</canvas>
```
เก็บ div เดิมไว้แต่ `display:none` เป็น fallback

### 3. เพิ่ม `<script>` ใน `index.html`
```html
<script src="modules/pixelCharacterModule.js"></script>
```

---

## Spec ตัวละคร

### Canvas Setup
- ขนาด: **64×64 px** scale up 2× ด้วย CSS
- Head:Body ratio = **1:1** (หัวใหญ่ อ่านหน้าง่าย)
- ชุดนักเรียน: เสื้อขาว กางเกง/กระโปรงสีพื้น
- ชุดเปลี่ยนสีได้ตาม level (recolor runtime)

### BMI States (5 รูปร่าง)

| State ID | BMI category | การเปลี่ยนรูป |
|----------|-------------|--------------|
| `weak` | underweight | หลังค่อม แขนผอม สีผิวซีด |
| `normal` | normal | ยืนตรง อกผาย สีผิวสุขภาพดี |
| `chubby` | overweight_lv1 | พุงบวม +2–3px แก้มป่อง |
| `heavy` | overweight_lv2+ | ตัวกว้าง +5–6px ชุดดูตึง เท้าห่าง |
| `buff` | special (earned) | บ่าบึ้ง V-shape golden aura รอบตัว |

วิธี implement: pixel array แยกต่างหากต่อ BMI state, overlay บน head เดียวกัน

ดึง state ปัจจุบันจาก:
```js
const bmiCat = characterModule.get('categoryId'); // 'underweight','normal','overweight','obese'
```

### Hunger Expressions (หน้าเปลี่ยนตาม hunger%)

| hunger% | Expression | รายละเอียด |
|---------|------------|-----------|
| 90–100% | Happy 😄 | ตาเป็นประกาย มี sparkle pixels รอบหัว |
| 60–89%  | Normal 🙂 | ตากลม ปากยิ้มเล็กน้อย |
| 30–59%  | Worried 😐 | คิ้วตก ปากแบน มี sweat drop 1 pixel |
| 10–29%  | Distressed 😵 | ผิวซีด ตาหมุน มือจับท้อง |
| 0–9%    | Starving 💀 | ล้มหมอบ หรือ blink แดงด้วย CSS animation |

```js
const hungerPct = hungerModule.getHungerPct(); // 0–100
```

### Action Props (2-frame swap ทุก 600ms)

| Action | Prop | Trigger จาก app.js |
|--------|------|-------------------|
| `exercise` | แบดมินตัน racket ยกขึ้น-ลง / ดัมเบล | `doLogExercise()` |
| `eat` | ชามข้าว / ขวดน้ำ + 💚 heart ลอยจากหัว | `logCustomFood()`, `confirmBuyFood()` |
| `sleep` | ตาหลับ + ZZZ bubble | `confirmLogSleep()` |
| `study` | แว่นตา + หนังสือ bob เบาๆ | intelligence event |
| `levelup` | stars burst 4-frame รอบตัว | `showLevelUp()` |
| `idle` | หายใจ (scale 1→1.01 ช้าๆ) | default |

API ที่ต้องเพิ่มใน `app.js`:
```js
// ใน doLogExercise() ต่อจาก showToast:
if (window.pixelCharModule) pixelCharModule.setAction('exercise', 3000);

// ใน logCustomFood():
if (window.pixelCharModule) pixelCharModule.setAction('eat', 2000);

// ใน confirmLogSleep():
if (window.pixelCharModule) pixelCharModule.setAction('sleep', 5000);

// ใน showLevelUp():
if (window.pixelCharModule) pixelCharModule.setAction('levelup', 2500);
```

---

## API ของ `PixelCharacterModule`

```js
class PixelCharacterModule {
  constructor() { /* init canvas, start render loop */ }

  // เรียกจาก renderAll() ใน app.js
  render() { /* อ่าน BMI + hunger แล้ว draw */ }

  // เรียกจาก action events
  setAction(actionId, durationMs = 2000) { /* set action, reset to idle after duration */ }

  // เรียกจาก character cosmetics
  setCosmetic(type, value) { /* color, aura, accessory */ }
}
```

เพิ่มใน `renderAll()` ของ `app.js`:
```js
function renderAll() {
  // ... existing renders ...
  if (window.pixelCharModule) pixelCharModule.render();
}
```

---

## Color Palette (8 สีต่อ BMI state)

```js
const PALETTES = {
  normal: {
    skin:     '#FDBCB4',
    hair:     '#3D2B1F',
    shirt:    '#FFFFFF',
    pants:    '#4A90D9',
    outline:  '#2C1810',
    highlight:'#FFE4D6',
    shadow:   '#D4956A',
    aura:     'transparent',
  },
  weak: {
    skin:     '#E8C9C0',  // ซีดกว่า
    pants:    '#7A7A7A',  // desaturate
    // ... etc
  },
  heavy: {
    // ... เพิ่ม px belly
  },
  buff: {
    aura: '#FFD700',  // golden glow
  },
};
```

---

## Pixel Array Pattern (วิธี draw)

```js
// ตัวอย่าง head pixel array (8×8)
// 0=transparent, 1=skin, 2=hair, 3=outline, 4=highlight
const HEAD = [
  [0,0,3,3,3,3,0,0],
  [0,3,2,2,2,2,3,0],
  [3,2,2,2,2,2,2,3],
  [3,1,4,1,1,4,1,3],
  [3,1,1,1,1,1,1,3],
  [3,1,3,1,1,3,1,3],  // ← ตา
  [3,1,1,3,3,1,1,3],  // ← ปาก
  [0,3,3,3,3,3,3,0],
];

function drawPixelArray(ctx, arr, palette, offsetX, offsetY, scale=1) {
  arr.forEach((row, y) => {
    row.forEach((colorIdx, x) => {
      if (colorIdx === 0) return;
      ctx.fillStyle = palette[colorIdx];
      ctx.fillRect((offsetX + x) * scale, (offsetY + y) * scale, scale, scale);
    });
  });
}
```

---

## ลำดับการ implement (แนะนำ)

1. สร้าง canvas + วาด head เดี่ยวก่อน (ให้เห็น output บน screen)
2. เพิ่ม body normal state
3. เพิ่ม hunger expressions (swap face array)
4. เพิ่ม BMI body variants
5. เพิ่ม action props (exercise/eat/sleep)
6. เพิ่ม idle breathing animation
7. เพิ่ม levelup star burst
8. Wire up ใน `app.js` และ `renderAll()`

---

## หมายเหตุ

- ตัวละครปัจจุบัน gender รองรับ `'M'` และ `'F'` → ทำ pixel array แยกหรือ recolor
- `characterModule.get('cosmetics')` มี `{ color, aura, accessory, pet }` — ใช้ recolor palette ได้
- ถ้าไฟล์เกิน 600 บรรทัดให้แตกเป็น `pixelCharacterModule-b.js` (pixel arrays) + `pixelCharacterModule.js` (logic)
