// modules/barcodeModule.js — Barcode Scanner via BarcodeDetector API + Open Food Facts

class BarcodeModule {
  constructor() {
    this.stream    = null;
    this.detector  = null;
    this.scanning  = false;
    this.raf       = null;
    this.lastCode  = null;
  }

  isSupported() { return typeof BarcodeDetector !== 'undefined'; }

  // ─── Open ────────────────────────────────────────────────
  async openScanner() {
    this._injectCSS();
    this._injectHTML();
    document.getElementById('bc-modal').style.display = 'flex';

    if (!this.isSupported()) {
      this._setStatus('⚠️ Browser นี้ไม่รองรับ Barcode Scanner อัตโนมัติ<br>กรุณาพิมพ์ตัวเลขบาร์โค้ดด้านล่าง', 'warn');
      document.getElementById('bc-manual-wrap').style.display = 'flex';
      return;
    }

    try {
      this.detector = new BarcodeDetector({
        formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39', 'qr_code'],
      });
      await this._startCamera();
      this._startDetection();
    } catch (err) {
      this._setStatus(`⚠️ เปิดกล้องไม่ได้: ${err.message}<br>กรุณาพิมพ์บาร์โค้ดแทน`, 'warn');
      document.getElementById('bc-manual-wrap').style.display = 'flex';
    }
  }

  // ─── Camera ──────────────────────────────────────────────
  async _startCamera() {
    this.stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
    });
    const v = document.getElementById('bc-video');
    v.srcObject = this.stream;
    await v.play();
  }

  _startDetection() {
    this.scanning = true;
    this.lastCode = null;
    this._setStatus('🔍 จ่อบาร์โค้ดให้อยู่ในกรอบสีเขียว...', 'scanning');

    const v = document.getElementById('bc-video');
    const loop = async () => {
      if (!this.scanning) return;
      try {
        const found = await this.detector.detect(v);
        if (found.length && found[0].rawValue !== this.lastCode) {
          this.lastCode = found[0].rawValue;
          this._onFound(found[0].rawValue);
          return;
        }
      } catch (_) {}
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  // ─── Found ───────────────────────────────────────────────
  _onFound(code) {
    this.scanning = false;
    cancelAnimationFrame(this.raf);
    if (navigator.vibrate) navigator.vibrate([80, 40, 80]);
    this._setStatus(`✅ พบบาร์โค้ด: <b>${code}</b><br>🔎 กำลังค้นหาข้อมูลสินค้า...`, 'found');
    this._lookup(code);
  }

  // ─── API Lookup ──────────────────────────────────────────
  async _lookup(code) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 9000);
      const res  = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${encodeURIComponent(code)}.json`,
        { signal: ctrl.signal }
      );
      clearTimeout(timer);
      const data = await res.json();

      if (data.status !== 1 || !data.product) {
        this._showNotFound(code); return;
      }

      const p = data.product;
      const n = p.nutriments || {};
      const servingG = this._parseGrams(p.serving_size) || 100;
      const mult     = servingG / 100;

      const kcal100  = n['energy-kcal_100g'] ?? (n['energy_100g'] ? n['energy_100g'] / 4.184 : null);
      const kcal     = kcal100  != null ? Math.round(kcal100  * mult) : null;
      const protein  = n['proteins_100g']      != null ? +(n['proteins_100g']      * mult).toFixed(1) : null;
      const carbs    = n['carbohydrates_100g'] != null ? +(n['carbohydrates_100g'] * mult).toFixed(1) : null;
      const fat      = n['fat_100g']           != null ? +(n['fat_100g']           * mult).toFixed(1) : null;

      const name = p.product_name_th || p.product_name || p.product_name_en || `สินค้า (${code})`;
      const img  = p.image_front_small_url || p.image_url || null;

      this._showResult({ code, name, kcal, protein, carbs, fat, servingG, img });

    } catch (err) {
      const msg = err.name === 'AbortError'
        ? '⏱ หมดเวลา — ตรวจสอบสัญญาณอินเทอร์เน็ต'
        : '❌ เกิดข้อผิดพลาด — ลองพิมพ์บาร์โค้ดแทน';
      this._setStatus(msg, 'warn');
      document.getElementById('bc-manual-wrap').style.display = 'flex';
      document.getElementById('bc-manual-input').value = code;
    }
  }

  _parseGrams(str) {
    if (!str) return null;
    const m = String(str).match(/(\d+(?:\.\d+)?)\s*g/i);
    return m ? parseFloat(m[1]) : null;
  }

  // ─── Result Card ─────────────────────────────────────────
  _showResult(p) {
    const el = document.getElementById('bc-result');
    const hasNutrition = p.kcal != null;
    el.dataset.product = JSON.stringify(p);
    el.innerHTML = `
      <div class="bc-product-card">
        ${p.img ? `<img class="bc-prod-img" src="${p.img}" loading="lazy" onerror="this.style.display='none'">` : ''}
        <div class="bc-prod-info">
          <div class="bc-prod-name">${this._esc(p.name)}</div>
          <div class="bc-prod-portion">per ${p.servingG}g · 1 serving</div>
          <div class="bc-prod-macros">
            ${p.kcal    != null ? `<span class="bc-chip bc-chip-kcal">🔥 ${p.kcal} kcal</span>` : '<span class="bc-chip bc-chip-na">kcal: ไม่ระบุ</span>'}
            ${p.protein != null ? `<span class="bc-chip">P ${p.protein}g</span>` : ''}
            ${p.carbs   != null ? `<span class="bc-chip">C ${p.carbs}g</span>` : ''}
            ${p.fat     != null ? `<span class="bc-chip">F ${p.fat}g</span>`   : ''}
          </div>
          ${!hasNutrition ? '<div class="bc-prod-warn">⚠️ ไม่มีข้อมูล kcal — กรอกเองได้หลังบันทึก</div>' : ''}
        </div>
      </div>
      <div class="bc-result-actions">
        <button class="bc-btn-confirm" onclick="barcodeModule.confirmProduct()">✅ บันทึกอาหารนี้</button>
        <button class="bc-btn-rescan"  onclick="barcodeModule.rescan()">🔄 สแกนใหม่</button>
      </div>`;
    el.style.display = 'block';
    document.getElementById('bc-status').style.display = 'none';
    document.getElementById('bc-video-wrap').style.display = 'none';
    document.getElementById('bc-manual-wrap').style.display = 'none';
  }

  _showNotFound(code) {
    this._setStatus(`❌ ไม่พบข้อมูลสินค้า (${code})<br>ลองสแกนใหม่ หรือพิมพ์บาร์โค้ดเพื่อลองอีกครั้ง`, 'warn');
    document.getElementById('bc-video-wrap').style.display = 'none';
    document.getElementById('bc-manual-wrap').style.display = 'flex';
    document.getElementById('bc-manual-input').value = code;
  }

  // ─── Actions ─────────────────────────────────────────────
  confirmProduct() {
    const el = document.getElementById('bc-result');
    const p  = JSON.parse(el.dataset.product || '{}');
    this._fill(p);
    this.closeScanner();
    if (window.showToast) showToast(`📷 เพิ่ม "${p.name}" จาก Barcode แล้ว`, 'success');
  }

  rescan() {
    const el = document.getElementById('bc-result');
    el.style.display = 'none';
    el.innerHTML = '';
    document.getElementById('bc-video-wrap').style.display = 'block';
    document.getElementById('bc-status').style.display    = 'block';
    this.lastCode = null;
    this._startDetection();
  }

  submitManual() {
    const code = (document.getElementById('bc-manual-input')?.value || '').trim();
    if (!code) return;
    document.getElementById('bc-manual-wrap').style.display = 'none';
    this._setStatus(`🔎 กำลังค้นหา "${code}"...`, 'scanning');
    this._lookup(code);
  }

  closeScanner() {
    this.scanning = false;
    cancelAnimationFrame(this.raf);
    if (this.stream) { this.stream.getTracks().forEach(t => t.stop()); this.stream = null; }
    document.getElementById('bc-modal')?.remove();
    this.lastCode = null;
  }

  // ─── Fill Form ───────────────────────────────────────────
  _fill(p) {
    const set = (id, val) => { const el = document.getElementById(id); if (el && val != null) el.value = val; };
    set('food-log-name',    p.name);
    set('food-log-kcal',    p.kcal    ?? '');
    set('food-log-protein', p.protein ?? '');
    set('food-log-carbs',   p.carbs   ?? '');
    set('food-log-fat',     p.fat     ?? '');
    const drop = document.getElementById('food-search-dropdown');
    if (drop) drop.style.display = 'none';
  }

  // ─── Helpers ─────────────────────────────────────────────
  _setStatus(html, type = '') {
    const el = document.getElementById('bc-status');
    if (!el) return;
    el.innerHTML = html;
    el.className = `bc-status bc-status-${type}`;
    el.style.display = 'block';
  }

  _esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }

  // ─── CSS ─────────────────────────────────────────────────
  _injectCSS() {
    if (document.getElementById('bc-style')) return;
    const s = document.createElement('style');
    s.id = 'bc-style';
    s.textContent = `
/* ── Modal overlay ── */
#bc-modal {
  position: fixed; inset: 0; z-index: 9000;
  background: rgba(0,0,0,.92);
  display: none; flex-direction: column; align-items: center; justify-content: flex-start;
  padding: 0;
}
.bc-header {
  width: 100%; display: flex; align-items: center; justify-content: space-between;
  padding: 14px 16px 10px; flex-shrink: 0;
}
.bc-header-title { font-size: 16px; font-weight: 800; color: #fff; }
.bc-close-btn {
  background: rgba(255,255,255,.12); border: none; border-radius: 50%;
  width: 36px; height: 36px; color: #fff; font-size: 18px;
  display: flex; align-items: center; justify-content: center; cursor: pointer;
}

/* ── Video ── */
#bc-video-wrap {
  position: relative; width: 100%; max-width: 480px;
  aspect-ratio: 4/3; background: #000; overflow: hidden;
}
#bc-video { width: 100%; height: 100%; object-fit: cover; display: block; }
.bc-reticle {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
  width: 64%; max-width: 240px; aspect-ratio: 2/1;
  border: 2px solid #4ade80; border-radius: 8px;
  box-shadow: 0 0 0 1000px rgba(0,0,0,.45);
  pointer-events: none;
}
.bc-reticle-corner {
  position: absolute; width: 18px; height: 18px; border-color: #4ade80; border-style: solid;
}
.bc-reticle-corner.tl { top:-1px; left:-1px;  border-width: 3px 0 0 3px; border-radius:6px 0 0 0; }
.bc-reticle-corner.tr { top:-1px; right:-1px; border-width: 3px 3px 0 0; border-radius:0 6px 0 0; }
.bc-reticle-corner.bl { bottom:-1px; left:-1px;  border-width: 0 0 3px 3px; border-radius:0 0 0 6px; }
.bc-reticle-corner.br { bottom:-1px; right:-1px; border-width: 0 3px 3px 0; border-radius:0 0 6px 0; }

/* ── Status ── */
.bc-status {
  width: 100%; max-width: 480px; padding: 12px 16px;
  font-size: 13px; line-height: 1.5; text-align: center; border-radius: 0;
}
.bc-status-scanning { color: #86efac; }
.bc-status-found    { color: #4ade80; }
.bc-status-warn     { color: #fbbf24; }

/* ── Manual entry ── */
#bc-manual-wrap {
  display: none; align-items: center; gap: 8px;
  padding: 10px 16px; width: 100%; max-width: 480px;
}
#bc-manual-input {
  flex: 1; background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.2);
  border-radius: 10px; color: #fff; font-size: 15px; padding: 10px 12px;
  outline: none;
}
#bc-manual-input::placeholder { color: rgba(255,255,255,.35); }
.bc-manual-go {
  background: #4ade80; color: #000; border: none; border-radius: 10px;
  font-size: 13px; font-weight: 800; padding: 10px 14px; cursor: pointer; white-space: nowrap;
}

/* ── Result card ── */
#bc-result { display: none; width: 100%; max-width: 480px; padding: 12px 16px; }
.bc-product-card {
  background: rgba(255,255,255,.07); border-radius: 14px; padding: 14px;
  display: flex; gap: 12px; margin-bottom: 12px;
}
.bc-prod-img { width: 72px; height: 72px; object-fit: cover; border-radius: 10px; flex-shrink: 0; }
.bc-prod-info { flex: 1; min-width: 0; }
.bc-prod-name { font-size: 14px; font-weight: 700; color: #fff; line-height: 1.3; margin-bottom: 3px; }
.bc-prod-portion { font-size: 11px; color: rgba(255,255,255,.45); margin-bottom: 7px; }
.bc-prod-macros { display: flex; flex-wrap: wrap; gap: 5px; }
.bc-chip {
  font-size: 11px; font-weight: 600; padding: 3px 8px;
  background: rgba(255,255,255,.1); border-radius: 20px; color: #e2e8f0;
}
.bc-chip-kcal { background: rgba(239,68,68,.25); color: #fca5a5; }
.bc-chip-na   { background: rgba(251,191,36,.15); color: #fde68a; }
.bc-prod-warn { font-size: 11px; color: #fbbf24; margin-top: 6px; }
.bc-result-actions { display: flex; gap: 8px; }
.bc-btn-confirm {
  flex: 2; background: linear-gradient(135deg,#22c55e,#16a34a); border: none;
  border-radius: 12px; color: #fff; font-size: 14px; font-weight: 800;
  padding: 13px; cursor: pointer;
}
.bc-btn-rescan {
  flex: 1; background: rgba(255,255,255,.1); border: none;
  border-radius: 12px; color: #e2e8f0; font-size: 13px; font-weight: 700;
  padding: 13px; cursor: pointer;
}

/* ── Scan button (inline in food form) ── */
.bc-scan-trigger {
  background: rgba(74,222,128,.15); border: 1px solid rgba(74,222,128,.3);
  border-radius: 10px; color: #4ade80; font-size: 18px;
  width: 42px; height: 42px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: background .15s;
}
.bc-scan-trigger:hover { background: rgba(74,222,128,.25); }
.food-search-wrap { flex: 1; }
`;
    document.head.appendChild(s);
  }

  // ─── HTML ────────────────────────────────────────────────
  _injectHTML() {
    if (document.getElementById('bc-modal')) return;
    const div = document.createElement('div');
    div.id = 'bc-modal';
    div.innerHTML = `
      <div class="bc-header">
        <span class="bc-header-title">📷 สแกน Barcode อาหาร</span>
        <button class="bc-close-btn" onclick="barcodeModule.closeScanner()">✕</button>
      </div>
      <div id="bc-video-wrap">
        <video id="bc-video" playsinline muted></video>
        <div class="bc-reticle">
          <div class="bc-reticle-corner tl"></div>
          <div class="bc-reticle-corner tr"></div>
          <div class="bc-reticle-corner bl"></div>
          <div class="bc-reticle-corner br"></div>
        </div>
      </div>
      <div class="bc-status" id="bc-status" style="display:none"></div>
      <div id="bc-manual-wrap">
        <input type="number" id="bc-manual-input" placeholder="พิมพ์ตัวเลขบาร์โค้ด เช่น 8850329200012" inputmode="numeric">
        <button class="bc-manual-go" onclick="barcodeModule.submitManual()">ค้นหา</button>
      </div>
      <div id="bc-result"></div>`;
    document.body.appendChild(div);
  }
}

window.barcodeModule = new BarcodeModule();
