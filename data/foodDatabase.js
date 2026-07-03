// data/foodDatabase.js — Thai Food Nutrition Database (per 1 serving)
// Fields: name, kcal, protein(g), carbs(g), fat(g), emoji, portion

window.FOOD_DB = [
  // ── ข้าวจานเดียว ─────────────────────────────────
  { name: 'ข้าวสวย',             kcal: 130, protein: 3,  carbs: 29, fat: 0,  emoji: '🍚', portion: '1 ทัพพี (150g)' },
  { name: 'ข้าวผัด',             kcal: 350, protein: 12, carbs: 45, fat: 12, emoji: '🍳', portion: '1 จาน' },
  { name: 'ข้าวผัดกุ้ง',         kcal: 380, protein: 18, carbs: 45, fat: 12, emoji: '🦐', portion: '1 จาน' },
  { name: 'ข้าวมันไก่',           kcal: 420, protein: 25, carbs: 48, fat: 12, emoji: '🍗', portion: '1 จาน' },
  { name: 'ข้าวหมูแดง',           kcal: 400, protein: 22, carbs: 50, fat: 10, emoji: '🥩', portion: '1 จาน' },
  { name: 'ข้าวหน้าเป็ด',         kcal: 430, protein: 24, carbs: 50, fat: 14, emoji: '🦆', portion: '1 จาน' },
  { name: 'ข้าวกะเพรา',           kcal: 460, protein: 20, carbs: 48, fat: 18, emoji: '🌿', portion: '1 จาน' },
  { name: 'ข้าวกะเพราไก่',        kcal: 440, protein: 22, carbs: 48, fat: 16, emoji: '🌿', portion: '1 จาน' },
  { name: 'ข้าวกะเพราหมู',        kcal: 480, protein: 20, carbs: 48, fat: 20, emoji: '🌿', portion: '1 จาน' },
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

  // ── ผลไม้ ─────────────────────────────────────────
  { name: 'กล้วยหอม',             kcal: 90,  protein: 1,  carbs: 23, fat: 0,  emoji: '🍌', portion: '1 ลูก' },
  { name: 'แอปเปิ้ล',             kcal: 80,  protein: 0,  carbs: 21, fat: 0,  emoji: '🍎', portion: '1 ลูก' },
  { name: 'ส้ม',                  kcal: 60,  protein: 1,  carbs: 15, fat: 0,  emoji: '🍊', portion: '1 ลูก' },
  { name: 'มะม่วงสุก',            kcal: 100, protein: 1,  carbs: 25, fat: 0,  emoji: '🥭', portion: '1 ลูกกลาง' },
  { name: 'สับปะรด',              kcal: 80,  protein: 1,  carbs: 20, fat: 0,  emoji: '🍍', portion: '1 ถ้วย' },
  { name: 'แตงโม',                kcal: 50,  protein: 1,  carbs: 12, fat: 0,  emoji: '🍉', portion: '2 ชิ้น' },
  { name: 'ลำไย',                 kcal: 60,  protein: 1,  carbs: 15, fat: 0,  emoji: '🫐', portion: '10 ลูก' },
  { name: 'เงาะ',                 kcal: 70,  protein: 1,  carbs: 17, fat: 0,  emoji: '🍒', portion: '5 ลูก' },
  { name: 'ทุเรียน',              kcal: 200, protein: 2,  carbs: 30, fat: 8,  emoji: '🌵', portion: '2 พูเล็ก' },
  { name: 'มังคุด',               kcal: 70,  protein: 0,  carbs: 18, fat: 0,  emoji: '🟣', portion: '3 ลูก' },
  { name: 'ชมพู่',                kcal: 25,  protein: 0,  carbs: 6,  fat: 0,  emoji: '🫒', portion: '3 ลูก' },
  { name: 'มะละกอสุก',           kcal: 55,  protein: 1,  carbs: 14, fat: 0,  emoji: '🍈', portion: '1 ถ้วย' },

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
];
