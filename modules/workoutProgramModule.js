// modules/workoutProgramModule.js — Science-based Workout Programs
// Programs derived from "Science of Strength Training" by Austin Current BSc, CSCS

window.workoutProgramModule = (function () {

  // ─── Program metadata ────────────────────────────────────────────
  const META = {
    muscle_beginner:    { label: 'สร้างกล้ามเนื้อ', level: 'ผู้เริ่มต้น', icon: '💪', goal: 'muscle' },
    muscle_advanced:    { label: 'สร้างกล้ามเนื้อ', level: 'ขั้นสูง',     icon: '💪', goal: 'muscle' },
    strength_beginner:  { label: 'เพิ่มความแข็งแรง', level: 'ผู้เริ่มต้น', icon: '⚡', goal: 'strength' },
    strength_advanced:  { label: 'เพิ่มความแข็งแรง', level: 'ขั้นสูง',     icon: '⚡', goal: 'strength' },
    endurance_beginner: { label: 'ความอึด',           level: 'ผู้เริ่มต้น', icon: '🏃', goal: 'endurance' },
    endurance_advanced: { label: 'ความอึด',           level: 'ขั้นสูง',     icon: '🏃', goal: 'endurance' },
  };

  // ─── Workout data ────────────────────────────────────────────────
  // Each entry: { n: thaiName, s: sets, r: repsOrDuration, note?: 'warm-up' }
  const W = {

    muscle_beginner: {
      params: '4 เซต × 8–10 ครั้ง | พัก 60–90 วิ | 3–4 RIR | Controlled',
      3: [
        { name: 'วันที่ 1 — ทั้งตัว', exs: [
          { n: 'สควอท / เลกเพรส', s: 4, r: '8–10' },
          { n: 'เลกเคิร์ล', s: 4, r: '8–10' },
          { n: 'เบนช์เพรส / พุชอัพ', s: 4, r: '8–10' },
          { n: 'แลทพูลดาวน์ / พูลอัพ', s: 4, r: '8–10' },
          { n: 'เพรสไหล่', s: 4, r: '8–10' },
          { n: 'แพลงค์ + หมุน', s: 4, r: '8–10' },
        ]},
        { name: 'วันที่ 2 — ทั้งตัว', exs: [
          { n: 'บาร์เบลเบนช์เพรส', s: 4, r: '8–10' },
          { n: 'โรมาเนียนเดดลิฟท์', s: 4, r: '8–10' },
          { n: 'โรว์แนวนอน', s: 4, r: '8–10' },
          { n: 'เพรสไหล่', s: 4, r: '8–10' },
          { n: 'เลกเอ็กซ์เทนชัน', s: 4, r: '8–10' },
          { n: 'ครันช์', s: 4, r: '8–10' },
        ]},
        { name: 'วันที่ 3 — ทั้งตัว', exs: [
          { n: 'เดดลิฟท์ / สเต็ปอัพ', s: 4, r: '8–10' },
          { n: 'แลทพูลดาวน์ / ชินอัพ', s: 4, r: '8–10' },
          { n: 'เชสต์ฟลาย', s: 4, r: '8–10' },
          { n: 'เลกเคิร์ล', s: 4, r: '8–10' },
          { n: 'เพรสไหล่', s: 4, r: '8–10' },
          { n: 'เคเบิลทวิสต์', s: 4, r: '8–10' },
        ]},
      ],
      4: [
        { name: 'วันที่ 1 — อก/ขา', exs: [
          { n: 'บาร์เบลเบนช์เพรส', s: 4, r: '8–10' },
          { n: 'เลกเพรส', s: 4, r: '8–10' },
          { n: 'ทรายเซปส์พุชดาวน์', s: 4, r: '8–10' },
          { n: 'เลทเทอรัลเรซ', s: 4, r: '8–10' },
          { n: 'เคเบิลครันช์', s: 4, r: '8–10' },
        ]},
        { name: 'วันที่ 2 — หลัง/ขา', exs: [
          { n: 'แลทพูลดาวน์ / ชินอัพ', s: 4, r: '8–10' },
          { n: 'เลกเคิร์ล', s: 4, r: '8–10' },
          { n: 'กลูตบริดจ์', s: 4, r: '8–10' },
          { n: 'ไบเซปส์เคิร์ล', s: 4, r: '8–10' },
          { n: 'เลกเอ็กซ์เทนชัน', s: 4, r: '8–10' },
        ]},
        { name: 'วันที่ 3 — ไหล่/แกนกลาง', exs: [
          { n: 'แคล์ฟเรซ', s: 4, r: '8–10' },
          { n: 'เชสต์ฟลาย', s: 4, r: '8–10' },
          { n: 'ทรายเซปส์เอ็กซ์เทนชัน', s: 4, r: '8–10' },
          { n: 'เพรสไหล่', s: 4, r: '8–10' },
          { n: 'เคเบิลทวิสต์', s: 4, r: '8–10' },
        ]},
        { name: 'วันที่ 4 — หลัง/ขา', exs: [
          { n: 'โรว์แนวนอน', s: 4, r: '8–10' },
          { n: 'โรมาเนียนเดดลิฟท์', s: 4, r: '8–10' },
          { n: 'กลูตบริดจ์', s: 4, r: '8–10' },
          { n: 'ไบเซปส์เคิร์ล', s: 4, r: '8–10' },
          { n: 'แคล์ฟเรซ', s: 4, r: '8–10' },
        ]},
      ],
      5: [
        { name: 'วันที่ 1 — อก/หลัง/แขน', exs: [
          { n: 'อินไคลน์เบนช์เพรส', s: 4, r: '8–10' },
          { n: 'แลทพูลดาวน์', s: 4, r: '8–10' },
          { n: 'เรียร์เดลท์ฟลาย', s: 4, r: '8–10' },
          { n: 'ไบเซปส์เคิร์ล', s: 4, r: '8–10' },
          { n: 'ทรายเซปส์พุชดาวน์', s: 4, r: '8–10' },
          { n: 'เคเบิลครันช์', s: 4, r: '8–10' },
        ]},
        { name: 'วันที่ 2 — ขาล่าง', exs: [
          { n: 'โรมาเนียนเดดลิฟท์', s: 4, r: '8–10' },
          { n: 'แฮกสควอท', s: 3, r: '8–10' },
          { n: 'กลูตบริดจ์', s: 4, r: '8–10' },
          { n: 'เลกเคิร์ล', s: 4, r: '8–10' },
          { n: 'เลกเอ็กซ์เทนชัน', s: 3, r: '8–10' },
          { n: 'แคล์ฟเรซ', s: 4, r: '8–10' },
        ]},
        { name: 'วันที่ 3 — ไหล่/แขน', exs: [
          { n: 'เพรสไหล่', s: 4, r: '8–10' },
          { n: 'เลทเทอรัลเรซ', s: 4, r: '8–10' },
          { n: 'ไบเซปส์เคิร์ล', s: 4, r: '8–10' },
          { n: 'ทรายเซปส์พุชดาวน์', s: 4, r: '8–10' },
          { n: 'เคเบิลทวิสต์', s: 4, r: '8–10' },
        ]},
        { name: 'วันที่ 4 — หลัง/อก', exs: [
          { n: 'โรว์แนวนอน', s: 4, r: '8–10' },
          { n: 'แลทพูลดาวน์', s: 4, r: '8–10' },
          { n: 'เบนช์เพรส / พุชอัพ', s: 3, r: '8–10' },
          { n: 'เบนท์โอเวอร์โรว์', s: 4, r: '8–10' },
        ]},
        { name: 'วันที่ 5 — ขาล่าง', exs: [
          { n: 'เลกเพรส / สควอท', s: 4, r: '8–10' },
          { n: 'เลกเอ็กซ์เทนชัน', s: 4, r: '8–10' },
          { n: 'เลกเคิร์ล', s: 4, r: '8–10' },
          { n: 'กลูตบริดจ์', s: 4, r: '8–10' },
          { n: 'เลทเทอรัลเรซ', s: 4, r: '8–10' },
        ]},
      ],
    },

    strength_beginner: {
      params: '5 เซต × 5 ครั้ง | พัก 2–5 นาที | ★ = ท่าหลัก เพิ่มน้ำหนักทุกเซต',
      3: [
        { name: 'วันที่ 1 — อก/ไหล่', exs: [
          { n: 'เครื่องโรว์', s: 2, r: '6–8', note: 'warm-up' },
          { n: 'เครื่องเพรสไหล่', s: 2, r: '6–8', note: 'warm-up' },
          { n: 'บาร์เบลเบนช์เพรส ★', s: 5, r: '5' },
          { n: 'โอเวอร์เฮดเพรส', s: 3, r: '6' },
          { n: 'ทรายเซปส์พุชดาวน์', s: 3, r: '6' },
        ]},
        { name: 'วันที่ 2 — ขาล่าง', exs: [
          { n: 'แคล์ฟเรซ', s: 2, r: '6–8', note: 'warm-up' },
          { n: 'กลูตบริดจ์', s: 2, r: '6–8', note: 'warm-up' },
          { n: 'บาร์เบลสควอท ★', s: 5, r: '5' },
          { n: 'เลกเพรส', s: 3, r: '6' },
          { n: 'แคล์ฟเรซ', s: 3, r: '6' },
        ]},
        { name: 'วันที่ 3 — หลัง/แขน', exs: [
          { n: 'แคล์ฟเรซ', s: 2, r: '6–8', note: 'warm-up' },
          { n: 'กลูตบริดจ์', s: 2, r: '6–8', note: 'warm-up' },
          { n: 'บาร์เบลเบนท์โอเวอร์โรว์ ★', s: 5, r: '5' },
          { n: 'แลทพูลดาวน์', s: 3, r: '6' },
          { n: 'ไบเซปส์เคิร์ล', s: 3, r: '6' },
        ]},
      ],
      4: [
        { name: 'วันที่ 1 — ขาล่าง', exs: [
          { n: 'แคล์ฟเรซ', s: 2, r: '6–8', note: 'warm-up' },
          { n: 'กลูตบริดจ์', s: 2, r: '6–8', note: 'warm-up' },
          { n: 'บาร์เบลสควอท ★', s: 5, r: '5' },
          { n: 'เลกเพรส', s: 3, r: '6' },
          { n: 'เลกเอ็กซ์เทนชัน', s: 3, r: '6' },
          { n: 'แคล์ฟเรซ', s: 3, r: '6' },
        ]},
        { name: 'วันที่ 2 — อก/ไหล่', exs: [
          { n: 'เครื่องโรว์', s: 2, r: '6–8', note: 'warm-up' },
          { n: 'เครื่องเพรสไหล่', s: 2, r: '6–8', note: 'warm-up' },
          { n: 'บาร์เบลเบนช์เพรส ★', s: 5, r: '5' },
          { n: 'โอเวอร์เฮดเพรส', s: 3, r: '6' },
          { n: 'เลทเทอรัลเรซ', s: 3, r: '6' },
          { n: 'ทรายเซปส์พุชดาวน์', s: 3, r: '6' },
        ]},
        { name: 'วันที่ 3 — ขาหลัง', exs: [
          { n: 'แคล์ฟเรซ', s: 2, r: '6–8', note: 'warm-up' },
          { n: 'Walking Lunge', s: 2, r: '6–8', note: 'warm-up' },
          { n: 'โรมาเนียนเดดลิฟท์ ★', s: 5, r: '5' },
          { n: 'เลกเคิร์ล', s: 3, r: '6' },
          { n: 'กลูตบริดจ์', s: 3, r: '6' },
          { n: 'แคล์ฟเรซ', s: 3, r: '6' },
        ]},
        { name: 'วันที่ 4 — หลัง/แขน', exs: [
          { n: 'ไบเซปส์เคิร์ล', s: 2, r: '6–8', note: 'warm-up' },
          { n: 'แลทพูลดาวน์', s: 2, r: '6–8', note: 'warm-up' },
          { n: 'บาร์เบลเบนท์โอเวอร์โรว์ ★', s: 5, r: '5' },
          { n: 'แลทพูลดาวน์', s: 3, r: '6' },
          { n: 'เรียร์เดลท์เรซ', s: 3, r: '6' },
          { n: 'ไบเซปส์เคิร์ล', s: 3, r: '6' },
        ]},
      ],
      5: [
        { name: 'วันที่ 1 — ขาล่าง', exs: [
          { n: 'แคล์ฟเรซ', s: 2, r: '6–8', note: 'warm-up' },
          { n: 'กลูตบริดจ์', s: 2, r: '6–8', note: 'warm-up' },
          { n: 'บาร์เบลสควอท ★', s: 5, r: '5' },
          { n: 'เลกเพรส', s: 3, r: '6' },
          { n: 'เลกเอ็กซ์เทนชัน', s: 3, r: '6' },
          { n: 'แคล์ฟเรซ', s: 3, r: '6' },
        ]},
        { name: 'วันที่ 2 — อก/ไหล่', exs: [
          { n: 'เครื่องโรว์', s: 2, r: '6–8', note: 'warm-up' },
          { n: 'เครื่องเพรสไหล่', s: 2, r: '6–8', note: 'warm-up' },
          { n: 'บาร์เบลเบนช์เพรส ★', s: 5, r: '5' },
          { n: 'โอเวอร์เฮดเพรส', s: 3, r: '6' },
          { n: 'เลทเทอรัลเรซ', s: 3, r: '6' },
          { n: 'ทรายเซปส์พุชดาวน์', s: 3, r: '6' },
        ]},
        { name: 'วันที่ 3 — ขาหลัง', exs: [
          { n: 'แคล์ฟเรซ', s: 2, r: '6–8', note: 'warm-up' },
          { n: 'Walking Lunge', s: 2, r: '6–8', note: 'warm-up' },
          { n: 'โรมาเนียนเดดลิฟท์ ★', s: 5, r: '5' },
          { n: 'เลกเคิร์ล', s: 3, r: '6' },
          { n: 'กลูตบริดจ์', s: 3, r: '6' },
          { n: 'แคล์ฟเรซ', s: 3, r: '6' },
        ]},
        { name: 'วันที่ 4 — หลัง/แขน', exs: [
          { n: 'ไบเซปส์เคิร์ล', s: 2, r: '6–8', note: 'warm-up' },
          { n: 'แลทพูลดาวน์', s: 2, r: '6–8', note: 'warm-up' },
          { n: 'บาร์เบลเบนท์โอเวอร์โรว์ ★', s: 5, r: '5' },
          { n: 'แลทพูลดาวน์', s: 3, r: '6' },
          { n: 'เรียร์เดลท์เรซ', s: 3, r: '6' },
          { n: 'ไบเซปส์เคิร์ล', s: 3, r: '6' },
        ]},
        { name: 'วันที่ 5 — อก/ไหล่', exs: [
          { n: 'เครื่องโรว์', s: 2, r: '6–8', note: 'warm-up' },
          { n: 'เครื่องเพรสไหล่', s: 2, r: '6–8', note: 'warm-up' },
          { n: 'อินไคลน์เบนช์เพรส ★', s: 5, r: '6–8' },
          { n: 'เพรสไหล่', s: 3, r: '6–8' },
          { n: 'เลทเทอรัลเรซ', s: 3, r: '6–8' },
          { n: 'ทรายเซปส์พุชดาวน์', s: 3, r: '6–8' },
        ]},
      ],
    },

    endurance_beginner: {
      params: '3 เซต × 15–20 ครั้ง | พัก 30–45 วิ | โฟกัสความต่อเนื่อง',
      3: [
        { name: 'วันที่ 1', exs: [
          { n: 'วอร์มอัพ (เดิน/วิ่งเบา)', s: 1, r: '5–10 นาที' },
          { n: 'สควอท', s: 3, r: '15–20' },
          { n: 'พุชอัพ', s: 3, r: '15–20' },
          { n: 'โรว์แนวนอน', s: 3, r: '15–20' },
          { n: 'เลกเคิร์ล', s: 3, r: '15–20' },
          { n: 'แพลงค์', s: 3, r: '45 วิ' },
        ]},
        { name: 'วันที่ 2', exs: [
          { n: 'วอร์มอัพ (จักรยาน/ว่ายน้ำ)', s: 1, r: '5–10 นาที' },
          { n: 'เลกเพรส', s: 3, r: '15–20' },
          { n: 'อินไคลน์พุชอัพ', s: 3, r: '15–20' },
          { n: 'แลทพูลดาวน์', s: 3, r: '15–20' },
          { n: 'เพรสไหล่', s: 3, r: '15–20' },
          { n: 'ครันช์', s: 3, r: '20' },
        ]},
        { name: 'วันที่ 3', exs: [
          { n: 'HIIT / กระโดดเชือก', s: 1, r: '5 นาที' },
          { n: 'เดดลิฟท์', s: 3, r: '15–20' },
          { n: 'เคเบิลโรว์', s: 3, r: '15–20' },
          { n: 'เพรสดัมเบล', s: 3, r: '15–20' },
          { n: 'กลูตบริดจ์', s: 3, r: '15–20' },
          { n: 'Mountain Climber', s: 3, r: '20–30' },
        ]},
      ],
      4: [
        { name: 'วันที่ 1 — ขาล่าง', exs: [
          { n: 'สควอท', s: 3, r: '15–20' },
          { n: 'เลกเพรส', s: 3, r: '15–20' },
          { n: 'เลกเคิร์ล', s: 3, r: '15–20' },
          { n: 'กลูตบริดจ์', s: 3, r: '15–20' },
          { n: 'แคล์ฟเรซ', s: 4, r: '20–25' },
        ]},
        { name: 'วันที่ 2 — อก/ไหล่/แขน', exs: [
          { n: 'พุชอัพ', s: 3, r: '15–20' },
          { n: 'เบนช์เพรส', s: 3, r: '15–20' },
          { n: 'เลทเทอรัลเรซ', s: 3, r: '15–20' },
          { n: 'ไบเซปส์เคิร์ล', s: 3, r: '15–20' },
          { n: 'ทรายเซปส์ดิพ', s: 3, r: '15–20' },
        ]},
        { name: 'วันที่ 3 — หลัง/แกนกลาง', exs: [
          { n: 'แลทพูลดาวน์', s: 3, r: '15–20' },
          { n: 'โรว์แนวนอน', s: 3, r: '15–20' },
          { n: 'โรมาเนียนเดดลิฟท์', s: 3, r: '15–20' },
          { n: 'แพลงค์', s: 3, r: '60 วิ' },
          { n: 'ครันช์', s: 3, r: '20–25' },
        ]},
        { name: 'วันที่ 4 — คาร์ดิโอ', exs: [
          { n: 'วิ่ง / HIIT', s: 1, r: '20–30 นาที' },
          { n: 'กระโดดเชือก', s: 4, r: '1 นาที' },
          { n: 'Burpee', s: 3, r: '15' },
          { n: 'Mountain Climber', s: 3, r: '20' },
          { n: 'Jumping Jack', s: 3, r: '30' },
        ]},
      ],
      5: [
        { name: 'วันที่ 1 — ขาล่าง', exs: [
          { n: 'สควอท', s: 3, r: '15–20' },
          { n: 'เลกเพรส', s: 3, r: '15–20' },
          { n: 'เลกเคิร์ล', s: 3, r: '15–20' },
          { n: 'กลูตบริดจ์', s: 4, r: '15–20' },
          { n: 'แคล์ฟเรซ', s: 4, r: '20–25' },
        ]},
        { name: 'วันที่ 2 — อก/ไหล่', exs: [
          { n: 'พุชอัพ', s: 3, r: '15–20' },
          { n: 'เบนช์เพรส', s: 3, r: '15–20' },
          { n: 'อินไคลน์เพรส', s: 3, r: '15–20' },
          { n: 'เลทเทอรัลเรซ', s: 3, r: '15–20' },
          { n: 'เพรสไหล่', s: 3, r: '15–20' },
        ]},
        { name: 'วันที่ 3 — คาร์ดิโอ', exs: [
          { n: 'วิ่ง / จ็อกกิ้ง', s: 1, r: '25–30 นาที' },
          { n: 'กระโดดเชือก', s: 4, r: '1 นาที' },
          { n: 'Burpee', s: 3, r: '15' },
        ]},
        { name: 'วันที่ 4 — หลัง/แกนกลาง', exs: [
          { n: 'แลทพูลดาวน์', s: 3, r: '15–20' },
          { n: 'โรว์แนวนอน', s: 3, r: '15–20' },
          { n: 'โรมาเนียนเดดลิฟท์', s: 3, r: '15–20' },
          { n: 'แพลงค์', s: 3, r: '60 วิ' },
          { n: 'ครันช์', s: 3, r: '20–25' },
        ]},
        { name: 'วันที่ 5 — แขน/เบา', exs: [
          { n: 'ไบเซปส์เคิร์ล', s: 3, r: '15–20' },
          { n: 'ทรายเซปส์ดิพ', s: 3, r: '15–20' },
          { n: 'Mountain Climber', s: 3, r: '30' },
          { n: 'แอโรบิก / เต้นรำ', s: 1, r: '15–20 นาที' },
        ]},
      ],
    },
  };

  // Advanced programs inherit workouts, different params
  W.muscle_advanced   = Object.assign({}, W.muscle_beginner,   { params: '4–5 เซต × 6–10 ครั้ง | พัก 60–90 วิ | 2–3 RIR | tempo 3010/3011' });
  W.strength_advanced = Object.assign({}, W.strength_beginner, { params: '5 เซต × 5 ครั้ง | พัก 2–5 นาที | 2 RIR | tempo 3110' });
  W.endurance_advanced = Object.assign({}, W.endurance_beginner, { params: '4 เซต × 12–20 ครั้ง | พัก 20–30 วิ | เพิ่ม density ทุกสัปดาห์' });

  // ─── State ───────────────────────────────────────────────────────
  let _s = {
    programKey:      null,
    freq:            3,
    workoutIdx:      0,
    lastWorkoutDate: null,
    doneSets:        {},
    weekCount:       0,
    lastWeekKey:     null,
  };

  const _today = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  };

  const _weekKey = () => {
    const d = new Date(), jan1 = new Date(d.getFullYear(), 0, 1);
    return `${d.getFullYear()}-W${String(Math.ceil(((d-jan1)/86400000 + jan1.getDay() + 1) / 7)).padStart(2,'0')}`;
  };

  function toJSON()    { return { wp: { ..._s } }; }
  function fromJSON(o) { if (o && o.wp) Object.assign(_s, o.wp); }

  function getMeta()          { return META[_s.programKey] || null; }
  function getTodayWorkout()  {
    const wkts = _s.programKey && W[_s.programKey] && W[_s.programKey][_s.freq];
    return wkts ? wkts[_s.workoutIdx % wkts.length] : null;
  }
  function getParams()        { return (_s.programKey && W[_s.programKey]) ? W[_s.programKey].params : ''; }
  function getState()         { return _s; }
  function getAllMeta()       { return META; }
  function getWorkoutCount()  {
    const wkts = _s.programKey && W[_s.programKey] && W[_s.programKey][_s.freq];
    return wkts ? wkts.length : 0;
  }

  function setProgram(key, freq) {
    _s.programKey = key; _s.freq = freq;
    _s.workoutIdx = 0; _s.doneSets = {}; _s.lastWorkoutDate = null;
  }
  function clearProgram() { _s.programKey = null; _s.workoutIdx = 0; _s.doneSets = {}; }

  function toggleSet(exIdx, setIdx) {
    const k = `${exIdx}_${setIdx}`;
    _s.doneSets[k] = !_s.doneSets[k];
  }
  function isSetDone(exIdx, setIdx) { return !!_s.doneSets[`${exIdx}_${setIdx}`]; }

  function completeWorkout() {
    const wkts = W[_s.programKey] && W[_s.programKey][_s.freq];
    if (!wkts) return;
    _s.workoutIdx = (_s.workoutIdx + 1) % wkts.length;
    _s.lastWorkoutDate = _today();
    _s.doneSets = {};
    const wk = _weekKey();
    if (wk !== _s.lastWeekKey) {
      _s.weekCount = _s.lastWeekKey ? _s.weekCount + 1 : 1;
      _s.lastWeekKey = wk;
    }
  }

  function isWorkoutDoneToday() { return _s.lastWorkoutDate === _today(); }
  function isDeloadWeek()       { return _s.weekCount > 0 && _s.weekCount % 5 === 0; }

  return {
    toJSON, fromJSON,
    getMeta, getTodayWorkout, getParams, getState, getAllMeta, getWorkoutCount,
    setProgram, clearProgram,
    toggleSet, isSetDone,
    completeWorkout, isWorkoutDoneToday, isDeloadWeek,
  };
})();
