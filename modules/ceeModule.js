// modules/ceeModule.js
// Constrained Total Energy Expenditure adjustment (Pontzer et al. 2012, 2016)
//
// Key finding: when exercise increases, the body compensates by reducing other
// metabolic costs (inflammation, stress response, reproductive hormones).
// So the NET increase in daily energy expenditure is less than the exercise kcal
// calculated by naive kcal/min × minutes formulas.

class CEEModule {

  constructor() {
    this._firstShown = !!localStorage.getItem('shg-cee-first-shown');
  }

  _loadFactor(burnedSoFar) {
    if (burnedSoFar < 150) return 1.00;
    if (burnedSoFar < 300) return 0.90;
    if (burnedSoFar < 500) return 0.80;
    return 0.70;
  }

  _adaptFactor(streak) {
    if (streak <= 2)  return 1.00;
    if (streak <= 6)  return 0.93;
    if (streak <= 13) return 0.85;
    return 0.72; // Hadza long-term equilibrium (Pontzer 2012)
  }

  getStreakDays() {
    try {
      const recent = historyModule.getRecent(21);
      let streak = 0;
      for (let i = recent.length - 1; i >= 0; i--) {
        if ((recent[i].exerciseMin || 0) >= 20) streak++;
        else break;
      }
      return streak;
    } catch { return 0; }
  }

  getEfficiency(burnedSoFar) {
    const todayBurned = (burnedSoFar !== undefined)
      ? burnedSoFar
      : ((window.hungerModule && hungerModule.caloriesBurned) || 0);
    const streak = this.getStreakDays();
    const raw = this._loadFactor(todayBurned) * this._adaptFactor(streak);
    return Math.max(0.40, +raw.toFixed(2));
  }

  adjustBurn(rawKcal, burnedSoFar) {
    return Math.round(rawKcal * this.getEfficiency(burnedSoFar));
  }

  getStatus() {
    const streak = this.getStreakDays();
    const eff = this.getEfficiency();
    const pct = Math.round(eff * 100);
    if (eff >= 0.97) return { pct, label: 'เต็มประสิทธิภาพ',        color: '#22c55e', streak };
    if (eff >= 0.88) return { pct, label: `ปรับตัว ${streak} วัน`, color: '#a3e635', streak };
    if (eff >= 0.78) return { pct, label: 'ชดเชยปานกลาง',           color: '#fbbf24', streak };
    if (eff >= 0.65) return { pct, label: 'ชดเชยสูง',               color: '#f97316', streak };
    return              { pct, label: 'Hadza Level',                 color: '#ef4444', streak };
  }

  // Human-readable toast note shown after CEE adjustment
  toastNote(rawKcal, effectKcal) {
    const diff = rawKcal - effectKcal;
    if (diff < 15) return '';
    const s = this.getStatus();
    return ` · 🔬 ร่างกายชดเชย ${diff} kcal (CEE ${s.pct}%)`;
  }

  // Show first-time educational card if CEE is active and not yet shown
  maybeShowFirstTime(rawKcal, effectKcal) {
    if (this._firstShown) return;
    if (rawKcal - effectKcal < 20) return;
    this._firstShown = true;
    localStorage.setItem('shg-cee-first-shown', '1');
    // Delay slightly so the exercise toast appears first
    setTimeout(() => this._showFirstTimeCard(), 1800);
  }

  _showFirstTimeCard() {
    this._injectCSS();
    const s = this.getStatus();
    const streak = this.getStreakDays();
    const wrap = document.createElement('div');
    wrap.id = 'cee-first-overlay';
    wrap.onclick = e => { if (e.target === wrap) this._closeFirst(); };
    wrap.innerHTML = `
      <div class="cee-sheet">
        <div class="cee-head">
          <span style="font-size:1.6rem">🔬</span>
          <div>
            <div class="cee-title">ทำไมตัวเลขถึงต่างจากที่คาด?</div>
            <div class="cee-sub">Constrained Energy Expenditure</div>
          </div>
          <button class="cee-x" onclick="ceeModule._closeFirst()">✕</button>
        </div>

        <div class="cee-body">
          <p class="cee-p">แอปของคุณใช้ <strong>สมการ CEE (Constrained Total Energy Expenditure)</strong> จากงานวิจัยของ Herman Pontzer, PhD (Duke University, 2012) ซึ่งเผยแพร่ใน <em>PLOS ONE</em></p>

          <div class="cee-finding">
            <div class="cee-finding-icon">🏹</div>
            <div>
              <div class="cee-finding-title">การค้นพบ: ชนเผ่า Hadza แทนซาเนีย</div>
              <div class="cee-finding-body">นักล่าสัตว์ Hadza เดินวันละ 16,000 ก้าว ออกกำลังหนักกว่าคนนั่งโต๊ะ 3 เท่า — แต่ใช้พลังงานรวมต่อวัน <strong>เท่ากัน</strong> เพราะร่างกายชดเชยโดยลดพลังงานที่ใช้ไปกับ:</div>
              <div class="cee-chips">
                <span class="cee-chip">🔥 การอักเสบ</span>
                <span class="cee-chip">😤 ความเครียด</span>
                <span class="cee-chip">⚗️ ฮอร์โมน</span>
                <span class="cee-chip">🛡️ ระบบภูมิคุ้มกัน</span>
              </div>
            </div>
          </div>

          <div class="cee-meter-wrap">
            <div class="cee-meter-label">CEE ของคุณตอนนี้</div>
            <div class="cee-meter-bar">
              <div class="cee-meter-fill" style="width:${s.pct}%;background:${s.color}"></div>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:.72rem;color:#64748b;margin-top:4px">
              <span>ประสิทธิภาพ 0%</span>
              <span style="color:${s.color};font-weight:700">${s.pct}% — ${s.label}</span>
              <span>100%</span>
            </div>
            ${streak > 0 ? `<div class="cee-streak-note">ออกกำลังกาย ${streak} วันติดต่อกัน ร่างกายเริ่มปรับตัว</div>` : ''}
          </div>

          <div class="cee-good-news">
            <div style="font-weight:700;color:#4ade80;margin-bottom:6px">✅ ข่าวดี: CEE คือสัญญาณสุขภาพดี!</div>
            <div style="font-size:.8rem;color:#94a3b8;line-height:1.65">
              ที่ตัวเลขลดลง ไม่ใช่เพราะออกกำลังน้อยลง แต่เพราะร่างกายประหยัดพลังงานที่เคยเสียไปกับการอักเสบเรื้อรังและความเครียด — เปลี่ยนมาใช้สนับสนุนการออกกำลังกายแทน นี่คือเหตุผลที่ผู้ที่ออกกำลังสม่ำเสมอ <strong>สุขภาพดีกว่า มะเร็งน้อยกว่า หัวใจแข็งแรงกว่า</strong> แม้ตัวเลข TDEE จะไม่ต่างกันมาก
            </div>
          </div>
        </div>

        <div class="cee-footer">
          <button class="cee-btn-more" onclick="ceeModule._closeFirst();if(window.nutritionGuideModule){nutritionGuideModule.openModal();setTimeout(()=>nutritionGuideModule.switchTab('burn'),100)}">📖 อ่านต่อ: วิทยาศาสตร์ทั้งหมด</button>
          <button class="cee-btn-ok" onclick="ceeModule._closeFirst()">เข้าใจแล้ว!</button>
        </div>
      </div>`;
    document.body.appendChild(wrap);
  }

  _closeFirst() {
    const el = document.getElementById('cee-first-overlay');
    if (el) el.remove();
  }

  // Tappable badge popup — compact explanation
  showInfo() {
    this._injectCSS();
    if (document.getElementById('cee-info-overlay')) return;
    const s = this.getStatus();
    const streak = this.getStreakDays();
    const eff = this.getEfficiency();
    const compensated = Math.round((1 - eff) * 100);
    const wrap = document.createElement('div');
    wrap.id = 'cee-info-overlay';
    wrap.onclick = e => { if (e.target === wrap) this.closeInfo(); };
    wrap.innerHTML = `
      <div class="cee-sheet cee-sheet-sm">
        <div class="cee-head">
          <span style="font-size:1.4rem">🔬</span>
          <div>
            <div class="cee-title">CEE — ร่างกายชดเชยพลังงาน</div>
            <div class="cee-sub">Constrained Total Energy Expenditure</div>
          </div>
          <button class="cee-x" onclick="ceeModule.closeInfo()">✕</button>
        </div>
        <div class="cee-body">
          <div class="cee-meter-wrap" style="margin-bottom:14px">
            <div class="cee-meter-bar">
              <div class="cee-meter-fill" style="width:${s.pct}%;background:${s.color}"></div>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:.72rem;color:#64748b;margin-top:4px">
              <span>ประสิทธิภาพ CEE</span>
              <span style="color:${s.color};font-weight:700">${s.pct}% ${s.label}</span>
            </div>
          </div>

          <div class="cee-row-facts">
            <div class="cee-fact"><div class="cee-fact-val" style="color:${s.color}">${s.pct}%</div><div class="cee-fact-label">ประสิทธิภาพ</div></div>
            <div class="cee-fact"><div class="cee-fact-val" style="color:#f97316">${compensated}%</div><div class="cee-fact-label">ร่างกายชดเชย</div></div>
            <div class="cee-fact"><div class="cee-fact-val" style="color:#38bdf8">${streak}</div><div class="cee-fact-label">วันติดต่อกัน</div></div>
          </div>

          <p class="cee-p" style="margin-top:12px">เมื่อคุณออกกำลังกายมากขึ้น ร่างกายลดพลังงานที่ใช้กับ <strong>การอักเสบ ความเครียด และฮอร์โมน</strong> เพื่อชดเชย ทำให้พลังงานรวมต่อวันไม่ได้เพิ่มขึ้นเท่าที่คำนวณแบบดิบ</p>
          <p class="cee-p" style="color:#4ade80"><strong>ข่าวดี:</strong> นี่แปลว่าร่างกายกำลังทำงานอย่างชาญฉลาด และสุขภาพของคุณกำลังดีขึ้น!</p>
          <div class="cee-source">📚 Pontzer et al. (2012) PLOS ONE · "Burn" (2021) Penguin</div>
        </div>
        <div class="cee-footer">
          <button class="cee-btn-more" onclick="ceeModule.closeInfo();if(window.nutritionGuideModule){nutritionGuideModule.openModal();setTimeout(()=>nutritionGuideModule.switchTab('burn'),100)}">📖 วิทยาศาสตร์เพิ่มเติม</button>
          <button class="cee-btn-ok" onclick="ceeModule.closeInfo()">ปิด</button>
        </div>
      </div>`;
    document.body.appendChild(wrap);
  }

  closeInfo() {
    const el = document.getElementById('cee-info-overlay');
    if (el) el.remove();
  }

  _injectCSS() {
    if (document.getElementById('cee-style')) return;
    const s = document.createElement('style');
    s.id = 'cee-style';
    s.textContent = `
      #cee-first-overlay,#cee-info-overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:1100;display:flex;align-items:flex-end}
      .cee-sheet{background:#1e1e2e;border-radius:22px 22px 0 0;width:100%;max-height:90vh;overflow-y:auto;padding:20px 16px 36px}
      .cee-sheet-sm{max-height:75vh}
      .cee-head{display:flex;align-items:flex-start;gap:10px;margin-bottom:16px}
      .cee-title{font-size:1rem;font-weight:700;color:#e2e8f0}
      .cee-sub{font-size:.72rem;color:#64748b;margin-top:2px;font-style:italic}
      .cee-x{margin-left:auto;background:none;border:none;font-size:1.3rem;cursor:pointer;color:#64748b;padding:0 4px;flex-shrink:0}
      .cee-body{}
      .cee-p{font-size:.82rem;color:#94a3b8;line-height:1.65;margin-bottom:12px}
      .cee-p strong{color:#cbd5e1}
      .cee-finding{display:flex;gap:12px;background:#0f172a;border-radius:14px;padding:14px;margin-bottom:14px}
      .cee-finding-icon{font-size:1.8rem;flex-shrink:0;line-height:1}
      .cee-finding-title{font-size:.88rem;font-weight:700;color:#e2e8f0;margin-bottom:5px}
      .cee-finding-body{font-size:.78rem;color:#94a3b8;line-height:1.6;margin-bottom:8px}
      .cee-finding-body strong{color:#fbbf24}
      .cee-chips{display:flex;flex-wrap:wrap;gap:5px}
      .cee-chip{font-size:.72rem;background:#1e293b;border:1px solid #334155;color:#94a3b8;padding:3px 8px;border-radius:20px}
      .cee-meter-wrap{background:#0f172a;border-radius:12px;padding:12px 14px;margin-bottom:12px}
      .cee-meter-label{font-size:.78rem;font-weight:600;color:#94a3b8;margin-bottom:8px}
      .cee-meter-bar{height:10px;background:#1e293b;border-radius:5px;overflow:hidden}
      .cee-meter-fill{height:100%;border-radius:5px;transition:width .4s ease}
      .cee-streak-note{font-size:.72rem;color:#64748b;margin-top:8px;text-align:center}
      .cee-good-news{background:rgba(74,222,128,.07);border:1px solid rgba(74,222,128,.2);border-radius:12px;padding:14px;margin-bottom:4px}
      .cee-row-facts{display:flex;gap:8px;margin-bottom:4px}
      .cee-fact{flex:1;background:#0f172a;border-radius:10px;padding:10px 8px;text-align:center}
      .cee-fact-val{font-size:1.3rem;font-weight:700;line-height:1.2}
      .cee-fact-label{font-size:.68rem;color:#64748b;margin-top:4px}
      .cee-source{font-size:.68rem;color:#475569;margin-top:10px;text-align:center}
      .cee-footer{display:flex;gap:8px;margin-top:16px}
      .cee-btn-more{flex:1;padding:11px;border-radius:12px;border:1px solid #3b82f6;background:transparent;color:#60a5fa;font-size:.82rem;font-weight:600;cursor:pointer}
      .cee-btn-ok{flex:1;padding:11px;border-radius:12px;border:none;background:#3b82f6;color:#fff;font-size:.82rem;font-weight:700;cursor:pointer}
    `;
    document.head.appendChild(s);
  }
}

window.ceeModule = new CEEModule();
