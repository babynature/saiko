// modules/nutritionGuideModule.js — Science-based nutrition guide (Aragon 2022 + Flexible Dieting)

class NutritionGuideModule {
  constructor() {
    this._open = false;
    this._tab  = 'macros';
    this._planGoal      = localStorage.getItem('shg-ng-goal') || 'maintenance';
    this._planTrainHrs  = parseFloat(localStorage.getItem('shg-ng-trainhrs') || '4');
    this._planNEAT      = parseFloat(localStorage.getItem('shg-ng-neat') || '1.0');
  }

  _wt() {
    try { return parseFloat(characterModule.get('weightKg')) || 60; } catch { return 60; }
  }

  _macros() {
    try { return hungerModule.getMacroTotals(); } catch { return { protein: 0, carbs: 0, fat: 0 }; }
  }

  // Aragon formula: TBW × (10 + weekly training hours) × NEAT factor
  _aragonCalc(tbwKg, trainHrs, neat) {
    const tbwLb = tbwKg * 2.2046;
    return Math.round(tbwLb * (10 + trainHrs) * neat);
  }

  // Goal-aware targets
  _targets(wt) {
    const g = this._planGoal;
    let pMin, pMax;
    if (g === 'fat_loss') {
      pMin = Math.round(wt * 2.2); pMax = Math.round(wt * 2.4);
    } else if (g === 'muscle') {
      pMin = Math.round(wt * 1.6); pMax = Math.round(wt * 2.2);
    } else {
      pMin = Math.round(wt * 1.6); pMax = Math.round(wt * 2.0);
    }
    return {
      wt,
      pMin, pMax,
      cMin: Math.round(wt * 3),   cMax: Math.round(wt * 5),
      fMin: Math.round(wt * 0.7), fMax: Math.round(wt * 1.5),
      hydL: (wt * 0.035).toFixed(1),
      prePre1h: Math.round(wt * 1),
      prePre2h: Math.round(wt * 2),
      prePre3h: Math.round(wt * 3),
      postCarb:  Math.round(wt * 1.2),
    };
  }

  _statusTag(val, min, max) {
    if (!val) return '<span class="ng-tag ng-none">ยังไม่บันทึก</span>';
    if (val < min * 0.8) return '<span class="ng-tag ng-low">⬇ น้อยไป</span>';
    if (val > max * 1.2) return '<span class="ng-tag ng-high">⬆ มากไป</span>';
    return '<span class="ng-tag ng-ok">✓ ดี</span>';
  }

  _goalLabel(g) {
    return { fat_loss: 'ลดไขมัน', muscle: 'เพิ่มกล้ามเนื้อ', maintenance: 'รักษาน้ำหนัก', recomp: 'Recomp' }[g] || 'รักษาน้ำหนัก';
  }

  _panelMacros(t, m) {
    const { wt, pMin, pMax, cMin, cMax, fMin, fMax, hydL } = t;
    const g = this._planGoal;
    const goalColors = { fat_loss: '#ef4444', muscle: '#6c63ff', maintenance: '#22c55e', recomp: '#f59e0b' };
    const goalColor  = goalColors[g] || '#22c55e';

    // 80/20 rule — discretionary calories
    const totalKcal = (m.protein || 0) * 4 + (m.carbs || 0) * 4 + (m.fat || 0) * 9;
    const discMax   = Math.round(totalKcal * 0.2);

    // Protein per meal guidance
    const protPerMeal = (Math.round(wt * 0.45)).toString();

    return `
      <div class="ng-panel" id="ng-p-macros">
        <div class="ng-goal-badge" style="background:rgba(${goalColor === '#ef4444' ? '239,68,68' : goalColor === '#6c63ff' ? '108,99,255' : goalColor === '#22c55e' ? '34,197,94' : '245,158,11'},.15);border:1px solid ${goalColor};color:${goalColor}">
          🎯 เป้าหมาย: ${this._goalLabel(g)}
          <button onclick="nutritionGuideModule.switchTab('plan')" style="background:none;border:none;color:${goalColor};font-size:.75rem;cursor:pointer;margin-left:6px;text-decoration:underline">เปลี่ยน</button>
        </div>
        <p class="ng-intro">เป้าหมายสารอาหารจาก<strong>น้ำหนัก ${wt} กก.</strong> — อ้างอิง Alan Aragon (2022)</p>

        <div class="ng-mcard ng-mp">
          <div class="ng-micon">🥩</div>
          <div class="ng-minfo">
            <div class="ng-mname">โปรตีน ${g === 'fat_loss' ? '<span class="ng-badge-priority">สำคัญมาก</span>' : ''}</div>
            <div class="ng-mrange">${pMin}–${pMax} g/วัน</div>
            <div class="ng-mnote">${g === 'fat_loss' ? '2.2–2.4 g/kg (ป้องกันสูญเสียกล้ามเนื้อตอนลดน้ำหนัก)' : g === 'muscle' ? '1.6–2.2 g/kg — แจกจ่าย ≥4 มื้อ (${protPerMeal}g/มื้อ)' : '1.6–2.0 g/kg — แจกจ่าย ≥4 มื้อ'}</div>
            <div class="ng-mnote" style="color:#6c63ff;margin-top:3px">โปรตีนต่อมื้อที่เหมาะสม: ~${protPerMeal}g (0.4–0.55 g × ${wt}kg)</div>
            <div class="ng-mtoday">วันนี้ ${m.protein}g ${this._statusTag(m.protein, pMin, pMax)}</div>
          </div>
        </div>

        <div class="ng-mcard ng-mc">
          <div class="ng-micon">🍞</div>
          <div class="ng-minfo">
            <div class="ng-mname">คาร์โบไฮเดรต</div>
            <div class="ng-mrange">${cMin}–${cMax} g/วัน</div>
            <div class="ng-mnote">3–5 g/kg — เชื้อเพลิงกล้ามเนื้อ เติมหลังโปรตีนและไขมันครบแล้ว</div>
            <div class="ng-mtoday">วันนี้ ${m.carbs}g ${this._statusTag(m.carbs, cMin, cMax)}</div>
          </div>
        </div>

        <div class="ng-mcard ng-mf">
          <div class="ng-micon">🥑</div>
          <div class="ng-minfo">
            <div class="ng-mname">ไขมันดี</div>
            <div class="ng-mrange">${fMin}–${fMax} g/วัน</div>
            <div class="ng-mnote">0.7–1.5 g/kg — ไม่ต้องกลัวไขมัน ช่วยฮอร์โมนและดูดซึมวิตามิน</div>
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

        ${totalKcal > 0 ? `
        <div class="ng-8020card">
          <div class="ng-8020title">🍕 กฎ 80/20 — Discretionary Calories</div>
          <div class="ng-8020body">
            จาก ${totalKcal} kcal ที่กินวันนี้ — คุณมีโควต้า "กินอะไรก็ได้" ประมาณ
            <strong style="color:#fbbf24">${discMax} kcal (20%)</strong>
            สำหรับอาหารที่ชอบ ส่วนที่เหลือ 80% ควรเป็นอาหารมีคุณค่า
          </div>
        </div>` : ''}

        <div class="ng-science-note">📚 Aragon (2022) Flexible Dieting · Clark (2020) Sports Nutrition Guidebook 6th ed.</div>
      </div>`;
  }

  _panelPlan() {
    const wt = this._wt();
    const g  = this._planGoal;
    const hrs = this._planTrainHrs;
    const neat = this._planNEAT;

    const maintenanceCal = this._aragonCalc(wt, hrs, neat);
    let adjustPct = 0;
    let adjustNote = '';
    if (g === 'fat_loss')    { adjustPct = -15; adjustNote = 'ลด 15% เพื่อลดไขมัน (−' + Math.round(maintenanceCal * 0.15) + ' kcal)'; }
    if (g === 'muscle')      { adjustPct = +15; adjustNote = 'เพิ่ม 15% เพื่อเพิ่มกล้ามเนื้อ (+' + Math.round(maintenanceCal * 0.15) + ' kcal)'; }
    if (g === 'recomp')      { adjustPct = 0;   adjustNote = 'กิน Maintenance — Recomp ต้องการความสม่ำเสมอ ไม่ใช่ surplus หรือ deficit มาก'; }
    const targetCal = Math.round(maintenanceCal * (1 + adjustPct / 100));

    // Macros from target cal
    const protein = g === 'fat_loss' ? Math.round(wt * 2.3) : Math.round(wt * 1.8);
    const fat     = Math.round(wt * 1.0);
    const protKcal = protein * 4;
    const fatKcal  = fat * 9;
    const carbKcal = Math.max(0, targetCal - protKcal - fatKcal);
    const carbs    = Math.round(carbKcal / 4);

    return `
      <div class="ng-panel" id="ng-p-plan" style="display:none">
        <p class="ng-intro">คำนวณจาก <strong>Aragon Formula</strong> — สูตรที่ Alan Aragon พัฒนาขึ้นครั้งแรกใน "The Lean Muscle Diet" (2014) ปรับปรุงล่าสุดใน Flexible Dieting (2022)</p>

        <div class="ng-plan-section">
          <div class="ng-plan-label">🎯 เป้าหมาย</div>
          <div class="ng-plan-row">
            ${['fat_loss','muscle','maintenance','recomp'].map(gl => `
              <button class="ng-goal-btn ${gl === g ? 'active' : ''}" onclick="nutritionGuideModule._setGoal('${gl}')">
                ${{ fat_loss:'🔥 ลดไขมัน', muscle:'💪 เพิ่มกล้าม', maintenance:'⚖️ รักษา', recomp:'🔄 Recomp' }[gl]}
              </button>`).join('')}
          </div>
        </div>

        <div class="ng-plan-section">
          <div class="ng-plan-label">⏱ เวลาออกกำลังกายต่อสัปดาห์: <strong id="ng-hrs-val">${hrs}</strong> ชั่วโมง</div>
          <input type="range" min="0" max="15" step="0.5" value="${hrs}" class="ng-slider"
            oninput="document.getElementById('ng-hrs-val').textContent=this.value;nutritionGuideModule._setTrainHrs(parseFloat(this.value))">
          <div class="ng-plan-hint">รวมทั้ง cardio, เวทเทรน, กีฬา — ชั่วโมงออกกำลังจริงๆ</div>
        </div>

        <div class="ng-plan-section">
          <div class="ng-plan-label">🚶 ระดับ NEAT (กิจกรรมนอกเวลาออกกำลัง)</div>
          <div class="ng-plan-row" style="flex-wrap:wrap;gap:6px">
            ${[['1.0','🪑 นั่งทำงาน'],['1.1','🚶 บางครั้งเดิน'],['1.2','👷 เคลื่อนไหวมาก'],['1.4','🏗️ แรงงาน']].map(([v,l]) => `
              <button class="ng-neat-btn ${neat == v ? 'active' : ''}" onclick="nutritionGuideModule._setNEAT(${v})">
                ${l}
              </button>`).join('')}
          </div>
        </div>

        <div class="ng-plan-result">
          <div class="ng-result-formula">
            <span class="ng-formula-text">${wt} กก. (${(wt*2.2046).toFixed(0)} lbs) × (10 + ${hrs} ชม.) × ${neat}</span>
            <span class="ng-formula-eq">= ${maintenanceCal} kcal</span>
          </div>
          ${adjustNote ? `<div class="ng-result-adjust">${adjustNote}</div>` : ''}
          <div class="ng-result-total">🎯 เป้าหมายวันละ <strong>${targetCal}</strong> kcal</div>
        </div>

        <div class="ng-macro-breakdown">
          <div class="ng-macro-step">
            <div class="ng-mstep-num">①</div>
            <div class="ng-mstep-info">
              <div class="ng-mstep-label">🥩 โปรตีน (กำหนดก่อน)</div>
              <div class="ng-mstep-val">${protein}g = ${protKcal} kcal</div>
              <div class="ng-mstep-note">${g === 'fat_loss' ? '2.3 g/kg — เพิ่มเพื่อป้องกันกล้ามหายตอนลด' : '1.8 g/kg — รักษาและสร้างกล้ามเนื้อ'}</div>
            </div>
          </div>
          <div class="ng-macro-step">
            <div class="ng-mstep-num">②</div>
            <div class="ng-mstep-info">
              <div class="ng-mstep-label">🥑 ไขมัน (กำหนดที่สอง)</div>
              <div class="ng-mstep-val">${fat}g = ${fatKcal} kcal</div>
              <div class="ng-mstep-note">1.0 g/kg — ฮอร์โมน, วิตามิน, สมอง</div>
            </div>
          </div>
          <div class="ng-macro-step">
            <div class="ng-mstep-num">③</div>
            <div class="ng-mstep-info">
              <div class="ng-mstep-label">🍞 คาร์บ (เติมที่เหลือ)</div>
              <div class="ng-mstep-val">${carbs}g = ${carbKcal} kcal</div>
              <div class="ng-mstep-note">เหลือจาก ${targetCal} - ${protKcal} - ${fatKcal} kcal</div>
            </div>
          </div>
        </div>

        <div class="ng-8020card" style="margin-top:12px">
          <div class="ng-8020title">🍕 กฎ 80/20</div>
          <div class="ng-8020body">
            จาก ${targetCal} kcal — โควต้า "กินอะไรก็ได้" <strong style="color:#fbbf24">${Math.round(targetCal * 0.2)} kcal</strong> ต่อวัน (20%)
            ส่วนที่เหลือ ${Math.round(targetCal * 0.8)} kcal ควรเป็นอาหารคุณค่าสูง
          </div>
        </div>

        <div class="ng-science-note">📚 Aragon formula: TBW(lbs) × (10 + training hrs) × NEAT · Aragon & Schoenfeld (2013) JISSN · Aragon (2022) Flexible Dieting Ch.8</div>
      </div>`;
  }

  _setGoal(g) {
    this._planGoal = g;
    localStorage.setItem('shg-ng-goal', g);
    this._refreshAll();
  }

  _setTrainHrs(h) {
    this._planTrainHrs = h;
    localStorage.setItem('shg-ng-trainhrs', h);
    this._refreshResult();
  }

  _setNEAT(n) {
    this._planNEAT = n;
    localStorage.setItem('shg-ng-neat', n);
    this._refreshAll();
  }

  _refreshResult() {
    const wt = this._wt();
    const hrs = this._planTrainHrs;
    const neat = this._planNEAT;
    const g = this._planGoal;
    const maintenanceCal = this._aragonCalc(wt, hrs, neat);
    let adjustPct = g === 'fat_loss' ? -15 : g === 'muscle' ? 15 : 0;
    const targetCal = Math.round(maintenanceCal * (1 + adjustPct / 100));
    const protein = g === 'fat_loss' ? Math.round(wt * 2.3) : Math.round(wt * 1.8);
    const fat = Math.round(wt * 1.0);
    const protKcal = protein * 4, fatKcal = fat * 9;
    const carbKcal = Math.max(0, targetCal - protKcal - fatKcal);
    const carbs = Math.round(carbKcal / 4);
    const el = document.querySelector('.ng-plan-result');
    if (el) {
      const adjustNote = g === 'fat_loss' ? `ลด 15% เพื่อลดไขมัน (−${Math.round(maintenanceCal * 0.15)} kcal)` :
                         g === 'muscle'   ? `เพิ่ม 15% เพื่อเพิ่มกล้ามเนื้อ (+${Math.round(maintenanceCal * 0.15)} kcal)` :
                         g === 'recomp'   ? 'กิน Maintenance — Recomp ต้องการความสม่ำเสมอ' : '';
      el.innerHTML = `
        <div class="ng-result-formula"><span class="ng-formula-text">${wt} กก. × (10 + ${hrs} ชม.) × ${neat}</span><span class="ng-formula-eq">= ${maintenanceCal} kcal</span></div>
        ${adjustNote ? `<div class="ng-result-adjust">${adjustNote}</div>` : ''}
        <div class="ng-result-total">🎯 เป้าหมายวันละ <strong>${targetCal}</strong> kcal</div>`;
      const mb = document.querySelector('.ng-macro-breakdown');
      if (mb) mb.innerHTML = `
        <div class="ng-macro-step"><div class="ng-mstep-num">①</div><div class="ng-mstep-info"><div class="ng-mstep-label">🥩 โปรตีน</div><div class="ng-mstep-val">${protein}g = ${protKcal} kcal</div><div class="ng-mstep-note">${g === 'fat_loss' ? '2.3 g/kg ป้องกันกล้ามหายตอนลด' : '1.8 g/kg รักษาและสร้างกล้ามเนื้อ'}</div></div></div>
        <div class="ng-macro-step"><div class="ng-mstep-num">②</div><div class="ng-mstep-info"><div class="ng-mstep-label">🥑 ไขมัน</div><div class="ng-mstep-val">${fat}g = ${fatKcal} kcal</div><div class="ng-mstep-note">1.0 g/kg ฮอร์โมน, วิตามิน</div></div></div>
        <div class="ng-macro-step"><div class="ng-mstep-num">③</div><div class="ng-mstep-info"><div class="ng-mstep-label">🍞 คาร์บ</div><div class="ng-mstep-val">${carbs}g = ${carbKcal} kcal</div><div class="ng-mstep-note">เหลือจาก ${targetCal} - ${protKcal} - ${fatKcal}</div></div></div>`;
    }
  }

  _refreshAll() {
    const sheet = document.querySelector('.ng-sheet');
    if (!sheet) return;
    const wt = this._wt();
    const m  = this._macros();
    const t  = this._targets(wt);
    const pMacros  = sheet.querySelector('#ng-p-macros');
    const pPlan    = sheet.querySelector('#ng-p-plan');
    if (pMacros) pMacros.outerHTML = this._panelMacros(t, m);
    if (pPlan)   pPlan.outerHTML   = this._panelPlan();
    this.switchTab(this._tab);
  }

  _panelWorkout(t) {
    const { wt, prePre1h, prePre2h, prePre3h, postCarb } = t;
    const protPerMeal = Math.round(wt * 0.45);
    return `
      <div class="ng-panel" id="ng-p-workout" style="display:none">
        <p class="ng-intro">กินถูกเวลา = ออกกำลังได้หนักขึ้น และฟื้นฟูเร็วขึ้น</p>
        <div class="ng-timing-note">⏰ โปรตีน: กินภายใน 2 ชม.<strong>ก่อน</strong>และ 2 ชม.<strong>หลัง</strong>ออกกำลัง ดีที่สุดสำหรับ MPS (Muscle Protein Synthesis)</div>

        <div class="ng-tw-header ng-before">⏰ ก่อนออกกำลังกาย</div>
        <div class="ng-tw-row"><div class="ng-tw-time">3–4 ชม. ก่อน</div><div><div class="ng-tw-title">มื้อหลัก</div><div class="ng-tw-food">ข้าว + ไก่ + ผัก — คาร์บ ~${prePre3h}g + โปรตีน ~${protPerMeal}g<br><small>เติมไกลโคเจนสำรอง, ตามด้วยดื่มน้ำ 2 แก้วใหญ่</small></div></div></div>
        <div class="ng-tw-row"><div class="ng-tw-time">1–2 ชม. ก่อน</div><div><div class="ng-tw-title">ของว่างคาร์บ + โปรตีน</div><div class="ng-tw-food">กล้วย + โยเกิร์ต / โอ๊ตมีล + นม — คาร์บ ~${prePre2h}g<br><small>ย่อยง่าย ไม่อึ้งท้อง · Aragon: โปรตีน 0.4 g/kg ก่อนออกกำลัง</small></div></div></div>
        <div class="ng-tw-row"><div class="ng-tw-time">5–60 นาที ก่อน</div><div><div class="ng-tw-title">ของว่างเบาๆ</div><div class="ng-tw-food">กล้วย 1 ลูก / โอ๊ตมีล 1 ถ้วย — คาร์บ ~${prePre1h}g</div></div></div>

        <div class="ng-tw-header ng-during">🏃 ระหว่างออกกำลัง (นาน &gt; 60 นาที)</div>
        <div class="ng-tw-row"><div class="ng-tw-time">ทุก 15–20 นาที</div><div><div class="ng-tw-title">ดื่มน้ำ</div><div class="ng-tw-food">240 มล. (1 แก้วใหญ่)<br><small>ขาดน้ำ 2% = ประสิทธิภาพลด 10–20%</small></div></div></div>

        <div class="ng-tw-header ng-after">✅ หลังออกกำลังกาย (ภายใน 2 ชม.)</div>
        <div class="ng-tw-row"><div class="ng-tw-time">ภายใน 2 ชม.</div><div><div class="ng-tw-title">โปรตีน + คาร์บ</div><div class="ng-tw-food">โปรตีน ~${protPerMeal}g + คาร์บ ~${postCarb}g<br><small>นมช็อกโกแลต, ข้าว + ไก่ต้ม, โปรตีนเชค + กล้วย<br>· ไม่ต้อง "30 นาที" — 2 ชม.ก็ยังได้ประโยชน์ (Aragon & Schoenfeld 2013)</small></div></div></div>
        <div class="ng-tw-row"><div class="ng-tw-time">2–4 ชม. หลัง</div><div><div class="ng-tw-title">มื้อฟื้นฟู</div><div class="ng-tw-food">โปรตีนคุณภาพ + คาร์บเชิงซ้อน<br><small>ปลาอบ + มันฝรั่งต้ม + ผัก หรือ ข้าวกล้อง + เนื้อสัตว์ + ไข่</small></div></div></div>

        <div class="ng-science-note">📚 Aragon & Schoenfeld (2013) JISSN · Clark (2020) Table 9.1–9.2 · ACSM Guidelines 2016</div>
      </div>`;
  }

  _panelTips() {
    const rubric = [
      '😴 นอนหลับ ≥ 7 ชั่วโมง',
      '🏃 ออกกำลังกายตามแผน (หรือพักถ้าวันพัก)',
      '💧 ดื่มน้ำ ≥ 1 ลิตร ก่อนอาหารทุกมื้อ',
      '🍽️ กินเมื่อหิวจริงๆ — หยุดเมื่ออิ่มพอดี',
      '💭 ทบทวนว่าทำไมถึงอยากเปลี่ยนชีวิต',
    ];
    const tips = [
      { icon: '⚖️', title: 'ไดเอทแบบยืดหยุ่น ดีกว่าแบบเคร่งครัด',
        body: 'Aragon (2022): คนที่ rigid dieting มีแนวโน้ม binge eating มากกว่า และน้ำหนักกลับขึ้นเร็วกว่า แนวคิด "กินได้ทุกอย่างในปริมาณที่เหมาะสม" (IIFYM) รักษาน้ำหนักได้ยาวนานกว่า' },
      { icon: '🥩', title: 'แจกจ่ายโปรตีน 4 มื้อ ดีกว่ากินทีเดียวเยอะ',
        body: 'กินโปรตีน ~0.4–0.55 g/kg ต่อมื้อ × 4+ มื้อ เพราะกล้ามเนื้อกระตุ้น MPS (Muscle Protein Synthesis) ได้ต่อเนื่องตลอดวัน แทนที่จะกอง 80g มื้อเดียว' },
      { icon: '🍞', title: 'คาร์บคือเชื้อเพลิงกล้ามเนื้อ ไม่ใช่ศัตรู',
        body: 'Aragon: คนที่กินคาร์บ 1.5 g/kg ก่อนออกกำลัง 2 ชม. ทำ rep ได้มากกว่ากลุ่มอดอาหารอย่างมีนัยสำคัญ ลดคาร์บมากเกินทำให้ออกกำลังได้น้อยลงและเผาผลาญได้น้อยลง' },
      { icon: '🔄', title: 'โปรตีนสูงตอนลดน้ำหนัก — ป้องกันกล้ามหาย',
        body: 'ในช่วงลดน้ำหนัก (hypocaloric) เพิ่มโปรตีนเป็น 2.2–2.4 g/kg เพื่อป้องกันสูญเสียกล้ามเนื้อ เพราะโปรตีนส่งสัญญาณให้ร่างกาย "เผาไขมัน ไม่ใช่กล้ามเนื้อ"' },
      { icon: '🍕', title: 'กฎ 80/20 — อาหารทุกชนิดกินได้',
        body: '80–90% ของแคลอรีควรมาจากอาหารคุณค่าสูง 10–20% เป็น "discretionary" กินอะไรก็ได้ที่ชอบ — วิธีนี้ทำให้ adherence ดีขึ้นกว่าการห้ามอาหารโดยสิ้นเชิง (ADA Position 2002)' },
      { icon: '💧', title: 'ดื่มน้ำก่อนมื้ออาหาร — ลดการกินเกิน',
        body: 'ดื่มน้ำ 2 แก้วใหญ่ก่อนมื้ออาหารทุกมื้อ ช่วยเริ่ม satiety signal ลดปริมาณอาหารที่กินได้จริง มีงานวิจัยสนับสนุนชัดเจน (Aragon 2022 "water trick")' },
      { icon: '🌿', title: 'โปรตีนจากพืชก็ใช้ได้ถ้ากินพอ',
        body: 'vegan ที่กินโปรตีน ≥1.6 g/kg ต่อวัน สร้างกล้ามเนื้อได้เทียบเท่าผู้ที่กินเนื้อสัตว์ ถั่ว เต้าหู้ เทมเป้ ควินัวคือแหล่งโปรตีนพืชที่ดี (Aragon 2022 Ch.4)' },
    ];

    return `
      <div class="ng-panel" id="ng-p-tips" style="display:none">
        <p class="ng-intro">เคล็ดลับจากงานวิจัยด้านโภชนาการ โดย Alan Aragon นักโภชนาการกีฬาระดับโลก</p>

        <div class="ng-rubric-card">
          <div class="ng-rubric-title">✅ Adherence Rubric ประจำวัน (Aragon 5-Point)</div>
          <div class="ng-rubric-sub">ทำได้กี่ข้อ = คะแนนความสำเร็จวันนี้ ตั้งเป้า 4–5/5</div>
          ${rubric.map((r, i) => `<div class="ng-rubric-item"><span class="ng-rubric-num">${i + 1}</span>${r}</div>`).join('')}
        </div>

        ${tips.map(tp => `
          <div class="ng-tipcard">
            <div class="ng-tipicon">${tp.icon}</div>
            <div>
              <div class="ng-tiptitle">${tp.title}</div>
              <div class="ng-tiptext">${tp.body}</div>
            </div>
          </div>`).join('')}

        <div class="ng-science-note">📚 Aragon (2022) Flexible Dieting · ADA Position Stand 2002 · Aragon & Schoenfeld (2013) JISSN</div>
      </div>`;
  }

  _panelBurnScience() {
    const cards = [
      { icon: '🔥', color: '#f97316', bg: 'rgba(249,115,22,.1)', title: 'ออกกำลังกาย ≠ เผาผลาญมากขึ้น', subtitle: 'Constrained Energy Expenditure', body: 'งานวิจัยในชนเผ่า Hadza แทนซาเนีย พบว่าคนล่าสัตว์ที่เดิน 16,000 ก้าว/วัน ใช้พลังงานรวมต่อวัน <strong>เท่ากับ</strong>คนนั่งโต๊ะในเมือง เพราะร่างกายปรับลดการใช้พลังงานส่วนอื่น (การอักเสบ ฮอร์โมน) เพื่อชดเชย นี่คือ "การเผาผลาญแบบจำกัด"', source: 'Pontzer et al. (2012) PLOS ONE · Pontzer "Burn" (2021)' },
      { icon: '🏃', color: '#22c55e', bg: 'rgba(34,197,94,.1)', title: 'ออกกำลังกาย = สุขภาพดี ไม่ใช่ลดน้ำหนัก', subtitle: 'Exercise Benefits Beyond Calories', body: 'เมื่อออกกำลังกายสม่ำเสมอ ร่างกายจัดสรรพลังงานใหม่: <br>• ลดการอักเสบเรื้อรัง<br>• ลดการตอบสนองต่อความเครียด (cortisol ลด 30%)<br>• ช่วย<strong>รักษาน้ำหนัก</strong>หลังลดได้ แต่ไม่ค่อยช่วยลดน้ำหนักอย่างเดียว', source: 'Pontzer "Burn" Ch.7 · Hackney et al. (2012)' },
      { icon: '💨', color: '#38bdf8', bg: 'rgba(56,189,248,.1)', title: 'ไขมันหายไปไหน?', subtitle: 'Fat Is Exhaled as CO₂', body: 'เมื่อร่างกาย "เผา" ไขมัน 10 กก. จะกลายเป็น:<br>• CO₂ 8.4 กก. — <strong>หายใจออก</strong>ทิ้ง<br>• H₂O 1.6 กก. — ออกมาทางเหงื่อ ปัสสาวะ<br><br>ปอดคือ "อวัยวะลดน้ำหนัก" หลักของร่างกาย', source: 'Meerman & Brown (2014) BMJ' },
      { icon: '📊', color: '#a78bfa', bg: 'rgba(167,139,250,.1)', title: 'แคลอรี่จริงๆ ต่อวัน', subtitle: 'Real Daily Calorie Needs', body: 'ฉลากอาหารบอก 2,000 แคล แต่ <strong>ผู้ใหญ่ส่วนใหญ่ใช้พลังงาน 2,500–3,000 แคล/วัน</strong><br>• ผู้ชายเฉลี่ย: ~3,000 แคล<br>• ผู้หญิงเฉลี่ย: ~2,400 แคล<br>• ความแตกต่างระหว่างบุคคล ±500 แคล/วัน', source: 'Pontzer et al. Doubly-Labeled Water Database (2021)' },
      { icon: '🦧', color: '#fbbf24', bg: 'rgba(251,191,36,.1)', title: 'มาตรฐานก้าวเดิน 3 ระดับ', subtitle: 'Steps: Chimp → Human → Hadza', body: '• 🦧 <strong>5,000 ก้าว</strong> — ระดับลิงชิมแปนซี (นั่งเฉยเกินไป)<br>• 👟 <strong>10,000 ก้าว</strong> — ขั้นต่ำ CDC แนะนำ<br>• 🏹 <strong>16,000 ก้าว</strong> — ระดับ Hadza (สุขภาพดีที่สุด)', source: 'Pontzer et al. (2012) · Glasgow postal workers study (2017)' },
      { icon: '⚠️', color: '#f59e0b', bg: 'rgba(245,158,11,.1)', title: 'ระวัง! อดอาหารหนักทำ BMR ลดถาวร', subtitle: 'Metabolic Adaptation Warning', body: 'นักแข่ง The Biggest Loser ที่ลดน้ำหนักได้ 57 กก.:<br>• BMR ลดลง <strong>700 แคล/วัน</strong> (25%)<br>• ผ่านไป 6 ปี BMR ยังต่ำกว่าปกติ<br>• 13 ใน 14 คนน้ำหนักกลับขึ้น<br><br>ลดอย่างปลอดภัย: deficit ≤500 แคล/วัน', source: 'Hall et al. (2016) Obesity · Pontzer "Burn" Ch.5' },
    ];

    return `
      <div class="ng-panel" id="ng-p-burn" style="display:none">
        <p class="ng-intro">งานวิจัยใหม่จาก <strong>Herman Pontzer, PhD</strong> (Duke) เปลี่ยนความเข้าใจเรื่องการเผาผลาญ</p>
        ${cards.map(c => `
          <div class="ng-burncard" style="border-left-color:${c.color};background:${c.bg}">
            <div class="ng-burnhead"><span class="ng-burnicon">${c.icon}</span><div><div class="ng-burntitle">${c.title}</div><div class="ng-burnsub">${c.subtitle}</div></div></div>
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
      .ng-tabs{display:flex;gap:5px;margin-bottom:14px;flex-wrap:wrap}
      .ng-tbtn{flex:1;min-width:60px;padding:7px 4px;border-radius:10px;border:1px solid #334155;background:#0f172a;color:#94a3b8;font-size:.72rem;cursor:pointer;font-weight:600}
      .ng-tbtn.active{background:#3b82f6;border-color:#3b82f6;color:#fff}
      .ng-intro{color:#94a3b8;font-size:.83rem;margin-bottom:14px;line-height:1.55}
      .ng-intro strong{color:#cbd5e1}
      .ng-goal-badge{display:flex;align-items:center;font-size:.8rem;font-weight:700;padding:7px 12px;border-radius:10px;margin-bottom:12px}
      .ng-badge-priority{background:rgba(239,68,68,.2);color:#f87171;font-size:.65rem;padding:2px 6px;border-radius:5px;margin-left:6px;font-weight:700}
      .ng-mcard{display:flex;gap:10px;background:#0f172a;border-radius:12px;padding:12px 14px;margin-bottom:10px;border-left:4px solid #334155}
      .ng-mp{border-left-color:#38bdf8}.ng-mc{border-left-color:#fbbf24}.ng-mf{border-left-color:#f87171}
      .ng-micon{font-size:1.5rem;padding-top:2px}
      .ng-mname{font-size:.9rem;font-weight:700;color:#e2e8f0}
      .ng-mrange{font-size:1.05rem;font-weight:700;color:#60a5fa;margin:2px 0}
      .ng-mnote{font-size:.72rem;color:#64748b}
      .ng-mtoday{font-size:.78rem;color:#94a3b8;margin-top:5px}
      .ng-tag{font-size:.7rem;padding:2px 7px;border-radius:6px;font-weight:600}
      .ng-ok{background:rgba(34,197,94,.2);color:#4ade80}.ng-low{background:rgba(251,191,36,.2);color:#fbbf24}
      .ng-high{background:rgba(248,113,113,.2);color:#f87171}.ng-none{background:rgba(100,116,139,.2);color:#94a3b8}
      .ng-hydcard{display:flex;gap:12px;align-items:center;background:rgba(56,189,248,.1);border:1px solid rgba(56,189,248,.3);border-radius:12px;padding:12px 14px;margin-top:4px}
      .ng-8020card{background:rgba(251,191,36,.08);border:1px solid rgba(251,191,36,.25);border-radius:12px;padding:12px 14px;margin-top:10px}
      .ng-8020title{font-size:.85rem;font-weight:700;color:#fbbf24;margin-bottom:5px}
      .ng-8020body{font-size:.78rem;color:#94a3b8;line-height:1.55}
      .ng-science-note{font-size:.7rem;color:#475569;margin-top:16px;padding:8px 12px;background:#0f172a;border-radius:8px;line-height:1.5}
      .ng-timing-note{background:rgba(108,99,255,.12);border:1px solid rgba(108,99,255,.3);border-radius:10px;padding:10px 12px;font-size:.78rem;color:#a5b4fc;margin-bottom:12px;line-height:1.55}
      .ng-tw-header{font-size:.83rem;font-weight:700;padding:6px 12px;border-radius:8px;margin:10px 0 6px}
      .ng-before{background:rgba(251,191,36,.12);color:#fbbf24}.ng-during{background:rgba(56,189,248,.12);color:#38bdf8}.ng-after{background:rgba(34,197,94,.12);color:#4ade80}
      .ng-tw-row{display:flex;gap:10px;background:#0f172a;border-radius:10px;padding:10px 12px;margin-bottom:6px}
      .ng-tw-time{font-size:.72rem;color:#64748b;min-width:80px;padding-top:3px;flex-shrink:0}
      .ng-tw-title{font-size:.88rem;font-weight:600;color:#e2e8f0}
      .ng-tw-food{font-size:.78rem;color:#94a3b8;margin-top:2px;line-height:1.5}
      .ng-rubric-card{background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.25);border-radius:14px;padding:14px;margin-bottom:14px}
      .ng-rubric-title{font-size:.88rem;font-weight:700;color:#4ade80;margin-bottom:3px}
      .ng-rubric-sub{font-size:.72rem;color:#64748b;margin-bottom:10px}
      .ng-rubric-item{display:flex;align-items:center;gap:8px;font-size:.82rem;color:#cbd5e1;padding:5px 0;border-bottom:1px solid rgba(255,255,255,.06)}
      .ng-rubric-item:last-child{border-bottom:none}
      .ng-rubric-num{background:#22c55e;color:#0f172a;font-weight:700;border-radius:50%;width:20px;height:20px;display:flex;align-items:center;justify-content:center;font-size:.72rem;flex-shrink:0}
      .ng-tipcard{display:flex;gap:12px;background:#0f172a;border-radius:12px;padding:12px 14px;margin-bottom:10px}
      .ng-tipicon{font-size:1.4rem;flex-shrink:0;padding-top:2px}
      .ng-tiptitle{font-size:.88rem;font-weight:700;color:#e2e8f0;margin-bottom:3px}
      .ng-tiptext{font-size:.78rem;color:#94a3b8;line-height:1.55}
      .ng-burncard{border-radius:14px;padding:14px;margin-bottom:12px;border-left:4px solid #6c63ff}
      .ng-burnhead{display:flex;gap:10px;align-items:flex-start;margin-bottom:8px}
      .ng-burnicon{font-size:1.6rem;flex-shrink:0;line-height:1.2}
      .ng-burntitle{font-size:.92rem;font-weight:700;color:#e2e8f0;line-height:1.3}
      .ng-burnsub{font-size:.7rem;color:#64748b;margin-top:2px;font-style:italic}
      .ng-burnbody{font-size:.79rem;color:#94a3b8;line-height:1.65;margin-bottom:8px}.ng-burnbody strong{color:#cbd5e1}
      .ng-burnsource{font-size:.67rem;color:#475569;background:rgba(0,0,0,.2);border-radius:6px;padding:4px 8px;line-height:1.5}
      .ng-plan-section{margin-bottom:14px}
      .ng-plan-label{font-size:.82rem;color:#94a3b8;margin-bottom:8px;font-weight:600}
      .ng-plan-label strong{color:#e2e8f0}
      .ng-plan-row{display:flex;gap:6px;flex-wrap:wrap}
      .ng-plan-hint{font-size:.7rem;color:#475569;margin-top:4px}
      .ng-goal-btn{padding:7px 10px;border-radius:10px;border:1px solid #334155;background:#0f172a;color:#94a3b8;font-size:.75rem;cursor:pointer;font-weight:600;flex:1;min-width:70px}
      .ng-goal-btn.active{background:#6c63ff;border-color:#6c63ff;color:#fff}
      .ng-neat-btn{padding:6px 10px;border-radius:8px;border:1px solid #334155;background:#0f172a;color:#94a3b8;font-size:.73rem;cursor:pointer;font-weight:600}
      .ng-neat-btn.active{background:#3b82f6;border-color:#3b82f6;color:#fff}
      .ng-slider{width:100%;accent-color:#6c63ff;margin-top:4px}
      .ng-plan-result{background:rgba(108,99,255,.12);border:1px solid rgba(108,99,255,.3);border-radius:14px;padding:14px;margin:12px 0}
      .ng-result-formula{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;flex-wrap:wrap;gap:4px}
      .ng-formula-text{font-size:.75rem;color:#94a3b8}
      .ng-formula-eq{font-size:.82rem;color:#a5b4fc;font-weight:700}
      .ng-result-adjust{font-size:.75rem;color:#fbbf24;margin-bottom:6px}
      .ng-result-total{font-size:1.05rem;color:#e2e8f0;font-weight:700}.ng-result-total strong{color:#a78bfa;font-size:1.3rem}
      .ng-macro-breakdown{background:#0f172a;border-radius:12px;padding:12px;margin-top:4px}
      .ng-macro-step{display:flex;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.06)}
      .ng-macro-step:last-child{border-bottom:none}
      .ng-mstep-num{background:#334155;color:#e2e8f0;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:700;flex-shrink:0;margin-top:2px}
      .ng-mstep-label{font-size:.82rem;font-weight:600;color:#cbd5e1}
      .ng-mstep-val{font-size:.88rem;font-weight:700;color:#6c63ff;margin:2px 0}
      .ng-mstep-note{font-size:.7rem;color:#64748b}
    `;
    document.head.appendChild(s);
  }

  switchTab(tab) {
    this._tab = tab;
    document.querySelectorAll('.ng-tbtn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    ['macros','plan','workout','tips','burn'].forEach(id => {
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
        <div class="ng-tabs">
          <button class="ng-tbtn active" data-tab="macros" onclick="nutritionGuideModule.switchTab('macros')">🎯 เป้าหมาย</button>
          <button class="ng-tbtn" data-tab="plan" onclick="nutritionGuideModule.switchTab('plan')">📊 แผนตัวเอง</button>
          <button class="ng-tbtn" data-tab="workout" onclick="nutritionGuideModule.switchTab('workout')">🏃 ก่อน/หลัง</button>
          <button class="ng-tbtn" data-tab="tips" onclick="nutritionGuideModule.switchTab('tips')">💡 เคล็ดลับ</button>
          <button class="ng-tbtn" data-tab="burn" onclick="nutritionGuideModule.switchTab('burn')">🔬 วิทยาศาสตร์</button>
        </div>
        ${this._panelMacros(t, m)}
        ${this._panelPlan()}
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
