// data/foodDatabase.js — Thai Food Nutrition Database (per 1 serving)
// Fields: name, kcal, protein(g), carbs(g), fat(g), emoji, portion

window.FOOD_DB = [
  // ── ข้าวจานเดียว ─────────────────────────────────
  { name: 'ข้าวสวย',             kcal: 130, protein: 3,  carbs: 29, fat: 0,  emoji: '🍚', portion: '1 ทัพพี (150g)' },
  { name: 'ข้าวผัด',             kcal: 350, protein: 12, carbs: 45, fat: 12, emoji: '🍳', portion: '1 จาน' },
  { name: 'ข้าวผัดกุ้ง',         kcal: 380, protein: 18, carbs: 45, fat: 12, emoji: '🦐', portion: '1 จาน' },
  { name: 'ข้าวผัดปลาหมึก',      kcal: 360, protein: 16, carbs: 45, fat: 11, emoji: '🦑', portion: '1 จาน' },
  { name: 'ข้าวผัดหอย',          kcal: 345, protein: 14, carbs: 46, fat: 10, emoji: '🐚', portion: '1 จาน' },
  { name: 'ข้าวผัดซีฟู้ด',       kcal: 390, protein: 20, carbs: 46, fat: 12, emoji: '🦐', portion: '1 จาน (กุ้ง+ปลาหมึก+หอย)' },
  { name: 'ข้าวมันไก่',           kcal: 420, protein: 25, carbs: 48, fat: 12, emoji: '🍗', portion: '1 จาน' },
  { name: 'ข้าวหมูแดง',           kcal: 400, protein: 22, carbs: 50, fat: 10, emoji: '🥩', portion: '1 จาน' },
  { name: 'ข้าวหน้าเป็ด',         kcal: 430, protein: 24, carbs: 50, fat: 14, emoji: '🦆', portion: '1 จาน' },
  { name: 'ข้าวกะเพรา',           kcal: 460, protein: 20, carbs: 48, fat: 18, emoji: '🌿', portion: '1 จาน' },
  { name: 'ข้าวกะเพราไก่',        kcal: 440, protein: 22, carbs: 48, fat: 16, emoji: '🌿', portion: '1 จาน' },
  { name: 'ข้าวกะเพราหมู',        kcal: 480, protein: 20, carbs: 48, fat: 20, emoji: '🌿', portion: '1 จาน' },
  { name: 'ข้าวกะเพรากุ้ง',       kcal: 455, protein: 22, carbs: 48, fat: 16, emoji: '🦐', portion: '1 จาน' },
  { name: 'ข้าวกะเพราปลาหมึก',    kcal: 445, protein: 20, carbs: 48, fat: 15, emoji: '🦑', portion: '1 จาน' },
  { name: 'ข้าวกะเพราหอย',        kcal: 425, protein: 18, carbs: 48, fat: 13, emoji: '🐚', portion: '1 จาน' },
  { name: 'ข้าวกะเพราซีฟู้ด',     kcal: 475, protein: 24, carbs: 48, fat: 17, emoji: '🌿', portion: '1 จาน (กุ้ง+ปลาหมึก+หอย)' },
  { name: 'ข้าวต้ม',              kcal: 120, protein: 4,  carbs: 24, fat: 1,  emoji: '🥣', portion: '1 ชาม' },
  { name: 'โจ๊ก',                 kcal: 150, protein: 8,  carbs: 22, fat: 3,  emoji: '🥣', portion: '1 ชาม' },
  { name: 'ข้าวแกงเขียวหวาน',     kcal: 480, protein: 22, carbs: 50, fat: 20, emoji: '🍛', portion: '1 จาน' },
  { name: 'ข้าวแกงมัสมั่น',       kcal: 520, protein: 20, carbs: 52, fat: 24, emoji: '🍛', portion: '1 จาน' },
  { name: 'ข้าวแกงพะแนง',         kcal: 490, protein: 22, carbs: 50, fat: 22, emoji: '🍛', portion: '1 จาน' },
  { name: 'ข้าวผัดสับปะรด',       kcal: 380, protein: 10, carbs: 55, fat: 12, emoji: '🍍', portion: '1 จาน' },

  // ── ก๋วยเตี๋ยว / เส้น ────────────────────────────
  { name: 'ก๋วยเตี๋ยวน้ำ',        kcal: 200, protein: 12, carbs: 30, fat: 4,  emoji: '🍜', portion: '1 ชาม' },
  { name: 'ก๋วยเตี๋ยวน้ำตก',      kcal: 250, protein: 15, carbs: 30, fat: 7,  emoji: '🍜', portion: '1 ชาม' },
  { name: 'ผัดไทย',               kcal: 430, protein: 18, carbs: 55, fat: 14, emoji: '🍝', portion: '1 จาน' },
  { name: 'ผัดซีอิ๊ว',            kcal: 400, protein: 16, carbs: 52, fat: 14, emoji: '🍝', portion: '1 จาน' },
  { name: 'ราดหน้า',               kcal: 380, protein: 18, carbs: 50, fat: 12, emoji: '🍝', portion: '1 จาน' },
  { name: 'ข้าวซอย',              kcal: 520, protein: 22, carbs: 58, fat: 20, emoji: '🍜', portion: '1 ชาม' },
  { name: 'บะหมี่น้ำ',            kcal: 280, protein: 14, carbs: 40, fat: 7,  emoji: '🍜', portion: '1 ชาม' },
  { name: 'มาม่า',                 kcal: 350, protein: 8,  carbs: 50, fat: 14, emoji: '🍜', portion: '1 ซอง' },
  { name: 'สปาเกตตี้',            kcal: 400, protein: 14, carbs: 55, fat: 14, emoji: '🍝', portion: '1 จาน' },

  // ── อาหารกับข้าว ─────────────────────────────────
  { name: 'ต้มยำกุ้ง',            kcal: 160, protein: 18, carbs: 8,  fat: 7,  emoji: '🍲', portion: '1 ชาม' },
  { name: 'ต้มข่าไก่',            kcal: 200, protein: 16, carbs: 6,  fat: 12, emoji: '🍲', portion: '1 ชาม' },
  { name: 'แกงจืด',               kcal: 120, protein: 10, carbs: 8,  fat: 4,  emoji: '🍲', portion: '1 ชาม' },
  { name: 'ผัดกะเพราหมูสับ',      kcal: 280, protein: 18, carbs: 8,  fat: 18, emoji: '🌿', portion: '1 ที่' },
  { name: 'ไข่ดาว',               kcal: 90,  protein: 6,  carbs: 0,  fat: 7,  emoji: '🍳', portion: '1 ฟอง' },
  { name: 'ไข่เจียว',             kcal: 150, protein: 8,  carbs: 2,  fat: 12, emoji: '🍳', portion: '1 ที่' },
  { name: 'ปลาทอด',               kcal: 200, protein: 22, carbs: 5,  fat: 10, emoji: '🐟', portion: '1 ชิ้น' },
  { name: 'หมูทอด',               kcal: 280, protein: 20, carbs: 5,  fat: 18, emoji: '🥩', portion: '3 ชิ้น' },
  { name: 'ไก่ทอด',               kcal: 250, protein: 22, carbs: 8,  fat: 14, emoji: '🍗', portion: '1 ชิ้น' },
  { name: 'ผัดผักรวม',            kcal: 120, protein: 4,  carbs: 12, fat: 6,  emoji: '🥦', portion: '1 ที่' },
  { name: 'ลาบหมู',               kcal: 220, protein: 18, carbs: 10, fat: 12, emoji: '🌶️', portion: '1 ที่' },
  { name: 'ส้มตำ',                kcal: 150, protein: 5,  carbs: 20, fat: 4,  emoji: '🥗', portion: '1 ถ้วย' },
  { name: 'สลัดผัก',              kcal: 80,  protein: 2,  carbs: 10, fat: 3,  emoji: '🥗', portion: '1 จาน' },

  // ── อาหารเช้า / ขนมปัง ──────────────────────────
  { name: 'ขนมปังปิ้งเนย',        kcal: 180, protein: 4,  carbs: 28, fat: 7,  emoji: '🍞', portion: '2 แผ่น' },
  { name: 'ขนมปังปิ้งไข่',        kcal: 260, protein: 10, carbs: 30, fat: 12, emoji: '🍳', portion: '1 ชิ้น' },
  { name: 'แซนด์วิช',             kcal: 300, protein: 14, carbs: 35, fat: 12, emoji: '🥪', portion: '1 ชิ้น' },
  { name: 'ซีเรียล + นม',         kcal: 280, protein: 10, carbs: 48, fat: 6,  emoji: '🥣', portion: '1 ชาม' },
  { name: 'กล้วยแขก',             kcal: 180, protein: 2,  carbs: 30, fat: 6,  emoji: '🍌', portion: '3 ชิ้น' },
  { name: 'ปาท่องโก๋',            kcal: 220, protein: 5,  carbs: 32, fat: 9,  emoji: '🥐', portion: '2 ชิ้น' },
  { name: 'โอวัลติน + นม',        kcal: 200, protein: 8,  carbs: 32, fat: 5,  emoji: '🥛', portion: '1 แก้ว' },

  // ── ฟาสต์ฟู้ด / ขนมขบเคี้ยว ────────────────────
  { name: 'ทอดมัน',               kcal: 180, protein: 8,  carbs: 18, fat: 9,  emoji: '🧆', portion: '3 ชิ้น' },
  { name: 'ปอเปี๊ยะทอด',          kcal: 160, protein: 5,  carbs: 22, fat: 7,  emoji: '🌯', portion: '2 ชิ้น' },
  { name: 'ไก่ KFC',              kcal: 290, protein: 25, carbs: 14, fat: 15, emoji: '🍗', portion: '1 ชิ้น' },
  { name: 'แฮมเบอร์เกอร์',        kcal: 450, protein: 22, carbs: 50, fat: 20, emoji: '🍔', portion: '1 ชิ้น' },
  { name: 'พิซซ่า',               kcal: 280, protein: 12, carbs: 34, fat: 12, emoji: '🍕', portion: '1 ชิ้น' },
  { name: 'เฟรนช์ฟรายส์ (M)',     kcal: 320, protein: 4,  carbs: 42, fat: 15, emoji: '🍟', portion: '1 กล่อง M' },
  { name: 'ข้าวโพดอบเนย',         kcal: 350, protein: 5,  carbs: 52, fat: 14, emoji: '🌽', portion: '1 ถ้วย' },
  { name: 'มันฝรั่งทอด (ซอง)',    kcal: 150, protein: 2,  carbs: 18, fat: 8,  emoji: '🥔', portion: '1 ซอง (30g)' },
  { name: 'บิสกิต',               kcal: 130, protein: 2,  carbs: 18, fat: 6,  emoji: '🍪', portion: '3 แผ่น' },
  { name: 'ช็อกโกแลต',            kcal: 150, protein: 2,  carbs: 18, fat: 8,  emoji: '🍫', portion: '1 แท่ง (30g)' },
  { name: 'ไอศกรีม',              kcal: 200, protein: 3,  carbs: 28, fat: 9,  emoji: '🍦', portion: '1 ลูก' },

  // ── ผลไม้สด ──────────────────────────────────────
  // กล้วย
  { name: 'กล้วยหอม',             kcal: 90,  protein: 1,  carbs: 23, fat: 0,  emoji: '🍌', portion: '1 ลูก (120g)' },
  { name: 'กล้วยน้ำว้า',          kcal: 100, protein: 1,  carbs: 26, fat: 0,  emoji: '🍌', portion: '1 ลูก (130g)' },
  { name: 'กล้วยไข่',             kcal: 70,  protein: 1,  carbs: 18, fat: 0,  emoji: '🍌', portion: '1 ลูก (80g)' },
  { name: 'กล้วยหักมุก',          kcal: 120, protein: 1,  carbs: 31, fat: 0,  emoji: '🍌', portion: '1 ลูก (150g)' },
  // มะม่วง
  { name: 'มะม่วงสุก',            kcal: 100, protein: 1,  carbs: 25, fat: 0,  emoji: '🥭', portion: '1/2 ลูก (~150g)' },
  { name: 'มะม่วงน้ำดอกไม้',      kcal: 85,  protein: 1,  carbs: 22, fat: 0,  emoji: '🥭', portion: '1/2 ลูก (~130g)' },
  { name: 'มะม่วงดิบ',            kcal: 60,  protein: 1,  carbs: 15, fat: 0,  emoji: '🥭', portion: '1/2 ลูก (~130g)' },
  // ส้ม / ตระกูลส้ม
  { name: 'ส้มเขียวหวาน',         kcal: 45,  protein: 1,  carbs: 11, fat: 0,  emoji: '🍊', portion: '1 ลูก (80g)' },
  { name: 'ส้มสายน้ำผึ้ง',        kcal: 55,  protein: 1,  carbs: 14, fat: 0,  emoji: '🍊', portion: '1 ลูก (100g)' },
  { name: 'ส้มโอ',                kcal: 75,  protein: 1,  carbs: 19, fat: 0,  emoji: '🍊', portion: '1 ถ้วย เนื้อ (150g)' },
  { name: 'มะนาว',                kcal: 8,   protein: 0,  carbs: 3,  fat: 0,  emoji: '🍋', portion: '1 ลูก' },
  { name: 'เลมอน',                kcal: 17,  protein: 1,  carbs: 5,  fat: 0,  emoji: '🍋', portion: '1 ลูก (60g)' },
  // แอปเปิ้ล / แพร์
  { name: 'แอปเปิ้ลแดง',          kcal: 80,  protein: 0,  carbs: 21, fat: 0,  emoji: '🍎', portion: '1 ลูก (150g)' },
  { name: 'แอปเปิ้ลเขียว',        kcal: 75,  protein: 0,  carbs: 20, fat: 0,  emoji: '🍏', portion: '1 ลูก (150g)' },
  { name: 'สาลี่ / ลูกแพร์',      kcal: 100, protein: 1,  carbs: 27, fat: 0,  emoji: '🍐', portion: '1 ลูก (170g)' },
  // ผลไม้เมืองร้อนไทย
  { name: 'สับปะรด',              kcal: 80,  protein: 1,  carbs: 20, fat: 0,  emoji: '🍍', portion: '1 ถ้วย (~155g)' },
  { name: 'แตงโม',                kcal: 50,  protein: 1,  carbs: 12, fat: 0,  emoji: '🍉', portion: '2 ชิ้น (~200g)' },
  { name: 'แคนตาลูป / เมล่อน',    kcal: 55,  protein: 1,  carbs: 13, fat: 0,  emoji: '🍈', portion: '1 ถ้วย (~160g)' },
  { name: 'แตงไทย',               kcal: 45,  protein: 1,  carbs: 11, fat: 0,  emoji: '🍈', portion: '1 ถ้วย (~160g)' },
  { name: 'มะละกอสุก',            kcal: 55,  protein: 1,  carbs: 14, fat: 0,  emoji: '🍈', portion: '1 ถ้วย (~145g)' },
  { name: 'มะละกอดิบ',            kcal: 30,  protein: 1,  carbs: 8,  fat: 0,  emoji: '🍈', portion: '1 ถ้วย (~145g)' },
  { name: 'ฝรั่ง',                kcal: 55,  protein: 1,  carbs: 14, fat: 1,  emoji: '🍏', portion: '1 ลูก (~150g)' },
  { name: 'ขนุน',                 kcal: 95,  protein: 2,  carbs: 24, fat: 1,  emoji: '🍈', portion: '1 ถ้วย (~150g)' },
  { name: 'น้อยหน่า',             kcal: 100, protein: 2,  carbs: 25, fat: 0,  emoji: '🍏', portion: '1/2 ลูก (~125g)' },
  { name: 'ทับทิม',               kcal: 80,  protein: 2,  carbs: 19, fat: 1,  emoji: '🍎', portion: '1/2 ลูก (เมล็ด ~90g)' },
  { name: 'แก้วมังกรเนื้อขาว',    kcal: 60,  protein: 1,  carbs: 13, fat: 0,  emoji: '🌸', portion: '1/2 ลูก (~150g)' },
  { name: 'แก้วมังกรเนื้อแดง',    kcal: 60,  protein: 1,  carbs: 12, fat: 1,  emoji: '🌺', portion: '1/2 ลูก (~150g)' },
  { name: 'มะเฟือง',              kcal: 30,  protein: 1,  carbs: 7,  fat: 0,  emoji: '⭐', portion: '1 ลูก (~125g)' },
  { name: 'ชมพู่',                kcal: 25,  protein: 0,  carbs: 6,  fat: 0,  emoji: '🫒', portion: '3 ลูก (~100g)' },
  { name: 'มะขามหวาน',            kcal: 100, protein: 1,  carbs: 25, fat: 0,  emoji: '🟫', portion: '5 ฝัก (~50g)' },
  { name: 'มะขามเปียก',           kcal: 70,  protein: 1,  carbs: 18, fat: 0,  emoji: '🟫', portion: '2 ช้อนโต๊ะ (30g)' },
  { name: 'กระท้อน',              kcal: 80,  protein: 1,  carbs: 20, fat: 0,  emoji: '🟡', portion: '1 ลูก (~120g)' },
  { name: 'มะปราง',               kcal: 55,  protein: 1,  carbs: 14, fat: 0,  emoji: '🟡', portion: '5 ลูก (~100g)' },
  { name: 'พุทรา',                kcal: 55,  protein: 1,  carbs: 14, fat: 0,  emoji: '🟢', portion: '3 ลูก (~100g)' },
  { name: 'มะเดื่อ',              kcal: 50,  protein: 1,  carbs: 13, fat: 0,  emoji: '🍑', portion: '2 ลูก (~80g)' },
  // ลำไย / เงาะ / ลางสาด
  { name: 'ลำไย',                 kcal: 60,  protein: 1,  carbs: 15, fat: 0,  emoji: '🫐', portion: '10 ลูก (~80g)' },
  { name: 'เงาะ',                 kcal: 70,  protein: 1,  carbs: 17, fat: 0,  emoji: '🍒', portion: '5 ลูก (~100g)' },
  { name: 'ลางสาด / โลงกอง',      kcal: 65,  protein: 1,  carbs: 16, fat: 0,  emoji: '🟡', portion: '10 ลูก (~100g)' },
  { name: 'ระกำ',                 kcal: 70,  protein: 1,  carbs: 17, fat: 0,  emoji: '🔴', portion: '3 ลูก (~80g)' },
  // ทุเรียน / มังคุด
  { name: 'ทุเรียน',              kcal: 200, protein: 2,  carbs: 30, fat: 8,  emoji: '🌵', portion: '2 พูเล็ก (~100g)' },
  { name: 'ทุเรียนหมอนทอง',       kcal: 220, protein: 2,  carbs: 33, fat: 9,  emoji: '🌵', portion: '2 พูเล็ก (~100g)' },
  { name: 'มังคุด',               kcal: 70,  protein: 0,  carbs: 18, fat: 0,  emoji: '🟣', portion: '3 ลูก (~100g)' },
  // อะโวคาโด / มะพร้าว
  { name: 'อะโวคาโด',             kcal: 160, protein: 2,  carbs: 9,  fat: 15, emoji: '🥑', portion: '1/2 ลูก (~100g)' },
  { name: 'มะพร้าวอ่อน (เนื้อ)',  kcal: 160, protein: 2,  carbs: 7,  fat: 15, emoji: '🥥', portion: '1/2 ลูก เนื้อ' },
  // Berries / ผลไม้นำเข้า
  { name: 'องุ่นแดง',             kcal: 55,  protein: 1,  carbs: 14, fat: 0,  emoji: '🍇', portion: '10–15 ลูก (~80g)' },
  { name: 'องุ่นเขียว',           kcal: 55,  protein: 1,  carbs: 14, fat: 0,  emoji: '🍇', portion: '10–15 ลูก (~80g)' },
  { name: 'สตรอว์เบอร์รี',        kcal: 45,  protein: 1,  carbs: 11, fat: 0,  emoji: '🍓', portion: '1 ถ้วย (~8 ลูก, 150g)' },
  { name: 'บลูเบอร์รี',           kcal: 80,  protein: 1,  carbs: 21, fat: 0,  emoji: '🫐', portion: '1 ถ้วย (~150g)' },
  { name: 'ราสเบอร์รี',           kcal: 65,  protein: 1,  carbs: 15, fat: 1,  emoji: '🍓', portion: '1 ถ้วย (~125g)' },
  { name: 'เชอร์รี',              kcal: 50,  protein: 1,  carbs: 12, fat: 0,  emoji: '🍒', portion: '10 ลูก (~70g)' },
  { name: 'กีวี',                 kcal: 45,  protein: 1,  carbs: 11, fat: 0,  emoji: '🥝', portion: '1 ลูก (~75g)' },
  { name: 'พีช',                  kcal: 60,  protein: 1,  carbs: 15, fat: 0,  emoji: '🍑', portion: '1 ลูก (~150g)' },
  { name: 'พลัม',                 kcal: 45,  protein: 1,  carbs: 11, fat: 0,  emoji: '🍑', portion: '1 ลูก (~100g)' },
  { name: 'แอปริคอท',             kcal: 17,  protein: 0,  carbs: 4,  fat: 0,  emoji: '🍑', portion: '1 ลูก (~35g)' },

  // ── ขนมหวาน ──────────────────────────────────────
  { name: 'ขนมครก',              kcal: 180, protein: 3,  carbs: 28, fat: 7,  emoji: '🫓', portion: '6 ชิ้น' },
  { name: 'ขนมปังกรอบ',          kcal: 160, protein: 4,  carbs: 25, fat: 5,  emoji: '🥐', portion: '2 ชิ้น' },
  { name: 'วุ้นกะทิ',            kcal: 120, protein: 1,  carbs: 22, fat: 4,  emoji: '🧊', portion: '1 ถ้วย' },
  { name: 'ข้าวเหนียวมะม่วง',    kcal: 380, protein: 5,  carbs: 70, fat: 10, emoji: '🍚', portion: '1 ที่' },
  { name: 'ลอดช่อง',             kcal: 200, protein: 1,  carbs: 45, fat: 4,  emoji: '🫙', portion: '1 แก้ว' },
  { name: 'บัวลอย',              kcal: 220, protein: 2,  carbs: 48, fat: 4,  emoji: '🍡', portion: '1 ชาม' },
  { name: 'ทองหยอด',             kcal: 180, protein: 3,  carbs: 38, fat: 2,  emoji: '🟡', portion: '5 ลูก' },
  { name: 'เค้ก',                kcal: 280, protein: 4,  carbs: 40, fat: 12, emoji: '🎂', portion: '1 ชิ้น' },
  { name: 'โดนัท',               kcal: 250, protein: 4,  carbs: 35, fat: 12, emoji: '🍩', portion: '1 ชิ้น' },

  // ── เครื่องดื่ม ───────────────────────────────────
  { name: 'น้ำเปล่า',            kcal: 0,   protein: 0,  carbs: 0,  fat: 0,  emoji: '💧', portion: '1 แก้ว' },
  { name: 'นมสด',                kcal: 120, protein: 6,  carbs: 12, fat: 5,  emoji: '🥛', portion: '1 กล่อง (200ml)' },
  { name: 'นมช็อกโกแลต',        kcal: 160, protein: 6,  carbs: 22, fat: 5,  emoji: '🥛', portion: '1 กล่อง (200ml)' },
  { name: 'ชาเขียว (ขวด)',       kcal: 90,  protein: 0,  carbs: 22, fat: 0,  emoji: '🍵', portion: '1 ขวด (250ml)' },
  { name: 'น้ำส้ม',              kcal: 110, protein: 1,  carbs: 26, fat: 0,  emoji: '🍊', portion: '1 แก้ว (200ml)' },
  { name: 'ชานมไข่มุก',         kcal: 320, protein: 3,  carbs: 60, fat: 7,  emoji: '🧋', portion: '1 แก้ว (400ml)' },
  { name: 'กาแฟดำ',             kcal: 5,   protein: 0,  carbs: 1,  fat: 0,  emoji: '☕', portion: '1 แก้ว' },
  { name: 'กาแฟใส่นม',          kcal: 80,  protein: 2,  carbs: 10, fat: 3,  emoji: '☕', portion: '1 แก้ว' },
  { name: 'กาแฟเย็น',           kcal: 180, protein: 3,  carbs: 30, fat: 5,  emoji: '🧊', portion: '1 แก้ว' },
  { name: 'น้ำอัดลม',           kcal: 140, protein: 0,  carbs: 36, fat: 0,  emoji: '🥤', portion: '1 กระป๋อง (325ml)' },
  { name: 'เอนเนอร์จี้ดริ้งก์',  kcal: 110, protein: 0,  carbs: 28, fat: 0,  emoji: '⚡', portion: '1 กระป๋อง (250ml)' },
  { name: 'โกโก้',               kcal: 200, protein: 5,  carbs: 30, fat: 7,  emoji: '🍫', portion: '1 แก้ว' },

  // ── 7-Eleven Thailand ─────────────────────────────────
  // ข้าวกล่อง
  { name: '7-11 ข้าวไก่กระเทียม',        kcal: 420, protein: 22, carbs: 55, fat: 12, emoji: '🍱', portion: '1 กล่อง' },
  { name: '7-11 ข้าวหมูทอด',             kcal: 460, protein: 18, carbs: 58, fat: 16, emoji: '🍱', portion: '1 กล่อง' },
  { name: '7-11 ข้าวกะเพราหมูสับ',       kcal: 480, protein: 20, carbs: 56, fat: 18, emoji: '🍱', portion: '1 กล่อง' },
  { name: '7-11 ข้าวไก่ย่างซอสเทอริยากิ', kcal: 410, protein: 25, carbs: 52, fat: 10, emoji: '🍱', portion: '1 กล่อง' },
  { name: '7-11 ข้าวหมูแดง+ไข่',         kcal: 440, protein: 22, carbs: 52, fat: 14, emoji: '🍱', portion: '1 กล่อง' },
  { name: '7-11 ข้าวต้มหมู',             kcal: 200, protein: 12, carbs: 28, fat: 5,  emoji: '🍱', portion: '1 กล่อง' },
  { name: '7-11 ข้าวซีอิ๊วหมู',          kcal: 390, protein: 16, carbs: 54, fat: 12, emoji: '🍱', portion: '1 กล่อง' },

  // โอนิกิริ
  { name: '7-11 โอนิกิริ ไก่กระเทียม',  kcal: 180, protein: 7,  carbs: 30, fat: 4,  emoji: '🍙', portion: '1 ชิ้น' },
  { name: '7-11 โอนิกิริ ทูน่า',        kcal: 160, protein: 8,  carbs: 28, fat: 3,  emoji: '🍙', portion: '1 ชิ้น' },
  { name: '7-11 โอนิกิริ แซลมอน',       kcal: 175, protein: 8,  carbs: 28, fat: 4,  emoji: '🍙', portion: '1 ชิ้น' },
  { name: '7-11 โอนิกิริ ไข่ดอง',       kcal: 155, protein: 6,  carbs: 27, fat: 3,  emoji: '🍙', portion: '1 ชิ้น' },

  // แซนด์วิช / ขนมปัง
  { name: '7-11 แซนด์วิชทูน่า',         kcal: 250, protein: 14, carbs: 30, fat: 8,  emoji: '🥪', portion: '1 ชิ้น' },
  { name: '7-11 แซนด์วิชไข่',           kcal: 220, protein: 10, carbs: 28, fat: 8,  emoji: '🥪', portion: '1 ชิ้น' },
  { name: '7-11 แซนด์วิชแฮม+ชีส',       kcal: 270, protein: 13, carbs: 30, fat: 11, emoji: '🥪', portion: '1 ชิ้น' },
  { name: '7-11 คลับแซนด์วิช',          kcal: 350, protein: 16, carbs: 38, fat: 14, emoji: '🥪', portion: '1 ชิ้น' },
  { name: '7-11 ขนมปังไส้ครีม',         kcal: 200, protein: 4,  carbs: 32, fat: 7,  emoji: '🍞', portion: '1 ชิ้น' },
  { name: '7-11 ครัวซองต์',             kcal: 230, protein: 5,  carbs: 26, fat: 12, emoji: '🥐', portion: '1 ชิ้น' },
  { name: '7-11 ขนมปังกล้วยหอม',        kcal: 180, protein: 3,  carbs: 30, fat: 6,  emoji: '🍌', portion: '1 ชิ้น' },

  // อาหารร้อน (hot food counter)
  { name: '7-11 ไก่ทอด',                kcal: 230, protein: 18, carbs: 10, fat: 13, emoji: '🍗', portion: '1 ชิ้น' },
  { name: '7-11 ไส้กรอกแฟรงค์เฟิร์ต',  kcal: 180, protein: 7,  carbs: 5,  fat: 15, emoji: '🌭', portion: '1 ชิ้น' },
  { name: '7-11 ลูกชิ้นทอด',            kcal: 120, protein: 6,  carbs: 8,  fat: 7,  emoji: '🔴', portion: '5 ชิ้น' },
  { name: '7-11 ปาท่องโก๋',             kcal: 200, protein: 4,  carbs: 30, fat: 8,  emoji: '🥖', portion: '2 ชิ้น' },
  { name: '7-11 สปริงโรล (ปอเปี๊ยะ)',   kcal: 150, protein: 4,  carbs: 20, fat: 6,  emoji: '🌯', portion: '2 ชิ้น' },
  { name: '7-11 ข้าวโพดอบเนย',          kcal: 280, protein: 5,  carbs: 42, fat: 10, emoji: '🌽', portion: '1 ฝัก' },

  // บะหมี่ / ก๋วยเตี๋ยว
  { name: '7-11 บะหมี่เป็ดตุ๋น (ถ้วย)',  kcal: 320, protein: 14, carbs: 46, fat: 9,  emoji: '🍜', portion: '1 ถ้วย' },
  { name: '7-11 ก๋วยเตี๋ยวไก่ตุ๋น',     kcal: 260, protein: 16, carbs: 36, fat: 6,  emoji: '🍜', portion: '1 ถ้วย' },
  { name: '7-11 มาม่าไข่ (ไมโครเวฟ)',   kcal: 420, protein: 14, carbs: 58, fat: 16, emoji: '🍜', portion: '1 ถ้วย' },

  // เครื่องดื่ม 7-Eleven
  { name: '7-11 กาแฟ All Café ร้อน',    kcal: 10,  protein: 0,  carbs: 2,  fat: 0,  emoji: '☕', portion: '1 แก้ว S' },
  { name: '7-11 กาแฟ All Café เย็น',    kcal: 150, protein: 2,  carbs: 24, fat: 5,  emoji: '🧊', portion: '1 แก้ว M' },
  { name: '7-11 ลาเต้เย็น',             kcal: 190, protein: 4,  carbs: 28, fat: 7,  emoji: '🧊', portion: '1 แก้ว M' },
  { name: '7-11 Slurpee โคล่า',         kcal: 130, protein: 0,  carbs: 34, fat: 0,  emoji: '🧊', portion: '1 แก้ว M (22oz)' },
  { name: '7-11 นมเปรี้ยว Yakult',      kcal: 50,  protein: 1,  carbs: 12, fat: 0,  emoji: '🥛', portion: '1 ขวด (65ml)' },
  { name: '7-11 Malee น้ำผลไม้',        kcal: 120, protein: 0,  carbs: 30, fat: 0,  emoji: '🍹', portion: '1 กล่อง (200ml)' },
  { name: '7-11 ชาเขียว Itoen',         kcal: 60,  protein: 0,  carbs: 15, fat: 0,  emoji: '🍵', portion: '1 ขวด (345ml)' },

  // ขนม / ของว่าง
  { name: '7-11 พุดดิ้งนม',             kcal: 140, protein: 3,  carbs: 22, fat: 5,  emoji: '🍮', portion: '1 ถ้วย' },
  { name: '7-11 เยลลี่มะพร้าว',         kcal: 90,  protein: 0,  carbs: 22, fat: 0,  emoji: '🟢', portion: '1 ถ้วย' },
  { name: '7-11 คัสตาร์ดพุดดิ้ง',       kcal: 160, protein: 4,  carbs: 24, fat: 5,  emoji: '🍮', portion: '1 ถ้วย' },
  { name: '7-11 ถั่วอบเกลือ',           kcal: 170, protein: 7,  carbs: 10, fat: 12, emoji: '🥜', portion: '1 ซอง (40g)' },
  { name: '7-11 Lay\'s (ซอง)',          kcal: 150, protein: 2,  carbs: 18, fat: 8,  emoji: '🥔', portion: '1 ซอง (30g)' },

  // ── สปาเก็ตตี้ ────────────────────────────────────────
  { name: 'สปาเก็ตตี้ผัดขี้เมา',        kcal: 520, protein: 20, carbs: 62, fat: 20, emoji: '🍝', portion: '1 จาน' },
  { name: 'สปาเก็ตตี้ซอสมะเขือเทศ',     kcal: 420, protein: 14, carbs: 60, fat: 12, emoji: '🍝', portion: '1 จาน' },
  { name: 'สปาเก็ตตี้โบโลเนส',          kcal: 500, protein: 24, carbs: 58, fat: 16, emoji: '🍝', portion: '1 จาน' },
  { name: 'สปาเก็ตตี้คาร์โบนาร่า',      kcal: 580, protein: 20, carbs: 56, fat: 28, emoji: '🍝', portion: '1 จาน' },
  { name: 'สปาเก็ตตี้ครีมเห็ด',         kcal: 540, protein: 14, carbs: 58, fat: 26, emoji: '🍝', portion: '1 จาน' },
  { name: 'สปาเก็ตตี้ซีฟู้ด',           kcal: 480, protein: 26, carbs: 56, fat: 16, emoji: '🍝', portion: '1 จาน' },
  { name: 'สปาเก็ตตี้เนยกระเทียม',      kcal: 460, protein: 12, carbs: 58, fat: 18, emoji: '🍝', portion: '1 จาน' },
  { name: 'สปาเก็ตตี้ไก่อบ',            kcal: 490, protein: 28, carbs: 54, fat: 16, emoji: '🍝', portion: '1 จาน' },
  { name: 'สปาเก็ตตี้แฮมชีส',           kcal: 510, protein: 20, carbs: 56, fat: 22, emoji: '🍝', portion: '1 จาน' },
  { name: 'สปาเก็ตตี้อราเบียตา',        kcal: 430, protein: 12, carbs: 60, fat: 14, emoji: '🍝', portion: '1 จาน' },
  { name: 'สปาเก็ตตี้ทูน่า',            kcal: 450, protein: 22, carbs: 56, fat: 14, emoji: '🍝', portion: '1 จาน' },
  { name: 'เพนเน่ซอสชีส',               kcal: 520, protein: 18, carbs: 60, fat: 22, emoji: '🍝', portion: '1 จาน' },
  { name: 'มักกะโรนีอบชีส',             kcal: 480, protein: 18, carbs: 58, fat: 18, emoji: '🧀', portion: '1 จาน' },
  { name: 'ลาซานญ่า',                   kcal: 560, protein: 26, carbs: 52, fat: 24, emoji: '🍝', portion: '1 ชิ้น' },
  { name: 'สปาเก็ตตี้ 7-11 (ไมโครเวฟ)', kcal: 380, protein: 12, carbs: 54, fat: 12, emoji: '🍝', portion: '1 กล่อง' },

  // ── แซนด์วิช (เพิ่มเติม) ─────────────────────────────
  { name: 'แซนด์วิช BLT',               kcal: 320, protein: 14, carbs: 32, fat: 14, emoji: '🥪', portion: '1 ชิ้น' },
  { name: 'แซนด์วิชไก่ย่าง',            kcal: 290, protein: 22, carbs: 30, fat: 8,  emoji: '🥪', portion: '1 ชิ้น' },
  { name: 'แซนด์วิชไก่กรอบ',            kcal: 380, protein: 20, carbs: 38, fat: 16, emoji: '🥪', portion: '1 ชิ้น' },
  { name: 'แซนด์วิชเนื้อ',              kcal: 400, protein: 24, carbs: 34, fat: 18, emoji: '🥪', portion: '1 ชิ้น' },
  { name: 'แซนด์วิชไข่ดาว',             kcal: 280, protein: 12, carbs: 30, fat: 12, emoji: '🥚', portion: '1 ชิ้น' },
  { name: 'แซนด์วิชแซลมอน',             kcal: 310, protein: 18, carbs: 30, fat: 12, emoji: '🐟', portion: '1 ชิ้น' },
  { name: 'แซนด์วิชอโวคาโด',            kcal: 340, protein: 8,  carbs: 32, fat: 18, emoji: '🥑', portion: '1 ชิ้น' },
  { name: 'แซนด์วิชมังสวิรัติ',         kcal: 240, protein: 8,  carbs: 34, fat: 8,  emoji: '🥗', portion: '1 ชิ้น' },
  { name: 'ซับเวย์ ไก่อบ (6 นิ้ว)',     kcal: 310, protein: 23, carbs: 40, fat: 6,  emoji: '🥪', portion: '1 ชิ้น (6")' },
  { name: 'ซับเวย์ BMT (6 นิ้ว)',       kcal: 380, protein: 21, carbs: 40, fat: 14, emoji: '🥪', portion: '1 ชิ้น (6")' },
  { name: 'ซับเวย์ ทูน่า (6 นิ้ว)',     kcal: 360, protein: 18, carbs: 40, fat: 14, emoji: '🥪', portion: '1 ชิ้น (6")' },
  { name: 'ซับเวย์ Veggie Delite (6 นิ้ว)', kcal: 200, protein: 8, carbs: 38, fat: 2, emoji: '🥗', portion: '1 ชิ้น (6")' },
  { name: 'เบอร์เกอร์ไก่',              kcal: 420, protein: 22, carbs: 42, fat: 18, emoji: '🍔', portion: '1 ชิ้น' },
  { name: 'ฮอทด็อกไส้กรอก',             kcal: 300, protein: 12, carbs: 28, fat: 16, emoji: '🌭', portion: '1 ชิ้น' },
  { name: 'ปาเน่ไก่อบ',                 kcal: 360, protein: 24, carbs: 38, fat: 12, emoji: '🥖', portion: '1 ชิ้น' },
  { name: 'โทสต์แฮมชีส',               kcal: 260, protein: 12, carbs: 26, fat: 12, emoji: '🧀', portion: '1 ชิ้น' },

  // ── โจ๊ก ──────────────────────────────────────────────
  { name: 'โจ๊กหมู',                    kcal: 180, protein: 9,  carbs: 30, fat: 3,  emoji: '🍚', portion: '1 ชาม' },
  { name: 'โจ๊กไก่',                    kcal: 175, protein: 11, carbs: 28, fat: 3,  emoji: '🍚', portion: '1 ชาม' },
  { name: 'โจ๊กกุ้ง',                   kcal: 165, protein: 9,  carbs: 28, fat: 2,  emoji: '🍚', portion: '1 ชาม' },
  { name: 'โจ๊กปลา',                    kcal: 160, protein: 10, carbs: 27, fat: 2,  emoji: '🍚', portion: '1 ชาม' },
  { name: 'โจ๊กไข่',                    kcal: 190, protein: 10, carbs: 29, fat: 5,  emoji: '🥚', portion: '1 ชาม (ไข่ 1 ฟอง)' },
  { name: 'โจ๊กรวมมิตร (หมู+ไข่+เครื่อง)', kcal: 230, protein: 13, carbs: 31, fat: 6,  emoji: '🍚', portion: '1 ชาม' },

  // ── ข้าวเหนียว ────────────────────────────────────────
  { name: 'ข้าวเหนียวหมูปิ้ง (2 ไม้)',  kcal: 350, protein: 15, carbs: 45, fat: 12, emoji: '🍢', portion: 'ข้าว + 2 ไม้' },
  { name: 'ข้าวเหนียวไก่ย่าง',          kcal: 480, protein: 28, carbs: 52, fat: 14, emoji: '🍗', portion: 'ข้าว + ไก่ครึ่งตัว' },
  { name: 'ข้าวเหนียวไก่ทอด',           kcal: 520, protein: 25, carbs: 54, fat: 20, emoji: '🍗', portion: 'ข้าว + ไก่ 1 ชิ้น' },
  { name: 'ข้าวเหนียวไส้กรอก',          kcal: 330, protein: 10, carbs: 48, fat: 12, emoji: '🌭', portion: 'ข้าว + ไส้กรอก 1 ชิ้น' },
  { name: 'ข้าวเหนียวหน้ากุ้ง',         kcal: 380, protein: 14, carbs: 52, fat: 12, emoji: '🦐', portion: '1 ห่อ' },
  { name: 'ข้าวเหนียวหน้าปลา',          kcal: 340, protein: 16, carbs: 48, fat: 9,  emoji: '🐟', portion: '1 ห่อ' },
  { name: 'ข้าวเหนียวสังขยา',           kcal: 280, protein: 5,  carbs: 52, fat: 6,  emoji: '🍮', portion: '1 ห่อ' },
  { name: 'ข้าวเหนียวมะม่วง',           kcal: 450, protein: 6,  carbs: 88, fat: 10, emoji: '🥭', portion: '1 จาน' },
  { name: 'ข้าวเหนียวกล้วยปิ้ง',        kcal: 260, protein: 4,  carbs: 52, fat: 5,  emoji: '🍌', portion: '1 ห่อ' },
  { name: 'ข้าวเหนียวทุเรียน',          kcal: 380, protein: 5,  carbs: 68, fat: 10, emoji: '🍈', portion: '1 ห่อ' },
  { name: 'ข้าวเหนียวเปล่า',            kcal: 200, protein: 4,  carbs: 44, fat: 1,  emoji: '🍚', portion: '1 ปั้น (~100g)' },

  // ── ข้าวต้ม / ข้าวราดหน้า ────────────────────────────
  { name: 'ข้าวต้มหมู',                kcal: 200, protein: 10, carbs: 32, fat: 3,  emoji: '🍲', portion: '1 ชาม' },
  { name: 'ข้าวต้มไก่',                kcal: 190, protein: 12, carbs: 30, fat: 3,  emoji: '🍲', portion: '1 ชาม' },
  { name: 'ข้าวต้มปลา',                kcal: 180, protein: 11, carbs: 30, fat: 2,  emoji: '🍲', portion: '1 ชาม' },
  { name: 'ข้าวต้มกุ้ง',               kcal: 185, protein: 10, carbs: 30, fat: 2,  emoji: '🍲', portion: '1 ชาม' },
  { name: 'ข้าวมันไก่',                kcal: 450, protein: 22, carbs: 58, fat: 14, emoji: '🍗', portion: '1 จาน' },
  { name: 'ข้าวหน้าเป็ด',              kcal: 520, protein: 24, carbs: 60, fat: 18, emoji: '🦆', portion: '1 จาน' },
  { name: 'ข้าวหน้าไก่',               kcal: 440, protein: 22, carbs: 58, fat: 12, emoji: '🍗', portion: '1 จาน' },
  { name: 'ข้าวหน้าหมู',               kcal: 460, protein: 20, carbs: 60, fat: 14, emoji: '🐷', portion: '1 จาน' },
  { name: 'ข้าวหน้าเนื้อ',             kcal: 500, protein: 26, carbs: 58, fat: 16, emoji: '🥩', portion: '1 จาน' },

  // ── อาหารอีสาน ───────────────────────────────────────
  { name: 'ลาบหมูอีสาน',              kcal: 240, protein: 20, carbs: 12, fat: 12, emoji: '🌶️', portion: '1 ที่' },
  { name: 'ลาบไก่อีสาน',             kcal: 200, protein: 22, carbs: 10, fat: 8,  emoji: '🌶️', portion: '1 ที่' },
  { name: 'ลาบเป็ด',                  kcal: 260, protein: 22, carbs: 10, fat: 14, emoji: '🦆', portion: '1 ที่' },
  { name: 'น้ำตกหมู',                kcal: 250, protein: 18, carbs: 12, fat: 14, emoji: '🌿', portion: '1 ที่' },
  { name: 'น้ำตกเนื้อ',              kcal: 270, protein: 22, carbs: 10, fat: 15, emoji: '🥩', portion: '1 ที่' },
  { name: 'ก้อยกุ้ง',                kcal: 160, protein: 16, carbs: 10, fat: 6,  emoji: '🦐', portion: '1 ที่' },
  { name: 'ไส้กรอกอีสาน',            kcal: 280, protein: 14, carbs: 8,  fat: 22, emoji: '🌭', portion: '3 ชิ้น' },
  { name: 'ปลาร้าทอด',               kcal: 180, protein: 16, carbs: 5,  fat: 11, emoji: '🐟', portion: '1 ชิ้น' },
  { name: 'ปลาเผา',                  kcal: 150, protein: 20, carbs: 0,  fat: 7,  emoji: '🐟', portion: '1 ตัวกลาง' },
  { name: 'ซุปหน่อไม้',              kcal: 120, protein: 8,  carbs: 12, fat: 4,  emoji: '🥢', portion: '1 ชาม' },
  { name: 'แกงอ่อมไก่',              kcal: 180, protein: 18, carbs: 8,  fat: 8,  emoji: '🍲', portion: '1 ชาม' },
  { name: 'หมกไก่',                  kcal: 200, protein: 18, carbs: 6,  fat: 12, emoji: '🍃', portion: '1 ห่อ' },
  { name: 'ตำลีลา',                  kcal: 180, protein: 8,  carbs: 24, fat: 5,  emoji: '🥗', portion: '1 ถ้วย' },
  { name: 'ตำถั่ว',                  kcal: 200, protein: 8,  carbs: 22, fat: 8,  emoji: '🥜', portion: '1 ถ้วย' },
  { name: 'ข้าวจี่',                 kcal: 240, protein: 6,  carbs: 44, fat: 5,  emoji: '🍢', portion: '2 ไม้' },
  { name: 'หมูจุ่ม (ซุป)',           kcal: 350, protein: 20, carbs: 30, fat: 16, emoji: '🫕', portion: '1 ที่' },
  { name: 'สลัดแซลมอนอีสาน',        kcal: 220, protein: 20, carbs: 10, fat: 12, emoji: '🐟', portion: '1 ที่' },

  // ── อาหารใต้ ──────────────────────────────────────────
  { name: 'ข้าวยำ',                  kcal: 280, protein: 12, carbs: 42, fat: 8,  emoji: '🥗', portion: '1 จาน' },
  { name: 'แกงไตปลา',               kcal: 220, protein: 16, carbs: 10, fat: 12, emoji: '🐟', portion: '1 ชาม' },
  { name: 'แกงส้มกุ้ง',             kcal: 180, protein: 16, carbs: 12, fat: 7,  emoji: '🦐', portion: '1 ชาม' },
  { name: 'แกงส้มผักรวม',            kcal: 120, protein: 4,  carbs: 14, fat: 5,  emoji: '🥦', portion: '1 ชาม' },
  { name: 'ข้าวแกงใต้',             kcal: 500, protein: 22, carbs: 55, fat: 20, emoji: '🍛', portion: '1 จาน (ข้าว+แกง 2 อย่าง)' },
  { name: 'หมูฮ้อง',                kcal: 380, protein: 24, carbs: 18, fat: 22, emoji: '🐷', portion: '1 ที่' },
  { name: 'ไก่ทอดหาดใหญ่',          kcal: 300, protein: 26, carbs: 10, fat: 18, emoji: '🍗', portion: '1 ชิ้น' },
  { name: 'ข้าวหมกไก่',             kcal: 520, protein: 24, carbs: 62, fat: 18, emoji: '🍗', portion: '1 จาน' },
  { name: 'โรตีกล้วย',              kcal: 320, protein: 5,  carbs: 52, fat: 12, emoji: '🫓', portion: '1 แผ่น' },
  { name: 'โรตีไข่',                kcal: 280, protein: 8,  carbs: 40, fat: 12, emoji: '🥚', portion: '1 แผ่น' },
  { name: 'มาตาบา',                  kcal: 360, protein: 14, carbs: 42, fat: 16, emoji: '🫓', portion: '1 แผ่น' },
  { name: 'น้ำชาดำ (ชาชัก)',        kcal: 100, protein: 1,  carbs: 22, fat: 2,  emoji: '🍵', portion: '1 แก้ว' },
  { name: 'ปลาทูต้มเค็ม',           kcal: 140, protein: 18, carbs: 0,  fat: 7,  emoji: '🐟', portion: '1 ตัว' },

  // ── อาหารเหนือ ────────────────────────────────────────
  { name: 'ขนมจีนน้ำเงี้ยว',        kcal: 380, protein: 18, carbs: 52, fat: 12, emoji: '🍜', portion: '1 จาน' },
  { name: 'แคบหมู',                 kcal: 260, protein: 14, carbs: 4,  fat: 22, emoji: '🐷', portion: '1 ถ้วยเล็ก (40g)' },
  { name: 'แกงฮังเล',               kcal: 320, protein: 20, carbs: 14, fat: 22, emoji: '🍲', portion: '1 ชาม' },
  { name: 'น้ำพริกอ่อง',            kcal: 200, protein: 12, carbs: 12, fat: 12, emoji: '🌶️', portion: '1 ที่ + ผัก' },
  { name: 'แกงขนุนอ่อน',            kcal: 160, protein: 6,  carbs: 18, fat: 8,  emoji: '🍈', portion: '1 ชาม' },
  { name: 'ข้าวซอยไก่',             kcal: 560, protein: 26, carbs: 60, fat: 22, emoji: '🍜', portion: '1 ชาม' },

  // ── กับข้าวอื่นๆ (เพิ่มเติม) ─────────────────────────
  { name: 'ยำวุ้นเส้น',             kcal: 200, protein: 10, carbs: 28, fat: 6,  emoji: '🍜', portion: '1 จาน' },
  { name: 'ยำทะเล',                 kcal: 220, protein: 20, carbs: 14, fat: 8,  emoji: '🦐', portion: '1 จาน' },
  { name: 'ยำไก่ย่าง',              kcal: 240, protein: 22, carbs: 14, fat: 10, emoji: '🍗', portion: '1 จาน' },
  { name: 'แกงเลียง',               kcal: 130, protein: 8,  carbs: 14, fat: 5,  emoji: '🌿', portion: '1 ชาม' },
  { name: 'ข้าวไข่เจียวทรงเครื่อง', kcal: 520, protein: 18, carbs: 52, fat: 24, emoji: '🍳', portion: '1 จาน' },
  { name: 'กะเพราเนื้อ',            kcal: 500, protein: 24, carbs: 48, fat: 22, emoji: '🥩', portion: '1 จาน' },
  { name: 'หมูกระทะ',               kcal: 480, protein: 26, carbs: 20, fat: 32, emoji: '🫕', portion: '1 ที่' },
  { name: 'ชาบู (ต่อรอบ)',           kcal: 400, protein: 28, carbs: 30, fat: 18, emoji: '🫕', portion: '1 รอบ' },

  // ── อาหารทะเล ─────────────────────────────────────────
  // กุ้ง
  { name: 'กุ้งผัดกระเทียมพริกไทย', kcal: 210, protein: 20, carbs: 6,  fat: 12, emoji: '🦐', portion: '1 จาน (~150g)' },
  { name: 'กุ้งเผา',                 kcal: 100, protein: 20, carbs: 0,  fat: 2,  emoji: '🦐', portion: '1 ตัวใหญ่ (100g)' },
  { name: 'กุ้งทอดกรอบ',             kcal: 260, protein: 16, carbs: 18, fat: 14, emoji: '🦐', portion: '5–6 ชิ้น' },
  { name: 'กุ้งอบวุ้นเส้น',          kcal: 290, protein: 22, carbs: 22, fat: 12, emoji: '🦐', portion: '1 ที่' },
  { name: 'กุ้งพริกเกลือ',           kcal: 230, protein: 18, carbs: 10, fat: 13, emoji: '🦐', portion: '1 จาน' },
  { name: 'กะเพรากุ้ง',              kcal: 240, protein: 18, carbs: 8,  fat: 14, emoji: '🦐', portion: '1 ที่ (ไม่มีข้าว)' },
  // ปลาหมึก
  { name: 'ปลาหมึกผัดกระเทียม',      kcal: 200, protein: 18, carbs: 6,  fat: 10, emoji: '🦑', portion: '1 จาน' },
  { name: 'ปลาหมึกย่าง',             kcal: 130, protein: 20, carbs: 4,  fat: 3,  emoji: '🦑', portion: '1 ตัวกลาง' },
  { name: 'ปลาหมึกทอดกรอบ',          kcal: 300, protein: 16, carbs: 24, fat: 16, emoji: '🦑', portion: '1 จาน (ชุบแป้ง)' },
  { name: 'ปลาหมึกผัดเค็ม',          kcal: 230, protein: 18, carbs: 8,  fat: 13, emoji: '🦑', portion: '1 จาน' },
  { name: 'ปลาหมึกผัดพริก',          kcal: 220, protein: 18, carbs: 8,  fat: 12, emoji: '🦑', portion: '1 จาน' },
  { name: 'กะเพราปลาหมึก',           kcal: 220, protein: 16, carbs: 8,  fat: 12, emoji: '🦑', portion: '1 ที่ (ไม่มีข้าว)' },
  // หอย
  { name: 'หอยลายผัดน้ำพริกเผา',     kcal: 200, protein: 18, carbs: 12, fat: 8,  emoji: '🐚', portion: '1 จาน' },
  { name: 'หอยแมลงภู่อบชีส',          kcal: 290, protein: 18, carbs: 10, fat: 18, emoji: '🐚', portion: '6–8 ลูก' },
  { name: 'หอยแมลงภู่ต้มซีอิ๊ว',     kcal: 160, protein: 18, carbs: 6,  fat: 6,  emoji: '🐚', portion: '1 จาน' },
  { name: 'หอยนางรมทอด',              kcal: 240, protein: 14, carbs: 20, fat: 12, emoji: '🦪', portion: '5–6 ชิ้น' },
  { name: 'หอยนางรมสด',               kcal: 70,  protein: 8,  carbs: 6,  fat: 2,  emoji: '🦪', portion: '6 ลูก' },
  { name: 'กะเพราหอยลาย',             kcal: 200, protein: 16, carbs: 8,  fat: 10, emoji: '🐚', portion: '1 ที่ (ไม่มีข้าว)' },
  // ซีฟู้ดรวม
  { name: 'ผัดซีฟู้ดรวม',             kcal: 280, protein: 24, carbs: 10, fat: 16, emoji: '🦐', portion: '1 จาน (กุ้ง+ปลาหมึก+หอย)' },
  { name: 'ต้มยำซีฟู้ด',              kcal: 200, protein: 24, carbs: 10, fat: 8,  emoji: '🍲', portion: '1 ชาม' },
  { name: 'ยำซีฟู้ด',                 kcal: 220, protein: 22, carbs: 14, fat: 8,  emoji: '🦐', portion: '1 จาน' },

  // ── ปิ้งย่าง / สุกี้ / ยำ (เพิ่มเติม) ─────────────────
  { name: 'คอหมูย่าง',               kcal: 320, protein: 24, carbs: 3,  fat: 24, emoji: '🍖', portion: '1 ที่ (~120g)' },
  { name: 'ยำขนมจีน',                kcal: 300, protein: 10, carbs: 48, fat: 8,  emoji: '🍜', portion: '1 จาน' },
  { name: 'สุกี้ทะเล',               kcal: 320, protein: 26, carbs: 26, fat: 12, emoji: '🍲', portion: '1 จาน (กุ้ง+ปลาหมึก+หอย)' },
  { name: 'สุกี้หมู',                kcal: 340, protein: 24, carbs: 28, fat: 14, emoji: '🍲', portion: '1 จาน' },

  // ── อาหารตามสั่ง: ผัดเปรี้ยวหวาน ─────────────────────
  { name: 'ผัดเปรี้ยวหวานหมู',       kcal: 310, protein: 18, carbs: 32, fat: 12, emoji: '🍖', portion: '1 ที่' },
  { name: 'ผัดเปรี้ยวหวานไก่',       kcal: 290, protein: 20, carbs: 30, fat: 10, emoji: '🍗', portion: '1 ที่' },
  { name: 'ผัดเปรี้ยวหวานกุ้ง',      kcal: 275, protein: 18, carbs: 28, fat: 9,  emoji: '🦐', portion: '1 ที่' },
  { name: 'ผัดเปรี้ยวหวานปลา',       kcal: 285, protein: 20, carbs: 26, fat: 8,  emoji: '🐟', portion: '1 ที่' },
  { name: 'ผัดเปรี้ยวหวานซีฟู้ด',    kcal: 295, protein: 22, carbs: 28, fat: 10, emoji: '🦑', portion: '1 ที่' },
  { name: 'ผัดเปรี้ยวหวานเต้าหู้',   kcal: 240, protein: 10, carbs: 30, fat: 10, emoji: '🫘', portion: '1 ที่ (มังสวิรัติ)' },

  // ── อาหารตามสั่ง: ผัดน้ำมันหอย ───────────────────────
  { name: 'ผัดน้ำมันหอยหมู',         kcal: 280, protein: 20, carbs: 12, fat: 18, emoji: '🍖', portion: '1 ที่' },
  { name: 'ผัดน้ำมันหอยไก่',         kcal: 260, protein: 22, carbs: 10, fat: 16, emoji: '🍗', portion: '1 ที่' },
  { name: 'ผัดน้ำมันหอยเนื้อ',       kcal: 305, protein: 24, carbs: 12, fat: 18, emoji: '🥩', portion: '1 ที่' },
  { name: 'ผัดน้ำมันหอยทะเล',        kcal: 245, protein: 22, carbs: 10, fat: 14, emoji: '🦐', portion: '1 ที่' },
  { name: 'ผัดน้ำมันหอยเห็ด',        kcal: 160, protein: 6,  carbs: 14, fat: 10, emoji: '🍄', portion: '1 ที่ (มังสวิรัติ)' },

  // ── อาหารตามสั่ง: ผัดขิง ──────────────────────────────
  { name: 'ผัดขิงหมู',               kcal: 265, protein: 18, carbs: 10, fat: 18, emoji: '🍖', portion: '1 ที่' },
  { name: 'ผัดขิงไก่',               kcal: 245, protein: 20, carbs: 8,  fat: 16, emoji: '🍗', portion: '1 ที่' },
  { name: 'ผัดขิงทะเล',              kcal: 225, protein: 20, carbs: 8,  fat: 12, emoji: '🦐', portion: '1 ที่' },
  { name: 'ผัดขิงเต้าหู้',           kcal: 190, protein: 10, carbs: 10, fat: 12, emoji: '🫘', portion: '1 ที่ (มังสวิรัติ)' },
  { name: 'ผัดขิงเนื้อ',             kcal: 290, protein: 24, carbs: 8,  fat: 18, emoji: '🥩', portion: '1 ที่' },

  // ── อาหารตามสั่ง: ผัดฉ่า ──────────────────────────────
  { name: 'ผัดฉ่าทะเล',              kcal: 245, protein: 22, carbs: 10, fat: 14, emoji: '🦑', portion: '1 ที่' },
  { name: 'ผัดฉ่าหมู',               kcal: 275, protein: 18, carbs: 10, fat: 18, emoji: '🍖', portion: '1 ที่' },
  { name: 'ผัดฉ่าไก่',               kcal: 255, protein: 20, carbs: 8,  fat: 16, emoji: '🍗', portion: '1 ที่' },
  { name: 'ผัดฉ่าเนื้อ',             kcal: 295, protein: 24, carbs: 8,  fat: 18, emoji: '🥩', portion: '1 ที่' },

  // ── อาหารตามสั่ง: ผัดพริก ─────────────────────────────
  { name: 'ผัดพริกแห้งหมู',          kcal: 295, protein: 18, carbs: 8,  fat: 22, emoji: '🌶️', portion: '1 ที่' },
  { name: 'ผัดพริกแห้งไก่',          kcal: 265, protein: 20, carbs: 8,  fat: 16, emoji: '🌶️', portion: '1 ที่' },
  { name: 'ผัดพริกไทยดำเนื้อ',       kcal: 325, protein: 24, carbs: 8,  fat: 22, emoji: '🥩', portion: '1 ที่' },
  { name: 'ผัดพริกไทยดำกุ้ง',        kcal: 235, protein: 18, carbs: 8,  fat: 14, emoji: '🦐', portion: '1 ที่' },
  { name: 'ผัดพริกขิงหมู',           kcal: 285, protein: 18, carbs: 8,  fat: 20, emoji: '🌿', portion: '1 ที่' },
  { name: 'ผัดพริกขิงไก่',           kcal: 260, protein: 20, carbs: 8,  fat: 16, emoji: '🌿', portion: '1 ที่' },

  // ── อาหารตามสั่ง: ผัดเมล็ดมะม่วงหิมพานต์ ──────────────
  { name: 'ผัดเมล็ดมะม่วงหิมพานต์ไก่', kcal: 345, protein: 22, carbs: 20, fat: 20, emoji: '🥜', portion: '1 ที่' },
  { name: 'ผัดเมล็ดมะม่วงหิมพานต์กุ้ง', kcal: 325, protein: 20, carbs: 18, fat: 18, emoji: '🦐', portion: '1 ที่' },
  { name: 'ผัดเมล็ดมะม่วงหิมพานต์หมู', kcal: 355, protein: 20, carbs: 18, fat: 22, emoji: '🍖', portion: '1 ที่' },

  // ── อาหารตามสั่ง: ผัดสะตอ ─────────────────────────────
  { name: 'ผัดสะตอกุ้ง',             kcal: 265, protein: 18, carbs: 14, fat: 16, emoji: '🫘', portion: '1 ที่' },
  { name: 'ผัดสะตอหมู',              kcal: 285, protein: 16, carbs: 14, fat: 18, emoji: '🫘', portion: '1 ที่' },
  { name: 'ผัดสะตอไข่',              kcal: 240, protein: 10, carbs: 14, fat: 16, emoji: '🫘', portion: '1 ที่' },

  // ── อาหารตามสั่ง: ผัดผัก ──────────────────────────────
  { name: 'ผัดผักบุ้งไฟแดง',         kcal: 160, protein: 6,  carbs: 12, fat: 10, emoji: '🌿', portion: '1 ที่' },
  { name: 'ผัดคะน้าน้ำมันหอย',        kcal: 200, protein: 6,  carbs: 14, fat: 14, emoji: '🥦', portion: '1 ที่' },
  { name: 'ผัดคะน้าหมูกรอบ',          kcal: 305, protein: 16, carbs: 14, fat: 22, emoji: '🥦', portion: '1 ที่' },
  { name: 'ผัดถั่วฝักยาวหมูสับ',      kcal: 255, protein: 16, carbs: 12, fat: 16, emoji: '🫘', portion: '1 ที่' },
  { name: 'ผัดถั่วฝักยาวไข่',         kcal: 200, protein: 8,  carbs: 14, fat: 14, emoji: '🫘', portion: '1 ที่' },
  { name: 'ผัดมะระ',                  kcal: 180, protein: 10, carbs: 10, fat: 10, emoji: '🫛', portion: '1 ที่' },
  { name: 'ผัดกะหล่ำปลีน้ำมันหอย',   kcal: 140, protein: 4,  carbs: 14, fat: 8,  emoji: '🥬', portion: '1 ที่' },
  { name: 'ผัดกุยช่าย',               kcal: 180, protein: 8,  carbs: 10, fat: 12, emoji: '🌿', portion: '1 ที่' },
  { name: 'ผัดต้นหอมไข่',             kcal: 170, protein: 8,  carbs: 8,  fat: 12, emoji: '🌿', portion: '1 ที่' },
  { name: 'ผัดเห็ดรวม',               kcal: 150, protein: 6,  carbs: 14, fat: 8,  emoji: '🍄', portion: '1 ที่' },
  { name: 'ผัดบวบน้ำมันหอย',          kcal: 130, protein: 4,  carbs: 12, fat: 8,  emoji: '🥒', portion: '1 ที่' },

  // ── อาหารตามสั่ง: แกง ─────────────────────────────────
  { name: 'แกงกะหรี่ไก่',             kcal: 355, protein: 22, carbs: 20, fat: 22, emoji: '🍛', portion: '1 ชาม' },
  { name: 'แกงกะหรี่เนื้อ',           kcal: 385, protein: 24, carbs: 20, fat: 24, emoji: '🍛', portion: '1 ชาม' },
  { name: 'แกงกะหรี่หมู',             kcal: 370, protein: 20, carbs: 18, fat: 24, emoji: '🍛', portion: '1 ชาม' },
  { name: 'แกงป่าหมู',                kcal: 225, protein: 18, carbs: 10, fat: 14, emoji: '🌿', portion: '1 ชาม' },
  { name: 'แกงป่าไก่',                kcal: 205, protein: 20, carbs: 8,  fat: 12, emoji: '🌿', portion: '1 ชาม' },
  { name: 'แกงป่าทะเล',               kcal: 210, protein: 22, carbs: 8,  fat: 12, emoji: '🌿', portion: '1 ชาม' },
  { name: 'แกงคั่วกุ้ง',              kcal: 205, protein: 18, carbs: 10, fat: 12, emoji: '🦐', portion: '1 ชาม' },
  { name: 'แกงคั่วไก่',               kcal: 220, protein: 20, carbs: 10, fat: 14, emoji: '🍗', portion: '1 ชาม' },
  { name: 'แกงเขียวหวานหมู',          kcal: 390, protein: 20, carbs: 14, fat: 30, emoji: '🍲', portion: '1 ชาม' },
  { name: 'แกงเขียวหวานเนื้อ',        kcal: 420, protein: 24, carbs: 14, fat: 32, emoji: '🍲', portion: '1 ชาม' },
  { name: 'แกงพะแนงหมู',             kcal: 380, protein: 20, carbs: 12, fat: 30, emoji: '🍲', portion: '1 ชาม' },
  { name: 'แกงพะแนงเนื้อ',           kcal: 400, protein: 24, carbs: 12, fat: 30, emoji: '🍲', portion: '1 ชาม' },
  { name: 'แกงส้มปลา',                kcal: 180, protein: 18, carbs: 12, fat: 6,  emoji: '🐟', portion: '1 ชาม' },

  // ── อาหารตามสั่ง: ต้ม ─────────────────────────────────
  { name: 'ต้มจืดเต้าหู้หมูสับ',      kcal: 130, protein: 10, carbs: 6,  fat: 8,  emoji: '🍲', portion: '1 ชาม' },
  { name: 'ต้มจืดผักกาดขาวหมู',       kcal: 110, protein: 8,  carbs: 8,  fat: 4,  emoji: '🥬', portion: '1 ชาม' },
  { name: 'ต้มจืดวุ้นเส้นหมู',        kcal: 155, protein: 10, carbs: 14, fat: 6,  emoji: '🍜', portion: '1 ชาม' },
  { name: 'ต้มยำหมู',                  kcal: 165, protein: 14, carbs: 8,  fat: 8,  emoji: '🍲', portion: '1 ชาม' },
  { name: 'ต้มข่าหมู',                 kcal: 220, protein: 14, carbs: 6,  fat: 16, emoji: '🍲', portion: '1 ชาม' },
  { name: 'ต้มส้มปลา',                 kcal: 150, protein: 16, carbs: 8,  fat: 5,  emoji: '🐟', portion: '1 ชาม' },

  // ── อาหารตามสั่ง: ปลา ─────────────────────────────────
  { name: 'ปลาราดพริก',               kcal: 285, protein: 24, carbs: 12, fat: 16, emoji: '🐟', portion: '1 จาน' },
  { name: 'ปลานึ่งมะนาว',             kcal: 165, protein: 24, carbs: 6,  fat: 4,  emoji: '🐟', portion: '1 จาน' },
  { name: 'ปลาน้ำ 3 รส',              kcal: 305, protein: 22, carbs: 20, fat: 16, emoji: '🐟', portion: '1 จาน' },
  { name: 'ปลาทูทอด',                 kcal: 225, protein: 22, carbs: 4,  fat: 14, emoji: '🐟', portion: '1 ตัว' },
  { name: 'ปลากะพงทอด',               kcal: 255, protein: 26, carbs: 6,  fat: 14, emoji: '🐟', portion: '1 ชิ้น' },
  { name: 'ปลากะพงนึ่ง',              kcal: 170, protein: 26, carbs: 4,  fat: 4,  emoji: '🐟', portion: '1 จาน' },
  { name: 'ปลาช่อนผัดเผ็ด',           kcal: 245, protein: 22, carbs: 10, fat: 14, emoji: '🐟', portion: '1 จาน' },
  { name: 'ปลาหมึกน้ำ 3 รส',          kcal: 280, protein: 18, carbs: 22, fat: 14, emoji: '🦑', portion: '1 จาน' },
  { name: 'กุ้งแช่น้ำปลา',            kcal: 100, protein: 18, carbs: 4,  fat: 2,  emoji: '🦐', portion: '5–6 ตัว' },

  // ── อาหารตามสั่ง: ไก่/หมู/เนื้อ ──────────────────────
  { name: 'ไก่ย่างซีอิ๊ว',            kcal: 225, protein: 26, carbs: 6,  fat: 12, emoji: '🍗', portion: '1 ชิ้น (~150g)' },
  { name: 'ไก่น้ำ 3 รส',              kcal: 290, protein: 24, carbs: 18, fat: 14, emoji: '🍗', portion: '1 จาน' },
  { name: 'ไก่ต้มมะนาว',              kcal: 185, protein: 24, carbs: 4,  fat: 8,  emoji: '🍗', portion: '1 จาน' },
  { name: 'หมูสามชั้นทอด',            kcal: 405, protein: 18, carbs: 4,  fat: 36, emoji: '🐷', portion: '1 ที่ (~100g)' },
  { name: 'หมูแดดเดียว',               kcal: 305, protein: 22, carbs: 4,  fat: 22, emoji: '🐷', portion: '1 ที่ (~100g)' },
  { name: 'หมูกระทะอบ',               kcal: 340, protein: 24, carbs: 8,  fat: 24, emoji: '🍖', portion: '1 ที่ (~150g)' },
  { name: 'เนื้อผัดน้ำมันหอย',         kcal: 305, protein: 24, carbs: 12, fat: 18, emoji: '🥩', portion: '1 ที่' },
  { name: 'เนื้อสันในย่าง',            kcal: 250, protein: 28, carbs: 0,  fat: 14, emoji: '🥩', portion: '1 ชิ้น (~150g)' },

  // ── อาหารตามสั่ง: พะโล้ ───────────────────────────────
  { name: 'พะโล้ไข่+เต้าหู้',          kcal: 285, protein: 14, carbs: 18, fat: 18, emoji: '🟤', portion: '1 ที่' },
  { name: 'พะโล้หมูสามชั้น',           kcal: 355, protein: 16, carbs: 18, fat: 26, emoji: '🐷', portion: '1 ที่' },
  { name: 'พะโล้ไก่',                  kcal: 300, protein: 24, carbs: 16, fat: 16, emoji: '🍗', portion: '1 ที่' },
  { name: 'พะโล้เป็ด',                 kcal: 380, protein: 24, carbs: 16, fat: 24, emoji: '🦆', portion: '1 ที่' },
  { name: 'ไข่พะโล้',                  kcal: 155, protein: 10, carbs: 10, fat: 8,  emoji: '🥚', portion: '2 ฟอง' },

  // ── อาหารตามสั่ง: ไข่ ─────────────────────────────────
  { name: 'ไข่ตุ๋น',                   kcal: 100, protein: 8,  carbs: 2,  fat: 6,  emoji: '🥚', portion: '1 ฟอง' },
  { name: 'ไข่ลูกเขย',                 kcal: 185, protein: 8,  carbs: 14, fat: 12, emoji: '🥚', portion: '2 ฟอง (ราดซอสมะขาม)' },
  { name: 'ไข่เจียวหมูสับ',            kcal: 205, protein: 12, carbs: 4,  fat: 16, emoji: '🍳', portion: '1 ที่' },
  { name: 'ไข่เจียวซีฟู้ด',            kcal: 195, protein: 14, carbs: 4,  fat: 14, emoji: '🍳', portion: '1 ที่' },
  { name: 'ไข่ดาวราดน้ำมันหอย',         kcal: 120, protein: 6,  carbs: 4,  fat: 9,  emoji: '🍳', portion: '1 ฟอง' },

  // ── อาหารตามสั่ง: ข้าวจานเดียวเพิ่มเติม ──────────────
  { name: 'ข้าวคลุกกะปิ',              kcal: 425, protein: 14, carbs: 58, fat: 16, emoji: '🍚', portion: '1 จาน' },
  { name: 'ข้าวแกงกะหรี่ไก่',          kcal: 470, protein: 20, carbs: 62, fat: 16, emoji: '🍛', portion: '1 จาน' },
  { name: 'ข้าวผัดพริก',               kcal: 385, protein: 14, carbs: 48, fat: 16, emoji: '🌶️', portion: '1 จาน' },
  { name: 'ข้าวผัดปู',                 kcal: 400, protein: 18, carbs: 48, fat: 14, emoji: '🦀', portion: '1 จาน' },
  { name: 'ข้าวผัดแหนม',               kcal: 390, protein: 14, carbs: 48, fat: 16, emoji: '🌭', portion: '1 จาน' },
  { name: 'ข้าวผัดอเมริกัน',           kcal: 540, protein: 20, carbs: 58, fat: 24, emoji: '🍳', portion: '1 จาน (ข้าว+ไส้กรอก+ไข่+มะเขือเทศ)' },
  { name: 'ข้าวหมูกรอบ',               kcal: 460, protein: 18, carbs: 52, fat: 20, emoji: '🐷', portion: '1 จาน' },
  { name: 'ข้าวเป็ดย่าง',              kcal: 480, protein: 22, carbs: 52, fat: 20, emoji: '🦆', portion: '1 จาน' },
  { name: 'ข้าวไข่ข้น',                kcal: 380, protein: 12, carbs: 52, fat: 14, emoji: '🥚', portion: '1 จาน' },
  { name: 'ข้าวสุกี้',                 kcal: 430, protein: 18, carbs: 56, fat: 14, emoji: '🍲', portion: '1 จาน' },

  // ── อาหารตามสั่ง: ยำ (เพิ่มเติม) ─────────────────────
  { name: 'ยำเนื้อ',                   kcal: 260, protein: 22, carbs: 14, fat: 14, emoji: '🥩', portion: '1 จาน' },
  { name: 'ยำไก่สับ',                  kcal: 220, protein: 20, carbs: 12, fat: 12, emoji: '🍗', portion: '1 จาน' },
  { name: 'ยำมะม่วง',                  kcal: 180, protein: 8,  carbs: 22, fat: 8,  emoji: '🥭', portion: '1 จาน' },
  { name: 'ยำถั่วพู',                  kcal: 160, protein: 8,  carbs: 18, fat: 6,  emoji: '🫘', portion: '1 จาน' },
  { name: 'ยำเห็ด',                    kcal: 140, protein: 6,  carbs: 16, fat: 6,  emoji: '🍄', portion: '1 จาน' },
  { name: 'ยำปลากระป๋อง',              kcal: 200, protein: 16, carbs: 12, fat: 10, emoji: '🥫', portion: '1 จาน' },
  { name: 'ยำส้มโอ',                   kcal: 190, protein: 8,  carbs: 24, fat: 8,  emoji: '🍊', portion: '1 จาน' },
  { name: 'ยำเกาหลีหมู',               kcal: 280, protein: 18, carbs: 20, fat: 14, emoji: '🌶️', portion: '1 จาน' },
];
