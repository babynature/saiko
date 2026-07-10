// modules/nutritionGuideModule.js — Science-based nutrition guide

class NutritionGuideModule {
  constructor() {
    this._open = false;
    this._tab  = 'macros';
  }

  _wt() {
    try { return parseFloat(characterModule.get('weightKg')) || 60; } catch { return 60; }
  }

  _macros() {
    try { return hungerModule.getMacroTotals(); } catch { return { protein: 0, carbs: 0, fat: 0 }; }
  }

  _targets(wt) {
    return {
      wt,
      pMin: Math.round(wt * 1.6),   pMax: Math.round(wt * 2.2),
      cMin: Math.round(wt * 3),     cMax: Math.round(wt * 5),
      fMin: Math.round(wt * 0.7),   fMax: Math.round(wt * 1.5),
      hydL: (wt * 0.035).toFixed(1),
      prePre1h:  Math.round(wt * 1),
      prePre2h:  Math.round(wt * 2),
      prePre3h:  Math.round(wt * 3),
      postCarb:  Math.round(wt * 1.2),
    };
  }

  _statusTag(val, min, max) {
    if (!val) return '<span class="ng-tag ng-none">ยังไม่บันทึก</span>';
    if (val < min * 0.8) return '<span class="ng-tag ng-low">⬇ น้อยไป</span>';
    if (val > max * 1.2) return '<span class="ng-tag ng-high">⬆ มากไป</span>';
    return '<span class="ng-tag ng-ok">✓ ดี</span>';
  }

  _panelMacros(t, m) {
    const { wt, pMin, pMax, cMin, cMax, fMin, fMax, hydL } = t;
    const esc = s => String(s).replace(/[<>"'&]/g, c => ({'<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','&':'&amp;'}[c]));
    return `
      <div class="ng-panel" id="ng-p-macros">
        <p class="ng-intro">เป้าหมายสารอาหารที่คำนวณจาก<strong>น้ำหนักของคุณ ${esc(wt)} กก.</strong></p>

        <div class="ng-mcard ng-mp">
          <div class="ng-micon">🥩</div>
          <div class="ng-minfo">
            <div class="ng-mname">โปรตีน</div>
            <div class="ng-mrange">${pMin}–${pMax} g/วัน</div>
            <div class="ng-mnote">1.6–2.2 g × น้ำหนัก 1 กก.</div>
            <div class="ng-mtoday">วันนี้ ${m.protein}g ${this._statusTag(m.protein, pMin, pMax)}</div>
          </div>
        </div>

        <div class="ng-mcard ng-mc">
          <div class="ng-micon">🍞</div>
          <div class="ng-minfo">
            <div class="ng-mname">คาร์โบไฮเดรต</div>
            <div class="ng-mrange">${cMin}–${cMax} g/วัน</div>
            <div class="ng-mnote">3–5 g × น้ำหนัก 1 กก.</div>
            <div class="ng-mtoday">วันนี้ ${m.carbs}g ${this._statusTag(m.carbs, cMin, cMax)}</div>
          </div>
        </div>

        <div class="ng-mcard ng-mf">
          <div class="ng-micon">🥑</div>
          <div class="ng-minfo">
            <div class="ng-mname">ไขมันดี</div>
            <div class="ng-mrange">${fMin}–${fMax} g/วัน</div>
            <div class="ng-mnote">0.7–1.5 g × น้ำหนัก 1 กก.</div>
            <div class="ng-mtoday">วันนี้ ${m.fat}g ${this._statusTag(m.fat, fMin, fMax)}</div>
          </div>
        </div>

        <div class="ng-hydcard">
          <span style="font-size:2rem">💧</span>
          <div>
            <div style="font-weight:700;color:#38bdf8">น้ำที่แนะนำต่อวัน</div>
            <div style="font-size:1.1rem;font-weight:700;color:#e2e8f0">${hydL} ลิตร</div>
            <div style="font-size:.75rem;color:#64748b">น้ำหนัก ${wt} กก. × 35 มล.</div>
          </div>
        </div>

        <div class="ng-science-note">📚 อ้างอิง: Aragon (2022) Flexible Dieting · Clark (2020) Sports Nutrition Guidebook 6th ed.</div>
      </div>`;
  }

  _panelWorkout(t) {
    const { wt, prePre1h, prePre2h, prePre3h, postCarb } = t;
    return `
      <div class="ng-panel" id="ng-p-workout" style="display:none">
        <p class="ng-intro">กินถูกเวลา = ออกกำลังได้หนักขึ้น และฟื้นฟูเร็วขึ้น</p>

        <div class="ng-tw-header ng-before">⏰ ก่อนออกกำลังกาย</div>

        <div class="ng-tw-row">
          <div class="ng-tw-time">3–4 ชม. ก่อน</div>
          <div>
            <div class="ng-tw-title">มื้อหลัก</div>
            <div class="ng-tw-food">ข้าว + ไก่ + ผัก — คาร์บ ~${prePre3h}g<br><small>ช่วยเติมไกลโคเจนสำรอง</small></div>
          </div>
        </div>

        <div class="ng-tw-row">
          <div class="ng-tw-time">1–2 ชม. ก่อน</div>
          <div>
            <div class="ng-tw-title">ของว่างคาร์บสูง</div>
            <div class="ng-tw-food">กล้วย + โอ๊ตมีล — คาร์บ ~${prePre2h}g<br><small>ย่อยง่าย ไม่อึ้งท้อง</small></div>
          </div>
        </div>

        <div class="ng-tw-row">
          <div class="ng-tw-time">5–60 นาที ก่อน</div>
          <div>
            <div class="ng-tw-title">ของว่างเบาๆ</div>
            <div class="ng-tw-food">กล้วย 1 ลูก / โอ๊ตมีล 1 ถ้วย — คาร์บ ~${prePre1h}g</div>
          </div>
        </div>

        <div class="ng-tw-header ng-during">🏃 ระหว่างออกกำลัง (นาน &gt; 60 นาที)</div>

        <div class="ng-tw-row">
          <div class="ng-tw-time">ทุก 15–20 นาที</div>
          <div>
            <div class="ng-tw-title">ดื่มน้ำ</div>
            <div class="ng-tw-food">240 มล. (1 แก้วใหญ่)<br><small>ลดปัญหาท้องเสียและตะคริว</small></div>
          </div>
        </div>

        <div class="ng-tw-header ng-after">✅ หลังออกกำลังกาย</div>

        <div class="ng-tw-row">
          <div class="ng-tw-time">ภายใน 30 นาที</div>
          <div>
            <div class="ng-tw-title">โปรตีน + คาร์บ</div>
            <div class="ng-tw-food">โปรตีน 20–30g + คาร์บ ~${postCarb}g<br><small>นมช็อกโกแลต, ข้าว + ไก่ต้ม, โปรตีนเชค</small></div>
          </div>
        </div>

        <div class="ng-tw-row">
          <div class="ng-tw-time">2–4 ชม. หลัง</div>
          <div>
            <div class="ng-tw-title">มื้อฟื้นฟู</div>
            <div class="ng-tw-food">โปรตีนคุณภาพ + คาร์บเชิงซ้อน<br><small>ปลาอบ + มันฝรั่งต้ม + ผัก หรือ ข้าวกล้อง + เนื้อสัตว์</small></div>
          </div>
        </div>

        <div class="ng-science-note">📚 อ้างอิง: Clark (2020) Table 9.1–9.2 · ACSM Guidelines 2016</div>
      </div>`;
  }

  _panelTips() {
    const tips = [
      { icon: '⚖️', title: 'ไดเอทแบบยืดหยุ่น ดีกว่าแบบเคร่งครัด',
        body: 'งานวิจัยพบว่าการงดอาหารบางชนิดอย่างเด็ดขาด (rigid dieting) มักทำให้กินมากเกินไปในภายหลัง แนวคิด "กินได้ทุกอย่างในปริมาณที่เหมาะสม" ช่วยรักษาน้ำหนักในระยะยาวได้ดีกว่า' },
      { icon: '🥩', title: 'กระจายโปรตีน 4 มื้อ ดีกว่ากินทีเดียวเยอะ',
        body: 'กินโปรตีน 20–30g ต่อมื้อ × 4 มื้อ ดีกว่ากิน 80g มื้อเดียว เพราะกล้ามเนื้อสามารถใช้โปรตีนได้จำกัดต่อมื้อ การแจกจ่ายทำให้สร้างกล้ามเนื้อได้ตลอดวัน' },
      { icon: '🍞', title: 'คาร์บคือเชื้อเพลิงของกล้ามเนื้อ ไม่ใช่ศัตรู',
        body: 'นักกีฬาที่กินคาร์บก่อนออกกำลัง สามารถออกแรงได้หนักขึ้น ~15% เมื่อเทียบกับกลุ่มที่อดอาหาร ร่างกายใช้ไกลโคเจน (คาร์บสำรอง) เป็นพลังงานหลักระหว่างออกกำลัง' },
      { icon: '💪', title: 'ลดน้ำหนักขณะนอน ไม่ใช่ขณะออกกำลัง',
        body: 'สร้าง calorie deficit ตอนกลางคืน ดีกว่าอดอาหารก่อนออกกำลังกาย เพราะการอดอาหารก่อนออกกำลังทำให้ออกแรงได้น้อยลง เผาผลาญได้น้อยลงด้วย' },
      { icon: '🔄', title: 'โปรตีนช่วยรักษากล้ามเนื้อตอนลดน้ำหนัก',
        body: 'ในช่วงลดน้ำหนัก ควรเพิ่มโปรตีนเป็น 2.2–2.4 g/kg เพื่อป้องกันสูญเสียกล้ามเนื้อแม้กินแคลอรี่น้อย เพราะโปรตีนช่วยบอก "ให้ร่างกายเผาไขมัน ไม่ใช่กล้ามเนื้อ"' },
      { icon: '💧', title: 'ขาดน้ำเพียง 2% ทำให้ฟอร์มตก',
        body: 'ขาดน้ำแม้แค่ 2% ส่งผลให้ประสิทธิภาพออกกำลังลดลงอย่างเห็นได้ชัด และเพิ่มความเสี่ยงต่อปัญหาทางเดินอาหาร ควรดื่มน้ำ 240 มล. ทุก 15–20 นาทีขณะออกกำลัง' },
      { icon: '🌿', title: 'โปรตีนจากพืช ก็สร้างกล้ามเนื้อได้เมื่อกินพอ',
        body: 'งานวิจัยพบว่า vegan ที่กินโปรตีนครบ 1.6 g/kg ต่อวัน สามารถสร้างกล้ามเนื้อได้เทียบเท่ากับผู้ที่กินเนื้อสัตว์ ถั่ว เต้าหู้ เทมเป้ และถั่วเหลืองคือแหล่งโปรตีนพืชที่ดี' },
      { icon: '🍌', title: 'กินคาร์บก่อนออกกำลัง แม้แต่กล้วย 1 ลูก ก็ช่วยได้',
        body: 'การกินอาหารเบาๆ 5–60 นาทีก่อนออกกำลัง เช่น กล้วย 1 ลูก ช่วยเพิ่มระยะเวลาออกกำลังได้ ~25% เมื่อเทียบกับการอดอาหาร (Schabort et al. 1999)' },
    ];

    return `
      <div class="ng-panel" id="ng-p-tips" style="display:none">
        <p class="ng-intro">เคล็ดลับจากงานวิจัยด้านโภชนาการกีฬา อธิบายให้เข้าใจง่าย</p>
        ${tips.map(tp => `
          <div class="ng-tipcard">
            <div class="ng-tipicon">${tp.icon}</div>
            <div>
              <div class="ng-tiptitle">${tp.title}</div>
              <div class="ng-tiptext">${tp.body}</div>
            </div>
          </div>`).join('')}
        <div class="ng-science-note">📚 อ้างอิง: Aragon (2022) Flexible Dieting · Clark (2020) Sports Nutrition Guidebook 6th ed.</div>
      </div>`;
  }

  _panelBurnScience() {
    const cards = [
      {
        icon: '🔥', color: '#f97316', bg: 'rgba(249,115,22,.1)',
        title: 'ออกกำลังกาย ≠ เผาผลาญมากขึ้น',
        subtitle: 'Constrained Energy Expenditure',
        body: 'งานวิจัยในชนเผ่า Hadza แทนซาเนีย พบว่าคนล่าสัตว์ที่เดิน 16,000 ก้าว/วัน ใช้พลังงานรวมต่อวัน <strong>เท่ากับ</strong>คนนั่งโต๊ะในเมือง เพราะร่างกายปรับลดการใช้พลังงานส่วนอื่น (การอักเสบ ฮอร์โมน) เพื่อชดเชย นี่คือ "การเผาผลาญแบบจำกัด" (Constrained Total Energy Expenditure)',
        source: 'Pontzer et al. (2012) PLOS ONE · Pontzer "Burn" (2021)'
      },
      {
        icon: '🏃', color: '#22c55e', bg: 'rgba(34,197,94,.1)',
        title: 'ออกกำลังกาย = สุขภาพดี ไม่ใช่ลดน้ำหนัก',
        subtitle: 'Exercise Benefits Beyond Calories',
        body: 'เมื่อออกกำลังกายสม่ำเสมอ ร่างกายจัดสรรพลังงานใหม่: <br>• ลดการอักเสบเรื้อรัง (ลดเสี่ยงมะเร็ง โรคหัวใจ เบาหวาน)<br>• ลดการตอบสนองต่อความเครียด (cortisol ลด 30%)<br>• ลดฮอร์โมนสืบพันธุ์เกิน (ลดเสี่ยงมะเร็งเต้านม/ต่อมลูกหมาก)<br>• ช่วย<strong>รักษาน้ำหนัก</strong>หลังลดได้ แต่ไม่ค่อยช่วยลดน้ำหนักอย่างเดียว',
        source: 'Pontzer "Burn" Ch.7 · Hackney et al. (2012)'
      },
      {
        icon: '💨', color: '#38bdf8', bg: 'rgba(56,189,248,.1)',
        title: 'ไขมันหายไปไหน?',
        subtitle: 'Fat Is Exhaled as CO₂',
        body: 'เมื่อร่างกาย "เผา" ไขมัน 10 กก. จะกลายเป็น:<br>• CO₂ 8.4 กก. — <strong>หายใจออก</strong>ทิ้ง<br>• H₂O 1.6 กก. — ออกมาทางเหงื่อ ปัสสาวะ<br><br>ไขมันไม่ได้เปลี่ยนเป็นความร้อนหรือกล้ามเนื้อโดยตรง ปอดคือ "อวัยวะลดน้ำหนัก" หลักของร่างกาย',
        source: 'Meerman & Brown (2014) BMJ'
      },
      {
        icon: '📊', color: '#a78bfa', bg: 'rgba(167,139,250,.1)',
        title: 'คาลอรี่จริงๆ ต่อวัน',
        subtitle: 'Real Daily Calorie Needs',
        body: 'ฉลากอาหารบอก 2,000 แคล แต่ <strong>ผู้ใหญ่ส่วนใหญ่ใช้พลังงาน 2,500–3,000 แคล/วัน</strong><br>• ผู้ชายเฉลี่ย: ~3,000 แคล<br>• ผู้หญิงเฉลี่ย: ~2,400 แคล<br>• ค่า 2,000 แคลเป็นตัวเลขกลมๆ สำหรับฉลาก ไม่ใช่ค่าวิทยาศาสตร์<br>• ความแตกต่างระหว่างบุคคลสูงถึง ±500 แคล/วัน',
        source: 'Pontzer et al. Doubly-Labeled Water Database (2021)'
      },
      {
        icon: '🦧', color: '#fbbf24', bg: 'rgba(251,191,36,.1)',
        title: 'มาตรฐานก้าวเดิน 3 ระดับ',
        subtitle: 'Steps Benchmark: Chimp → Human → Hadza',
        body: '• 🦧 <strong>5,000 ก้าว</strong> — ระดับลิงชิมแปนซี (นั่งเฉยเกินไป → ควบคุมความหิวผิดปกติ)<br>• 👟 <strong>10,000 ก้าว</strong> — ขั้นต่ำ CDC แนะนำ<br>• 🏹 <strong>16,000 ก้าว</strong> — ระดับ Hadza (สุขภาพดีที่สุด ลดเสี่ยงตายได้ 80%)<br><br>คนอเมริกันเฉลี่ย ~5,000 ก้าว/วัน — เหมือนชิมแปนซี!',
        source: 'Pontzer et al. (2012) · Glasgow postal workers study (2017)'
      },
      {
        icon: '🪑', color: '#ef4444', bg: 'rgba(239,68,68,.1)',
        title: 'นั่งนาน = อันตรายต่อสุขภาพ',
        subtitle: 'Sedentary Behavior Disrupts Hunger',
        body: 'การนั่งนานมากๆ (>8 ชม./วัน) ทำให้สมองควบคุมความหิวผิดปกติ ส่งผลให้กินเกิน แม้ไม่รู้ตัว<br><br>งานวิจัยโรงงานอินเดียพบว่าคนนั่งเฉยที่สุด <strong>หนักกว่าคนงานทั่วไป 22 กก.</strong> แม้จะกินอาหารปริมาณใกล้เคียงกัน<br><br>การเดินสั้นๆ ทุก 30 นาทีช่วยได้มาก',
        source: 'Mayer et al. (1956) · Pontzer "Burn" Ch.7'
      },
      {
        icon: '⚠️', color: '#f59e0b', bg: 'rgba(245,158,11,.1)',
        title: 'ระวัง! อดอาหารหนักทำ BMR ลดถาวร',
        subtitle: 'Metabolic Adaptation Warning',
        body: 'นักแข่ง The Biggest Loser ที่ลดน้ำหนักได้ 57 กก. พบว่า:<br>• BMR ลดลง <strong>700 แคล/วัน</strong> (25%)<br>• ผ่านไป <strong>6 ปี BMR ยังต่ำกว่าปกติ</strong><br>• 13 ใน 14 คนน้ำหนักกลับขึ้นมา<br><br>ลดน้ำหนักอย่างปลอดภัย: ขาดดุลไม่เกิน 500 แคล/วัน และออกกำลังกายควบคู่',
        source: 'Hall et al. (2016) Obesity · Pontzer "Burn" Ch.5'
      },
      {
        icon: '🥗', color: '#4ade80', bg: 'rgba(74,222,128,.1)',
        title: 'อาหารสำคัญกว่าออกกำลังกาย สำหรับลดน้ำหนัก',
        subtitle: 'Diet vs Exercise for Weight Loss',
        body: 'งานวิจัย DIETFITS (609 คน, 12 เดือน) พบว่า:<br>• ทุกไดเอทที่ทำให้กินน้อยลง ลดน้ำหนักได้เท่ากัน<br>• Low-carb = Low-fat ในแง่น้ำหนัก<br><br><strong>สูตรง่ายๆ:</strong> ลดน้ำหนัก = ควบคุมอาหาร | รักษาน้ำหนัก = ออกกำลังกาย | สุขภาพดี = ทั้งคู่',
        source: 'Gardner et al. DIETFITS (2018) JAMA · Pontzer "Burn" Ch.6'
      },
    ];

    return `
      <div class="ng-panel" id="ng-p-burn" style="display:none">
        <p class="ng-intro">งานวิจัยใหม่จาก <strong>Herman Pontzer, PhD</strong> (Duke University) และทีมวิจัยทั่วโลก เปลี่ยนความเข้าใจเรื่องการเผาผลาญและสุขภาพ</p>
        ${cards.map(c => `
          <div class="ng-burncard" style="border-left-color:${c.color};background:${c.bg}">
            <div class="ng-burnhead">
              <span class="ng-burnicon">${c.icon}</span>
              <div>
                <div class="ng-burntitle">${c.title}</div>
                <div class="ng-burnsub">${c.subtitle}</div>
              </div>
            </div>
            <div class="ng-burnbody">${c.body}</div>
            <div class="ng-burnsource">📚 ${c.source}</div>
          </div>`).join('')}
      </div>`;
  }

  _injectCSS() {
    if (document.getElementById('ng-style')) return;
    const s = document.createElement('style');
    s.id = 'ng-style';
    s.textContent = `
      #ng-overlay{position:fixed;inset:0;background:rgba(0,0,0,.72);z-index:1000;display:flex;align-items:flex-end}
      .ng-sheet{background:#1e1e2e;border-radius:20px 20px 0 0;width:100%;max-height:88vh;overflow-y:auto;padding:20px 16px 32px}
      .ng-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
      .ng-head-title{font-size:1.05rem;font-weight:700;color:#e2e8f0}
      .ng-x{background:none;border:none;font-size:1.4rem;cursor:pointer;color:#94a3b8;line-height:1;padding:4px 8px}
      .ng-tabs{display:flex;gap:6px;margin-bottom:14px}
      .ng-tbtn{flex:1;padding:8px 6px;border-radius:10px;border:1px solid #334155;background:#0f172a;color:#94a3b8;font-size:.78rem;cursor:pointer;font-weight:600}
      .ng-tbtn.active{background:#3b82f6;border-color:#3b82f6;color:#fff}
      .ng-intro{color:#94a3b8;font-size:.83rem;margin-bottom:14px;line-height:1.55}
      .ng-intro strong{color:#cbd5e1}
      .ng-mcard{display:flex;gap:10px;background:#0f172a;border-radius:12px;padding:12px 14px;margin-bottom:10px;border-left:4px solid #334155}
      .ng-mp{border-left-color:#38bdf8}
      .ng-mc{border-left-color:#fbbf24}
      .ng-mf{border-left-color:#f87171}
      .ng-micon{font-size:1.5rem;padding-top:2px}
      .ng-mname{font-size:.9rem;font-weight:700;color:#e2e8f0}
      .ng-mrange{font-size:1.05rem;font-weight:700;color:#60a5fa;margin:2px 0}
      .ng-mnote{font-size:.72rem;color:#64748b}
      .ng-mtoday{font-size:.78rem;color:#94a3b8;margin-top:5px}
      .ng-tag{font-size:.7rem;padding:2px 7px;border-radius:6px;font-weight:600}
      .ng-ok{background:rgba(34,197,94,.2);color:#4ade80}
      .ng-low{background:rgba(251,191,36,.2);color:#fbbf24}
      .ng-high{background:rgba(248,113,113,.2);color:#f87171}
      .ng-none{background:rgba(100,116,139,.2);color:#94a3b8}
      .ng-hydcard{display:flex;gap:12px;align-items:center;background:rgba(56,189,248,.1);border:1px solid rgba(56,189,248,.3);border-radius:12px;padding:12px 14px;margin-top:4px}
      .ng-science-note{font-size:.7rem;color:#475569;margin-top:16px;padding:8px 12px;background:#0f172a;border-radius:8px;line-height:1.5}
      .ng-tw-header{font-size:.83rem;font-weight:700;padding:6px 12px;border-radius:8px;margin:10px 0 6px}
      .ng-before{background:rgba(251,191,36,.12);color:#fbbf24}
      .ng-during{background:rgba(56,189,248,.12);color:#38bdf8}
      .ng-after{background:rgba(34,197,94,.12);color:#4ade80}
      .ng-tw-row{display:flex;gap:10px;background:#0f172a;border-radius:10px;padding:10px 12px;margin-bottom:6px}
      .ng-tw-time{font-size:.72rem;color:#64748b;min-width:76px;padding-top:3px;flex-shrink:0}
      .ng-tw-title{font-size:.88rem;font-weight:600;color:#e2e8f0}
      .ng-tw-food{font-size:.78rem;color:#94a3b8;margin-top:2px;line-height:1.5}
      .ng-tipcard{display:flex;gap:12px;background:#0f172a;border-radius:12px;padding:12px 14px;margin-bottom:10px}
      .ng-tipicon{font-size:1.4rem;flex-shrink:0;padding-top:2px}
      .ng-tiptitle{font-size:.88rem;font-weight:700;color:#e2e8f0;margin-bottom:3px}
      .ng-tiptext{font-size:.78rem;color:#94a3b8;line-height:1.55}
      .ng-burncard{border-radius:14px;padding:14px;margin-bottom:12px;border-left:4px solid #6c63ff}
      .ng-burnhead{display:flex;gap:10px;align-items:flex-start;margin-bottom:8px}
      .ng-burnicon{font-size:1.6rem;flex-shrink:0;line-height:1.2}
      .ng-burntitle{font-size:.92rem;font-weight:700;color:#e2e8f0;line-height:1.3}
      .ng-burnsub{font-size:.7rem;color:#64748b;margin-top:2px;font-style:italic}
      .ng-burnbody{font-size:.79rem;color:#94a3b8;line-height:1.65;margin-bottom:8px}
      .ng-burnbody strong{color:#cbd5e1}
      .ng-burnsource{font-size:.67rem;color:#475569;background:rgba(0,0,0,.2);border-radius:6px;padding:4px 8px;line-height:1.5}
    `;
    document.head.appendChild(s);
  }

  switchTab(tab) {
    this._tab = tab;
    document.querySelectorAll('.ng-tbtn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    ['macros','workout','tips','burn'].forEach(id => {
      const p = document.getElementById('ng-p-' + id);
      if (p) p.style.display = id === tab ? '' : 'none';
    });
  }

  openModal() {
    if (this._open) return;
    this._open = true;
    this._tab = 'macros';
    this._injectCSS();

    const wt = this._wt();
    const m  = this._macros();
    const t  = this._targets(wt);

    const wrap = document.createElement('div');
    wrap.id = 'ng-overlay';
    wrap.onclick = e => { if (e.target === wrap) this.closeModal(); };
    wrap.innerHTML = `
      <div class="ng-sheet">
        <div class="ng-head">
          <div class="ng-head-title">📖 คู่มือโภชนาการ</div>
          <button class="ng-x" onclick="nutritionGuideModule.closeModal()">✕</button>
        </div>
        <div class="ng-tabs" style="flex-wrap:wrap;gap:5px">
          <button class="ng-tbtn active" data-tab="macros" onclick="nutritionGuideModule.switchTab('macros')">🎯 เป้าหมาย</button>
          <button class="ng-tbtn" data-tab="workout" onclick="nutritionGuideModule.switchTab('workout')">🏃 ก่อน/หลัง</button>
          <button class="ng-tbtn" data-tab="tips" onclick="nutritionGuideModule.switchTab('tips')">💡 เคล็ดลับ</button>
          <button class="ng-tbtn" data-tab="burn" onclick="nutritionGuideModule.switchTab('burn')">🔬 วิทยาศาสตร์</button>
        </div>
        ${this._panelMacros(t, m)}
        ${this._panelWorkout(t)}
        ${this._panelTips()}
        ${this._panelBurnScience()}
      </div>`;
    document.body.appendChild(wrap);
  }

  closeModal() {
    const el = document.getElementById('ng-overlay');
    if (el) el.remove();
    this._open = false;
  }
}

window.nutritionGuideModule = new NutritionGuideModule();
