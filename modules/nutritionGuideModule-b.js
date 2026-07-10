// nutritionGuideModule-b.js — TBW Calculator + Matthews Goal Templates
// Overrides _panelPlan() with 4-step Lean Muscle Diet system

(function () {

  // Matthews (Bigger/Thinner Leaner Stronger) macro templates
  const TPL = {
    cut: {
      emoji: '🔥', label: 'Cutting', desc: 'ลดไขมัน รักษากล้ามเนื้อ',
      cal_adj: -20,   // 20% deficit
      prot_g_lb: 1.0, fat_g_lb: 0.35,
      pct: { p: 40, c: 40, f: 20 },
      color: '#ef4444',
      tip: 'ขาดดุล 20% · โปรตีน 1g/lb TBW ป้องกันกล้ามหาย · Matthews: "Cutting should be aggressive but not reckless"'
    },
    main: {
      emoji: '⚖️', label: 'Maintaining', desc: 'รักษาน้ำหนัก + กล้ามเนื้อ',
      cal_adj: 0,
      prot_g_lb: 0.9, fat_g_lb: 0.45,
      pct: { p: 30, c: 45, f: 25 },
      color: '#22c55e',
      tip: 'กิน TDEE พอดี · เหมาะสำหรับช่วงรักษาผล หรือกำลัง Recomp'
    },
    bulk: {
      emoji: '💪', label: 'Bulking', desc: 'เพิ่มกล้ามเนื้อ (Clean Bulk)',
      cal_adj: 10,    // 10% surplus
      prot_g_lb: 1.0, fat_g_lb: 0.35,
      pct: { p: 25, c: 50, f: 25 },
      color: '#6c63ff',
      tip: 'เกินดุล 10% · คาร์บสูงสุดสำหรับพลังงานและ MPS · Matthews: "Lean bulk 0.5–1 lb/week"'
    }
  };

  // Persisted state
  const S = {
    get mode()      { return localStorage.getItem('shg-tbw-mode') || 'cut'; },
    set mode(v)     { localStorage.setItem('shg-tbw-mode', v); },
    get currentBF() { return parseFloat(localStorage.getItem('shg-tbw-bf') || '20'); },
    set currentBF(v){ localStorage.setItem('shg-tbw-bf', v); },
    get targetBF()  { return parseFloat(localStorage.getItem('shg-tbw-tbf') || '15'); },
    set targetBF(v) { localStorage.setItem('shg-tbw-tbf', v); },
    get gainLbs()   { return parseFloat(localStorage.getItem('shg-tbw-gain') || '3'); },
    set gainLbs(v)  { localStorage.setItem('shg-tbw-gain', v); },
    get trainHrs()  { return parseFloat(localStorage.getItem('shg-tbw-hrs') || '4'); },
    set trainHrs(v) { localStorage.setItem('shg-tbw-hrs', v); },
    get intensity() { return parseInt(localStorage.getItem('shg-tbw-int') || '10'); },
    set intensity(v){ localStorage.setItem('shg-tbw-int', v); },
    get fatMult()   { return parseFloat(localStorage.getItem('shg-tbw-fatm') || '0.5'); },
    set fatMult(v)  { localStorage.setItem('shg-tbw-fatm', v); },
  };

  // Core TBW calculation (Aragon & Schuler, The Lean Muscle Diet 2014)
  function calcTBW(wtKg, bfPct, targetBFPct, gainLbs) {
    const wtLbs  = wtKg * 2.2046;
    const lbmLbs = wtLbs * (1 - bfPct / 100);
    const tLBM   = lbmLbs + gainLbs;
    const tbw    = (tLBM * 100) / (100 - targetBFPct);
    return {
      lbm:       round1(lbmLbs),
      lbmKg:     round1(lbmLbs / 2.2046),
      targetLBM: round1(tLBM),
      tbwLbs:    round1(tbw),
      tbwKg:     round1(tbw / 2.2046),
      delta:     round1(tbw - wtLbs),      // positive = need to gain, negative = need to lose
    };
  }

  // Lean Muscle Diet calorie formula: TBW(lbs) × (intensity + trainHrs)
  function calcCal(tbwLbs, intensity, trainHrs) {
    return Math.round(tbwLbs * (intensity + trainHrs));
  }

  function calcMacros(tbwLbs, baseCal, tpl, fatMult) {
    const adjCal  = Math.round(baseCal * (1 + tpl.cal_adj / 100));
    const protG   = Math.round(tbwLbs * tpl.prot_g_lb);
    const fatG    = Math.round(tbwLbs * fatMult);
    const protCal = protG * 4;
    const fatCal  = fatG * 9;
    const carbCal = Math.max(0, adjCal - protCal - fatCal);
    const carbG   = Math.round(carbCal / 4);
    return { adjCal, protG, fatG, carbG, protCal, fatCal, carbCal };
  }

  function round1(n) { return Math.round(n * 10) / 10; }

  // Expose refresh hook globally so oninput handlers can call it
  window._tbwRefresh = function () {
    if (window.nutritionGuideModule) window.nutritionGuideModule._refreshPlan();
  };

  // Override _panelPlan on the module instance
  window.nutritionGuideModule._panelPlan = function () {
    const wt      = this._wt();
    const wtLbs   = round1(wt * 2.2046);
    const mode    = S.mode;
    const tpl     = TPL[mode];
    const { lbm, lbmKg, targetLBM, tbwLbs, tbwKg, delta } = calcTBW(wt, S.currentBF, S.targetBF, S.gainLbs);
    const baseCal  = calcCal(tbwLbs, S.intensity, S.trainHrs);
    const macros   = calcMacros(tbwLbs, baseCal, tpl, S.fatMult);
    const deltaSign = delta < 0 ? `ลด ${Math.abs(delta)} lbs` : delta > 0 ? `เพิ่ม ${delta} lbs` : 'น้ำหนักเท่าเดิม';

    return `<div class="ng-panel" id="ng-p-plan" style="display:none">
      <p class="ng-intro" style="margin-bottom:10px">
        สูตร <strong>The Lean Muscle Diet</strong> (Aragon &amp; Schuler, 2014) + <strong>Michael Matthews</strong> (BLS/TLS, 2019)
      </p>

      <!-- ① Matthews Goal Templates -->
      <div class="ng-plan-label">① เลือกเป้าหมาย (Matthews 3-Goal System)</div>
      <div class="tbw-goal-row">
        ${Object.entries(TPL).map(([k, t]) => `
          <button class="tbw-goal-btn ${mode === k ? 'active' : ''}" style="${mode===k?'border-color:'+t.color+';color:'+t.color:''};"
            onclick="window.nutritionGuideModule._tbwSet('mode','${k}')">
            <div style="font-size:1.3rem">${t.emoji}</div>
            <div class="tbw-gb-label">${t.label}</div>
            <div class="tbw-gb-pct">P${t.pct.p}% C${t.pct.c}% F${t.pct.f}%</div>
            <div class="tbw-gb-adj" style="color:${t.color}">${t.cal_adj>0?'+':''}${t.cal_adj}% cal</div>
          </button>`).join('')}
      </div>
      <div class="tbw-tip" style="border-left-color:${tpl.color}">💡 ${tpl.tip}</div>

      <!-- ② TBW 4-Step Wizard -->
      <div class="ng-plan-label" style="margin-top:14px">② คำนวณ TBW 4 ขั้นตอน (Lean Muscle Diet Method)</div>

      <div class="tbw-step">
        <div class="tbw-step-hd"><span class="tbw-sn">1</span>น้ำหนัก + ไขมัน% ปัจจุบัน</div>
        <div class="tbw-grid2">
          <div>
            <div class="tbw-fl">น้ำหนัก</div>
            <div class="tbw-fv">${wt} กก. / ${wtLbs} lbs</div>
          </div>
          <div>
            <div class="tbw-fl">BF% ปัจจุบัน: <strong id="bf-cur">${S.currentBF}%</strong></div>
            <input type="range" class="ng-slider" min="5" max="45" step="1" value="${S.currentBF}"
              oninput="document.getElementById('bf-cur').textContent=this.value+'%';window.nutritionGuideModule._tbwSet('currentBF',+this.value)">
          </div>
        </div>
        <div class="tbw-calc-row">LBM = ${wtLbs} × (1 − ${S.currentBF}%) = <strong>${lbm} lbs (${lbmKg} กก.)</strong></div>
      </div>

      <div class="tbw-step">
        <div class="tbw-step-hd"><span class="tbw-sn">2</span>เป้าหมาย BF% + กล้ามที่จะได้ใน 6 เดือน</div>
        <div class="tbw-grid2">
          <div>
            <div class="tbw-fl">BF% เป้าหมาย: <strong id="bf-tgt">${S.targetBF}%</strong></div>
            <input type="range" class="ng-slider" min="5" max="${Math.max(6, S.currentBF-1)}" step="1" value="${Math.min(S.targetBF, S.currentBF-1)}"
              oninput="document.getElementById('bf-tgt').textContent=this.value+'%';window.nutritionGuideModule._tbwSet('targetBF',+this.value)">
            <div class="tbw-hint">ตาม LMD: ลด 2–3% ต่อเดือน</div>
          </div>
          <div>
            <div class="tbw-fl">เพิ่มกล้าม: <strong id="gain-lbs">${S.gainLbs} lbs</strong></div>
            <input type="range" class="ng-slider" min="0" max="8" step="1" value="${S.gainLbs}"
              oninput="document.getElementById('gain-lbs').textContent=this.value+' lbs';window.nutritionGuideModule._tbwSet('gainLbs',+this.value)">
            <div class="tbw-hint">Intermediate: ~1 lb/เดือน</div>
          </div>
        </div>
        <div class="tbw-calc-row">Target LBM = ${lbm} + ${S.gainLbs} = <strong>${targetLBM} lbs</strong></div>
      </div>

      <div class="tbw-step tbw-step-result">
        <div class="tbw-step-hd"><span class="tbw-sn">3</span>Target Body Weight (TBW)</div>
        <div class="tbw-big">${tbwLbs} <span class="tbw-big-unit">lbs</span> = ${tbwKg} กก.</div>
        <div class="tbw-calc-row" style="margin-top:6px">(${targetLBM} × 100) ÷ (100 − ${S.targetBF}) = ${tbwLbs} lbs</div>
        <div class="tbw-delta">${deltaSign} จากน้ำหนักปัจจุบัน (${wtLbs} lbs)</div>
      </div>

      <!-- ③ Calorie Formula -->
      <div class="ng-plan-label" style="margin-top:14px">③ คำนวณแคลอรี (LMD Standard Formula)</div>
      <div class="tbw-cal-box">
        <div class="tbw-grid2" style="gap:12px">
          <div>
            <div class="tbw-fl">ออกกำลัง/สัปดาห์: <strong id="train-hrs">${S.trainHrs}</strong> ชม.</div>
            <input type="range" class="ng-slider" min="0" max="15" step="0.5" value="${S.trainHrs}"
              oninput="document.getElementById('train-hrs').textContent=this.value;window.nutritionGuideModule._tbwSet('trainHrs',+this.value)">
          </div>
          <div>
            <div class="tbw-fl" style="margin-bottom:6px">ความหนัก (Intensity Factor)</div>
            <div style="display:flex;gap:5px">
              ${[[9,'🟡 9'],[10,'🟠 10'],[11,'🔴 11']].map(([v,l]) => `
                <button class="tbw-int-btn ${S.intensity==v?'active':''}"
                  onclick="window.nutritionGuideModule._tbwSet('intensity',${v})">${l}</button>`).join('')}
            </div>
            <div class="tbw-hint">${{9:'ปานกลาง',10:'หนัก',11:'หนักมาก'}[S.intensity]}</div>
          </div>
        </div>
        <div class="tbw-formula-eq">
          ${tbwLbs} × (${S.intensity} + ${S.trainHrs}) = <strong>${baseCal} kcal</strong> (maintenance)
        </div>
        <div class="tbw-adj-line" style="color:${tpl.color}">
          ${tpl.emoji} ${tpl.label} ${tpl.cal_adj>0?'+':''}${tpl.cal_adj}%
          → <strong>${macros.adjCal} kcal/วัน</strong>
        </div>
      </div>

      <!-- ④ Macro Result -->
      <div class="ng-plan-label" style="margin-top:14px">④ สารอาหาร (TBW × Multiplier)</div>
      <div class="tbw-macro-box">
        <div class="tbw-mr-row tbw-mr-p">
          <div class="tbw-mr-ic">🥩</div>
          <div class="tbw-mr-body">
            <div class="tbw-mr-nm">โปรตีน <span class="tbw-mr-fm">TBW × ${tpl.prot_g_lb} g/lb</span></div>
            <div class="tbw-mr-vl">${macros.protG}g = ${macros.protCal} kcal</div>
          </div>
        </div>
        <div class="tbw-mr-row tbw-mr-f">
          <div class="tbw-mr-ic">🥑</div>
          <div class="tbw-mr-body" style="flex:1">
            <div class="tbw-mr-nm">ไขมัน <span class="tbw-mr-fm">TBW × <span id="fat-mult">${S.fatMult}</span> g/lb (เลื่อนได้)</span></div>
            <input type="range" class="ng-slider-sm" min="0.4" max="0.7" step="0.05" value="${S.fatMult}"
              oninput="document.getElementById('fat-mult').textContent=this.value;window.nutritionGuideModule._tbwSet('fatMult',+this.value)">
            <div class="tbw-mr-vl">${macros.fatG}g = ${macros.fatCal} kcal <span class="tbw-mr-hint">0.4 คาร์บสูง ↔ 0.7 ไขมันสูง</span></div>
          </div>
        </div>
        <div class="tbw-mr-row tbw-mr-c">
          <div class="tbw-mr-ic">🍞</div>
          <div class="tbw-mr-body">
            <div class="tbw-mr-nm">คาร์บ <span class="tbw-mr-fm">${macros.adjCal} − ${macros.protCal} − ${macros.fatCal} kcal</span></div>
            <div class="tbw-mr-vl">${macros.carbG}g = ${macros.carbCal} kcal</div>
          </div>
        </div>
        <div class="tbw-pct-row">
          <div class="tbw-pct-bar" style="background:linear-gradient(to right,#38bdf8 ${Math.round(macros.protCal/macros.adjCal*100)}%,#fbbf24 ${Math.round(macros.protCal/macros.adjCal*100)}% ${Math.round((macros.protCal+macros.carbCal)/macros.adjCal*100)}%,#f87171 ${Math.round((macros.protCal+macros.carbCal)/macros.adjCal*100)}%)"></div>
          <div class="tbw-pct-legend">
            <span style="color:#38bdf8">P ${Math.round(macros.protCal/macros.adjCal*100)}%</span>
            <span style="color:#fbbf24">C ${Math.round(macros.carbCal/macros.adjCal*100)}%</span>
            <span style="color:#f87171">F ${Math.round(macros.fatCal/macros.adjCal*100)}%</span>
          </div>
        </div>
      </div>

      <div class="ng-science-note">📚 Aragon &amp; Schuler "The Lean Muscle Diet" (2014) Ch.5 · Matthews "Bigger Leaner Stronger" 3rd ed. (2019) · Matthews "Thinner Leaner Stronger" (2019)</div>
    </div>`;
  };

  // Set state + refresh
  window.nutritionGuideModule._tbwSet = function (key, val) {
    S[key] = val;
    this._refreshPlan();
  };

  // Refresh only the plan panel (fast, no full redraw)
  window.nutritionGuideModule._refreshPlan = function () {
    const el = document.getElementById('ng-p-plan');
    if (!el) return;
    const isVisible = el.style.display !== 'none';
    el.outerHTML = this._panelPlan();
    const newEl = document.getElementById('ng-p-plan');
    if (newEl && isVisible) newEl.style.display = '';
  };

  // Inject CSS (runs once, synchronously)
  function injectTBWCSS() {
    if (document.getElementById('ng-tbw-style')) return;
    const s = document.createElement('style');
    s.id = 'ng-tbw-style';
    s.textContent = `
      .tbw-goal-row{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-bottom:8px}
      .tbw-goal-btn{background:#0f172a;border:2px solid #334155;border-radius:12px;padding:9px 4px;cursor:pointer;text-align:center;transition:border-color .15s}
      .tbw-goal-btn.active{background:rgba(108,99,255,.1)}
      .tbw-gb-label{font-size:.78rem;font-weight:700;color:#e2e8f0;margin:3px 0 2px}
      .tbw-gb-pct{font-size:.6rem;color:#64748b;margin-bottom:2px}
      .tbw-gb-adj{font-size:.68rem;font-weight:700}
      .tbw-tip{font-size:.74rem;color:#94a3b8;background:#0f172a;border-left:3px solid #6c63ff;border-radius:0 8px 8px 0;padding:8px 10px;line-height:1.6;margin-bottom:4px}
      .tbw-step{background:#0f172a;border-radius:12px;padding:12px;margin-bottom:8px}
      .tbw-step-result{border:2px solid #6c63ff;background:rgba(108,99,255,.07)}
      .tbw-step-hd{display:flex;align-items:center;gap:8px;font-size:.82rem;font-weight:700;color:#e2e8f0;margin-bottom:10px}
      .tbw-sn{background:#6c63ff;color:#fff;border-radius:50%;width:22px;height:22px;min-width:22px;display:flex;align-items:center;justify-content:center;font-size:.72rem;font-weight:700}
      .tbw-grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:8px}
      .tbw-fl{font-size:.72rem;color:#64748b;margin-bottom:4px}.tbw-fl strong{color:#94a3b8}
      .tbw-fv{font-size:.88rem;font-weight:700;color:#e2e8f0}
      .tbw-hint{font-size:.65rem;color:#475569;margin-top:3px}
      .tbw-calc-row{font-size:.76rem;color:#a5b4fc;background:rgba(108,99,255,.1);border-radius:6px;padding:5px 8px}
      .tbw-calc-row strong{color:#c4b5fd}
      .tbw-big{font-size:1.7rem;font-weight:700;color:#a78bfa;margin:4px 0 0}
      .tbw-big-unit{font-size:.9rem;color:#64748b;font-weight:400;margin-left:2px}
      .tbw-delta{font-size:.78rem;color:#94a3b8;margin-top:4px}
      .tbw-cal-box{background:#0f172a;border-radius:12px;padding:12px}
      .tbw-int-btn{flex:1;padding:5px 8px;border-radius:8px;border:1px solid #334155;background:#1e1e35;color:#94a3b8;font-size:.73rem;cursor:pointer;font-weight:600}
      .tbw-int-btn.active{background:#f59e0b;border-color:#f59e0b;color:#0f172a}
      .tbw-formula-eq{font-size:.82rem;color:#94a3b8;margin-top:10px;padding:7px 10px;background:rgba(108,99,255,.08);border-radius:8px}
      .tbw-formula-eq strong{color:#a78bfa;font-size:.95rem}
      .tbw-adj-line{font-size:.82rem;margin-top:5px;padding:6px 10px;background:rgba(34,197,94,.07);border-radius:8px;font-weight:600}
      .tbw-adj-line strong{font-size:1rem}
      .tbw-macro-box{background:#0f172a;border-radius:12px;padding:12px}
      .tbw-mr-row{display:flex;gap:10px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,.06);align-items:flex-start}
      .tbw-mr-row:last-of-type{border-bottom:none}
      .tbw-mr-ic{font-size:1.35rem;padding-top:3px;flex-shrink:0}
      .tbw-mr-nm{font-size:.82rem;font-weight:600;color:#cbd5e1;margin-bottom:3px}
      .tbw-mr-fm{font-size:.65rem;color:#475569;font-weight:400;margin-left:4px}
      .tbw-mr-vl{font-size:.95rem;font-weight:700;margin-top:2px}
      .tbw-mr-hint{font-size:.65rem;color:#475569;font-weight:400;margin-left:5px}
      .tbw-mr-p .tbw-mr-vl{color:#38bdf8}
      .tbw-mr-f .tbw-mr-vl{color:#f87171}
      .tbw-mr-c .tbw-mr-vl{color:#fbbf24}
      .tbw-pct-row{margin-top:10px}
      .tbw-pct-bar{height:8px;border-radius:6px;margin-bottom:5px}
      .tbw-pct-legend{display:flex;justify-content:space-around;font-size:.72rem;font-weight:700}
      .ng-slider-sm{width:100%;accent-color:#f87171;margin:4px 0;height:18px}
    `;
    document.head.appendChild(s);
  }

  if (document.head) injectTBWCSS();
  else document.addEventListener('DOMContentLoaded', injectTBWCSS);

})();
